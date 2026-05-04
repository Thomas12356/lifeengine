"""
Util functions for authentication
"""

import hashlib
from os import urandom
import hmac

# ! for production move to env variable.
PEPPER = ""
pbkdf2_complexity = 600000



def generate_hash(password):
    """
    Generates a salted and peppered pbkdf2 hash for a password.
    """
    salt = urandom(32).hex()

    peppered_password = password + PEPPER
    
    password_hash = hashlib.pbkdf2_hmac('sha256', peppered_password.encode('utf-8'), salt.encode('utf-8'), pbkdf2_complexity)

    return password_hash.hex(), salt


def verify_password(password, stored_salt, stored_hash):
    """
    Verifies a password against its stored pbkdf2 hash.
    """
    
    peppered_password = password + PEPPER
    new_password_hash = hashlib.pbkdf2_hmac('sha256', peppered_password.encode('utf-8'), stored_salt.encode('utf-8'), pbkdf2_complexity)

    return hmac.compare_digest(new_password_hash.hex(), stored_hash)