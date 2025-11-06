from flask import Blueprint, request
from app.controllers.event_controller import EventController
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.auth.role_required import role_required
from app.models.user import User
from app.models.event import Event

events_bp = Blueprint("events", __name__)

# ✅ Student + Admin + Club Admin → Can view events
@events_bp.route("/", methods=["GET"])
@jwt_required()
def get_events():
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)

        if not current_user:
            return {"error": "Unauthorized user"}, 401

        events = Event.query.filter_by(status="active").all()
        result = [event.to_dict() for event in events]

        return {"events": result}, 200

    except Exception as e:
        return {"error": str(e)}, 500

@events_bp.get("/<int:event_id>")
@jwt_required()
def get_event(current_user, event_id):
    return EventController.get_event_by_id(event_id)


# ✅ Admin + Club Admin only → Create Event
@events_bp.post("/create")
@jwt_required()
@role_required(allowed_roles=["admin", "club_admin"])
def create_event(current_user):
    data = request.get_json()
    return EventController.create_event(data, current_user.id)


# ✅ Admin + Club Admin only → Update Event
@events_bp.put("/update/<int:event_id>")
@jwt_required()
@role_required(allowed_roles=["admin", "club_admin"])
def update_event(current_user, event_id):
    data = request.get_json()
    return EventController.update_event(event_id, data)


# ✅ Admin + Club Admin only → Delete Event
@events_bp.delete("/delete/<int:event_id>")
@jwt_required()
@role_required(allowed_roles=["admin", "club_admin"])
def delete_event(current_user, event_id):
    return EventController.delete_event(event_id)

# ✅ ADMIN: Get pending events (for approval dashboard)
@events_bp.get("/pending")
@jwt_required()
@role_required(allowed_roles=["admin"])
def get_pending_events(current_user):
    return EventController.get_pending_events()


# ✅ ADMIN: Approve event
@events_bp.put("/approve/<int:event_id>")
@jwt_required()
@role_required(allowed_roles=["admin"])
def approve_event(current_user, event_id):
    return EventController.approve_event(event_id)


# ✅ ADMIN: Reject Event
@events_bp.put("/reject/<int:event_id>")
@jwt_required()
@role_required(allowed_roles=["admin"])
def reject_event(current_user, event_id):
    data = request.get_json() or {}
    reason = data.get("reason", "No reason provided")
    return EventController.reject_event(event_id, reason)


# ✅ STUDENT Dashboard (Approved + Upcoming Events)
@events_bp.get("/active")
@jwt_required()
@role_required(allowed_roles=["student"])
def active_events(current_user):
    return EventController.get_active_upcoming_events()
    