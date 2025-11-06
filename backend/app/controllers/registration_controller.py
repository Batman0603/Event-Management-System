from app.models.registration import Registration
from app.models.event import Event
from app.models.user import User
from app.database import db
from app.utils.response import success_response, error_response
from app.extensions import mail
from flask_mail import Message
from flask import current_app

class RegistrationController:

    @staticmethod
    def register_event(user_id, event_id):
        try:
            event = Event.query.get(event_id)
            if not event:
                return error_response("Event not found", 404)
            
            current_reg_count = len(event.registrations)
            if event.max_seats and current_reg_count >= event.max_seats:
                return error_response("Event capacity reached", 400)

            if event.status != "approved":
                return error_response("Cannot register for this event until approved", 400)

            existing = Registration.query.filter_by(user_id=user_id, event_id=event_id).first()
            if existing:
                return error_response("Already registered", 409)

            registration = Registration(user_id=user_id, event_id=event_id)
            db.session.add(registration)
            db.session.commit()

            # Send registration confirmation email synchronously
            user = User.query.get(user_id)
            if user:
                try:
                    msg = Message(
                        subject="Event Registration Confirmation",
                        sender=current_app.config["MAIL_DEFAULT_SENDER"],
                        recipients=[user.email]
                    )
                    msg.body = f"You have successfully registered for the event: {event.title}"
                    mail.send(msg)
                except Exception as mail_e:
                    # Return a success response but include a warning about the email failure
                    return success_response(
                        "Event registered successfully, but failed to send confirmation email. Please check mail server configuration.",
                        warning=str(mail_e)
                    )

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
                "location": r.event.location,
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

    @staticmethod
    def unregister_event(user_id, event_id):
        try:
            reg = Registration.query.filter_by(user_id=user_id, event_id=event_id).first()
            if not reg:
                return error_response("Not registered for this event", 404)

            db.session.delete(reg)
            db.session.commit()
            return success_response("Unregistered successfully")
        except Exception as e:
            db.session.rollback()
            return error_response(f"Failed: {str(e)}", 500)
