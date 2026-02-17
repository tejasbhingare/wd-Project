// ==========================================
// CATEGORIES PAGE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    updateCategoryCounts();
    
    // Refresh counts every 1 second to catch updates
    setInterval(updateCategoryCounts, 1000);
});

function updateCategoryCounts() {
    const counts = taskManager.getCategoriesCounts();
    
    // Update each category count
    document.querySelectorAll('.category-count').forEach(element => {
        const category = element.dataset.category;
        const currentCount = parseInt(element.textContent) || 0;
        const newCount = counts[category] || 0;
        
        // Update if changed
        if (currentCount !== newCount) {
            element.textContent = newCount;
            // Add a brief animation effect
            element.style.animation = 'none';
            setTimeout(() => {
                element.style.animation = 'pulse 0.5s ease-in-out';
            }, 10);
        }
    });

    // Add click handlers to category cards
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking the button
            if (e.target.tagName === 'A') return;
        });
    });
}