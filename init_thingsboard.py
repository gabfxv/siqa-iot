from time import sleep, time
import json
import uuid
import socket
import os

from tb_rest_client.rest import ApiException
from tb_rest_client.rest_client_ce import *
from confluent_kafka.admin import AdminClient, NewTopic

THINGSBOARD_URL = "http://mytb:9090"
USERNAME = "tenant@thingsboard.org"
PASSWORD = "tenant"
DEVICE_NAME = "temperature"
RULE_CHAIN_PATH = "/config/temperature-rule-chain.json"
FLAG_PATH="/shared/init_done.flag"

def wait_for_kafka(host="kafka", port=9094, timeout=60):
    print("⏳ Waiting for Kafka to be ready...")
    start_time = time()
    while time() - start_time < timeout:
        try:
            with socket.create_connection((host, port), timeout=2):
                print("✅ Kafka is up!")
                return
        except (socket.timeout, ConnectionRefusedError):
            sleep(2)
    raise TimeoutError("❌ Kafka did not become ready in time.")

def create_topic(topic_name):
    admin = AdminClient({'bootstrap.servers': 'kafka:9094'})
    new_topic = NewTopic(topic_name, num_partitions=4, replication_factor=1)
    fs = admin.create_topics([new_topic], request_timeout=15)

    for topic, f in fs.items():
        try:
            f.result()
            print(f"Topic {topic} successfully created")
        except Exception as e:
            print(f"Topic {topic}: {e}")

def wait_for_thingsboard(timeout=120):
    print("⏳ Esperando o ThingsBoard estar realmente pronto para login...")
    start_time = time()

    while time() - start_time < timeout:
        try:
            with RestClientCE(THINGSBOARD_URL) as client:
                client.login(USERNAME, PASSWORD)
                print("✅ Login successful! ThingsBoard is ready.")
                return
        except ApiException as e:
            print(f"🕐 Still not ready: {e.reason} ({e.status})")
        except Exception as e:
            print(f"🕐 Waiting... {e}")
        sleep(3)

    raise TimeoutError("❌ Timeout: ThingsBoard was not ready for login in a timely manner.")

def create_device(client):
    print(f"🛠️ Creating device '{DEVICE_NAME}'...")
    default_device_profile_id = client.get_default_device_profile_info().id

    device = Device(name=DEVICE_NAME, device_profile_id=default_device_profile_id)
    try:
        client.save_device(device)
        print("✅ Device created.")
    except ApiException as e:
        if "already exists" in str(e.body):
            print("⚠️ Device already exists.")
        else:
            raise

def import_rule_chain(client):
    print("Importing rule chain...")
    with open(RULE_CHAIN_PATH) as f:
        raw = json.load(f)

    rule_chain_id = str(uuid.uuid4())

    raw["ruleChain"]["id"] = {
        "id": rule_chain_id,
        "entityType": "RULE_CHAIN"
    }

    raw["metadata"]["ruleChainId"] = {
        "id": rule_chain_id,
        "entityType": "RULE_CHAIN"
    }

    data = RuleChainData(
        rule_chains=[raw["ruleChain"]],
        metadata=[raw["metadata"]]
    )

    try:
        results = client.import_rule_chains(body=data, overwrite=True)
        rule_chain_id = results[0].rule_chain_id
        client.set_root_rule_chain(rule_chain_id=rule_chain_id)
        print("✅ Rule chain imported.")
        topic_pattern = raw["metadata"]["nodes"][1]["configuration"]["topicPattern"]
        print(f"Creating topic {topic_pattern}...")
        create_topic(topic_pattern)
    except ApiException as e:
        print(f"Failed to import rule chain: {e.body}")
        raise

def delete_flag():
    if os.path.exists(FLAG_PATH):
        os.remove(FLAG_PATH)
        print(f"🧹 File {FLAG_PATH} deleted.")

def create_flag():
    with open(FLAG_PATH, "w") as f:
        f.write("ok")
        print(f"🧹 File {FLAG_PATH} created.")

if __name__ == "__main__":
    delete_flag()
    wait_for_kafka()
    wait_for_thingsboard()

    with RestClientCE(THINGSBOARD_URL) as client:
        client.login(USERNAME, PASSWORD)
        create_device(client)
        import_rule_chain(client)
        create_flag()