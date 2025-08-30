<?php
require_once '../config/database.php';
require_once '../includes/session.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendErrorResponse('Method not allowed', 405);
}

requireRole('dsa');

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    $stmt = $conn->prepare("
        SELECT dp.*, u.username, u.email, u.full_name, u.mobile_number, u.city
        FROM dsa_partners dp
        JOIN users u ON dp.user_id = u.id
        WHERE dp.user_id = ?
    ");
    $stmt->execute([$_SESSION['user_id']]);
    $partner = $stmt->fetch();
    
    if (!$partner) {
        sendErrorResponse('DSA profile not found', 404);
    }
    
    sendJsonResponse($partner);
    
} catch (Exception $e) {
    sendErrorResponse('Failed to get DSA profile', 500);
}
?>