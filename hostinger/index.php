<?php
/**
 * Main Entry Point for JSMF Loan Management System
 * This file serves as the front controller for the PHP backend
 */

require_once 'includes/functions.php';
require_once 'includes/session.php';

handleCORS();

// Get the request URI and method
$request_uri = $_SERVER['REQUEST_URI'];
$request_method = $_SERVER['REQUEST_METHOD'];

// Parse the URL to get the path
$path = parse_url($request_uri, PHP_URL_PATH);

// Remove the base path if present
$base_path = '/public_html';
if (strpos($path, $base_path) === 0) {
    $path = substr($path, strlen($base_path));
}

// Route the request to appropriate API endpoint
if (strpos($path, '/api/') === 0) {
    // API routes
    $api_path = substr($path, 4); // Remove '/api' prefix
    
    switch (true) {
        // Auth routes
        case $api_path === '/auth/login':
            require 'api/auth/login.php';
            break;
        case $api_path === '/auth/logout':
            require 'api/auth/logout.php';
            break;
        case $api_path === '/auth/user':
            require 'api/auth/user.php';
            break;
            
        // User routes
        case $api_path === '/users/register':
            require 'api/users/register.php';
            break;
            
        // Loan application routes
        case $api_path === '/loan-applications':
            require 'api/loan-applications/index.php';
            break;
        case preg_match('/^\/loan-applications\/([a-f0-9\-]+)$/', $api_path):
            require 'api/loan-applications/update.php';
            break;
            
        // DSA partner routes
        case $api_path === '/dsa-partners':
            require 'api/dsa-partners/index.php';
            break;
        case $api_path === '/dsa-partners/profile':
            require 'api/dsa-partners/profile.php';
            break;
            
        // Lead routes
        case $api_path === '/leads':
            require 'api/leads/index.php';
            break;
        case preg_match('/^\/leads\/([a-f0-9\-]+)\/assign$/', $api_path):
            require 'api/leads/assign.php';
            break;
        case preg_match('/^\/leads\/([a-f0-9\-]+)$/', $api_path):
            require 'api/leads/update.php';
            break;
            
        // Contact query routes
        case $api_path === '/contact-queries':
            require 'api/contact-queries/index.php';
            break;
            
        default:
            http_response_code(404);
            echo json_encode(['message' => 'API endpoint not found']);
    }
} else {
    // Serve static files or redirect to frontend
    if ($path === '/' || $path === '/index.php') {
        // Serve the main application
        ?>
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>JSMF Loan Management System</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .container {
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                h1 {
                    color: #2c3e50;
                    text-align: center;
                    margin-bottom: 30px;
                }
                .api-info {
                    background: #ecf0f1;
                    padding: 20px;
                    border-radius: 5px;
                    margin: 20px 0;
                }
                .endpoint {
                    background: #3498db;
                    color: white;
                    padding: 10px;
                    margin: 5px 0;
                    border-radius: 3px;
                    font-family: monospace;
                }
                .note {
                    background: #f39c12;
                    color: white;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 20px 0;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>JSMF Loan Management System - PHP Backend</h1>
                
                <div class="note">
                    <strong>Important:</strong> Update the database configuration in <code>config/database.php</code> with your Hostinger database credentials.
                </div>
                
                <div class="api-info">
                    <h3>Available API Endpoints:</h3>
                    
                    <h4>Authentication:</h4>
                    <div class="endpoint">POST /api/auth/login</div>
                    <div class="endpoint">POST /api/auth/logout</div>
                    <div class="endpoint">GET /api/auth/user</div>
                    
                    <h4>User Management:</h4>
                    <div class="endpoint">POST /api/users/register</div>
                    
                    <h4>Loan Applications:</h4>
                    <div class="endpoint">POST /api/loan-applications</div>
                    <div class="endpoint">GET /api/loan-applications</div>
                    <div class="endpoint">PATCH /api/loan-applications/{id}</div>
                    
                    <h4>DSA Partners:</h4>
                    <div class="endpoint">POST /api/dsa-partners</div>
                    <div class="endpoint">GET /api/dsa-partners</div>
                    <div class="endpoint">GET /api/dsa-partners/profile</div>
                    
                    <h4>Lead Management:</h4>
                    <div class="endpoint">POST /api/leads</div>
                    <div class="endpoint">GET /api/leads</div>
                    <div class="endpoint">PATCH /api/leads/{id}/assign</div>
                    <div class="endpoint">PATCH /api/leads/{id}</div>
                    
                    <h4>Contact Queries:</h4>
                    <div class="endpoint">POST /api/contact-queries</div>
                    <div class="endpoint">GET /api/contact-queries</div>
                </div>
                
                <p><strong>Status:</strong> PHP Backend is ready for deployment on Hostinger shared hosting.</p>
            </div>
        </body>
        </html>
        <?php
    } else {
        http_response_code(404);
        echo '<h1>404 Not Found</h1>';
    }
}
?>