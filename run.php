<?php
// Simple PHP server runner for development
echo "Starting PHP development server for JSMF Loan Management System...\n";
echo "Server will be available at: http://localhost:5000\n";
echo "Document root: hostinger/\n";
echo "Press Ctrl+C to stop the server\n\n";

// Change to the hostinger directory and start the server
chdir('hostinger');
exec('php -S 0.0.0.0:5000 index.php');
?>