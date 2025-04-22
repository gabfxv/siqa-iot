from flask import Blueprint, jsonify
import os

info = Blueprint("info", __name__)

@info.route("/whoami")
def whoami():
    return jsonify({"container_id": os.environ.get("HOSTNAME")})