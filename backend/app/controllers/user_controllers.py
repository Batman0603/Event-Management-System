from app.models.user import User
from app.database import db
from app.utils.response import success_response, error_response
from werkzeug.security import generate_password_hash


class UserController:

    @staticmethod
    def get_all_users():
        users = User.query.all()
        result = [
            {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "department": user.department,
                "role": user.role
            }
            for user in users
        ]
        return success_response("All users fetched", result)

    @staticmethod
    def get_user_by_id(user_id):
        user = User.query.get(user_id)
        if not user:
            return error_response("User not found", 404)

        return success_response("User fetched", {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "department": user.department,
            "role": user.role
        })

    @staticmethod
    def update_user(user_id, data):
        user = User.query.get(user_id)
        if not user:
            return error_response("User not found", 404)

        try:
            if "name" in data:
                user.name = data["name"]
            if "email" in data:
                user.email = data["email"]
            if "department" in data:
                user.department = data["department"]
            if "role" in data:
                user.role = data["role"]
            if "password" in data:
                user.password = generate_password_hash(data["password"])

            db.session.commit()
            return success_response("User updated successfully")
        except Exception as e:
            db.session.rollback()
            return error_response(f"Update failed: {str(e)}", 500)

    @staticmethod
    def delete_user(user_id):
        user = User.query.get(user_id)
        if not user:
            return error_response("User not found", 404)

        try:
            db.session.delete(user)
            db.session.commit()
            return success_response("User deleted successfully")
        except Exception as e:
            db.session.rollback()
            return error_response(f"Delete failed: {str(e)}", 500)
