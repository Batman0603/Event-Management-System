from datetime import datetime
from app.database import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    
    password_hash = db.Column(db.String(255), nullable=False)
    
    role = db.Column(db.Enum("student", "club_admin", "admin", name="user_roles"), nullable=False, default="student")

    department = db.Column(db.String(100), nullable=True)   # ✅ Department column added

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
