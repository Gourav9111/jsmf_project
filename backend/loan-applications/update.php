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
    sendErrorResponse('Application ID is required');
}

$input = getJsonInput();
if (!$input) {
    sendErrorResponse('Invalid JSON input');
}

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    // Check if application exists
    $stmt = $conn->prepare("SELECT * FROM loan_applications WHERE id = ?");
    $stmt->execute([$id]);
    $application = $stmt->fetch();
    
    if (!$application) {
        sendErrorResponse('Application not found', 404);
    }
    
    // Build update query dynamically
    $updateFields = [];
    $params = [];
    
    $allowedFields = ['status', 'assigned_dsa_id', 'remarks', 'interest_rate'];
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $updateFields[] = $field . " = ?";
            $params[] = $input[$field];
        }
    }
    
    if (empty($updateFields)) {
        sendErrorResponse('No valid fields to update');
    }
    
    $updateFields[] = "updated_at = NOW()";
    $params[] = $id;
    
    $sql = "UPDATE loan_applications SET " . implode(', ', $updateFields) . " WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    
    // Get updated application
    $stmt = $conn->prepare("SELECT * FROM loan_applications WHERE id = ?");
    $stmt->execute([$id]);
    $updatedApplication = $stmt->fetch();
    
    sendJsonResponse($updatedApplication);
    
} catch (Exception $e) {
    error_log("Application update error: " . $e->getMessage());
    sendErrorResponse('Failed to update application', 500);
}
?>