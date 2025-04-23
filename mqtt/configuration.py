import uuid
from time import sleep

import paho.mqtt.client as mqtt

import mqtt.triggers as triggers
from utils.constants import MQTT_CLIENT_ID
from utils.logging import logger


# Thread worker to run MQTT in parallel to the REST API
def mqtt_thread(mqtt_client: mqtt.Client):
    mqtt_client.loop_forever()

# Used to configure authentication and connection with Artemis
def configure_mqtt_client():
    mqtt_client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2, f'{MQTT_CLIENT_ID}-{uuid.uuid4()}')

    mqtt_client.username_pw_set('kapua-sys', 'kapua-password')

    mqtt_client.on_connect = triggers.on_connect
    mqtt_client.on_message = triggers.on_message
    try:
        mqtt_client.connect("broker", 1883, 60)
    except Exception as e:
        logger.error(f"Failed to connect to MQTT broker: {e}")

    return mqtt_client