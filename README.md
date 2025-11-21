# **TaskFlow – Plataforma Completa de Gerenciamento de Tarefas**

TaskFlow é uma aplicação web desenvolvida para ajudar usuários a organizar tarefas, acompanhar progresso e aumentar a produtividade, contando também com suporte inteligente via **Google Gemini AI**.

## ✨ **Funcionalidades Principais**

* **Autenticação de Usuários:**
    * **Registro seguro** com validação.
    * **Login protegido** com JWT.
    * **Senhas criptografadas** com bcrypt.
    * **Perfil personalizável**.
    * **Exclusão de conta**.

* **Gerenciamento de Tarefas:**
    * **Criar, editar e deletar** tarefas.
    * Marcar como **concluída** ou **não concluída**.
    * Definir **status**: Pendente, Em Progresso, Concluída.
    * Definir **prioridade**: Baixa, Média, Alta.
    * Adicionar **descrição** e **data de vencimento**.

* **Dashboard Moderno:**
    * **Resumo geral** de tarefas.
    * Tarefas pendentes, em progresso e concluídas.
    * **Distribuição por prioridade**.
    * **Cards visuais** e interface responsiva.

* **Chatbot Inteligente (Gemini AI):**
    * **FAQ com respostas rápidas**.
    * **IA avançada** para perguntas complexas.
    * **Histórico de conversação**.
    * Interface flutuante integrada.

## 🛠️ **Tecnologias Utilizadas**

* **Backend:**
    * Node.js
    * TypeScript
    * Express.js
    * MySQL
    * JWT
    * Bcrypt
    * dotenv

* **Frontend:**
    * HTML5
    * CSS3
    * JavaScript (ES6+)
    * Tailwind CSS
    * Fetch API

* **Chatbot:**
    * Python
    * Flask
    * Google Gemini AI
    * Flask-CORS

## 🚀 **Começando**

### **Pré-requisitos**
* Node.js 18+
* npm
* MySQL 8+
* Python 3.9+
* pip
* Git

### **Instalação**

1. **Clone o repositório:**
    ```bash
    git clone https://github.com/seu-usuario/taskflow.git
    cd taskflow
    ```

2. **Configure o Banco de Dados MySQL:**
    ```sql
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
    ```

3. **Instale as dependências do backend:**
    ```bash
    cd backend
    npm install
    ```

4. **Instale o chatbot:**
    ```bash
    cd ../chatbot
    python -m venv venv
    # Windows:
    venv\Scripts\activate
    # Linux/Mac:
    source venv/bin/activate
    pip install -r requirements.txt
    ```

## ⚙️ **Configuração**

### **Backend – arquivo backend/.env**

PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=taskflow
JWT_SECRET=seu_secret_super_seguro_aqui_123456
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10


### **Chatbot – arquivo chatbot/.env**


GEMINI_API_KEY=sua_chave_api_gemini_aqui
FLASK_ENV=development
FLASK_DEBUG=True


## 🚀 **Rodando a Aplicação**

1. **Iniciar o Backend**
    ```bash
    cd backend
    npm run dev
    ```

2. **Iniciar o Chatbot**
    ```bash
    cd chatbot
    python chatbot.py
    ```

3. **Iniciar o Frontend**
    ```bash
    cd frontend
    python -m http.server 8000
    ```

Acesse: http://localhost:8000
