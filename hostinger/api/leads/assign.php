<?php
/**
 * Assign Lead to DSA API Endpoint
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
    // Get lead ID from URL path
    $path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    $pathParts = explode('/', $path);
    $leadId = $pathParts[count($pathParts) - 2]; // Get ID before 'assign'
    
    if (empty($leadId)) {
        sendError('Lead ID is required', 400);
    }
    
    $input = getJsonInput();
    validateRequiredFields($input, ['dsaId']);
    
    $dsaId = sanitizeInput($input['dsaId']);
    $currentTime = getCurrentTimestamp();
    
    $db = getDB();
    
    // Verify DSA exists and has dsa role
    $stmt = $db->prepare("SELECT id FROM users WHERE id = ? AND role = 'dsa' AND is_active = 1");
    $stmt->execute([$dsaId]);
    if (!$stmt->fetch()) {
        sendError('Invalid DSA ID', 400);
    }
    
    // Update lead
    $stmt = $db->prepare("
        UPDATE leads 
        SET assigned_dsa_id = ?, assigned_at = ?, updated_at = ?
        WHERE id = ?
    ");
    
    $stmt->execute([$dsaId, $currentTime, $currentTime, $leadId]);
    
    if ($stmt->rowCount() === 0) {
        sendError('Lead not found or no changes made', 404);
    }
    
    // Get updated lead
    $stmt = $db->prepare("SELECT * FROM leads WHERE id = ?");
    $stmt->execute([$leadId]);
    $lead = $stmt->fetch();
    
    sendJsonResponse($lead);
    
} catch (Exception $e) {
    logError('Assign lead error: ' . $e->getMessage());
    sendError('Failed to assign lead', 500);
}
?>