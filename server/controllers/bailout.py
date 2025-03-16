from flask import Flask, Blueprint, request, jsonify
import os
import io
import json
import requests
from werkzeug.utils import secure_filename
import PyPDF2  # Equivalent to pdf-parse
from flask_mail import Mail, Message  # Equivalent to mailSender utility
from mails.statusUpdate import generate_status_update  # Equivalent to statusUpdate template
from models.model import Bailout  # Assuming you have a Python ORM model
from models.model import User  # Assuming you have a Python ORM model
import tempfile
import uuid
from appwrite.client import Client
from appwrite.services.storage import Storage
from appwrite.id import ID
from appwrite.input_file import InputFile
from datetime import datetime
from flask import current_app
import sys

#scripts imports
from scripts.crimekey import *
from scripts.ipccharged import *
from scripts.bailreckonersummary import *
from scripts.previouscaseswithsummary import *
from scripts.chatbot.chatbot import *

from config import ai

from config.database import mongo
from pymongo import MongoClient

from flask_cors import CORS


client = MongoClient(os.getenv("MONGODB_URL"))
db = client["test"]
users = db["users"]
bailout = db["bailouts"]
licenses = db["licenses"]

# Add the parent directory to the sys.path
parent_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

from langchain_community.document_loaders import PyPDFLoader
from PyPDF2 import PdfReader


bailout_bp = Blueprint('bailout', __name__)


CORS(bailout_bp)


def pdf_to_text(pdf):
    print("PDF YAHA HAI:",pdf)
    print("MAI AAYI HU")
    # creating a pdf reader object
    
    reader = PdfReader(pdf)
    print("MAI NIKAL LI HU")
    # printing number of pages in pdf file
    print(len(reader.pages))

    # getting a specific page from the pdf file
    page = reader.pages[0]
    print("WANNA BE MY CHAMMAK CHALLO")
    # extracting text from page
    text = page.extract_text()
    return str(text)


#paths
path_ipc_vector_store = "server/scripts/Bail_Saarathi/vector_database/IPC_Sections_VectorEmbeddings/"
path_case_vector_store="C:/full_St/bail-reckoner/server/scripts/Bail_Saarathi/vector_database/Case_Files_VectorEmbeddings/"

