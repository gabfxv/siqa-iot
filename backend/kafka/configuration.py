import json
from confluent_kafka import KafkaException, KafkaError, Consumer

from mongo.db import db
from utils.constants import TOPICS
from utils.logging import logger

kafka_conf = {
    'bootstrap.servers': 'kafka:9094',
    'group.id': 'temperature-consumer-group',
    'auto.offset.reset': 'latest'
}

def consume_messages(consumer: Consumer):
    try:
        consumer.subscribe(list(TOPICS))
        logger.info(f'Subscribed to {TOPICS}')

        while True:
            msg = consumer.poll(timeout=1.0)
            if msg is None:
                continue
            if msg.error():
                if msg.error().code() == KafkaError._PARTITION_EOF:
                    logger.info(f"End of partition: {msg.partition}, offset: {msg.offset()}")
                else:
                    raise KafkaException(msg.error())
            else:
                topic = msg.topic().split(".")[-1]
                collection = db[topic]

                payload_str = msg.value().decode('utf-8')
                try:
                    payload_dict = json.loads(payload_str)
                except json.JSONDecodeError as e:
                    logger.warning(f"Erro ao decodificar JSON: {e}")

                try:
                    collection.insert_one(payload_dict)
                    logger.info(f"Inserted document into {topic}: {payload_dict}")
                except Exception as e:
                    logger.warning(f"Could not insert document into {topic}: {e}", exc_info=True)

    except KeyboardInterrupt:
        print("Interrupted by user")
    finally:
        consumer.close()
