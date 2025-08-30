<?php
/**
 * Update Lead API Endpoint
 */

require_once '../../config/database.php';
require_once '../../includes/functions.php';
require_once '../../includes/session.php';

handleCORS();
requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'PATCH') {
    sendError('Method not allowed', 405);
}

try {
    // Get lead ID from URL path
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $pathParts = explode('/', $path);
    $leadId = end($pathParts);
    
    if (empty($leadId)) {
        sendError('Lead ID is required', 400);
    }
    
    $input = getJsonInput();
    $allowedFields = ['status', 'remarks', 'convertedAt'];
    $updates = [];
    $params = [];
    
    foreach ($allowedFields as $field) {
        if (isset($input[$field])) {
            $dbField = '';
            switch ($field) {
                case 'convertedAt':
                    $dbField = 'converted_at';
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
    $params[] = $leadId;
    
    $db = getDB();
    
    $stmt = $db->prepare("
        UPDATE leads 
        SET " . implode(', ', $updates) . "
        WHERE id = ?
    ");
    
    $stmt->execute($params);
    
    if ($stmt->rowCount() === 0) {
        sendError('Lead not found or no changes made', 404);
    }
    
    // Get updated lead
    $stmt = $db->prepare("SELECT * FROM leads WHERE id = ?");
    $stmt->execute([$leadId]);
    $lead = $stmt->fetch();
    
    sendJsonResponse($lead);
    
} catch (Exception $e) {
    logError('Update lead error: ' . $e->getMessage());
    sendError('Failed to update lead', 500);
}
?>