<?php
/**
 * User Login API Endpoint
 */

require_once '../../config/database.php';
require_once '../../includes/functions.php';
require_once '../../includes/session.php';

handleCORS();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

try {
    $input = getJsonInput();
    validateRequiredFields($input, ['username', 'password']);
    
    $username = sanitizeInput($input['username']);
    $password = $input['password'];
    
    $db = getDB();
    
    // Get user by username or email
    $stmt = $db->prepare("
        SELECT id, username, email, password, role, full_name, mobile_number, city, is_active 
        FROM users 
        WHERE (username = ? OR email = ?) AND is_active = 1
    ");
    $stmt->execute([$username, $username]);
    $user = $stmt->fetch();
    
    if (!$user || !verifyPassword($password, $user['password'])) {
        sendError('Invalid credentials', 401);
    }
    
    // Set session
    setUserSession($user);
    
    // Return user data (without password)
    unset($user['password']);
    $user['fullName'] = $user['full_name'];
    $user['mobileNumber'] = $user['mobile_number'];
    $user['isActive'] = (bool)$user['is_active'];
    
    sendJsonResponse(['user' => $user]);
    
} catch (Exception $e) {
    logError('Login error: ' . $e->getMessage());
    sendError('Login failed', 500);
}
?>