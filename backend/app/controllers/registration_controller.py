from app.models.registration import Registration
from app.models.event import Event
from app.models.user import User
from app.database import db
from app.utils.response import success_response, error_response

class RegistrationController:

    @staticmethod
    def register_event(user_id, event_id):
        try:
            event = Event.query.get(event_id)
            if not event:
                return error_response("Event not found", 404)

            if event.status != "approved":
                return error_response("Cannot register for this event until approved", 400)

            existing = Registration.query.filter_by(user_id=user_id, event_id=event_id).first()
            if existing:
                return error_response("Already registered", 409)

            registration = Registration(user_id=user_id, event_id=event_id)
            db.session.add(registration)
            db.session.commit()

            return success_response("Event registered successfully")
        except Exception as e:
            db.session.rollback()
            return error_response(f"Registration failed: {str(e)}", 500)

    @staticmethod
    def get_user_registrations(user_id):
        regs = Registration.query.filter_by(user_id=user_id).all()
        data = [
            {
                "event_id": r.event.id,
                "event_title": r.event.title,
                "date": r.event.date,
                "venue": r.event.venue,
                "registered_at": r.registered_at
            }
            for r in regs
        ]
        return success_response("User registrations", data)

    @staticmethod
    def get_event_registrations(event_id):
        regs = Registration.query.filter_by(event_id=event_id).all()
        data = [
            {
                "user_id": r.user.id,
                "user_name": r.user.name,
                "registered_at": r.registered_at
            }
            for r in regs
        ]
        return success_response("Event registrations", data)
