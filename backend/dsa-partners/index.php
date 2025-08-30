<?php
require_once '../config/database.php';
require_once '../includes/session.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Create DSA partner
    $input = getJsonInput();
    if (!$input) {
        sendErrorResponse('Invalid JSON input');
    }
    
    if (!isset($input['userData']) || !isset($input['partnerData'])) {
        sendErrorResponse('User data and partner data are required');
    }
    
    $userData = $input['userData'];
    $partnerData = $input['partnerData'];
    
    $required = ['username', 'email', 'password', 'fullName', 'mobileNumber'];
    $errors = validateRequired($userData, $required);
    
    if (!validateEmail($userData['email'] ?? '')) {
        $errors[] = 'Invalid email format';
    }
    
    if (!empty($errors)) {
        sendErrorResponse(implode(', ', $errors));
    }
    
    try {
        $db = new Database();
        $conn = $db->getConnection();
        $conn->beginTransaction();
        
        // Create user first
        $userId = generateUuid();
        $hashedPassword = password_hash($userData['password'], PASSWORD_DEFAULT);
        
        $userStmt = $conn->prepare("
            INSERT INTO users (id, username, email, password, role, full_name, mobile_number, city, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, 'dsa', ?, ?, ?, 1, NOW(), NOW())
        ");
        
        $userStmt->execute([
            $userId,
            $userData['username'],
            $userData['email'],
            $hashedPassword,
            $userData['fullName'],
            $userData['mobileNumber'],
            $userData['city'] ?? null
        ]);
        
        // Create DSA partner profile
        $partnerId = generateUuid();
        $partnerStmt = $conn->prepare("
            INSERT INTO dsa_partners (
                id, user_id, experience, background, commission_rate, total_earnings, 
                total_leads, successful_leads, kyc_status, created_at, updated_at
            ) VALUES (?, ?, ?, ?, 2.0, 0, 0, 0, 'pending', NOW(), NOW())
        ");
        
        $partnerStmt->execute([
            $partnerId,
            $userId,
            $partnerData['experience'] ?? null,
            $partnerData['background'] ?? null
        ]);
        
        $conn->commit();
        
        sendJsonResponse([
            'user' => [
                'id' => $userId,
                'username' => $userData['username'],
                'role' => 'dsa',
                'fullName' => $userData['fullName'],
                'email' => $userData['email']
            ],
            'partner' => [
                'id' => $partnerId,
                'userId' => $userId,
                'experience' => $partnerData['experience'] ?? null,
                'background' => $partnerData['background'] ?? null
            ]
        ], 201);
        
    } catch (Exception $e) {
        $conn->rollback();
        error_log("DSA registration error: " . $e->getMessage());
        sendErrorResponse('DSA registration failed', 500);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get DSA partners (admin only)
    requireRole('admin');
    
    try {
        $db = new Database();
        $conn = $db->getConnection();
        
        $stmt = $conn->prepare("
            SELECT dp.*, u.username, u.email, u.full_name, u.mobile_number, u.city
            FROM dsa_partners dp
            JOIN users u ON dp.user_id = u.id
            ORDER BY dp.created_at DESC
        ");
        $stmt->execute();
        $partners = $stmt->fetchAll();
        
        sendJsonResponse($partners);
        
    } catch (Exception $e) {
        sendErrorResponse('Failed to get DSA partners', 500);
    }
    
} else {
    sendErrorResponse('Method not allowed', 405);
}
?>