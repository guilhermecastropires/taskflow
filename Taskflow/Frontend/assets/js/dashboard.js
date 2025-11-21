console.log('dashboard.js iniciando...');

// Variáveis globais
let currentFilter = 'all';
let allTasks = [];
let currentEditingTaskId = null;

// Verificar autenticação ao carregar página
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, iniciando dashboard...');
    const user = checkAuth();
    if (user) {
        console.log('Usuário autenticado, inicializando dashboard');
        initDashboard(user);
    }
});

// Inicializar dashboard
async function initDashboard(user) {
    console.log('Inicializando dashboard para:', user.nome);
    
    // Mostrar informações do usuário
    displayUserInfo(user);
    
    // Adicionar event listener no formulário
    setupFormListener();
    
    // Carregar dados iniciais
    await loadDashboardData();
}

// Configurar listener do formulário
function setupFormListener() {
    const taskForm = document.getElementById('taskForm');
    if (taskForm) {
        console.log('Configurando listener do formulário');
        taskForm.addEventListener('submit', handleFormSubmit);
    } else {
        console.error('Formulário não encontrado!');
    }
}

// Handler do formulário
async function handleFormSubmit(e) {
    e.preventDefault();
    console.log('Formulário de tarefa submetido');
    
    const taskData = {
        titulo: document.getElementById('taskTitle').value,
        descricao: document.getElementById('taskDescription').value,
        status: document.getElementById('taskStatus').value,
        prioridade: document.getElementById('taskPriority').value,
        data_vencimento: document.getElementById('taskDueDate').value || null
    };
    
    console.log('Dados da tarefa:', taskData);
    
    try {
        showLoading();
        
        let response;
        if (currentEditingTaskId) {
            console.log('Atualizando tarefa:', currentEditingTaskId);
            response = await api.updateTask(currentEditingTaskId, taskData);
        } else {
            console.log('Criando nova tarefa');
            response = await api.createTask(taskData);
        }
        
        hideLoading();
        
        console.log('Resposta:', response);
        
        if (response.success) {
            showAlert(
                currentEditingTaskId ? 'Tarefa atualizada com sucesso!' : 'Tarefa criada com sucesso!',
                'success'
            );
            closeModal();
            await loadDashboardData();
        }
    } catch (error) {
        hideLoading();
        console.error('Erro ao salvar tarefa:', error);
        showAlert('Erro ao salvar tarefa: ' + error.message, 'error');
    }
}

// Exibir informações do usuário
function displayUserInfo(user) {
    console.log('Exibindo informações do usuário:', user);
    
    const welcomeMessage = document.getElementById('welcomeMessage');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userAvatar = document.getElementById('userAvatar');
    
    if (welcomeMessage) {
        welcomeMessage.textContent = `Bem-vindo, ${user.nome}!`;
    }
    
    if (userName) {
        userName.textContent = user.nome;
    }
    
    if (userEmail) {
        userEmail.textContent = user.email;
    }
    
    if (userAvatar) {
        userAvatar.textContent = user.nome.charAt(0).toUpperCase();
    }
}

// Carregar dados do dashboard
async function loadDashboardData() {
    try {
        console.log('Carregando dados do dashboard...');
        showLoading();
        
        // Carregar estatísticas
        await loadStats();
        
        // Carregar tarefas
        await loadTasks();
        
        hideLoading();
        console.log('Dados carregados com sucesso');
    } catch (error) {
        hideLoading();
        showAlert('Erro ao carregar dados do dashboard', 'error');
        console.error(error);
    }
}

