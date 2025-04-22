from pymongo import MongoClient
import os

client = MongoClient(os.environ.get('MONGO_URI'))  # ou localhost, se for local
db = client[os.environ.get('MONGO_DB_NAME')]