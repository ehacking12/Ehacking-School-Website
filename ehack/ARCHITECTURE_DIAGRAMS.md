# System Architecture & Data Flow Diagrams

## Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER'S WEB BROWSER                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────┐ │
│  │   index.html    │  │  contact.html   │  │  signin.html     │ │
│  │   about.html    │  │  courses.html   │  │  dashboard.html  │ │
│  │   blog.html     │  │  learning...html│  │  ...             │ │
│  └─────────────────┘  └─────────────────┘  └──────────────────┘ │
│           │                    │                      │           │
│           └────────┬───────────┴──────────┬───────────┘           │
│                    │                      │                       │
│         ┌──────────▼──────────┐   ┌──────▼──────────┐            │
│         │   js/script.js      │   │   js/api.js     │            │
│         │   (UI/animations)   │   │  (NEW - API     │            │
│         │                     │   │   communication)│            │
│         └─────────┬───────────┘   └────────┬────────┘            │
│                   │                        │                     │
│                   └────────────┬───────────┘                     │
│                                │                                 │
│          Google reCAPTCHA ◄────┤                                │
│          (Bot Protection)      │                                │
│                                │                                │
│                         HTTP/HTTPS                              │
│                          (JSON)                                 │
│                    (Port 3000)                                  │
│                                │                                │
└────────────────────────────────┼────────────────────────────────┘
                                 │
                    ┌────────────▼──────────┐
                    │  BACKEND SERVER       │
                    │  (Node.js/Express)    │
                    │  (localhost:3000)     │
                    └────────────┬──────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        │                        │                        │
   ┌────▼────┐            ┌──────▼──────┐         ┌──────▼──────┐
   │          │            │             │         │             │
   │ Routes/  │            │  Validators │         │  reCAPTCHA  │
   │ Handlers │            │             │         │ Verification│
   │          │            │             │         │             │
   └────┬─────┘            └──────┬──────┘         └──────┬──────┘
        │                         │                       │
        │      ┌──────────────────┼───────────────────┐   │
        │      │                  │                   │   │
        │      │                  │                   │   │
        │  ┌───▼──────────────────▼─────────────────┐│   │
        │  │                                        ││   │
        │  │    JWT Authentication                  ││   │
        │  │    (Generate/Verify Tokens)            ││   │
        │  │                                        ││   │
        │  └───────┬──────────────────┬─────────────┘│   │
        │          │                  │              │   │
        │  ┌───────▼──────┐  ┌────────▼──────┐     │   │
        │  │   Nodemailer │  │   bcryptjs    │     │   │
        │  │   (Email)    │  │ (Password     │     │   │
        │  │              │  │  Hashing)     │     │   │
        │  └───────┬───────┘  └────────┬──────┘     │   │
        │          │                   │            │   │
        │  ┌───────▼───────────────────▼──────┐     │   │
        │  │      SQLite Database              │     │   │
        │  │      (database.db)                │     │   │
        │  │                                   │     │   │
        │  │  Tables:                          │     │   │
        │  │  - users (auth)                   │     │   │
        │  │  - contacts (messages)            │     │   │
        │  │  - user_courses (progress)        │     │   │
        │  │                                   │     │   │
        │  └───────────────────────────────────┘     │   │
        │                                            │   │
        └────────────────────────────────────────────┘   │
                                                         │
                                    ┌────────────────────┘
                                    │
                                Gmail SMTP
                            (email-user@gmail.com)


Legend:
━━━━━→ HTTP/HTTPS Request
←━━━━━ JSON Response
═══════► Process Flow
```

---

## Sign-Up Flow Diagram

```
User Fills Sign-Up Form
         │
         ▼
┌────────────────────────┐
│ Form Validation        │ ← Checks: all fields filled, passwords match, terms checked
│ (Frontend)             │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│ reCAPTCHA Check        │ ← Verifies user is not a bot
│ (Google)               │
└────────┬───────────────┘
         │
         ▼
POST /api/auth/signup
│ {
│   first_name: "John",
│   last_name: "Doe",
│   email: "john@gmail.com",
│   password: "password123",
│   recaptcha_token: "token..."
│ }
│
         ▼
┌────────────────────────────────────┐
│ Backend Validation                 │ ← Validates email format, password strength
│ - Email format check               │
│ - Password length check            │
│ - Unique email check               │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ Password Hashing                   │ ← Uses bcryptjs to hash password
│ - Generate salt (10 rounds)        │   Never stores plaintext password
│ - Hash password                    │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ Save to Database                   │ ← Inserts user into users table
│ INSERT INTO users ...              │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ Generate JWT Token                 │ ← Creates auth token (7-day expiry)
│ - Sign with JWT_SECRET             │   {userId, email, iat, exp}
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ Send Welcome Email                 │ ← Sends via Gmail SMTP
│ To: john@gmail.com                 │
│ Subject: Welcome to Ehacking...    │
└────────┬───────────────────────────┘
         │
         ▼
