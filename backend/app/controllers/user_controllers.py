from app.models.user import User
from app.database import db
from app.utils.response import success_response, error_response
from werkzeug.security import generate_password_hash
from sqlalchemy import or_


class UserController:

    @staticmethod
    def get_all_users(args={}):
        query = User.query

        # Search filter for name and email
        if args.get("search"): # Only apply if search term is not empty
            search_term = f"%{args['search']}%"
            query = query.filter(or_(User.name.ilike(search_term), User.email.ilike(search_term)))

        # Role filter
        if args.get("role"): # Only apply if role is not empty
            query = query.filter(User.role == args['role'])

        # Department filter
        if args.get("department"): # Only apply if department is not empty
            query = query.filter(User.department.ilike(f"%{args['department']}%"))

        # Pagination
        page = int(args.get("page", 1))
        per_page = int(args.get("per_page", 10))
        paginated_users = query.order_by(User.name.asc()).paginate(page=page, per_page=per_page, error_out=False)

        serialized_users = [
            {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "department": user.department,
                "role": user.role
            }
            for user in paginated_users.items]

        pagination_data = {
            "users": serialized_users,
            "pagination": {
                "total_pages": paginated_users.pages,
                "total_items": paginated_users.total,
                "current_page": paginated_users.page,
                "per_page": paginated_users.per_page,
                "has_next": paginated_users.has_next,
                "has_prev": paginated_users.has_prev
            }
        }
        return success_response("All users fetched", pagination_data)

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
