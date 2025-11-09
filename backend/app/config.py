import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        "mysql+pymysql://root:karthi@localhost/eventease"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "super_secret_key")
    DEBUG = os.getenv("FLASK_DEBUG") == "1"
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-jwt-secret-key")

    # Configure Flask-JWT-Extended to use cookies
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_ACCESS_COOKIE_NAME = "access_token_cookie"
    JWT_REFRESH_COOKIE_NAME = "refresh_token_cookie"
    JWT_COOKIE_HTTPONLY = True
    # For cross-origin requests, SameSite must be 'None'. This also requires Secure=True.
    # In local dev (non-production), browsers may allow this over HTTP for localhost.
    JWT_COOKIE_SAMESITE = "None"
    JWT_COOKIE_SECURE = os.getenv("FLASK_ENV") == "production"

    # Mail Configuration
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.getenv("MAIL_USERNAME", "your_email@gmail.com")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD", "your_app_password")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER", "your_email@gmail.com")

    # Swagger Configuration
    SWAGGER = {
        'title': 'EventEase API',
        'uiversion': 3,
        "specs_route": "/apidocs/",
        'securityDefinitions': {
            'Bearer': {
                'type': 'apiKey',
                'name': 'Authorization',
                'in': 'header',
                'description': "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\""
            }
        },
        'security': [{
            'Bearer': []
        }]
    }
