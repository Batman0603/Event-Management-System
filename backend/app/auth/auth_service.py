from werkzeug.security import generate_password_hash, check_password_hash
from app.models.user import User
from app.database import db

def register_user(name, email, password, role, department):
    # Check existing email
    if User.query.filter_by(email=email).first():
        return None, "Email already registered"

    hashed_pw = generate_password_hash(password)

    new_user = User(
        name=name,
        email=email,
        password_hash=hashed_pw,
        role=role,
        department=department
    )

    try:
        db.session.add(new_user)
        db.session.commit()
        return new_user, None
    except Exception as e:
        db.session.rollback()
        return None, str(e)


def authenticate_user(email, password):
    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password_hash, password):
        return None, "Invalid email or password"

    return user, None
