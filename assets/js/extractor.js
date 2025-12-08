/* ===================================
   MAILMASTER PRO - EXTRACTOR.JS
   Email Extractor Functionality
   =================================== */

// Global variables
let extractedEmails = [];
let validEmails = [];
let invalidEmails = [];
let duplicateEmails = [];
let isUserPremium = false; // This will be set from PHP session later

// DOM Elements
const inputText = document.getElementById('inputText');
const extractBtn = document.getElementById('extractBtn');
const clearBtn = document.getElementById('clearBtn');
const resultsList = document.getElementById('resultsList');
const validCount = document.getElementById('validCount');
const invalidCount = document.getElementById('invalidCount');
const duplicateCount = document.getElementById('duplicateCount');
const actionButtons = document.getElementById('actionButtons');
const premiumNotice = document.getElementById('premiumNotice');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const exportTxtBtn = document.getElementById('exportTxtBtn');
const saveListBtn = document.getElementById('saveListBtn');

// Email validation regex (comprehensive)
const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

// Validate single email
function isValidEmail(email) {
    const validationRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return validationRegex.test(email);
}

// Extract emails from text
function extractEmails() {
    const text = inputText.value.trim();
    
    // Check if input is empty
    if (text === '') {
        showNotification('Please paste some text containing email addresses', 'warning');
        return;
    }
    
    // Disable button during processing
    extractBtn.disabled = true;
    extractBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Extracting...';
    
    // Simulate processing delay for better UX
    setTimeout(() => {
        processExtraction(text);
        extractBtn.disabled = false;
        extractBtn.innerHTML = '<i class="fas fa-search"></i> Extract Emails';
    }, 500);
}

// Main extraction logic
function processExtraction(text) {
    // Reset arrays
    extractedEmails = [];
    validEmails = [];
    invalidEmails = [];
    duplicateEmails = [];
    
    // Extract all potential emails
    const matches = text.match(emailRegex);
    
    if (!matches || matches.length === 0) {
        showNotification('No email addresses found in the text', 'info');
        displayEmptyState();
        return;
    }
    
    // Process each email
    const emailCounts = {};
    
    matches.forEach(email => {
        email = email.toLowerCase().trim();
        
        // Track all extracted emails
        extractedEmails.push(email);
        
        // Count occurrences for duplicate detection
        emailCounts[email] = (emailCounts[email] || 0) + 1;
    });
    
    // Categorize emails
    Object.keys(emailCounts).forEach(email => {
        const count = emailCounts[email];
        
        if (isValidEmail(email)) {
            validEmails.push(email);
            
            // If appears more than once, it's a duplicate
            if (count > 1) {
                duplicateEmails.push(email);
            }
        } else {
            invalidEmails.push(email);
        }
    });
    
    // Update UI
    updateStats();
    displayResults();
    showActionButtons();
    
    // Show premium notice if duplicates or invalid emails found (for free users)
    if (!isUserPremium && (duplicateEmails.length > 0 || invalidEmails.length > 0)) {
        premiumNotice.style.display = 'flex';
    } else {
        premiumNotice.style.display = 'none';
    }
    
    showNotification(`Successfully extracted ${validEmails.length} valid email(s)`, 'success');
}

// Update stats counters
function updateStats() {
    validCount.textContent = validEmails.length;
    invalidCount.textContent = invalidEmails.length;
    duplicateCount.textContent = duplicateEmails.length;
    
    // Animate numbers
    animateCounter(validCount);
    animateCounter(invalidCount);
    animateCounter(duplicateCount);
}

// Animate counter (simple increment effect)
function animateCounter(element) {
    element.style.transform = 'scale(1.2)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 200);
}

// Display results in list
function displayResults() {
    resultsList.innerHTML = '';
    
    if (validEmails.length === 0) {
        displayEmptyState();
        return;
    }
    
    // Display all emails (valid, invalid, duplicates)
    const allEmails = [...validEmails, ...invalidEmails];
    
    allEmails.forEach(email => {
        const emailItem = document.createElement('div');
        emailItem.className = 'email-item';
        
        // Check if invalid
        if (invalidEmails.includes(email)) {
            emailItem.classList.add('invalid');
        }
        
        // Check if duplicate
        if (duplicateEmails.includes(email)) {
            emailItem.classList.add('duplicate');
        }
        
        // Email text
        const emailText = document.createElement('span');
        emailText.textContent = email;
        emailItem.appendChild(emailText);
        
        // Add badge if invalid or duplicate
        if (invalidEmails.includes(email)) {
            const badge = document.createElement('span');
            badge.className = 'email-badge badge-invalid';
            badge.textContent = 'Invalid';
            emailItem.appendChild(badge);
        } else if (duplicateEmails.includes(email)) {
            const badge = document.createElement('span');
            badge.className = 'email-badge badge-duplicate';
            badge.textContent = 'Duplicate';
            emailItem.appendChild(badge);
        }
        
        resultsList.appendChild(emailItem);
    });
}

