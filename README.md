TaskFlow é uma plataforma completa de gerenciamento de tarefas, moderna, segura e equipada com um chatbot inteligente integrado ao Google Gemini AI.

✨ Principais Diferenciais
🎨 Interface Moderna: design responsivo com Tailwind CSS
🔒 Segurança: autenticação JWT com senhas criptografadas (bcrypt)
🤖 IA Integrada: chatbot com Gemini AI
📊 Dashboard Intuitivo: estatísticas em tempo real
🚀 Performance: backend otimizado em TypeScript
📱 Responsivo: funciona em desktop e mobile

🚀 Funcionalidades
👤 Gestão de Usuários
Registro de usuários
Login com JWT
Validação de email e senha
Perfil personalizável
Exclusão de conta

📋 Gestão de Tarefas
Criar, editar e excluir tarefas
Status: Pendente / Em Progresso / Concluída
Prioridade: Baixa / Média / Alta
Descrição e data de vencimento
Marcar como concluída
Filtros por status e prioridade
Tarefas do dia

📊 Dashboard & Estatísticas
Total de tarefas
Pendentes
Em progresso
Concluídas
Distribuição por prioridade
Cards interativos

🤖 Chatbot Inteligente
Respostas instantâneas (FAQ)
Integração com Gemini AI
Contexto do sistema
Histórico
Interface flutuante

🛠️ Tecnologias
Backend
Node.js 18+
TypeScript 5
Express.js
MySQL 8
JWT
Bcrypt
dotenv
Frontend
HTML5
CSS3
JavaScript ES6+
Tailwind CSS
Fetch API
Chatbot
Python 3.9+
Flask
Google Gemini AI
Flask-CORS

📋 Pré-requisitos
# Node.js (v18+)
node --version

# npm
npm --version

# MySQL (v8+)
mysql --version

# Python (v3.9+)
python --version

# pip
pip --version

🔑 API Key do Gemini

Acesse: https://aistudio.google.com/app/apikey

Faça login

Clique em Create API Key

Copie a chave

📦 Instalação
1️⃣ Clonar o Repositório
git clone https://github.com/seu-usuario/taskflow.git
cd taskflow

2️⃣ Configurar o Banco de Dados
CREATE DATABASE taskflow;
USE taskflow;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tarefas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  status ENUM('pendente', 'em_progresso', 'concluida') DEFAULT 'pendente',
  prioridade ENUM('baixa', 'media', 'alta') DEFAULT 'media',
  data_vencimento DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

3️⃣ Instalar Dependências do Backend
cd backend
npm install

4️⃣ Instalar Dependências do Chatbot
cd ../chatbot
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt

⚙️ Configuração
Backend – backend/.env
PORT=3001

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=taskflow

JWT_SECRET=seu_secret_super_seguro_aqui_123456
JWT_EXPIRES_IN=7d

BCRYPT_ROUNDS=10

Chatbot – chatbot/.env
GEMINI_API_KEY=sua_chave_api_gemini_aqui

FLASK_ENV=development
FLASK_DEBUG=True

🚀 Uso
1️⃣ Iniciar Backend
cd backend
npm run dev


Saída esperada:

Conexão com MySQL estabelecida com sucesso!
Servidor rodando na porta 3001
http://localhost:3001

2️⃣ Iniciar Chatbot (Opcional)
cd chatbot
python chatbot.py


Saída esperada:

TASKFLOW CHATBOT INICIANDO...
Flask: OK
CORS: OK
Gemini API: OK
FAQs carregadas: 15
Servidor em http://localhost:5000

3️⃣ Iniciar o Frontend
cd frontend
python -m http.server 8000


ou:

npx http-server -p 8000


Acesse: http://localhost:8000

4️⃣ Criar uma Conta e Usar

Clique em Cadastre-se

Preencha nome, email e senha

Faça login

Comece a criar tarefas 🎯
