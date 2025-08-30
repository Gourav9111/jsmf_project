<?php
require_once '../config/database.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendErrorResponse('Method not allowed', 405);
}

$input = getJsonInput();
if (!$input) {
    sendErrorResponse('Invalid JSON input');
}

$required = ['username', 'email', 'password', 'fullName', 'mobileNumber'];
$errors = validateRequired($input, $required);

if (!validateEmail($input['email'] ?? '')) {
    $errors[] = 'Invalid email format';
}

if (!validateMobile($input['mobileNumber'] ?? '')) {
    $errors[] = 'Invalid mobile number format';
}

if (!empty($errors)) {
    sendErrorResponse(implode(', ', $errors));
}

$userData = sanitizeInput($input);
$role = $userData['role'] ?? 'user';

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    // Check if username exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $stmt->execute([$userData['username']]);
    if ($stmt->fetch()) {
        sendErrorResponse('Username already exists');
    }
    
    // Check if email exists
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$userData['email']]);
    if ($stmt->fetch()) {
        sendErrorResponse('Email already registered');
    }
    
    // Create user
    $id = generateUuid();
    $hashedPassword = password_hash($userData['password'], PASSWORD_DEFAULT);
    
    $stmt = $conn->prepare("
        INSERT INTO users (id, username, email, password, role, full_name, mobile_number, city, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, NOW(), NOW())
    ");
    
    $stmt->execute([
        $id,
        $userData['username'],
        $userData['email'],
        $hashedPassword,
        $role,
        $userData['fullName'],
        $userData['mobileNumber'],
        $userData['city'] ?? null
    ]);
    
    sendJsonResponse([
        'user' => [
            'id' => $id,
            'username' => $userData['username'],
            'role' => $role,
            'fullName' => $userData['fullName'],
            'email' => $userData['email']
        ]
    ], 201);
    
} catch (Exception $e) {
    error_log("Registration error: " . $e->getMessage());
    sendErrorResponse('Registration failed', 500);
}
?>