"""
Backend API package initialization.
Sets up Flask app and registers Blueprints for the API routes.
"""
# ? should models be global as we want to make the shcedular modular and not have it depend on the flask app?

from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# TODO Handle DB Details securley.
# ! Password must not be hardcoded in production, secrets should be used.
DB_USER = 'comp6030_34' 
DB_PASS = 'your_password' 
DB_HOST = 'penguin.kent.ac.uk'
DB_NAME = 'comp6030_34'

# TODO Handle secret key securley.
# ! handle secret key properly for production.
SECRET_KEY = 'life-engine-secret-key'

def create_app():
    """
    App factory: Creates and configures the Flask appinstance.
    """
    app = Flask(__name__)

    app.config['SECRET_KEY'] = SECRET_KEY

    app.config['SQLALCHEMY_DATABASE_URI'] = f'postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}/{DB_NAME}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # saves memory/resources.

    # TODO Prep CORS for production, change '*' to the domain of the front end.
    """     CORS:   Enable CORS for all routes in api/
            Note:   Vite dev proxy handles this for the dev server but this is needed
                    for production if the front end is hosted on a different domain.    """
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    db.init_app(app) # Connects the database to the flask app.

    # TODO import models here: ensure they are registered with SQLAlchemy before creating tables.

    with app.app_context():
        db.create_all() # Create database tables in postgres.

        
    # TODO Import Blueprints

    # TODO Register Blueprints


    return app