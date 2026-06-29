@echo off
echo ==================================================
echo AI Student Companion - Complete System Startup
echo ==================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if .env file exists for WhatsApp server
if not exist ".env" (
    echo Creating .env file from WhatsApp template...
    copy ".env.whatsapp" ".env"
    echo.
    echo IMPORTANT: Please edit .env file with your WhatsApp Business API credentials:
    echo - WHATSAPP_ACCESS_TOKEN
    echo - WHATSAPP_PHONE_NUMBER_ID  
    echo - WHATSAPP_WEBHOOK_VERIFY_TOKEN
    echo.
    pause
)

REM Check if ai-engine .env file exists
if not exist "ai-engine\.env" (
    echo Creating ai-engine .env file from template...
    copy "ai-engine\.env.example" "ai-engine\.env"
    echo.
    echo ai-engine environment file created.
)

REM Install dependencies for main project
if not exist "node_modules" (
    echo Installing main project dependencies...
    npm install
    echo.
)

REM Install dependencies for ai-engine
if not exist "ai-engine\node_modules" (
    echo Installing ai-engine dependencies...
    cd ai-engine
    npm install
    cd ..
    echo.
)

echo ==================================================
echo Starting AI Student Companion System
echo ==================================================
echo.

REM Start AI Engine in background
echo Starting AI Engine (port 3001)...
start "AI Engine" cmd /k "cd ai-engine && node smartEngine.js"

REM Wait for AI Engine to start
timeout /t 3 /nobreak >nul

REM Start WhatsApp Server in background
echo Starting WhatsApp Server (port 3002)...
start "WhatsApp Server" cmd /k "node whatsapp-server.js"

REM Wait for WhatsApp Server to start
timeout /t 3 /nobreak >nul

echo ==================================================
echo SYSTEM STARTED SUCCESSFULLY!
echo ==================================================
echo.
echo Services Running:
echo - AI Engine:        http://localhost:3001
echo - WhatsApp Server:   http://localhost:3002
echo - Webhook Endpoint:  http://localhost:3002/webhook/whatsapp
echo - Health Checks:
echo   - AI Engine:       http://localhost:3001/health
echo   - WhatsApp:        http://localhost:3002/health
echo.
echo Features Available:
echo - Web Chat Interface
echo - WhatsApp Business Integration (+256 788577092)
echo - AI Student Companion Features
echo - Real-time Messaging
echo - Notifications
echo.
echo Keep this window and the service windows OPEN!
echo Press Ctrl+C in individual windows to stop services.
echo.
echo To test WhatsApp integration:
echo 1. Configure WhatsApp Business API webhook URL
echo 2. Send messages to +256 788577092
echo 3. Check responses
echo.
pause
