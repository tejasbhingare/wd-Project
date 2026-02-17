// ==========================================
// TASK DETAILS PAGE
// ==========================================

let currentTaskId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadTaskDetails();
    setupActions();
});

function loadTaskDetails() {
    currentTaskId = Utils.getUrlParam('id');
    
    if (!currentTaskId) {
        window.location.href = 'all-tasks.html';
        return;
    }

    const task = taskManager.getTaskById(currentTaskId);
    
    if (!task) {
        document.body.innerHTML = '<p class="empty-state">Task not found</p>';
        return;
    }

    // Display task details
    document.getElementById('taskTitle').textContent = task.title;
    document.getElementById('taskDescription').textContent = task.description || 'No description provided';
    document.getElementById('taskCategory').textContent = task.category;
    document.getElementById('taskPriority').textContent = Utils.getPriorityBadge(task.priority);
    document.getElementById('taskStatus').textContent = task.status.charAt(0).toUpperCase() + task.status.slice(1);
    document.getElementById('taskDueDate').textContent = task.dueDate ? 
        Utils.formatDateTime(task.dueDate, task.dueTime) : 'No due date';
    
    // Priority badge
    const priorityBadge = document.getElementById('priorityBadge');
    priorityBadge.textContent = Utils.getPriorityBadge(task.priority);
    priorityBadge.className = `badge ${task.priority}`;

    // Status badge
    const statusBadge = document.getElementById('statusBadge');
    statusBadge.textContent = task.status.toUpperCase();
    statusBadge.className = `badge ${task.status}`;

    // Tags
    const tagsContainer = document.getElementById('taskTags');
    if (task.tags && task.tags.length > 0) {
        tagsContainer.innerHTML = task.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
    } else {
        tagsContainer.innerHTML = '<p class="empty-state">No tags</p>';
    }

    // Dates
    document.getElementById('createdDate').textContent = Utils.formatDate(task.createdDate);
    document.getElementById('modifiedDate').textContent = task.updatedDate ? 
        Utils.formatDate(task.updatedDate) : Utils.formatDate(task.createdDate);

    // Update button link
    document.getElementById('editBtn').href = `edit-task.html?id=${currentTaskId}`;

    // Update complete button text
    const completeBtn = document.getElementById('completeBtn');
    if (task.status === 'completed') {
        completeBtn.textContent = 'Mark as Pending';
    }
}

function setupActions() {
    const completeBtn = document.getElementById('completeBtn');
    const deleteBtn = document.getElementById('deleteBtn');

    completeBtn.addEventListener('click', () => {
        const task = taskManager.getTaskById(currentTaskId);
        if (task.status === 'completed') {
            taskManager.updateTask(currentTaskId, { status: 'pending', completedDate: null });
            Utils.showNotification('Task marked as pending', 'success');
        } else {
            taskManager.completeTask(currentTaskId);
            Utils.showNotification('Task completed! Great job!', 'success');
        }
        setTimeout(() => {
            loadTaskDetails();
        }, 1000);
    });

    deleteBtn.addEventListener('click', () => {
        taskManager.deleteTask(currentTaskId);
        Utils.showNotification('Task deleted', 'success');
        setTimeout(() => {
            window.location.href = Utils.getPagePath('all-tasks.html');
        }, 1000);
    });
}