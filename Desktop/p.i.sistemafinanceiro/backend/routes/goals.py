from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Goal
from datetime import datetime

goals_bp = Blueprint('goals', __name__)

@goals_bp.route('', methods=['GET'])
@jwt_required()
def get_goals():
    user_id = get_jwt_identity()
    goals = Goal.query.filter_by(user_id=user_id).all()
    
    return jsonify([{
        "id": g.id,
        "name": g.name,
        "target_amount": g.target_amount,
        "current_amount": g.current_amount,
        "deadline": g.deadline.isoformat() if g.deadline else None,
        "progress": (g.current_amount / g.target_amount * 100) if g.target_amount > 0 else 0
    } for g in goals]), 200

@goals_bp.route('', methods=['POST'])
@jwt_required()
def add_goal():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    new_goal = Goal(
        name=data['name'],
        target_amount=float(data['target_amount']),
        current_amount=float(data.get('current_amount', 0)),
        deadline=datetime.fromisoformat(data['deadline']) if 'deadline' in data and data['deadline'] else None,
        user_id=user_id
    )
    
    db.session.add(new_goal)
    db.session.commit()
    
    return jsonify({"msg": "Goal created"}), 201

@goals_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_goal(id):
    user_id = get_jwt_identity()
    goal = Goal.query.filter_by(id=id, user_id=user_id).first_or_404()
    data = request.get_json()
    
    goal.name = data.get('name', goal.name)
    goal.target_amount = float(data.get('target_amount', goal.target_amount))
    goal.current_amount = float(data.get('current_amount', goal.current_amount))
    if 'deadline' in data:
        goal.deadline = datetime.fromisoformat(data['deadline']) if data['deadline'] else None
        
    db.session.commit()
    return jsonify({"msg": "Goal updated"}), 200

@goals_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_goal(id):
    user_id = get_jwt_identity()
    goal = Goal.query.filter_by(id=id, user_id=user_id).first_or_404()
    
    db.session.delete(goal)
    db.session.commit()
    return jsonify({"msg": "Goal deleted"}), 200
