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
@role_required(allowed_roles=["student", "admin", "club_admin"])
def get_events(current_user):
    """
    Get all approved events with filtering and pagination
    ---
    tags:
      - Events
    security:
      - Bearer: []
    parameters:
      - in: query
        name: search
        type: string
        description: Search term for event title or description.
      - in: query
        name: location
        type: string
        description: Filter events by location.
      - in: query
        name: page
        type: integer
        default: 1
        description: The page number for pagination.
      - in: query
        name: per_page
        type: integer
        default: 10
        description: The number of events per page.
    responses:
      200:
        description: A list of approved events.
      401:
        description: Unauthorized.
    """
    # Get query parameters from request
    args = request.args.to_dict()
    return EventController.get_all_events(args)

@events_bp.get("/<int:event_id>")
@jwt_required()
@role_required(allowed_roles=["student", "admin", "club_admin"])
def get_event(current_user, event_id):
    """
    Get a specific event by ID
    ---
    tags:
      - Events
    security:
      - Bearer: []
    parameters:
      - in: path
        name: event_id
        type: integer
        required: true
    responses:
      200:
        description: The event details.
      401:
        description: Unauthorized.
      404:
        description: Event not found.
    """
    return EventController.get_event_by_id(event_id)


# ✅ Admin + Club Admin only → Create Event
@events_bp.post("/create")
@jwt_required()
@role_required(allowed_roles=["admin", "club_admin"])
def create_event(current_user):
    """
    Create a new event (status will be 'pending')
    ---
    tags:
      - Events
    security:
      - Bearer: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [ "title", "description", "date", "location" ]
          properties:
            title:
              type: string
              example: "Annual Tech Fest"
            description:
              type: string
              example: "A festival of technology and innovation."
            date:
              type: string
              example: "2025-12-20 10:00"
            location:
              type: string
              example: "Main Auditorium"
    responses:
      200:
        description: Event created and awaiting approval.
    """
    data = request.get_json()
    return EventController.create_event(data, current_user.id)


# ✅ Admin + Club Admin only → Update Event
@events_bp.put("/update/<int:event_id>")
@jwt_required()
@role_required(allowed_roles=["admin", "club_admin"])
def update_event(current_user, event_id):
    """
    Update an existing event
    ---
    tags:
      - Events
    security:
      - Bearer: []
    parameters:
      - in: path
        name: event_id
        type: integer
        required: true
      - in: body
        name: body
        schema:
          type: object
          properties:
            title:
              type: string
            description:
              type: string
    responses:
      200:
        description: Event updated successfully.
    """
    data = request.get_json()
    return EventController.update_event(event_id, data)


# ✅ Admin + Club Admin only → Delete Event
@events_bp.delete("/delete/<int:event_id>")
@jwt_required()
@role_required(allowed_roles=["admin", "club_admin"])
def delete_event(current_user, event_id):
    """
    Delete an event
    ---
    tags:
      - Events
    security:
      - Bearer: []
    parameters:
      - in: path
        name: event_id
        type: integer
        required: true
    responses:
      200:
        description: Event deleted successfully.
    """
    return EventController.delete_event(event_id)

# ✅ ADMIN: Get pending events (for approval dashboard)
@events_bp.get("/pending")
@jwt_required()
@role_required(allowed_roles=["admin"])
def get_pending_events(current_user):
    """
    Get all events with 'pending' status
    ---
    tags:
      - Events (Admin)
    security:
      - Bearer: []
    responses:
      200:
        description: A list of pending events.
      403:
        description: Forbidden (user is not an admin).
    """
    return EventController.get_pending_events()


# ✅ ADMIN: Approve event
@events_bp.put("/approve/<int:event_id>")
@jwt_required()
@role_required(allowed_roles=["admin"])
def approve_event(current_user, event_id):
    """
    Approve a pending event
    ---
    tags:
      - Events (Admin)
    security:
      - Bearer: []
    parameters:
      - in: path
        name: event_id
        type: integer
        required: true
    responses:
      200:
        description: Event approved successfully.
    """
    return EventController.approve_event(event_id)


# ✅ ADMIN: Reject Event
@events_bp.put("/reject/<int:event_id>")
@jwt_required()
@role_required(allowed_roles=["admin"])
def reject_event(current_user, event_id):
    """
    Reject a pending event
    ---
    tags:
      - Events (Admin)
    security:
      - Bearer: []
    parameters:
      - in: path
        name: event_id
        type: integer
        required: true
      - in: body
        name: body
        schema:
          type: object
          properties:
            reason:
              type: string
    responses:
      200:
        description: Event rejected successfully.
    """
    data = request.get_json() or {}
    reason = data.get("reason", "No reason provided")
    return EventController.reject_event(event_id, reason)


# ✅ STUDENT Dashboard (Approved + Upcoming Events)
@events_bp.get("/active")
@jwt_required()
@role_required(allowed_roles=["student", "admin", "club_admin"])
def active_events(current_user):
    """
    Get active and upcoming approved events
    ---
    tags:
      - Events
    security:
      - Bearer: []
    responses:
      200:
        description: A list of active and upcoming events.
    """
    return EventController.get_active_upcoming_events()


# ✅ Club Admin: Get events created by the current user
@events_bp.get("/my-events")
@jwt_required()
@role_required(allowed_roles=["club_admin", "admin"])
def get_my_created_events(current_user):
    """
    Get all events created by the current user
    ---
    tags:
      - Events
    security:
      - Bearer: []
    responses:
      200:
        description: A list of events created by the user.
      403:
        description: Forbidden.
    """
    return EventController.get_events_by_creator_id(current_user.id)
    