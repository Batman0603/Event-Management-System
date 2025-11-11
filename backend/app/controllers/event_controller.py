from app.models.event import Event
from app.database import db
from app.utils.response import success_response, error_response
from datetime import datetime
from sqlalchemy import or_
from flask_jwt_extended import get_jwt_identity

class EventController:

    @staticmethod
    def create_event(data):
        try:
            user_id = get_jwt_identity()
            if not user_id:
                return error_response("Authentication required", 401)

            required_fields = ["title", "description", "date", "location"]
            if not all(field in data and data[field] for field in required_fields):
                return error_response("Missing required fields", 400)

            new_event = Event(
                title=data.get("title"),
                description=data.get("description"),
                date=datetime.fromisoformat(data.get("date")),
                location=data.get("location"),
                max_seats=int(data.get("max_seats", 100)),
                created_by=user_id,
                status="pending"
            )
            db.session.add(new_event)
            db.session.commit()
            return success_response("Event created & pending for approval", {"id": new_event.id}, 201)

        except Exception as e:
            db.session.rollback()
            return error_response("Error creating event", 500, str(e))

    @staticmethod
    def update_event(event_id, data):
        try:
            event = Event.query.get(event_id)
            if not event:
                return error_response("Event not found", 404)

            event.title = data.get("title", event.title)
            event.description = data.get("description", event.description)

            if data.get("date"):
                event.date = datetime.fromisoformat(data["date"])

            event.location = data.get("location", event.location)
            db.session.commit()
            return success_response("Event updated")

        except Exception as e:
            db.session.rollback()
            return error_response("Error updating event", 500, str(e))

    @staticmethod
    def delete_event(event_id):
        try:
            event = Event.query.get(event_id)
            if not event:
                return error_response("Event not found", 404)

            db.session.delete(event)
            db.session.commit()
            return success_response("Event deleted")

        except Exception as e:
            db.session.rollback()
            return error_response("Error deleting event", 500, str(e))

    @staticmethod
    def get_all_events(args={}):
        query = Event.query

        # Default to approved events, but allow overriding
        status = args.get("status", "approved")
        if status:
            query = query.filter(Event.status == status)

        # Search filter for title and description
        if "search" in args:
            search_term = f"%{args['search']}%"
            query = query.filter(or_(Event.title.ilike(search_term), Event.description.ilike(search_term)))

        # Location filter
        if "location" in args:
            query = query.filter(Event.location.ilike(f"%{args['location']}%"))

        # Pagination
        page = int(args.get("page", 1))
        per_page = int(args.get("per_page", 10))
        paginated_events = query.order_by(Event.date.desc()).paginate(page=page, per_page=per_page, error_out=False)

        serialized_events = [EventController.serialize(e) for e in paginated_events.items]

        pagination_data = {
            "events": serialized_events,
            "pagination": {
                "total_pages": paginated_events.pages,
                "total_items": paginated_events.total,
                "current_page": paginated_events.page,
                "per_page": paginated_events.per_page,
                "has_next": paginated_events.has_next,
                "has_prev": paginated_events.has_prev
            }
        }
        return success_response("Events fetched", pagination_data)

    @staticmethod
    def get_event_by_id(event_id):
        event = Event.query.get(event_id)
        if not event:
            return error_response("Event not found", 404)
        return success_response("Event fetched", EventController.serialize(event))

    @staticmethod
    def serialize(event):
        return {
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "date": event.date.strftime("%Y-%m-%d %H:%M"),
            "location": event.location,
            "status": event.status,
            "created_by": event.created_by,
            "max_seats": event.max_seats,
            "seats_booked": len(event.registrations)
        }

    @staticmethod
    def get_pending_events():
        try:
            events = Event.query.filter_by(status="pending").all()

            if not events:
                return success_response("No pending events found", [])

            result = [
                {
                    "id": event.id,
                    "title": event.title,
                    "description": event.description,
                    "date": event.date.strftime("%Y-%m-%d"),
                    "time": event.date.strftime("%H:%M"),
                    "location": event.location,
                    "status": event.status,
                    "created_by": event.created_by
                }
                for event in events
            ]

            return success_response("Pending events fetched", result)
        except Exception as e:
            return error_response(str(e), 500)

    @staticmethod
    def approve_event(event_id):
        event = Event.query.get(event_id)
        if not event:
            return error_response("Event not found", 404)

        if event.status == "approved":
            return error_response("Event already approved", 400)

        event.status = "approved"
        db.session.commit()
        return success_response("Event approved successfully")

    @staticmethod
    def reject_event(event_id, reason="No reason provided"):
        event = Event.query.get(event_id)
        if not event:
            return error_response("Event not found", 404)

        event.status = "rejected"
        db.session.commit()
        return success_response("Event rejected", {"reason": reason})

    @staticmethod
    def get_active_upcoming_events():
        events = Event.query.filter(Event.status == "approved").all()
        return success_response("Active events fetched",
                                [EventController.serialize(e) for e in events])
