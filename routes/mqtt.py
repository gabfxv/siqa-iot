from flask import Blueprint, jsonify

from auth.protection import login_required
from mongo.db import db
from utils.logging import logger

mqtt = Blueprint("mqtt", __name__)

@mqtt.route("/messages/<collection>", methods=["GET"])
@login_required
def get_messages_by_collection(collection):
    logger.info(f"Getting messages for collection {collection}")
    messages = list(db[collection].find({}, {"_id": 0}).limit(20))
    return jsonify(messages)