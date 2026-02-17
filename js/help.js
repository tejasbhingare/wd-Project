// ==========================================
// HELP PAGE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    setupFaqSearch();
});

function setupFaqSearch() {
    const searchInput = document.getElementById('faqSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const faqItems = document.querySelectorAll('.faq-item');
            
            faqItems.forEach(item => {
                const text = item.textContent.toLowerCase();
                if (text.includes(query)) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });

            // If no items shown, show a message
            const visibleItems = Array.from(faqItems).filter(item => item.style.display !== 'none');
            if (visibleItems.length === 0 && query) {
                const sections = document.querySelectorAll('.faq-section');
                sections.forEach(section => {
                    const hasVisible = Array.from(section.querySelectorAll('.faq-item'))
                        .some(item => item.style.display !== 'none');
                    section.style.display = hasVisible ? 'block' : 'none';
                });
            } else {
                document.querySelectorAll('.faq-section').forEach(s => s.style.display = 'block');
            }
        });
    }

    // Make details elements collapsible
    const details = document.querySelectorAll('details');
    details.forEach(detail => {
        detail.addEventListener('toggle', () => {
            // Close other details in the same section
            if (detail.open) {
                const section = detail.closest('.faq-section');
                section.querySelectorAll('details').forEach(d => {
                    if (d !== detail) {
                        d.open = false;
                    }
                });
            }
        });
    });
}