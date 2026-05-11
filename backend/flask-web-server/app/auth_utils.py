"""
Util functions for authentication
"""

import hashlib
import os
import hmac
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

# Load authentication config from .env
try:
    PEPPER = os.environ.get('PEPPER')
    PBKDf2_COMPLEXITY = int(os.environ.get('PBKDF2_COMPLEXITY', 600000))
except Exception as e:
    print(f"[Error] Failed to load authentication config: {e}")
    raise e


def generate_hash(password):
    """
    Generates a salted and peppered pbkdf2 hash for a password.
    """
    salt = os.urandom(32).hex()

    peppered_password = password + PEPPER
    
    password_hash = hashlib.pbkdf2_hmac('sha256', peppered_password.encode('utf-8'), salt.encode('utf-8'), PBKDf2_COMPLEXITY)

    return password_hash.hex(), salt


def verify_password(password, stored_salt, stored_hash):
    """
    Verifies a password against its stored pbkdf2 hash.
    """
    
    peppered_password = password + PEPPER
    new_password_hash = hashlib.pbkdf2_hmac('sha256', peppered_password.encode('utf-8'), stored_salt.encode('utf-8'), PBKDf2_COMPLEXITY)

    return hmac.compare_digest(new_password_hash.hex(), stored_hash)