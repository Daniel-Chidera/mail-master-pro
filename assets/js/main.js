// Open modal when clicking login button in navbar
document.addEventListener('DOMContentLoaded', function() {
    const loginButtons = document.querySelectorAll('.btn-login');
    loginButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof openAuthModal === 'function') {
                openAuthModal('login');
            }
        });
    });
});