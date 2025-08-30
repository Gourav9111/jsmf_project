/**
 * Frontend API Integration Example for PHP Backend
 * Update your existing frontend code to use these patterns
 */

// Configuration - Update this to your Hostinger domain
const API_BASE_URL = 'https://yourdomain.com/api'; // Replace with your actual domain

// API Helper class
class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            credentials: 'include', // Important: Include cookies for sessions
            ...options
        };

        if (options.body && typeof options.body !== 'string') {
            config.body = JSON.stringify(options.body);
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Request failed');
            }
            
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Authentication methods
    async login(username, password) {
        return this.request('/auth/login', {
            method: 'POST',
            body: { username, password }
        });
    }

    async logout() {
        return this.request('/auth/logout', { method: 'POST' });
    }

    async getCurrentUser() {
        return this.request('/auth/user');
    }

    // User registration
    async register(userData) {
        return this.request('/users/register', {
            method: 'POST',
            body: userData
        });
    }

    // Loan applications
    async createLoanApplication(applicationData) {
        return this.request('/loan-applications', {
            method: 'POST',
            body: applicationData
        });
    }

    async getLoanApplications() {
        return this.request('/loan-applications');
    }

    async updateLoanApplication(id, updates) {
        return this.request(`/loan-applications/${id}`, {
            method: 'PATCH',
            body: updates
        });
    }

    // DSA Partners
    async registerDSA(userData, partnerData) {
        return this.request('/dsa-partners', {
            method: 'POST',
            body: { userData, partnerData }
        });
    }

    async getDSAPartners() {
        return this.request('/dsa-partners');
    }

    async getDSAProfile() {
        return this.request('/dsa-partners/profile');
    }

    // Leads
    async createLead(leadData) {
        return this.request('/leads', {
            method: 'POST',
            body: leadData
        });
    }

    async getLeads() {
        return this.request('/leads');
    }

    async assignLead(leadId, dsaId) {
        return this.request(`/leads/${leadId}/assign`, {
            method: 'PATCH',
            body: { dsaId }
        });
    }

    async updateLead(leadId, updates) {
        return this.request(`/leads/${leadId}`, {
            method: 'PATCH',
            body: updates
        });
    }

    // Contact queries
    async submitContactQuery(queryData) {
        return this.request('/contact-queries', {
            method: 'POST',
            body: queryData
        });
    }

    async getContactQueries() {
        return this.request('/contact-queries');
    }
}

// Create API client instance
const apiClient = new ApiClient(API_BASE_URL);

// Example usage in your React components:

// Login component example
async function handleLogin(username, password) {
    try {
        const response = await apiClient.login(username, password);
        console.log('Login successful:', response.user);
        // Update your app state with user data
        // Navigate to dashboard, etc.
    } catch (error) {
        console.error('Login failed:', error.message);
        // Show error message to user
    }
}

// Loan application form example
async function handleLoanApplication(formData) {
    try {
        const application = await apiClient.createLoanApplication({
            loanType: formData.loanType,
            amount: formData.amount,
            tenure: formData.tenure,
            monthlyIncome: formData.monthlyIncome,
            employmentType: formData.employmentType,
            purpose: formData.purpose
        });
        console.log('Application created:', application);
        // Show success message, redirect, etc.
    } catch (error) {
        console.error('Application failed:', error.message);
        // Show error message
    }
}

// Contact form example
async function handleContactForm(formData) {
    try {
        const query = await apiClient.submitContactQuery({
            name: formData.name,
            mobileNumber: formData.mobile,
            email: formData.email,
            loanType: formData.loanType,
            message: formData.message
        });
        console.log('Query submitted:', query);
        // Show success message
    } catch (error) {
        console.error('Query failed:', error.message);
        // Show error message
    }
}

// Export for use in your application
export { apiClient, ApiClient };

/**
 * Migration Checklist for Frontend:
 * 
 * 1. Update API base URL to your Hostinger domain
 * 2. Ensure all API calls include credentials: 'include'
 * 3. Update any hardcoded localhost URLs
 * 4. Test all authentication flows
 * 5. Verify CORS is working properly
 * 6. Update any WebSocket connections (if used)
 * 7. Test file uploads (if implemented)
 * 8. Verify error handling works with PHP responses
 * 9. Update any environment variables
 * 10. Test all user roles and permissions
 */