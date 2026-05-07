import os
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from dotenv import load_dotenv
from models import db, User, Category

load_dotenv()

def create_app():
    app = Flask(__name__)

    # Configuration
    db_url = os.getenv('DATABASE_URL', 'sqlite:///database.db')
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-key')

    # Extensions
    db.init_app(app)
    CORS(app)
    JWTManager(app)
    Migrate(app, db)

    # Register blueprints (to be created)
    from routes.auth import auth_bp
    from routes.transactions import trans_bp
    from routes.goals import goals_bp
    from routes.statistics import stats_bp

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(trans_bp, url_prefix='/api/transactions')
    app.register_blueprint(goals_bp, url_prefix='/api/goals')
    app.register_blueprint(stats_bp, url_prefix='/api/statistics')

    @app.route('/')
    def index():
        return jsonify({"message": "Ctrl + $ API is running"})

    return app

app = create_app()

# No Render/Produção, a inicialização pode ser feita aqui ou via script de migração
with app.app_context():
    try:
        db.create_all()
        # Seed categories if empty
        if Category.query.count() == 0:
            default_categories = [
                Category(name='Alimentação', color='#ef4444', icon='utensils'),
                Category(name='Transporte', color='#3b82f6', icon='car'),
                Category(name='Lazer', color='#10b981', icon='gamepad'),
                Category(name='Saúde', color='#f59e0b', icon='heartbeat'),
                Category(name='Educação', color='#8b5cf6', icon='graduation-cap'),
                Category(name='Outros', color='#6b7280', icon='ellipsis-h')
            ]
            db.session.bulk_save_objects(default_categories)
            db.session.commit()
            print("Categorias iniciais criadas com sucesso!")
    except Exception as e:
        print(f"Aviso: Erro ao inicializar banco de dados: {e}")

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f"Iniciando servidor na porta {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)
