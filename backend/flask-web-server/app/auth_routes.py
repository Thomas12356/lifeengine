"""
Authentication blueprint
"""

from flask import Blueprint, request, jsonify
from . import db

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['POST'])
def login():
    # """
    # Validates user credentials
    # """

    # data = request.get_json()
    # email = data.get('email')
    # password = data.get('password')

    # if not email or not password:
    #     return jsonify({'error': 'Missing email or password'}), 400
    
    # # TODO fetch user credentials.
    return "Login endpoint"