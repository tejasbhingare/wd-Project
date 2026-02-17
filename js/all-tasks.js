// ==========================================
// ALL TASKS PAGE
// ==========================================

let currentFilter = 'all';
let currentSearchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadAllTasks();
});

function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            loadAllTasks();
        });
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value;
            loadAllTasks();
        });
    }
}

function loadAllTasks() {
    let tasks = taskManager.getAllTasks();

    // Apply filter
    if (currentFilter === 'pending') {
        tasks = tasks.filter(t => t.status === 'pending');
    } else if (currentFilter === 'completed') {
        tasks = tasks.filter(t => t.status === 'completed');
    }

    // Apply search
    if (currentSearchQuery) {
        tasks = taskManager.searchTasks(currentSearchQuery).filter(t => {
            if (currentFilter === 'pending') return t.status === 'pending';
            if (currentFilter === 'completed') return t.status === 'completed';
            return true;
        });
    }

    // Sort by due date
    tasks.sort((a, b) => {
        if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate) - new Date(b.dueDate);
        }
        return 0;
    });

    displayTasks(tasks);
}

function displayTasks(tasks) {
    const container = document.getElementById('allTasksList');
    
    if (tasks.length === 0) {
        container.innerHTML = '<p class="empty-state">No tasks found. <a href="add-task.html">Create one</a></p>';
        return;
    }

    container.innerHTML = tasks.map(task => Utils.createTaskItemHTML(task)).join('');
    
    // Add event listeners
    container.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const taskId = e.target.dataset.taskId;
            if (e.target.checked) {
                taskManager.completeTask(taskId);
            } else {
                taskManager.updateTask(taskId, { status: 'pending' });
            }
            loadAllTasks();
        });
    });
}