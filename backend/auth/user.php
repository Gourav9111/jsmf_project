<?php
require_once '../config/database.php';
require_once '../includes/session.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendErrorResponse('Method not allowed', 405);
}

requireAuth();

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    $stmt = $conn->prepare("SELECT id, username, role, full_name, email FROM users WHERE id = ?");
    $stmt->execute([$_SESSION['user_id']]);
    $user = $stmt->fetch();
    
    if (!$user) {
        sendErrorResponse('User not found', 404);
    }
    
    sendJsonResponse([
        'id' => $user['id'],
        'username' => $user['username'],
        'role' => $user['role'],
        'fullName' => $user['full_name'],
        'email' => $user['email']
    ]);
    
} catch (Exception $e) {
    sendErrorResponse('Failed to get user', 500);
}
?>