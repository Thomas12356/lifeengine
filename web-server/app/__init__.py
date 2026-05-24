"""
Backend API package initialization.
Sets up Flask app and registers Blueprints for the API routes.
"""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv
from flask_migrate import Migrate
from urllib.parse import quote_plus
from datetime import timedelta

db = SQLAlchemy() # SQLAlchemy global instance
migrate = Migrate() # Flask-Migrate global instance

load_dotenv()  # Load environment variables from .env file


def fetch_database_uri():
    """
    Formats the database URL for SQLAlchemy.
    """
    DB_USER = os.environ.get('DB_USER')
    DB_PASS = os.environ.get('DB_PASS')
    DB_HOST = os.environ.get('DB_HOST')
    DB_PORT = os.environ.get('DB_PORT', '5432')
    DB_NAME = os.environ.get('DB_NAME')
    
    # URL-encode to handle special characters preventing errors in the url.
    safe_user = quote_plus(DB_USER)
    safe_pass = quote_plus(DB_PASS)
    safe_name = quote_plus(DB_NAME)
    uri = f"postgresql://{safe_user}:{safe_pass}@{DB_HOST}:{DB_PORT}/{safe_name}"

    return uri


def create_app():
    """
    App factory: Creates and configures the Flask app instance.
    """
    # Create Flask app instance.
    app = Flask(__name__) 
    # TODO CORS needed for production , vite handels for development
    # CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)


    # Load and configure Flask app and db configuration from ".env".
    try:
        app.config['SQLALCHEMY_DATABASE_URI'] = fetch_database_uri()
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.environ.get('SQLALCHEMY_TRACK_MODIFICATIONS', False)


        secret_key = os.environ.get('FLASK_SECRET_KEY')
        if not secret_key:
            # Log error and raise to prevent app starting if SECRET_KEY is missing.
            app.logger.error("[Error] SECRET_KEY is not in .env")
            raise ValueError("[Error] SECRET_KEY is not in .env")
        app.config['SECRET_KEY'] = secret_key

        jwt_secret_key = os.environ.get('JWT_SECRET_KEY')
        if not jwt_secret_key:
            # Log error and raise to prevent app starting if JWT_SECRET_KEY is missing.
            app.logger.error("[Error] JWT_SECRET_KEY is not in .env")
            raise ValueError("[Error] JWT_SECRET_KEY is not in .env")
        
        app.config['JWT_SECRET_KEY'] = jwt_secret_key # Set the JWT secret key for Flask-JWT-Extended.
        app.config['JWT_TOKEN_LOCATION'] = ["cookies"]
        app.config['JWT_ACCESS_COOKIE_PATH'] = "/"
        app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1) # Access tokens expire in 1 hour
        app.config["JWT_COOKIE_CSRF_PROTECT"] = True
        app.config["JWT_SESSION_COOKIE"] = True
        app.config["JWT_COOKIE_SECURE"] = False # TODO set to true in production
        app.config["SESSION_COOKIE_SAMESITE"] = "Lax"

        jwt = JWTManager(app) # Initialize JWTManager with the app.
        
    except Exception as e:
        # Log error and raise to prevent app starting if there is a configuration issue.
        app.logger.error(f"[Error] loading and initializing config failed: {e}")
        raise e

    # Import and Register Blueprints for routes.
    from app.routes.auth_routes import auth_blueprint
    from app.routes.event_routes import event_blueprint
    app.register_blueprint(auth_blueprint, url_prefix='/api/auth')
    app.register_blueprint(event_blueprint, url_prefix='/api/event')


    # Initialize SQLAlchemy with the app.
    db.init_app(app) 
    # Initialize Flask-Migrate with the app and db.
    migrate.init_app(app, db)
    from . import models

    return app