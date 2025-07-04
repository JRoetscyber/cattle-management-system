from app import db
import datetime

class Breed(db.Model):
    __tablename__ = 'breeds'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), unique=True)
    description = db.Column(db.Text)
    
    def __repr__(self):
        return f'<Breed {self.name}>'

class Animal(db.Model):
    __tablename__ = 'animals'
    
    id = db.Column(db.Integer, primary_key=True)
    tag_id = db.Column(db.String(20), unique=True, index=True)
    name = db.Column(db.String(64))
    birth_date = db.Column(db.Date)
    gender = db.Column(db.String(10))  # male, female
    weight = db.Column(db.Float)  # in kg
    status = db.Column(db.String(20), default='active')  # active, sold, deceased
    
    # Foreign keys
    breed_id = db.Column(db.Integer, db.ForeignKey('breeds.id'))
    mother_id = db.Column(db.Integer, db.ForeignKey('animals.id'), nullable=True)
    father_id = db.Column(db.Integer, db.ForeignKey('animals.id'), nullable=True)
    
    # Relationships
    breed = db.relationship('Breed', backref='animals')
    mother = db.relationship('Animal', remote_side=[id], backref='offspring_as_mother', foreign_keys=[mother_id])
    father = db.relationship('Animal', remote_side=[id], backref='offspring_as_father', foreign_keys=[father_id])
    health_records = db.relationship('HealthRecord', backref='animal', lazy='dynamic')
    
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    
    def __repr__(self):
        return f'<Animal {self.tag_id}>'