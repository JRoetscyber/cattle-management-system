from app import app
from extensions import db
from models.user import User
import datetime

def add_user(username, password, email, first_name, last_name, role='admin'):
    with app.app_context():
        # Check if user already exists
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            print(f"User {username} already exists")
            return False
        
        # Create new user
        user = User(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            role=role
        )
        user.set_password(password)
        
        db.session.add(user)
        db.session.commit()
        
        print(f"User {username} created successfully")
        return True

if __name__ == "__main__":
    # Create JRoetscyber user
    add_user(
        username="JRoetscyber",
        password="password123",
        email="jroetscyber@example.com",
        first_name="J",
        last_name="Roetscyber",
        role="admin"
    )
    
    # Also recreate admin user with a known password
    add_user(
        username="admin2",
        password="admin123",
        email="admin2@farm.com",
        first_name="Admin",
        last_name="User",
        role="admin"
    )