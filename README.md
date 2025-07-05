# Cattle Management System

![Cattle Management System](https://via.placeholder.com/800x400?text=Cattle+Management+System)

## Overview

Cattle Management System is a comprehensive web-based application designed to help livestock farmers efficiently manage their cattle operations. Built with a modern tech stack and intuitive interface, this system simplifies tracking animals, health records, and farm analytics.

**Current version:** 2.0  
**Last updated:** July 5, 2025  
**Developed by:** JRoetscyber

## Features

### 🐄 Animal Management
- Complete inventory of all cattle with detailed information
- Track animal status (active, sold, deceased)
- Organize by tag ID, breed, gender, and other attributes
- Quick search and filtering capabilities

### 🩺 Health Records
- Comprehensive health event tracking
- Vaccination schedules and reminders
- Treatment history and medication records
- Illness and injury documentation

### 📊 Analytics Dashboard
- Real-time statistics on herd composition
- Health event distribution and trends
- Breed distribution visualization
- Key performance indicators at a glance

### 🔐 User Authentication
- Secure login and registration system
- Role-based access control (admin, manager, user)
- Password encryption and session management
- Profile management

## System Requirements

- **Frontend:** Any modern web browser (Chrome, Firefox, Safari, Edge)
- **Backend:** Python 3.8+ with Flask
- **Database:** SQLite (development), PostgreSQL (production recommended)
- **Server:** Any system capable of running Python (Linux, Windows, macOS)

## Installation

### Backend Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/cattle-management-system.git
cd cattle-management-system

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Initialize the database
python backend/app.py
```

### Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Serve the frontend files (development)
python -m http.server 8080
```

## Usage

1. Start the backend server:
   ```
   python backend/app.py
   ```

2. Start the frontend server:
   ```
   cd frontend
   python -m http.server 8080
   ```

3. Access the application:
   - Open your browser and navigate to http://localhost:8080/
   - Log in with the default admin account:
     - Username: JRoetscyber
     - Password: password123

## System Architecture

The Cattle Management System follows a clean client-server architecture:

### Frontend
- HTML5, CSS3, and vanilla JavaScript
- Chart.js for data visualization
- Responsive design for desktop and mobile devices
- FontAwesome for icons

### Backend
- Flask REST API
- SQLAlchemy ORM for database operations
- Flask-Login for authentication
- Cross-Origin Resource Sharing (CORS) support

### Database Schema
- Users: Authentication and user profile data
- Animals: Core cattle information
- Health Records: Medical events and treatments
- Breeds: Cattle breed information (coming soon)

## API Documentation

The system provides a RESTful API with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check` - Check authentication status

### Animals
- `GET /api/animals/` - List all animals
- `POST /api/animals/` - Add new animal
- `GET /api/animals/:id` - Get animal details
- `PUT /api/animals/:id` - Update animal
- `DELETE /api/animals/:id` - Delete animal

### Health Records
- `GET /api/health/records` - List all health records
- `POST /api/health/records` - Add new health record
- `GET /api/health/records/:id` - Get record details
- `PUT /api/health/records/:id` - Update record
- `DELETE /api/health/records/:id` - Delete record

## Future Development

Planned features for upcoming releases:

- **Breeds Management**: Native cattle breed tracking and management
- **Breeding Records**: Track breeding programs and genealogy
- **Financial Module**: Costs, revenue, and profitability tracking
- **Mobile Application**: Native mobile apps for iOS and Android
- **Offline Support**: Work without internet connection in remote areas
- **Multi-language Support**: Interface localization for global usage
- **API Integration**: Connect with farm equipment and third-party services

## Contributing

We welcome contributions to the Cattle Management System! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please contact:
- Email: support@cattlemanagementsystem.com
- Issue Tracker: https://github.com/yourusername/cattle-management-system/issues

---

© 2025 Cattle Management System. All rights reserved.