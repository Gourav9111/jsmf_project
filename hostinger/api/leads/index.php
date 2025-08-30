<?php
/**
 * Leads API Endpoint
 */

require_once '../../config/database.php';
require_once '../../includes/functions.php';
require_once '../../includes/session.php';

handleCORS();

$method = $_SERVER['REQUEST_METHOD'];

try {
    $db = getDB();
    
    if ($method === 'POST') {
        // Create lead (public endpoint)
        $input = getJsonInput();
        validateRequiredFields($input, ['name', 'mobileNumber', 'loanType']);
        
        $leadData = [
            'name' => sanitizeInput($input['name']),
            'mobileNumber' => sanitizeInput($input['mobileNumber']),
            'email' => sanitizeInput($input['email'] ?? null),
            'loanType' => sanitizeInput($input['loanType']),
            'amount' => isset($input['amount']) ? floatval($input['amount']) : null,
            'city' => sanitizeInput($input['city'] ?? null),
            'source' => sanitizeInput($input['source'] ?? 'website')
        ];
        
        $leadId = generateUUID();
        $currentTime = getCurrentTimestamp();
        
        $stmt = $db->prepare("
            INSERT INTO leads (id, name, mobile_number, email, loan_type, amount, city, source, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'new', ?, ?)
        ");
        
        $stmt->execute([
            $leadId,
            $leadData['name'],
            $leadData['mobileNumber'],
            $leadData['email'],
            $leadData['loanType'],
            $leadData['amount'],
            $leadData['city'],
            $leadData['source'],
            $currentTime,
            $currentTime
        ]);
        
        // Get created lead
        $stmt = $db->prepare("SELECT * FROM leads WHERE id = ?");
        $stmt->execute([$leadId]);
        $lead = $stmt->fetch();
        
        sendJsonResponse($lead, 201);
        
    } elseif ($method === 'GET') {
        requireAuth();
        
        $userRole = getCurrentUserRole();
        $userId = getCurrentUserId();
        
        if ($userRole === 'admin') {
            $stmt = $db->prepare("
                SELECT l.*, u.full_name as assigned_dsa_name
                FROM leads l
                LEFT JOIN users u ON l.assigned_dsa_id = u.id
                ORDER BY l.created_at DESC
            ");
            $stmt->execute();
        } elseif ($userRole === 'dsa') {
            $stmt = $db->prepare("
                SELECT * FROM leads 
                WHERE assigned_dsa_id = ?
                ORDER BY created_at DESC
            ");
            $stmt->execute([$userId]);
        } else {
            sendError('Forbidden', 403);
        }
        
        $leads = $stmt->fetchAll();
        sendJsonResponse($leads);
        
    } else {
        sendError('Method not allowed', 405);
    }
    
} catch (Exception $e) {
    logError('Leads error: ' . $e->getMessage());
    sendError('Operation failed', 500);
}
?>