<?php
require_once '../config/database.php';
require_once '../includes/session.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Create contact query
    $input = getJsonInput();
    if (!$input) {
        sendErrorResponse('Invalid JSON input');
    }
    
    $required = ['name', 'mobileNumber', 'message'];
    $errors = validateRequired($input, $required);
    
    if (!validateMobile($input['mobileNumber'] ?? '')) {
        $errors[] = 'Invalid mobile number format';
    }
    
    if (isset($input['email']) && !empty($input['email']) && !validateEmail($input['email'])) {
        $errors[] = 'Invalid email format';
    }
    
    if (!empty($errors)) {
        sendErrorResponse(implode(', ', $errors));
    }
    
    $data = sanitizeInput($input);
    
    try {
        $db = new Database();
        $conn = $db->getConnection();
        
        $id = generateUuid();
        
        $stmt = $conn->prepare("
            INSERT INTO contact_queries (
                id, name, mobile_number, email, loan_type, message, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, 'new', NOW())
        ");
        
        $stmt->execute([
            $id,
            $data['name'],
            $data['mobileNumber'],
            $data['email'] ?? null,
            $data['loanType'] ?? null,
            $data['message']
        ]);
        
        // Get the created query
        $stmt = $conn->prepare("SELECT * FROM contact_queries WHERE id = ?");
        $stmt->execute([$id]);
        $query = $stmt->fetch();
        
        sendJsonResponse($query, 201);
        
    } catch (Exception $e) {
        error_log("Contact query error: " . $e->getMessage());
        sendErrorResponse('Failed to submit query', 500);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get contact queries (admin only)
    requireRole('admin');
    
    try {
        $db = new Database();
        $conn = $db->getConnection();
        
        $stmt = $conn->prepare("SELECT * FROM contact_queries ORDER BY created_at DESC");
        $stmt->execute();
        $queries = $stmt->fetchAll();
        
        sendJsonResponse($queries);
        
    } catch (Exception $e) {
        sendErrorResponse('Failed to get contact queries', 500);
    }
    
} else {
    sendErrorResponse('Method not allowed', 405);
}
?>