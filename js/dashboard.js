// ==========================================
// DASHBOARD PAGE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
});

function loadDashboard() {
    // Get statistics
    const stats = taskManager.getStatistics();
    
    // Update stat cards
    document.getElementById('totalTasks').textContent = stats.total;
    document.getElementById('completedTasks').textContent = stats.completed;
    document.getElementById('pendingTasks').textContent = stats.pending;
    document.getElementById('overdueTasks').textContent = stats.overdue;

    // Show reminder for overdue tasks
    if (stats.overdue > 0) {
        Utils.showNotification(`⚠️ You have ${stats.overdue} overdue task${stats.overdue > 1 ? 's' : ''}!`, 'warning');
    }

    // Load today's tasks
    const todayTasks = taskManager.getTasksByDueDate('today').filter(t => t.status !== 'completed');
    displayTodaysTasks(todayTasks);

    // Load upcoming tasks
    const upcomingTasks = taskManager.getTasksByDueDate('week').filter(t => t.status !== 'completed');
    displayUpcomingTasks(upcomingTasks);
}

function displayTodaysTasks(tasks) {
    const container = document.getElementById('todayTasksList');
    
    if (tasks.length === 0) {
        container.innerHTML = '<p class="empty-state">No tasks for today</p>';
        return;
    }

    container.innerHTML = tasks.map(task => Utils.createTaskItemHTML(task)).join('');
    
    // Add event listeners for checkboxes
    container.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const taskId = e.target.dataset.taskId;
            if (e.target.checked) {
                taskManager.completeTask(taskId);
            } else {
                taskManager.updateTask(taskId, { status: 'pending' });
            }
            loadDashboard();
        });
    });
}

function displayUpcomingTasks(tasks) {
    const container = document.getElementById('upcomingTasksList');
    
    // Filter out today's tasks
    const filteredTasks = tasks.filter(t => !Utils.isToday(t.dueDate)).slice(0, 5);

    if (filteredTasks.length === 0) {
        container.innerHTML = '<p class="empty-state">No upcoming tasks</p>';
        return;
    }

    container.innerHTML = filteredTasks.map(task => Utils.createTaskItemHTML(task)).join('');
    
    // Add event listeners for checkboxes
    container.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const taskId = e.target.dataset.taskId;
            if (e.target.checked) {
                taskManager.completeTask(taskId);
            } else {
                taskManager.updateTask(taskId, { status: 'pending' });
            }
            loadDashboard();
        });
    });
}