from flask import Blueprint, request, jsonify
from flask_login import login_user, logout_user, current_user, login_required
from models.user import User
from extensions import db
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # Check if required fields are provided
    if 'username' not in data or 'password' not in data:
        return jsonify({'error': 'Username and password are required'}), 400
    
    username = data.get('username')
    password = data.get('password')
    
    print(f"Login attempt: username={username}")
    
    user = User.query.filter_by(username=username).first()
    
    if not user:
        print(f"User not found: {username}")
        return jsonify({"error": "Invalid username or password"}), 401
    
    if not user.check_password(password):
        print(f"Invalid password for user: {username}")
        return jsonify({"error": "Invalid username or password"}), 401
    
    login_user(user, remember=data.get('remember', False))
    
    # Update last login time
    user.last_login = datetime.utcnow()
    db.session.commit()
    
    print(f"User {username} logged in successfully")
    
    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict()
    }), 200

@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"}), 200

@auth_bp.route('/status', methods=['GET'])
def status():
    if current_user.is_authenticated:
        return jsonify({
            "authenticated": True,
            "user": current_user.to_dict()
        }), 200
    else:
        return jsonify({
            "authenticated": False
        }), 200

@auth_bp.route('/check', methods=['GET'])
def check_auth():
    if current_user.is_authenticated:
        return jsonify({
            'authenticated': True,
            'user': current_user.to_dict()
        }), 200
    else:
        return jsonify({'authenticated': False}), 401
        
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # Check if required fields are provided
    required_fields = ['username', 'email', 'password']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'Missing required field: {field}'}), 400
    
    # Check if username already exists
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Username already exists"}), 400
    
    # Check if email already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already exists"}), 400
    
    # Create new user
    user = User(
        username=data['username'],
        email=data['email'],
        first_name=data.get('first_name', ''),
        last_name=data.get('last_name', ''),
        role=data.get('role', 'user')
    )
    
    # First user gets admin role
    if User.query.count() == 0:
        user.role = 'admin'
    
    # Set password
    user.set_password(data['password'])
    
    # Add to database
    db.session.add(user)
    db.session.commit()
    
    print(f"User {data['username']} created successfully")
    
    return jsonify({
        "message": "User created successfully",
        "id": user.id
    }), 201

@auth_bp.route('/users/me', methods=['GET'])
@login_required
def get_current_user():
    return jsonify(current_user.to_dict()), 200