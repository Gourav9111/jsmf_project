// Dashboard functionality for JSMF Loan Management System

const API_BASE_URL = '../backend/api';

// Initialize admin dashboard
async function initializeAdminDashboard() {
    const user = getCurrentUser();
    if (user) {
        document.getElementById('admin-name').textContent = `Welcome, ${user.fullName}`;
    }
    
    // Load statistics
    await loadDashboardStats();
}

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        // This would normally make API calls to get statistics
        // For now, showing placeholder data
        document.getElementById('total-applications').textContent = '0';
        document.getElementById('total-dsa').textContent = '0';
        document.getElementById('total-leads').textContent = '0';
        document.getElementById('total-queries').textContent = '0';
        
        // You can implement actual API calls here:
        // const stats = await makeAPIRequest('GET', '/admin/dashboard-stats');
        
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

// Load loan applications
async function loadApplications() {
    try {
        showDataContainer('Loan Applications');
        
        const response = await makeAPIRequest('GET', '/loan-applications');
        
        if (response.ok) {
            const applications = await response.json();
            displayApplicationsTable(applications);
        } else {
            throw new Error('Failed to load applications');
        }
    } catch (error) {
        console.error('Error loading applications:', error);
        showDataError('Failed to load applications. Please try again.');
    }
}

// Load DSA partners
async function loadDSAPartners() {
    try {
        showDataContainer('DSA Partners');
        
        const response = await makeAPIRequest('GET', '/dsa-partners');
        
        if (response.ok) {
            const partners = await response.json();
            displayDSAPartnersTable(partners);
        } else {
            throw new Error('Failed to load DSA partners');
        }
    } catch (error) {
        console.error('Error loading DSA partners:', error);
        showDataError('Failed to load DSA partners. Please try again.');
    }
}

// Load leads
async function loadLeads() {
    try {
        showDataContainer('Lead Management');
        
        const response = await makeAPIRequest('GET', '/leads');
        
        if (response.ok) {
            const leads = await response.json();
            displayLeadsTable(leads);
        } else {
            throw new Error('Failed to load leads');
        }
    } catch (error) {
        console.error('Error loading leads:', error);
        showDataError('Failed to load leads. Please try again.');
    }
}

