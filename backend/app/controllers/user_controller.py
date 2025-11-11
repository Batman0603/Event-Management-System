from app.models.user import User
from app.database import db
from app.utils.response import success_response, error_response
from flask import request
from app.models.event import Event
from app.models.registration import Registration
from app.models.feedback import Feedback
from werkzeug.security import generate_password_hash

class UserController:

    @staticmethod
    def update_user(user_id, data):
        try:
            user = User.query.get(user_id)
            if not user:
                return error_response("User not found", 404)

            # Update fields if provided
            user.name = data.get("name", user.name)
            user.email = data.get("email", user.email)
            user.department = data.get("department", user.department)
            user.role = data.get("role", user.role)

            db.session.commit()
            return success_response("User updated successfully", {"id": user.id, "name": user.name, "email": user.email, "role": user.role})

        except Exception as e:
            db.session.rollback()
            return error_response(f"Failed to update user: {str(e)}", 500)

    @staticmethod
    def delete_user(user_id):
        try:
            user = User.query.get(user_id)
            if not user:
                return error_response("User not found", 404)

            # Prevent deleting the last admin user
            if user.role == 'admin' and User.query.filter_by(role='admin').count() == 1:
                return error_response("Cannot delete the last admin user", 400)

            # Handle related records before deleting the user
            # 1. Delete user's registrations
            Registration.query.filter_by(user_id=user_id).delete()
            # 2. Delete user's feedback
            Feedback.query.filter_by(user_id=user_id).delete()
            # 3. Nullify events created by the user (or reassign them)
            Event.query.filter_by(created_by=user_id).update({"created_by": None})

            # Now, it's safe to delete the user
            db.session.delete(user)
            db.session.commit()
            return success_response("User deleted successfully")

        except Exception as e:
            db.session.rollback()
            return error_response(f"Failed to delete user: {str(e)}", 500)

    @staticmethod
    def update_my_profile(user_id, data):
        try:
            user = User.query.get(user_id)
            if not user:
                return error_response("User not found", 404)

            # Users can update their name and department
            user.name = data.get("name", user.name)
            user.department = data.get("department", user.department)

            db.session.commit()
            return success_response("Profile updated successfully", {"name": user.name, "department": user.department})
        except Exception as e:
            db.session.rollback()
            return error_response(f"Failed to update profile: {str(e)}", 500)

    @staticmethod
    def get_my_profile(user_id):
        try:
            user = User.query.get(user_id)
            if not user:
                return error_response("User not found", 404)
            
            return success_response("User profile fetched", {"id": user.id, "name": user.name, "email": user.email, "department": user.department, "role": user.role})
        except Exception as e:
            return error_response(f"Failed to fetch user profile: {str(e)}", 500)

    @staticmethod
    def get_all_users(current_user):
        try:
            # The @admin_required decorator handles the primary role check.
            # This is an extra safeguard.
            if not current_user or current_user.role != 'admin':
                return error_response("Unauthorized", 403)

            # Pagination parameters
            page = request.args.get('page', 1, type=int)
            limit = request.args.get('limit', 10, type=int)

            # Filtering and searching parameters
            search_term = request.args.get('search', type=str)
            role_filter = request.args.get('role', type=str)

            query = User.query

            # Apply role filter
            if role_filter:
                query = query.filter_by(role=role_filter)

            # Apply search filter (by name or email)
            if search_term:
                from sqlalchemy import or_
                search_pattern = f"%{search_term}%"
                query = query.filter(
                    or_(
                        User.name.ilike(search_pattern),
                        User.email.ilike(search_pattern)
                    )
                )

            # Execute query with pagination
            paginated_users = query.order_by(User.name.asc()).paginate(page=page, per_page=limit, error_out=False)

            users = paginated_users.items
            total = paginated_users.total

            data = [{
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "department": user.department,
                "role": user.role
            } for user in users]

            return success_response("Users fetched successfully", {"users": data, "total": total, "page": page, "pages": paginated_users.pages})

        except Exception as e:
            return error_response(f"Failed to fetch users: {str(e)}", 500)

    @staticmethod
    def create_user(data):
        try:
            email = data.get("email")
            password = data.get("password")
            name = data.get("name")
            role = data.get("role", "student")
            department = data.get("department")

            if not all([email, password, name, department]):
                return error_response("Missing required fields: name, email, password, department", 400)

            if User.query.filter_by(email=email).first():
                return error_response("Email address already in use", 409)

            new_user = User(
                email=email,
                name=name,
                role=role,
                department=department
            )
            # Set and hash the password before saving
            new_user.set_password(password)

            db.session.add(new_user)
            db.session.commit()

            return success_response("User created successfully", {"id": new_user.id, "name": new_user.name, "email": new_user.email, "role": new_user.role}, 201)
        except Exception as e:
            db.session.rollback()
            return error_response(f"Failed to create user: {str(e)}", 500)