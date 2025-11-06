from app import db
from datetime import datetime

class EventStatus:
    PENDING = "pending"
    ACTIVE = "active"
    REJECTED = "rejected"

class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    
    status = db.Column(db.String(20), default=EventStatus.PENDING)
    created_by = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    registrations = db.relationship("Registration", backref="event", lazy=True)
    feedbacks = db.relationship("Feedback", backref="event", lazy=True)
