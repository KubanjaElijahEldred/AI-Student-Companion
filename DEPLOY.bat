@echo off
echo ==================================================
echo AI Student Companion - Deployment Script
echo ==================================================
echo.

echo Select deployment platform:
echo 1. Railway (Recommended)
echo 2. Render
echo 3. Docker (Local)
echo 4. Manual Setup
echo.

set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto railway
if "%choice%"=="2" goto render
if "%choice%"=="3" goto docker
if "%choice%"=="4" goto manual
goto invalid

:railway
echo.
echo Deploying to Railway...
echo.
echo Prerequisites:
echo 1. Install Railway CLI: npm install -g @railway/cli
echo 2. Login: railway login
echo 3. Configure environment variables in Railway dashboard
echo.
echo To deploy:
echo railway up
echo.
echo Webhook URL will be: https://your-app.railway.app/webhook/whatsapp
echo.
pause
exit

:render
echo.
echo Deploying to Render...
echo.
echo Prerequisites:
echo 1. Push code to GitHub repository
echo 2. Connect repository to Render dashboard
echo 3. Configure environment variables
echo.
echo Webhook URL will be: https://your-app.onrender.com/webhook/whatsapp
echo.
pause
exit

:docker
echo.
echo Deploying with Docker...
echo.
echo Prerequisites:
echo 1. Docker and Docker Compose installed
echo 2. Ollama running locally or in container
echo.
echo To deploy:
echo docker-compose -f docker-compose-integrated.yml up -d
echo.
echo Webhook URL will be: http://localhost:3002/webhook/whatsapp
echo For public access, use ngrok: ngrok http 3002
echo.
pause
exit

:manual
echo.
echo Manual Deployment Setup...
echo.
echo Steps:
echo 1. Copy .env.whatsapp to .env and configure
echo 2. Install dependencies: npm install
echo 3. Start AI Engine: cd ai-engine && node smartEngine.js
echo 4. Start WhatsApp Server: node whatsapp-server.js
echo 5. Configure WhatsApp webhook URL
echo.
echo Webhook URL: http://localhost:3002/webhook/whatsapp
echo.
pause
exit

:invalid
echo Invalid choice. Please run again.
pause
