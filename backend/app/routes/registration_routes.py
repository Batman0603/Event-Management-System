from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from app.controllers.registration_controller import RegistrationController
from app.auth.role_required import role_required

registration_bp = Blueprint("registration_bp", __name__, url_prefix="/api/registrations")


# ✅ Student: Register for an event
@registration_bp.post("/<int:event_id>")
@jwt_required()
@role_required(allowed_roles=["student"])
def register_event(event_id, current_user):
    return RegistrationController.register_event(current_user.id, event_id)


# ✅ Student: Get events they registered
@registration_bp.get("/my-registrations")
@jwt_required()
@role_required(allowed_roles=["student"])
def my_registrations(current_user):
    return RegistrationController.get_user_registrations(current_user.id)


# ✅ Admin: View all registrations for an event
@registration_bp.get("/event/<int:event_id>")
@jwt_required()
@role_required(allowed_roles=["admin"])
def event_registrations(event_id, current_user):
    return RegistrationController.get_event_registrations(event_id)
