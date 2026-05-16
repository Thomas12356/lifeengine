"""
Util functions for authentication
"""
import hashlib
import os
import hmac
from dotenv import load_dotenv


# Load environment variables from .env file
load_dotenv()  


# Load authentication config from .env
PEPPER = os.environ.get('PEPPER')
if not PEPPER:
    raise RuntimeError("[Error] PEPPER is not set in .env")


PBKDf2_COMPLEXITY = int(os.environ.get('PBKDF2_COMPLEXITY', 600000))


def generate_salt():
    """
    Generates a random salt.
    """
    return os.urandom(32).hex()


def run_hashing_algorithm(password, salt):
    """
    Runs the pbkdf2 hashing algorithm on a password, salt and pepper.
    """
    peppered_password = password + PEPPER
    
    password_hash = hashlib.pbkdf2_hmac('sha256', peppered_password.encode('utf-8'), salt.encode('utf-8'), PBKDf2_COMPLEXITY)

    return password_hash.hex()


def generate_new_hash(password):
    """
    Generates a salted and peppered hash for a password.
    """
    salt = generate_salt()
    
    password_hash = run_hashing_algorithm(password, salt)

    return password_hash, salt


def verify_password(new_password, stored_salt, stored_hash):
    """
    Verifies a password by hashing it and comparing against its stored hash.
    """
    new_password_hash = run_hashing_algorithm(new_password, stored_salt)

    return hmac.compare_digest(new_password_hash, stored_hash)