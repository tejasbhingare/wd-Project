// ==========================================
// ADD TASK PAGE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    setupAddTaskForm();
});

function setupAddTaskForm() {
    const form = document.getElementById('addTaskForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const taskData = {
            title: formData.get('title'),
            description: formData.get('description'),
            category: formData.get('category') || 'Other',
            priority: formData.get('priority'),
            dueDate: formData.get('dueDate'),
            dueTime: formData.get('dueTime'),
            tags: formData.get('tags')
        };

        // Validate
        if (!taskData.title.trim()) {
            Utils.showNotification('Please enter a task title', 'error');
            return;
        }

        // Create task
        taskManager.createTask(taskData);
        Utils.showNotification('Task created successfully!', 'success');

        // Reset form
        form.reset();

        // Show success message
        const successMsg = document.getElementById('successMessage');
        successMsg.style.display = 'block';
        
        // Redirect after 2 seconds
        setTimeout(() => {
            window.location.href = 'all-tasks.html';
        }, 2000);
    });
}