<?php
/**
 * Get Current User API Endpoint
 */

require_once '../../config/database.php';
require_once '../../includes/functions.php';
require_once '../../includes/session.php';

handleCORS();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

requireAuth();

try {
    $userId = getCurrentUserId();
    $db = getDB();
    
    $stmt = $db->prepare("
        SELECT id, username, email, role, full_name, mobile_number, city, is_active 
        FROM users 
        WHERE id = ? AND is_active = 1
    ");
    $stmt->execute([$userId]);
    $user = $stmt->fetch();
    
    if (!$user) {
        sendError('User not found', 404);
    }
    
    // Format response
    $user['fullName'] = $user['full_name'];
    $user['mobileNumber'] = $user['mobile_number'];
    $user['isActive'] = (bool)$user['is_active'];
    unset($user['full_name'], $user['mobile_number'], $user['is_active']);
    
    sendJsonResponse($user);
    
} catch (Exception $e) {
    logError('Get user error: ' . $e->getMessage());
    sendError('Failed to get user', 500);
}
?>