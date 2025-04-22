from authlib.integrations.flask_client import OAuth
import os

def google_config(oauth: OAuth):
    google = oauth.register(
        name='google',
        client_id=os.environ.get("GOOGLE_CLIENT_ID"),
        client_secret=os.environ.get("GOOGLE_CLIENT_SECRET"),
        access_token_url='https://oauth2.googleapis.com/token',
        authorize_url='https://accounts.google.com/o/oauth2/auth',
        api_base_url='https://www.googleapis.com/oauth2/v2/',
        refresh_token_url=None,
        client_kwargs={
            'scope': 'openid email profile'
        },
        jwks_uri='https://www.googleapis.com/oauth2/v3/certs'
    )
    return google