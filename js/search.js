// ==========================================
// SEARCH PAGE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    performSearch();
    setupSearchForm();
});

function setupSearchForm() {
    const form = document.getElementById('searchForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            performSearch();
        });
    }
}

function performSearch() {
    const query = Utils.getUrlParam('q') || document.getElementById('searchQuery')?.value || '';
    
    if (!query.trim()) {
        document.getElementById('searchTermDisplay').textContent = 'None';
        document.getElementById('resultCount').textContent = 'Enter a search term';
        document.getElementById('searchResultsList').innerHTML = '<p class="empty-state">Enter a search term to find tasks</p>';
        return;
    }

    const results = taskManager.searchTasks(query);
    
    document.getElementById('searchTermDisplay').textContent = query;
    document.getElementById('searchQuery').value = query;
    document.getElementById('resultCount').textContent = `Found ${results.length} result${results.length !== 1 ? 's' : ''}`;

    displaySearchResults(results);
}

function displaySearchResults(tasks) {
    const container = document.getElementById('searchResultsList');
    
    if (tasks.length === 0) {
        container.innerHTML = '<p class="empty-state">No tasks match your search. Try different keywords.</p>';
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
            performSearch();
        });
    });
}