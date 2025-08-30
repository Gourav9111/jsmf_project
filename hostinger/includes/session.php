<?php
/**
 * Session Management for JSMF Loan Management System
 */

// Start session with secure settings
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_strict_mode', 1);
    ini_set('session.cookie_secure', isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on');
    
    session_start();
}

/**
 * Check if user is authenticated
 */
function isAuthenticated() {
    return isset($_SESSION['user_id']) && !empty($_SESSION['user_id']);
}

/**
 * Check if user has required role
 */
function hasRole($required_role) {
    return isAuthenticated() && isset($_SESSION['user_role']) && $_SESSION['user_role'] === $required_role;
}

/**
 * Require authentication for API endpoints
 */
function requireAuth() {
    if (!isAuthenticated()) {
        http_response_code(401);
        echo json_encode(['message' => 'Unauthorized']);
        exit;
    }
}

/**
 * Require specific role for API endpoints
 */
function requireRole($required_role) {
    if (!hasRole($required_role)) {
        http_response_code(403);
        echo json_encode(['message' => 'Forbidden']);
        exit;
    }
}

/**
 * Get current user ID from session
 */
function getCurrentUserId() {
    return $_SESSION['user_id'] ?? null;
}

/**
 * Get current user role from session
 */
function getCurrentUserRole() {
    return $_SESSION['user_role'] ?? null;
}

/**
 * Set user session after login
 */
function setUserSession($user) {
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_role'] = $user['role'];
    $_SESSION['username'] = $user['username'];
}

/**
 * Clear user session on logout
 */
function clearUserSession() {
    session_unset();
    session_destroy();
}
?>