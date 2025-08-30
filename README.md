# JSMF Loan Management System - PHP Version

A complete loan management system converted from TypeScript/Node.js to PHP for Hostinger shared hosting compatibility.

## 🏗️ Project Structure

```
├── backend/                    # PHP Backend API
│   ├── auth/                  # Authentication endpoints
│   ├── users/                 # User management
│   ├── loan-applications/     # Loan application endpoints
│   ├── dsa-partners/         # DSA partner management
│   ├── leads/                # Lead management
│   ├── contact-queries/      # Contact form handling
│   ├── config/               # Database configuration
│   ├── includes/             # Common functions and session handling
│   └── .htaccess             # URL rewriting rules
├── public_html/              # Frontend (HTML/CSS/JS)
│   ├── admin/               # Admin login and dashboard
│   ├── dsa/                 # DSA partner portal
│   ├── user/                # User portal
│   ├── assets/              # CSS, JS, and image files
│   └── index.html           # Main landing page
└── database.sql             # MySQL database schema
```

## 🚀 Deployment Instructions for Hostinger

### Step 1: Upload Files

1. **Backend Files**: Upload the `backend/` directory to your hosting account
2. **Frontend Files**: Upload the contents of `public_html/` to your `public_html` directory
3. **Database**: Import `database.sql` into your MySQL database

### Step 2: Database Setup

1. Log into your Hostinger control panel
2. Go to "Databases" → "MySQL Databases"
3. Create a new database named `jsmf_loans`
4. Import the `database.sql` file
5. Note down your database credentials

### Step 3: Configure Database Connection

Edit `backend/config/database.php` with your database credentials:

```php
private $host = 'localhost';           // Usually localhost for Hostinger
private $database = 'your_db_name';    // Your database name
private $username = 'your_db_user';    // Your database username
private $password = 'your_db_password'; // Your database password
```

### Step 4: Set Up URL Rewriting

Ensure your `.htaccess` file in the `backend/` directory is properly configured. Hostinger supports URL rewriting by default.

### Step 5: Update API Base URL

In the following JavaScript files, update the API base URL if needed:
- `public_html/assets/js/main.js`
- `public_html/assets/js/auth.js`
- `public_html/assets/js/dashboard.js`

Change `const API_BASE_URL = 'backend/api';` to match your hosting structure.

### Step 6: Test the Application

1. Visit your domain to see the homepage
2. Test user registration and login
3. Test admin login with default credentials: `admin` / `admin123`
4. Verify all forms are working properly

## 🔐 Default Login Credentials

- **Admin**: `admin` / `admin123`
- **Users**: Can register through the user portal
- **DSA Partners**: Can apply through the homepage form

## 📱 Features

### Frontend (Vanilla HTML/CSS/JS)
- ✅ Responsive design with Tailwind CSS
- ✅ Loan application forms
- ✅ EMI calculator
- ✅ Contact forms
- ✅ DSA partnership application
- ✅ User authentication system
- ✅ Role-based dashboards

### Backend (PHP with MySQL)
- ✅ RESTful API endpoints
- ✅ Session-based authentication
- ✅ Role-based access control (Admin, DSA, User)
- ✅ Secure password hashing
- ✅ Input validation and sanitization
- ✅ CORS support for API calls

### Database (MySQL)
- ✅ User management with roles
- ✅ Loan applications tracking
- ✅ DSA partner management
- ✅ Lead management system
- ✅ Contact queries storage

## 🛠️ Customization

### Adding New Loan Types
1. Update the enum values in `database.sql`
2. Add options to the frontend forms
3. Update validation in PHP files

### Styling Changes
- Edit `public_html/assets/css/style.css`
- Tailwind classes can be customized in HTML files

### Adding New Features
1. Create new PHP endpoints in the `backend/` directory
2. Add corresponding frontend JavaScript functions
3. Update the database schema if needed

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check database credentials in `backend/config/database.php`
   - Ensure database exists and is accessible

2. **API Calls Failing**
   - Check `.htaccess` file is uploaded
   - Verify URL rewriting is enabled
   - Check CORS headers

3. **Session Issues**
   - Ensure PHP sessions are enabled
   - Check session directory permissions

4. **Form Submissions Not Working**
   - Verify JavaScript files are loading
   - Check browser console for errors
   - Ensure API endpoints are accessible

### Performance Optimization

1. **Enable Gzip Compression** in your hosting control panel
2. **Optimize Images** before uploading
3. **Use CDN** for external libraries if needed
4. **Enable Browser Caching** through .htaccess

## 📞 Support

For technical support or customization requests, contact the development team.

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This is a production-ready application converted from a TypeScript/Node.js stack to PHP for shared hosting compatibility. All security best practices have been implemented including input validation, password hashing, and SQL injection prevention.