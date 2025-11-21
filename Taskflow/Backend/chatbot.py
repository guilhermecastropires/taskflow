"""
TaskFlow Chatbot - Backend Python com Gemini AI
Requisitos: pip install flask flask-cors google-genai python-dotenv
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from google.genai import types
import os
from dotenv import load_dotenv
import json

# Carregar variáveis de ambiente
load_dotenv()

app = Flask(__name__)
CORS(app)  # Permitir requisições do frontend

# Configurar Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if not GEMINI_API_KEY:
    raise ValueError("⚠️ GEMINI_API_KEY não encontrada! Configure no arquivo .env")

client = genai.Client(api_key=GEMINI_API_KEY)

# Contexto sobre o TaskFlow (conhecimento do chatbot)
TASKFLOW_CONTEXT = """
Você é um assistente inteligente do TaskFlow, um sistema de gerenciamento de tarefas SaaS.

INFORMAÇÕES SOBRE O TASKFLOW:

1. SOBRE O SISTEMA:
   - TaskFlow é uma plataforma moderna de gestão de tarefas
   - Interface intuitiva e responsiva
   - Autenticação segura com JWT
   - Backend em Node.js/Express + TypeScript
   - Frontend em HTML/CSS/JavaScript com Tailwind CSS
   - Banco de dados MySQL

2. FUNCIONALIDADES PRINCIPAIS:
   - ✅ Criar, editar e deletar tarefas
   - 📊 Visualizar estatísticas (total, pendentes, em progresso, concluídas)
   - 🎯 Definir prioridade (baixa, média, alta)
   - 📅 Adicionar data de vencimento
   - 🔄 Alterar status (pendente, em progresso, concluída)
   - 🔍 Filtrar tarefas por status e prioridade
   - 📈 Dashboard com cards de estatísticas
   - 👤 Perfil de usuário personalizado

3. COMO USAR:
   - Registro: Crie uma conta com nome, email e senha (mínimo 6 caracteres)
   - Login: Acesse com suas credenciais
   - Nova Tarefa: Clique no botão "Nova Tarefa" no dashboard
   - Editar: Clique no ícone de lápis na tarefa
   - Concluir: Clique no ícone de check verde
   - Deletar: Clique no ícone de lixeira vermelho
   - Filtros: Use os botões "Todas", "Pendentes", "Em Progresso", "Concluídas"
   - Ações Rápidas: "Alta Prioridade" ou "Tarefas de Hoje"

4. RECURSOS TÉCNICOS:
   - API RESTful com rotas protegidas por autenticação
   - Tokens JWT com expiração de 7 dias
   - Senhas criptografadas com bcrypt
   - Validação de dados no frontend e backend
   - Respostas padronizadas em JSON

5. PROBLEMAS COMUNS E SOLUÇÕES:
   - "Token inválido": Faça logout e login novamente
   - "Erro ao conectar": Verifique se o servidor está rodando na porta 3001
   - "Tarefa não aparece": Verifique os filtros ativos
   - "Não consigo criar tarefa": Título é obrigatório

