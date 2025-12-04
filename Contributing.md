# Contributing to EventEase

First off, thank you for considering contributing to the EventEase project! We're excited to have you on board. Every contribution, whether it's a bug report, a new feature, or a documentation update, is greatly appreciated.

This document provides guidelines to help you get started with your contribution.

## Table of Contents
* [Code of Conduct](#code-of-conduct)
* [How Can I Contribute?](#how-can-i-contribute)
  * [Reporting Bugs](#reporting-bugs)
  * [Suggesting Enhancements](#suggesting-enhancements)
  * [Your First Code Contribution](#your-first-code-contribution)
  * [Pull Requests](#pull-requests)
* [Development Setup](#development-setup)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Project Structure](#project-structure)
* [Coding Style](#coding-style)
* [Commit Message Guidelines](#commit-message-guidelines)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior.

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please ensure the bug has not already been reported by searching on GitHub under [Issues](https://github.com/your-username/Event-Management-System/issues).

If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/your-username/Event-Management-System/issues/new). Be sure to include a **title and clear description**, as much relevant information as possible, and a **code sample or an executable test case** demonstrating the expected behavior that is not occurring.

### Suggesting Enhancements

If you have an idea for a new feature or an improvement to an existing one, please open an issue to discuss it. This allows us to coordinate our efforts and prevent duplication of work.

### Pull Requests

We welcome pull requests from the community.

1.  Fork the repository and create your branch from `main`.
2.  If you've added code that should be tested, add tests.
3.  Ensure the test suite passes.
4.  Make sure your code lints.
5.  Issue that pull request!

## Development Setup

Here’s how to set up the `Event-Management-System` for local development.

### Prerequisites

*   Python 3.8+
*   Pip & Virtualenv
*   Git
*   A running MySQL server
*   A running message broker for Celery (like Redis or RabbitMQ)

### Installation

1.  **Fork and Clone the Repository**

    ```bash
    git clone https://github.com/<your-username>/Event-Management-System.git
    cd Event-Management-System/backend
    ```

2.  **Create a Virtual Environment**

    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows use `venv\Scripts\activate`
    ```

3.  **Install Dependencies**

    Create a `requirements.txt` file with the necessary packages and then run:
    ```bash
    pip install -r requirements.txt
    ```
    *Assumed packages: `Flask`, `Flask-SQLAlchemy`, `pymysql`, `Flask-JWT-Extended`, `Flask-Cors`, `Flasgger`, `Flask-Migrate`, `python-dotenv`, `Flask-Mail`, `celery`, `redis`.*

4.  **Set Up Environment Variables**

    Create a `.env` file in the `backend` directory. This file stores sensitive configuration. Copy the example below and replace the placeholder values.

    ```env
    # Flask Configuration
    SECRET_KEY="a_very_strong_random_secret_key"
    FLASK_DEBUG=1

    # Database Configuration (MySQL)
    DATABASE_URL="mysql+pymysql://user:password@localhost/eventease"

    # JWT Configuration
    JWT_SECRET_KEY="another_strong_random_jwt_secret"

    # Mail Configuration (Example with Gmail)
    MAIL_USERNAME="your_email@gmail.com"
    MAIL_PASSWORD="your_google_app_password"
    MAIL_DEFAULT_SENDER="your_email@gmail.com"

    # Celery Configuration
    CELERY_BROKER_URL="redis://localhost:6379/0"
    CELERY_RESULT_BACKEND="redis://localhost:6379/0"

    # Frontend URL for CORS
    CORS_ORIGINS="http://localhost:5173,http://localhost:5174"
    ```

5.  **Database Setup**

    Make sure your MySQL server is running and you have created a database named `eventease`. Then, run the migrations to set up the tables.

    ```bash
    flask db upgrade
    ```

6.  **Run the Application**

    You need two terminals for this.

    *   **Terminal 1: Run the Flask App**
        ```bash
        flask run
        ```
        The API will be available at `http://127.0.0.1:5000`. The API documentation (Swagger UI) is available at `http://127.0.0.1:5000/apidocs/`.

    *   **Terminal 2: Run the Celery Worker**
        The Celery worker handles background tasks like sending emails.
        ```bash
        celery -A your_celery_app_instance worker --loglevel=info
        ```
        *(Note: Replace `your_celery_app_instance` with the actual path to your Celery instance if it's not automatically detected).*

## Project Structure

The backend code is organized as follows:

```
backend/
├── app/
│   ├── __init__.py         # Application factory
│   ├── config.py           # Configuration settings
│   ├── database.py         # Database setup
│   ├── models/             # SQLAlchemy models (if separated)
│   ├── routes/             # API Blueprints for different features
│   ├── middlewares/        # Custom middlewares
│   ├── services/           # Business logic
│   └── email_tasks.py      # Celery tasks
├── migrations/             # Flask-Migrate migration scripts
├── tests/                  # Unit and integration tests
└── .env                    # Environment variables (not committed)
```

## Coding Style

*   Please follow the PEP 8 style guide for Python code.
*   Use a linter like `flake8` or `black` to format your code.

## Commit Message Guidelines

Please follow a conventional commit format. For example:
*   `feat: Add user profile page`
*   `fix: Correct password reset email link`
*   `docs: Update CONTRIBUTING.md`

---

We look forward to your contributions!
