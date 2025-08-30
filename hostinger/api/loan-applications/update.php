<?php
/**
 * Update Loan Application API Endpoint
 */

require_once '../../config/database.php';
require_once '../../includes/functions.php';
require_once '../../includes/session.php';

handleCORS();
requireRole('admin');

if ($_SERVER['REQUEST_METHOD'] !== 'PATCH') {
    sendError('Method not allowed', 405);
}

try {
    // Get application ID from URL path
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $pathParts = explode('/', $path);
    $applicationId = end($pathParts);
    
    if (empty($applicationId)) {
        sendError('Application ID is required', 400);
    }
    
    $input = getJsonInput();
    $allowedFields = ['status', 'assignedDsaId', 'remarks', 'interestRate'];
    $updates = [];
    $params = [];
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $dbField = '';
            switch ($field) {
                case 'assignedDsaId':
                    $dbField = 'assigned_dsa_id';
                    break;
                case 'interestRate':
                    $dbField = 'interest_rate';
                    break;
                default:
                    $dbField = $field;
            }
            $updates[] = "$dbField = ?";
            $params[] = sanitizeInput($input[$field]);
        }
    }
    
    if (empty($updates)) {
        sendError('No valid fields to update', 400);
    }
    
    $updates[] = "updated_at = ?";
    $params[] = getCurrentTimestamp();
    $params[] = $applicationId;
    
    $db = getDB();
    
    $stmt = $db->prepare("
        UPDATE loan_applications 
        SET " . implode(', ', $updates) . "
        WHERE id = ?
    ");
    
    $stmt->execute($params);
    
    if ($stmt->rowCount() === 0) {
        sendError('Application not found or no changes made', 404);
    }
    
    // Get updated application
    $stmt = $db->prepare("SELECT * FROM loan_applications WHERE id = ?");
    $stmt->execute([$applicationId]);
    $application = $stmt->fetch();
    
    sendJsonResponse($application);
    
} catch (Exception $e) {
    logError('Update loan application error: ' . $e->getMessage());
    sendError('Failed to update application', 500);
}
?>