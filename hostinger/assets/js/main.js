// Main JavaScript for JSMF Loan Management System - Hostinger Compatible

// Configuration
const API_BASE_URL = './api';

// Services data
const services = [
    {
        title: "Personal Loan",
        badge: "7.5% ROI",
        badgeClass: "service-badge",
        badgeStyle: "background-color: #dc2626; color: white;",
        description: "Quick personal loans for salaried individuals with minimal documentation and same-day approval.",
        features: ["Minimum salary ₹15,000", "Cash salary from ₹8,000", "Loan up to ₹10 Lakhs"],
        imageUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&h=250",
        loanType: "personal"
    },
    {
        title: "Business Loan",
        badge: "Daily Funding",
        badgeClass: "service-badge",
        badgeStyle: "background-color: #16a34a; color: white;",
        description: "Expand your business with flexible loan options and daily funding facility for growing enterprises.",
        features: ["Daily funding available", "Flexible repayment terms", "Loan up to ₹50 Lakhs"],
        imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=400&h=250",
        loanType: "business"
    },
    {
        title: "Home Loan",
        badge: "Best Rates",
        badgeClass: "service-badge",
        badgeStyle: "background-color: #2563eb; color: white;",
        description: "Make your dream home a reality with our competitive home loan rates and easy approval process.",
        features: ["Competitive interest rates", "Up to 30 years tenure", "Loan up to ₹5 Crores"],
        imageUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=400&h=250",
        loanType: "home"
    },
    {
        title: "Loan Against Property",
        badge: "High Value",
        badgeClass: "service-badge",
        badgeStyle: "background-color: #7c3aed; color: white;",
        description: "Unlock the value of your property with secured loans at attractive interest rates.",
        features: ["Lower interest rates", "Higher loan amounts", "Flexible usage"],
        imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&h=250",
        loanType: "lap"
    },
    {
        title: "Working Capital",
        badge: "Quick Fund",
        badgeClass: "service-badge",
        badgeStyle: "background-color: #ea580c; color: white;",
        description: "Maintain smooth cash flow for your business operations with flexible working capital solutions.",
        features: ["Quick disbursement", "Minimal documentation", "Revolving credit facility"],
        imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&h=250",
        loanType: "working-capital"
    },
    {
        title: "DSA Partnership",
        badge: "Earn More",
        badgeClass: "service-badge",
        badgeStyle: "background-color: #eab308; color: black;",
        description: "Join our DSA program and earn attractive commissions by referring loan customers.",
        features: ["Attractive commission structure", "Marketing support provided", "Training & certification"],
        imageUrl: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=400&h=250",
        isSpecial: true
    }
];

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    loadServices();
    setupForms();
    calculateEMI(); // Initial calculation
    setupSmoothScrolling();
    setupEMICalculator();
}

// Navigation functionality
function setupNavigation() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileIcon = mobileToggle.querySelector('i');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            
            if (mobileMenu.classList.contains('hidden')) {
                mobileIcon.className = 'fas fa-bars';
            } else {
                mobileIcon.className = 'fas fa-times';
            }
        });

        // Close mobile menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileIcon.className = 'fas fa-bars';
            });
        });
    }
}

// Load services dynamically
function loadServices() {
    const servicesGrid = document.getElementById('services-grid');
    if (!servicesGrid) return;
    
    services.forEach((service, index) => {
        const serviceCard = createServiceCard(service, index);
        servicesGrid.appendChild(serviceCard);
    });
}

