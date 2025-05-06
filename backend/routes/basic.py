from flask import Blueprint, jsonify, request

from auth.permission import permission_required, Permission
from mongo.db import db
from utils.logging import logger

basic = Blueprint("basic", __name__, url_prefix='/api')

@basic.route("/messages/<collection>", methods=["GET"])
@permission_required(Permission.READ_ONLY, Permission.READ_WRITE, Permission.ADMIN)
def get_messages_by_collection(collection):
    logger.info(f"Getting messages for collection {collection}")

    size = request.args.get('size')
    if not size:
        size = 2000

    messages = list(db[collection].find({}, {"_id": 0}).limit(size))
    return jsonify(messages)

@basic.route("/messages/<collection>/<sensor>", methods=["GET"])
@permission_required(Permission.READ_ONLY, Permission.READ_WRITE, Permission.ADMIN)
def get_messages_by_sensor(collection, sensor):
    logger.info(f"Getting messages for sensor {sensor}")

    size = request.args.get('size')
    if not size:
        size = 2000

    messages = list(db[collection].find({"sensorId": sensor}, {"_id": 0}).limit(size))
    return jsonify(messages)
