import os
from datetime import timedelta

# Flask app configuration
DEBUG = True
SECRET_KEY = 'your-secret-key-for-sessions-and-cookies'

# Database configuration
SQLALCHEMY_DATABASE_URI = 'sqlite:///cattle_management.db'
SQLALCHEMY_TRACK_MODIFICATIONS = False

# Session configuration
PERMANENT_SESSION_LIFETIME = timedelta(days=1)
SESSION_TYPE = 'filesystem'
SESSION_COOKIE_NAME = 'cattle_management_session'
SESSION_COOKIE_SECURE = False  # Set to True in production with HTTPS
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = None

# Login manager configuration
LOGIN_DISABLED = False