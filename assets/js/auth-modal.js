/* ===================================
   MAILMASTER PRO - AUTH-MODAL.JS
   Login & Register Modal Functionality
   =================================== */

// DOM Elements
const authModal = document.getElementById('authModal');
const authModalOverlay = document.getElementById('authModalOverlay');
const closeAuthModalBtn = document.getElementById('closeAuthModal');
const loginFormContainer = document.getElementById('loginFormContainer');
const registerFormContainer = document.getElementById('registerFormContainer');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const switchToRegister = document.getElementById('switchToRegister');
const switchToLogin = document.getElementById('switchToLogin');

// Alert elements
const authAlertSuccess = document.getElementById('authAlertSuccess');
const authAlertError = document.getElementById('authAlertError');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

// Password toggle elements
const toggleLoginPassword = document.getElementById('toggleLoginPassword');
const toggleRegisterPassword = document.getElementById('toggleRegisterPassword');
const toggleRegisterPasswordConfirm = document.getElementById('toggleRegisterPasswordConfirm');

// Password strength elements
const registerPassword = document.getElementById('registerPassword');
const strengthText = document.getElementById('strengthText');

/* ==========================================
   MODAL OPEN/CLOSE FUNCTIONS
   ========================================== */

// Open modal
function openAuthModal(tab = 'login') {
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    // Switch to specified tab
    if (tab === 'register') {
        switchTab('register');
    } else {
        switchTab('login');
    }
    
    // Clear any previous alerts
    hideAlerts();
}

// Close modal
function closeAuthModal() {
    authModal.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
    
    // Reset forms
    loginForm.reset();
    registerForm.reset();
    
    // Clear errors
    clearFormErrors();
    hideAlerts();
}

// Close on overlay click
authModalOverlay.addEventListener('click', closeAuthModal);

// Close on X button
closeAuthModalBtn.addEventListener('click', closeAuthModal);

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && authModal.classList.contains('active')) {
        closeAuthModal();
    }
});

/* ==========================================
   TAB SWITCHING (NO TABS - JUST VIEW SWITCHING)
   ========================================== */

function switchTab(tab) {
    if (tab === 'login') {
        // Show login, hide register
        loginFormContainer.style.display = 'block';
        registerFormContainer.style.display = 'none';
    } else {
        // Show register, hide login
        registerFormContainer.style.display = 'block';
        loginFormContainer.style.display = 'none';
    }
    
    // Clear errors and alerts
    clearFormErrors();
    hideAlerts();
}

// Switch links
switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    switchTab('register');
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    switchTab('login');
});

/* ==========================================
   PASSWORD TOGGLE (SHOW/HIDE)
   ========================================== */

function togglePasswordVisibility(inputId, buttonId) {
    const input = document.getElementById(inputId);
    const button = document.getElementById(buttonId);
    const icon = button.querySelector('i');
    
    button.addEventListener('click', () => {
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
}

// Initialize password toggles
togglePasswordVisibility('loginPassword', 'toggleLoginPassword');
togglePasswordVisibility('registerPassword', 'toggleRegisterPassword');
togglePasswordVisibility('registerPasswordConfirm', 'toggleRegisterPasswordConfirm');

/* ==========================================
   PASSWORD STRENGTH CHECKER (4-BAR DESIGN)
   ========================================== */

registerPassword.addEventListener('input', () => {
    const password = registerPassword.value;
    const strength = calculatePasswordStrength(password);
    const strengthContainer = document.getElementById('passwordStrength');
    const strengthBars = document.querySelector('.strength-bars');
    const strengthLabel = document.getElementById('strengthText');
    
    if (password.length === 0) {
        strengthContainer.style.display = 'none';
        return;
    }
    
    strengthContainer.style.display = 'block';
    
    // Remove all classes
    strengthBars.className = 'strength-bars';
    strengthLabel.className = 'strength-label';
    
    // Apply strength class based on score
    if (strength.score <= 2) {
        strengthBars.classList.add('weak');
        strengthLabel.classList.add('weak');
        strengthLabel.textContent = 'Weak password';
    } else if (strength.score <= 4) {
        strengthBars.classList.add('medium');
        strengthLabel.classList.add('medium');
        strengthLabel.textContent = 'Medium strength';
    } else {
        strengthBars.classList.add('strong');
        strengthLabel.classList.add('strong');
        strengthLabel.textContent = 'Strong password';
    }
});

function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++; // lowercase
    if (/[A-Z]/.test(password)) score++; // uppercase
    if (/[0-9]/.test(password)) score++; // numbers
    if (/[^a-zA-Z0-9]/.test(password)) score++; // special chars
    
    return { score };
}

/* ==========================================
   FORM VALIDATION
   ========================================== */

// Email validation
function isValidEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
}

// Show error message
function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + 'Error');
    
    input.classList.add('error');
    error.textContent = message;
    error.classList.add('show');
}

