# Ctrl + $ - Gestão Financeira Pessoal

Sistema de gestão financeira pessoal moderno, simples e funcional, desenvolvido para fins acadêmicos.

## 🚀 Tecnologias

### Frontend
- **React.js** com **Vite**
- **TailwindCSS** (Estilização moderna e responsiva)
- **Axios** (Integração com API)
- **Lucide React** (Ícones)
- **Recharts** (Gráficos financeiros)
- **Vitest** (Testes unitários)

### Backend
- **Python Flask** (Framework web)
- **Flask-JWT-Extended** (Autenticação)
- **SQLAlchemy** (ORM)
- **PostgreSQL** (Banco de dados)
- **Pytest** (Testes de integração)

---

## 🛠️ Instalação e Execução

### Pré-requisitos
- Python 3.10+
- Node.js 18+
- PostgreSQL (ou Supabase)

### Backend
1. Navegue até a pasta `backend`:
   ```bash
   cd backend
   ```
2. Crie um ambiente virtual:
   ```bash
   python -m venv venv
   source venv/bin/activate  # No Windows: venv\Scripts\activate
   ```
3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure o arquivo `.env` (baseie-se no `.env.example`).
5. Execute o servidor:
   ```bash
   python app.py
   ```

### Frontend
1. Navegue até a pasta `frontend`:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure as variáveis de ambiente em um arquivo `.env`:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```
4. Inicie o projeto:
   ```bash
   npm run dev
   ```

---

## 🧪 Testes

### Backend
```bash
cd backend
pytest
```

### Frontend
```bash
cd frontend
npm test
```

---

## ☁️ Deploy

### Frontend (Vercel)
1. Conecte seu repositório no Vercel.
2. Defina o diretório raiz como `frontend`.
3. Configure a variável de ambiente `VITE_API_URL`.

### Backend (Render)
1. Conecte seu repositório no Render.
2. Escolha "Web Service".
3. Configure o diretório raiz como `backend`.
4. Comando de build: `pip install -r requirements.txt`.
5. Comando de start: `gunicorn app:app`.

---

## 📋 Funcionalidades
- [x] Autenticação completa (JWT)
- [x] Dashboard com gráficos
- [x] Gestão de Transações (Receitas/Despesas)
- [x] Metas Financeiras com progresso
- [x] Exportação de CSV
- [x] Análise de gastos automática
- [x] Modo Escuro e Acessibilidade
- [x] Totalmente Responsivo
