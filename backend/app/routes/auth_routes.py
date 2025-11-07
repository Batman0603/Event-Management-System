from flask import Blueprint, request
from flask_jwt_extended import create_access_token
from app.auth.auth_service import register_user, authenticate_user
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
    data = request.json
    required_fields = ["name", "email", "password", "role", "department"]

    if not all(field in data for field in required_fields):
        return error_response("Missing required fields", 400)

    user, error = register_user(
        data["name"], data["email"], data["password"], data["role"], data["department"]
    )

    if error:
        return error_response(error, 400)

    return success_response("User registered successfully")


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
    data = request.json

    if "email" not in data or "password" not in data:
        return error_response("Email and password required", 400)

    user, error = authenticate_user(data["email"], data["password"])

    if error:
        return error_response(error, 401)

    # The identity for the JWT must be a string.
    # We cast the integer user.id to a string here.
    id = str(user.id)
    token = create_access_token(identity=id)

    user_data = {
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "department": user.department,
        "token": token
    }

    return success_response("Login successful", user_data)
