let tasks = [];
let currentFilter = 'all';
let selectedCategory = null;
let selectedPriority = null;

function resetApp() {
    if (confirm('Tem certeza que deseja resetar o app? Todos os dados serão perdidos.')) {
        tasks = [];
        renderTasks();
        updateStats();
        saveTasks();
    }
}

// Inicialização dos event listeners quando o DOM carregar
document.addEventListener('DOMContentLoaded', function() {
    // Seleção de categoria
    document.querySelectorAll('.category-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.category-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedCategory = this.dataset.category;
        });
    });

    // Seleção de prioridade
    document.querySelectorAll('.priority-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.priority-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedPriority = this.dataset.priority;
        });
    });

    // Filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.dataset.filter;
            renderTasks();
        });
    });

    // Enter para adicionar tarefa
    document.getElementById('taskInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Inicializar
    updateStats();
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (!taskText) {
        alert('Digite uma tarefa!');
        return;
    }

    if (!selectedCategory) {
        alert('Selecione uma categoria!');
        return;
    }

    if (!selectedPriority) {
        alert('Selecione uma prioridade!');
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        category: selectedCategory,
        priority: selectedPriority,
        completed: false,
        createdAt: new Date().toLocaleDateString('pt-BR')
    };

    tasks.unshift(task);
    taskInput.value = '';
    
    // Reset selections
    document.querySelectorAll('.category-option').forEach(opt => opt.classList.remove('selected'));
    document.querySelectorAll('.priority-option').forEach(opt => opt.classList.remove('selected'));
    selectedCategory = null;
    selectedPriority = null;

    renderTasks();
    updateStats();
    saveTasks();
}

function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    renderTasks();
    updateStats();
    saveTasks();
}

function deleteTask(id) {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
        tasks = tasks.filter(task => task.id !== id);
        renderTasks();
        updateStats();
        saveTasks();
    }
}

function renderTasks() {
    const container = document.getElementById('tasksContainer');
    let filteredTasks = tasks;

    // Aplicar filtros
    if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    } else if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter !== 'all') {
        filteredTasks = tasks.filter(task => task.category === currentFilter);
    }

    if (filteredTasks.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <h3>Nenhuma tarefa encontrada</h3>
                <p>Tente ajustar os filtros ou adicionar uma nova tarefa!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = filteredTasks.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <div class="task-header">
                <div class="task-title">${task.text}</div>
                <div class="task-actions">
                    <button class="action-btn complete-btn" onclick="toggleTask(${task.id})">
                        <i class="fas fa-${task.completed ? 'undo' : 'check'}"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteTask(${task.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="task-meta">
                <span class="task-category category-${task.category}">
                    ${getCategoryIcon(task.category)} ${getCategoryName(task.category)}
                </span>
                <span class="task-priority priority-${task.priority}">
                    <i class="fas fa-${getPriorityIcon(task.priority)}"></i>
                    ${getPriorityName(task.priority)}
                </span>
                <span><i class="fas fa-calendar"></i> ${task.createdAt}</span>
            </div>
        </div>
    `).join('');
}

function getCategoryIcon(category) {
    const icons = {
        work: '<i class="fas fa-briefcase"></i>',
        personal: '<i class="fas fa-user"></i>',
        study: '<i class="fas fa-book"></i>',
        health: '<i class="fas fa-heart"></i>',
        other: '<i class="fas fa-star"></i>'
    };
    return icons[category] || '<i class="fas fa-star"></i>';
}

function getCategoryName(category) {
    const names = {
        work: 'Trabalho',
        personal: 'Pessoal',
        study: 'Estudos',
        health: 'Saúde',
        other: 'Outros'
    };
    return names[category] || 'Outros';
}

function getPriorityIcon(priority) {
    const icons = {
        low: 'arrow-down',
        medium: 'arrow-right',
        high: 'arrow-up'
    };
    return icons[priority] || 'arrow-right';
}

function getPriorityName(priority) {
    const names = {
        low: 'Baixa',
        medium: 'Média',
        high: 'Alta'
    };
    return names[priority] || 'Média';
}

function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const pending = total - completed;

    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = completed;
    document.getElementById('pendingTasks').textContent = pending;
}

function saveTasks() {
    const data = { tasks };
    console.log('Dados salvos:', data);
}

function loadTasks() {
    // Simular carregamento (normalmente carregaria do localStorage)
    renderTasks();
    updateStats();
}