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
      - Registrations
    security:
      - Bearer: []
    parameters:
      - in: path
        name: event_id
        type: integer
        required: true
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
def unregister_event(event_id, current_user):
    """
    Unregister the current user from an event
    ---
    tags:
      - Registrations
    security:
      - Bearer: []
    parameters:
      - in: path
        name: event_id
        type: integer
        required: true
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
      - Registrations
    security:
      - Bearer: []
    responses:
      200:
        description: A list of the user's registrations.
    """
    return RegistrationController.get_user_registrations(current_user.id)


# ✅ Admin: View all registrations for an event
@registration_bp.get("/event/<int:event_id>")
@jwt_required()
@role_required(allowed_roles=["admin"])
def event_registrations(event_id, current_user):
    """
    Get all registrations for a specific event
    ---
    tags:
      - Registrations (Admin)
    security:
      - Bearer: []
    parameters:
      - in: path
        name: event_id
        type: integer
        required: true
    responses:
      200:
        description: A list of users registered for the event.
      403:
        description: Forbidden (user is not an admin).
    """
    return RegistrationController.get_event_registrations(event_id)
