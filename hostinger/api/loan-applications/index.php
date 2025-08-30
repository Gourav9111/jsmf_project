<?php
/**
 * Loan Applications API Endpoint
 */

require_once '../../config/database.php';
require_once '../../includes/functions.php';
require_once '../../includes/session.php';

handleCORS();
requireAuth();

$method = $_SERVER['REQUEST_METHOD'];

try {
    $db = getDB();
    
    if ($method === 'POST') {
        // Create loan application
        $input = getJsonInput();
        validateRequiredFields($input, ['loanType']);
        
        $applicationData = [
            'loanType' => sanitizeInput($input['loanType']),
            'amount' => isset($input['amount']) ? floatval($input['amount']) : null,
            'tenure' => isset($input['tenure']) ? intval($input['tenure']) : null,
            'monthlyIncome' => isset($input['monthlyIncome']) ? floatval($input['monthlyIncome']) : null,
            'employmentType' => sanitizeInput($input['employmentType'] ?? null),
            'purpose' => sanitizeInput($input['purpose'] ?? null)
        ];
        
        $db->beginTransaction();
        
        try {
            $applicationId = generateUUID();
            $userId = getCurrentUserId();
            $currentTime = getCurrentTimestamp();
            
            $stmt = $db->prepare("
                INSERT INTO loan_applications 
                (id, user_id, loan_type, amount, tenure, monthly_income, employment_type, purpose, status, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)
            ");
            
            $stmt->execute([
                $applicationId,
                $userId,
                $applicationData['loanType'],
                $applicationData['amount'],
                $applicationData['tenure'],
                $applicationData['monthlyIncome'],
                $applicationData['employmentType'],
                $applicationData['purpose'],
                $currentTime,
                $currentTime
            ]);
            
            // Create a lead for this application
            $userStmt = $db->prepare("SELECT full_name, mobile_number, email, city FROM users WHERE id = ?");
            $userStmt->execute([$userId]);
            $user = $userStmt->fetch();
            
            if ($user) {
                $leadId = generateUUID();
                $leadStmt = $db->prepare("
                    INSERT INTO leads 
                    (id, name, mobile_number, email, loan_type, amount, city, source, status, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, 'application', 'new', ?, ?)
                ");
                
                $leadStmt->execute([
                    $leadId,
                    $user['full_name'],
                    $user['mobile_number'],
                    $user['email'],
                    $applicationData['loanType'],
                    $applicationData['amount'] ?? 0,
                    $user['city'] ?? 'Bhopal',
                    $currentTime,
                    $currentTime
                ]);
            }
            
            $db->commit();
            
            // Get the created application
            $stmt = $db->prepare("SELECT * FROM loan_applications WHERE id = ?");
            $stmt->execute([$applicationId]);
            $application = $stmt->fetch();
            
            sendJsonResponse($application, 201);
            
        } catch (Exception $e) {
            $db->rollback();
            throw $e;
        }
        
    } elseif ($method === 'GET') {
        // Get loan applications
        $userRole = getCurrentUserRole();
        $userId = getCurrentUserId();
        
        if ($userRole === 'admin') {
            $stmt = $db->prepare("
                SELECT la.*, u.full_name as user_name, u.email as user_email
                FROM loan_applications la
                LEFT JOIN users u ON la.user_id = u.id
                ORDER BY la.created_at DESC
            ");
            $stmt->execute();
        } elseif ($userRole === 'dsa') {
            $stmt = $db->prepare("
                SELECT la.*, u.full_name as user_name, u.email as user_email
                FROM loan_applications la
                LEFT JOIN users u ON la.user_id = u.id
                WHERE la.assigned_dsa_id = ?
                ORDER BY la.created_at DESC
            ");
            $stmt->execute([$userId]);
        } else {
            $stmt = $db->prepare("
                SELECT * FROM loan_applications 
                WHERE user_id = ? 
                ORDER BY created_at DESC
            ");
            $stmt->execute([$userId]);
        }
        
        $applications = $stmt->fetchAll();
        sendJsonResponse($applications);
        
    } else {
        sendError('Method not allowed', 405);
    }
    
} catch (Exception $e) {
    logError('Loan applications error: ' . $e->getMessage());
    sendError('Operation failed', 500);
}
?>