from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Transaction, Category
from datetime import datetime

trans_bp = Blueprint('transactions', __name__)

@trans_bp.route('', methods=['GET'])
@jwt_required()
def get_transactions():
    user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=user_id).order_by(Transaction.date.desc()).all()
    
    return jsonify([{
        "id": t.id,
        "description": t.description,
        "amount": t.amount,
        "type": t.type,
        "date": t.date.isoformat(),
        "category": {
            "id": t.category.id,
            "name": t.category.name,
            "color": t.category.color,
            "icon": t.category.icon
        }
    } for t in transactions]), 200

@trans_bp.route('', methods=['POST'])
@jwt_required()
def add_transaction():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    new_trans = Transaction(
        description=data['description'],
        amount=float(data['amount']),
        type=data['type'],
        date=datetime.fromisoformat(data['date']) if 'date' in data else datetime.utcnow(),
        user_id=user_id,
        category_id=data['category_id']
    )
    
    db.session.add(new_trans)
    db.session.commit()
    
    return jsonify({"msg": "Transaction added"}), 201

@trans_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_transaction(id):
    user_id = get_jwt_identity()
    trans = Transaction.query.filter_by(id=id, user_id=user_id).first_or_404()
    data = request.get_json()
    
    trans.description = data.get('description', trans.description)
    trans.amount = float(data.get('amount', trans.amount))
    trans.type = data.get('type', trans.type)
    trans.category_id = data.get('category_id', trans.category_id)
    if 'date' in data:
        trans.date = datetime.fromisoformat(data['date'])
    
    db.session.commit()
    return jsonify({"msg": "Transaction updated"}), 200

@trans_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_transaction(id):
    user_id = get_jwt_identity()
    trans = Transaction.query.filter_by(id=id, user_id=user_id).first_or_404()
    
    db.session.delete(trans)
    db.session.commit()
    return jsonify({"msg": "Transaction deleted"}), 200

@trans_bp.route('/categories', methods=['GET'])
@jwt_required()
def get_categories():
    categories = Category.query.all()
    return jsonify([{
        "id": c.id,
        "name": c.name,
        "color": c.color,
        "icon": c.icon
    } for c in categories]), 200
