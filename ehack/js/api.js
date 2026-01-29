// API Configuration
const API_URL = 'http://localhost:3000/api';

// ============ AUTHENTICATION ============

async function handleSignUp(event) {
  event.preventDefault();

  const firstName = document.getElementById('signup-first-name').value;
  const lastName = document.getElementById('signup-last-name').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const passwordConfirm = document.getElementById('signup-password-confirm').value;
  const terms = document.getElementById('terms').checked;
  const captchaResponse = document.querySelector('#signup .g-recaptcha-response').value;

  // Validation
  if (!firstName || !lastName || !email || !password || !passwordConfirm) {
    showError('signup-password-confirm-error', 'Please fill in all fields');
    return;
  }

  if (password !== passwordConfirm) {
    showError('signup-password-confirm-error', 'Passwords do not match');
    return;
  }

  if (!terms) {
    alert('Please agree to Terms & Conditions');
    return;
  }

  if (!captchaResponse) {
    showError('signup-captcha-error', 'Please complete the reCAPTCHA verification');
    return;
  }

  // Show loading state
  const btn = event.target.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
  btn.disabled = true;

  try {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        recaptcha_token: captchaResponse
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Sign up failed');
    }

    // Save token to localStorage
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    // Show success message
    showSuccess('Account created successfully! Redirecting to dashboard...');
    
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 2000);

  } catch (error) {
    showError('signup-captcha-error', error.message || 'Sign up failed. Please try again.');
    console.error('Sign up error:', error);
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

async function handleSignIn(event) {
  event.preventDefault();

  const email = document.getElementById('signin-email').value;
  const password = document.getElementById('signin-password').value;
  const captchaResponse = document.querySelector('#signin .g-recaptcha-response').value;

  // Basic validation
  if (!email || !password) {
    showError('signin-email-error', 'Please fill in all fields');
    return;
  }

  if (!captchaResponse) {
    showError('signin-captcha-error', 'Please complete the reCAPTCHA verification');
    return;
  }

  // Show loading state
  const btn = event.target.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-check-circle"></i> Signing in...';
  btn.disabled = true;

  try {
    const response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password,
        recaptcha_token: captchaResponse
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Sign in failed');
    }

    // Save token and user info
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    showSuccess('Sign in successful! Redirecting to dashboard...');

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1500);

  } catch (error) {
    showError('signin-email-error', error.message || 'Invalid email or password');
    console.error('Sign in error:', error);
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

// ============ CONTACT FORM ============

async function handleContactForm(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const subject = document.getElementById('subject').value;
  const category = document.getElementById('category').value;
  const message = document.getElementById('message').value;
  const captchaResponse = document.querySelector('.g-recaptcha-response').value;

  // Validation
  if (!name || !email || !subject || !message) {
    alert('Please fill in all required fields');
    return;
  }

  if (!captchaResponse) {
    showError('contact-captcha-error', 'Please complete the reCAPTCHA verification');
    return;
  }

  // Show loading state
  const btn = event.target.querySelector('button[type="submit"]');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;

  try {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        subject,
        category,
        message,
        recaptcha_token: captchaResponse
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send message');
    }

    // Clear form
    event.target.reset();
    
    // Show success message
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
      formMessage.className = 'form-message success';
      formMessage.textContent = data.message;
    }

    // Reset form after 3 seconds
    setTimeout(() => {
      if (formMessage) formMessage.textContent = '';
    }, 5000);

  } catch (error) {
    const formMessage = document.getElementById('formMessage');
    if (formMessage) {
      formMessage.className = 'form-message error';
      formMessage.textContent = error.message || 'Failed to send message';
    }
    console.error('Contact form error:', error);
  } finally {
    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}

// ============ DASHBOARD ============

