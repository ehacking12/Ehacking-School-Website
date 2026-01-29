@echo off
REM ============================================
REM Ehacking School - Complete Setup Script
REM ============================================
REM This script sets up and starts both frontend and backend

echo.
echo ============================================
echo Ehacking School - Setup and Start Script
echo ============================================
echo.

REM Check if Node.js is installed
echo Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    echo Then run this script again.
    pause
    exit /b 1
)
echo ✓ Node.js is installed
echo.

REM Navigate to backend directory
echo Setting up backend...
cd backend

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing backend dependencies (npm install)...
    echo This may take a minute or two...
    echo.
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo ✓ Dependencies installed successfully
    echo.
) else (
    echo ✓ Dependencies already installed
    echo.
)

REM Check if .env file exists
if not exist ".env" (
    echo.
    echo ============================================
    echo IMPORTANT: Setup Environment Variables
    echo ============================================
    echo.
    echo .env file not found! Creating from template...
    copy .env.example .env >nul
    echo ✓ .env file created from template
    echo.
    echo BEFORE STARTING THE BACKEND:
    echo.
    echo 1. Open the .env file in a text editor
    echo 2. Fill in these REQUIRED variables:
    echo    - JWT_SECRET: Any random string (e.g., "your-secret-key-12345")
    echo    - EMAIL_USER: Your Gmail address
    echo    - EMAIL_PASSWORD: Gmail App Password (see below)
    echo    - ADMIN_EMAIL: Where contact forms go
    echo    - RECAPTCHA_SECRET_KEY: From Google reCAPTCHA console
    echo.
    echo 3. To get Gmail App Password:
    echo    a. Go to https://myaccount.google.com
    echo    b. Click "Security" on the left
    echo    c. Enable 2-Factor Authentication if not enabled
    echo    d. Scroll down to "App passwords"
    echo    e. Select Mail and Windows Computer
    echo    f. Copy the 16-character password to .env
    echo.
    echo 4. To get reCAPTCHA keys:
    echo    a. Go to https://www.google.com/recaptcha/admin
    echo    b. Click "Create" or use existing site
    echo    c. Copy Site Key and Secret Key to .env
    echo.
    echo Opening .env file for editing...
    timeout /t 5
    start notepad .env
    pause
) else (
    echo ✓ .env file exists
    echo.
)

REM Start the backend
echo.
echo ============================================
echo Starting Backend Server
echo ============================================
echo.
echo Backend will run at http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.
timeout /t 3

npm start
