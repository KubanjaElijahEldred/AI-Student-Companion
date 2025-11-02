@echo off
title AI Student Companion - Complete Startup
color 0A

echo.
echo ======================================================
echo    🎓 AI STUDENT COMPANION - COMPLETE STARTUP
echo ======================================================
echo.

REM Check if Ollama is installed
where ollama >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ ERROR: Ollama is not installed!
    echo.
    echo Please install Ollama from: https://ollama.ai/download
    echo.
    pause
    exit /b 1
)

echo [1/4] 🚀 Starting Ollama Service...
start "Ollama Service" /MIN cmd /k "ollama serve"
timeout /t 3 /nobreak >nul

echo [2/4] 🧠 Starting AI Engine...
cd /d "%~dp0ai-engine"
start "AI Engine" /MIN cmd /k "node ollamaEngine.js"
timeout /t 3 /nobreak >nul

echo [3/4] 🔧 Starting Backend Server...
cd /d "%~dp0backend"
start "Backend Server" /MIN cmd /k "node demoServer.js"
timeout /t 3 /nobreak >nul

echo [4/4] 🌐 Opening AI Student Companion...
cd /d "%~dp0"
start "" "auth-ui.html"
timeout /t 2 /nobreak >nul

echo.
echo ======================================================
echo    ✅ AI STUDENT COMPANION IS NOW RUNNING!
echo ======================================================
echo.
echo 🔗 Services Status:
echo   - Ollama Service:  http://localhost:11434
echo   - AI Engine:       http://localhost:3001  
echo   - Backend Server:  http://localhost:5001
echo   - Web Interface:   auth-ui.html (opened)
echo.
echo 🎯 Features Available:
echo   - 🔐 User Authentication with Profile Pictures
echo   - 📸 Camera Capture & Gallery Selection
echo   - 🌓 Light/Dark Mode Toggle
echo   - 🤖 Raw AI Model Integration (llama3.2:1b)
echo   - 💬 Real-time Chat Interface
echo.
echo 📝 Instructions:
echo   1. Register a new account or login
echo   2. Add your profile picture (camera/gallery)
echo   3. Start chatting with Mr. Elijah!
echo.
echo ⚠️  To stop all services, close this window or press Ctrl+C
echo.

:WAIT_LOOP
echo 🔄 App is running... Press 'Q' to quit or 'R' to restart
choice /c QR /n /m ""
if errorlevel 2 goto RESTART
if errorlevel 1 goto SHUTDOWN

:RESTART
echo.
echo 🔄 Restarting services...
taskkill /FI "WindowTitle eq Ollama Service*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq AI Engine*" /T /F >nul 2>&1  
taskkill /FI "WindowTitle eq Backend Server*" /T /F >nul 2>&1
timeout /t 2 /nobreak >nul
goto START

:START
echo [1/4] 🚀 Starting Ollama Service...
start "Ollama Service" /MIN cmd /k "ollama serve"
timeout /t 3 /nobreak >nul

echo [2/4] 🧠 Starting AI Engine...
cd /d "%~dp0ai-engine"
start "AI Engine" /MIN cmd /k "node ollamaEngine.js"
timeout /t 3 /nobreak >nul

echo [3/4] 🔧 Starting Backend Server...
cd /d "%~dp0backend"
start "Backend Server" /MIN cmd /k "node demoServer.js"
timeout /t 3 /nobreak >nul
cd /d "%~dp0"
goto WAIT_LOOP

:SHUTDOWN
echo.
echo 🛑 Shutting down AI Student Companion...
echo.

REM Kill all related processes
taskkill /FI "WindowTitle eq Ollama Service*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq AI Engine*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq Backend Server*" /T /F >nul 2>&1

echo ✅ All services stopped successfully.
echo 👋 Thank you for using AI Student Companion!
echo.
pause
exit
