"""
Backend API package initialization.
Sets up Flask app and registers Blueprints for the API routes.
"""
# ? should models be global as we want to make the shcedular modular and not have it depend on the flask app?

from flask import Flask
from flask_cors import CORS

def create_app():
    """
    App factory: Creates and configures the Flask appinstance.
    """
    app = Flask(__name__)

    # ! Security: handle secret key properly for production.
    app.config['SECRET_KEY'] = 'life-engine-secret-key'

    # CORS: Enable CORS for all routes in api/
    # Note: vite dev proxy handles this for the dev server but this is needed
    # for production if the front end is hosted on a different domain.
    # ! in production change '*' to the domain of the front end.
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # TODO Import Blueprints

    # TODO Register Blueprints


    return app