def success_response(message, data=None, status=200):
    return {"status": "success", "message": message, "data": data}, status

def error_response(message, status=400):
    return {"status": "error", "message": message}, status