// Display applications table
function displayApplicationsTable(applications) {
    const content = document.getElementById('data-content');
    
    if (applications.length === 0) {
        content.innerHTML = '<p class="text-gray-500 text-center py-8">No loan applications found.</p>';
        return;
    }
    
    let html = `
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Type</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
    `;
    
    applications.forEach(app => {
        const statusClass = getStatusClass(app.status);
        const date = new Date(app.created_at).toLocaleDateString();
        
        html += `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${app.user_id}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${app.loan_type}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹${formatNumber(app.amount || 0)}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                        ${app.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${date}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="updateApplicationStatus('${app.id}', 'approved')" 
                            class="text-green-600 hover:text-green-900 mr-2">Approve</button>
                    <button onclick="updateApplicationStatus('${app.id}', 'rejected')" 
                            class="text-red-600 hover:text-red-900">Reject</button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    content.innerHTML = html;
}

// Display DSA partners table
function displayDSAPartnersTable(partners) {
    const content = document.getElementById('data-content');
    
    if (partners.length === 0) {
        content.innerHTML = '<p class="text-gray-500 text-center py-8">No DSA partners found.</p>';
        return;
    }
    
    let html = `
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KYC Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Leads</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
    `;
    
    partners.forEach(partner => {
        const kycClass = partner.kyc_status === 'verified' ? 'bg-green-100 text-green-800' : 
                        partner.kyc_status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800';
        
        html += `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${partner.full_name || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${partner.email || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${partner.mobile_number || 'N/A'}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${kycClass}">
                        ${partner.kyc_status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${partner.total_leads || 0}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="updateKYCStatus('${partner.id}', 'verified')" 
                            class="text-green-600 hover:text-green-900 mr-2">Verify</button>
                    <button onclick="updateKYCStatus('${partner.id}', 'rejected')" 
                            class="text-red-600 hover:text-red-900">Reject</button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    content.innerHTML = html;
}

// Display leads table
function displayLeadsTable(leads) {
    const content = document.getElementById('data-content');
    
    if (leads.length === 0) {
        content.innerHTML = '<p class="text-gray-500 text-center py-8">No leads found.</p>';
        return;
    }
    
    let html = `
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Type</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned DSA</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
    `;
    
    leads.forEach(lead => {
        const statusClass = getStatusClass(lead.status);
        
        html += `
            <tr>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${lead.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${lead.mobile_number}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${lead.loan_type}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}">
                        ${lead.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${lead.assigned_dsa_id ? 'Assigned' : 'Unassigned'}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onclick="showAssignLeadModal('${lead.id}')" 
                            class="text-blue-600 hover:text-blue-900">Assign DSA</button>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    content.innerHTML = html;
}

// Update application status
async function updateApplicationStatus(applicationId, status) {
    try {
        const response = await makeAPIRequest('PATCH', `/loan-applications/${applicationId}`, { status });
        
        if (response.ok) {
            showSuccess(`Application ${status} successfully!`);
            loadApplications(); // Refresh the list
        } else {
            throw new Error(`Failed to ${status} application`);
        }
    } catch (error) {
        console.error('Error updating application status:', error);
        showError(`Failed to ${status} application. Please try again.`);
    }
}

// Update KYC status
async function updateKYCStatus(partnerId, status) {
    try {
        // This would be a call to update DSA partner KYC status
        // For now, just show success message
        showSuccess(`KYC status updated to ${status}!`);
        loadDSAPartners(); // Refresh the list
    } catch (error) {
        console.error('Error updating KYC status:', error);
        showError('Failed to update KYC status. Please try again.');
    }
}

// Show assign lead modal (simplified version)
function showAssignLeadModal(leadId) {
    const dsaId = prompt('Enter DSA ID to assign this lead:');
    if (dsaId) {
        assignLeadToDSA(leadId, dsaId);
    }
}

// Assign lead to DSA
async function assignLeadToDSA(leadId, dsaId) {
    try {
        const response = await makeAPIRequest('PATCH', `/leads/${leadId}/assign`, { dsaId });
        
        if (response.ok) {
            showSuccess('Lead assigned successfully!');
            loadLeads(); // Refresh the list
        } else {
            throw new Error('Failed to assign lead');
        }
    } catch (error) {
        console.error('Error assigning lead:', error);
        showError('Failed to assign lead. Please try again.');
    }
}

// Utility functions
function showDataContainer(title) {
    document.getElementById('data-title').textContent = title;
    document.getElementById('data-container').classList.remove('hidden');
}

function hideDataContainer() {
    document.getElementById('data-container').classList.add('hidden');
}

function showDataError(message) {
    document.getElementById('data-content').innerHTML = 
        `<p class="text-red-500 text-center py-8">${message}</p>`;
}

function getStatusClass(status) {
    switch (status) {
        case 'approved':
        case 'verified':
        case 'converted':
            return 'bg-green-100 text-green-800';
        case 'rejected':
        case 'closed':
            return 'bg-red-100 text-red-800';
        case 'pending':
        case 'new':
        case 'contacted':
            return 'bg-yellow-100 text-yellow-800';
        case 'under-review':
        case 'qualified':
            return 'bg-blue-100 text-blue-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-IN').format(num);
}

// API request function
async function makeAPIRequest(method, endpoint, data = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
    }
    
    return fetch(`${API_BASE_URL}${endpoint}`, options);
}

// Modal functions (reuse from auth.js)
function showSuccess(message) {
    // Simple alert for now - you can enhance this with modals
    alert('Success: ' + message);
}

function showError(message) {
    // Simple alert for now - you can enhance this with modals
    alert('Error: ' + message);
}