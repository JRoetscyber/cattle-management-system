from flask import Flask, jsonify
from flask_cors import CORS
from flask_login import LoginManager, current_user
from extensions import db
import os
import datetime

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URI', 'sqlite:///cattle_management.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Initialize database
    db.init_app(app)
    
    # Setup CORS with proper configuration
    CORS(app, 
         supports_credentials=True, 
         origins=["http://localhost:8080"],
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])
    
    # Configure login manager
    login_manager = LoginManager()
    login_manager.init_app(app)
    login_manager.session_protection = "strong"
    
    from models.user import User
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))
    
    # Register blueprints
    from routes.auth import auth_bp
    from routes.animals import animals_bp
    from routes.health import health_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(animals_bp, url_prefix='/api/animals')
    app.register_blueprint(health_bp, url_prefix='/api/health')
    
    # Add a test route
    @app.route('/api/test', methods=['GET'])
    def test_api():
        return jsonify({
            "status": "ok", 
            "message": "API is working",
            "server_time": str(datetime.datetime.now())
        })
    
    # Initialize database tables
    with app.app_context():
        db.create_all()
        
        # Create admin user if no users exist
        if User.query.count() == 0:
            admin = User(
                username='JRoetscyber',
                email='jroetscyber@example.com',
                first_name='Jacob',
                last_name='Roetscyber',
                role='admin'
            )
            admin.set_password('password123')
            db.session.add(admin)
            db.session.commit()
            print("Default admin user created")
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)