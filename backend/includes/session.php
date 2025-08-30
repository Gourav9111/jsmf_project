<?php
// Session management
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

function requireAuth() {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['message' => 'Unauthorized']);
        exit;
    }
}

function requireRole($role) {
    requireAuth();
    if ($_SESSION['user_role'] !== $role) {
        http_response_code(403);
        echo json_encode(['message' => 'Forbidden']);
        exit;
    }
}

function getCurrentUser() {
    if (!isset($_SESSION['user_id'])) {
        return null;
    }
    
    return [
        'id' => $_SESSION['user_id'],
        'role' => $_SESSION['user_role'],
        'username' => $_SESSION['username'] ?? '',
        'fullName' => $_SESSION['full_name'] ?? '',
        'email' => $_SESSION['email'] ?? ''
    ];
}

function setUserSession($user) {
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_role'] = $user['role'];
    $_SESSION['username'] = $user['username'];
    $_SESSION['full_name'] = $user['full_name'];
    $_SESSION['email'] = $user['email'];
}

function destroyUserSession() {
    session_unset();
    session_destroy();
}
?>