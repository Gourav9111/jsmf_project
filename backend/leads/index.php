<?php
require_once '../config/database.php';
require_once '../includes/session.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Create lead
    $input = getJsonInput();
    if (!$input) {
        sendErrorResponse('Invalid JSON input');
    }
    
    $required = ['name', 'mobileNumber', 'loanType'];
    $errors = validateRequired($input, $required);
    
    if (!validateMobile($input['mobileNumber'] ?? '')) {
        $errors[] = 'Invalid mobile number format';
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
            INSERT INTO leads (
                id, name, mobile_number, email, loan_type, amount, city, source, status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', NOW(), NOW())
        ");
        
        $stmt->execute([
            $id,
            $data['name'],
            $data['mobileNumber'],
            $data['email'] ?? null,
            $data['loanType'],
            $data['amount'] ?? null,
            $data['city'] ?? null,
            $data['source'] ?? 'website'
        ]);
        
        // Get the created lead
        $stmt = $conn->prepare("SELECT * FROM leads WHERE id = ?");
        $stmt->execute([$id]);
        $lead = $stmt->fetch();
        
        sendJsonResponse($lead, 201);
        
    } catch (Exception $e) {
        error_log("Lead creation error: " . $e->getMessage());
        sendErrorResponse('Failed to create lead', 500);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get leads
    requireAuth();
    
    try {
        $db = new Database();
        $conn = $db->getConnection();
        
        $sql = "SELECT * FROM leads";
        $params = [];
        
        if ($_SESSION['user_role'] === 'admin') {
            // Admin sees all leads
            $sql .= " ORDER BY created_at DESC";
        } elseif ($_SESSION['user_role'] === 'dsa') {
            // DSA sees assigned leads
            $sql .= " WHERE assigned_dsa_id = ? ORDER BY created_at DESC";
            $params[] = $_SESSION['user_id'];
        } else {
            sendErrorResponse('Forbidden', 403);
        }
        
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        $leads = $stmt->fetchAll();
        
        sendJsonResponse($leads);
        
    } catch (Exception $e) {
        sendErrorResponse('Failed to get leads', 500);
    }
    
} else {
    sendErrorResponse('Method not allowed', 405);
}
?>