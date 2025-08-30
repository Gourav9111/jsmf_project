// Main JavaScript for JSMF Loan Management System

// Configuration
const API_BASE_URL = 'backend/api';

// Services data
const services = [
    {
        title: "Personal Loan",
        badge: "7.5% ROI",
        badgeColor: "bg-red-600 text-white",
        description: "Quick personal loans for salaried individuals with minimal documentation and same-day approval.",
        features: ["Minimum salary ₹15,000", "Cash salary from ₹8,000", "Loan up to ₹10 Lakhs"],
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&h=250",
        alt: "Personal loan consultation"
    },
    {
        title: "Business Loan",
        badge: "Daily Funding",
        badgeColor: "bg-green-500 text-white",
        description: "Expand your business with flexible loan options and daily funding facility for growing enterprises.",
        features: ["Daily funding available", "Flexible repayment terms", "Loan up to ₹50 Lakhs"],
        image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=400&h=250",
        alt: "Business loan handshake deal"
    },
    {
        title: "Home Loan",
        badge: "Best Rates",
        badgeColor: "bg-blue-500 text-white",
        description: "Make your dream home a reality with our competitive home loan rates and easy approval process.",
        features: ["Competitive interest rates", "Up to 30 years tenure", "Loan up to ₹5 Crores"],
        image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=400&h=250",
        alt: "Home loan family with documents"
    },
    {
        title: "Loan Against Property",
        badge: "High Value",
        badgeColor: "bg-purple-500 text-white",
        description: "Unlock the value of your property with secured loans at attractive interest rates.",
        features: ["Lower interest rates", "Higher loan amounts", "Flexible usage"],
        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&h=250",
        alt: "Professional office workspace"
    },
    {
        title: "Working Capital",
        badge: "Quick Fund",
        badgeColor: "bg-orange-500 text-white",
        description: "Maintain smooth cash flow for your business operations with flexible working capital solutions.",
        features: ["Quick disbursement", "Minimal documentation", "Revolving credit facility"],
        image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&h=250",
        alt: "Financial calculator smartphone"
    },
    {
        title: "DSA Partnership",
        badge: "Earn More",
        badgeColor: "bg-yellow-500 text-black",
        description: "Join our DSA program and earn attractive commissions by referring loan customers.",
        features: ["Attractive commission structure", "Marketing support provided", "Training & certification"],
        image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=400&h=250",
        alt: "DSA partner business meeting",
        isSpecial: true
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    loadServices();
    setupForms();
    calculateEMI(); // Initial calculation
    setupSmoothScrolling();
}

// Navigation functionality
function setupNavigation() {
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileIcon = mobileToggle.querySelector('i');

    mobileToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
        
        if (mobileMenu.classList.contains('hidden')) {
            mobileIcon.className = 'fas fa-bars text-xl';
        } else {
            mobileIcon.className = 'fas fa-times text-xl';
        }
    });

    // Close mobile menu when clicking on links
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            mobileIcon.className = 'fas fa-bars text-xl';
        });
    });
}

// Load services dynamically
function loadServices() {
    const servicesGrid = document.getElementById('services-grid');
    
    services.forEach((service, index) => {
        const serviceCard = createServiceCard(service, index);
        servicesGrid.appendChild(serviceCard);
    });
}

function createServiceCard(service, index) {
    const card = document.createElement('div');
    card.className = `service-card bg-white shadow-lg rounded-lg overflow-hidden ${service.isSpecial ? 'border-2 border-yellow-400' : ''}`;
    
    card.innerHTML = `
        <div class="relative overflow-hidden">
            <img src="${service.image}" alt="${service.alt}" class="w-full h-48 object-cover transition-transform duration-300 hover:scale-110">
        </div>
        
        <div class="p-6">
            <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold text-blue-600">${service.title}</h3>
                <span class="px-3 py-1 rounded-full text-sm font-semibold ${service.badgeColor}">${service.badge}</span>
            </div>
            
            <p class="text-gray-600 mb-4">${service.description}</p>
            
            <ul class="space-y-2 mb-6">
                ${service.features.map(feature => `
                    <li class="flex items-center space-x-2">
                        <i class="${service.isSpecial ? 'fas fa-star text-yellow-500' : 'fas fa-check text-green-500'}"></i>
                        <span class="text-sm">${feature}</span>
                    </li>
                `).join('')}
            </ul>
            
            <button onclick="handleServiceClick('${service.title}')" 
                    class="w-full py-3 font-semibold rounded transition-colors ${
                        service.isSpecial 
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }">
                ${service.title === "DSA Partnership" ? "Become DSA Partner" : `Apply ${service.title}`}
            </button>
        </div>
    `;
    
    return card;
}

