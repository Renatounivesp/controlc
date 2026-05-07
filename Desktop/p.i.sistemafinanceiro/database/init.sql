-- Script de inicialização do Banco de Dados PostgreSQL

-- Tabela de Usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(256) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Categorias
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    color VARCHAR(20) DEFAULT '#3b82f6',
    icon VARCHAR(50) DEFAULT 'tag'
);

-- Tabela de Transações
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    description VARCHAR(200) NOT NULL,
    amount FLOAT NOT NULL,
    type VARCHAR(10) NOT NULL, -- 'income' ou 'expense'
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id)
);

-- Tabela de Metas
CREATE TABLE goals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    target_amount FLOAT NOT NULL,
    current_amount FLOAT DEFAULT 0.0,
    deadline TIMESTAMP,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir categorias padrão
INSERT INTO categories (name, color, icon) VALUES 
('Alimentação', '#ef4444', 'utensils'),
('Transporte', '#3b82f6', 'car'),
('Lazer', '#10b981', 'gamepad'),
('Saúde', '#f59e0b', 'heartbeat'),
('Educação', '#8b5cf6', 'graduation-cap'),
('Outros', '#6b7280', 'ellipsis-h');