#inputs
bail="Case Record Case Title: The State vs. [Defendant's Name]  Case Number: [To Be Assigned]  Date of Incident: 12:00 AM, [Date]  Location: [Shop Name], Bangalore  Charges: Pity Theft, Robbery  Defendant: [Defendant's Name]  Address: [Defendant's Address] Occupation: [Defendant's Occupation] Age: [Defendant's Age] Gender: [Defendant's Gender] Legal Representation: [Lawyer's Name]  Chargesheet 1. Overview of the Incident:  On the night of [Date], at approximately 12:00 AM, the defendant was allegedly involved in a criminal act at [Shop Name], located in Bangalore. The incident involved the following charges:  Pity Theft: Alleged petty theft committed by the defendant. Robbery: The defendant is charged with robbery, which involved using force or intimidation to unlawfully take property from the shop. 2. Description of Charges:  a. Pity Theft:  Details of Theft: The defendant is accused of unlawfully taking small items from the shop without the consent of the shop owner. The items stolen include [List of Stolen Items, if known]. Evidence: Surveillance footage from the shop, witness testimonies, and recovered stolen items (if any). b. Robbery:  Details of Robbery: The defendant is alleged to have forcibly taken property from the shop, threatening or using intimidation against the shopkeeper or any employees present at the time. Evidence: Eyewitness accounts, surveillance footage, and any physical evidence related to the force or intimidation used. 3. Witnesses:  Witness 1: [Name, Address, Contact Information] – Eyewitness to the incident. Witness 2: [Name, Address, Contact Information] – Employee at the shop who observed the defendant’s actions. 4. Evidence:  Surveillance Footage: Video recordings showing the defendant’s actions during the incident. Physical Evidence: Items recovered from the defendant that were stolen from the shop (if applicable). Witness Statements: Statements from individuals who witnessed the crime or were present at the scene. 5. Charges Under Relevant Sections:  Pity Theft: IPC Section 378 (Theft) and any applicable local legal provisions. Robbery: IPC Section 390 (Robbery) and IPC Section 392 (Punishment for Robbery). 6. Investigation Summary:  The investigation was conducted by [Investigation Officer's Name], who gathered evidence, interviewed witnesses, and compiled the case details. The collected evidence supports the charges of petty theft and robbery.  7. Next Steps:  Court Hearing: The case is scheduled for a preliminary hearing on [Date]. Bail Status: The defendant's bail status is [Bail Granted/Denied]. Further Proceedings: The case will proceed to trial where the evidence will be presented, and a verdict will be determined based on the charges and the evidence provided. Case Prepared By: [Investigating Officer's Name] [Designation] [Date]  Approved By: [Senior Officer's Name] [Designation] [Date]  Note: This chargesheet is prepared for the purpose of formal legal proceedings and is subject to further review by the court. The defendant is presumed innocent until proven guilty in a court of law."
crime_string="Case Record Case Title: The State vs. [Defendant's Name]  Case Number: [To Be Assigned]  Date of Incident: 12:00 AM, [Date]  Location: [Shop Name], Bangalore  Charges: Pity Theft, Robbery  Defendant: [Defendant's Name]  Address: [Defendant's Address] Occupation: [Defendant's Occupation] Age: [Defendant's Age] Gender: [Defendant's Gender] Legal Representation: [Lawyer's Name]  Chargesheet 1. Overview of the Incident:  On the night of [Date], at approximately 12:00 AM, the defendant was allegedly involved in a criminal act at [Shop Name], located in Bangalore. The incident involved the following charges:  Pity Theft: Alleged petty theft committed by the defendant. Robbery: The defendant is charged with robbery, which involved using force or intimidation to unlawfully take property from the shop. 2. Description of Charges:  a. Pity Theft:  Details of Theft: The defendant is accused of unlawfully taking small items from the shop without the consent of the shop owner. The items stolen include [List of Stolen Items, if known]. Evidence: Surveillance footage from the shop, witness testimonies, and recovered stolen items (if any). b. Robbery:  Details of Robbery: The defendant is alleged to have forcibly taken property from the shop, threatening or using intimidation against the shopkeeper or any employees present at the time. Evidence: Eyewitness accounts, surveillance footage, and any physical evidence related to the force or intimidation used. 3. Witnesses:  Witness 1: [Name, Address, Contact Information] – Eyewitness to the incident. Witness 2: [Name, Address, Contact Information] – Employee at the shop who observed the defendant’s actions. 4. Evidence:  Surveillance Footage: Video recordings showing the defendant’s actions during the incident. Physical Evidence: Items recovered from the defendant that were stolen from the shop (if applicable). Witness Statements: Statements from individuals who witnessed the crime or were present at the scene. 5. Charges Under Relevant Sections:  Pity Theft: IPC Section 378 (Theft) and any applicable local legal provisions. Robbery: IPC Section 390 (Robbery) and IPC Section 392 (Punishment for Robbery). 6. Investigation Summary:  The investigation was conducted by [Investigation Officer's Name], who gathered evidence, interviewed witnesses, and compiled the case details. The collected evidence supports the charges of petty theft and robbery.  7. Next Steps:  Court Hearing: The case is scheduled for a preliminary hearing on [Date]. Bail Status: The defendant's bail status is [Bail Granted/Denied]. Further Proceedings: The case will proceed to trial where the evidence will be presented, and a verdict will be determined based on the charges and the evidence provided. Case Prepared By: [Investigating Officer's Name] [Designation] [Date]  Approved By: [Senior Officer's Name] [Designation] [Date]  Note: This chargesheet is prepared for the purpose of formal legal proceedings and is subject to further review by the court. The defendant is presumed innocent until proven guilty in a court of law."
bail_application="Case RECORD: Case Title: The State vs. [Defendant's Name]  Case Number: [To Be Assigned]  Date of Incident: 12:00 AM, [Date]  Location: [Shop Name], Bangalore  Charges: Pity Theft, Robbery  Defendant: [Defendant's Name]  Address: [Defendant's Address] Occupation: [Defendant's Occupation] Age: [Defendant's Age] Gender: [Defendant's Gender] Legal Representation: [Lawyer's Name]  Chargesheet 1. Overview of the Incident:  On the night of [Date], at approximately 12:00 AM, the defendant was allegedly involved in a criminal act at [Shop Name], located in Bangalore. The incident involved the following charges:  Pity Theft: Alleged petty theft committed by the defendant. Robbery: The defendant is charged with robbery, which involved using force or intimidation to unlawfully take property from the shop. 2. Description of Charges:  a. Pity Theft:  Details of Theft: The defendant is accused of unlawfully taking small items from the shop without the consent of the shop owner. The items stolen include [List of Stolen Items, if known]. Evidence: Surveillance footage from the shop, witness testimonies, and recovered stolen items (if any). b. Robbery:  Details of Robbery: The defendant is alleged to have forcibly taken property from the shop, threatening or using intimidation against the shopkeeper or any employees present at the time. Evidence: Eyewitness accounts, surveillance footage, and any physical evidence related to the force or intimidation used. 3. Witnesses:  Witness 1: [Name, Address, Contact Information] – Eyewitness to the incident. Witness 2: [Name, Address, Contact Information] – Employee at the shop who observed the defendant’s actions. 4. Evidence:  Surveillance Footage: Video recordings showing the defendant’s actions during the incident. Physical Evidence: Items recovered from the defendant that were stolen from the shop (if applicable). Witness Statements: Statements from individuals who witnessed the crime or were present at the scene. 5. Charges Under Relevant Sections:  Pity Theft: IPC Section 378 (Theft) and any applicable local legal provisions. Robbery: IPC Section 390 (Robbery) and IPC Section 392 (Punishment for Robbery). 6. Investigation Summary:  The investigation was conducted by [Investigation Officer's Name], who gathered evidence, interviewed witnesses, and compiled the case details. The collected evidence supports the charges of petty theft and robbery.  7. Next Steps:  Court Hearing: The case is scheduled for a preliminary hearing on [Date]. Bail Status: The defendant's bail status is [Bail Granted/Denied]. Further Proceedings: The case will proceed to trial where the evidence will be presented, and a verdict will be determined based on the charges and the evidence provided. Case Prepared By: [Investigating Officer's Name] [Designation] [Date]  Approved By: [Senior Officer's Name] [Designation] [Date]  Note: This chargesheet is prepared for the purpose of formal legal proceedings and is subject to further review by the court. The defendant is presumed innocent until proven guilty in a court of law."
bail_application_2="Case Record: Petty Robbery and Theft Case Number: CR-2457/2024 Date: August 31, 2024 Jurisdiction: Bengaluru, Karnataka, India Defendant Information: Name: Rajesh Kumar Age: 24 Gender: Male Address: No. 12, 4th Cross, Rajajinagar, Bengaluru, Karnataka Occupation: Unemployed Incident Details: Date of Incident: August 25, 2024 Time of Incident: Approximately 11:30 PM Location: Koramangala Market, Bengaluru, Karnataka Summary of Charges: Section 379 (Theft) of the Indian Penal Code (IPC): Rajesh Kumar is accused of stealing a mobile phone from the handbag of a woman, identified as Priya Mehta, while she was shopping in the market. Section 392 (Robbery) of the IPC: Rajesh Kumar allegedly used force to snatch a wallet from an elderly man, identified as Ramesh Verma, in the same market on the same evening. The wallet contained Rs. 1,200 in cash and some personal identification cards. Details of the Crime: Theft Incident: Witnesses reported that Rajesh Kumar stealthily approached Priya Mehta from behind and swiftly removed her mobile phone from her handbag while she was distracted looking at merchandise. Priya noticed her phone was missing moments later and alerted the nearby shopkeeper, but Rajesh had already blended into the crowd. Robbery Incident: Later the same evening, Rajesh Kumar was seen approaching Ramesh Verma, an elderly man, who was purchasing fruits. Rajesh forcefully grabbed Ramesh’s wallet from his back pocket. When Ramesh tried to resist, Rajesh pushed him to the ground, causing minor injuries. Rajesh then fled the scene. Arrest and Investigation: Date of Arrest: August 26, 2024 Arresting Officer: Sub-Inspector Deepak Singh, Koramangala Police Station Evidence Collected: CCTV footage from a nearby store showing Rajesh Kumar snatching the wallet. The stolen mobile phone was recovered from Rajesh's possession upon arrest. Rs. 900 of the stolen cash was recovered, while Rs. 300 had allegedly been spent. Witness Statements: Priya Mehta (Theft Victim): “I felt someone brush against me, but I thought it was just a crowded market. A few minutes later, I realized my phone was gone. I saw a man walking away hurriedly but couldn't see his face clearly.” Ramesh Verma (Robbery Victim): “I was paying for fruits when I felt a sharp tug at my pocket. Before I could react, I was pushed to the ground. The young man took my wallet and ran. I tried to call for help, but he was too quick.” Shopkeeper (Eyewitness): “I saw a young man behaving suspiciously near the lady’s bag. After a few seconds, he swiftly moved away. Later, I saw the same person pushing an elderly man and snatching his wallet.” Defendant’s Statement: Rajesh Kumar: “I admit to taking the mobile phone because I was desperate and needed money. I did not intend to hurt anyone. I’m truly sorry for my actions.” Legal Representation: Defense Attorney: Advocate Manish Agarwal Prosecutor: Advocate Anjali Deshmukh Status of the Case: Court Hearing Date: September 5, 2024 Current Status: Rajesh Kumar is in judicial custody awaiting trial. Potential Sentencing: Theft (Section 379 IPC): Up to 3 years of imprisonment, or fine, or both. Robbery (Section 392 IPC): Imprisonment for a term which may extend to 10 years and shall also be liable to fine. Notes: The case is classified as petty robbery and theft due to the low value of stolen goods and lack of severe harm to victims. The court will consider the defendant's intent, circumstances, and past criminal record, if any, when determining the sentence."
bail_summary="DEVILISH ASSHOLES BAIL APPLICATION IN THE [NAME OF COURT] Bail Application No. [Application Number] In the matter of: [Applicant's Name], S/o [Father’s Name], R/o [Address], Applicant Versus State of [State Name], Represented by [Name of the Prosecutor/Police Station] Respondent APPLICATION FOR REGULAR BAIL To, The Honorable Judge, [Name of the Court], [Address of the Court] Date: [Date] Subject: Application for Regular Bail Respected Sir/Madam, I, [Applicant's Name], am the applicant in the above-referenced case. I am seeking regular bail in connection with the charges of rape and murder brought against me. I respectfully submit the following grounds for your consideration: Claim of Innocence: I am steadfast in my claim of innocence concerning the charges filed against me. Despite the serious nature of these charges, I maintain that I am not guilty and am committed to proving my innocence through the legal process. Acknowledgment of Past Incidents: It is acknowledged that there have been previous legal issues in my past. However, I wish to emphasize that these were not related to the current charges and do not reflect the nature of the present allegations. I have learned from past experiences and have been striving to make positive changes in my life. Family Responsibility: I am the sole breadwinner for my family. My continued detention has placed a severe financial burden on them. They rely on me for their daily needs, and my absence is causing them undue hardship. Commitment to Cooperation: I assure the court that I will fully cooperate with all legal proceedings and adhere to any conditions imposed. I am committed to attending all court hearings and assisting with the investigation as required. No Interference Assurance: I guarantee that I will not interfere with any evidence or attempt to influence witnesses. I am committed to upholding the integrity of the legal process and ensuring that the judicial system operates without obstruction. Appeal for Compassion: Given the circumstances, I humbly request the court to consider my application for bail. Granting bail would not only allow me to support my family but also enable me to actively participate in my defense. I respectfully request that the Honorable Court grant me regular bail. I am willing to comply with any conditions set by the court and provide necessary sureties to ensure my presence for all proceedings. Yours sincerely, [Applicant's Name] S/o [Father’s Name] R/o [Address] Contact Number: [Phone Number] Email: [Email Address] Enclosures: Copy of the FIR Copy of the charge sheet Proof of address Affidavit regarding family dependency Any other relevant documents"