DIRETRIZES DE RESPOSTA:
- Seja amigável, claro e objetivo
- Use emojis para deixar as respostas mais visuais
- Forneça exemplos práticos quando relevante
- Se não souber algo, seja honesto
- Incentive o usuário a explorar o sistema
- Priorize respostas curtas (2-4 linhas) para perguntas simples
"""

# Respostas prontas para perguntas frequentes
FAQ_RESPONSES = {
    "oi": "Olá! 👋 Sou o assistente do TaskFlow. Como posso ajudá-lo hoje?",
    "olá": "Olá! 👋 Sou o assistente do TaskFlow. Como posso ajudá-lo hoje?",
    "ola": "Olá! 👋 Sou o assistente do TaskFlow. Como posso ajudá-lo hoje?",
    "hello": "Hello! 👋 I'm the TaskFlow assistant. How can I help you?",
    "ajuda": "Claro! Posso ajudar com:\n📋 Como usar o TaskFlow\n🔧 Problemas técnicos\n💡 Dicas de produtividade\n\nO que você precisa?",
    "help": "Claro! Posso ajudar com:\n📋 Como usar o TaskFlow\n🔧 Problemas técnicos\n💡 Dicas de produtividade\n\nO que você precisa?",
    "o que é taskflow": "TaskFlow é um sistema SaaS moderno de gerenciamento de tarefas! 🚀\n\nPermite criar, organizar e acompanhar suas tarefas com:\n✅ Diferentes status e prioridades\n📊 Dashboard com estatísticas\n📅 Datas de vencimento\n🔍 Filtros inteligentes",
    "como criar tarefa": "Para criar uma tarefa:\n1️⃣ Clique em 'Nova Tarefa' no dashboard\n2️⃣ Preencha o título (obrigatório)\n3️⃣ Adicione descrição, status, prioridade e data\n4️⃣ Clique em 'Salvar'\n\n✨ Pronto! Sua tarefa aparecerá na lista.",
    "como editar tarefa": "Para editar uma tarefa:\n1️⃣ Clique no ícone de lápis ✏️ na tarefa\n2️⃣ Modifique os campos desejados\n3️⃣ Clique em 'Salvar'\n\nSimples assim! 😊",
    "como deletar tarefa": "Para deletar uma tarefa:\n1️⃣ Clique no ícone de lixeira 🗑️ na tarefa\n2️⃣ Confirme a exclusão\n\n⚠️ Atenção: Esta ação não pode ser desfeita!",
    "esqueci minha senha": "No momento não temos recuperação de senha. 😅\n\nMas você pode:\n1️⃣ Criar uma nova conta\n2️⃣ Ou entrar em contato com o suporte\n\nEsta funcionalidade está em desenvolvimento!",
    "como fazer logout": "Para sair da sua conta:\n1️⃣ Clique no botão 'Sair' no canto superior direito\n2️⃣ Confirme a ação\n\nVocê será redirecionado para a tela de login. 👋",
    "não consigo logar": "Problemas no login? Vamos resolver! 🔧\n\nVerifique:\n✅ Email está correto\n✅ Senha tem pelo menos 6 caracteres\n✅ Você já tem uma conta cadastrada\n✅ O servidor está rodando\n\nAinda com problemas? Me conte mais detalhes!",
    "preço": "O TaskFlow está atualmente em fase de desenvolvimento! 🚀\n\nPor enquanto é totalmente gratuito para uso e testes.\n\nFuturamente teremos planos premium com recursos avançados!",
    "quanto custa": "O TaskFlow está atualmente em fase de desenvolvimento! 🚀\n\nPor enquanto é totalmente gratuito para uso e testes.\n\nFuturamente teremos planos premium com recursos avançados!",
    "obrigado": "Por nada! 😊 Estou sempre aqui para ajudar. Boa produtividade com o TaskFlow! 🚀",
    "tchau": "Até logo! 👋 Volte sempre que precisar de ajuda. Bom trabalho! 💪",
}

def get_faq_response(message: str) -> str:
    """Verifica se a mensagem corresponde a uma FAQ e retorna resposta pronta."""
    message_lower = message.lower().strip()
    
    # Busca exata
    if message_lower in FAQ_RESPONSES:
        return FAQ_RESPONSES[message_lower]
    
    # Busca por palavras-chave
    for key, response in FAQ_RESPONSES.items():
        if key in message_lower:
            return response
    
    return None

def generate_ai_response(message: str, conversation_history: list = None) -> str:
    """Gera resposta usando Gemini AI com contexto do TaskFlow."""
    try:
        # Preparar mensagens para o modelo
        messages = [
            {"role": "user", "parts": [{"text": TASKFLOW_CONTEXT}]},
            {"role": "model", "parts": [{"text": "Entendido! Sou o assistente do TaskFlow e estou pronto para ajudar os usuários com todas as funcionalidades do sistema."}]}
        ]
        
        # Adicionar histórico de conversa se existir
        if conversation_history:
            messages.extend(conversation_history)
        
        # Adicionar mensagem atual
        messages.append({"role": "user", "parts": [{"text": message}]})
        
        # Chamar Gemini API
        response = client.models.generate_content(
            model='gemini-2.0-flash-exp',
            contents=messages,
            config=types.GenerateContentConfig(
                temperature=0.7,
                max_output_tokens=500,
                top_p=0.95,
            )
        )
        
        return response.text.strip()
        
    except Exception as e:
        print(f"❌ Erro ao gerar resposta com Gemini: {e}")
        return "Desculpe, tive um problema ao processar sua pergunta. Pode reformular? 🤔"

@app.route('/api/chat', methods=['POST'])
def chat():
    """Endpoint principal do chatbot."""
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({
                'success': False,
                'error': 'Mensagem não fornecida'
            }), 400
        
        user_message = data['message'].strip()
        conversation_history = data.get('history', [])
        
        if not user_message:
            return jsonify({
                'success': False,
                'error': 'Mensagem vazia'
            }), 400
        
        print(f"📨 Mensagem recebida: {user_message}")
        
        # Tentar resposta de FAQ primeiro (mais rápido)
        response = get_faq_response(user_message)
        response_type = 'faq'
        
        # Se não encontrar FAQ, usar Gemini AI
        if response is None:
            response = generate_ai_response(user_message, conversation_history)
            response_type = 'ai'
        
        print(f"📤 Resposta ({response_type}): {response[:100]}...")
        
        return jsonify({
            'success': True,
            'response': response,
            'type': response_type,
            'timestamp': None  # Pode adicionar timestamp se necessário
        })
        
    except Exception as e:
        print(f"❌ Erro no endpoint /chat: {e}")
        return jsonify({
            'success': False,
            'error': 'Erro interno do servidor',
            'details': str(e)
        }), 500

@app.route('/api/chat/health', methods=['GET'])
def health_check():
    """Verificar se o chatbot está funcionando."""
    return jsonify({
        'success': True,
        'status': 'online',
        'message': 'Chatbot está funcionando! 🤖',
        'gemini_configured': bool(GEMINI_API_KEY)
    })

@app.route('/api/chat/faqs', methods=['GET'])
def get_faqs():
    """Retornar lista de perguntas frequentes."""
    faqs = [
        {"question": "O que é TaskFlow?", "category": "about"},
        {"question": "Como criar uma tarefa?", "category": "usage"},
        {"question": "Como editar uma tarefa?", "category": "usage"},
        {"question": "Como deletar uma tarefa?", "category": "usage"},
        {"question": "Esqueci minha senha", "category": "account"},
        {"question": "Como fazer logout?", "category": "account"},
        {"question": "Quanto custa?", "category": "pricing"},
        {"question": "Não consigo logar", "category": "troubleshooting"},
    ]
    
    return jsonify({
        'success': True,
        'faqs': faqs
    })

if __name__ == '__main__':
    print("\n" + "="*50)
    print("🤖 TASKFLOW CHATBOT INICIANDO...")
    print("="*50)
    print(f"✅ Flask: OK")
    print(f"✅ CORS: OK")
    print(f"✅ Gemini API: {'OK' if GEMINI_API_KEY else '❌ NÃO CONFIGURADA'}")
    print(f"✅ FAQs carregadas: {len(FAQ_RESPONSES)}")
    print("\n📡 Servidor rodando em http://localhost:5000")
    print("📋 Endpoints disponíveis:")
    print("   POST   /api/chat - Enviar mensagem")
    print("   GET    /api/chat/health - Status do chatbot")
    print("   GET    /api/chat/faqs - Perguntas frequentes")
    print("\n" + "="*50 + "\n")
    
    app.run(debug=True, port=5000, host='0.0.0.0')