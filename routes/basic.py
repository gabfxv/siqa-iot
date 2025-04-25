from flask import Blueprint, jsonify

from auth.permission import permission_required, Permission
from mongo.db import db
from utils.logging import logger

basic = Blueprint("basic", __name__)

@basic.route("/messages/<collection>", methods=["GET"])
@permission_required(Permission.READ_ONLY, Permission.READ_WRITE, Permission.ADMIN)
def get_messages_by_collection(collection):
    logger.info(f"Getting messages for collection {collection}")
    messages = list(db[collection].find({}, {"_id": 0}).limit(20))
    return jsonify(messages)