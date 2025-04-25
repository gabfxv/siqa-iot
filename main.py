from authlib.integrations.flask_client import OAuth
from confluent_kafka import Consumer
from flask import Flask
import threading
import os
from time import sleep

from auth.config import google_config
from kafka.configuration import kafka_conf, consume_messages
from routes.admin import admin
from routes.auth import auth
from routes.info import info
from routes.basic import basic
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
    app.register_blueprint(basic)
    app.register_blueprint(info)
    app.register_blueprint(admin)

    return google, app

def wait_thingboards_init():
    init_done_flag = "/shared/init_done.flag"

    if not os.path.exists(init_done_flag):
        logger.info("Waiting ThingsBoard initialization to finish...")
        while not os.path.exists(init_done_flag):
            sleep(2)
        logger.info("✅ ThingsBoard successfully initialized!")

def start_kafka():
    wait_thingboards_init()
    logger.info("Creating Kafka consumer...")
    consumer = Consumer(kafka_conf)
    kafka_thread_instance = threading.Thread(target=consume_messages, args=(consumer,), daemon=True)
    kafka_thread_instance.start()
    logger.info("Kafka consumer thread started")

create_admin()
google, app = create_app()
start_kafka()