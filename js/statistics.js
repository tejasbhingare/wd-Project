// ==========================================
// STATISTICS PAGE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    loadStatistics();
});

function loadStatistics() {
    // Get statistics
    const stats = taskManager.getStatistics();
    
    // Update basic stats
    document.getElementById('totalCreated').textContent = stats.total;
    document.getElementById('totalCompleted').textContent = stats.completed;
    document.getElementById('completionPercentage').textContent = stats.completionRate + '%';

    // Update completion circle
    updateProgressCircle(stats.completionRate);

    // Calculate average completion time
    const completedTasks = taskManager.getTasksByStatus('completed');
    const avgTime = calculateAverageCompletionTime(completedTasks);
    document.getElementById('avgCompletionTime').textContent = avgTime;

    // Category stats
    displayCategoryStats();

    // Priority stats
    displayPriorityStats();

    // Weekly activity
    displayWeeklyActivity();
}

function updateProgressCircle(percentage) {
    const circle = document.getElementById('completionProgressCircle');
    if (circle) {
        const circumference = 2 * Math.PI * 45; // radius is 45
        const strokeDashOffset = circumference - (percentage / 100) * circumference;
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = strokeDashOffset;
    }
}

function calculateAverageCompletionTime(completedTasks) {
    if (completedTasks.length === 0) return '-';

    const totalTime = completedTasks.reduce((sum, task) => {
        const created = new Date(task.createdDate);
        const completed = new Date(task.completedDate);
        const daysToComplete = (completed - created) / (1000 * 60 * 60 * 24);
        return sum + daysToComplete;
    }, 0);

    const average = Math.round(totalTime / completedTasks.length);
    return average + ' days';
}

function displayCategoryStats() {
    const container = document.getElementById('categoryStats');
    const counts = taskManager.getCategoriesCounts();
    
    const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Education', 'Other'];
    let html = '';

    categories.forEach(category => {
        const count = counts[category] || 0;
        if (count > 0) {
            html += `
                <div class="stat-item">
                    <span class="category-label">${category}</span>
                    <span class="stat-value">${count}</span>
                </div>
            `;
        }
    });

    if (!html) {
        html = '<p class="empty-state">No tasks in any category yet</p>';
    }

    container.innerHTML = html;
}

function displayPriorityStats() {
    const highPriority = taskManager.getTasksByPriority('high').length;
    const mediumPriority = taskManager.getTasksByPriority('medium').length;
    const lowPriority = taskManager.getTasksByPriority('low').length;

    document.getElementById('highPriorityStat').textContent = highPriority;
    document.getElementById('mediumPriorityStat').textContent = mediumPriority;
    document.getElementById('lowPriorityStat').textContent = lowPriority;
}

function displayWeeklyActivity() {
    const container = document.getElementById('weeklyActivityChart');
    const completedTasks = taskManager.getTasksByStatus('completed');
    
    // Count tasks completed each day of the week
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weekCounts = [0, 0, 0, 0, 0, 0, 0];
    
    const today = new Date();
    
    completedTasks.forEach(task => {
        const completedDate = new Date(task.completedDate);
        const daysAgo = Math.floor((today - completedDate) / (1000 * 60 * 60 * 24));
        
        if (daysAgo < 7) {
            const dayIndex = completedDate.getDay();
            weekCounts[dayIndex]++;
        }
    });

    // Create chart HTML
    let html = '<div style="display: flex; align-items: flex-end; gap: 10px; height: 200px;">';
    
    const maxCount = Math.max(...weekCounts, 1);
    
    weekCounts.forEach((count, index) => {
        const height = (count / maxCount) * 150;
        html += `
            <div style="flex: 1; display: flex; flex-direction: column; align-items: center;">
                <div style="height: ${height}px; width: 100%; background-color: #4f46e5; border-radius: 4px;"></div>
                <div style="margin-top: 10px; font-size: 0.9rem; font-weight: 500;">${days[index]}</div>
                <div style="font-size: 0.8rem; color: #6b7280;">${count}</div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}