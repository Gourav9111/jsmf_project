# JSMF Loan Management System - Hostinger Deployment Instructions

## Overview
This PHP backend is a complete conversion of your Node.js/TypeScript application, optimized for Hostinger shared hosting.

## Folder Structure
```
public_html/
├── api/                    # API endpoints
│   ├── auth/              # Authentication endpoints
│   ├── users/             # User management
│   ├── loan-applications/ # Loan application APIs
│   ├── dsa-partners/      # DSA partner APIs
│   ├── leads/             # Lead management APIs
│   └── contact-queries/   # Contact form APIs
├── config/                # Configuration files
│   └── database.php       # Database connection
├── includes/              # Helper files
│   ├── functions.php      # Common functions
│   └── session.php        # Session management
├── assets/                # Static files (CSS, JS, images)
├── index.php              # Main entry point
├── .htaccess              # Apache configuration
└── database_setup.sql     # Database schema
```

## Step 1: Database Setup

1. **Create MySQL Database in Hostinger Panel:**
   - Login to your Hostinger account
   - Go to "Databases" → "MySQL Databases"
   - Create a new database (e.g., `your_username_jsmf_loans`)
   - Create a database user and assign it to the database
   - Note down the database name, username, and password

2. **Import Database Schema:**
   - Open phpMyAdmin from your Hostinger panel
   - Select your database
   - Go to "Import" tab
   - Upload and execute `database_setup.sql`

## Step 2: Configure Database Connection

Edit `config/database.php`:
```php
private $host = 'localhost';
private $database_name = 'your_database_name';    // Replace with your DB name
private $username = 'your_db_username';           // Replace with your DB username
private $password = 'your_db_password';           // Replace with your DB password
```

## Step 3: Upload Files to Hostinger

1. **Using File Manager:**
   - Login to Hostinger control panel
   - Open "File Manager"
   - Navigate to `public_html` folder
   - Upload all files from the `hostinger/` directory

2. **Using FTP:**
   - Use an FTP client (FileZilla, etc.)
   - Connect to your Hostinger FTP
   - Upload files to `public_html` directory

## Step 4: Set File Permissions

Set the following permissions:
- Folders: 755
- PHP files: 644
- .htaccess files: 644

## Step 5: Test the Installation

1. **Visit your website:** `https://yourdomain.com`
2. **Test API endpoints:** `https://yourdomain.com/api/auth/login`
3. **Default admin login:**
   - Username: `harsh@jsmf.in`
   - Password: `Harsh@9131`

## API Endpoints Reference

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user` - Get current user

### User Management
- `POST /api/users/register` - Register new user

### Loan Applications
- `POST /api/loan-applications` - Create application
- `GET /api/loan-applications` - Get applications
- `PATCH /api/loan-applications/{id}` - Update application

### DSA Partners
- `POST /api/dsa-partners` - Register DSA
- `GET /api/dsa-partners` - Get all DSAs (admin)
- `GET /api/dsa-partners/profile` - Get DSA profile

### Lead Management
- `POST /api/leads` - Create lead
- `GET /api/leads` - Get leads
- `PATCH /api/leads/{id}/assign` - Assign lead to DSA
- `PATCH /api/leads/{id}` - Update lead

### Contact Queries
- `POST /api/contact-queries` - Submit query
- `GET /api/contact-queries` - Get queries (admin)

## Frontend Integration

Update your frontend API calls to point to your Hostinger domain:

```javascript
// Before (Node.js)
const API_BASE = 'http://localhost:5000/api';

// After (PHP on Hostinger)
const API_BASE = 'https://yourdomain.com/api';
```

## Security Features Included

1. **Password Hashing:** Uses PHP's `password_hash()` function
2. **Session Management:** Secure PHP sessions with httpOnly cookies
3. **Input Sanitization:** All inputs are sanitized and validated
4. **SQL Injection Protection:** Uses PDO prepared statements
5. **CORS Headers:** Properly configured for API access
6. **File Access Protection:** Sensitive directories are protected

## Performance Optimizations

1. **Database Indexing:** All frequently queried columns are indexed
2. **Compression:** Gzip compression enabled via .htaccess
3. **Caching Headers:** Static assets have proper cache headers
4. **Connection Reuse:** Database connections are reused efficiently

## Troubleshooting

### Common Issues:

1. **Database Connection Error:**
   - Check database credentials in `config/database.php`
   - Ensure database user has proper permissions

2. **API Returns 404:**
   - Check .htaccess file is uploaded
   - Verify mod_rewrite is enabled (usually enabled on Hostinger)

3. **Session Issues:**
   - Check PHP session configuration
   - Ensure cookies are working properly

4. **CORS Errors:**
   - Update frontend API calls to use HTTPS
   - Check CORS headers in response

### Log Files:
- Check Hostinger error logs in control panel
- PHP errors are logged but not displayed for security

## Backup Strategy

1. **Database Backups:**
   - Use Hostinger's automatic backup feature
   - Export database regularly via phpMyAdmin

2. **File Backups:**
   - Download files via FTP regularly
   - Use Hostinger's file backup feature

## Security Recommendations

1. **Change Default Admin Password**
2. **Use HTTPS** (usually free with Hostinger)
3. **Regular Updates** of PHP version
4. **Monitor Error Logs** regularly
5. **Implement Rate Limiting** for API endpoints if needed

## Support

For issues specific to this conversion:
1. Check error logs first
2. Verify database connection
3. Test API endpoints individually
4. Compare with Node.js implementation for business logic

Your PHP backend is now ready for production use on Hostinger shared hosting!