from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate

from .config import Config
from .database import init_db, db
from .auth.jwt_manager import init_jwt

# Blueprints
from .routes.auth_routes import auth_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    init_db(app)
    init_jwt(app)

    # ✅ Initialize Migration support
    Migrate(app, db)

    # ✅ Register Blueprints
    app.register_blueprint(auth_bp, url_prefix="/auth")

    return app
