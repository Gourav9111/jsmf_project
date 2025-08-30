<?php
require_once '../config/database.php';
require_once '../includes/session.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'PATCH') {
    sendErrorResponse('Method not allowed', 405);
}

requireRole('admin');

$id = $_GET['id'] ?? '';
if (empty($id)) {
    sendErrorResponse('Lead ID is required');
}

$input = getJsonInput();
if (!$input || !isset($input['dsaId'])) {
    sendErrorResponse('DSA ID is required');
}

$dsaId = $input['dsaId'];

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    // Check if lead exists
    $stmt = $conn->prepare("SELECT * FROM leads WHERE id = ?");
    $stmt->execute([$id]);
    $lead = $stmt->fetch();
    
    if (!$lead) {
        sendErrorResponse('Lead not found', 404);
    }
    
    // Check if DSA exists
    $stmt = $conn->prepare("SELECT * FROM users WHERE id = ? AND role = 'dsa'");
    $stmt->execute([$dsaId]);
    $dsa = $stmt->fetch();
    
    if (!$dsa) {
        sendErrorResponse('DSA not found', 404);
    }
    
    // Assign lead to DSA
    $stmt = $conn->prepare("
        UPDATE leads 
        SET assigned_dsa_id = ?, assigned_at = NOW(), updated_at = NOW() 
        WHERE id = ?
    ");
    $stmt->execute([$dsaId, $id]);
    
    // Get updated lead
    $stmt = $conn->prepare("SELECT * FROM leads WHERE id = ?");
    $stmt->execute([$id]);
    $updatedLead = $stmt->fetch();
    
    sendJsonResponse($updatedLead);
    
} catch (Exception $e) {
    error_log("Lead assignment error: " . $e->getMessage());
    sendErrorResponse('Failed to assign lead', 500);
}
?>