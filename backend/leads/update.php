<?php
require_once '../config/database.php';
require_once '../includes/session.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'PATCH') {
    sendErrorResponse('Method not allowed', 405);
}

requireAuth();

$id = $_GET['id'] ?? '';
if (empty($id)) {
    sendErrorResponse('Lead ID is required');
}

$input = getJsonInput();
if (!$input) {
    sendErrorResponse('Invalid JSON input');
}

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    // Check if lead exists and user has permission
    $sql = "SELECT * FROM leads WHERE id = ?";
    $params = [$id];
    
    if ($_SESSION['user_role'] === 'dsa') {
        $sql .= " AND assigned_dsa_id = ?";
        $params[] = $_SESSION['user_id'];
    }
    
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $lead = $stmt->fetch();
    
    if (!$lead) {
        sendErrorResponse('Lead not found or access denied', 404);
    }
    
    // Build update query dynamically
    $updateFields = [];
    $updateParams = [];
    
    $allowedFields = ['status', 'remarks'];
    if ($_SESSION['user_role'] === 'admin') {
        $allowedFields[] = 'assigned_dsa_id';
    }
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $updateFields[] = $field . " = ?";
            $updateParams[] = $input[$field];
        }
    }
    
    if (empty($updateFields)) {
        sendErrorResponse('No valid fields to update');
    }
    
    // Add converted_at if status is being set to converted
    if (isset($input['status']) && $input['status'] === 'converted') {
        $updateFields[] = "converted_at = NOW()";
    }
    
    $updateFields[] = "updated_at = NOW()";
    $updateParams[] = $id;
    
    $sql = "UPDATE leads SET " . implode(', ', $updateFields) . " WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute($updateParams);
    
    // Get updated lead
    $stmt = $conn->prepare("SELECT * FROM leads WHERE id = ?");
    $stmt->execute([$id]);
    $updatedLead = $stmt->fetch();
    
    sendJsonResponse($updatedLead);
    
} catch (Exception $e) {
    error_log("Lead update error: " . $e->getMessage());
    sendErrorResponse('Failed to update lead', 500);
}
?>