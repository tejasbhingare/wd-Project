// ==========================================
// SETTINGS PAGE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
    setupEventListeners();
});

function loadSettings() {
    const settings = taskManager.userSettings;
    
    // Load theme
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.value = settings.theme || 'light';
    }

    // Load font size
    const fontSizeSelect = document.getElementById('fontSizeSelect');
    if (fontSizeSelect) {
        fontSizeSelect.value = localStorage.getItem('fontSize') || 'medium';
    }

    // Load notification settings
    document.getElementById('pushNotifications').checked = settings.notifications !== false;
    document.getElementById('soundAlerts').checked = settings.soundAlerts || false;
    document.getElementById('emailReminders').checked = settings.emailReminders || false;
    document.getElementById('notificationTiming').value = settings.notificationTiming || '15';

    // Load display settings
    document.getElementById('tasksPerPage').value = settings.itemsPerPage || 10;
    document.getElementById('sortBy').value = settings.sortBy || 'dueDate';
    document.getElementById('showCompleted').checked = settings.showCompleted !== false;

    // Load privacy settings
    document.getElementById('autoLockTimeout').value = settings.autoLockTimeout || 0;
}

function setupEventListeners() {
    // Theme selector
    document.getElementById('themeSelect').addEventListener('change', (e) => {
        const theme = e.target.value;
        taskManager.userSettings.theme = theme;
        
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else if (theme === 'light') {
            document.body.classList.remove('dark-mode');
        } else {
            // Auto
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
    });

    // Font size selector
    document.getElementById('fontSizeSelect').addEventListener('change', (e) => {
        const sizes = {
            small: '14px',
            medium: '16px',
            large: '18px'
        };
        document.documentElement.fontSize = sizes[e.target.value];
        localStorage.setItem('fontSize', e.target.value);
    });

    // Notification checkboxes
    document.getElementById('pushNotifications').addEventListener('change', (e) => {
        taskManager.userSettings.notifications = e.target.checked;
    });

    document.getElementById('soundAlerts').addEventListener('change', (e) => {
        taskManager.userSettings.soundAlerts = e.target.checked;
    });

    document.getElementById('emailReminders').addEventListener('change', (e) => {
        taskManager.userSettings.emailReminders = e.target.checked;
    });

    // Display settings
    document.getElementById('tasksPerPage').addEventListener('change', (e) => {
        taskManager.userSettings.itemsPerPage = parseInt(e.target.value);
    });

    document.getElementById('sortBy').addEventListener('change', (e) => {
        taskManager.userSettings.sortBy = e.target.value;
    });

    document.getElementById('showCompleted').addEventListener('change', (e) => {
        taskManager.userSettings.showCompleted = e.target.checked;
    });

    // Save settings button
    document.getElementById('saveSettingsBtn').addEventListener('click', () => {
        taskManager.userSettings.notificationTiming = document.getElementById('notificationTiming').value;
        taskManager.userSettings.autoLockTimeout = document.getElementById('autoLockTimeout').value;
        
        taskManager.saveSettings();
        
        const successMsg = document.getElementById('settingsSavedMessage');
        successMsg.style.display = 'block';
        
        setTimeout(() => {
            successMsg.style.display = 'none';
        }, 3000);
    });

    // Reset settings button
    document.getElementById('resetSettingsBtn').addEventListener('click', () => {
        if (confirm('Are you sure you want to reset all settings to defaults?')) {
            taskManager.userSettings = {
                theme: 'light',
                itemsPerPage: 10,
                notifications: true
            };
            taskManager.saveSettings();
            Utils.showNotification('Settings reset to defaults', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        }
    });
}