-- MySQL Database Schema for JSMF Loan Management System
-- Run this script in your Hostinger database to set up the tables

-- Create database (if not created via Hostinger panel)
-- CREATE DATABASE IF NOT EXISTS jsmf_loans CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE jsmf_loans;

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'dsa', 'user') NOT NULL DEFAULT 'user',
    full_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    city VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Loan applications table
CREATE TABLE loan_applications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    loan_type ENUM('personal', 'business', 'home', 'lap', 'working-capital') NOT NULL,
    amount DECIMAL(12,2),
    tenure INT COMMENT 'in months',
    interest_rate DECIMAL(5,2) DEFAULT 7.50,
    status ENUM('pending', 'approved', 'rejected', 'under-review') DEFAULT 'pending',
    assigned_dsa_id VARCHAR(36),
    monthly_income DECIMAL(10,2),
    employment_type ENUM('salaried', 'self-employed', 'business'),
    purpose TEXT,
    documents JSON COMMENT 'JSON string of uploaded documents',
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_dsa_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_assigned_dsa_id (assigned_dsa_id),
    INDEX idx_status (status),
    INDEX idx_loan_type (loan_type)
);

-- DSA partners table
CREATE TABLE dsa_partners (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    experience TEXT,
    background TEXT,
    commission_rate DECIMAL(5,2) DEFAULT 2.00,
    total_earnings DECIMAL(12,2) DEFAULT 0,
    total_leads INT DEFAULT 0,
    successful_leads INT DEFAULT 0,
    kyc_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uk_user_id (user_id),
    INDEX idx_kyc_status (kyc_status)
);

-- Leads table
CREATE TABLE leads (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    loan_type ENUM('personal', 'business', 'home', 'lap', 'working-capital') NOT NULL,
    amount DECIMAL(12,2),
    city VARCHAR(100),
    source ENUM('website', 'referral', 'advertisement', 'application') DEFAULT 'website',
    status ENUM('new', 'contacted', 'qualified', 'converted', 'closed') DEFAULT 'new',
    assigned_dsa_id VARCHAR(36),
    assigned_at TIMESTAMP NULL,
    converted_at TIMESTAMP NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (assigned_dsa_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_assigned_dsa_id (assigned_dsa_id),
    INDEX idx_status (status),
    INDEX idx_source (source),
    INDEX idx_loan_type (loan_type),
    INDEX idx_mobile (mobile_number)
);

-- Contact queries table
CREATE TABLE contact_queries (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    loan_type ENUM('personal', 'business', 'home', 'lap', 'working-capital'),
    message TEXT NOT NULL,
    status ENUM('new', 'responded', 'closed') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_mobile (mobile_number)
);

-- Insert default admin user  
-- Username: harsh@jsmf.in, Password: Harsh@9131
INSERT INTO users (id, username, email, password, role, full_name, mobile_number, city, is_active, created_at, updated_at) 
VALUES (
    UUID(),
    'harsh@jsmf.in',
    'harsh@jsmf.in',
    '$2y$10$ZcdzNT4nelKHU/yPbnKP1.2ELtxgHGQm3jKfHEAXlJOco3zYls31G',
    'admin',
    'Harsh Kumar',
    '+91 91626 207918',
    'Bhopal',
    TRUE,
    NOW(),
    NOW()
);

-- Sample data for testing (optional)
INSERT INTO users (id, username, email, password, role, full_name, mobile_number, city, is_active, created_at, updated_at)
VALUES 
(UUID(), 'testuser', 'user@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user', 'Test User', '+91 9876543210', 'Mumbai', TRUE, NOW(), NOW()),
(UUID(), 'testdsa', 'dsa@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'dsa', 'Test DSA', '+91 9876543211', 'Delhi', TRUE, NOW(), NOW());