from flask import Blueprint, jsonify, request, Response
from bson import json_util

from auth.permission import permission_required, Permission
from models.permission_request import PermissionRequest
from models.user import User

admin = Blueprint("admin", __name__, url_prefix='/api')

@admin.route("/admin/users", methods=["GET"])
@permission_required(Permission.ADMIN)
def get_all_non_admin_users():
    users = User.objects(permission__ne=Permission.ADMIN.value)
    json_data = json_util.dumps([user.to_mongo().to_dict() for user in users])

    return Response(json_data, mimetype="application/json")

@admin.route("/admin/permission-requests", methods=["GET"])
@permission_required(Permission.ADMIN)
def get_permission_requests():
    requests = PermissionRequest.objects().order_by("created_at")
    json_data = json_util.dumps([req.to_mongo().to_dict() for req in requests])
    return Response(json_data, mimetype="application/json")


@admin.route("/admin/update-permission", methods=["PATCH"])
@permission_required(Permission.ADMIN)
def update_user_permission():
    data = request.get_json()
    email = data.get("email")
    new_permission = data.get("new_permission")
    if not email or not new_permission:
        return jsonify({"error": "Missing fields"}), 400

    user = User.objects(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    if new_permission not in Permission:
        return jsonify({"error": "Invalid permission"}), 400

    user.permission = new_permission
    user.save()

    PermissionRequest.objects(user=user).delete()

    return jsonify({"message": "User permission updated and request (if any) deleted successfully."})

