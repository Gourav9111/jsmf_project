# JSMF Loan Management System - Hostinger Deployment Guide

## Overview
This is a complete loan management system built with PHP, MySQL, HTML, CSS, and JavaScript - fully compatible with Hostinger shared hosting.

## File Structure
```
hostinger/
├── index.html                 # Main frontend application
├── index.php                  # PHP backend router (alternative entry point)
├── api/                       # API endpoints
│   ├── auth/                  # Authentication APIs
│   ├── contact-queries/       # Contact form APIs
│   ├── dsa-partners/          # DSA partner APIs
│   ├── leads/                 # Lead management APIs
│   ├── loan-applications/     # Loan application APIs
│   └── users/                 # User management APIs
├── assets/
│   ├── css/
│   │   └── style.css         # Main stylesheet (no frameworks)
│   ├── js/
│   │   └── main.js           # Main JavaScript (vanilla JS)
│   └── images/               # Image assets
├── config/
│   └── database.php          # Database configuration
├── includes/
│   ├── functions.php         # Common functions
│   └── session.php           # Session management
├── database_setup.sql        # Database schema
└── HOSTINGER_SETUP.md        # This file
```

## Deployment Steps

### Step 1: Database Setup
1. Login to your Hostinger control panel
2. Go to "Databases" > "MySQL Databases"
3. Create a new database (e.g., `jsmf_loans`)
4. Create a database user and assign it to the database
5. Import the `database_setup.sql` file using phpMyAdmin or the database import tool

### Step 2: File Upload
1. Upload all files from the `hostinger/` directory to your domain's `public_html` folder
2. Make sure file permissions are set correctly:
   - Files: 644
   - Directories: 755

### Step 3: Database Configuration
1. Edit `config/database.php`
2. Update the following variables with your Hostinger database details:
   ```php
   private $host = 'localhost';                    # Usually localhost
   private $database_name = 'your_database_name';  # Your database name
   private $username = 'your_db_username';         # Your database username
   private $password = 'your_db_password';         # Your database password
   ```

### Step 4: Test the Installation
1. Visit your domain in a web browser
2. You should see the JSMF homepage
3. Test the contact form and DSA application form
4. Check that the EMI calculator works

## Default Admin Account
- **Username:** harsh@jsmf.in
- **Password:** Harsh@9131
- **Role:** Admin

You can login at `/admin/login.html` (if you create admin pages) or modify the credentials in the database.

## API Endpoints

### Public APIs (No Authentication Required)
- `POST /api/contact-queries` - Submit contact form
- `POST /api/leads` - Submit quick apply form
- `POST /api/dsa-partners` - DSA partner registration
- `POST /api/users/register` - User registration

### Authentication APIs
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout  
- `GET /api/auth/user` - Get current user

### Protected APIs (Authentication Required)
- `GET /api/loan-applications` - Get loan applications
- `POST /api/loan-applications` - Create loan application
- `PATCH /api/loan-applications/{id}` - Update loan application (admin only)
- `GET /api/leads` - Get leads (admin/dsa only)
- `PATCH /api/leads/{id}` - Update lead
- `PATCH /api/leads/{id}/assign` - Assign lead to DSA (admin only)
- `GET /api/dsa-partners` - Get DSA partners (admin only)
- `GET /api/dsa-partners/profile` - Get DSA profile (dsa only)

## Features
- ✅ Responsive design (mobile-friendly)
- ✅ EMI Calculator
- ✅ Contact forms with validation
- ✅ DSA partner registration
- ✅ Lead management system
- ✅ Loan application system
- ✅ User authentication & sessions
- ✅ Role-based access control (Admin, DSA, User)
- ✅ MySQL database with proper relationships
- ✅ Security features (password hashing, input sanitization, CORS)
- ✅ No external frameworks (vanilla HTML/CSS/JS)

## Security Features
- Password hashing using PHP's `password_hash()`
- Input sanitization on all user inputs
- SQL injection prevention using prepared statements
- CORS handling for API requests
- Session management with security settings
- Role-based access control

## Browser Compatibility
- Chrome (all versions)
- Firefox (all versions)  
- Safari (all versions)
- Edge (all versions)
- Internet Explorer 11+
- Mobile browsers (iOS Safari, Chrome Mobile, etc.)

## Troubleshooting

### Database Connection Issues
- Verify database credentials in `config/database.php`
- Ensure the database user has proper permissions
- Check if the database name exists in your Hostinger panel

### File Permission Issues
- Set directories to 755: `chmod 755 directory_name`
- Set files to 644: `chmod 644 file_name`

### API Not Working
- Check if `.htaccess` is uploaded and working
- Verify PHP version (7.4+ recommended)
- Check error logs in Hostinger control panel

### Contact Form Not Sending
- Verify database connection
- Check JavaScript console for errors
- Ensure all required fields are filled

## Support
For technical support or customization requests, contact the development team.

## License
This software is proprietary to Jay Shree Mahakal Finance Service.