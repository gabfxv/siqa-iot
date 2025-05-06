from datetime import datetime

from mongoengine import Document, StringField, ReferenceField, DateTimeField
import enum

from models.user import User

class PermissionRequestChoice(enum.Enum):
    ADMIN = "admin"
    READ_ONLY = "read-only"
    READ_WRITE = "read-write"

class PermissionRequest(Document):
    user = ReferenceField(User, required=True)
    requested_permission = StringField(choices=[p.value for p in PermissionRequestChoice], required=True)
    created_at = DateTimeField(default=datetime.now)

    meta = {'collection': 'permission_requests'}