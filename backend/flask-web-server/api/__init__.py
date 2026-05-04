"""
Backend API package initialization.
Sets up Flask app and registers Blueprints for the API routes.
"""

# ? should models be global as we want to make the shcedular modular and not have it depend on the flask app?

from flask import Flask

def create_app():
    """
    App factory: Creates and configures the Flask appinstance.
    """
    app = Flask(__name__)

    # TODO Security: handle secret key properly for production.
    app.config['SECRET_KEY'] = 'life-engine-secret-key'

    # TODO Should We: use CORS, react usually port 3000, flask usually port 5000.

    # TODO Import Blueprints

    # TODO Register Blueprints


    return app