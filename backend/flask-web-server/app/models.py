import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import func
from . import db

class User(db.Model):
    __tablename__ = 'users'

    # UUID as primary key
    id = db.Column(UUID(as_uuid = True), primary_key = True, default = uuid.uuid4)

    first_name = db.Column(db.String(50), nullable = False)
    last_name = db.Column(db.String(50), nullable = False)

    # Index on email for faster lookups, unique to prevent duplicate users
    email = db.Column(db.String(120), unique = True, nullable = False, index = True)

    # pkdf2_hmac hash of the password, stored as a hex string, 64 characters
    password_hash = db.Column(db.String(255), nullable = False)
    # 32 byte salt stored as hex string, 64 characters
    salt = db.Column(db.String(64), nullable = False)

    # Timestamp of when the user was created, stored in UTC
    created_at = db.Column(db.DateTime(timezone = True), server_default = func.now())

    # mark users as inactive without deleting them from the database
    is_active = db.Column(db.Boolean, default = True)

    def __repr__(self):
        return f"<User: {self.email}: {self.id}>"