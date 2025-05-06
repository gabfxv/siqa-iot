from mongoengine import Document, StringField, EmailField

from auth.permission import Permission

class User(Document):
    name = StringField(required=True)
    email = EmailField(required=True, unique=True)
    permission = StringField(choices=[p.value for p in Permission], default=Permission.NO_ACCESS.value)