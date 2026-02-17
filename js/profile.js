// ==========================================
// PROFILE PAGE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    loadProfile();
    setupForms();
});

function loadProfile() {
    // Load user profile data
    const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
    
    if (document.getElementById('userName')) {
        document.getElementById('userName').value = userProfile.name || '';
        document.getElementById('userEmail').value = userProfile.email || '';
        document.getElementById('userBio').value = userProfile.bio || '';
    }

    // Load preferences
    const settings = taskManager.userSettings;
    if (document.getElementById('themeSelect')) {
        document.getElementById('themeSelect').value = settings.theme || 'light';
        document.getElementById('itemsPerPage').value = settings.itemsPerPage || 10;
        document.getElementById('notificationsEnabled').checked = settings.notifications !== false;
        document.getElementById('emailReminders').checked = settings.emailReminders || false;
    }
}

function setupForms() {
    // Profile form
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const userProfile = {
                name: document.getElementById('userName').value,
                email: document.getElementById('userEmail').value,
                bio: document.getElementById('userBio').value
            };
            
            localStorage.setItem('userProfile', JSON.stringify(userProfile));
            Utils.showNotification('Profile updated successfully', 'success');
        });
    }

    // Preferences form
    const preferencesForm = document.getElementById('preferencesForm');
    if (preferencesForm) {
        preferencesForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            taskManager.userSettings = {
                theme: document.getElementById('themeSelect').value,
                itemsPerPage: parseInt(document.getElementById('itemsPerPage').value),
                notifications: document.getElementById('notificationsEnabled').checked,
                emailReminders: document.getElementById('emailReminders').checked
            };
            
            taskManager.saveSettings();
            
            // Apply theme
            const theme = taskManager.userSettings.theme;
            if (theme === 'dark') {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
            
            Utils.showNotification('Preferences saved', 'success');
        });
    }

    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const dataStr = taskManager.exportTasks();
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `tasks-backup-${new Date().getTime()}.json`;
            link.click();
            Utils.showNotification('Tasks exported successfully', 'success');
        });
    }

    // Import button
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');
    if (importBtn && importFile) {
        importBtn.addEventListener('click', () => {
            importFile.click();
        });

        importFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const success = taskManager.importTasks(event.target.result);
                    if (success) {
                        Utils.showNotification('Tasks imported successfully', 'success');
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    } else {
                        Utils.showNotification('Error importing tasks', 'error');
                    }
                };
                reader.readAsText(file);
            }
        });
    }

    // Clear all data button
    const clearAllBtn = document.getElementById('clearAllBtn');
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            if (confirm('⚠️ WARNING: This will permanently delete ALL your tasks. This action cannot be undone. Are you absolutely sure?')) {
                if (confirm('Really? Click OK one more time to confirm.')) {
                    taskManager.clearAllData();
                    Utils.showNotification('All data cleared', 'success');
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 1500);
                }
            }
        });
    }
}