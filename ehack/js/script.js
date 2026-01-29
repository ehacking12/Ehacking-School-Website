/* Navigation and Interactive Elements */

// Carousel functionality
let currentSlideIndex = 1;
let slideTimer = null;

function showSlide(n) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    if (n > slides.length) { currentSlideIndex = 1; }
    if (n < 1) { currentSlideIndex = slides.length; }
    
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    if (slides[currentSlideIndex - 1]) {
        slides[currentSlideIndex - 1].classList.add('active');
    }
    if (dots[currentSlideIndex - 1]) {
        dots[currentSlideIndex - 1].classList.add('active');
    }
}

function currentSlide(n) {
    clearTimeout(slideTimer);
    currentSlideIndex = n;
    showSlide(currentSlideIndex);
    autoSlide();
}

function autoSlide() {
    currentSlideIndex++;
    showSlide(currentSlideIndex);
    slideTimer = setTimeout(autoSlide, 5000); // Change slide every 5 seconds
}

// Handle active nav link based on current page
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });

    // Start carousel on page load
    showSlide(currentSlideIndex);
    autoSlide();
});

// Filter courses by level
function filterCourses() {
    const selectedLevel = document.getElementById('levelFilter').value;
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
        const cardLevel = card.getAttribute('data-level');
        if (selectedLevel === '' || cardLevel === selectedLevel) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Handle contact form submission
function handleContactForm(event) {
    event.preventDefault();
    
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Simple validation
    if (!name || !email || !subject || !message) {
        formMessage.textContent = 'Please fill in all required fields.';
        formMessage.classList.remove('success');
        formMessage.classList.add('error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        formMessage.textContent = 'Please enter a valid email address.';
        formMessage.classList.remove('success');
        formMessage.classList.add('error');
        return;
    }
    
    // Show success message (in a real app, this would send the email)
    formMessage.textContent = 'Thank you for your message! We will get back to you soon.';
    formMessage.classList.remove('error');
    formMessage.classList.add('success');
    
    // Reset form
    form.reset();
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.classList.remove('success');
        formMessage.textContent = '';
    }, 5000);
}

// Add smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add animation to elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe course cards for animation
document.querySelectorAll('.course-card, .path-card, .blog-post').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(element);
});

// Mobile menu toggle (if needed for future implementation)
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks.style.display === 'flex') {
        navLinks.style.display = 'none';
    } else {
        navLinks.style.display = 'flex';
    }
}

// Add keyboard navigation for accessibility
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close any open menus or modals
        const navLinks = document.querySelector('.nav-links');
        if (navLinks) {
            navLinks.style.display = '';
        }
    }
});

// Update navbar to show logged-in user
function updateUserDisplay() {
    const user = localStorage.getItem('user');
    const signinLink = document.querySelector('.btn-dashboard');
    
    if (user && signinLink) {
        try {
            const userData = JSON.parse(user);
            signinLink.textContent = `👤 ${userData.first_name || 'User'}`;
            signinLink.href = 'dashboard.html';
            signinLink.className = 'btn-dashboard user-profile';
        } catch (e) {
            console.log('Invalid user data');
        }
    }
}

// Call on page load
document.addEventListener('DOMContentLoaded', updateUserDisplay);

// Utility function to log page analytics
function logPageView(pageName) {
    console.log('Page viewed: ' + pageName);
    // In a real app, this would send data to an analytics service
}

// Log page view on page load
window.addEventListener('load', function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    logPageView(currentPage);
});

/* WhatsApp chat button (injects styles and floating button)
   - Replace the `phone` variable value with your phone number (country code + number, no + or spaces)
   - Example: '15551234567' for +1 555 123 4567
*/
(function addWhatsAppButton() {
    const phone = '15551234567'; // REPLACE_WITH_YOUR_NUMBER
    if (!phone || phone === 'REPLACE_WITH_YOUR_NUMBER') return;

    const prefilledText = encodeURIComponent('Hello, I would like to chat about your services.');

    // Inject CSS for the button
    const css = `
    #whatsapp-chat-btn{position:fixed;right:20px;bottom:20px;z-index:99999;background:#25D366;color:#fff;width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;text-decoration:none;box-shadow:0 6px 18px rgba(37,211,102,0.25);font-size:26px;transition:transform .18s ease}
    #whatsapp-chat-btn:hover{transform:translateY(-4px)}
    #whatsapp-chat-btn:active{transform:translateY(0)}
    #whatsapp-chat-btn .wa-text{display:none;margin-left:8px;font-weight:700}
    @media(min-width:640px){#whatsapp-chat-btn{width:64px;height:64px;font-size:28px}#whatsapp-chat-btn .wa-text{display:none}}
    `;

    const styleEl = document.createElement('style');
    styleEl.type = 'text/css';
    styleEl.appendChild(document.createTextNode(css));
    document.head.appendChild(styleEl);

    // Create link element
    const a = document.createElement('a');
    a.id = 'whatsapp-chat-btn';
    a.href = `https://wa.me/${phone}?text=${prefilledText}`;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.title = 'Chat on WhatsApp';
    a.setAttribute('aria-label', 'Chat on WhatsApp');

    // Simple icon — emoji fallback works across browsers
    a.innerHTML = '<span class="wa-icon">💬</span>';

    // Append to body
    function appendWhenReady() {
        if (document.body) {
            document.body.appendChild(a);
        } else {
            setTimeout(appendWhenReady, 50);
        }
    }
    appendWhenReady();
})();
