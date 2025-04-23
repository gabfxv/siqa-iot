import json

from mongo.db import db
from utils.logging import logger
from utils.constants import TOPICS, SHARED_SUBSCRIPTION_GROUP


def on_connect(client, userdata, flags, rc, properties=None):
    logger.info("Connected to MQTT broker with result code " + str(rc))
    for topic in TOPICS:
        # Shared Subscription Group is the equivalent of consumer group in Kafka
        # It allows for horizontal scalability when consuming from Artemis, without the chance of duplication between servers
        # QOS=1: at least once message delivery
        client.subscribe(f"$share/{SHARED_SUBSCRIPTION_GROUP}/{topic}", qos=1)

def on_message(client, userdata, msg):
    logger.info(f"Message received: {msg.payload.decode()} on topic {msg.topic}")
    try:
        payload = json.loads(msg.payload.decode())
    except json.decoder.JSONDecodeError:
        logger.warning("Received non-JSON message.")

    logger.info("Topic: " + msg.topic)
    topic = msg.topic.split("/")[-1]
    collection = db[topic]

    document = {
        "message": payload
    }

    try:
        collection.insert_one(document)
        logger.info(f"Inserted document into {topic}: {document}")
    except Exception as e:
        logger.warning(f"Could not insert document into {topic}: {e}", exc_info=True)