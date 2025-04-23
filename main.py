from authlib.integrations.flask_client import OAuth
from flask import Flask
import threading
import os

from auth.config import google_config
from mqtt.configuration import configure_mqtt_client, mqtt_thread
from routes.admin import admin
from routes.auth import auth
from routes.info import info
from routes.mqtt import mqtt
from utils.initial_admin import create_admin
from utils.logging import logger

def create_app():
    app = Flask(__name__)
    app.secret_key = os.environ.get("SECRET_KEY")

    # OAuth configuration
    oauth = OAuth(app)
    google = google_config(oauth)

    app.extensions['oauth'] = oauth

    # Blueprint registration
    app.register_blueprint(auth)
    app.register_blueprint(mqtt)
    app.register_blueprint(info)
    app.register_blueprint(admin)

    return google, app

def start_mqtt():
    logger.info("Starting MQTT client configuration...")
    mqtt_client = configure_mqtt_client()
    logger.info("Starting MQTT thread...")
    mqtt_thread_instance = threading.Thread(target=mqtt_thread, args=(mqtt_client,), daemon=True)
    mqtt_thread_instance.start()
    logger.info("MQTT thread started")

create_admin()
google, app = create_app()
start_mqtt()