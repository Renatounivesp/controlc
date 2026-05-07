from flask import Blueprint, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Transaction, Category
from sqlalchemy import func
import pandas as pd
import io
from datetime import datetime, timedelta

stats_bp = Blueprint('statistics', __name__)

@stats_bp.route('', methods=['GET'])
@jwt_required()
def get_stats():
    user_id = get_jwt_identity()
    
    # Totals
    income = db.session.query(func.sum(Transaction.amount)).filter_by(user_id=user_id, type='income').scalar() or 0
    expenses = db.session.query(func.sum(Transaction.amount)).filter_by(user_id=user_id, type='expense').scalar() or 0
    balance = income - expenses
    
    # Category Breakdown (Expenses)
    category_stats = db.session.query(
        Category.name, 
        func.sum(Transaction.amount)
    ).join(Transaction).filter(
        Transaction.user_id == user_id, 
        Transaction.type == 'expense'
    ).group_by(Category.name).all()
    
    # Monthly Comparison (Last 6 months)
    # Handle different database engines
    engine_name = db.engine.name
    if engine_name == 'postgresql':
        monthly_stats = db.session.query(
            func.date_trunc('month', Transaction.date).label('month'),
            Transaction.type,
            func.sum(Transaction.amount)
        ).filter_by(user_id=user_id).group_by('month', Transaction.type).order_by('month').all()
        
        monthly_data = [{"month": m.strftime('%Y-%m'), "type": t, "value": float(v)} for m, t, v in monthly_stats]
    else:
        # SQLite fallback
        monthly_stats = db.session.query(
            func.strftime('%Y-%m', Transaction.date).label('month'),
            Transaction.type,
            func.sum(Transaction.amount)
        ).filter_by(user_id=user_id).group_by('month', Transaction.type).order_by('month').all()
        
        monthly_data = [{"month": m, "type": t, "value": float(v)} for m, t, v in monthly_stats]
    
    return jsonify({
        "totals": {
            "income": income,
            "expenses": expenses,
            "balance": balance
        },
        "categories": [{"name": name, "value": float(val)} for name, val in category_stats],
        "monthly": monthly_data
    }), 200

@stats_bp.route('/export/csv', methods=['GET'])
@jwt_required()
def export_csv():
    user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=user_id).all()
    
    data = [{
        "Data": t.date.strftime('%Y-%m-%d'),
        "Descricao": t.description,
        "Tipo": 'Receita' if t.type == 'income' else 'Despesa',
        "Valor": t.amount,
        "Categoria": t.category.name
    } for t in transactions]
    
    df = pd.DataFrame(data)
    
    output = io.BytesIO()
    df.to_csv(output, index=False, encoding='utf-8-sig')
    output.seek(0)
    
    return send_file(
        output,
        mimetype='text/csv',
        as_attachment=True,
        download_name=f'relatorio_financeiro_{datetime.now().strftime("%Y%m%d")}.csv'
    )

@stats_bp.route('/analysis', methods=['GET'])
@jwt_required()
def get_analysis():
    user_id = get_jwt_identity()
    
    # 1. Categoria com maior gasto
    top_category = db.session.query(
        Category.name, 
        func.sum(Transaction.amount).label('total')
    ).join(Transaction).filter(
        Transaction.user_id == user_id, 
        Transaction.type == 'expense'
    ).group_by(Category.name).order_by(func.sum(Transaction.amount).desc()).first()
    
    # 2. Alerta de aumento de despesas (Este mês vs Mês passado)
    today = datetime.utcnow()
    this_month_start = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    last_month_end = this_month_start - timedelta(seconds=1)
    last_month_start = (this_month_start - timedelta(days=1)).replace(day=1)
    
    this_month_expenses = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == user_id,
        Transaction.type == 'expense',
        Transaction.date >= this_month_start
    ).scalar() or 0
    
    last_month_expenses = db.session.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == user_id,
        Transaction.type == 'expense',
        Transaction.date >= last_month_start,
        Transaction.date <= last_month_end
    ).scalar() or 0
    
    increase_percent = 0
    if last_month_expenses > 0:
        increase_percent = ((this_month_expenses - last_month_expenses) / last_month_expenses) * 100
        
    return jsonify({
        "top_category": {"name": top_category[0], "value": float(top_category[1])} if top_category else None,
        "expense_comparison": {
            "this_month": float(this_month_expenses),
            "last_month": float(last_month_expenses),
            "increase_percent": round(increase_percent, 2),
            "alert": increase_percent > 10 # Alerta se aumentou mais de 10%
        }
    }), 200

@stats_bp.route('/export/pdf', methods=['GET'])
@jwt_required()
def export_pdf():
    from reportlab.lib.pagesizes import letter
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
    from reportlab.lib.styles import getSampleStyleSheet
    from reportlab.lib import colors
    
    user_id = get_jwt_identity()
    transactions = Transaction.query.filter_by(user_id=user_id).order_by(Transaction.date.desc()).all()
    
    output = io.BytesIO()
    doc = SimpleDocTemplate(output, pagesize=letter)
    elements = []
    
    styles = getSampleStyleSheet()
    elements.append(Paragraph("Relatório Financeiro - Ctrl + $", styles['Title']))
    elements.append(Spacer(1, 12))
    
    # Table Data
    data = [['Data', 'Descrição', 'Tipo', 'Valor', 'Categoria']]
    for t in transactions:
        data.append([
            t.date.strftime('%d/%m/%Y'),
            t.description,
            'Receita' if t.type == 'income' else 'Despesa',
            f"R$ {t.amount:.2f}",
            t.category.name
        ])
    
    table = Table(data)
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.blue),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    elements.append(table)
    doc.build(elements)
    
    output.seek(0)
    return send_file(
        output,
        mimetype='application/pdf',
        as_attachment=True,
        download_name=f'relatorio_financeiro_{datetime.now().strftime("%Y%m%d")}.pdf'
    )
