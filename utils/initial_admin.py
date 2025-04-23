import os

from mongoengine import NotUniqueError

from auth.permission import Permission
from models.user import User
from utils.logging import logger

def create_admin():
    try:
        email = os.environ.get("INITIAL_ADMIN_GOOGLE_EMAIL")

        User.objects(email=email).modify(
            upsert=True,
            new=True,
            set__email=email,
            set__permission=Permission.ADMIN.value,
            set__name=os.environ.get("INITIAL_ADMIN_NAME")
        )
        logger.info("Admin created or already exists.")
    except NotUniqueError:
        logger.info("Admin already exists.")