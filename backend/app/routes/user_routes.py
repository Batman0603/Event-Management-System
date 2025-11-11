from flask import Blueprint, request, jsonify
from app.controllers.user_controller import UserController
from app.auth.role_required import role_required
from flask_jwt_extended import jwt_required
from flask_jwt_extended import get_jwt_identity

user_bp = Blueprint("user_bp", __name__, url_prefix="/api/users")

# ✅ Admin: Update a user
@user_bp.route("/<int:user_id>", methods=["PUT"])
@jwt_required(locations=["cookies"])
@role_required(allowed_roles=["admin"])
def update_user_route(current_user, user_id):
    """
    Admin: Update a user's details.
    ---
    tags:
      - Users (Admin)
    security:
      - cookieAuth: []
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
        description: The ID of the user to update.
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            name: {type: string}
            email: {type: string}
            department: {type: string}
            role: {type: string, enum: ["student", "club_admin", "admin"]}
    responses:
      200: {description: User updated successfully}
      400: {description: Invalid input}
      403: {description: Forbidden (not an admin)}
      404: {description: User not found}
    """
    data = request.get_json()
    return UserController.update_user(user_id, data)

# ✅ Admin: Delete a user
@user_bp.route("/<int:user_id>", methods=["DELETE"])
@jwt_required(locations=["cookies"])
@role_required(allowed_roles=["admin"])
def delete_user_route(current_user, user_id):
    """
    Admin: Delete a user.
    ---
    tags:
      - Users (Admin)
    security:
      - cookieAuth: []
    parameters:
      - in: path
        name: user_id
        type: integer
        required: true
        description: The ID of the user to delete.
    responses:
      200: {description: User deleted successfully}
      400: {description: Cannot delete last admin or self}
      403: {description: Forbidden (not an admin)}
      404: {description: User not found}
    """
    return UserController.delete_user(user_id)

# ✅ Get current user's profile
@user_bp.route("/me", methods=["GET"])
@jwt_required(locations=["cookies"])
def get_my_profile_route():
    """
    Get the profile of the currently authenticated user.
    ---
    tags:
      - Users
    security:
      - cookieAuth: []
    responses:
      200:
        description: User profile fetched successfully.
      401:
        description: Authentication required.
      404:
        description: User not found.
    """
    user_id = get_jwt_identity()
    return UserController.get_my_profile(user_id)


# ✅ Update current user's profile
@user_bp.route("/me", methods=["PUT"])
@jwt_required(locations=["cookies"])
def update_my_profile_route():
    """
    Update the profile of the currently authenticated user.
    ---
    tags:
      - Users
    security:
      - cookieAuth: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            name: {type: string}
            department: {type: string}
    responses:
      200: {description: Profile updated successfully}
      400: {description: Invalid input}
      401: {description: Authentication required}
    """
    user_id = get_jwt_identity()
    data = request.get_json()
    return UserController.update_my_profile(user_id, data)


# ✅ Admin: Get all users
@user_bp.route("/", methods=["GET"])
@jwt_required(locations=["cookies"])
@role_required(allowed_roles=["admin"])
def get_all_users_route(current_user):
    """
    Admin: Get all users with pagination, filtering, and search.
    ---
    tags:
      - Users (Admin)
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
        name: search
        type: string
        description: Search term for name or email.
      - in: query
        name: role
        type: string
        description: Filter users by role.
    responses:
      200: {description: A paginated list of users.}
      403: {description: Forbidden (not an admin)}
    """
    return UserController.get_all_users(current_user)

# ✅ Admin: Create a new user
@user_bp.route("/", methods=["POST"])
@jwt_required(locations=["cookies"])
@role_required(allowed_roles=["admin"])
def create_user_route(current_user):
    """
    Admin: Create a new user.
    ---
    tags:
      - Users (Admin)
    security:
      - cookieAuth: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            name: {type: string}
            email: {type: string}
            password: {type: string}
            department: {type: string}
            role: {type: string, enum: ["student", "club_admin", "admin"]}
    """
    data = request.get_json()
    return UserController.create_user(data)