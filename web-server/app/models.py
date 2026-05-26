import uuid
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy import func
from . import db



class User(db.Model):
    __tablename__ = 'users'

    # ----- Fields -----
    # UUID as primary key
    id = db.Column(UUID(as_uuid = True), primary_key = True, default = uuid.uuid4)
    first_name = db.Column(db.String(50), nullable = False)
    last_name = db.Column(db.String(50), nullable = False)
    # Index on email for faster lookups, unique to prevent duplicate users
    email = db.Column(db.String(120), unique = True, nullable = False, index = True)
    # pkdf2_hmac hash of the password, stored as a hex string, 64 characters (set to 255 allowing future changes)
    password_hash = db.Column(db.String(255), nullable = False)
    # 32 byte salt stored as hex string, 64 characters
    salt = db.Column(db.String(64), nullable = False)
    # Timestamp of when the user was created, stored in UTC
    created_at = db.Column(db.DateTime(timezone = True), server_default = func.now())
    # mark users as inactive without deleting them from the database
    is_active = db.Column(db.Boolean, default = True)

    # defining how the object looks when printed
    def __repr__(self):
        return f"<User: {self.email}: {self.id}>"
    
    # ----- Querys -----
    @classmethod
    def find_active_by_email(cls, email):
        """
        Finds an active user by their email.
        """
        return cls.query.filter_by(email = email, is_active = True).first()
    
    @classmethod
    def find_by_id(cls, user_id):
        """
        Finds a user by their ID.
        """
        return cls.query.get(user_id)
    

    
class EventParameter(db.Model):
    __tablename__ = 'event_parameters'

    # ----- Fields -----
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    ideal_energy = db.Column(db.Float, nullable=True)
    burnout_rate = db.Column(db.Float, nullable=True)
    priority = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    def __repr__(self):
        return f"<EventParameter: {self.id}>"
    



class EventType(db.Model):
    __tablename__ = 'event_types'

    # ----- Fields -----
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False, index=True)
    event_parameter_id = db.Column(UUID(as_uuid=True), db.ForeignKey('event_parameters.id'), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    # ----- Relationships -----
    user = db.relationship('User', backref=db.backref('event_types', lazy=True, cascade="all, delete-orphan"))
    parameter = db.relationship('EventParameter', backref=db.backref('event_types', lazy=True))

    def __repr__(self):
        return f"<EventType: {self.name} ({self.id})>"
    



class Event(db.Model):
    __tablename__ = 'events'

    # ----- Fields -----
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Foreign keys
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False, index=True)
    event_type_id = db.Column(UUID(as_uuid=True), db.ForeignKey('event_types.id'), nullable=True)
    event_parameter_id = db.Column(UUID(as_uuid=True), db.ForeignKey('event_parameters.id'), nullable=True)

    name = db.Column(db.String(255), nullable=False)
    start_time = db.Column(db.DateTime(timezone=True), nullable=False, index=True)
    end_time = db.Column(db.DateTime(timezone=True), nullable=False, index=True)
    is_moveable = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)
    colour = db.Column(db.String, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # ----- Relationships -----
    user = db.relationship('User', backref=db.backref('events', lazy=True, cascade="all, delete-orphan"))
    event_type = db.relationship('EventType', backref=db.backref('events', lazy=True))
    parameter = db.relationship('EventParameter', backref=db.backref('events', lazy=True))

    def __repr__(self):
        return f"<Event: {self.name} | Start: {self.start_time}>"

    @classmethod
    def find_by_id(cls, event_id):
        """
        Finds an event by its ID.
        """
        return cls.query.get(event_id)
    
    @classmethod
    def get_by_user_id(cls, user_id):
        return (cls.query.filter_by(user_id=user_id, is_active=True).all())

    def to_dict(self):
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "event_type_id": str(self.event_type_id) if self.event_type_id else None,
            "event_parameter_id": str(self.event_parameter_id) if self.event_parameter_id else None,
            "name": self.name,
            "start_time": self.start_time.isoformat() if self.start_time else None,
            "end_time": self.end_time.isoformat() if self.end_time else None,
            "is_moveable": self.is_moveable,
            "is_active": self.is_active,
            "colour" : self.colour if self.colour else None
        }