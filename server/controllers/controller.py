from flask import Flask, request, jsonify
import os
import io
import json
import requests
from werkzeug.utils import secure_filename
import pdf_parser  # Equivalent to pdf-parse
from mail_sender import send_mail  # Equivalent to mailSender utility
from status_update import generate_status_update  # Equivalent to statusUpdate template
from models.bailout import Bailout  # Assuming you have a Python ORM model
from models.user import User  # Assuming you have a Python ORM model
import tempfile
import uuid
from appwrite.client import Client
from appwrite.services.storage import Storage
from appwrite.id import ID
from appwrite.input_file import InputFile
import datetime

app = Flask(__name__)

# Configure upload folder
UPLOAD_FOLDER = 'temp_uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Appwrite configuration
def get_appwrite_client():
    client = Client()
    client.set_endpoint(os.environ.get('APPWRITE_ENDPOINT'))
    client.set_project(os.environ.get('APPWRITE_PROJECT_ID'))
    client.set_key(os.environ.get('APPWRITE_API_KEY'))
    return client

def send_status_email(email, status, application_no, judge_license):
    try:
        mail_response = send_mail(
            email, 
            "Status Update", 
            generate_status_update(status, application_no, judge_license)
        )
        print("Email sent successfully:", mail_response)
    except Exception as error:
        print("Error occurred while sending mails:", error)
        raise error

def upload_to_appwrite(file):
    try:
        client = get_appwrite_client()
        storage = Storage(client)
        
        if not file:
            raise ValueError("Invalid file input")

        # Save the file temporarily
        filename = secure_filename(file.filename)
        temp_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(temp_path)
        
        # Upload to Appwrite
        with open(temp_path, 'rb') as file_data:
            response = storage.create_file(
                bucket_id=os.environ.get('APPWRITE_BUCKET_ID'),
                file_id=ID.unique(),
                file=InputFile.from_path(temp_path)
            )
        
        # Clean up temp file
        os.remove(temp_path)
        
        # Get the file URL
        file_url = storage.get_file_view(
            bucket_id=os.environ.get('APPWRITE_BUCKET_ID'),
            file_id=response['$id']
        )
        
        return file_url
    except Exception as e:
        print(f"Error uploading to Appwrite: {str(e)}")
        raise e

@app.route('/api/create-application', methods=['POST'])
def create_application():
    try:
        # Get form data
        jurisdiction = request.form.get('jurisdiction')
        license = request.form.get('license')
        judge_license = request.form.get('judgeLicense')
        case_details_text = request.form.get('caseDetails')
        
        # Get files
        application_file = request.files.get('application')
        
        print("REQUEST FILES:", request.files)
        print("Application File:", application_file)
        
        if not jurisdiction or not application_file or not license or not judge_license:
            return jsonify({
                'success': False,
                'message': "All fields are required, please try again"
            }), 400
        
        # Process application PDF
        application_buffer = io.BytesIO(application_file.read())
        application_text_data = pdf_parser.load(application_buffer)
        application_text = application_text_data.text
        
        # Reset file pointer for upload
        application_file.seek(0)
        
        # Process case details if it's a file
        if not case_details_text:
            case_details_file = request.files.get('caseDetails')
            if not case_details_file:
                return jsonify({
                    'success': False,
                    'message': "Case details file is required"
                }), 400
            
            case_details_buffer = io.BytesIO(case_details_file.read())
            case_details_data = pdf_parser.load(case_details_buffer)
            case_details_text = case_details_data.text
            print("Text Response:", case_details_text)
        
        print("Processing completed ------------")
        
        # Upload application to Appwrite
        application_pdf_url = upload_to_appwrite(application_file)
        application_no = int(datetime.datetime.now().timestamp() * 1000)  # Equivalent to Date.now()
        
        # Get bail summary from analysis service
        bail_summary = requests.post(
            "http://localhost:5000/bail-summary", 
            json={"applicationNo": application_no, "application": application_text}
        )
        if not bail_summary:
            return jsonify({
                'success': False,
                'message': "python flask error for backend"
            }), 404
        
        print("BAIL SUMMARY EXTRACTED")
        
        # Get previous case analysis
        previous_case = requests.post(
            "http://localhost:5000/previous-cases", 
            json={"application": case_details_text}
        )
        if not previous_case:
            return jsonify({
                'success': False,
                'message': "python flask error for backend"
            }), 404
        print("PREVIOUS CASES DONE")
        
        # Get IPC sections
        ipc_section = requests.post(
            "http://localhost:5000/ipc-sections", 
            json={"application": case_details_text}
        )
        if not ipc_section:
            return jsonify({
                'success': False,
                'message': "python flask error for backend"
            }), 404
        print("IPC SECTIONS DONE")
        
        # Get criminal records
        criminal_case = requests.post(
            "http://localhost:5000/criminal-records", 
            json={"application": case_details_text}
        )
        if not criminal_case:
            return jsonify({
                'success': False,
                'message': "python flask error for backend"
            }), 404
        
        print("CRIMINAL CASES DONE")
        
        # Create bailout record
        bail_apply = Bailout.create(
            application_no=application_no,
            jurisdiction=jurisdiction,
            case_details=case_details_text,
            application=application_pdf_url,
            lawyer=license,
            judge_license=judge_license,
            application_text=application_text,
            bail_summary=bail_summary.json(),
            previous_case=previous_case.json(),
            ipc_section=ipc_section.json(),
            criminal_case=criminal_case.json()
        )
        
        return jsonify({
            'success': True,
            'message': "Bail Applied successfully"
        }), 200
    
    except Exception as err:
        print("Error while creating application", err)
        return jsonify({
            'success': False,
            'message': "Couldn't create application"
        }), 500

