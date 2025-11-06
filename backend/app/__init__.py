from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate

from .config import Config
from .database import init_db, db
from .auth.jwt_manager import init_jwt
from .extensions import mail

# ✅ Import Blueprints
from .routes.auth_routes import auth_bp
from .routes.user_routes import users_bp
from .routes.event_routes import events_bp
from app.routes.registration_routes import registration_bp
from .middlewares.logging_middleware import setup_logging
from .middlewares.security_middleware import security_setup
from app.routes.logs import logs_bp
from app.routes.feedback_routes import feedback_bp
#from .routes.dashboard_routes import dashboard_bp
#from .routes.registration_routes import registrations_bp  # future APIs
#from .routes.feedback_routes import feedback_bp  # part-E


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize extensions
    mail.init_app(app)

    # ✅ Enable CORS
    CORS(app, supports_credentials=True)

    # ✅ Initialize DB + JWT
    init_db(app)
    init_jwt(app)

    # ✅ Database Migration Config
    migrate = Migrate(app, db)

    # ✅ Register All Routes
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(events_bp, url_prefix="/api/events")
    app.register_blueprint(registration_bp)
    setup_logging(app)
    security_setup(app)
    # Register routes
    app.register_blueprint(logs_bp)
    app.register_blueprint(feedback_bp)

    #app.register_blueprint(dashboard_bp, url_prefix="/api/dashboard")
    #app.register_blueprint(registrations_bp, url_prefix="/api/registrations")
    #app.register_blueprint(feedback_bp, url_prefix="/api/feedback")

    @app.route("/")
    def home():
        return {"message": "EventEase API is running ✅"}, 200

    return app
