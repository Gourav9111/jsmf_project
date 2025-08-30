<?php
require_once '../config/database.php';
require_once '../includes/session.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Create loan application
    requireAuth();
    
    $input = getJsonInput();
    if (!$input) {
        sendErrorResponse('Invalid JSON input');
    }
    
    $required = ['loanType'];
    $errors = validateRequired($input, $required);
    
    if (!empty($errors)) {
        sendErrorResponse(implode(', ', $errors));
    }
    
    $data = sanitizeInput($input);
    
    try {
        $db = new Database();
        $conn = $db->getConnection();
        
        $id = generateUuid();
        
        $stmt = $conn->prepare("
            INSERT INTO loan_applications (
                id, user_id, loan_type, amount, tenure, monthly_income, 
                employment_type, purpose, interest_rate, status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 7.5, 'pending', NOW(), NOW())
        ");
        
        $stmt->execute([
            $id,
            $_SESSION['user_id'],
            $data['loanType'],
            $data['amount'] ?? null,
            $data['tenure'] ?? null,
            $data['monthlyIncome'] ?? null,
            $data['employmentType'] ?? null,
            $data['purpose'] ?? null
        ]);
        
        // Create a lead for this application
        $userStmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
        $userStmt->execute([$_SESSION['user_id']]);
        $user = $userStmt->fetch();
        
        if ($user) {
            $leadId = generateUuid();
            $leadStmt = $conn->prepare("
                INSERT INTO leads (
                    id, name, mobile_number, email, loan_type, amount, city, source, status, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, 'application', 'new', NOW(), NOW())
            ");
            
            $leadStmt->execute([
                $leadId,
                $user['full_name'],
                $user['mobile_number'],
                $user['email'],
                $data['loanType'],
                $data['amount'] ?? 0,
                $user['city'] ?? 'Bhopal'
            ]);
        }
        
        // Get the created application
        $stmt = $conn->prepare("SELECT * FROM loan_applications WHERE id = ?");
        $stmt->execute([$id]);
        $application = $stmt->fetch();
        
        sendJsonResponse($application, 201);
        
    } catch (Exception $e) {
        error_log("Application creation error: " . $e->getMessage());
        sendErrorResponse('Failed to create application', 500);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get loan applications
    requireAuth();
    
    try {
        $db = new Database();
        $conn = $db->getConnection();
        
        $sql = "SELECT * FROM loan_applications";
        $params = [];
        
        if ($_SESSION['user_role'] === 'admin') {
            // Admin sees all applications
            $sql .= " ORDER BY created_at DESC";
        } elseif ($_SESSION['user_role'] === 'dsa') {
            // DSA sees assigned applications
            $sql .= " WHERE assigned_dsa_id = ? ORDER BY created_at DESC";
            $params[] = $_SESSION['user_id'];
        } else {
            // User sees only their applications
            $sql .= " WHERE user_id = ? ORDER BY created_at DESC";
            $params[] = $_SESSION['user_id'];
        }
        
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        $applications = $stmt->fetchAll();
        
        sendJsonResponse($applications);
        
    } catch (Exception $e) {
        sendErrorResponse('Failed to get applications', 500);
    }
    
} else {
    sendErrorResponse('Method not allowed', 405);
}
?>