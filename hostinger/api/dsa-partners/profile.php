<?php
/**
 * DSA Partner Profile API Endpoint
 */

require_once '../../config/database.php';
require_once '../../includes/functions.php';
require_once '../../includes/session.php';

handleCORS();
requireRole('dsa');

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

try {
    $userId = getCurrentUserId();
    $db = getDB();
    
    $stmt = $db->prepare("
        SELECT dp.*, u.username, u.email, u.full_name, u.mobile_number, u.city
        FROM dsa_partners dp
        JOIN users u ON dp.user_id = u.id
        WHERE dp.user_id = ?
    ");
    $stmt->execute([$userId]);
    $partner = $stmt->fetch();
    
    if (!$partner) {
        sendError('DSA profile not found', 404);
    }
    
    // Format response
    $formattedPartner = [
        'id' => $partner['id'],
        'userId' => $partner['user_id'],
        'username' => $partner['username'],
        'email' => $partner['email'],
        'fullName' => $partner['full_name'],
        'mobileNumber' => $partner['mobile_number'],
        'city' => $partner['city'],
        'experience' => $partner['experience'],
        'background' => $partner['background'],
        'commissionRate' => $partner['commission_rate'],
        'totalEarnings' => $partner['total_earnings'],
        'totalLeads' => $partner['total_leads'],
        'successfulLeads' => $partner['successful_leads'],
        'kycStatus' => $partner['kyc_status'],
        'createdAt' => $partner['created_at'],
        'updatedAt' => $partner['updated_at']
    ];
    
    sendJsonResponse($formattedPartner);
    
} catch (Exception $e) {
    logError('Get DSA profile error: ' . $e->getMessage());
    sendError('Failed to get DSA profile', 500);
}
?>