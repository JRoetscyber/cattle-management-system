import os

# Secret key for sessions
SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-key-for-development-only')

# Database configuration
if os.environ.get('FLASK_ENV') == 'production':
    # PostgreSQL for production
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'postgresql://user:password@localhost/cattle_management')
else:
    # SQLite for development
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///../database/cattle_management.db')

SQLALCHEMY_TRACK_MODIFICATIONS = False