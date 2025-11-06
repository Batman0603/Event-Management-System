import logging
from flask import request

def setup_logging(app):
    logging.basicConfig(
        filename="app.log",
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s"
    )

    @app.before_request
    def log_request():
        logging.info(f"Request: {request.method} {request.path}")

    @app.after_request
    def log_response(response):
        logging.info(f"Response: {response.status_code} {request.method} {request.path}")
        return response
