from flask import Blueprint
from flask import redirect, url_for, session

from auth.providers import get_google
from utils.logging import logger

auth = Blueprint("auth", __name__)

@auth.route('/login')
def login():
    google = get_google()
    redirect_uri = url_for('auth.authorize', _external=True)
    return google.authorize_redirect(redirect_uri)

@auth.route('/authorize')
def authorize():
    google = get_google()
    token = google.authorize_access_token()
    resp = google.get('userinfo')
    user_info = resp.json()
    session['user'] = user_info
    logger.info(session)
    return redirect('/')

@auth.route('/logout')
def logout():
    session.clear()
    return redirect('/')