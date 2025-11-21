🎯 Sobre
TaskFlow é uma plataforma completa de gerenciamento de tarefas desenvolvida com as tecnologias mais modernas do mercado. O sistema oferece uma interface intuitiva, autenticação segura e um chatbot inteligente integrado com Gemini AI para auxiliar os usuários.
✨ Principais Diferenciais

🎨 Interface Moderna: Design responsivo com Tailwind CSS
🔒 Segurança: Autenticação JWT com senhas criptografadas (bcrypt)
🤖 IA Integrada: Chatbot com Gemini AI para suporte 24/7
📊 Dashboard Intuitivo: Estatísticas em tempo real
🚀 Performance: Backend otimizado em TypeScript
📱 Responsivo: Funciona perfeitamente em desktop e mobile


🚀 Funcionalidades
👤 Gestão de Usuários

✅ Registro de novos usuários
✅ Login seguro com JWT
✅ Validação de email e senha
✅ Perfil personalizado
✅ Exclusão de conta

📋 Gestão de Tarefas

✅ Criar, editar e deletar tarefas
✅ Definir status (Pendente, Em Progresso, Concluída)
✅ Definir prioridade (Baixa, Média, Alta)
✅ Adicionar descrição e data de vencimento
✅ Marcar como concluída com um clique
✅ Filtros por status e prioridade
✅ Visualização de tarefas do dia

📊 Dashboard & Estatísticas

✅ Total de tarefas
✅ Tarefas pendentes
✅ Tarefas em progresso
✅ Tarefas concluídas
✅ Distribuição por prioridade
✅ Cards visuais interativos

🤖 Chatbot Inteligente

✅ Respostas instantâneas (FAQ)
✅ IA com Gemini para perguntas complexas
✅ Contexto sobre o sistema
✅ Perguntas rápidas
✅ Histórico de conversação
✅ Interface flutuante moderna


🛠️ Tecnologias
Backend

Node.js v18+ - Runtime JavaScript
TypeScript v5.0 - Superset tipado do JavaScript
Express.js - Framework web
MySQL v8.0 - Banco de dados relacional
JWT - Autenticação
Bcrypt - Criptografia de senhas
dotenv - Variáveis de ambiente

Frontend

HTML5 - Estrutura
CSS3 - Estilização
JavaScript (ES6+) - Interatividade
Tailwind CSS - Framework CSS
Fetch API - Requisições HTTP

Chatbot

Python v3.9+ - Linguagem de programação
Flask - Framework web Python
Google Gemini AI - Inteligência Artificial
Flask-CORS - Configuração CORS


📋 Pré-requisitos
Antes de começar, certifique-se de ter instalado:
bash# Node.js (v18 ou superior)
node --version

# npm (gerenciador de pacotes)
npm --version

# MySQL (v8.0 ou superior)
mysql --version

# Python (v3.9 ou superior) - para o chatbot
python --version

# pip (gerenciador de pacotes Python)
pip --version
🔑 API Key do Gemini
Para o chatbot funcionar, você precisará de uma API Key gratuita do Google Gemini:

Acesse: https://aistudio.google.com/app/apikey
Faça login com sua conta Google
Clique em "Create API Key"
Copie a chave gerada


📦 Instalação
1️⃣ Clone o Repositório
bashgit clone https://github.com/seu-usuario/taskflow.git
cd taskflow
2️⃣ Configure o Banco de Dados
sql-- Conecte ao MySQL
mysql -u root -p

-- Crie o banco de dados
CREATE DATABASE taskflow;
USE taskflow;

-- Tabela de usuários
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de tarefas
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
3️⃣ Instale as Dependências do Backend
bashcd backend
npm install
4️⃣ Instale as Dependências do Chatbot
bashcd ../chatbot
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

# Instalar dependências
pip install -r requirements.txt

⚙️ Configuração
Backend (.env)
Crie o arquivo .env na pasta backend/:
env# Servidor
PORT=3001

# Banco de Dados MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=taskflow

# JWT
JWT_SECRET=seu_secret_super_seguro_aqui_123456
JWT_EXPIRES_IN=7d

# Bcrypt
BCRYPT_ROUNDS=10
Chatbot (.env)
Crie o arquivo .env na pasta chatbot/:
env# Gemini API
GEMINI_API_KEY=sua_chave_api_gemini_aqui

# Flask
FLASK_ENV=development
FLASK_DEBUG=True

🚀 Uso
1️⃣ Iniciar o Backend
bashcd backend
npm run dev
Saída esperada:
✅ Conexão com MySQL estabelecida com sucesso!
🚀 Servidor rodando na porta 3001
📍 http://localhost:3001
2️⃣ Iniciar o Chatbot (Opcional)
bashcd chatbot
python chatbot.py
Saída esperada:
==================================================
🤖 TASKFLOW CHATBOT INICIANDO...
==================================================
✅ Flask: OK
✅ CORS: OK
✅ Gemini API: OK
✅ FAQs carregadas: 15

📡 Servidor rodando em http://localhost:5000
==================================================
3️⃣ Abrir o Frontend
Abra o arquivo frontend/index.html no navegador ou use um servidor local:
bash# Usando Python
cd frontend
python -m http.server 8000

# Ou usando Node.js (http-server)
npx http-server -p 8000
Acesse: http://localhost:8000
4️⃣ Criar uma Conta e Começar

Clique em "Cadastre-se"
Preencha nome, email e senha
Faça login
Comece a criar suas tarefas!
