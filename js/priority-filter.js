// ==========================================
// PRIORITY FILTER PAGE
// ==========================================

let currentPriority = 'high';

document.addEventListener('DOMContentLoaded', () => {
    setupFilters();
    loadPriorityTasks();
});

function setupFilters() {
    document.querySelectorAll('.priority-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.priority-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPriority = btn.dataset.priority;
            loadPriorityTasks();
        });
    });

    // Set first button as active
    document.querySelector('.priority-btn').classList.add('active');
}

function loadPriorityTasks() {
    const tasks = taskManager.getTasksByPriority(currentPriority);
    
    // Update page title
    const titleMap = {
        high: 'High Priority Tasks',
        medium: 'Medium Priority Tasks',
        low: 'Low Priority Tasks'
    };
    document.getElementById('pageTitle').textContent = titleMap[currentPriority];

    displayTasks(tasks);
}

function displayTasks(tasks) {
    const container = document.getElementById('priorityTasksList');
    
    if (tasks.length === 0) {
        container.innerHTML = `<p class="empty-state">No ${currentPriority} priority tasks</p>`;
        return;
    }

    container.innerHTML = tasks.map(task => Utils.createTaskItemHTML(task)).join('');

    // Add checkbox listeners
    container.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const taskId = e.target.dataset.taskId;
            if (e.target.checked) {
                taskManager.completeTask(taskId);
            } else {
                taskManager.updateTask(taskId, { status: 'pending' });
            }
            loadPriorityTasks();
        });
    });
}