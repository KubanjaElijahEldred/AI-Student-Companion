@echo off
cd /d "%~dp0"

echo ======================================================
echo    🚀 AI STUDENT COMPANION - JAVASCRIPT VERSION
echo ======================================================
echo.

REM Check if services are running, if not start them
echo [1/3] 🔍 Checking services...

REM Check if backend is running on port 5001
netstat -an | findstr ":5001" >nul
if %errorlevel% neq 0 (
    echo [2/3] 🚀 Starting backend server...
    start /min cmd /c "cd backend && node demoServer.js"
    timeout /t 3 >nul
) else (
    echo ✅ Backend server already running
)

REM Check if AI engine is running on port 3001
netstat -an | findstr ":3001" >nul
if %errorlevel% neq 0 (
    echo [2/3] 🧠 Starting AI engine...
    start /min cmd /c "cd ai-engine && node ollamaEngine.js"
    timeout /t 2 >nul
) else (
    echo ✅ AI engine already running
)

echo [3/3] 🌐 Opening JavaScript Application...

REM Try to open the JavaScript app directly first
if exist "js-app.html" (
    start "" "js-app.html"
    echo ✅ JavaScript application opened!
) else (
    REM Fallback to backend URL
    start "" "http://localhost:5001"
    echo ✅ Opening via backend server!
)

echo.
echo ======================================================
echo    ✅ AI STUDENT COMPANION IS NOW RUNNING!
echo ======================================================
echo.
echo 🎯 Features:
echo    - Pure JavaScript Application (No HTML dependencies)
echo    - Real-time Authentication
echo    - AI-Powered Chat Interface
echo    - Profile Picture Management
echo    - Responsive Design
echo.
echo 🔗 Access via: http://localhost:5001
echo.
echo Press any key to exit...
pause >nul
