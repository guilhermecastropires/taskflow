// Configuração da API
const API_URL = 'http://localhost:3001/api';

console.log('🔧 API URL configurada:', API_URL);

// Classe para gerenciar requisições à API
class API {
    constructor() {
        this.baseURL = API_URL;
        console.log('✅ Classe API instanciada');
    }

    // Pegar o token do localStorage
    getToken() {
        const user = localStorage.getItem('user');
        if (!user) {
            console.warn('⚠️ Nenhum usuário encontrado no localStorage');
            return null;
        }
        
        try {
            const userData = JSON.parse(user);
            if (!userData.token) {
                console.warn('⚠️ Token não encontrado nos dados do usuário');
                return null;
            }
            console.log('🔑 Token recuperado com sucesso');
            return userData.token;
        } catch (e) {
            console.error('❌ Erro ao parsear user do localStorage:', e);
            return null;
        }
    }

    // Headers padrão
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
            console.log('🔒 Authorization header adicionado');
        }

        return headers;
    }

    // Método genérico para fazer requisições
    async request(endpoint, options = {}) {
        const fullURL = `${this.baseURL}${endpoint}`;
        
        try {
            console.log(`📤 Requisição ${options.method || 'GET'}:`, fullURL);
            
            if (options.body) {
                console.log('📦 Body:', JSON.parse(options.body));
            }
            
            const response = await fetch(fullURL, {
                ...options,
                headers: {
                    ...this.getHeaders(),
                    ...options.headers
                }
            });

            console.log(`📥 Status da resposta: ${response.status} ${response.statusText}`);

            let data;
            try {
                data = await response.json();
                console.log('📊 Dados recebidos:', data);
            } catch (e) {
                console.error('❌ Erro ao parsear JSON da resposta:', e);
                throw new Error('Resposta inválida do servidor');
            }

            if (!response.ok) {
                console.error(`❌ Erro HTTP ${response.status}:`, data.message);
                
                // Se token inválido ou expirado, redirecionar para login
                if (response.status === 401) {
                    console.warn('🔓 Token inválido, redirecionando para login...');
                    localStorage.removeItem('user');
                    
                    // Só redireciona se não estiver na página de login
                    if (!window.location.pathname.includes('index.html') && 
                        !window.location.pathname.includes('register.html')) {
                        window.location.href = 'index.html';
                    }
                }
                
                throw new Error(data.message || `Erro ${response.status}: ${response.statusText}`);
            }

            console.log('✅ Requisição bem-sucedida');
            return data;
            
        } catch (error) {
            console.error('❌ Erro na requisição API:', error.message);
            
            // Se for erro de rede
            if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
                throw new Error('Não foi possível conectar ao servidor. Verifique se a API está rodando.');
            }
            
            throw error;
        }
    }

    // ============ USUÁRIOS ============

    /**
     * Registrar novo usuário
     * @param {Object} userData - { nome, email, senha }
     */
    async register(userData) {
        console.log('👤 Registrando novo usuário...');
        return this.request('/users/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    /**
     * Fazer login
     * @param {Object} credentials - { email, senha }
     */
    async login(credentials) {
        console.log('🔐 Fazendo login...');
        return this.request('/users/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    /**
     * Deletar conta do usuário (requer autenticação)
     */
    async deleteAccount() {
        console.log('🗑️ Deletando conta do usuário...');
        return this.request('/users/account', {
            method: 'DELETE'
        });
    }

    // ============ TAREFAS ============

    /**
     * Buscar todas as tarefas do usuário
     * @param {Object} filters - { status?, prioridade? }
     */
    async getTasks(filters = {}) {
        console.log('📋 Buscando tarefas com filtros:', filters);
        
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.prioridade) params.append('prioridade', filters.prioridade);
        
        const query = params.toString() ? `?${params.toString()}` : '';
        return this.request(`/tasks${query}`, {
            method: 'GET'
        });
    }

    /**
     * Buscar estatísticas das tarefas
     * IMPORTANTE: Esta rota deve ser chamada ANTES de getTasks
     * para evitar conflito com /tasks/:id
     */
    async getTaskStats() {
        console.log('📊 Buscando estatísticas das tarefas...');
        return this.request('/tasks/stats', {
            method: 'GET'
        });
    }

    /**
     * Buscar tarefa específica por ID
     * @param {number} id - ID da tarefa
     */
    async getTaskById(id) {
        console.log(`📄 Buscando tarefa #${id}...`);
        return this.request(`/tasks/${id}`, {
            method: 'GET'
        });
    }

    /**
     * Criar nova tarefa
     * @param {Object} taskData - { titulo, descricao?, status?, prioridade?, data_vencimento? }
     */
    async createTask(taskData) {
        console.log('➕ Criando nova tarefa:', taskData);
        return this.request('/tasks', {
            method: 'POST',
            body: JSON.stringify(taskData)
        });
    }

    /**
     * Atualizar tarefa existente
     * @param {number} id - ID da tarefa
     * @param {Object} taskData - Campos para atualizar
     */
    async updateTask(id, taskData) {
        console.log(`✏️ Atualizando tarefa #${id}:`, taskData);
        return this.request(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify(taskData)
        });
    }

    /**
     * Deletar tarefa
     * @param {number} id - ID da tarefa
     */
    async deleteTask(id) {
        console.log(`🗑️ Deletando tarefa #${id}...`);
        return this.request(`/tasks/${id}`, {
            method: 'DELETE'
        });
    }

    /**
     * Marcar tarefa como concluída
     * @param {number} id - ID da tarefa
     */
    async markTaskAsCompleted(id) {
        console.log(`✅ Marcando tarefa #${id} como concluída...`);
        return this.request(`/tasks/${id}/complete`, {
            method: 'PATCH'
        });
    }
}

// Instância global da API
const api = new API();

// Testar conexão ao carregar (apenas para debug)
if (localStorage.getItem('user')) {
    console.log('🔍 Usuário autenticado detectado');
} else {
    console.log('🔓 Nenhum usuário autenticado');
}

console.log('✅ api.js carregado com sucesso!');