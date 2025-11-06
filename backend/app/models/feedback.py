from app import db
from datetime import datetime

class Feedback(db.Model):
    __tablename__ = "feedback"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    message = db.Column(db.Text, nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # rating 1-5
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref="feedbacks", lazy=True)
