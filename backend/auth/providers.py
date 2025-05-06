from flask import current_app

def get_google():
    oauth = current_app.extensions['oauth']
    return oauth.google