function createServiceCard(service, index) {
    const card = document.createElement('div');
    card.className = 'service-card' + (service.isSpecial ? ' special-card' : '');
    
    const featuresHTML = service.features.map(feature => 
        `<div class="service-feature">
            <i class="${service.isSpecial ? 'fas fa-star' : 'fas fa-check'}"></i>
            <span>${feature}</span>
        </div>`
    ).join('');

    card.innerHTML = `
        <div class="service-image" style="background-image: url('${service.imageUrl}')"></div>
        
        <div class="service-content">
            <div class="service-header">
                <h3 class="service-title">${service.title}</h3>
                <span class="${service.badgeClass}" style="${service.badgeStyle}">${service.badge}</span>
            </div>
            
            <p class="service-description">${service.description}</p>
            
            <div class="service-features">
                ${featuresHTML}
            </div>
            
            <button onclick="handleServiceClick('${service.loanType || 'dsa'}')" 
                    class="btn ${service.isSpecial ? 'btn-accent' : 'btn-primary'}" 
                    style="width: 100%;">
                ${service.title === "DSA Partnership" ? "Become DSA Partner" : `Apply for ${service.title}`}
            </button>
        </div>
    `;
    
    return card;
}

function handleServiceClick(serviceType) {
    if (serviceType === 'dsa') {
        scrollToSection('dsa');
    } else {
        // For actual loan applications, you might want to redirect to a login page
        // For now, we'll just scroll to the contact section
        scrollToSection('contact');
        showNotification('Please fill the contact form below to apply for ' + serviceType + ' loan.', 'info');
    }
}

// Smooth scrolling functionality
function setupSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const navHeight = 80; // Height of fixed navbar
        const elementPosition = element.offsetTop - navHeight;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
    }
}

// EMI Calculator
function calculateEMI() {
    const loanAmount = parseFloat(document.getElementById('loan-amount').value) || 0;
    const interestRate = parseFloat(document.getElementById('interest-rate').value) || 0;
    const tenure = parseFloat(document.getElementById('loan-tenure').value) || 0;
    
    if (loanAmount <= 0 || interestRate <= 0 || tenure <= 0) {
        updateEMIDisplay(0, 0, 0);
        return;
    }
    
    const monthlyRate = interestRate / 12 / 100;
    const numberOfPayments = tenure * 12;
    
    const emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments) / 
                (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const totalAmount = emi * numberOfPayments;
    const totalInterest = totalAmount - loanAmount;
    
    updateEMIDisplay(emi, totalInterest, totalAmount);
}

function updateEMIDisplay(emi, totalInterest, totalAmount) {
    const monthlyEmiEl = document.getElementById('monthly-emi');
    const totalInterestEl = document.getElementById('total-interest');
    const totalAmountEl = document.getElementById('total-amount');
    
    if (monthlyEmiEl) monthlyEmiEl.textContent = '₹' + Math.round(emi).toLocaleString('en-IN');
    if (totalInterestEl) totalInterestEl.textContent = '₹' + Math.round(totalInterest).toLocaleString('en-IN');
    if (totalAmountEl) totalAmountEl.textContent = '₹' + Math.round(totalAmount).toLocaleString('en-IN');
}

// Setup all forms
function setupForms() {
    setupQuickApplyForm();
    setupContactForm();
    setupDSAForm();
}

function setupQuickApplyForm() {
    const form = document.getElementById('quick-apply-form');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('quick-name').value,
            mobileNumber: document.getElementById('quick-mobile').value,
            loanType: document.getElementById('quick-loan-type').value,
            amount: "100000",
            city: "Bhopal",
            source: "quick-apply"
        };
        
        if (!formData.name || !formData.mobileNumber || !formData.loanType) {
            showNotification('Please fill all required fields.', 'error');
            return;
        }
        
        try {
            showLoading();
            const response = await makeAPIRequest('POST', '/leads', formData);
            
            if (response.ok) {
                showNotification('Application submitted successfully! We\'ll contact you soon.', 'success');
                form.reset();
            } else {
                throw new Error('Failed to submit application');
            }
        } catch (error) {
            console.error('Quick apply error:', error);
            showNotification('Failed to submit application. Please try again or call us directly.', 'error');
        } finally {
            hideLoading();
        }
    });
}

function setupContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('contact-name').value,
            mobileNumber: document.getElementById('contact-mobile').value,
            email: document.getElementById('contact-email').value,
            loanType: document.getElementById('contact-loan-type').value,
            message: document.getElementById('contact-message').value
        };
        
        const consentEl = document.getElementById('contact-consent');
        const consent = consentEl ? consentEl.checked : false;
        
        if (!consent) {
            showNotification('Please authorize us to contact you.', 'error');
            return;
        }
        
        if (!formData.name || !formData.mobileNumber || !formData.message) {
            showNotification('Please fill all required fields.', 'error');
            return;
        }
        
        try {
            showLoading();
            const response = await makeAPIRequest('POST', '/contact-queries', formData);
            
            if (response.ok) {
                showNotification('Message sent successfully! We\'ll get back to you within 24 hours.', 'success');
                form.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            showNotification('Failed to send message. Please try again or contact us directly.', 'error');
        } finally {
            hideLoading();
        }
    });
}

function setupDSAForm() {
    const form = document.getElementById('dsa-application-form');
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const userData = {
            username: document.getElementById('dsa-email').value, // Using email as username
            email: document.getElementById('dsa-email').value,
            password: 'temp123', // Temporary password - should be changed on first login
            fullName: document.getElementById('dsa-name').value,
            mobileNumber: document.getElementById('dsa-mobile').value,
            city: document.getElementById('dsa-city').value || 'Bhopal'
        };
        
        const partnerData = {
            experience: document.getElementById('dsa-experience').value,
            background: document.getElementById('dsa-background').value
        };
        
        if (!userData.fullName || !userData.email || !userData.mobileNumber) {
            showNotification('Please fill all required fields.', 'error');
            return;
        }
        
        try {
            showLoading();
            const response = await makeAPIRequest('POST', '/dsa-partners', {
                userData,
                partnerData
            });
            
            if (response.ok) {
                showNotification('DSA application submitted successfully! We\'ll review and contact you soon. Default password is "temp123".', 'success');
                form.reset();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit DSA application');
            }
        } catch (error) {
            console.error('DSA application error:', error);
            showNotification(error.message || 'Failed to submit DSA application. Please try again.', 'error');
        } finally {
            hideLoading();
        }
    });
}

function setupEMICalculator() {
    const inputs = ['loan-amount', 'interest-rate', 'loan-tenure'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', calculateEMI);
        }
    });
}

// API Functions
async function makeAPIRequest(method, endpoint, data = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }
    
    return fetch(url, options);
}

// Notification functions
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const messageEl = document.getElementById('notification-message');
    
    if (notification && messageEl) {
        messageEl.textContent = message;
        notification.className = `notification ${type}`;
        notification.classList.remove('hidden');
        notification.classList.add('show');
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            closeNotification();
        }, 5000);
    }
}

function closeNotification() {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.classList.add('hidden');
        }, 300);
    }
}

function showLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.remove('hidden');
    }
}

function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.classList.add('hidden');
    }
}

// Utility functions
function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateMobile(mobile) {
    const mobileRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
    return mobileRegex.test(mobile);
}

// Scroll effects
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 100) {
            navbar.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }
    }
});

// Handle form validation
function validateForm(formData, requiredFields) {
    const errors = [];
    
    requiredFields.forEach(field => {
        if (!formData[field] || formData[field].toString().trim() === '') {
            errors.push(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        }
    });
    
    if (formData.email && !validateEmail(formData.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (formData.mobileNumber && !validateMobile(formData.mobileNumber)) {
        errors.push('Please enter a valid mobile number');
    }
    
    return errors;
}

// Handle offline/online status
window.addEventListener('online', function() {
    showNotification('Connection restored!', 'success');
});

window.addEventListener('offline', function() {
    showNotification('You are currently offline. Some features may not work.', 'error');
});

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if supported
if ('IntersectionObserver' in window) {
    lazyLoadImages();
}

// Error handling for global errors
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    showNotification('An unexpected error occurred. Please refresh the page and try again.', 'error');
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    showNotification('An unexpected error occurred. Please try again.', 'error');
});