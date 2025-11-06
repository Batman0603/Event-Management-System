from functools import wraps
from flask_jwt_extended import get_jwt_identity
from flask import jsonify, current_app
from app.models.user import User

def role_required(allowed_roles=None, owner_check=False):
    if allowed_roles is None:
        allowed_roles = []

    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            current_user_id = get_jwt_identity()
            current_user = User.query.get(current_user_id)

            if not current_user:
                return jsonify({"message": "Unauthorized"}), 401

            is_authorized_by_role = current_user.role in allowed_roles
            is_owner = False

            if owner_check:
                user_id_from_route = kwargs.get('user_id')
                if user_id_from_route is None:
                    current_app.logger.error(f"role_required with owner_check=True used on route without 'user_id' parameter: {fn.__name__}")
                    return jsonify({"message": "Internal Server Error: Missing user_id for owner check"}), 500
                is_owner = (current_user.id == user_id_from_route)

            if not is_authorized_by_role and not is_owner:
                return jsonify({"message": "Forbidden: Insufficient permissions"}), 403

            return fn(current_user=current_user, *args, **kwargs)
        return wrapper
    return decorator