# EventEase - College Event Management System

EventEase is a full-stack web application for managing college events. The backend provides a RESTful API built with Flask, and the frontend is a dynamic single-page application. This platform simplifies the process of organizing and participating in campus activities for students, clubs, and administrators.

## Features

*   **User Management**: Secure signup, login, and role-based access control (Student, Club Admin, Admin).
*   **Event Management**: Create, view, update, and delete events.
*   **Event Registration**: Students can easily register for upcoming events.
*   **Feedback System**: Allows users to provide feedback and ratings for events they have attended.
*   **Admin Dashboard**: A control panel for Admins to manage users and approve or reject event submissions.

## Project Workflow

The system is designed to serve different roles within a college environment:

1.  **Admin**: Has full control over the system. They can manage user accounts (verifying club admins, etc.) and have the final say on approving or rejecting any event created on the platform.
2.  **Club Admin**: Represents a college club or organization. They can create new events, and manage the events submitted by their club.
3.  **Student**: Can browse all approved events, register for events they are interested in, and provide valuable feedback and ratings after attending an event.

## Tech Stack & Tools

### Backend

*   **Framework**: Flask
*   **Database**: MySQL
*   **ORM**: SQLAlchemy with Flask-SQLAlchemy
*   **Database Migrations**: Flask-Migrate (using Alembic)
*   **Authentication**: JWT (JSON Web Tokens) with Flask-JWT-Extended

### Frontend

*   **Framework**: React (or Vue/Angular)
*   **Package Manager**: npm (or Yarn)
*   **Styling**: CSS / SASS (or a framework like Material-UI/Tailwind CSS)
*   **API Communication**: Axios

### Development

*   **API Testing**: Bruno / Postman

## Setup and Installation

Follow these steps to get the full-stack application running on your local machine.

### Prerequisites

*   Node.js and npm
*   Python 3.8+
*   MySQL Server
*   A virtual environment tool like `venv`

### 1. Clone the Repository

```sh
git clone https://github.com/your-username/Event-Management-System.git
cd Event-Management-System
```

---

### 2. Backend Setup

1.  **Navigate to the Backend Directory**
    ```sh
    cd backend
    ```

2.  **Create and Activate Virtual Environment**
    ```sh
    # On Windows
    python -m venv venv
    venv\\Scripts\\activate
    
    # On macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```

3.  **Install Dependencies**
    ```sh
    pip install -r requirements.txt
    ```

4.  **Configure Environment Variables**
    Create a `.env` file in the `backend` directory. Use the template below, replacing the placeholder values with your database credentials.
    ```env
    DATABASE_URL=mysql+pymysql://<your_mysql_user>:<your_mysql_password>@localhost/eventease
    JWT_SECRET_KEY=a_very_secret_jwt_key
    SECRET_KEY=a_super_secret_flask_key
    ```

5.  **Set Up the Database**
    Ensure your MySQL server is running and create a new database named `eventease`. Then, apply the database migrations.
    ```sh
    flask db upgrade
    ```

6.  **Run the Backend Server**
    ```sh
    flask run
    ```
    The API server will start and be available at `http://127.0.0.1:5000`.

---

### 3. Frontend Setup

1.  **Navigate to the Frontend Directory**
    Open a new terminal and navigate to the `frontend` directory from the project root.
    ```sh
    cd ../frontend
    ```

2.  **Install Dependencies**
    ```sh
    npm install
    ```

3.  **Configure Environment Variables**
    Create a `.env` file in the `frontend` directory to specify the backend API URL.
    ```env
    REACT_APP_API_URL=http://127.0.0.1:5000
    ```

4.  **Run the Frontend Application**
    ```sh
    npm start
    ```
    The application will open in your browser, usually at `http://localhost:3000`.


You should now have the EventEase application running locally with the frontend communicating with the backend. Feel free to explore the features, register as a new user, create events, and see the system in action.

For any issues or contributions, please open an issue or submit a pull request.
