"""
Util functions for authentication
"""

from hashlib import sha256
from os import urandom
import hmac

# ! for production move to env variable.
PEPPER = ""

def generate_hash(password):
    """
    Generates a salted and peppered hash for a password.
    """

    salt = urandom(32).hex()

    salted_peppered_password = password + salt + PEPPER
    password_hash = sha256(salted_peppered_password.encode()).hexdigest()

    return password_hash, salt


def verify_password(password, stored_salt, stored_hash):
    """
    Verifies a password against its stored hash.
    """
    
    salted_peppered_password = password + stored_salt + PEPPER
    password_hash = sha256(salted_peppered_password.encode()).hexdigest()

    return hmac.compare_digest(password_hash, stored_hash)