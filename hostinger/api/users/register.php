<?php
/**
 * User Registration API Endpoint
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
    validateRequiredFields($input, ['username', 'email', 'password', 'fullName', 'mobileNumber']);
    
    $userData = [
        'username' => sanitizeInput($input['username']),
        'email' => sanitizeInput($input['email']),
        'password' => $input['password'],
        'role' => sanitizeInput($input['role'] ?? 'user'),
        'fullName' => sanitizeInput($input['fullName']),
        'mobileNumber' => sanitizeInput($input['mobileNumber']),
        'city' => sanitizeInput($input['city'] ?? null)
    ];
    
    // Validate email format
    if (!isValidEmail($userData['email'])) {
        sendError('Invalid email format', 400);
    }
    
    // Validate mobile number
    if (!isValidMobile($userData['mobileNumber'])) {
        sendError('Invalid mobile number format', 400);
    }
    
    $db = getDB();
    $db->beginTransaction();
    
    try {
        // Check if username exists
        $stmt = $db->prepare("SELECT id FROM users WHERE username = ?");
        $stmt->execute([$userData['username']]);
        if ($stmt->fetch()) {
            sendError('Username already exists', 400);
        }
        
        // Check if email exists
        $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$userData['email']]);
        if ($stmt->fetch()) {
            sendError('Email already registered', 400);
        }
        
        // Create user
        $userId = generateUUID();
        $hashedPassword = hashPassword($userData['password']);
        $currentTime = getCurrentTimestamp();
        
        $stmt = $db->prepare("
            INSERT INTO users (id, username, email, password, role, full_name, mobile_number, city, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
        ");
        
        $stmt->execute([
            $userId,
            $userData['username'],
            $userData['email'],
            $hashedPassword,
            $userData['role'],
            $userData['fullName'],
            $userData['mobileNumber'],
            $userData['city'],
            $currentTime,
            $currentTime
        ]);
        
        $db->commit();
        
        // Return user data (without password)
        $user = [
            'id' => $userId,
            'username' => $userData['username'],
            'email' => $userData['email'],
            'role' => $userData['role'],
            'fullName' => $userData['fullName'],
            'mobileNumber' => $userData['mobileNumber'],
            'city' => $userData['city']
        ];
        
        sendJsonResponse(['user' => $user], 201);
        
    } catch (Exception $e) {
        $db->rollback();
        throw $e;
    }
    
} catch (Exception $e) {
    logError('Registration error: ' . $e->getMessage());
    sendError('Registration failed', 400);
}
?>