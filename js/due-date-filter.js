// ==========================================
// DUE DATE FILTER PAGE
// ==========================================

let currentDateFilter = 'today';

document.addEventListener('DOMContentLoaded', () => {
    setupFilters();
    loadDateFilteredTasks();
});

function setupFilters() {
    document.querySelectorAll('.date-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.date-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentDateFilter = btn.dataset.filter;
            loadDateFilteredTasks();
        });
    });

    // Set first button as active
    document.querySelector('.date-btn').classList.add('active');
}

function loadDateFilteredTasks() {
    const tasks = taskManager.getTasksByDueDate(currentDateFilter)
        .filter(t => t.status !== 'completed')
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    displayTasks(tasks);
}

function displayTasks(tasks) {
    const container = document.getElementById('dateTasksList');
    
    if (tasks.length === 0) {
        const filterLabels = {
            today: 'today',
            tomorrow: 'tomorrow',
            week: 'this week',
            month: 'this month',
            overdue: 'overdue'
        };
        container.innerHTML = `<p class="empty-state">No tasks ${filterLabels[currentDateFilter]}</p>`;
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
            loadDateFilteredTasks();
        });
    });
}