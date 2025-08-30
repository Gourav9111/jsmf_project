// Authentication functions for JSMF Loan Management System

const API_BASE_URL = '../backend/api';

// Login function
async function login(userType, redirectPath) {
    const usernameField = userType === 'user' ? 'login-username' : 'username';
    const passwordField = userType === 'user' ? 'login-password' : 'password';
    
    const username = document.getElementById(usernameField).value;
    const password = document.getElementById(passwordField).value;
    
    if (!username || !password) {
        showError('Please enter both username and password.');
        return;
    }
    
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Check if user role matches expected type
            if (data.user.role !== userType) {
                showError(`Invalid credentials for ${userType} login.`);
                return;
            }
            
            // Store user data in localStorage
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('isLoggedIn', 'true');
            
            showSuccess('Login successful! Redirecting...');
            
            // Redirect after a short delay
            setTimeout(() => {
                window.location.href = redirectPath;
            }, 1500);
        } else {
            showError(data.message || 'Login failed. Please check your credentials.');
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('Login failed. Please try again.');
    } finally {
        hideLoading();
    }
}

// Register function
async function register() {
    const formData = {
        username: document.getElementById('register-username').value,
        email: document.getElementById('register-email').value,
        password: document.getElementById('register-password').value,
        fullName: document.getElementById('register-fullname').value,
        mobileNumber: document.getElementById('register-mobile').value,
        city: document.getElementById('register-city').value || 'Bhopal'
    };
    
    // Validation
    if (!formData.username || !formData.email || !formData.password || !formData.fullName || !formData.mobileNumber) {
        showError('Please fill all required fields.');
        return;
    }
    
    if (!validateEmail(formData.email)) {
        showError('Please enter a valid email address.');
        return;
    }
    
    if (!validateMobile(formData.mobileNumber)) {
        showError('Please enter a valid mobile number.');
        return;
    }
    
    if (formData.password.length < 6) {
        showError('Password must be at least 6 characters long.');
        return;
    }
    
    try {
        showLoading();
        
        const response = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showSuccess('Registration successful! You can now login with your credentials.');
            
            // Clear form and switch to login tab
            document.getElementById('user-register-form').reset();
            showTab('login');
        } else {
            showError(data.message || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showError('Registration failed. Please try again.');
    } finally {
        hideLoading();
    }
}

// Logout function
async function logout() {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        // Clear local storage regardless of response
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        
        // Redirect to login page
        const userRole = getCurrentUser()?.role || 'user';
        window.location.href = `../${userRole}/login.html`;
    } catch (error) {
        console.error('Logout error:', error);
        
        // Still clear local storage and redirect
        localStorage.removeItem('user');
        localStorage.removeItem('isLoggedIn');
        window.location.href = '../index.html';
    }
}

// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true' && localStorage.getItem('user');
}

// Get current user data
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Check authentication on protected pages
function requireAuth(expectedRole = null) {
    if (!isLoggedIn()) {
        window.location.href = '../user/login.html';
        return false;
    }
    
    const user = getCurrentUser();
    if (expectedRole && user.role !== expectedRole) {
        showError('Access denied. Insufficient permissions.');
        setTimeout(() => {
            window.location.href = `../${user.role}/dashboard.html`;
        }, 2000);
        return false;
    }
    
    return true;
}

// Toggle password visibility
function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const eye = document.getElementById(fieldId + '-eye');
    
    if (field.type === 'password') {
        field.type = 'text';
        eye.className = 'fas fa-eye-slash';
    } else {
        field.type = 'password';
        eye.className = 'fas fa-eye';
    }
}

// Utility functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateMobile(mobile) {
    const mobileRegex = /^[+]?[0-9\s\-\(\)]{10,15}$/;
    return mobileRegex.test(mobile);
}

// Modal functions
function showLoading() {
    const modal = document.getElementById('loading-modal');
    if (modal) {
        modal.classList.remove('hidden');
    } else {
        // Create loading modal if it doesn't exist
        createLoadingModal();
    }
}

function hideLoading() {
    const modal = document.getElementById('loading-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function showSuccess(message) {
    const modal = document.getElementById('success-modal');
    if (modal) {
        document.getElementById('success-message').textContent = message;
        modal.classList.remove('hidden');
    } else {
        // Create success modal if it doesn't exist
        createSuccessModal(message);
    }
}

function showError(message) {
    const modal = document.getElementById('error-modal');
    if (modal) {
        document.getElementById('error-message').textContent = message;
        modal.classList.remove('hidden');
    } else {
        // Create error modal if it doesn't exist
        createErrorModal(message);
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// Create modals dynamically
function createLoadingModal() {
    const modal = document.createElement('div');
    modal.id = 'loading-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div class="text-center">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p class="mt-4 text-gray-600">Processing your request...</p>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function createSuccessModal(message) {
    const modal = document.createElement('div');
    modal.id = 'success-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div class="text-center">
                <i class="fas fa-check-circle text-green-500 text-4xl mb-4"></i>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Success!</h3>
                <p class="text-gray-600 mb-4" id="success-message">${message}</p>
                <button onclick="closeModal('success-modal')" class="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition-colors">
                    OK
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function createErrorModal(message) {
    const modal = document.createElement('div');
    modal.id = 'error-modal';
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div class="text-center">
                <i class="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Error</h3>
                <p class="text-gray-600 mb-4" id="error-message">${message}</p>
                <button onclick="closeModal('error-modal')" class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded transition-colors">
                    OK
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Initialize authentication check on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a protected page
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('/dashboard.html')) {
        // Determine expected role based on path
        let expectedRole = null;
        if (currentPath.includes('/admin/')) expectedRole = 'admin';
        else if (currentPath.includes('/dsa/')) expectedRole = 'dsa';
        else if (currentPath.includes('/user/')) expectedRole = 'user';
        
        requireAuth(expectedRole);
    }
});