// Clear error message
function clearError(fieldId) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById(fieldId + 'Error');
    
    input.classList.remove('error');
    error.textContent = '';
    error.classList.remove('show');
}

// Clear all form errors
function clearFormErrors() {
    const errorElements = document.querySelectorAll('.form-error');
    errorElements.forEach(error => {
        error.textContent = '';
        error.classList.remove('show');
    });
    
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.classList.remove('error');
    });
}

// Validate login form
function validateLoginForm() {
    let isValid = true;
    clearFormErrors();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    // Email validation
    if (email === '') {
        showError('loginEmail', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('loginEmail', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Password validation
    if (password === '') {
        showError('loginPassword', 'Password is required');
        isValid = false;
    }
    
    return isValid;
}

// Validate register form
function validateRegisterForm() {
    let isValid = true;
    clearFormErrors();
    
    const fullName = document.getElementById('registerFullName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // Full name validation
    if (fullName === '') {
        showError('registerFullName', 'Full name is required');
        isValid = false;
    } else if (fullName.length < 2) {
        showError('registerFullName', 'Name must be at least 2 characters');
        isValid = false;
    }
    
    // Email validation
    if (email === '') {
        showError('registerEmail', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('registerEmail', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Password validation
    if (password === '') {
        showError('registerPassword', 'Password is required');
        isValid = false;
    } else if (password.length < 8) {
        showError('registerPassword', 'Password must be at least 8 characters');
        isValid = false;
    }
    
    // Confirm password validation
    if (passwordConfirm === '') {
        showError('registerPasswordConfirm', 'Please confirm your password');
        isValid = false;
    } else if (password !== passwordConfirm) {
        showError('registerPasswordConfirm', 'Passwords do not match');
        isValid = false;
    }
    
    // Terms checkbox validation
    if (!agreeTerms) {
        showError('agreeTerms', 'You must agree to the Terms of Service');
        isValid = false;
    }
    
    return isValid;
}

/* ==========================================
   ALERT MESSAGES
   ========================================== */

function showSuccessAlert(message) {
    hideAlerts();
    successMessage.textContent = message;
    authAlertSuccess.style.display = 'flex';
}

function showErrorAlert(message) {
    hideAlerts();
    errorMessage.textContent = message;
    authAlertError.style.display = 'flex';
}

function hideAlerts() {
    authAlertSuccess.style.display = 'none';
    authAlertError.style.display = 'none';
}

/* ==========================================
   FORM SUBMISSION (AJAX to PHP)
   ========================================== */

// Login form submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateLoginForm()) {
        return;
    }
    
    // Get form data
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const remember = document.getElementById('rememberMe').checked;
    
    // Show loading state
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;
    
    try {
        // Send to PHP backend
        const response = await fetch('api/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                remember: remember
            })
        });
        
        const data = await response.json();
        
        // Remove loading state
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
        
        if (data.success) {
            // Show success message
            showSuccessAlert(data.message || 'Login successful! Redirecting...');
            
            // Redirect after 1.5 seconds
            setTimeout(() => {
                window.location.href = data.redirect || 'dashboard.php';
            }, 1500);
        } else {
            // Show error message
            showErrorAlert(data.message || 'Login failed. Please try again.');
        }
    } catch (error) {
        console.error('Login error:', error);
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
        showErrorAlert('An error occurred. Please try again later.');
    }
});

// Register form submission
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateRegisterForm()) {
        return;
    }
    
    // Get form data
    const fullName = document.getElementById('registerFullName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    
    // Show loading state
    const registerBtn = document.getElementById('registerBtn');
    registerBtn.classList.add('loading');
    registerBtn.disabled = true;
    
    try {
        // Send to PHP backend
        const response = await fetch('api/register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                full_name: fullName,
                email: email,
                password: password
            })
        });
        
        const data = await response.json();
        
        // Remove loading state
        registerBtn.classList.remove('loading');
        registerBtn.disabled = false;
        
        if (data.success) {
            // Show success message
            showSuccessAlert(data.message || 'Account created successfully! Redirecting...');
            
            // Redirect after 1.5 seconds
            setTimeout(() => {
                window.location.href = data.redirect || 'dashboard.php';
            }, 1500);
        } else {
            // Show error message
            showErrorAlert(data.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Registration error:', error);
        registerBtn.classList.remove('loading');
        registerBtn.disabled = false;
        showErrorAlert('An error occurred. Please try again later.');
    }
});

/* ==========================================
   REAL-TIME VALIDATION (Optional)
   ========================================== */

// Clear error on input
document.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('input', () => {
        if (input.classList.contains('error')) {
            clearError(input.id);
        }
    });
});

/* ==========================================
   INITIALIZE
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    console.log('Auth Modal initialized');
    
    // Make openAuthModal available globally
    window.openAuthModal = openAuthModal;
});