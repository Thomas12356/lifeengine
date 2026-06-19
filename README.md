# LifeEngine

LifeEngine is a full-stack scheduling application designed to help users organise their time more intelligently. The platform combines a React frontend with a Flask backend and uses AI-assisted planning ideas to support event management, calendar workflows, and adaptive scheduling decisions.

## Features

- Manage events and schedules through a web dashboard
- View upcoming events and calendar-based planning views
- Use an AI assistant for planning and scheduling support
- Store user preferences and event settings
- Support for authentication and user-specific data

## Project Overview

LifeEngine is split into two main parts:

- **Frontend**: React + Vite application for the user interface
- **Backend**: Flask API that handles authentication, scheduling logic, and data persistence

## Tech Stack

### Frontend
- React
- Vite
- Chakra UI
- React Router
- Axios

### Backend
- Flask
- SQLAlchemy
- Flask-Migrate
- Flask-JWT-Extended
- PostgreSQL

## Repository Structure

```text
.
├── frontend/          # React application
├── web-server/        # Flask backend and API
├── 1.Docs/            # Documentation and project notes
└── README.md          # Project overview
```

## Getting Started

### Prerequisites

- Node.js and npm
- Python 3.10+
- PostgreSQL database
- A `.env` file for backend configuration

### 1. Backend Setup

```bash
cd web-server
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp example-env.txt .env
```

Update the values in `.env` for your local database and secret keys.

Run the server:

```bash
python app.py
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will typically run on:

- http://localhost:5173

The backend API is usually available on:

- http://localhost:5000

## Environment Variables

The backend expects configuration values such as:

- `FLASK_SECRET_KEY`
- `JWT_SECRET_KEY`
- `DB_USER`
- `DB_PASS`
- `DB_HOST`
- `DB_PORT`
- `DB_NAME`

A sample configuration is provided in [web-server/example-env.txt](web-server/example-env.txt).

## 📚 Documentation

Additional documentation and internal notes can be found in the project folders under [1.Docs](1.Docs).

## 👥 Authors

- Thomas Eardley  
  - University email: [te215@kent.ac.uk](mailto:te215@kent.ac.uk)
  - Personal email: [thomaseardley123@gmail.com](mailto:thomaseardley123@gmail.com)

- Daniel Dixon  
  - University email: [djd41@kent.ac.uk](mailto:djd41@kent.ac.uk)

## 📌 Project Status

Active development project (University of Kent Computer Science undergraduate project).