// ==========================================
// TASK MANAGER - CORE APPLICATION
// ==========================================

// Task Storage Manager
class TaskManager {
    constructor() {
        this.tasks = this.loadTasks();
        this.deletedTasks = this.loadDeletedTasks();
        this.userSettings = this.loadSettings();
    }

    // Load tasks from localStorage
    loadTasks() {
        const saved = localStorage.getItem('tasks');
        return saved ? JSON.parse(saved) : [];
    }

    // Load deleted tasks from localStorage
    loadDeletedTasks() {
        const saved = localStorage.getItem('deletedTasks');
        return saved ? JSON.parse(saved) : [];
    }

    // Load user settings from localStorage
    loadSettings() {
        const saved = localStorage.getItem('userSettings');
        return saved ? JSON.parse(saved) : {
            theme: 'light',
            itemsPerPage: 10,
            notifications: true
        };
    }

    // Save tasks to localStorage
    saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
    }

    // Save deleted tasks to localStorage
    saveDeletedTasks() {
        localStorage.setItem('deletedTasks', JSON.stringify(this.deletedTasks));
    }

    // Save user settings to localStorage
    saveSettings() {
        localStorage.setItem('userSettings', JSON.stringify(this.userSettings));
    }

    // Create a new task
    createTask(taskData) {
        const task = {
            id: Date.now().toString(),
            title: taskData.title,
            description: taskData.description || '',
            category: taskData.category || 'Other',
            priority: taskData.priority || 'medium',
            dueDate: taskData.dueDate || '',
            dueTime: taskData.dueTime || '',
            tags: taskData.tags ? taskData.tags.split(',').map(tag => tag.trim()) : [],
            status: 'pending',
            createdDate: new Date().toISOString(),
            completedDate: null
        };
        this.tasks.push(task);
        this.saveTasks();
        return task;
    }

    // Get task by ID
    getTaskById(id) {
        return this.tasks.find(task => task.id === id);
    }

    // Update task
    updateTask(id, updates) {
        const task = this.getTaskById(id);
        if (task) {
            Object.assign(task, updates);
            this.saveTasks();
            return task;
        }
        return null;
    }

    // Delete task (soft delete - move to trash)
    deleteTask(id) {
        const index = this.tasks.findIndex(task => task.id === id);
        if (index !== -1) {
            const task = this.tasks[index];
            task.deletedDate = new Date().toISOString();
            this.deletedTasks.push(task);
            this.tasks.splice(index, 1);
            this.saveTasks();
            this.saveDeletedTasks();
            return true;
        }
        return false;
    }

    // Restore task from trash
    restoreTask(id) {
        const index = this.deletedTasks.findIndex(task => task.id === id);
        if (index !== -1) {
            const task = this.deletedTasks[index];
            delete task.deletedDate;
            this.tasks.push(task);
            this.deletedTasks.splice(index, 1);
            this.saveTasks();
            this.saveDeletedTasks();
            return true;
        }
        return false;
    }

    // Permanently delete task
    permanentlyDeleteTask(id) {
        const index = this.deletedTasks.findIndex(task => task.id === id);
        if (index !== -1) {
            this.deletedTasks.splice(index, 1);
            this.saveDeletedTasks();
            return true;
        }
        return false;
    }

    // Mark task as complete
    completeTask(id) {
        const task = this.getTaskById(id);
        if (task) {
            task.status = 'completed';
            task.completedDate = new Date().toISOString();
            this.saveTasks();
            return true;
        }
        return false;
    }

    // Get all tasks
    getAllTasks() {
        return this.tasks;
    }

    // Get tasks by status
    getTasksByStatus(status) {
        return this.tasks.filter(task => task.status === status);
    }

    // Get tasks by category
    getTasksByCategory(category) {
        return this.tasks.filter(task => task.category === category);
    }

    // Get tasks by priority
    getTasksByPriority(priority) {
        return this.tasks.filter(task => task.priority === priority);
    }

    // Search tasks
    searchTasks(query) {
        const lowerQuery = query.toLowerCase();
        return this.tasks.filter(task => 
            task.title.toLowerCase().includes(lowerQuery) ||
            task.description.toLowerCase().includes(lowerQuery) ||
            task.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
    }

    // Get tasks by due date
    getTasksByDueDate(filter) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return this.tasks.filter(task => {
            if (!task.dueDate) return false;
            
            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);

            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const weekEnd = new Date(today);
            weekEnd.setDate(weekEnd.getDate() + 7);

            const monthEnd = new Date(today);
            monthEnd.setMonth(monthEnd.getMonth() + 1);

            switch(filter) {
                case 'today':
                    return dueDate.getTime() === today.getTime();
                case 'tomorrow':
                    return dueDate.getTime() === tomorrow.getTime();
                case 'week':
                    return dueDate >= today && dueDate <= weekEnd;
                case 'month':
                    return dueDate >= today && dueDate <= monthEnd;
                case 'overdue':
                    return dueDate < today;
                default:
                    return false;
            }
        });
    }

    // Get task statistics
    getStatistics() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.status === 'completed').length;
        const pending = this.tasks.filter(t => t.status === 'pending').length;
        const overdue = this.getTasksByDueDate('overdue').length;

        return {
            total,
            completed,
            pending,
            overdue,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
        };
    }

    // Clear all data
    clearAllData() {
        this.tasks = [];
        this.deletedTasks = [];
        this.saveTasks();
        this.saveDeletedTasks();
    }

    // Export tasks as JSON
    exportTasks() {
        return JSON.stringify({
            tasks: this.tasks,
            deletedTasks: this.deletedTasks,
            exportDate: new Date().toISOString()
        }, null, 2);
    }

    // Import tasks from JSON
    importTasks(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            if (data.tasks && Array.isArray(data.tasks)) {
                this.tasks = data.tasks;
                this.deletedTasks = data.deletedTasks || [];
                this.saveTasks();
                this.saveDeletedTasks();
                return true;
            }
            return false;
        } catch (e) {
            console.error('Error importing tasks:', e);
            return false;
        }
    }

    // Get categories count
    getCategoriesCounts() {
        const counts = {};
        this.tasks.forEach(task => {
            counts[task.category] = (counts[task.category] || 0) + 1;
        });
        return counts;
    }
}

