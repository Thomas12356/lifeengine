from app import db
from app.models import User, UserPreferences
from app.services.utils.auth_util import verify_password, generate_new_hash


def register_user(email, password, first_name, last_name, wake_up, bed_time):
    """
    Registers a new user with the given email, password, first name and last name.
    """

    if User.find_active_by_email(email):
        return None, "Account with this email already exists."
    
    password_hash, salt = generate_new_hash(password)

    # Create a new user instance and save to the database
    new_user = User(
        email=email,
        password_hash=password_hash,
        salt=salt,
        first_name=first_name,
        last_name=last_name
    )

    db.session.add(new_user)
    db.session.commit()

    new_user_preferences = UserPreferences(
        user_id = new_user.id,
        wakeup_time = wake_up,
        bed_time = bed_time,
    )


    # Add the new user to the database session and commit
    
    db.session.add(new_user_preferences)
    db.session.commit()

    return new_user, None


def authenticate_user(email, password):
    """
    Authenticates a user by their email and password.
    """
    user = User.find_active_by_email(email)

    if user and verify_password(password, user.salt, user.password_hash):
        return user
    
    return None
