from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
app.config.from_object('config')

# Enable CORS
CORS(app)

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Initialize LoginManager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'

# Register blueprints
from routes.auth import auth_bp
from routes.animals import animals_bp
from routes.health import health_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(animals_bp, url_prefix='/api/animals')
app.register_blueprint(health_bp, url_prefix='/api/health')

@app.route('/api/status')
def status():
    return jsonify({"status": "API is running"})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)