// Initialize Task Manager
const taskManager = new TaskManager();

// Utility Functions
const Utils = {
    // Get correct path based on current location (root vs pages/)
    getPagePath(pageName) {
        const isInPages = window.location.pathname.includes('/pages/');
        return isInPages ? pageName : `pages/${pageName}`;
    },

    // Format date
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    // Format date and time
    formatDateTime(dateString, timeString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        const formatted = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        return timeString ? `${formatted} at ${timeString}` : formatted;
    },

    // Check if date is today
    isToday(dateString) {
        if (!dateString) return false;
        const date = new Date(dateString);
        const today = new Date();
        return date.toDateString() === today.toDateString();
    },

    // Check if date is overdue
    isOverdue(dateString) {
        if (!dateString) return false;
        const date = new Date(dateString);
        const today = new Date();
        return date < today;
    },

    // Get priority badge
    getPriorityBadge(priority) {
        const badges = {
            high: '🔴 High',
            medium: '🟡 Medium',
            low: '🟢 Low'
        };
        return badges[priority] || priority;
    },

    // Get URL parameter
    getUrlParam(param) {
        const params = new URLSearchParams(window.location.search);
        return params.get(param);
    },

    // Show notification
    showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const bgColor = {
            'success': '#10b981',
            'error': '#ef4444',
            'warning': '#f59e0b'
        }[type] || '#10b981';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background-color: ${bgColor};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    },

    // Create task item HTML
    createTaskItemHTML(task) {
        const isOverdue = this.isOverdue(task.dueDate) && task.status !== 'completed';
        const priorityEmoji = {
            high: '🔴',
            medium: '🟡',
            low: '🟢'
        }[task.priority] || '•';

        return `
            <div class="task-item ${task.status === 'completed' ? 'completed' : ''}">
                <input type="checkbox" class="task-checkbox" data-task-id="${task.id}" 
                    ${task.status === 'completed' ? 'checked' : ''}>
                <div class="task-content">
                    <div class="task-title">${task.title}</div>
                    ${task.description ? `<div class="task-description">${task.description}</div>` : ''}
                    <div class="task-meta">
                        <span class="task-meta-item">${priorityEmoji} ${task.priority}</span>
                        <span class="task-meta-item">📂 ${task.category}</span>
                        ${task.dueDate ? `
                            <span class="task-meta-item ${isOverdue ? 'overdue' : ''}">
                                📅 ${Utils.formatDate(task.dueDate)}
                            </span>
                        ` : ''}
                    </div>
                </div>
                <div class="task-actions">
                    <a href="${Utils.getPagePath('task-details.html')}?id=${task.id}" class="btn btn-secondary" style="padding: 8px 12px;">View</a>
                    <a href="${Utils.getPagePath('edit-task.html')}?id=${task.id}" class="btn btn-secondary" style="padding: 8px 12px;">Edit</a>
                </div>
            </div>
        `;
    }
};

// Apply theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const theme = taskManager.userSettings.theme;
    if (theme === 'dark') {
        document.body.classList.add('dark-mode');
    } else if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.body.classList.add('dark-mode');
        }
    }
});

// CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .task-meta-item.overdue {
        color: #ef4444;
        font-weight: 600;
    }
`;
document.head.appendChild(style);