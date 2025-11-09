from flask import Blueprint, request, jsonify
from flask_jwt_extended import (
    create_access_token,
    set_access_cookies,
    create_refresh_token, set_refresh_cookies,
    unset_jwt_cookies,
    jwt_required,
    get_jwt_identity,
)
from app.auth.auth_service import register_user, authenticate_user
from app.models.user import User
from app.utils.response import success_response, error_response

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    """
    Register a new user
    ---
    tags:
      - Authentication
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [ "name", "email", "password", "role", "department" ]
          properties:
            name:
              type: string
              example: "Karthi"
            email:
              type: string
              example: "karthi@example.com"
            password:
              type: string
              example: "securepassword123"
            role:
              type: string
              enum: [ "student", "club_admin", "admin" ]
              example: "student"
            department:
              type: string
              example: "Computer Science"
    responses:
      200:
        description: User registered successfully
      400:
        description: Missing fields or email already registered
    """
    data = request.get_json()
    required_fields = ["name", "email", "password", "role", "department"]

    if not all(field in data for field in required_fields):
        return error_response("Missing required fields", 400)

    user, error = register_user(
        data["name"], data["email"], data["password"], data["role"], data["department"]
    )

    if error:
        return error_response(error, 400)

    # Create the tokens we will be sending back to the user
    identity = str(user.id)
    access_token = create_access_token(identity=identity)
    refresh_token = create_refresh_token(identity=identity)

    response = jsonify({
        "message": "User registered successfully",
        "access_token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "department": user.department,
        }
    })
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)
    return response, 201


@auth_bp.route("/login", methods=["POST"])
def login():
    """
    Log in a user
    ---
    tags:
      - Authentication
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [ "email", "password" ]
          properties:
            email:
              type: string
              example: "karthi@example.com"
            password:
              type: string
              example: "securepassword123"
    responses:
      200:
        description: Login successful, returns user data and JWT token
      401:
        description: Invalid email or password
    """
    data = request.get_json()

    if "email" not in data or "password" not in data:
        return error_response("Email and password required", 400)

    user, error = authenticate_user(data["email"], data["password"])

    if error:
        return error_response(error, 401)

    # The identity for the JWT must be a string.
    # We cast the integer user.id to a string here.
    id = str(user.id)
    access_token = create_access_token(identity=id, fresh=True)
    refresh_token = create_refresh_token(identity=id)

    response = jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "department": user.department,
        },
    })
    set_access_cookies(response, access_token)
    set_refresh_cookies(response, refresh_token)
    return response, 200


@auth_bp.route("/verify-token", methods=["GET"])
@jwt_required()
def verify_token():
    """
    Verify JWT token and return user info
    ---
    tags:
      - Authentication
    security:
      - Bearer: []
    responses:
      200:
        description: Token is valid, returns user information.
      401:
        description: Token is invalid or expired.
      404:
        description: User not found.
    """
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return error_response("User not found", 404)

        user_data = {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role,
            "department": user.department,
        }

        return success_response(
            "Token is valid", {"authenticated": True, "user": user_data}
        )
    except Exception as e:
        return error_response(f"An error occurred: {str(e)}", 500)


@auth_bp.route("/logout", methods=["POST"])
def logout():
    """
    Log out a user by unsetting the JWT cookie
    ---
    tags:
      - Authentication
    responses:
      200:
        description: Logout successful.
    """
    try:
        response = jsonify({"message": "Logged out successfully"})
        unset_jwt_cookies(response)
        return response, 200
    except Exception as e:
        # This is a simple operation, but it's good practice to handle potential errors.
        return error_response(f"An error occurred during logout: {str(e)}", 500)
