<?php
/**
 * Database Configuration for JSMF Loan Management System
 * Configure these settings according to your Hostinger database details
 */

class Database {
    private $host = 'localhost';
    private $database_name = 'jsmf_loans';
    private $username = 'your_db_username'; // Replace with your Hostinger DB username
    private $password = 'your_db_password'; // Replace with your Hostinger DB password
    private $charset = 'utf8mb4';
    private $connection = null;
    
    public function getConnection() {
        if ($this->connection === null) {
            try {
                $dsn = "mysql:host={$this->host};dbname={$this->database_name};charset={$this->charset}";
                $options = [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ];
                
                $this->connection = new PDO($dsn, $this->username, $this->password, $options);
            } catch (PDOException $e) {
                error_log("Database connection failed: " . $e->getMessage());
                throw new Exception("Database connection failed");
            }
        }
        
        return $this->connection;
    }
    
    public function closeConnection() {
        $this->connection = null;
    }
}

// Helper function to get database connection
function getDB() {
    $database = new Database();
    return $database->getConnection();
}
?>