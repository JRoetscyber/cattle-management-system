from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models.health import HealthRecord, Vaccination, Treatment
from models.animal import Animal
from app import db
import datetime

health_bp = Blueprint('health', __name__)

@health_bp.route('/records', methods=['GET'])
@login_required
def get_health_records():
    # Optional filter by animal_id
    animal_id = request.args.get('animal_id')
    
    if animal_id:
        records = HealthRecord.query.filter_by(animal_id=animal_id).all()
    else:
        records = HealthRecord.query.all()
    
    return jsonify([{
        "id": record.id,
        "animal_id": record.animal_id,
        "animal_tag": record.animal.tag_id,
        "date": record.date.isoformat(),
        "record_type": record.record_type,
        "notes": record.notes,
        "created_by": record.user.username
    } for record in records]), 200

@health_bp.route('/records/<int:id>', methods=['GET'])
@login_required
def get_health_record(id):
    record = HealthRecord.query.get_or_404(id)
    
    # Get vaccinations
    vaccinations = [{
        "id": vax.id,
        "vaccine_name": vax.vaccine_name,
        "dose": vax.dose,
        "date_administered": vax.date_administered.isoformat(),
        "next_due_date": vax.next_due_date.isoformat() if vax.next_due_date else None
    } for vax in record.vaccinations]
    
    # Get treatments
    treatments = [{
        "id": treatment.id,
        "treatment_type": treatment.treatment_type,
        "medication": treatment.medication,
        "dosage": treatment.dosage,
        "start_date": treatment.start_date.isoformat(),
        "end_date": treatment.end_date.isoformat() if treatment.end_date else None
    } for treatment in record.treatments]
    
    return jsonify({
        "id": record.id,
        "animal_id": record.animal_id,
        "animal_tag": record.animal.tag_id,
        "date": record.date.isoformat(),
        "record_type": record.record_type,
        "notes": record.notes,
        "created_by": record.user.username,
        "vaccinations": vaccinations,
        "treatments": treatments
    }), 200

@health_bp.route('/records', methods=['POST'])
@login_required
def create_health_record():
    data = request.get_json()
    
    # Check if animal exists
    animal = Animal.query.get_or_404(data['animal_id'])
    
    # Create health record
    record = HealthRecord(
        animal_id=data['animal_id'],
        date=datetime.datetime.strptime(data['date'], '%Y-%m-%d').date(),
        record_type=data['record_type'],
        notes=data.get('notes', ''),
        created_by=current_user.id
    )
    
    db.session.add(record)
    db.session.flush()  # Get the ID without committing
    
    # Add vaccinations if present
    if data.get('vaccinations'):
        for vax_data in data['vaccinations']:
            vax = Vaccination(
                health_record_id=record.id,
                vaccine_name=vax_data['vaccine_name'],
                dose=vax_data.get('dose', ''),
                date_administered=datetime.datetime.strptime(vax_data['date_administered'], '%Y-%m-%d').date(),
                next_due_date=datetime.datetime.strptime(vax_data['next_due_date'], '%Y-%m-%d').date() if vax_data.get('next_due_date') else None
            )
            db.session.add(vax)
    
    # Add treatments if present
    if data.get('treatments'):
        for treatment_data in data['treatments']:
            treatment = Treatment(
                health_record_id=record.id,
                treatment_type=treatment_data['treatment_type'],
                medication=treatment_data.get('medication', ''),
                dosage=treatment_data.get('dosage', ''),
                start_date=datetime.datetime.strptime(treatment_data['start_date'], '%Y-%m-%d').date(),
                end_date=datetime.datetime.strptime(treatment_data['end_date'], '%Y-%m-%d').date() if treatment_data.get('end_date') else None
            )
            db.session.add(treatment)
    
    db.session.commit()
    
    return jsonify({
        "message": "Health record created successfully",
        "id": record.id
    }), 201

@health_bp.route('/records/<int:id>', methods=['PUT'])
@login_required
def update_health_record(id):
    record = HealthRecord.query.get_or_404(id)
    data = request.get_json()
    
    # Update record fields
    if 'date' in data:
        record.date = datetime.datetime.strptime(data['date'], '%Y-%m-%d').date()
    
    if 'record_type' in data:
        record.record_type = data['record_type']
    
    if 'notes' in data:
        record.notes = data['notes']
    
    record.updated_at = datetime.datetime.utcnow()
    db.session.commit()
    
    return jsonify({"message": "Health record updated successfully"}), 200

@health_bp.route('/records/<int:id>', methods=['DELETE'])
@login_required
def delete_health_record(id):
    record = HealthRecord.query.get_or_404(id)
    
    # Delete associated vaccinations and treatments
    for vax in record.vaccinations:
        db.session.delete(vax)
    
    for treatment in record.treatments:
        db.session.delete(treatment)
    
    db.session.delete(record)
    db.session.commit()
    
    return jsonify({"message": "Health record deleted successfully"}), 200