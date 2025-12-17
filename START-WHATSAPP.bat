@echo off
echo Starting AI Student Companion with WhatsApp Integration...
echo.

REM Check if .env file exists
if not exist ".env" (
    echo Creating .env file from template...
    copy ".env.whatsapp" ".env"
    echo.
    echo IMPORTANT: Please edit .env file with your WhatsApp Business API credentials:
    echo - WHATSAPP_ACCESS_TOKEN
    echo - WHATSAPP_PHONE_NUMBER_ID  
    echo - WHATSAPP_WEBHOOK_VERIFY_TOKEN
    echo.
    pause
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

REM Start the WhatsApp server
echo Starting WhatsApp server...
echo Server will run on: http://localhost:3002
echo Webhook endpoint: http://localhost:3002/webhook/whatsapp
echo Health check: http://localhost:3002/health
echo.
echo Press Ctrl+C to stop the server
echo.

node whatsapp-server.js

pause
