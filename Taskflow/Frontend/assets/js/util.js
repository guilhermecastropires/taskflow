// ==================== FUNÇÕES DE AUTENTICAÇÃO ====================

// Verificar se usuário está autenticado
function checkAuth() {
    const userStr = localStorage.getItem('user');
    console.log('Verificando autenticação, user:', userStr);
    
    if (!userStr) {
        console.log('Nenhum usuário encontrado, redirecionando...');
        window.location.href = 'index.html';
        return false;
    }
    
    try {
        const user = JSON.parse(userStr);
        if (!user.token) {
            console.log('Token não encontrado, redirecionando...');
            window.location.href = 'index.html';
            return false;
        }
        console.log('Usuário autenticado:', user.nome);
        return user;
    } catch (e) {
        console.error('Erro ao parsear user:', e);
        window.location.href = 'index.html';
        return false;
    }
}

// Fazer logout
function logout() {
    console.log('Função logout chamada');
    if (confirm('Deseja realmente sair?')) {
        console.log('Removendo dados do localStorage');
        localStorage.removeItem('user');
        console.log('Redirecionando para login');
        window.location.href = 'index.html';
    }
}

// ==================== FUNÇÕES DE DATA ====================

// Formatar data para exibição
function formatDate(dateString) {
    if (!dateString) return 'Sem data';
    
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
}

// Formatar data para input type="date"
function formatDateForInput(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
}

// ==================== FUNÇÕES DE UI ====================

// Mostrar mensagem de alerta
function showAlert(message, type = 'info') {
    console.log('Mostrando alerta:', message, type);
    
    // Criar elemento de alerta
    const alertDiv = document.createElement('div');
    alertDiv.className = `fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg animate-fadeInUp max-w-md`;
    
    // Definir cores baseado no tipo
    const colors = {
        success: 'bg-green-100 border-2 border-green-500 text-green-700',
        error: 'bg-red-100 border-2 border-red-500 text-red-700',
        warning: 'bg-yellow-100 border-2 border-yellow-500 text-yellow-700',
        info: 'bg-blue-100 border-2 border-blue-500 text-blue-700'
    };
    
    alertDiv.className += ` ${colors[type]}`;
    
    // Ícones baseado no tipo
    const icons = {
        success: '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>',
        error: '<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>',
        warning: '<path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>',
        info: '<path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>'
    };
    
    alertDiv.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    ${icons[type]}
                </svg>
                <span class="font-medium">${message}</span>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-current hover:opacity-75">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
            </button>
        </div>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Remover automaticamente após 5 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

// Mostrar loading
function showLoading() {
    console.log('Mostrando loading');
    
    // Remover loading anterior se existir
    const oldLoading = document.getElementById('loading');
    if (oldLoading) {
        oldLoading.remove();
    }
    
    const loading = document.createElement('div');
    loading.id = 'loading';
    loading.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loading.innerHTML = `
        <div class="bg-white rounded-2xl p-8 shadow-2xl">
            <svg class="animate-spin h-12 w-12 text-purple-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="mt-4 text-gray-600 font-medium">Carregando...</p>
        </div>
    `;
    document.body.appendChild(loading);
}

function hideLoading() {
    console.log('Escondendo loading');
    const loading = document.getElementById('loading');
    if (loading) {
        loading.remove();
    }
}

// ==================== FUNÇÕES DE ESTILO ====================

// Obter cor baseada no status
function getStatusColor(status) {
    const colors = {
        pendente: 'bg-yellow-100 text-yellow-800',
        em_progresso: 'bg-blue-100 text-blue-800',
        concluida: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

// Obter cor baseada na prioridade
function getPriorityColor(prioridade) {
    const colors = {
        baixa: 'bg-gray-100 text-gray-800',
        media: 'bg-yellow-100 text-yellow-800',
        alta: 'bg-red-100 text-red-800'
    };
    return colors[prioridade] || 'bg-gray-100 text-gray-800';
}

// Obter ícone baseado na prioridade
function getPriorityIcon(prioridade) {
    const icons = {
        baixa: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>',
        media: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14"></path>',
        alta: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>'
    };
    return icons[prioridade] || icons.media;
}

// ==================== FUNÇÕES DE TRADUÇÃO ====================

// Traduzir status
function translateStatus(status) {
    const translations = {
        pendente: 'Pendente',
        em_progresso: 'Em Progresso',
        concluida: 'Concluída'
    };
    return translations[status] || status;
}

// Traduzir prioridade
function translatePriority(prioridade) {
    const translations = {
        baixa: 'Baixa',
        media: 'Média',
        alta: 'Alta'
    };
    return translations[prioridade] || prioridade;
}

console.log('utils.js carregado com sucesso!');