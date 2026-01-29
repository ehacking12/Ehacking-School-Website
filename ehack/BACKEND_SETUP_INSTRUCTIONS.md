# ⚙️ BACKEND SETUP - COMPLETE GUIDE

## Prerequisites Check

Your system is missing **Node.js and npm**, which are required to run the backend.

### ❌ Current Status
- Node.js: NOT INSTALLED
- npm: NOT INSTALLED
- Backend Code: ✅ READY (in `backend/server.js`)

---

## Step 1: Install Node.js

### Option A: Recommended (Easiest)
1. Go to https://nodejs.org/
2. Download **LTS version** (20.x or latest)
3. Run the installer
4. Choose default options
5. **Restart PowerShell/CMD after installation**

### Option B: Using Chocolatey (If you have it)
```powershell
choco install nodejs
```

### Option C: Using Windows Package Manager
```powershell
winget install OpenJS.NodeJS.LTS
```

---

## Step 2: Verify Installation

Open a **NEW PowerShell** window and run:

```powershell
node --version
npm --version
```

Both should show version numbers (e.g., `v20.10.0` and `9.8.1`)

---

## Step 3: Install Backend Dependencies

Navigate to backend folder:

```powershell
cd "C:\Users\Lab4\Desktop\ehack\backend"
npm install
```

This creates `node_modules/` folder with all required packages.

---

## Step 4: Configure Environment Variables

1. In `backend/` folder, copy `.env.example` to `.env`:
   ```powershell
   Copy-Item .env.example .env
   ```

2. Open `.env` in Notepad:
   ```powershell
   notepad .env
   ```

3. Fill in these values:
   ```
   JWT_SECRET=your-random-secret-key-here
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   ADMIN_EMAIL=your-gmail@gmail.com
   RECAPTCHA_SECRET_KEY=your-recaptcha-secret-key
   PORT=3000
   ```

**Important for Gmail:**
- Use Gmail App Password (16 characters), NOT your regular password
- Get it at: https://myaccount.google.com/apppasswords

---

## Step 5: Start the Backend

From `backend/` folder, run:

```powershell
npm start
```

**Expected output:**
```
✅ Connected to SQLite database
🚀 Server running at http://localhost:3000
```

---

## Step 6: Test the Backend

Open your browser and go to:
```
http://localhost:3000/api/health
```

Should see:
```json
{"status": "ok", "timestamp": "2026-01-20T..."}
```

---

## Quick Commands Reference

```powershell
# Navigate to backend
cd "C:\Users\Lab4\Desktop\ehack\backend"

# Install dependencies (first time only)
npm install

# Start the server
npm start

# Stop the server
# Press Ctrl+C in the terminal

# Check if port 3000 is in use
Get-NetTcpConnection -LocalPort 3000 -ErrorAction SilentlyContinue
```

---

## Troubleshooting

### "npm: The term 'npm' is not recognized"
→ **Solution:** You didn't restart PowerShell after installing Node.js
   1. **Close ALL PowerShell windows**
   2. Open a new PowerShell
   3. Try again

### "Port 3000 already in use"
→ **Solution:** Another process is using port 3000
   ```powershell
   Get-NetTcpConnection -LocalPort 3000
   Stop-Process -Id <PID> -Force
   ```

### "Cannot find module 'dotenv'"
→ **Solution:** Dependencies not installed
   ```powershell
   cd backend
   npm install
   ```

### "Email sending fails"
→ **Solution:** Check your Gmail App Password
   - Must be 16 characters from https://myaccount.google.com/apppasswords
   - Not your regular Gmail password

### "JWT_SECRET not set"
→ **Solution:** Create `.env` file from `.env.example`:
   ```powershell
   Copy-Item .env.example .env
   notepad .env
   ```

---

## Next Steps After Backend Runs

1. ✅ Backend is running at `http://localhost:3000`
2. Visit `http://localhost/` to test frontend features
3. Try signing up - should work now!
4. Check browser console (F12) for any errors
5. Check backend console for request logs

---

## File Structure

```
backend/
├── server.js ..................... Main backend code (416 lines)
├── package.json .................. Dependencies
├── .env.example .................. Configuration template
├── .env .......................... Your configuration (CREATE THIS)
├── node_modules/ ................. Installed packages (after npm install)
├── database.db ................... SQLite database (auto-created on first run)
└── BACKEND_SETUP.md .............. Detailed setup guide
```

---

## Port Information

- **Frontend:** `http://localhost/` (port 80 or 8080 depending on server)
- **Backend:** `http://localhost:3000`

Both must run simultaneously for full functionality.

---

## Important Notes

⚠️ **Keep the backend running** while using the website
⚠️ **Don't share your `.env` file** - contains sensitive credentials
⚠️ **Use App Passwords for Gmail**, not your actual password
⚠️ **Restart backend** if you change `.env` file

---

## Questions?

1. Check [SETUP_VERIFICATION.md](../SETUP_VERIFICATION.md)
2. Read [backend/BACKEND_SETUP.md](./BACKEND_SETUP.md)
3. Check browser console (F12) for errors
4. Check backend terminal for error messages

