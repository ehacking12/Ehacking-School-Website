# Backend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
```bash
# Copy the example file
cp .env.example .env

# Edit .env and add your values:
# - Gmail credentials
# - JWT secret
# - reCAPTCHA keys
```

### 3. Start Backend Server
```bash
npm start      # Production mode
npm run dev    # Development mode (with auto-reload)
```

Server will run at: **http://localhost:3000**

---

## Environment Setup

### Gmail Configuration (for Email Sending)

1. Enable 2-Factor Authentication on your Gmail account
2. Generate App Password:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Copy the generated password
3. Add to `.env`:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
   ```

### reCAPTCHA Setup

1. Go to https://www.google.com/recaptcha/admin
2. Create a new site with reCAPTCHA v3
3. Get your Site Key and Secret Key
4. Update `.env` with both keys

### JWT Secret

```bash
# Generate a secure random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## API Endpoints

### Authentication

**POST /api/auth/signup**
- Body: `{ email, password, first_name, last_name, recaptcha_token }`
- Returns: `{ success, token, user }`

**POST /api/auth/signin**
- Body: `{ email, password, recaptcha_token }`
- Returns: `{ success, token, user }`

### Contact Form

**POST /api/contact**
- Body: `{ name, email, phone, subject, category, message, recaptcha_token }`
- Returns: `{ success, message }`
- Sends confirmation email to user + admin notification

### Dashboard

**GET /api/dashboard/courses**
- Header: `Authorization: Bearer {token}`
- Returns: `{ success, courses: [] }`

**POST /api/dashboard/enroll**
- Header: `Authorization: Bearer {token}`
- Body: `{ course_name }`
- Returns: `{ success, course_id }`

**PUT /api/dashboard/progress/:courseId**
- Header: `Authorization: Bearer {token}`
- Body: `{ progress }` (0-100)
- Returns: `{ success, progress }`

**GET /api/dashboard/stats**
- Header: `Authorization: Bearer {token}`
- Returns: `{ success, stats: { total_courses, total_progress, completed_courses } }`

### Health Check

**GET /api/health**
- Returns: `{ success, message }`

---

## Database Schema

### Users Table
- `id`: Primary key
- `first_name`, `last_name`: User name
- `email`: Unique email
- `password`: Hashed password
- `created_at`, `updated_at`: Timestamps

### Contacts Table
- `id`: Primary key
- `name`, `email`, `phone`: Contact info
- `subject`, `category`, `message`: Message details
- `status`: 'new', 'replied', etc.
- `created_at`: Timestamp

### User Courses Table
- `id`: Primary key
- `user_id`: Foreign key to users
- `course_name`: Course name
- `progress`: 0-100
- `status`: 'enrolled', 'completed'
- `enrolled_at`, `completed_at`: Timestamps

---

## Deployment

### Option 1: Heroku (Free Tier)

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set EMAIL_USER=your_email
# ... add other variables

# Deploy
git push heroku main
```

### Option 2: Railway.app

```bash
# Connect your GitHub repo
# Railway will auto-deploy on push
```

### Option 3: DigitalOcean

```bash
# Create Ubuntu droplet
# SSH into server
# Clone repo and run with PM2
npm install -g pm2
pm2 start server.js
```

---

## Testing

```bash
# Test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","password":"TestPass123!","first_name":"John","last_name":"Doe"}'

# Test contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@gmail.com","subject":"Test","message":"Test message"}'

# Test health
curl http://localhost:3000/api/health
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process
taskkill /PID {PID} /F
```

### Database Locked
```bash
# Delete database.db to reset
rm database.db
```

### Email Not Sending
- Verify Gmail App Password is correct
- Enable "Less secure app access"
- Check .env has correct values

---

## Security Notes

- ✅ Passwords are hashed with bcrypt
- ✅ JWT tokens for authentication
- ✅ Input validation with express-validator
- ✅ CORS enabled for frontend
- ⚠️ Store .env file securely (never commit to git)
- ⚠️ Use HTTPS in production
- ⚠️ Implement rate limiting for production

---
