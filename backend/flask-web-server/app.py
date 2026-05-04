"""
Main entry point for flask app.
Run this file to start the server.
"""

from api import create_app

# Create flask app using factory function.
app = create_app()

if __name__ == '__main__':
    # Start the server, host = 0.0.0.0 to allow local network access.
    app.run(debug=True, port=5000)