Return Response
│ {
│   token: "eyJhbGc...",
│   user: {id: 1, first_name: "John", email: "john@gmail.com"}
│ }
│
         ▼
┌────────────────────────────────────┐
│ Frontend Handler                   │
│ - Save token to localStorage       │
│ - Save user to localStorage        │
│ - Redirect to dashboard.html       │
└────────────────────────────────────┘
         │
         ▼
    User Logged In ✓
```

---

## Sign-In Flow Diagram

```
User Enters Credentials
│ email: "john@gmail.com"
│ password: "password123"
│
         ▼
┌────────────────────────┐
│ Form Validation        │ ← Checks: email not empty, password not empty
│ (Frontend)             │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────┐
│ reCAPTCHA Check        │ ← Verifies user is not a bot
│ (Google)               │
└────────┬───────────────┘
         │
         ▼
POST /api/auth/signin
│ {
│   email: "john@gmail.com",
│   password: "password123",
│   recaptcha_token: "token..."
│ }
│
         ▼
┌────────────────────────────────────┐
│ Find User in Database              │ ← SELECT * FROM users WHERE email=...
│ SELECT FROM users                  │
└────────┬───────────────────────────┘
         │
         ├─ User Not Found ─────────────► Error: Invalid credentials
         │
         ▼ User Found
┌────────────────────────────────────┐
│ Verify Password                    │ ← Compare: bcrypt.compare(input, stored_hash)
│ - Use bcrypt to compare            │   input: "password123"
│                                    │   stored_hash: "$2b$10$..."
└────────┬───────────────────────────┘
         │
         ├─ Password Wrong ───────────► Error: Invalid credentials
         │
         ▼ Password Correct
┌────────────────────────────────────┐
│ Generate JWT Token                 │ ← Creates auth token (7-day expiry)
│ - Sign with JWT_SECRET             │
└────────┬───────────────────────────┘
         │
         ▼
Return Response
│ {
│   token: "eyJhbGc...",
│   user: {id: 1, first_name: "John", email: "john@gmail.com"}
│ }
│
         ▼
┌────────────────────────────────────┐
│ Frontend Handler                   │
│ - Save token to localStorage       │
│ - Save user to localStorage        │
│ - Redirect to dashboard.html       │
└────────────────────────────────────┘
         │
         ▼
    User Logged In ✓
```

---

## Contact Form Flow Diagram

```
User Fills Contact Form
│ name, email, phone, subject, message
│
         ▼
┌────────────────────────────────────┐
│ Form Validation                    │ ← Checks: required fields filled
│ (Frontend)                         │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────┐
│ reCAPTCHA Check        │ ← Verifies user is not a bot
│ (Google)               │
└────────┬───────────────┘
         │
         ▼
POST /api/contact
│ {
│   name: "John Doe",
│   email: "john@gmail.com",
│   phone: "+250123456",
│   subject: "Course inquiry",
│   category: "course",
│   message: "I want to know...",
│   recaptcha_token: "token..."
│ }
│
         ▼
┌────────────────────────────────────┐
│ Validate Input                     │ ← Email format, required fields
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ Save to Database                   │ ← INSERT INTO contacts
│                                    │
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ Send Confirmation Email            │ ← To: john@gmail.com
│ To User                            │   "We received your message..."
└────────┬───────────────────────────┘
         │
         ▼
┌────────────────────────────────────┐
│ Send Alert Email                   │ ← To: ADMIN_EMAIL
│ To Admin                           │   "New contact from john@gmail.com"
└────────┬───────────────────────────┘
         │
         ▼
Return Response
│ {
│   message: "Message sent successfully",
│   id: 123
│ }
│
         ▼
┌────────────────────────────────────┐
│ Frontend Handler                   │
│ - Clear form                       │
│ - Show success message             │
└────────────────────────────────────┘
         │
         ▼
  Message Sent ✓ & Saved to DB
```

---

## Dashboard Data Flow Diagram

```
User Signs In
         │
         ▼
localStorage[auth_token] = "eyJhbGc..."
         │
         ▼
Navigate to dashboard.html
         │
         ▼
JavaScript calls: loadUserCourses()
                 loadDashboardStats()
         │
         ▼
┌────────────────────────────────────┐
│ GET /api/dashboard/courses         │ ← Headers: Authorization: Bearer token
│ - Verify JWT token                 │
│ - Get user_id from token           │
│ - SELECT * FROM user_courses       │
│   WHERE user_id = ?                │
└────────┬───────────────────────────┘
         │
         ▼
