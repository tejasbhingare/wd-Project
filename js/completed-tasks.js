// ==========================================
// COMPLETED TASKS PAGE
// ==========================================

let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadCompletedTasks();
});

function setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            loadCompletedTasks();
        });
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value;
            const allTasks = taskManager.getTasksByStatus('completed');
            const filtered = query ? taskManager.searchTasks(query).filter(t => t.status === 'completed') : allTasks;
            displayCompletedTasks(filtered);
        });
    }

    // Clear all button
    const clearBtn = document.getElementById('clearAllBtn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Are you sure? This will delete all completed tasks from your list (not from trash).')) {
                const completedTasks = taskManager.getTasksByStatus('completed');
                completedTasks.forEach(task => {
                    taskManager.deleteTask(task.id);
                });
                Utils.showNotification('All completed tasks cleared', 'success');
                loadCompletedTasks();
            }
        });
    }
}

function loadCompletedTasks() {
    let tasks = taskManager.getTasksByStatus('completed');

    // Apply date filter
    if (currentFilter === 'today') {
        tasks = tasks.filter(t => Utils.isToday(t.completedDate));
    } else if (currentFilter === 'week') {
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        tasks = tasks.filter(t => {
            const completedDate = new Date(t.completedDate);
            return completedDate >= weekAgo && completedDate <= today;
        });
    } else if (currentFilter === 'month') {
        const today = new Date();
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        tasks = tasks.filter(t => {
            const completedDate = new Date(t.completedDate);
            return completedDate >= monthAgo && completedDate <= today;
        });
    }

    // Sort by completed date (newest first)
    tasks.sort((a, b) => new Date(b.completedDate) - new Date(a.completedDate));

    displayCompletedTasks(tasks);
}

function displayCompletedTasks(tasks) {
    const container = document.getElementById('completedTasksList');
    
    if (tasks.length === 0) {
        container.innerHTML = '<p class="empty-state">No completed tasks. Keep working!</p>';
        return;
    }

    container.innerHTML = tasks.map(task => {
        return `
            <div class="task-item completed">
                <input type="checkbox" class="task-checkbox" data-task-id="${task.id}" checked>
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    <div class="task-meta">
                        <span class="task-meta-item">✅ Completed on ${Utils.formatDate(task.completedDate)}</span>
                        <span class="task-meta-item">📂 ${task.category}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <a href="${Utils.getPagePath('task-details.html')}?id=${task.id}" class="btn btn-secondary" style="padding: 8px 12px;">View</a>
                </div>
            </div>
        `;
    }).join('');

    // Add checkbox listeners to mark as pending
    container.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const taskId = e.target.dataset.taskId;
            taskManager.updateTask(taskId, { status: 'pending', completedDate: null });
            Utils.showNotification('Task marked as pending', 'success');
            loadCompletedTasks();
        });
    });
}