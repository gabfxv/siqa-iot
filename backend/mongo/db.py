from pymongo import MongoClient
from mongoengine import connect
import os

client = MongoClient(os.environ.get('MONGO_URI'))
db = client[os.environ.get('MONGO_DB_NAME')]
connect(os.environ.get('MONGO_DB_NAME'), host='mongo', port=27017)