// Display empty state
function displayEmptyState() {
    resultsList.innerHTML = `
        <div class="empty-state">
            <i class="fas fa-inbox"></i>
            <p>No emails extracted yet</p>
            <small>Paste text and click "Extract Emails" to start</small>
        </div>
    `;
    
    // Hide action buttons
    actionButtons.style.display = 'none';
    
    // Reset stats
    validCount.textContent = '0';
    invalidCount.textContent = '0';
    duplicateCount.textContent = '0';
}

// Show action buttons
function showActionButtons() {
    if (validEmails.length > 0) {
        actionButtons.style.display = 'block';
    }
}

// Clear all
function clearAll() {
    inputText.value = '';
    extractedEmails = [];
    validEmails = [];
    invalidEmails = [];
    duplicateEmails = [];
    displayEmptyState();
    premiumNotice.style.display = 'none';
    showNotification('Cleared all data', 'info');
}

// Export as CSV
function exportAsCSV() {
    if (validEmails.length === 0) {
        showNotification('No valid emails to export', 'warning');
        return;
    }
    
    // For FREE users: export ALL emails (including duplicates and invalid)
    // For PREMIUM users: export only valid, unique emails
    let emailsToExport = [];
    
    if (isUserPremium) {
        // Premium: only valid, no duplicates
        emailsToExport = validEmails.filter(email => !duplicateEmails.includes(email));
    } else {
        // Free: all emails
        emailsToExport = validEmails;
    }
    
    // Create CSV content
    let csvContent = 'Email Address\n';
    emailsToExport.forEach(email => {
        csvContent += email + '\n';
    });
    
    // Create download
    downloadFile(csvContent, 'extracted-emails.csv', 'text/csv');
    showNotification(`Exported ${emailsToExport.length} email(s) to CSV`, 'success');
}

// Export as TXT
function exportAsTXT() {
    if (validEmails.length === 0) {
        showNotification('No valid emails to export', 'warning');
        return;
    }
    
    // For FREE users: export ALL emails (including duplicates)
    // For PREMIUM users: export only valid, unique emails
    let emailsToExport = [];
    
    if (isUserPremium) {
        // Premium: only valid, no duplicates
        emailsToExport = validEmails.filter(email => !duplicateEmails.includes(email));
    } else {
        // Free: all emails
        emailsToExport = validEmails;
    }
    
    // Create TXT content (one email per line)
    const txtContent = emailsToExport.join('\n');
    
    // Create download
    downloadFile(txtContent, 'extracted-emails.txt', 'text/plain');
    showNotification(`Exported ${emailsToExport.length} email(s) to TXT`, 'success');
}

// Download file helper
function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Save list (Premium feature - requires login)
function saveList() {
    // Check if user is logged in
    // This will be checked via PHP session, but for now show modal
    
    if (validEmails.length === 0) {
        showNotification('No valid emails to save', 'warning');
        return;
    }
    
    // Show modal (Bootstrap modal)
    const modal = new bootstrap.Modal(document.getElementById('saveListModal'));
    modal.show();
}

// Show notification (toast-like)
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        max-width: 400px;
        animation: slideIn 0.3s ease;
    `;
    
    // Add icon based on type
    const icon = document.createElement('i');
    icon.className = `fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : type === 'error' ? 'times-circle' : 'info-circle'}`;
    notification.appendChild(icon);
    
    // Add message
    const text = document.createElement('span');
    text.textContent = message;
    notification.appendChild(text);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
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
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .stat-number {
        transition: transform 0.2s ease;
    }
`;
document.head.appendChild(style);

// Event Listeners
extractBtn.addEventListener('click', extractEmails);
clearBtn.addEventListener('click', clearAll);
exportCsvBtn.addEventListener('click', exportAsCSV);
exportTxtBtn.addEventListener('click', exportAsTXT);
saveListBtn.addEventListener('click', saveList);

// Allow extraction on Enter key (Ctrl+Enter)
inputText.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
        extractEmails();
    }
});

// Real-time character count (optional enhancement)
inputText.addEventListener('input', () => {
    const charCount = inputText.value.length;
    // You can add a character counter display here if needed
});

// Check if user is premium (this will be set from PHP session)
// For now, we'll check from a data attribute or localStorage
function checkUserPremium() {
    // This will be replaced with actual PHP session check
    // For demo purposes:
    isUserPremium = false; // Default to free user
    
    // You can check from body data attribute set by PHP:
    // isUserPremium = document.body.dataset.premium === 'true';
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkUserPremium();
    displayEmptyState();
    
    console.log('Email Extractor initialized');
    console.log('User Premium Status:', isUserPremium ? 'Premium' : 'Free');
});