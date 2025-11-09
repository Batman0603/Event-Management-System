from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.user_controllers import UserController
from app.auth.role_required import role_required
from app.models.user import User

users_bp = Blueprint("users", __name__)

@users_bp.route("/me", methods=["GET"])
@jwt_required()
def get_current_user_profile():
    """
    Get the profile of the current logged-in user
    ---
    tags:
      - Users
    security:
      - Bearer: []
    responses:
      200:
        description: The current user's profile information.
      401:
        description: Unauthorized (invalid or missing token).
    """
    return UserController.get_user_by_id(get_jwt_identity())


# ✅ Admin only
@users_bp.get("/")
@jwt_required()
@role_required(allowed_roles=["admin"])
def get_all_users(current_user):
    """
    Get all users with filtering and pagination
    ---
    tags:
      - Users
    security:
      - Bearer: []
    parameters:
      - in: query
        name: search
        type: string
        description: Search term for user name or email.
      - in: query
        name: role
        type: string
        enum: [ "student", "club_admin", "admin" ]
        description: Filter users by role.
      - in: query
        name: page
        type: integer
        default: 1
        description: The page number for pagination.
      - in: query
        name: per_page
        type: integer
        default: 10
        description: The number of users per page.
    responses:
      200:
        description: A list of all users.
      401:
        description: Unauthorized (invalid or missing token).
      403:
        description: Forbidden (user is not an admin).
    """
    args = request.args.to_dict()
    return UserController.get_all_users(args)


# ✅ Admin OR owner can view
@users_bp.get("/<int:user_id>")
@jwt_required()
@role_required(allowed_roles=["admin"], owner_check=True)
def get_user(current_user, user_id):
    """
    Get a specific user by ID
    ---
    tags:
      - Users
    security:
      - Bearer: []
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
        description: The ID of the user to retrieve.
    responses:
      200:
        description: User data.
      401:
        description: Unauthorized.
      403:
        description: Forbidden (user is not an admin or the owner).
      404:
        description: User not found.
    """
    return UserController.get_user_by_id(user_id)


# ✅ Admin OR owner can update
@users_bp.put("/<int:user_id>")
@jwt_required()
@role_required(allowed_roles=["admin"], owner_check=True)
def update_user(current_user, user_id):
    """
    Update a user's details
    ---
    tags:
      - Users
    security:
      - Bearer: []
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
      - in: body
        name: body
        schema:
          type: object
          properties:
            name:
              type: string
            email:
              type: string
            department:
              type: string
    responses:
      200:
        description: User updated successfully.
      403:
        description: Forbidden (user is not an admin or the owner).
      404:
        description: User not found.
    """
    data = request.get_json() or {}
    return UserController.update_user(user_id, data)


# ✅ Admin only delete any user
@users_bp.delete("/<int:user_id>")
@jwt_required()
@role_required(allowed_roles=["admin"])
def delete_user(current_user, user_id):
    """
    Delete a user
    ---
    tags:
      - Users
    security:
      - Bearer: []
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
    responses:
      200:
        description: User deleted successfully.
      403:
        description: Forbidden (user is not an admin).
      404:
        description: User not found.
    """
    return UserController.delete_user(user_id)
