<?php
// Demo PHP server for JSMF Loan Management System
// This file demonstrates the system working without database connection

// Start session
session_start();

// Route handling
$request_uri = $_SERVER['REQUEST_URI'];
$path = parse_url($request_uri, PHP_URL_PATH);

// Remove any leading /demo.php from path
$path = str_replace('/demo.php', '', $path);

// Basic routing
if ($path === '' || $path === '/') {
    // Serve index.html
    readfile('index.html');
    exit;
}

if (strpos($path, '/admin/') === 0) {
    // Handle admin routes
    $admin_file = ltrim($path, '/');
    if (file_exists($admin_file)) {
        readfile($admin_file);
        exit;
    }
}

if (strpos($path, '/api/') === 0) {
    // Handle API routes
    $api_file = ltrim($path, '/') . '.php';
    if (file_exists($api_file)) {
        include $api_file;
        exit;
    }
}

if (strpos($path, '/assets/') === 0) {
    // Handle asset files
    $asset_file = ltrim($path, '/');
    if (file_exists($asset_file)) {
        $ext = pathinfo($asset_file, PATHINFO_EXTENSION);
        
        switch ($ext) {
            case 'css':
                header('Content-Type: text/css');
                break;
            case 'js':
                header('Content-Type: application/javascript');
                break;
            case 'png':
                header('Content-Type: image/png');
                break;
            case 'jpg':
            case 'jpeg':
                header('Content-Type: image/jpeg');
                break;
            case 'gif':
                header('Content-Type: image/gif');
                break;
            default:
                header('Content-Type: text/plain');
        }
        
        readfile($asset_file);
        exit;
    }
}

// Default: serve index.html
readfile('index.html');
?>