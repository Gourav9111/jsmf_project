<?php
/**
 * DSA Partners API Endpoint
 */

require_once '../../config/database.php';
require_once '../../includes/functions.php';
require_once '../../includes/session.php';

handleCORS();

$method = $_SERVER['REQUEST_METHOD'];

try {
    $db = getDB();
    
    if ($method === 'POST') {
        // Create DSA partner registration
        $input = getJsonInput();
        validateRequiredFields($input, ['userData', 'partnerData']);
        
        $userData = $input['userData'];
        $partnerData = $input['partnerData'];
        
        validateRequiredFields($userData, ['username', 'email', 'password', 'fullName', 'mobileNumber']);
        
        // Sanitize user data
        $userData = [
            'username' => sanitizeInput($userData['username']),
            'email' => sanitizeInput($userData['email']),
            'password' => $userData['password'],
            'fullName' => sanitizeInput($userData['fullName']),
            'mobileNumber' => sanitizeInput($userData['mobileNumber']),
            'city' => sanitizeInput($userData['city'] ?? null),
            'role' => 'dsa'
        ];
        
        $partnerData = [
            'experience' => sanitizeInput($partnerData['experience'] ?? null),
            'background' => sanitizeInput($partnerData['background'] ?? null)
        ];
        
        $db->beginTransaction();
        
        try {
            // Check if username/email exists
            $stmt = $db->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
            $stmt->execute([$userData['username'], $userData['email']]);
            if ($stmt->fetch()) {
                sendError('Username or email already exists', 400);
            }
            
            // Create user
            $userId = generateUUID();
            $hashedPassword = hashPassword($userData['password']);
            $currentTime = getCurrentTimestamp();
            
            $userStmt = $db->prepare("
                INSERT INTO users (id, username, email, password, role, full_name, mobile_number, city, is_active, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
            ");
            
            $userStmt->execute([
                $userId,
                $userData['username'],
                $userData['email'],
                $hashedPassword,
                $userData['role'],
                $userData['fullName'],
                $userData['mobileNumber'],
                $userData['city'],
                $currentTime,
                $currentTime
            ]);
            
            // Create DSA partner profile
            $partnerId = generateUUID();
            $partnerStmt = $db->prepare("
                INSERT INTO dsa_partners (id, user_id, experience, background, commission_rate, total_earnings, total_leads, successful_leads, kyc_status, created_at, updated_at)
                VALUES (?, ?, ?, ?, 2.00, 0, 0, 0, 'pending', ?, ?)
            ");
            
            $partnerStmt->execute([
                $partnerId,
                $userId,
                $partnerData['experience'],
                $partnerData['background'],
                $currentTime,
                $currentTime
            ]);
            
            $db->commit();
            
            // Return created data
            $user = [
                'id' => $userId,
                'username' => $userData['username'],
                'email' => $userData['email'],
                'role' => $userData['role'],
                'fullName' => $userData['fullName'],
                'mobileNumber' => $userData['mobileNumber'],
                'city' => $userData['city']
            ];
            
            $partner = [
                'id' => $partnerId,
                'userId' => $userId,
                'experience' => $partnerData['experience'],
                'background' => $partnerData['background'],
                'commissionRate' => '2.00',
                'totalEarnings' => '0',
                'totalLeads' => 0,
                'successfulLeads' => 0,
                'kycStatus' => 'pending'
            ];
            
            sendJsonResponse(['user' => $user, 'partner' => $partner], 201);
            
        } catch (Exception $e) {
            $db->rollback();
            throw $e;
        }
        
    } elseif ($method === 'GET') {
        requireRole('admin');
        
        // Get all DSA partners
        $stmt = $db->prepare("
            SELECT dp.*, u.username, u.email, u.full_name, u.mobile_number, u.city, u.is_active
            FROM dsa_partners dp
            JOIN users u ON dp.user_id = u.id
            ORDER BY dp.created_at DESC
        ");
        $stmt->execute();
        $partners = $stmt->fetchAll();
        
        // Format response
        $formattedPartners = array_map(function($partner) {
            return [
                'id' => $partner['id'],
                'userId' => $partner['user_id'],
                'username' => $partner['username'],
                'email' => $partner['email'],
                'fullName' => $partner['full_name'],
                'mobileNumber' => $partner['mobile_number'],
                'city' => $partner['city'],
                'isActive' => (bool)$partner['is_active'],
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
        }, $partners);
        
        sendJsonResponse($formattedPartners);
        
    } else {
        sendError('Method not allowed', 405);
    }
    
} catch (Exception $e) {
    logError('DSA partners error: ' . $e->getMessage());
    sendError('Operation failed', 500);
}
?>