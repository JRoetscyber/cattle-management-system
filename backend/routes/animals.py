from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models.animal import Animal, Breed
from app import db
import datetime

animals_bp = Blueprint('animals', __name__)

@animals_bp.route('/', methods=['GET'])
@login_required
def get_all_animals():
    animals = Animal.query.all()
    return jsonify([{
        "id": animal.id,
        "tag_id": animal.tag_id,
        "name": animal.name,
        "birth_date": animal.birth_date.isoformat() if animal.birth_date else None,
        "gender": animal.gender,
        "weight": animal.weight,
        "status": animal.status,
        "breed": animal.breed.name if animal.breed else None
    } for animal in animals]), 200

@animals_bp.route('/<int:id>', methods=['GET'])
@login_required
def get_animal(id):
    animal = Animal.query.get_or_404(id)
    
    # Get parent information
    mother = animal.mother.tag_id if animal.mother else None
    father = animal.father.tag_id if animal.father else None
    
    # Get offspring
    offspring = Animal.query.filter((Animal.mother_id == animal.id) | (Animal.father_id == animal.id)).all()
    
    return jsonify({
        "id": animal.id,
        "tag_id": animal.tag_id,
        "name": animal.name,
        "birth_date": animal.birth_date.isoformat() if animal.birth_date else None,
        "gender": animal.gender,
        "weight": animal.weight,
        "status": animal.status,
        "breed": animal.breed.name if animal.breed else None,
        "mother": mother,
        "father": father,
        "offspring": [child.tag_id for child in offspring]
    }), 200

@animals_bp.route('/', methods=['POST'])
@login_required
def create_animal():
    data = request.get_json()
    
    # Check if tag_id already exists
    if Animal.query.filter_by(tag_id=data['tag_id']).first():
        return jsonify({"error": "Tag ID already exists"}), 400
    
    # Create new animal
    animal = Animal(
        tag_id=data['tag_id'],
        name=data.get('name', ''),
        birth_date=datetime.datetime.strptime(data['birth_date'], '%Y-%m-%d').date() if data.get('birth_date') else None,
        gender=data['gender'],
        weight=data.get('weight'),
        status=data.get('status', 'active'),
        breed_id=data.get('breed_id')
    )
    
    # Set parents if provided
    if data.get('mother_id'):
        animal.mother_id = data['mother_id']
    if data.get('father_id'):
        animal.father_id = data['father_id']
    
    db.session.add(animal)
    db.session.commit()
    
    return jsonify({
        "message": "Animal created successfully",
        "id": animal.id
    }), 201

@animals_bp.route('/<int:id>', methods=['PUT'])
@login_required
def update_animal(id):
    animal = Animal.query.get_or_404(id)
    data = request.get_json()
    
    # Update fields
    if 'tag_id' in data:
        # Ensure tag_id is unique if being changed
        if data['tag_id'] != animal.tag_id and Animal.query.filter_by(tag_id=data['tag_id']).first():
            return jsonify({"error": "Tag ID already exists"}), 400
        animal.tag_id = data['tag_id']
    
    if 'name' in data:
        animal.name = data['name']
    
    if 'birth_date' in data:
        animal.birth_date = datetime.datetime.strptime(data['birth_date'], '%Y-%m-%d').date() if data['birth_date'] else None
    
    if 'gender' in data:
        animal.gender = data['gender']
    
    if 'weight' in data:
        animal.weight = data['weight']
    
    if 'status' in data:
        animal.status = data['status']
    
    if 'breed_id' in data:
        animal.breed_id = data['breed_id']
    
    if 'mother_id' in data:
        animal.mother_id = data['mother_id']
    
    if 'father_id' in data:
        animal.father_id = data['father_id']
    
    animal.updated_at = datetime.datetime.utcnow()
    db.session.commit()
    
    return jsonify({"message": "Animal updated successfully"}), 200

@animals_bp.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_animal(id):
    animal = Animal.query.get_or_404(id)
    db.session.delete(animal)
    db.session.commit()
    
    return jsonify({"message": "Animal deleted successfully"}), 200

# Routes for breeds
@animals_bp.route('/breeds', methods=['GET'])
@login_required
def get_breeds():
    breeds = Breed.query.all()
    return jsonify([{
        "id": breed.id,
        "name": breed.name,
        "description": breed.description
    } for breed in breeds]), 200

@animals_bp.route('/breeds', methods=['POST'])
@login_required
def create_breed():
    data = request.get_json()
    
    # Check if breed already exists
    if Breed.query.filter_by(name=data['name']).first():
        return jsonify({"error": "Breed already exists"}), 400
    
    # Create new breed
    breed = Breed(
        name=data['name'],
        description=data.get('description', '')
    )
    
    db.session.add(breed)
    db.session.commit()
    
    return jsonify({
        "message": "Breed created successfully",
        "id": breed.id
    }), 201