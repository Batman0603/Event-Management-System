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

    # Mail Configuration
    MAIL_SERVER = "smtp.gmail.com"
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.getenv("MAIL_USERNAME", "your_email@gmail.com")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD", "your_app_password")
    MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER", "your_email@gmail.com")
