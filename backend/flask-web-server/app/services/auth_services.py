from app import db
from app.models import User
from app.utils import verify_password, generate_new_hash

def register_user(email, password, first_name, last_name):
    """
    Registers a new user with the given email, password, first name and last name.
    """

    if User.find_active_by_email(email):
        return None, "Account with this email already exists."
    
    password_hash, salt = generate_new_hash(password)

    new_user = User(
        email=email,
        password_hash=password_hash,
        salt=salt,
        first_name=first_name,
        last_name=last_name
    )

    db.session.add(new_user)
    db.session.commit()

    return new_user, None