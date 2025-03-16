from flask import Flask, Blueprint, request, jsonify, make_response
import bcrypt
import jwt
import datetime
import os
from Crypto.Cipher import AES
from dotenv import load_dotenv
from models.model import User
from models.model import License
from flask_cors import CORS, cross_origin
from flask import Response, current_app


load_dotenv()  # Load environment variables from .env file

auth_bp = Blueprint('auth', __name__)

# CORS(auth_bp)

# Login route
@auth_bp.route('/api/login', methods=['POST'])
def login():
    try:
        print("Login route")
        # Get data
        data = request.json
        license_no = data.get('license')
        password = data.get('password')

        print(license_no, password)
        
        # Validate data
        if not license_no or not password:
            return jsonify({
                'success': False,
                'message': "All fields are required, please try again"
            }), 403
        # Check if user exists
        user = User.find_one(license=license_no)
        if not user:
            return jsonify({
                'success': False,
                'message': "User does not exist, Sign up first please"
            }), 415
        
        # Password check
        if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
            payload = {
                'email': user['email'],
                'accountType': user['accountType'],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=3)
            }
            token = jwt.encode(
                payload,
                os.environ.get('JWT_SECRET'),
                algorithm='HS256'
            )
            
            user['token'] = token
            user['password'] = None
            
            # Create cookie and send response
            response = make_response(
                jsonify({
                    'success': True,
                    'token': token,
                    'user': user,
                    'message': "Logged in successfully"
                })
            )
            
            # Set cookie
            expires = datetime.datetime.now() + datetime.timedelta(hours=3)
            response.set_cookie('token', token, expires=expires, httponly=True)
            
            return response, 200
        
        else:
            return jsonify({
                'success': False,
                'message': "Password is incorrect"
            }), 415
    
    except Exception as err:
        print(err)
        return jsonify({
            'success': False,
            'message': "Login Failure, please try again"
        }), 500

# Signup route
@auth_bp.route('/api/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        name = data.get('name')
        password = data.get('password')
        location = data.get('location')
        gender = data.get('gender')
        email = data.get('email')
        account_type = data.get('accountType')
        
        print(data)
        
        # Validate all fields
        if not name or not password or not location or not gender or not email or not account_type:
            return jsonify({
                'success': False,
                'message': "All fields are required"
            }), 404
        
        # Check by email
        check_user_email = User.find_one(email=email)
        if check_user_email:
            return jsonify({
                'success': False,
                'message': "provided email already exists"
            }), 400
        
        # Hash the password and store in db
        # Generate salt
        salt = bcrypt.gensalt(10)
        if not salt:
            return jsonify({
                'success': False,
                'message': "salt generation error"
            }), 400
        
        # Hash password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
        if not hashed_password:
            return jsonify({
                'success': False,
                'message': "Password could not be hashed"
            }), 400
        
        # Create unique license
        license_check = False
        formatted_license = ''
        
        while not license_check:
            # Generate random bytes
            buffer = os.urandom(8)
            
            # Convert to hexadecimal string
            license_number = buffer.hex().upper()
            
            # Format the license number (e.g., XXXX-XXXX-XXXX-XXXX)
            formatted_license = '-'.join([license_number[i:i+4] for i in range(0, len(license_number), 4)])
            
            check_unique = License.find_one(license_no=formatted_license)
            
            if not check_unique:
                license_check = True
        
        # Create license record
        License.create(license_no=formatted_license)
        
        # Create user
        created_user = User.create(
            name=name,
            license=formatted_license,
            password=hashed_password,
            location=location,
            gender=gender,
            email=email,
            account_type=account_type
        )
        
        if not created_user:
            return jsonify({
                'success': False,
                'message': "Sign up error"
            }), 400
        
        return jsonify({
            'success': True,
            'message': "User successfully signed up",
            'createdUser': created_user
        }), 200
    
    except Exception as err:
        print(err)
        return jsonify({
            'success': False,
            'message': "SignUp Failed, Please Try Again"
        }), 500