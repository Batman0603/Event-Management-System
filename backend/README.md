# EventEase - Event Management System Backend

This is the backend for EventEase, a comprehensive platform for managing college events. It is built with Flask and provides a RESTful API for handling users, events, registrations, and feedback.

## Features

*   **User Management**: Signup, login, and role-based access control (Student, Club Admin, Admin).
*   **Event Management**: Create, view, update, and delete events.
*   **Event Registration**: Users can register for events.
*   **Feedback System**: Users can provide feedback and ratings for events they attended.
*   **Admin Dashboard**: Admins can manage users and approve/reject events.

## Tech Stack

*   **Framework**: Flask
*   **Database**: MySQL
*   **ORM**: SQLAlchemy with Flask-SQLAlchemy
*   **Migrations**: Flask-Migrate (Alembic)
*   **Authentication**: JWT (JSON Web Tokens) with Flask-JWT-Extended
*   **API Testing**: Bruno / Postman

## Project Structure

```
eventease-backend/
│
├── app/
│   ├── __init__.py
│   ├── config.py
│   ├── auth/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── utils/
│   └── database.py
│
├── migrations/
├── tests/
├── .env
├── requirements.txt
├── run.py
├── README.md
└── .gitignore
```

## Setup and Installation

### Prerequisites

*   Python 3.8+
*   MySQL Server
*   Virtual Environment tool (`venv`)

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd eventease-backend
```

### 2. Create and Activate Virtual Environment

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory (`eventease-backend/`) and add the following variables.

```env
DATABASE_URL=mysql+pymysql://<your_mysql_user>:<your_mysql_password>@localhost/eventease
JWT_SECRET_KEY=a_very_secret_jwt_key
SECRET_KEY=a_super_secret_flask_key
```

### 5. Set Up the Database

First, ensure your MySQL server is running and you have created the `eventease` database.

Then, apply the database migrations:
```bash
flask db upgrade
```

### 6. Run the Application

```bash
flask run
```
The application will be available at `http://127.0.0.1:5000`.

## API Endpoints

### Authentication

*   `POST /auth/signup`: Register a new user.
*   `POST /auth/login`: Log in and receive a JWT token.

*(More endpoints to be documented here as they are built...)*