Return Courses Array
│ {
│   courses: [
│     {id: 1, course_name: "Network Security", progress: 45, status: "in-progress"},
│     {id: 2, course_name: "Web Security", progress: 0, status: "enrolled"}
│   ]
│ }
│
         ▼
┌────────────────────────────────────┐
│ Display Courses on Dashboard       │ ← Show progress bars, enrollment status
│ - Render course cards              │
│ - Show progress percentage         │
└────────┬───────────────────────────┘
         │
         ▼
User Can:
  1. Update Progress ──► PUT /api/dashboard/progress/1 {progress: 50}
  2. Enroll New Course ─► POST /api/dashboard/enroll {course_name: "..."}
  3. View Stats ────────► GET /api/dashboard/stats
```

---

## Authentication Token Flow (JWT)

```
┌─────────────────────────────────────────────────────────┐
│ JWT Token Structure                                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.               │
│  [HEADER: Algorithm = HS256, Type = JWT]              │
│  │                                                     │
│  eyJpZCI6MSwibGFzdE5hbWUiOiJEb2UifQ.                 │
│  [PAYLOAD: {id: 1, lastName: "Doe"}]                  │
│  │                                                     │
│  SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c         │
│  [SIGNATURE: HMAC256(header+payload, JWT_SECRET)]     │
│                                                         │
└─────────────────────────────────────────────────────────┘
         │
         ▼ Token Generated at Sign-Up/Sign-In
┌──────────────────────────────┐
│ Save in localStorage         │
│ localStorage[auth_token]     │
└──────────────┬───────────────┘
               │
         ▼ Used for Each Protected Request
┌────────────────────────────────────┐
│ GET /api/dashboard/courses         │
│ Headers: {                         │
│   Authorization: "Bearer eyJhbGc..."│
│ }                                  │
└──────────────┬─────────────────────┘
               │
         ▼ Backend Verification
┌────────────────────────────────────┐
│ Extract token from header          │
│ Verify signature with JWT_SECRET   │
│ Check if expired (7 days)          │
│ Extract user_id from payload       │
└──────────────┬─────────────────────┘
               │
         ├─ Invalid ────► Error 401: Unauthorized
         │
         ▼ Valid
  Return data filtered by user_id
```

---

## Database Relationships Diagram

```
┌──────────────────────────────┐
│         USERS                │
├──────────────────────────────┤
│ id (PK)                      │
│ first_name                   │
│ last_name                    │
│ email (UNIQUE)               │ ← Each user has unique email
│ password (hashed)            │   Uses bcryptjs
│ created_at                   │
│ updated_at                   │
└──────────────────────────────┘
         │
         │ One user can have multiple courses
         │ (One-to-Many relationship)
         │
         ▼
┌──────────────────────────────┐
│      USER_COURSES            │
├──────────────────────────────┤
│ id (PK)                      │
│ user_id (FK → users.id)      │ ← Links to user
│ course_name                  │
│ progress (0-100)             │
│ status                       │
│ created_at                   │
│ updated_at                   │
└──────────────────────────────┘

┌──────────────────────────────┐
│       CONTACTS               │
├──────────────────────────────┤
│ id (PK)                      │
│ name                         │
│ email                        │ ← Can be from any visitor
│ phone                        │   (not required to be user)
│ subject                      │
│ category                     │
│ message                      │
│ status (pending/resolved)    │
│ created_at                   │
└──────────────────────────────┘
```

---

## Error Handling Flow

```
Request Received
         │
         ▼
┌────────────────────────────┐
│ Input Validation           │
└────────┬───────────────────┘
         │
         ├─ Invalid ──────► Return 400 (Bad Request)
         │                 {error: "Field X is required"}
         │
         ▼ Valid
┌────────────────────────────┐
│ Database Operation         │
└────────┬───────────────────┘
         │
         ├─ Duplicate Email ──► Return 409 (Conflict)
         │                      {error: "Email already exists"}
         │
         ├─ User Not Found ───► Return 401 (Unauthorized)
         │                      {error: "Invalid credentials"}
         │
         ├─ Invalid Token ────► Return 401 (Unauthorized)
         │                      {error: "Invalid or expired token"}
         │
         ├─ DB Error ────────► Return 500 (Server Error)
         │                      {error: "Database error"}
         │
         ▼ Success
    Return 200 + Data
    {status: "ok", data: {...}}
```

---

## Security Flow Diagram

```
                    SECURITY LAYERS
