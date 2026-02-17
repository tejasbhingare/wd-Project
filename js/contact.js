// ==========================================
// CONTACT PAGE
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    setupContactForm();
});

function setupContactForm() {
    const form = document.getElementById('contactForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const contactData = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message'),
                date: new Date().toISOString()
            };

            // Validate
            if (!contactData.name.trim() || !contactData.email.trim() || !contactData.message.trim()) {
                Utils.showNotification('Please fill in all required fields', 'error');
                return;
            }

            // Save contact message to localStorage (for demo purposes)
            const contactMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
            contactMessages.push(contactData);
            localStorage.setItem('contactMessages', JSON.stringify(contactMessages));

            // Show success message
            const successMsg = document.getElementById('successMessage');
            successMsg.style.display = 'block';
            Utils.showNotification('Message sent successfully!', 'success');

            // Reset form
            form.reset();

            // Scroll to success message
            successMsg.scrollIntoView({ behavior: 'smooth' });
        });
    }
}