from flask import Blueprint, jsonify, request
from flask import redirect, url_for, session

from auth.permission import permission_required
from auth.providers import get_google
from models.permission_request import PermissionRequest, PermissionRequestChoice
from models.user import User
from utils.logging import logger

auth = Blueprint('auth', __name__, url_prefix='/api')

@auth.route('/login')
def login():
    google = get_google()
    redirect_uri = url_for('auth.authorize', _external=True)
    return google.authorize_redirect(redirect_uri)

@auth.route('/authorize')
def authorize():
    google = get_google()
    token = google.authorize_access_token()
    resp = google.get('userinfo')
    user_info = resp.json()

    email = user_info['email']
    name = user_info['name']

    user = User.objects(email=email).first()

    if not user:
        user = User(name=name, email=email)
        user.save()
        logger.info(f"User {email} created")

    session['user'] = {
        'name': user.name,
        'email': user.email,
        'permission': user.permission
    }

    return redirect('/dashboard')

@auth.route('/logout')
@permission_required()
def logout():
    session.clear()
    return redirect('/')

@auth.route('/request_permission_change', methods=['PATCH'])
@permission_required()
def request_permission_change():
    user_email = session.get('user', {}).get('email')

    if not user_email:
        return jsonify({"error": "User not found in session"}), 400

    user = User.objects(email=user_email).first()

    if not user:
        return jsonify({"error": "User not found in database"}), 404

    requested_permission = request.json.get('requested_permission')

    if requested_permission not in PermissionRequestChoice:
        return jsonify({"error": "Invalid permission requested"}), 400

    permission_request = PermissionRequest(
        user=user,
        requested_permission=requested_permission
    )
    permission_request.save()

    return jsonify({
        "message": "Permission request submitted successfully"
    }), 200

@auth.route("/account", methods=["DELETE"])
@permission_required()
def delete_account():
    user_email = session.get("user", {}).get("email")
    if not user_email:
        return jsonify({"error": "User not found in session"}), 400

    user = User.objects(email=user_email).first()
    if user:
        user.delete()
        logger.info(f"User {user_email} deleted their account.")
    else:
        logger.warning(f"Attempt to delete nonexistent user {user_email}.")

    # Limpar a sessão
    session.clear()

    return jsonify({"message": "Account deleted successfully."}), 200
