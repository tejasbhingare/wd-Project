// ==========================================
// DELETED TASKS PAGE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    loadDeletedTasks();
    setupActions();
});

function loadDeletedTasks() {
    const deletedTasks = taskManager.deletedTasks;
    displayDeletedTasks(deletedTasks);
}

function displayDeletedTasks(tasks) {
    const container = document.getElementById('deletedTasksList');
    
    if (tasks.length === 0) {
        container.innerHTML = '<p class="empty-state">No deleted tasks. Your trash is empty!</p>';
        return;
    }

    container.innerHTML = tasks.map(task => {
        const deletedDate = new Date(task.deletedDate);
        const daysAgo = Math.floor((Date.now() - deletedDate) / (1000 * 60 * 60 * 24));

        return `
            <div class="task-item">
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    <div class="task-meta">
                        <span class="task-meta-item">🗑️ Deleted ${daysAgo} days ago</span>
                        <span class="task-meta-item">📂 ${task.category}</span>
                        <span class="task-meta-item">⏰ ${daysAgo < 30 ? `${30 - daysAgo} days until permanent deletion` : 'Permanent deletion pending'}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn btn-secondary restore-btn" data-task-id="${task.id}" style="padding: 8px 12px;">Restore</button>
                    <button class="btn btn-danger delete-permanently-btn" data-task-id="${task.id}" style="padding: 8px 12px;">Delete Permanently</button>
                </div>
            </div>
        `;
    }).join('');

    // Add restore listeners
    container.querySelectorAll('.restore-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const taskId = e.target.dataset.taskId;
            taskManager.restoreTask(taskId);
            Utils.showNotification('Task restored', 'success');
            loadDeletedTasks();
        });
    });

    // Add permanent delete listeners
    container.querySelectorAll('.delete-permanently-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const taskId = e.target.dataset.taskId;
            if (confirm('Are you sure? This will permanently delete the task.')) {
                taskManager.permanentlyDeleteTask(taskId);
                Utils.showNotification('Task permanently deleted', 'success');
                loadDeletedTasks();
            }
        });
    });
}

function setupActions() {
    const emptyTrashBtn = document.getElementById('emptyTrashBtn');
    
    if (emptyTrashBtn) {
        emptyTrashBtn.addEventListener('click', () => {
            if (confirm('Are you sure? This will permanently delete all items in trash. This action cannot be undone.')) {
                const deletedTasks = [...taskManager.deletedTasks];
                deletedTasks.forEach(task => {
                    taskManager.permanentlyDeleteTask(task.id);
                });
                Utils.showNotification('Trash emptied', 'success');
                loadDeletedTasks();
            }
        });
    }
}