<?php
/**
 * Contact Queries API Endpoint
 */

require_once '../../config/database.php';
require_once '../../includes/functions.php';
require_once '../../includes/session.php';

handleCORS();

$method = $_SERVER['REQUEST_METHOD'];

try {
    $db = getDB();
    
    if ($method === 'POST') {
        // Create contact query (public endpoint)
        $input = getJsonInput();
        validateRequiredFields($input, ['name', 'mobileNumber', 'message']);
        
        $queryData = [
            'name' => sanitizeInput($input['name']),
            'mobileNumber' => sanitizeInput($input['mobileNumber']),
            'email' => sanitizeInput($input['email'] ?? null),
            'loanType' => sanitizeInput($input['loanType'] ?? null),
            'message' => sanitizeInput($input['message'])
        ];
        
        $queryId = generateUUID();
        $currentTime = getCurrentTimestamp();
        
        $stmt = $db->prepare("
            INSERT INTO contact_queries (id, name, mobile_number, email, loan_type, message, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, 'new', ?)
        ");
        
        $stmt->execute([
            $queryId,
            $queryData['name'],
            $queryData['mobileNumber'],
            $queryData['email'],
            $queryData['loanType'],
            $queryData['message'],
            $currentTime
        ]);
        
        // Get created query
        $stmt = $db->prepare("SELECT * FROM contact_queries WHERE id = ?");
        $stmt->execute([$queryId]);
        $query = $stmt->fetch();
        
        sendJsonResponse($query, 201);
        
    } elseif ($method === 'GET') {
        requireRole('admin');
        
        // Get all contact queries
        $stmt = $db->prepare("
            SELECT * FROM contact_queries
            ORDER BY created_at DESC
        ");
        $stmt->execute();
        $queries = $stmt->fetchAll();
        
        sendJsonResponse($queries);
        
    } else {
        sendError('Method not allowed', 405);
    }
    
} catch (Exception $e) {
    logError('Contact queries error: ' . $e->getMessage());
    sendError('Operation failed', 500);
}
?>