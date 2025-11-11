from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.controllers.registration_controller import RegistrationController
from app.auth.role_required import role_required

registration_bp = Blueprint("registration_bp", __name__, url_prefix="/api/registrations")


# ✅ Student: Register for an event
@registration_bp.post("/<int:event_id>")
@jwt_required()
@role_required(allowed_roles=["student"])
def register_event(current_user, event_id):
    """
    Register the current user for an event
    ---
    tags:
      - Registrations (Student)
    security:
      - cookieAuth: []
    parameters:
      - in: path
        name: event_id
        type: integer
        required: true
        description: The ID of the event to register for.
    responses:
      200:
        description: Registration successful.
      400:
        description: Event capacity reached or not approved.
      404:
        description: Event not found.
      409:
        description: Already registered.
    """
    return RegistrationController.register_event(current_user.id, event_id)


# ✅ Student: Unregister
@registration_bp.delete("/<int:event_id>")
@jwt_required()
@role_required(allowed_roles=["student"]) 
def unregister_event(current_user, event_id):
    """
    Unregister the current user from an event
    ---
    tags:
      - Registrations (Student)
    security:
      - cookieAuth: []
    parameters:
      - in: path
        name: event_id
        type: integer
        required: true
        description: The ID of the event to unregister from.
    responses:
      200:
        description: Unregistered successfully.
      404:
        description: Registration not found.
    """
    return RegistrationController.unregister_event(current_user.id, event_id)


# ✅ Student: Get events they registered
@registration_bp.get("/my-registrations")
@jwt_required()
@role_required(allowed_roles=["student"])
def my_registrations(current_user):
    """
    Get all registrations for the current user
    ---
    tags:
      - Registrations (Student)
    security:
      - cookieAuth: []
    responses:
      200:
        description: A list of the user's registrations.
    """
    return RegistrationController.get_user_registrations(current_user.id)


# ✅ Admin: View all registrations for an event
@registration_bp.get("/event/<int:event_id>")
@jwt_required()
@role_required(allowed_roles=["admin", "club_admin"])
def event_registrations(event_id, current_user):
    """
    Get all registrations for a specific event
    ---
    tags:
      - Registrations (Admin)
    security:
      - cookieAuth: []
    parameters:
      - in: path
        name: event_id
        type: integer
        required: true
        description: The ID of the event to fetch registrations for.
    responses:
      200:
        description: A list of users registered for the event.
      403:
        description: Forbidden (user is not an admin).
    """
    return RegistrationController.get_event_registrations(event_id, current_user)


# ✅ Admin: Get all registrations with pagination, filtering, and search
@registration_bp.get("/")
@jwt_required()
@role_required(allowed_roles=["admin"])
def get_all_registrations(current_user):
    """
    Get all registrations with pagination, filtering, and search.
    ---
    tags:
      - Registrations (Admin)
    security:
      - cookieAuth: []
    parameters:
      - in: query
        name: page
        type: integer
        description: Page number for pagination.
      - in: query
        name: limit
        type: integer
        description: Number of items per page.
      - in: query
        name: event_id
        type: integer
        description: Filter registrations by a specific event ID.
      - in: query
        name: search
        type: string
        description: Search term to filter by user name or event title.
    responses:
      200:
        description: A paginated list of registrations.
      403:
        description: Forbidden (user is not an admin).
    """
    return RegistrationController.get_all_registrations()


# ✅ Club Admin: Get all registrations for their created events
@registration_bp.get("/my-events-registrations")
@jwt_required()
@role_required(allowed_roles=["club_admin"])
def my_events_registrations(current_user):
    """
    Get all registrations for events created by the current club admin.
    ---
    tags:
      - Registrations (Club Admin)
    security:
      - cookieAuth: []
    responses:
      200:
        description: A list of events, each with a list of registrations.
    """
    return RegistrationController.get_registrations_for_creator_events(current_user.id)
