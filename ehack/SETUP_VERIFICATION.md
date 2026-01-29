# Backend Integration Verification Checklist

## Pre-Startup Checklist

Before running the backend, verify these are in place:

### ✓ Files Created
- [ ] `backend/server.js` (368 lines)
- [ ] `backend/package.json` (with dependencies)
- [ ] `backend/.env.example` (environment template)
- [ ] `backend/BACKEND_SETUP.md` (setup guide)
- [ ] `js/api.js` (API handler - 400+ lines)
- [ ] `FRONTEND_BACKEND_INTEGRATION.md` (this integration guide)
- [ ] `START_BACKEND.bat` (quick startup script)

### ✓ Frontend Updates
- [ ] `index.html` - includes `js/api.js`
- [ ] `about.html` - includes `js/api.js`
- [ ] `courses.html` - includes `js/api.js`
- [ ] `contact.html` - includes `js/api.js`
- [ ] `signin.html` - includes `js/api.js` and form handlers
- [ ] `dashboard.html` - includes `js/api.js`
- [ ] `learning-paths.html` - includes `js/api.js`
- [ ] `blog.html` - includes `js/api.js`

## Startup Instructions

### Option 1: Automatic Setup (Recommended)
1. Double-click `START_BACKEND.bat`
2. Script will:
   - Check Node.js installation
   - Install npm dependencies
   - Create .env file if missing
   - Open .env for editing
   - Start the backend server
3. Follow prompts to configure .env variables

### Option 2: Manual Setup
```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env from template
cp .env.example .env

# Edit .env with your credentials
# Windows: notepad .env
# Mac/Linux: nano .env

# Start backend
npm start
```

## Configuration Step-by-Step

### 1. Gmail Configuration (Email Sending)

**Why**: Contact form needs to send emails

**Steps**:
1. Go to https://myaccount.google.com
2. Click "Security" in left sidebar
3. Enable "2-Step Verification" if not done
4. Scroll to "App passwords"
5. Select "Mail" and "Windows Computer"
6. Google generates a 16-character password
7. Copy this to `.env` as `EMAIL_PASSWORD`

**Test**: After starting backend, submit contact form and check if email received

### 2. reCAPTCHA Configuration (Bot Protection)

**Why**: Sign-up/contact forms need reCAPTCHA verification

**Steps**:
1. Go to https://www.google.com/recaptcha/admin
2. Sign in with your Google account
3. Click "+" to create new site
4. Enter:
   - Name: "Ehacking School"
   - reCAPTCHA type: "reCAPTCHA v3"
   - Domains: "localhost"
5. Accept terms and submit
6. Copy keys to `.env`:
   - `RECAPTCHA_SITE_KEY` → Sites Key
   - `RECAPTCHA_SECRET_KEY` → Secret Key

**Test**: Form submissions should show reCAPTCHA widget

### 3. JWT Secret (Authentication)

**Why**: Sign-up/sign-in need secure tokens

**Steps**:
1. Generate a random string (any length, any characters)
2. Copy to `.env` as `JWT_SECRET`
3. Example: `jwt-secret-key-12345-xyz`

**Test**: After sign-up, check if user can sign in

### 4. Complete .env File

Your final `.env` should look like:

```
# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-random-secret-key-here

# Email Configuration
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
ADMIN_EMAIL=yourgmail@gmail.com

# reCAPTCHA Configuration
RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
RECAPTCHA_SECRET_KEY=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe

# Database Configuration
DATABASE_PATH=./database.db
```

## Verification Tests

### ✓ Backend Running
```
Expected: Server starts at http://localhost:3000
Action: Open http://localhost:3000/api/health in browser
Result: {"status":"ok"} displayed
```

### ✓ Sign-Up Working
```
1. Open http://localhost/signin.html (or your frontend)
2. Click "Sign Up" tab
3. Fill form with:
   - First Name: Test
   - Last Name: User
   - Email: test@gmail.com
   - Password: Test123!
   - Check terms checkbox
   - Complete reCAPTCHA
4. Click "Sign Up"
Expected: "Account created successfully!" message
Database: New user created in database.db
Email: Welcome email sent to test@gmail.com
```

