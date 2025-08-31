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
    
    // If no database connection, use demo login for testing
    if ($db === null) {
        // Demo/fallback authentication for when database is not available
        if ($username === 'harsh' && $password === 'Harsh@9131') {
            // Create demo user session
            $demoUser = [
                'id' => 'admin-001',
                'username' => 'harsh',
                'email' => 'harsh@jsmf.in',
                'role' => 'admin',
                'full_name' => 'Harsh Kumar',
                'mobile_number' => '+91 91626 207918',
                'city' => 'Bhopal',
                'is_active' => 1
            ];
            
            setUserSession($demoUser);
            
            // Return user data (without password)
            $responseUser = [
                'id' => $demoUser['id'],
                'username' => $demoUser['username'],
                'email' => $demoUser['email'],
                'role' => $demoUser['role'],
                'fullName' => $demoUser['full_name'],
                'mobileNumber' => $demoUser['mobile_number'],
                'city' => $demoUser['city'],
                'isActive' => true
            ];
            
            sendJsonResponse(['user' => $responseUser]);
        } else {
            sendError('Invalid credentials', 401);
        }
        return;
    }
    
    // Database authentication
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