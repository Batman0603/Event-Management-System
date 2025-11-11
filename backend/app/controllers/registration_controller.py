from app.models.registration import Registration
from app.models.event import Event
from app.models.user import User
from app.database import db
from app.utils.response import success_response, error_response
from app.extensions import mail
from flask_mail import Message
from flask import current_app, request
from sqlalchemy import or_

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
                "id": r.id,
                "event": {
                    "id": r.event.id,
                    "title": r.event.title,
                    "description": r.event.description,
                    "date": r.event.date.isoformat(),
                    "location": r.event.location,
                    "max_seats": r.event.max_seats,
                    "seats_booked": len(r.event.registrations)
                },
                "registered_at": r.registered_at
            }
            for r in regs
        ]
        return success_response("User registrations", data)

    @staticmethod
    def get_event_registrations(event_id, current_user):
        # Authorization check for club_admin
        if current_user.role == 'club_admin':
            event = Event.query.get(event_id)
            if not event:
                return error_response("Event not found", 404)
            if event.created_by != current_user.id:
                return error_response("Forbidden: You can only view registrations for your own events", 403)

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

    @staticmethod
    def get_all_registrations():
        try:
            from flask_jwt_extended import get_jwt_identity
            
            # Security check for admin role
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            if not user or user.role != 'admin':
                return error_response("Unauthorized access", 403)

            # Pagination parameters
            page = request.args.get('page', 1, type=int)
            limit = request.args.get('limit', 10, type=int)

            # Filtering and searching parameters
            event_id = request.args.get('event_id', type=int)
            search_term = request.args.get('search', type=str)

            # Base query
            # Using explicit joins for clarity and correctness
            query = db.session.query(Registration).join(
                User, Registration.user_id == User.id
            ).join(
                Event, Registration.event_id == Event.id)

            # Apply filters
            if event_id:
                query = query.filter(Registration.event_id == event_id)

            # Apply search
            if search_term:
                search_pattern = f"%{search_term}%"
                query = query.filter(
                    or_(
                        User.name.ilike(search_pattern),
                        Event.title.ilike(search_pattern)
                    )
                )

            # Execute query with pagination
            paginated_regs = query.order_by(Registration.registered_at.desc()).paginate(page=page, per_page=limit, error_out=False)
            
            registrations = paginated_regs.items
            total = paginated_regs.total

            data = [{
                "registration_id": reg.id,
                "user_name": reg.user.name,
                "event_title": reg.event.title,
                "registered_at": reg.registered_at.isoformat()
            } for reg in registrations]

            response_data = {
                "registrations": data,
                "total": total,
                "page": page,
                "pages": paginated_regs.pages
            }
            return success_response("All registrations fetched", response_data)

        except Exception as e:
            return error_response(f"Failed to fetch registrations: {str(e)}", 500)

    @staticmethod
    def get_registrations_for_creator_events(user_id):
        """Fetches all registrations for all events created by a specific user."""
        try:
            # Find all events created by the club admin
            events = Event.query.filter_by(created_by=user_id).all()
            if not events:
                return success_response("No events found for this creator.", [])

            event_ids = [event.id for event in events]

            # Find all registrations for those events
            registrations = Registration.query.join(
                User, Registration.user_id == User.id
            ).filter(
                Registration.event_id.in_(event_ids)).all()

            # Group registrations by event
            event_registrations = {event.id: {"title": event.title, "registrations": []} for event in events}
            for reg in registrations:
                event_registrations[reg.event_id]["registrations"].append({
                    "user_name": reg.user.name,
                    "registered_at": reg.registered_at.isoformat()
                })

            return success_response("Registrations for creator's events fetched", {"data": list(event_registrations.values())})
        except Exception as e:
            return error_response(f"Failed to fetch registrations: {str(e)}", 500)
