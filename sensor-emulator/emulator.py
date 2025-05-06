from tb_rest_client.rest import ApiException
from tb_rest_client.rest_client_ce import *
import paho.mqtt.client as mqtt
from concurrent.futures import ThreadPoolExecutor
import json
import random
import time
import signal
import sys

THINGSBOARD_URL = "http://mytb:9090"
USERNAME = "tenant@thingsboard.org"
PASSWORD = "tenant"
DEVICES = {'temperature'}
BROKER_HOST = "mytb"
BROKER_PORT = 1883
TOPIC = "v1/devices/me/telemetry"

running = True
mqtt_clients = dict()

def signal_handler(sig, frame):
    global running
    print("Encerrando... desconectando MQTT clients.")
    running = False
    for client in mqtt_clients.values():
        client.disconnect()
    sys.exit(0)

def publish_mqtt(sensor, client):
    temperature = round(random.uniform(15, 35), 2)
    while running:
        delta = random.uniform(-0.3, 0.3)
        temperature += delta
        temperature = round(max(15, min(35, temperature)), 2)
        payload = {"value": temperature, "timestamp": int(time.time()), "sensorId": sensor}
        print(f"Publishing MQTT message {payload}")
        client.publish(TOPIC, json.dumps(payload), qos=1)
        time.sleep(5)

if __name__ == "__main__":
    signal.signal(signal.SIGINT, signal_handler)  # Ctrl+C
    signal.signal(signal.SIGTERM, signal_handler)  # docker stop

    credentials = {}
    with RestClientCE(THINGSBOARD_URL) as client:
        try:
            client.login(username=USERNAME, password=PASSWORD)
            for device_name in DEVICES:
                device = client.get_tenant_device(device_name)
                credential = client.get_device_credentials_by_device_id(device.id)
                access_token = credential.credentials_id
                credentials[device_name] = access_token

        except ApiException as e:
            print(f"REST API Exception: {e}")

    for device_name, access_token in credentials.items():
        client = mqtt.Client()
        client.username_pw_set(access_token)
        client.connect(BROKER_HOST, BROKER_PORT, 60)
        mqtt_clients[device_name] = client

    with ThreadPoolExecutor() as executor:
        futures = []
        for device_name, access_token in credentials.items():
            for suffix in [1, 2]:
                sensor = f"{device_name}_{suffix}"
                futures.append(executor.submit(publish_mqtt, sensor, mqtt_clients[device_name]))

        for future in futures:
            future.result()

    for client in mqtt_clients.values():
        client.disconnect()