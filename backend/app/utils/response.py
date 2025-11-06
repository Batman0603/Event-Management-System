from flask import jsonify

def success_response(message, data=None, status_code=200, warning=None):
    """
    Creates a standardized success JSON response.
    """
    response = {
        "status": "success",
        "message": message,
    }
    if data is not None:
        response["data"] = data
    if warning is not None:
        response["warning"] = warning
    return jsonify(response), status_code

def error_response(message, status_code=400, error_details=None):
    """
    Creates a standardized error JSON response.
    """
    response = {
        "status": "error",
        "message": message,
    }
    if error_details is not None:
        response["error_details"] = error_details
    return jsonify(response), status_code