"""
Backend API package initialization.
Sets up Flask app and registers Blueprints for the API routes.
"""

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv
from flask_migrate import Migrate
from urllib.parse import quote_plus

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

    print(uri)
    return uri


def create_app():
    """
    App factory: Creates and configures the Flask app instance.
    """
    # Create Flask app instance.
    app = Flask(__name__) 


    # Load and configure Flask app and db configuration from ".env".
    try:
        app.config['SQLALCHEMY_DATABASE_URI'] = fetch_database_uri()
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.environ.get('SQLALCHEMY_TRACK_MODIFICATIONS', False)

        secret_key = os.environ.get('SECRET_KEY')
        if not secret_key:
            # Log error and raise to prevent app starting if SECRET_KEY is missing.
            app.logger.error("[Error] SECRET_KEY is not in .env")
            raise ValueError("[Error] SECRET_KEY is not in .env")
        
        app.config['SECRET_KEY'] = secret_key

    except Exception as e:
        # Log error and raise to prevent app starting if there is a configuration issue.
        app.logger.error(f"Config error: {e}")
        raise e
    
    

    # TODO Prep CORS for production, change '*' to the domain of the front end and import library.
    # CORS:     Enable CORS for all routes in api/
    # Note:     Vite dev proxy handles this for the dev server but this is needed
    #           for production if the front end is hosted on a different domain.
    # CORS(app, resources={r"/api/*": {"origins": "*"}})


    # Initialize SQLAlchemy with the app.
    db.init_app(app) 
    # Initialize Flask-Migrate with the app and db.
    migrate.init_app(app, db)

    from . import models

    # Register Blueprints for routes.
    from app.routes.auth_routes import auth
    app.register_blueprint(auth)

    return app