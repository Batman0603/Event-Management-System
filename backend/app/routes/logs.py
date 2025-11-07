import os
from flask import Blueprint, jsonify, Response, current_app

logs_bp = Blueprint("logs_bp", __name__)


@logs_bp.route("/api/logs", methods=["GET"])
def view_logs():
    """
    View the application log file
    ---
    tags:
      - Diagnostics
    responses:
      200:
        description: The content of the log file.
      404:
        description: Log file not found.
    """
    # Construct the absolute path to the log file from the application's root
    log_file_path = os.path.join(current_app.root_path, '..', 'app.log')

    if not os.path.exists(log_file_path):
        return jsonify({"message": "Log file not found"}), 404

    try:
        with open(log_file_path, 'r') as f:
            log_content = f.read()
        # Manually create a Response object for more control
        return Response(log_content, mimetype='text/plain')
    except Exception as e:
        return jsonify({"message": "Error reading logs", "error": str(e)}), 500
