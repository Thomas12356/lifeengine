# Academic Resource Log - Backend
This file is temporary for now, it contains accademic resources used for research on the backend.

# Resources:

## Inbox
Content that needs to appear in here with a resource:
### Models
your models should be defined in a separate file (e.g., models.py) and imported into your routes.

To keep the scheduler (or any background worker) modular:

The Models: Define them using the db instance from your __init__.py.

The Scheduler: It can import the db and the models. To interact with the database outside of a web request, you simply use with app.app_context():. This allows the scheduler to share the logic without being "trapped" inside the Flask routing logic.

## Storing Secrets Securley - Info Needed ...
te215: Read, ...
### Related to:
Flask Web Server, Database
### Link: 
[pypi.org python-dotenv/](https://pypi.org/project/python-dotenv/).

## Flask SQLAlchemy - Info Needed ...
te215: Read, used ...
### Related to:
Flask Web Server, Database
### Link:
[flask-sqlalchemy Docs](https://flask-sqlalchemy.readthedocs.io/en/stable/quickstart/)

## Environ vs Getenv - Info Needed ...
[Environ Vs GetEnv - Medium.com](https://medium.com/@levchevajoana/pythons-os-environ-vs-os-getenv-b149e6fdea3c)

