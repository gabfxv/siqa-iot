from flask import Flask
import threading
import time

from mqtt.configuration import configure_mqtt_client, mqtt_thread
from routes.info import info
from routes.mqtt import mqtt
from utils.logging import logger
app = Flask(__name__)
app.register_blueprint(mqtt)
app.register_blueprint(info)

if __name__ == "__main__":
    logger.info("Starting MQTT client configuration...")
    mqtt_client = configure_mqtt_client()
    logger.info("Starting MQTT thread...")
    mqtt_thread = threading.Thread(target=mqtt_thread, args=(mqtt_client,), daemon=True)
    mqtt_thread.start()
    logger.info("MQTT thread started")

    # Wait to make sure the MQTT thread was started
    time.sleep(2)  # Ajuste o tempo conforme necessário