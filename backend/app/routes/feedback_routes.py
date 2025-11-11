from flask import Blueprint, request, jsonify
from app import db
from app.models.feedback import Feedback
from app.models.user import User
from app.models.event import Event
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.registration import Registration
from app.middlewares.security_middleware import admin_required
from app.auth.role_required import role_required
from sqlalchemy.orm import joinedload
from datetime import datetime

feedback_bp = Blueprint("feedback_bp", __name__)

# ✅ Check if feedback exists for an event
@feedback_bp.route("/check/<int:event_id>", methods=["GET"])
@jwt_required(locations=["cookies"])
def check_feedback_exists(event_id):
    """
    Check if feedback exists for an event and if the user can submit it.
    ---
    tags:
      - Feedback (Student)
    security:
      - cookieAuth: []
    parameters:
      - in: path
        name: event_id
        type: integer
        required: true
        description: The ID of the event to check.
    responses:
      200:
        description: Returns whether feedback exists and if submission is allowed.
      500:
        description: Failed to check feedback status.
    """
    try:
        user_id = get_jwt_identity()
        feedback = Feedback.query.filter_by(user_id=user_id, event_id=event_id).first()

        event = Event.query.get(event_id)
        registration = Registration.query.filter_by(user_id=user_id, event_id=event_id).first()

        can_submit = (
            not feedback
            and event
            and event.date < datetime.utcnow()
            and registration is not None
        )

        return jsonify({
            "exists": feedback is not None,
            "can_submit": can_submit
        }), 200

    except Exception as e:
        return jsonify({"error": "Failed to check feedback status", "details": str(e)}), 500


# ✅ Get user's feedbacks
@feedback_bp.route("/user", methods=["GET"])
@jwt_required(locations=["cookies"])
def get_user_feedbacks():
    """
    Get all feedbacks submitted by the current user.
    ---
    tags:
      - Feedback (Student)
    security:
      - cookieAuth: []
    responses:
      200:
        description: A list of the user's feedbacks.
      500:
        description: Failed to fetch feedbacks.
    """
    try:
        user_id = get_jwt_identity()
        feedback_list = (
            Feedback.query
            .filter_by(user_id=user_id)
            .join(Event)
            .options(joinedload(Feedback.event))
            .order_by(Feedback.created_at.desc())
            .all()
        )

        output = [{
            "id": fb.id,
            "event_id": fb.event_id,
            "event_title": fb.event.title,
            "rating": fb.rating,
            "message": fb.message,
            "created_at": fb.created_at.strftime("%Y-%m-%d %H:%M:%S")
        } for fb in feedback_list]

        return jsonify({"feedbacks": output}), 200

    except Exception as e:
        return jsonify({"error": "Failed to fetch feedbacks", "details": str(e)}), 500


