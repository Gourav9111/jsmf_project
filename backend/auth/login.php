<?php
require_once '../config/database.php';
require_once '../includes/session.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendErrorResponse('Method not allowed', 405);
}

$input = getJsonInput();
if (!$input) {
    sendErrorResponse('Invalid JSON input');
}

$errors = validateRequired($input, ['username', 'password']);
if (!empty($errors)) {
    sendErrorResponse(implode(', ', $errors));
}

$username = sanitizeInput($input['username']);
$password = $input['password'];

try {
    $db = new Database();
    $conn = $db->getConnection();
    
    $stmt = $conn->prepare("SELECT * FROM users WHERE username = ? AND is_active = 1");
    $stmt->execute([$username]);
    $user = $stmt->fetch();
    
    if (!$user || !password_verify($password, $user['password'])) {
        sendErrorResponse('Invalid credentials', 401);
    }
    
    setUserSession($user);
    
    sendJsonResponse([
        'user' => [
            'id' => $user['id'],
            'username' => $user['username'],
            'role' => $user['role'],
            'fullName' => $user['full_name'],
            'email' => $user['email']
        ]
    ]);
    
} catch (Exception $e) {
    error_log("Login error: " . $e->getMessage());
    sendErrorResponse('Login failed', 500);
}
?>