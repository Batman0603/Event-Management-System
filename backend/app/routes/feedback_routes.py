from flask import Blueprint, request, jsonify
from app import db
from app.models.feedback import Feedback
from app.models.user import User
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.middlewares.security_middleware import admin_required

feedback_bp = Blueprint("feedback_bp", __name__)


# ✅ Submit Feedback (Student Only)
@feedback_bp.route("/api/feedback", methods=["POST"])
@jwt_required()
def submit_feedback():
    """
    Submit feedback for an event
    ---
    tags:
      - Feedback
    security:
      - Bearer: []
    parameters:
      - in: body
        name: body
        required: true
        schema:
          type: object
          required: [ "message", "rating" ]
          properties:
            message:
              type: string
              example: "This was a great event!"
            rating:
              type: integer
              example: 5
              description: A rating from 1 to 5.
    responses:
      201:
        description: Feedback submitted successfully.
    """
    try:
        data = request.get_json()
        message = data.get("message")
        rating = data.get("rating")

        if not message or not rating:
            return jsonify({"error": "Message and rating required"}), 400

        if not (1 <= rating <= 5):
            return jsonify({"error": "Rating must be between 1 and 5"}), 400

        user_id = get_jwt_identity()

        feedback = Feedback(
            user_id=user_id,
            message=message,
            rating=rating
        )
        db.session.add(feedback)
        db.session.commit()

        return jsonify({"message": "Feedback submitted successfully ✅"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Feedback submission failed", "details": str(e)}), 500


# ✅ Admin View All Feedback
@feedback_bp.route("/api/feedback", methods=["GET"])
@admin_required
def get_all_feedback():
    """
    Get all submitted feedback (Admin only)
    ---
    tags:
      - Feedback (Admin)
    parameters:
      - in: header
        name: X-ADMIN-TOKEN
        type: string
        required: true
    responses:
      200:
        description: A list of all feedback submissions.
    """
    try:
        feedback_list = Feedback.query.order_by(Feedback.created_at.desc()).all()

        if not feedback_list:
            return jsonify({"message": "No feedback found"}), 200

        output = []
        for fb in feedback_list:
            output.append({
                "id": fb.id,
                "user_id": fb.user_id,
                "user_name": fb.user.name,
                "rating": fb.rating,
                "message": fb.message,
                "created_at": fb.created_at.strftime("%Y-%m-%d %H:%M:%S")
            })

        return jsonify({"feedback": output}), 200

    except Exception as e:
        return jsonify({"error": "Unable to fetch feedback", "details": str(e)}), 500
