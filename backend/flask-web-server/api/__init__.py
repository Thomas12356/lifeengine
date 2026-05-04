from flask import Flask

def create_app():
    # Create flask application
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'life-engine-secret-key'

    # Import Blueprints

    # Register Blueprints

    return app