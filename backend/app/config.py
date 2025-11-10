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
    
    # Cookie settings for development (localhost)
    JWT_COOKIE_SECURE = False  # Changed: False for localhost HTTP
    JWT_COOKIE_SAMESITE = "Lax"  # Changed: "Lax" works for same-site (localhost to localhost)
    JWT_COOKIE_CSRF_PROTECT = False  # Disable CSRF for development
    JWT_ACCESS_COOKIE_PATH = "/"
    JWT_REFRESH_COOKIE_PATH = "/"
    
    # For production, you would use:
    # JWT_COOKIE_SECURE = True
    # JWT_COOKIE_SAMESITE = "None" 
    # JWT_COOKIE_CSRF_PROTECT = True

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