### ✓ Sign-In Working
```
1. Click "Sign In" tab
2. Enter:
   - Email: test@gmail.com
   - Password: Test123!
   - Complete reCAPTCHA
3. Click "Sign In"
Expected: Redirected to dashboard.html
LocalStorage: auth_token and user data saved
```

### ✓ Contact Form Working
```
1. Open contact.html
2. Fill form with:
   - Name: Test User
   - Email: test@gmail.com
   - Subject: Test Message
   - Message: This is a test
   - Complete reCAPTCHA
3. Click "Send Message"
Expected: "Message sent successfully" confirmation
Database: Entry saved to contacts table
Email: 
  - Confirmation sent to test@gmail.com
  - Alert sent to ADMIN_EMAIL
```

### ✓ Dashboard Working
```
1. Sign in first (see sign-in test above)
2. You're redirected to dashboard.html
3. Should see:
   - User's courses list
   - Progress statistics
   - Enroll button for new courses
Expected: Dashboard loads user's courses and stats
```

## Common Issues & Solutions

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
Solution:
- Close other applications using port 3000
- Or change PORT in .env to 3001, restart
- Check with: netstat -ano | findstr :3000
```

### Email Not Sending
```
Error: SMTP error in server console
Solutions:
- Verify EMAIL_USER is correct Gmail address
- Verify EMAIL_PASSWORD is App Password (not regular password)
- Check 2FA is enabled on Gmail
- Ensure Less secure apps is disabled (use App Password instead)
```

### Sign-In Returns 401
```
Error: Invalid email or password
Solutions:
- Verify email/password match what you signed up with
- Check database exists: backend/database.db
- Check user was created: run `sqlite3 database.db "SELECT * FROM users;"`
- Verify password is hashed (not plaintext)
```

### CORS Error
```
Error: "Access to XMLHttpRequest blocked by CORS policy"
Solutions:
- Backend CORS is already enabled
- Check frontend API_URL in js/api.js matches backend URL
- Ensure backend is running on correct port
```

### reCAPTCHA Not Working
```
Error: reCAPTCHA widget not showing
Solutions:
- Verify RECAPTCHA_SITE_KEY is correct in signin.html/contact.html
- Check Google reCAPTCHA admin console
- Ensure localhost is in allowed domains
```

## Database Inspection

To manually check database:

```bash
# Navigate to backend folder
cd backend

# Open database with sqlite3
sqlite3 database.db

# View users table
SELECT * FROM users;

# View contacts table
SELECT * FROM contacts;

# View user courses
SELECT * FROM user_courses;

# Exit
.quit
```

## Backend Logs

While backend is running, you'll see logs like:

```
Server running on http://localhost:3000
✓ Database initialized
✓ API routes configured
POST /api/auth/signup - 200 OK
POST /api/auth/signin - 200 OK
POST /api/contact - 200 OK
GET /api/dashboard/courses - 200 OK
```

## Next Steps After Setup

1. ✅ Backend running
2. ✅ Frontend connected
3. ✅ .env configured
4. 📋 Test all features (see Verification Tests above)
5. 📋 Deploy to production (Heroku/Railway/DigitalOcean)
6. 📋 Update API_URL in js/api.js to production URL
7. 📋 Deploy frontend to hosting

## Support Files

- `backend/BACKEND_SETUP.md` - Detailed backend guide
- `backend/server.js` - Backend code (read for understanding)
- `js/api.js` - Frontend API handler (read for understanding)
- This file - Setup verification guide

## Need Help?

Check these in order:
1. Browser console (F12 → Console tab) for errors
2. Backend console for error messages
3. backend/BACKEND_SETUP.md troubleshooting section
4. backend/server.js comments for implementation details
5. js/api.js comments for frontend handler details

---

**Status**: All files created. Ready for configuration and testing!