from flask_mail import Mail, Message

# Configure upload folder

# Appwrite configuration
def get_appwrite_client():
    client = Client()
    client.set_endpoint(os.environ.get('APPWRITE_ENDPOINT'))
    client.set_project(os.environ.get('APPWRITE_PROJECT_ID'))
    client.set_key(os.environ.get('APPWRITE_API_KEY'))
    return client


def send_mail(recipient, subject, body):
    try:
        msg = Message(
            subject=subject,
            recipients=[recipient],
            body=body,
            sender=current_app.config['MAIL_DEFAULT_SENDER']
        )
        print("------insde send mail-----------")
        mail = current_app.extensions['mail']
        print("------insde send mail 2-----------", mail)
        mail.send(msg)
        return "Email sent successfully"
    except Exception as e:
        print(f"Failed to send email: {e}")
        raise e



def send_status_email(email, status, application_no, judge_license):
    try:
        print("------inside email 1------------")
        mail_response = send_mail(
            email, 
            "Status Update", 
            generate_status_update(status, application_no, judge_license)
        )
        print("------inside email 2------------")
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
        temp_path = os.path.join(bailout_bp.config['UPLOAD_FOLDER'], filename)
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

@bailout_bp.route("/chatbot",methods=['POST'])
def chat_bot():
    question=request.json.get('question')
    output=get_response(question);
    return jsonify(output)

