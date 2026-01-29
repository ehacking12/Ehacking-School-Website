require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const axios = require('axios');
const { body, validationResult } = require('express-validator');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Database
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error('DB Error:', err.message);
  else console.log('✅ Connected to SQLite database');
});

// Create tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Contact form submissions table
  db.run(`CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    category TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // User courses/progress table
  db.run(`CREATE TABLE IF NOT EXISTS user_courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    course_name TEXT NOT NULL,
    progress INTEGER DEFAULT 0,
    status TEXT DEFAULT 'enrolled',
    enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    FOREIGN KEY(user_id) REFERENCES users(id)
  )`);

  console.log('✅ Database tables initialized');
});

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Helper: Send email
const sendEmail = (to, subject, html) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    }, (err, info) => {
      if (err) reject(err);
      else resolve(info);
    });
  });
};

// Helper: Generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Helper: Verify reCAPTCHA
const verifyRecaptcha = async (token) => {
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify`,
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token
        }
      }
    );
    return response.data.success && response.data.score > 0.5;
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return false;
  }
};

// ============ AUTH ROUTES ============

// Sign Up
app.post('/api/auth/signup', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('first_name').notEmpty(),
  body('last_name').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password, first_name, last_name, recaptcha_token } = req.body;

    // Verify reCAPTCHA
    if (recaptcha_token) {
      const isValidCaptcha = await verifyRecaptcha(recaptcha_token);
      if (!isValidCaptcha) {
        return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed' });
      }
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Insert user
    db.run(
      'INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
      [first_name, last_name, email, hashedPassword],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ success: false, message: 'Email already registered' });
          }
          return res.status(500).json({ success: false, message: 'Database error' });
        }

        const user = { id: this.lastID, email, first_name, last_name };
        const token = generateToken(user);

        // Send welcome email
        sendEmail(
          email,
          '✅ Welcome to Ehacking School!',
          `<h2>Welcome ${first_name}!</h2><p>Your account has been created successfully. Start learning today!</p>`
        ).catch(err => console.error('Email send error:', err));

        res.json({
          success: true,
          message: 'Account created successfully',
          token,
          user
        });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Sign In
app.post('/api/auth/signin', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password, recaptcha_token } = req.body;

    // Verify reCAPTCHA
    if (recaptcha_token) {
      const isValidCaptcha = await verifyRecaptcha(recaptcha_token);
      if (!isValidCaptcha) {
        return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed' });
      }
    }

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) return res.status(500).json({ success: false, message: 'Database error' });

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      // Verify password
      const isValidPassword = await bcryptjs.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = generateToken(user);
      res.json({
        success: true,
        message: 'Signed in successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name
        }
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ CONTACT FORM ROUTE ============

app.post('/api/contact', [
  body('name').notEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('subject').notEmpty(),
  body('message').notEmpty(),
  body('category').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, phone, subject, message, category, recaptcha_token } = req.body;

    // Verify reCAPTCHA
    if (recaptcha_token) {
      const isValidCaptcha = await verifyRecaptcha(recaptcha_token);
      if (!isValidCaptcha) {
        return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed' });
      }
    }

    // Save to database
    db.run(
      'INSERT INTO contacts (name, email, phone, subject, category, message) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, phone, subject, category, message],
      function(err) {
        if (err) {
          return res.status(500).json({ success: false, message: 'Error saving contact' });
        }

        // Send confirmation to user
        sendEmail(
          email,
          '📨 We received your message - Ehacking School',
          `<h3>Thank you ${name}!</h3><p>We've received your message and will respond within 24 hours.</p><p><strong>Your message:</strong><br>${message}</p>`
        ).catch(err => console.error('Email send error:', err));

        // Send notification to admin
        sendEmail(
          process.env.ADMIN_EMAIL,
          `📨 New Contact Form Submission: ${subject}`,
          `<h3>New Contact:</h3><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone || 'N/A'}</p><p><strong>Category:</strong> ${category || 'N/A'}</p><p><strong>Message:</strong><br>${message}</p>`
        ).catch(err => console.error('Email send error:', err));

        res.json({
          success: true,
          message: 'Contact form submitted successfully. We\'ll respond within 24 hours.'
        });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ DASHBOARD ROUTES ============

// Get user's enrolled courses
app.get('/api/dashboard/courses', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    db.all(
      'SELECT * FROM user_courses WHERE user_id = ? ORDER BY enrolled_at DESC',
      [decoded.id],
      (err, courses) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json({ success: true, courses: courses || [] });
      }
    );
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// Enroll in course
app.post('/api/dashboard/enroll', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { course_name } = req.body;

    db.run(
      'INSERT INTO user_courses (user_id, course_name) VALUES (?, ?)',
      [decoded.id, course_name],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(409).json({ success: false, message: 'Already enrolled in this course' });
          }
          return res.status(500).json({ success: false, message: 'Error enrolling in course' });
        }
        res.json({ success: true, message: 'Enrolled successfully', course_id: this.lastID });
      }
    );
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// Update course progress
app.put('/api/dashboard/progress/:courseId', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { courseId } = req.params;
    const { progress } = req.body;

    if (progress < 0 || progress > 100) {
      return res.status(400).json({ success: false, message: 'Progress must be between 0-100' });
    }

    db.run(
      'UPDATE user_courses SET progress = ? WHERE id = ? AND user_id = ?',
      [progress, courseId, decoded.id],
      function(err) {
        if (err) return res.status(500).json({ success: false, message: 'Error updating progress' });
        if (this.changes === 0) return res.status(404).json({ success: false, message: 'Course not found' });

        res.json({ success: true, message: 'Progress updated', progress });
      }
    );
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// Get user stats
app.get('/api/dashboard/stats', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    db.get(
      `SELECT 
        COUNT(*) as total_courses,
        SUM(progress) as total_progress,
        (SELECT COUNT(*) FROM user_courses WHERE user_id = ? AND progress = 100) as completed_courses
      FROM user_courses WHERE user_id = ?`,
      [decoded.id, decoded.id],
      (err, stats) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json({ success: true, stats: stats || { total_courses: 0, total_progress: 0, completed_courses: 0 } });
      }
    );
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});

// ============ HEALTH CHECK ============

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Backend is running' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Backend server running on http://localhost:${PORT}`);
  console.log('📚 API endpoints:');
  console.log('   POST   /api/auth/signup');
  console.log('   POST   /api/auth/signin');
  console.log('   POST   /api/contact');
  console.log('   GET    /api/dashboard/courses');
  console.log('   POST   /api/dashboard/enroll');
  console.log('   PUT    /api/dashboard/progress/:courseId');
  console.log('   GET    /api/dashboard/stats');
  console.log('   GET    /api/health\n');
});
