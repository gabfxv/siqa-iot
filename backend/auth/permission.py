import enum
from functools import wraps
from flask import session, jsonify

class Permission(enum.Enum):
    ADMIN = "admin"
    READ_ONLY = "read-only"
    READ_WRITE = "read-write"
    NO_ACCESS = "no-access"

def permission_required(*levels):
    if not levels:
        levels = Permission
    else:
        levels = {level.value for level in levels}

    def decorator(f):
        @wraps(f)
        def wrapped(*args, **kwargs):
            user = session.get("user")
            if not user or user.get("permission") not in levels:
                return jsonify({"error": "Forbidden"}), 403
            return f(*args, **kwargs)
        return wrapped
    return decorator