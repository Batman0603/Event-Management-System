from flask_jwt_extended import JWTManager

jwt = JWTManager()

def init_jwt(app):
    app.config["JWT_SECRET_KEY"] = "SUPER_SECRET_KEY_123"
    jwt.init_app(app)
