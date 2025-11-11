import os
from flask import Flask
from flask_cors import CORS
from flasgger import Swagger
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

from .config import Config
from .database import init_db, db
from .extensions import mail

# ✅ Import Blueprints
from .routes.auth_routes import auth_bp
from .routes.user_routes import user_bp
from .routes.event_routes import events_bp
from app.routes.registration_routes import registration_bp
from .middlewares.logging_middleware import setup_logging
from .middlewares.security_middleware import security_setup
from app.routes.logs import logs_bp
from app.routes.feedback_routes import feedback_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    mail.init_app(app)

    # Initialize JWT Manager
    jwt = JWTManager(app)

    # Initialize Swagger
    swagger = Swagger(app)

    # ✅ Enable CORS - IMPORTANT: This must come BEFORE route registration
    CORS(
        app,
        supports_credentials=True,
        origins=os.environ.get("CORS_ORIGINS", "http://localhost:5173,http://localhost:5174").split(","),
        allow_headers=["Content-Type", "Authorization"],
        expose_headers=["Set-Cookie"],  # Added: Allow browser to see Set-Cookie header
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    )

    # ✅ Initialize DB + JWT
    init_db(app)

    # ✅ Database Migration Config
    migrate = Migrate(app, db)

    # ✅ Register All Routes (AFTER CORS setup)
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(user_bp)
    app.register_blueprint(events_bp, url_prefix="/api/events")
    app.register_blueprint(registration_bp, url_prefix="/api/registrations")
    app.register_blueprint(logs_bp)
    app.register_blueprint(feedback_bp, url_prefix="/api/feedback")
    
    setup_logging(app)
    security_setup(app)

    @app.route("/")
    def home():
        return {"message": "EventEase API is running ✅"}, 200

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)