// Carregar estatísticas
async function loadStats() {
    try {
        console.log('Carregando estatísticas...');
        const response = await api.getTaskStats();
        
        if (response.success) {
            const stats = response.data;
            console.log('Estatísticas:', stats);
            
            document.getElementById('totalTasks').textContent = stats.total || 0;
            document.getElementById('pendingTasks').textContent = stats.pendentes || 0;
            document.getElementById('progressTasks').textContent = stats.em_progresso || 0;
            document.getElementById('completedTasks').textContent = stats.concluidas || 0;
        }
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

// Carregar tarefas
async function loadTasks(filters = {}) {
    try {
        console.log('Carregando tarefas...');
        const response = await api.getTasks(filters);
        
        if (response.success) {
            allTasks = response.data;
            console.log('Tarefas carregadas:', allTasks.length);
            displayTasks(allTasks);
        }
    } catch (error) {
        showAlert('Erro ao carregar tarefas', 'error');
        console.error(error);
    }
}

// Exibir tarefas
function displayTasks(tasks) {
    console.log('Exibindo tarefas:', tasks.length);
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    
    if (!tasks || tasks.length === 0) {
        taskList.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }
    
    emptyState.classList.add('hidden');
    
    taskList.innerHTML = tasks.map(task => `
        <div class="task-item bg-gray-50 rounded-xl p-4 hover:shadow-md transition-all duration-200">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                        <h3 class="font-semibold text-gray-800 text-lg">${task.titulo}</h3>
                        <span class="px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}">
                            ${translateStatus(task.status)}
                        </span>
                        <span class="px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.prioridade)}">
                            <svg class="w-3 h-3 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                ${getPriorityIcon(task.prioridade)}
                            </svg>
                            ${translatePriority(task.prioridade)}
                        </span>
                    </div>
                    
                    ${task.descricao ? `
                        <p class="text-gray-600 text-sm mb-3">${task.descricao}</p>
                    ` : ''}
                    
                    <div class="flex items-center gap-4 text-xs text-gray-500">
                        ${task.data_vencimento ? `
                            <div class="flex items-center gap-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span>Vencimento: ${formatDate(task.data_vencimento)}</span>
                            </div>
                        ` : ''}
                        
                        <div class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            <span>Criada em: ${formatDate(task.created_at)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="flex gap-2 ml-4">
                    ${task.status !== 'concluida' ? `
                        <button onclick="markAsCompleted(${task.id})" class="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Marcar como concluída">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </button>
                    ` : ''}
                    
                    <button onclick="editTask(${task.id})" class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                    </button>
                    
                    <button onclick="deleteTask(${task.id})" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Deletar">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Filtrar tarefas
function filterTasks(status) {
    console.log('Filtrando tarefas por:', status);
    currentFilter = status;
    
    // Atualizar botões de filtro
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.className = 'filter-btn px-4 py-2 rounded-xl font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200';
    });
    
    // Encontrar e atualizar o botão clicado
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach((btn, index) => {
        const btnStatus = ['all', 'pendente', 'em_progresso', 'concluida'][index];
        if (btnStatus === status) {
            btn.className = 'filter-btn px-4 py-2 rounded-xl font-medium bg-purple-100 text-purple-600';
        }
    });
    
    // Filtrar tarefas
    if (status === 'all') {
        displayTasks(allTasks);
    } else {
        const filtered = allTasks.filter(task => task.status === status);
        displayTasks(filtered);
    }
}

// Filtrar por prioridade
function filterByPriority(priority) {
    console.log('Filtrando por prioridade:', priority);
    const filtered = allTasks.filter(task => task.prioridade === priority);
    displayTasks(filtered);
    showAlert(`Mostrando tarefas de prioridade ${translatePriority(priority)}`, 'info');
}

// Mostrar tarefas de hoje
function showTodayTasks() {
            // 1. Pega a data de hoje do seu computador
            const now = new Date();
            
            // 2. Formata manualmente para YYYY-MM-DD usando hora LOCAL
            // (Isso evita o problema do toISOString que pega hora de Londres)
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const todayFormatted = `${year}-${month}-${day}`;
            
            console.log('📅 Hoje (Local):', todayFormatted); // Para debug

            const filtered = allTasks.filter(task => {
                if (!task.data_vencimento) return false;

                // 3. Pega apenas os 10 primeiros caracteres da data do banco (YYYY-MM-DD)
                // Isso ignora se é T00:00 ou T21:00. Pega a data "crua".
                let taskDateRaw = task.data_vencimento;
                
                // Se for string ISO longa, corta. Se já for curta, mantém.
                if (typeof taskDateRaw === 'string' && taskDateRaw.length >= 10) {
                    taskDateRaw = taskDateRaw.substring(0, 10);
                }

                // Debug para ver o que está sendo comparado (Abra o console F12 se não funcionar)
                // console.log(`Comparando: Task ${taskDateRaw} === Hoje ${todayFormatted}`);
                
                return taskDateRaw === todayFormatted;
            });
            
            displayTasks(filtered);
            
            // Feedback visual
            if (filtered.length > 0) {
                showAlert(`Mostrando ${filtered.length} tarefas de hoje`, 'info');
            } else {
                showAlert('Nenhuma tarefa encontrada para hoje', 'info');
            }
            
            // Atualiza botões
            document.querySelectorAll('.filter-btn').forEach(btn => {
                btn.className = 'filter-btn px-4 py-2 rounded-xl font-medium bg-gray-100 text-gray-600 hover:bg-gray-200';
            });
        }

// Abrir modal de criar tarefa
function openCreateModal() {
    console.log('Abrindo modal de criar tarefa');
    currentEditingTaskId = null;
    document.getElementById('modalTitle').textContent = 'Nova Tarefa';
    document.getElementById('taskForm').reset();
    document.getElementById('taskId').value = '';
    document.getElementById('taskModal').classList.remove('hidden');
}

// Editar tarefa
async function editTask(id) {
    console.log('Editando tarefa:', id);
    try {
        showLoading();
        const response = await api.getTaskById(id);
        hideLoading();
        
        if (response.success) {
            const task = response.data;
            currentEditingTaskId = id;
            
            document.getElementById('modalTitle').textContent = 'Editar Tarefa';
            document.getElementById('taskId').value = task.id;
            document.getElementById('taskTitle').value = task.titulo;
            document.getElementById('taskDescription').value = task.descricao || '';
            document.getElementById('taskStatus').value = task.status;
            document.getElementById('taskPriority').value = task.prioridade;
            document.getElementById('taskDueDate').value = formatDateForInput(task.data_vencimento);
            
            document.getElementById('taskModal').classList.remove('hidden');
        }
    } catch (error) {
        hideLoading();
        showAlert('Erro ao carregar tarefa', 'error');
    }
}

// Fechar modal
function closeModal() {
    console.log('Fechando modal');
    document.getElementById('taskModal').classList.add('hidden');
    document.getElementById('taskForm').reset();
    currentEditingTaskId = null;
}

// Marcar tarefa como concluída
async function markAsCompleted(id) {
    console.log('Marcando tarefa como concluída:', id);
    if (!confirm('Deseja marcar esta tarefa como concluída?')) return;
    
    try {
        showLoading();
        const response = await api.markTaskAsCompleted(id);
        hideLoading();
        
        if (response.success) {
            showAlert('Tarefa marcada como concluída!', 'success');
            await loadDashboardData();
        }
    } catch (error) {
        hideLoading();
        showAlert('Erro ao atualizar tarefa', 'error');
    }
}

// Deletar tarefa
async function deleteTask(id) {
    console.log('Deletando tarefa:', id);
    if (!confirm('Deseja realmente deletar esta tarefa?')) return;
    
    try {
        showLoading();
        const response = await api.deleteTask(id);
        hideLoading();
        
        if (response.success) {
            showAlert('Tarefa deletada com sucesso!', 'success');
            await loadDashboardData();
        }
    } catch (error) {
        hideLoading();
        showAlert('Erro ao deletar tarefa', 'error');
    }
}

console.log('dashboard.js carregado com sucesso!');