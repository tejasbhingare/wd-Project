// ==========================================
// EDIT TASK PAGE
// ==========================================

let currentTaskId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadTaskToEdit();
    setupEditForm();
});

function loadTaskToEdit() {
    currentTaskId = Utils.getUrlParam('id');
    
    if (!currentTaskId) {
        window.location.href = 'all-tasks.html';
        return;
    }

    const task = taskManager.getTaskById(currentTaskId);
    
    if (!task) {
        Utils.showNotification('Task not found', 'error');
        setTimeout(() => {
            window.location.href = 'all-tasks.html';
        }, 2000);
        return;
    }

    // Populate form with task data
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description;
    document.getElementById('taskCategory').value = task.category;
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskDueDate').value = task.dueDate;
    document.getElementById('taskDueTime').value = task.dueTime;
    document.getElementById('taskStatus').value = task.status;
    document.getElementById('taskTags').value = task.tags.join(', ');
}

function setupEditForm() {
    const form = document.getElementById('editTaskForm');
    const deleteBtn = document.getElementById('deleteBtn');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const updates = {
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category'),
            priority: formData.get('priority'),
            dueDate: formData.get('dueDate'),
            dueTime: formData.get('dueTime'),
            status: formData.get('status'),
            tags: formData.get('tags') ? formData.get('tags').split(',').map(t => t.trim()) : []
        };

        if (!updates.title.trim()) {
            Utils.showNotification('Please enter a task title', 'error');
            return;
        }

        taskManager.updateTask(currentTaskId, updates);
        Utils.showNotification('Task updated successfully!', 'success');

        const successMsg = document.getElementById('successMessage');
        successMsg.style.display = 'block';
        
        setTimeout(() => {
            window.location.href = 'all-tasks.html';
        }, 2000);
    });

    deleteBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this task? It will be moved to trash.')) {
            taskManager.deleteTask(currentTaskId);
            Utils.showNotification('Task deleted', 'success');
            setTimeout(() => {
                window.location.href = 'all-tasks.html';
            }, 1000);
        }
    });
}