async function loadUserCourses() {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      window.location.href = 'signin.html';
      return;
    }

    const response = await fetch(`${API_URL}/dashboard/courses`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to load courses');
    }

    displayCourses(data.courses);
  } catch (error) {
    console.error('Error loading courses:', error);
    alert('Failed to load courses. Please try again.');
  }
}

async function loadDashboardStats() {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    const response = await fetch(`${API_URL}/dashboard/stats`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (response.ok && data.stats) {
      displayStats(data.stats);
    }
  } catch (error) {
    console.error('Error loading stats:', error);
  }
}

async function enrollCourse(courseName) {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      window.location.href = 'signin.html';
      return;
    }

    const response = await fetch(`${API_URL}/dashboard/enroll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ course_name: courseName })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to enroll');
    }

    alert('Successfully enrolled in ' + courseName);
    loadUserCourses();
  } catch (error) {
    alert(error.message);
    console.error('Enroll error:', error);
  }
}

async function updateCourseProgress(courseId, progress) {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    const response = await fetch(`${API_URL}/dashboard/progress/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ progress })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update progress');
    }

    console.log('Progress updated:', data);
    loadUserCourses();
  } catch (error) {
    console.error('Progress update error:', error);
  }
}

// ============ UI HELPERS ============

function showError(elementId, message) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = message;
    element.style.color = '#dc2626';
  }
}

function showSuccess(message) {
  const existingMessage = document.getElementById('formMessage') || 
                         document.querySelector('.form-message');
  if (existingMessage) {
    existingMessage.className = 'form-message success';
    existingMessage.textContent = message;
  } else {
    alert(message);
  }
}

function displayCourses(courses) {
  const container = document.getElementById('courses-container');
  if (!container) return;

  if (!courses || courses.length === 0) {
    container.innerHTML = '<p>No courses enrolled yet. <a href="courses.html">Browse courses</a></p>';
    return;
  }

  container.innerHTML = courses.map(course => `
    <div class="course-progress-card">
      <h3>${course.course_name}</h3>
      <p>Progress: ${course.progress}%</p>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${course.progress}%"></div>
      </div>
      <input type="range" min="0" max="100" value="${course.progress}" 
             onchange="updateCourseProgress(${course.id}, this.value)">
      <span class="status">${course.status}</span>
    </div>
  `).join('');
}

function displayStats(stats) {
  const container = document.getElementById('stats-container');
  if (!container) return;

  container.innerHTML = `
    <div class="stat-item">
      <h3>${stats.total_courses || 0}</h3>
      <p>Courses Enrolled</p>
    </div>
    <div class="stat-item">
      <h3>${stats.completed_courses || 0}</h3>
      <p>Completed Courses</p>
    </div>
    <div class="stat-item">
      <h3>${Math.round((stats.total_progress || 0) / (stats.total_courses || 1))}%</h3>
      <p>Average Progress</p>
    </div>
  `;
}

// ============ AUTH STATE MANAGEMENT ============

function checkAuthStatus() {
  const token = localStorage.getItem('auth_token');
  const user = localStorage.getItem('user');

  if (token && user) {
    // User is authenticated
    updateNavbarForAuth(JSON.parse(user));
  } else {
    // User is not authenticated
    updateNavbarForGuest();
  }
}

function updateNavbarForAuth(user) {
  const signinLink = document.querySelector('a[href="signin.html"]');
  if (signinLink) {
    signinLink.textContent = `👤 ${user.first_name}`;
    signinLink.href = 'dashboard.html';
  }
}

function updateNavbarForGuest() {
  const signinLink = document.querySelector('a[href="signin.html"]');
  if (signinLink) {
    signinLink.textContent = 'Sign In';
    signinLink.href = 'signin.html';
  }
}

function logout() {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  window.location.href = 'index.html';
}

// ============ INITIALIZATION ============

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
  checkAuthStatus();
  
  // Load dashboard data if on dashboard page
  if (window.location.pathname.includes('dashboard')) {
    loadUserCourses();
    loadDashboardStats();
  }
});
