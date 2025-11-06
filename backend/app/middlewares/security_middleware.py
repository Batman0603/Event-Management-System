from flask import request, jsonify
from functools import wraps
import time

# Admin API token — change it!
ADMIN_TOKEN = "admin123"

# Rate limiting config
RATE_LIMIT = 50  # max requests
TIME_WINDOW = 60  # seconds

request_times = {}

def security_setup(app):

    @app.before_request
    def rate_limit():
        user_ip = request.remote_addr
        now = time.time()

        if user_ip not in request_times:
            request_times[user_ip] = []
        
        request_times[user_ip] = [
            t for t in request_times[user_ip] if now - t < TIME_WINDOW
        ]

        if len(request_times[user_ip]) >= RATE_LIMIT:
            return jsonify({"error": "Too many requests, slow down"}), 429

        request_times[user_ip].append(now)


def admin_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        token = request.headers.get("X-ADMIN-TOKEN")
        if token != ADMIN_TOKEN:
            return jsonify({"message": "Unauthorized"}), 403
        return f(*args, **kwargs)
    return wrapper
