# Import models so they are registered with SQLAlchemy
from .user import User
from .animal import Animal, Breed
from .health import HealthRecord, Vaccination, Treatment