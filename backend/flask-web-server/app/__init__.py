"""
Backend API package initialization.
Sets up Flask app and registers Blueprints for the API routes.
"""
# ? should models be global as we want to make the shcedular modular and not have it depend on the flask app?

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv

db = SQLAlchemy() # SQLAlchemy instance

load_dotenv()  # Load environment variables from .env file

def fetch_database_url():
    """
    Formats the database URL to be compatible with SQLAlchemy.
    """
    DB_USER = os.environ.get('DB_USER')
    DB_PASS = os.environ.get('DB_PASS')
    DB_HOST = os.environ.get('DB_HOST')
    DB_NAME = os.environ.get('DB_NAME')
    return f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}"

def create_app():
    """
    App factory: Creates and configures the Flask appinstance.
    """
    # Create Flask app instance.
    app = Flask(__name__) 


    # Load and configure Flask app and db configuration from ".env".
    try:
        app.config['SQLALCHEMY_DATABASE_URI'] = fetch_database_url()
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.environ.get('SQLALCHEMY_TRACK_MODIFICATIONS', False)
        app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
    except Exception as e:
        print(f"[Error] Failed to load environment variables: {e}")
        raise e
    

    # TODO Prep CORS for production, change '*' to the domain of the front end and import library.
    # CORS:     Enable CORS for all routes in api/
    # Note:     Vite dev proxy handles this for the dev server but this is needed
    #           for production if the front end is hosted on a different domain.
    # CORS(app, resources={r"/api/*": {"origins": "*"}})


    # Initialize SQLAlchemy with the app.
    db.init_app(app) 


    # Register Blueprints for routes.
    from .auth_routes import auth
    app.register_blueprint(auth)


    # Create database tables if they don't exist.
    with app.app_context():
        try:
            db.create_all()
        except Exception as e:
            print(f"[Error] Failed to connect to database: {e}")
            raise e

    return app