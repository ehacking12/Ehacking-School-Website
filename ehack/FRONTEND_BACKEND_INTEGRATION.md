# Frontend-Backend Integration Guide

## Overview
Your frontend website is now connected to a Node.js/Express backend that handles:
- User authentication (sign-up, sign-in)
- Contact form submissions with email notifications
- Course enrollment and progress tracking
- User dashboard with statistics

## What's New

### Frontend Changes
1. **New API Handler File**: `js/api.js`
   - Handles all communication with backend
   - Manages authentication tokens
   - Provides form handling functions

2. **Updated HTML Files**
   - All pages now load `api.js`
   - Forms are configured to send data to backend
   - Sign-in/sign-up forms now handle real authentication

### Backend Structure (Created in `/backend`)
```
backend/
├── server.js              # Express server (368 lines)
├── package.json           # Dependencies
├── .env.example          # Environment template
├── BACKEND_SETUP.md      # Detailed setup guide
└── database.db           # Auto-created SQLite database
```

## Quick Start

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Configure Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your actual values:
# - JWT_SECRET: Generate a random string
# - EMAIL_USER: Your Gmail address
# - EMAIL_PASSWORD: Gmail App Password (see BACKEND_SETUP.md)
# - ADMIN_EMAIL: Where contact forms should go
# - RECAPTCHA_SECRET_KEY: From Google reCAPTCHA console
```

### Step 3: Start the Backend
```bash
npm start
```
Backend will run at `http://localhost:3000`

### Step 4: Test the Connection
Open your website in browser and try:
- Sign up: Click "Sign Up" tab on signin.html
- Sign in: Use your created account
- Contact form: Fill out and submit on contact.html
- Dashboard: View your courses and progress

## File Descriptions

### `js/api.js` - API Handler
Functions available:
- `handleSignUp(event)` - Process sign-up form
- `handleSignIn(event)` - Process sign-in form
- `handleContactForm(event)` - Process contact submissions
- `loadUserCourses()` - Fetch user's courses
- `loadDashboardStats()` - Get user statistics
- `enrollCourse(courseName)` - Enroll in a course
- `updateCourseProgress(courseId, progress)` - Update progress
- `logout()` - Sign out user
- `checkAuthStatus()` - Check if user is logged in

### `backend/server.js` - REST API
Endpoints:
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/signin` - Login with email/password
- `POST /api/contact` - Submit contact form
- `GET /api/dashboard/courses` - Get enrolled courses
- `POST /api/dashboard/enroll` - Enroll in course
- `PUT /api/dashboard/progress/:courseId` - Update progress
- `GET /api/dashboard/stats` - Get user stats
- `GET /api/health` - Health check

## Authentication Flow

1. **Sign Up**
   - User enters first name, last name, email, password
   - Password is hashed with bcryptjs
   - User data saved to database
   - Welcome email sent to user
   - JWT token returned and saved in localStorage

2. **Sign In**
   - User enters email and password
   - Password verified against stored hash
   - JWT token generated and returned
   - Token saved in localStorage
   - User redirected to dashboard

3. **Protected Routes**
   - Dashboard requires valid JWT token
   - Each API call includes token in Authorization header
   - Backend verifies token before returning data

## Data Storage

### Database Tables

**users**
- id (primary key)
- first_name, last_name
- email (unique)
- password (bcrypt hashed)
- created_at, updated_at

**contacts**
- id (primary key)
- name, email, phone
- subject, category
- message
- status (pending/resolved)
- created_at

**user_courses**
- id (primary key)
- user_id (foreign key)
- course_name
- progress (0-100%)
- status (enrolled/in-progress/completed)
- created_at, updated_at

## Security Features

✅ Password hashing with bcryptjs
✅ JWT authentication tokens
✅ reCAPTCHA bot verification
✅ Input validation and sanitization
✅ CORS enabled for frontend requests
✅ Unique email constraints
✅ Environment variables for secrets
✅ Error messages don't expose sensitive info

## Testing with curl

```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","last_name":"Doe","email":"john@gmail.com","password":"password123","recaptcha_token":"token"}'

# Sign in
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"john@gmail.com","password":"password123","recaptcha_token":"token"}'

# Get courses (requires Bearer token)
curl -X GET http://localhost:3000/api/dashboard/courses \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Troubleshooting

### Backend won't start
- Check if port 3000 is already in use
- Ensure Node.js is installed: `node --version`
- Check .env file has all required variables

### Email not sending
- Verify Gmail address in .env
- Generate App Password: https://myaccount.google.com/apppasswords
- Ensure 2FA is enabled on Gmail account

### Sign in not working
- Check that backend is running (http://localhost:3000/api/health)
- Verify user was created in database
- Check browser console for error messages

### Course progress not saving
- Ensure user is logged in (check localStorage for auth_token)
- Verify JWT token is valid
- Check backend console for validation errors

## Next Steps

1. ✅ Backend is ready
2. ✅ Frontend connected to API
3. 📋 Configure .env file with real credentials
4. 📋 Deploy backend to hosting (Heroku/Railway/DigitalOcean)
5. 📋 Update frontend API_URL to point to production backend
6. 📋 Deploy frontend to hosting (GitHub Pages/Vercel/Netlify)

## Email Configuration

To enable email sending:

1. Go to https://myaccount.google.com/apppasswords
2. Select Mail > Windows Computer
3. Copy the generated 16-character password
4. Paste into .env as `EMAIL_PASSWORD`
5. Restart backend: `npm start`

## Additional Resources

- See `backend/BACKEND_SETUP.md` for detailed configuration
- See `backend/server.js` for API implementation details
- Check browser console for error messages during testing
- Check server logs for backend errors

---

**Status**: ✅ Backend complete, frontend integrated, ready for .env configuration and testing