┌─────────────────────────────────────────────────────────┐
│                                                         │
│  1. CLIENT-SIDE                                        │
│     - Form validation                                  │
│     - reCAPTCHA verification                           │
│     - HTTPS only (recommended)                         │
│                                                         │
│  2. reCAPTCHA (GOOGLE)                                 │
│     - Bot detection                                    │
│     - Spam prevention                                  │
│                                                         │
│  3. SERVER-SIDE VALIDATION                             │
│     - Email format check                               │
│     - Password strength                                │
│     - Required fields                                  │
│     - SQL injection prevention                         │
│                                                         │
│  4. AUTHENTICATION                                     │
│     - Password hashing (bcryptjs)                      │
│     - JWT tokens (7-day expiry)                        │
│     - Token verification on protected routes           │
│                                                         │
│  5. DATABASE SECURITY                                  │
│     - Parameterized queries                            │
│     - Unique constraints                               │
│     - Foreign key relationships                        │
│                                                         │
│  6. EMAIL VERIFICATION                                 │
│     - Confirmation emails sent                         │
│     - Admin alerts on new submissions                  │
│                                                         │
│  7. CORS                                               │
│     - Only frontend domain allowed                     │
│     - Prevents unauthorized API calls                  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture (After Going Live)

```
                        INTERNET
                           │
                           ▼
              ┌────────────────────────┐
              │   Your Domain Name     │
              │ (ehackingschool.com)   │
              └────────────┬───────────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
           ▼               ▼               ▼
      ┌─────────┐    ┌──────────┐    ┌──────────┐
      │ Frontend│    │ Backend  │    │ Database │
      │(Static  │    │(Express) │    │(SQLite)  │
      │HTML/CSS)│    │ Node.js  │    │          │
      └─────────┘    └──────────┘    └──────────┘
           │               │               │
      GitHub Pages/   Heroku/Railway/   Included in
      Vercel/Netlify  DigitalOcean/AWS  Backend
```

---

## Timeline: Request to Response

```
User Action (e.g., Sign In)
├─ 0ms ────────► Click Submit button
├─ 50ms ───────► Form validation (frontend)
├─ 100ms ──────► reCAPTCHA verification
├─ 150ms ──────► HTTP POST to backend
├─ 200ms ──────► Backend receives request
├─ 220ms ──────► Input validation (backend)
├─ 240ms ──────► Database query: SELECT user by email
├─ 280ms ──────► Password comparison with bcrypt
├─ 300ms ──────► JWT token generation
├─ 320ms ──────► JSON response sent back
├─ 350ms ──────► Frontend receives response
├─ 380ms ──────► localStorage updated with token
├─ 400ms ──────► Redirect to dashboard
└─ 500ms ──────► User sees dashboard ✓

Total Time: ~350-500ms (depending on network)
```

---

## File Interaction Diagram

```
User's Actions
    │
    ├─ Opens Website ──────────► index.html ──► script.js, api.js, main.css
    │
    ├─ Clicks Sign Up ────────► signin.html ──► form listeners
    │   │
    │   └─► handleSignUp() ────► POST /api/auth/signup
    │        (in api.js)              │
    │                                 ▼
    │                          server.js:
    │                          ├─ Validates input
    │                          ├─ Hashes password (bcryptjs)
    │                          ├─ Saves to database.db
    │                          ├─ Generates JWT token
    │                          ├─ Sends welcome email
    │                          └─ Returns {token, user}
    │
    ├─ Tries to Sign In ─────► signin.html ──► handleSignIn()
    │   │                                      (in api.js)
    │   └─► Sends credentials ─► /api/auth/signin ──► Verifies password
    │        to backend                              Returns JWT token
    │
    ├─ Submits Contact ──────► contact.html ──► handleContactForm()
    │   │                                       (in api.js)
    │   └─► Sends form ───────► /api/contact ──► Saves to DB
    │        to backend                         Sends 2 emails
    │
    └─ Views Dashboard ──────► dashboard.html ──► loadUserCourses()
                                                   loadDashboardStats()
                                                   (in api.js)
                                                   │
                                                   ├─ GET /api/dashboard/courses
                                                   │  (with JWT token)
                                                   │
                                                   └─ GET /api/dashboard/stats
                                                      (with JWT token)
```

---

This architecture ensures:
- ✅ **Security**: Passwords hashed, tokens verified, inputs validated
- ✅ **Scalability**: Stateless JWT, can scale horizontally
- ✅ **Reliability**: Error handling, database transactions
- ✅ **Performance**: Efficient queries, minimal data transfer
- ✅ **Maintainability**: Clear separation of concerns

For questions about any diagram, refer to the relevant guide:
- `BACKEND_SETUP.md` - Backend details
- `FRONTEND_BACKEND_INTEGRATION.md` - Integration
- `SETUP_VERIFICATION.md` - Setup & testing
