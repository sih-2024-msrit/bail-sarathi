import jwt
import os
from functools import wraps
from flask import request, jsonify
from dotenv import load_dotenv
from models.user import User

load_dotenv()  # Load environment variables from .env file

def auth_middleware():
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                # Extract token from multiple possible locations
                token = None
                if request.cookies.get('token'):
                    token = request.cookies.get('token')
                elif request.json and 'token' in request.json:
                    token = request.json.get('token')
                elif request.headers.get('Authorization'):
                    auth_header = request.headers.get('Authorization')
                    if auth_header.startswith('Bearer '):
                        token = auth_header.replace('Bearer ', '')
                
                if not token:
                    return jsonify({
                        'success': False,
                        'message': 'Token is missing'
                    }), 404
                
                try:
                    print("verifying token")
                    decode = jwt.decode(
                        token, 
                        os.environ.get('JWT_SECRET'), 
                        algorithms=['HS256']
                    )
                    # Store user info in flask.g or request context
                    request.user = decode
                
                except Exception as err:
                    print(err)
                    print(str(err))
                    return jsonify({
                        'success': False,
                        'message': 'Token is invalid'
                    }), 401
                
                return f(*args, **kwargs)
            
            except Exception as err:
                return jsonify({
                    'success': False,
                    'message': 'Something went wrong while validating the token'
                }), 401
        
        return decorated_function
    return decorator

def is_lawyer_middleware():
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                if request.user.get('accountType') != 'lawyer':
                    return jsonify({
                        'success': False,
                        'message': 'This is a protected route for Lawyer only'
                    }), 401
                
                return f(*args, **kwargs)
            
            except Exception as error:
                return jsonify({
                    'success': False,
                    'message': 'User role cannot be verified, please try again'
                }), 500
        
        return decorated_function
    return decorator

def is_user_middleware():
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                if request.user.get('accountType') != 'user':
                    return jsonify({
                        'success': False,
                        'message': 'This is a protected route for user only'
                    }), 401
                
                return f(*args, **kwargs)
            
            except Exception as error:
                return jsonify({
                    'success': False,
                    'message': 'User role cannot be verified, please try again'
                }), 500
        
        return decorated_function
    return decorator

def is_judge_middleware():
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                if request.user.get('accountType') != 'judge':
                    return jsonify({
                        'success': False,
                        'message': 'This is a protected route for judge only'
                    }), 401
                
                return f(*args, **kwargs)
            
            except Exception as error:
                return jsonify({
                    'success': False,
                    'message': 'User role cannot be verified, please try again'
                }), 500
        
        return decorated_function
    return decorator

# Example usage in your Flask routes:
"""
@app.route('/api/lawyer/dashboard')
@auth_middleware()
@is_lawyer_middleware()
def lawyer_dashboard():
    # Your route logic here
    return jsonify({'data': 'Lawyer dashboard'})

@app.route('/api/user/profile')
@auth_middleware()
@is_user_middleware()
def user_profile():
    # Your route logic here
    return jsonify({'data': 'User profile'})

@app.route('/api/judge/cases')
@auth_middleware()
@is_judge_middleware()
def judge_cases():
    # Your route logic here
    return jsonify({'data': 'Judge cases'})
"""