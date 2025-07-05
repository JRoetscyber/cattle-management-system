from app import app
from extensions import db
from models.user import User
from models.animal import Animal, Breed
from models.health import HealthRecord, Vaccination, Treatment
import datetime

def init_db():
    """Initialize the database with some sample data"""
    # Create all tables
    with app.app_context():
        # Check if admin user exists
        if User.query.filter_by(username='admin').first() is None:
            # Rest of your initialization code remains the same
            print("Database initialized with sample data")
        else:
            print("Database already contains data")

if __name__ == '__main__':
    init_db()