@app.route('/api/get-lawyer-bail', methods=['POST'])
def get_lawyer_bail():
    try:
        data = request.json
        license = data.get('license')
        
        if not license:
            return jsonify({
                'success': False,
                'message': "license not found"
            }), 404
        
        bail_data = Bailout.find(lawyer=license)
        
        if not bail_data:
            bail_data = []
        
        return jsonify({
            'success': True,
            'message': "successfully fetched all the applications",
            'bailData': bail_data
        }), 200
    
    except Exception as err:
        print(err)
        return jsonify({
            'success': False,
            'message': "couldn't get lawyer bail applications"
        }), 500

@app.route('/api/get-judge-bail', methods=['POST'])
def get_judge_bail():
    try:
        data = request.json
        judge_license = data.get('judgeLicense')
        print("JUDGE LICENSE:", judge_license)
        
        if not judge_license:
            return jsonify({
                'success': False,
                'message': "license not found"
            }), 404
        
        # Equivalent to MongoDB find with projection
        bail_data = Bailout.find(
            judge_license=judge_license,
            fields=['created_at', 'application_no', 'status', 'jurisdiction', 'lawyer', 'application']
        )
        
        if not bail_data:
            bail_data = []
        
        return jsonify({
            'success': True,
            'message': "successfully fetched all the applications",
            'bailData': bail_data
        }), 200
    
    except Exception as err:
        print(err)
        return jsonify({
            'success': False,
            'message': "couldn't get judge bail applications"
        }), 500

@app.route('/api/change-status', methods=['POST'])
def change_status():
    try:
        data = request.json
        application_no = data.get('applicationNo')
        status = data.get('status')
        print("REQUEST BODY:", data)
        
        if not application_no or not status:
            return jsonify({
                'success': False,
                'message': "All fields are required"
            }), 400
        
        print("STATUS CHANGE ENTRY")
        
        bail_details = Bailout.find_one(application_no=application_no)
        if not bail_details:
            return jsonify({
                'success': False,
                'message': "The bail application couldn't be found"
            }), 404
        
        print("STATUS CHANGE SEARCH")
        
        bail_details.status = status.lower()
        bail_details.save()
        
        user_detail = User.find_one(license=bail_details.lawyer)
        print("user", user_detail)
        
        # Send email notification
        send_status_email(
            user_detail.email, 
            status, 
            bail_details.application_no, 
            bail_details.judge_license
        )
        
        return jsonify({
            'success': True,
            'message': "Status updated successfully"
        }), 200
    
    except Exception as err:
        print("Error while updating status", err)
        return jsonify({
            'success': False,
            'message': "Couldn't update status"
        }), 500

@app.route('/api/bail-summary', methods=['POST'])
def bail_summary():
    try:
        data = request.json
        application_no = data.get('applicationNo')
        
        if not application_no:
            return jsonify({
                'success': False,
                'message': "Application number is required"
            }), 400
        
        bail_details = Bailout.find_one(application_no=application_no)
        if not bail_details:
            return jsonify({
                'success': False,
                'message': "Bail application not found"
            }), 404
        
        return jsonify({
            'success': True,
            'message': "Bail application found",
            'bailDetails': bail_details
        }), 200
    
    except Exception as err:
        print("Error while fetching summary", err)
        return jsonify({
            'success': False,
            'message': "Error while creating summary"
        }), 500

@app.route('/api/test-flask', methods=['POST'])
def test_flask():
    try:
        print("flask test entry")
        input_data = request.json.get('input')
        
        response = requests.post(
            "http://localhost:5000/test-llm", 
            json={"input": input_data}
        )
        
        print("flask test api ok")
        if not response:
            return jsonify({
                'success': False,
                'message': "came in express but flask dropped"
            }), 400
        
        print("flask test api response ok", response.json().get('output'))
        
        return jsonify({
            'success': True,
            'message': "done it"
        }), 200
    
    except Exception as err:
        print("error while testing flask", err)
        return jsonify({
            'success': False,
            'message': "flask error api"
        }), 500

@app.route('/api/test-chatbot', methods=['POST'])
def test_chatbot():
    try:
        data = request.json
        question = data.get('question')
        
        print("request body:", data)
        if not question:
            return jsonify({
                'success': False,
                'message': "question not given"
            }), 404
        
        response = requests.post(
            'http://localhost:5000/chatbot',
            json={"question": question},
            headers={'Content-Type': 'multipart/form-data'}
        )
        
        if not response:
            return jsonify({
                'success': False,
                'message': "Bot didn't give the response, he is annoyed :-("
            }), 404
        
        print("Response from the chatbot", response)
        
        return jsonify({
            'success': True,
            'message': "chatbot replied happily",
            'response': response.json()
        }), 200
    
    except Exception as err:
        print(err)
        return jsonify({
            'success': False,
            'message': "something went wrong"
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=3000)