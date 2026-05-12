"""
Authentication blueprint
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app import db
from app.services.auth_services import register_user, authenticate_user

auth_blueprint = Blueprint('auth', __name__)

@auth_blueprint.route('/login', methods=['POST'])
def login():
    """
    Validates user credentials
    """
    data = request.get_json()

    user = authenticate_user(data.get('email'), data.get('password'))
    
    if not user:
        return jsonify({"error": "Invalid email or password."}), 401
    
    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "message": "Login successful.",
        "access_token": access_token,
        "user": {
            "id": str(user.id),
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
        }
    }), 200

@auth_blueprint.route('/register', methods=['POST'])
def register():
    """
    Registers a new user with the provided email, password, first name and last name.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Missing request data."}), 400
    
    user, error = register_user(
        email=data.get('email'),
        password=data.get('password'),
        first_name=data.get('first_name'),
        last_name=data.get('last_name')
    )

    if error:
        return jsonify({"error": error}), 400
    
    return jsonify({
        "message": "Registration successful.",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name
        }
    }), 201