# ✅ Submit feedback for an event
@feedback_bp.route("/<int:event_id>", methods=["POST"])
@jwt_required(locations=["cookies"])
def submit_feedback(event_id):
    """
    Submit feedback for a specific event.
    ---
    tags:
      - Feedback (Student)
    security:
      - cookieAuth: []
    parameters:
      - in: path
        name: event_id
        type: integer
        required: true
        description: The ID of the event to give feedback for.
      - in: body
        name: body
        required: true
        schema:
          type: object
          properties:
            rating:
              type: integer
              description: A rating from 1 to 5.
            comment:
              type: string
              description: The user's comment.
    responses:
      201:
        description: Feedback submitted successfully.
      400:
        description: Invalid input or feedback already submitted.
    """
    try:
        data = request.get_json()
        comment = data.get("comment")
        rating = data.get("rating")

        if not comment or rating is None:
            return jsonify({"error": "Comment and rating are required"}), 400

        if not (1 <= rating <= 5):
            return jsonify({"error": "Rating must be between 1 and 5"}), 400

        user_id = get_jwt_identity()

        # Check if user has already submitted feedback
        existing_feedback = Feedback.query.filter_by(user_id=user_id, event_id=event_id).first()
        if existing_feedback:
            return jsonify({"error": "You have already submitted feedback for this event"}), 400

        # Check if user is registered for the event
        registration = Registration.query.filter_by(user_id=user_id, event_id=event_id).first()
        if not registration:
            return jsonify({"error": "You must be registered for the event to submit feedback"}), 400

        # Check if event has passed
        event = Event.query.get(event_id)
        if not event:
            return jsonify({"error": "Event not found"}), 404

        if datetime.utcnow() <= event.date:
            return jsonify({"error": "You can only submit feedback after the event has taken place"}), 400

        feedback = Feedback(
            user_id=user_id,
            message=comment,  # Use the 'comment' from the request for the 'message' field
            event_id=event_id,
            rating=rating
        )
        db.session.add(feedback)
        db.session.commit()

        return jsonify({"message": "Feedback submitted successfully ✅"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Feedback submission failed", "details": str(e)}), 500


# ✅ Admin: Get all feedback
@feedback_bp.route("/", methods=["GET"])
@jwt_required(locations=["cookies"])
def get_all_feedback():
    """
    Admin: Get all feedback with pagination.
    ---
    tags:
      - Feedback (Admin)
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
    responses:
      200:
        description: A paginated list of all feedback.
      403:
        description: Unauthorized access.
      500:
        description: Unable to fetch feedback.
    """
    try:
        # Explicitly check the role from the JWT token
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user or user.role != 'admin':
            return jsonify({"message": "Unauthorized"}), 403

        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)

        pagination = (
            Feedback.query.join(Event)
            .options(joinedload(Feedback.user), joinedload(Feedback.event))
            .order_by(Feedback.created_at.desc())
            .paginate(page=page, per_page=limit, error_out=False)
        )

        feedback_list = pagination.items
        total_feedback = pagination.total


        output = [{
            "id": fb.id,
            "user_id": fb.user_id,
            "user_name": fb.user.name,
            "event_id": fb.event_id,
            "event_title": fb.event.title,
            "rating": fb.rating,
            "message": fb.message,
            "created_at": fb.created_at.strftime("%Y-%m-%d %H:%M:%S")
        } for fb in feedback_list]

        return jsonify({
            "feedback": output,
            "total": total_feedback
        }), 200

    except Exception as e:
        return jsonify({"error": "Unable to fetch feedback", "details": str(e)}), 500


# ✅ Club Admin: Get feedback for their created events
@feedback_bp.route("/my-events-feedback", methods=["GET"])
@jwt_required(locations=["cookies"])
@role_required(allowed_roles=["club_admin"])
def get_feedback_for_my_events(current_user):
    """
    Get all feedback for events created by the current club admin.
    ---
    tags:
      - Feedback (Club Admin)
    security:
      - cookieAuth: []
    responses:
      200:
        description: A list of feedback for the club admin's events.
    """
    try:
        # 1. Find all event IDs created by the current club admin
        event_ids = [event.id for event in Event.query.filter_by(created_by=current_user.id).all()]

        if not event_ids:
            return jsonify({"feedbacks": []}), 200

        # 2. Fetch all feedback for those events
        feedback_list = (
            Feedback.query
            .filter(Feedback.event_id.in_(event_ids))
            .join(User, Feedback.user_id == User.id)
            .join(Event, Feedback.event_id == Event.id)
            .options(joinedload(Feedback.user), joinedload(Feedback.event))
            .order_by(Feedback.created_at.desc())
            .all()
        )

        # 3. Serialize the data
        output = [{"id": fb.id, "event_title": fb.event.title, "user_name": fb.user.name, "rating": fb.rating, "message": fb.message, "created_at": fb.created_at.strftime("%Y-%m-%d %H:%M:%S")} for fb in feedback_list]
        return jsonify({"feedbacks": output}), 200

    except Exception as e:
        return jsonify({"error": "Failed to fetch event feedback", "details": str(e)}), 500
