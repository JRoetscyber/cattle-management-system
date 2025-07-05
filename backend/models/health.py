from extensions import db
import datetime

class HealthRecord(db.Model):
    __tablename__ = 'health_records'
    
    id = db.Column(db.Integer, primary_key=True)
    animal_id = db.Column(db.Integer, db.ForeignKey('animals.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    record_type = db.Column(db.String(50), nullable=False)  # vaccination, treatment, checkup, etc.
    notes = db.Column(db.Text)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    # Relationships
    animal = db.relationship('Animal', backref=db.backref('health_records', lazy=True))
    user = db.relationship('User', backref=db.backref('health_records', lazy=True))
    vaccinations = db.relationship('Vaccination', backref='health_record', lazy=True, cascade="all, delete-orphan")
    treatments = db.relationship('Treatment', backref='health_record', lazy=True, cascade="all, delete-orphan")
    
    def __repr__(self):
        return f'<HealthRecord {self.id} for animal {self.animal_id}>'


class Vaccination(db.Model):
    __tablename__ = 'vaccinations'
    
    id = db.Column(db.Integer, primary_key=True)
    health_record_id = db.Column(db.Integer, db.ForeignKey('health_records.id'), nullable=False)
    vaccine_name = db.Column(db.String(100), nullable=False)
    dose = db.Column(db.String(50))
    date_administered = db.Column(db.Date, nullable=False)
    next_due_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    def __repr__(self):
        return f'<Vaccination {self.id} {self.vaccine_name}>'


class Treatment(db.Model):
    __tablename__ = 'treatments'
    
    id = db.Column(db.Integer, primary_key=True)
    health_record_id = db.Column(db.Integer, db.ForeignKey('health_records.id'), nullable=False)
    treatment_type = db.Column(db.String(100), nullable=False)
    medication = db.Column(db.String(100))
    dosage = db.Column(db.String(50))
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    def __repr__(self):
        return f'<Treatment {self.id} {self.treatment_type}>'