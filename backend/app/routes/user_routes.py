from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.user_controllers import UserController
from app.auth.role_required import role_required
from app.models.user import User

users_bp = Blueprint("users", __name__)

def get_current_user():
    user_id = get_jwt_identity()
    return User.query.get(user_id)


# ✅ Admin only
@users_bp.get("/")
@jwt_required()
@role_required(allowed_roles=["admin"])
def get_all_users(current_user):
    return UserController.get_all_users()


# ✅ Admin OR owner can view
@users_bp.get("/<int:user_id>")
@jwt_required()
@role_required(allowed_roles=["admin"], owner_check=True)
def get_user(current_user, user_id):
    return UserController.get_user_by_id(user_id)


# ✅ Admin OR owner can update
@users_bp.put("/<int:user_id>")
@jwt_required()
@role_required(allowed_roles=["admin"], owner_check=True)
def update_user(current_user, user_id):
    data = request.get_json() or {}
    return UserController.update_user(user_id, data)


# ✅ Admin only delete any user
@users_bp.delete("/<int:user_id>")
@jwt_required()
@role_required(allowed_roles=["admin"])
def delete_user(current_user, user_id):
    return UserController.delete_user(user_id)