@bailout_bp.route('/test-llm', methods=['POST'])
def run_llm():
   input_data = request.json.get('input')
   output=Previous_Cases_With_Summary_Fetch(bail_application_2,path_case_vector_store)
   print("OUTPUT:",output)
   return jsonify(output=output)


@bailout_bp.route("/pdf-extract",methods=['POST'])
def pdf_extracter():
    pdfFile=request.json.get('pdf')
    print("KASLJDKLASJLD:KJAS:KLDJKLASJKLDJKLAJSDKLJAS:KLDJ:KLASJD:KLJASKL")
    textData=pdf_to_text(pdfFile)
    return str(textData)



@bailout_bp.route('/api/create-application', methods=['POST'])
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
        application_no = int(datetime.datetime.now().timestamp() * 1000)
        
        # Get bail summary from analysis service
        bail_summary = Bail_Reckoner_Summary(application_text,application_no,application_no)
        if not bail_summary:
            return jsonify({
                'success': False,
                'message': "python flask error for backend"
            }), 404
        
        print("BAIL SUMMARY EXTRACTED")
        
        # Get previous case analysis
        previous_case = Previous_Cases_With_Summary_Fetch(application_text,path_case_vector_store)
        if not previous_case:
            return jsonify({
                'success': False,
                'message': "python flask error for backend"
            }), 404
        print("PREVIOUS CASES DONE")
        
        # Get IPC sections
        ipc_section = IPC_Sections_Charged(application_text,path_ipc_vector_store)
        if not ipc_section:
            return jsonify({
                'success': False,
                'message': "python flask error for backend"
            }), 404
        print("IPC SECTIONS DONE")
        
        # Get criminal records
        criminal_case =crime_keywords_extraction(application_text)
        if not criminal_case:
            return jsonify({
                'success': False,
                'message': "python flask error for backend"
            }), 404
        
        print("CRIMINAL CASES DONE")
        
        # Create bailout record
        bail_apply = bailout.create(
            application_no=application_no,
            jurisdiction=jurisdiction,
            case_details=case_details_text,
            application=application_pdf_url,
            lawyer=license,
            judge_license=judge_license,
            application_text=application_text,
            bail_summary=bail_summary,
            previous_case=previous_case,
            ipc_section=ipc_section,
            criminal_case=criminal_case
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

@bailout_bp.route('/api/get-lawyer-bail', methods=['POST'])
def get_lawyer_bail():
    try:
        data = request.json
        license = data.get('license')
        
        if not license:
            return jsonify({
                'success': False,
                'message': "license not found"
            }), 404
        print("LICENSE:", license)
        bail_data = Bailout.find_by_license_no(license)
        
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

@bailout_bp.route('/api/get-judge-bail', methods=['POST'])
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
        bail_data = Bailout.find_by_judge_license_no(
            judge_license
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

@bailout_bp.route('/api/change-status', methods=['POST'])
def change_status():
    try:
        print("--------------------------------")
        data = request.json
        print("REQUEST BODY:", data)
        application_no = data.get('applicationNo')
        status = data.get('status')
        print("REQUEST BODY:", data)
        
        if not application_no or not status:
            return jsonify({
                'success': False,
                'message': "All fields are required"
            }), 400
        
        print("STATUS CHANGE ENTRY")
        
        bail_details = bailout.find_one({"applicationNo":application_no})
        print("BAIL DETAILS:", bail_details)
        if not bail_details:
            return jsonify({
                'success': False,
                'message': "The bail application couldn't be found"
            }), 404
        
        print("STATUS CHANGE SEARCH")
        
        bail_details['status'] = status.lower()
        result = bailout.update_one(
            {"application_no": application_no},
            {"$set": {"status": status.lower(), "updated_at": datetime.utcnow()}}
        )

        print("STATUS CHANGE SAVED", result)
        user_detail = users.find_one({"license" : bail_details['lawyer']})
        print("user", user_detail)
        print("---before email---------")
        # Send email notification
        send_status_email(
            user_detail['email'],
            status, 
            bail_details['applicationNo'], 
            bail_details['judgeLicense']
        )

        print("----after email---------")
        
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

@bailout_bp.route('/api/bail-summary', methods=['POST'])
def bail_summary():
    try:
        data = request.json
        application_no = data.get('applicationNo')
        
        if not application_no:
            return jsonify({
                'success': False,
                'message': "Application number is required"
            }), 400
        
        bail_details = Bailout.find_by_application_no(application_no=application_no)
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



@bailout_bp.route('/api/test-chatbot', methods=['POST'])
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
