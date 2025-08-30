<?php
/**
 * User Logout API Endpoint
 */

require_once '../../includes/functions.php';
require_once '../../includes/session.php';

handleCORS();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

try {
    clearUserSession();
    sendJsonResponse(['message' => 'Logged out successfully']);
    
} catch (Exception $e) {
    logError('Logout error: ' . $e->getMessage());
    sendError('Logout failed', 500);
}
?>