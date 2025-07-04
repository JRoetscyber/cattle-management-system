from app import db
import datetime

class HealthRecord(db.Model):
    __tablename__ = 'health_records'
    
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.Date, default=datetime.date.today)
    record_type = db.Column(db.String(20))  # vaccination, treatment, check-up
    notes = db.Column(db.Text)
    
    # Foreign keys
    animal_id = db.Column(db.Integer, db.ForeignKey('animals.id'))
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    # Relationships
    user = db.relationship('User', backref='health_records')
    vaccinations = db.relationship('Vaccination', backref='health_record', lazy='dynamic')
    treatments = db.relationship('Treatment', backref='health_record', lazy='dynamic')
    
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    def __repr__(self):
        return f'<HealthRecord {self.id} for Animal {self.animal_id}>'

class Vaccination(db.Model):
    __tablename__ = 'vaccinations'
    
    id = db.Column(db.Integer, primary_key=True)
    vaccine_name = db.Column(db.String(64))
    dose = db.Column(db.String(20))
    date_administered = db.Column(db.Date, default=datetime.date.today)
    next_due_date = db.Column(db.Date)
    
    # Foreign keys
    health_record_id = db.Column(db.Integer, db.ForeignKey('health_records.id'))
    
    def __repr__(self):
        return f'<Vaccination {self.vaccine_name}>'

class Treatment(db.Model):
    __tablename__ = 'treatments'
    
    id = db.Column(db.Integer, primary_key=True)
    treatment_type = db.Column(db.String(64))  # medication, procedure, etc.
    medication = db.Column(db.String(64))
    dosage = db.Column(db.String(20))
    start_date = db.Column(db.Date, default=datetime.date.today)
    end_date = db.Column(db.Date)
    
    # Foreign keys
    health_record_id = db.Column(db.Integer, db.ForeignKey('health_records.id'))
    
    def __repr__(self):
        return f'<Treatment {self.treatment_type}>'