function handleServiceClick(serviceType) {
    if (serviceType !== "DSA Partnership") {
        window.location.href = "user/login.html";
    } else {
        scrollToSection('dsa');
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
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
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
    document.getElementById('monthly-emi').textContent = '₹' + Math.round(emi).toLocaleString('en-IN');
    document.getElementById('total-interest').textContent = '₹' + Math.round(totalInterest).toLocaleString('en-IN');
    document.getElementById('total-amount').textContent = '₹' + Math.round(totalAmount).toLocaleString('en-IN');
}

// Setup all forms
function setupForms() {
    setupQuickApplyForm();
    setupContactForm();
    setupDSAForm();
    setupEMICalculator();
}

function setupQuickApplyForm() {
    const form = document.getElementById('quick-apply-form');
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
            showError('Please fill all required fields.');
            return;
        }
        
        try {
            showLoading();
            const response = await makeAPIRequest('POST', '/leads', formData);
            
            if (response.ok) {
                showSuccess('Application submitted successfully! We\'ll contact you soon.');
                form.reset();
            } else {
                throw new Error('Failed to submit application');
            }
        } catch (error) {
            console.error('Quick apply error:', error);
            showError('Failed to submit application. Please try again or call us directly.');
        } finally {
            hideLoading();
        }
    });
}

function setupContactForm() {
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('contact-name').value,
            mobileNumber: document.getElementById('contact-mobile').value,
            email: document.getElementById('contact-email').value,
            loanType: document.getElementById('contact-loan-type').value,
            message: document.getElementById('contact-message').value
        };
        
        const consent = document.getElementById('contact-consent').checked;
        
        if (!consent) {
            showError('Please authorize us to contact you.');
            return;
        }
        
        if (!formData.name || !formData.mobileNumber || !formData.message) {
            showError('Please fill all required fields.');
            return;
        }
        
        try {
            showLoading();
            const response = await makeAPIRequest('POST', '/contact-queries', formData);
            
            if (response.ok) {
                showSuccess('Message sent successfully! We\'ll get back to you within 24 hours.');
                form.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            showError('Failed to send message. Please try again or contact us directly.');
        } finally {
            hideLoading();
        }
    });
}

function setupDSAForm() {
    const form = document.getElementById('dsa-application-form');
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
            showError('Please fill all required fields.');
            return;
        }
        
        try {
            showLoading();
            const response = await makeAPIRequest('POST', '/dsa-partners', {
                userData,
                partnerData
            });
            
            if (response.ok) {
                showSuccess('DSA application submitted successfully! We\'ll review and contact you soon. Default password is "temp123".');
                form.reset();
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit DSA application');
            }
        } catch (error) {
            console.error('DSA application error:', error);
            showError(error.message || 'Failed to submit DSA application. Please try again.');
        } finally {
            hideLoading();
        }
    });
}

function setupEMICalculator() {
    const inputs = ['loan-amount', 'interest-rate', 'loan-tenure'];
    
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        input.addEventListener('input', calculateEMI);
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

// Modal and notification functions
function showLoading() {
    document.getElementById('loading-modal').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading-modal').classList.add('hidden');
}

function showSuccess(message) {
    document.getElementById('success-message').textContent = message;
    document.getElementById('success-modal').classList.remove('hidden');
}

function showError(message) {
    document.getElementById('error-message').textContent = message;
    document.getElementById('error-modal').classList.remove('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
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
    const mobileRegex = /^[+]?[0-9\s\-\(\)]{10,15}$/;
    return mobileRegex.test(mobile);
}

// Initialize scroll effects and animations
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('header');
    if (window.scrollY > 100) {
        navbar.classList.add('shadow-lg');
    } else {
        navbar.classList.remove('shadow-lg');
    }
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

// Handle offline/online status
window.addEventListener('online', function() {
    showSuccess('Connection restored!');
});

window.addEventListener('offline', function() {
    showError('You are currently offline. Some features may not work.');
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