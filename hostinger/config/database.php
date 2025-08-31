<?php
/**
 * Database Configuration for JSMF Loan Management System
 * Configure these settings according to your Hostinger database details
 */

class Database {
    private $host;
    private $database_name;
    private $username;
    private $password;
    private $port;
    private $connection = null;
    
    public function __construct() {
        // Use environment variables if available (for Replit), otherwise use default values
        $this->host = $_ENV['PGHOST'] ?? 'localhost';
        $this->database_name = $_ENV['PGDATABASE'] ?? 'jsmf_loans';
        $this->username = $_ENV['PGUSER'] ?? 'your_db_username';
        $this->password = $_ENV['PGPASSWORD'] ?? 'your_db_password';
        $this->port = $_ENV['PGPORT'] ?? '5432';
    }
    
    public function getConnection() {
        if ($this->connection === null) {
            try {
                // Use PostgreSQL for Replit environment, MySQL for Hostinger
                if (isset($_ENV['PGHOST'])) {
                    // PostgreSQL connection for Replit
                    $dsn = "pgsql:host={$this->host};port={$this->port};dbname={$this->database_name}";
                } else {
                    // MySQL connection for Hostinger
                    $dsn = "mysql:host={$this->host};dbname={$this->database_name};charset=utf8mb4";
                }
                
                $options = [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ];
                
                $this->connection = new PDO($dsn, $this->username, $this->password, $options);
            } catch (PDOException $e) {
                error_log("Database connection failed: " . $e->getMessage());
                // For demo purposes, don't throw exception, just log it
                error_log("Continuing without database connection for demo");
                return null;
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