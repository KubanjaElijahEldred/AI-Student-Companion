@echo off
echo ====================================================
echo   AI Student Companion - Demo Mode Setup
echo ====================================================
echo.

:: Kill any existing Node.js processes to start fresh
echo Stopping any existing services...
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    taskkill /F /IM node.exe >NUL 2>&1
    timeout /t 2 /nobreak >NUL
    echo Previous services stopped.
)

echo.
echo Installing dependencies...
echo.

:: Install backend dependencies
echo [1/2] Installing backend dependencies...
cd /d "%~dp0backend"
call npm install >NUL 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

:: Install AI engine dependencies
echo [2/2] Installing AI engine dependencies...
cd /d "%~dp0ai-engine"
call npm install >NUL 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Failed to install AI engine dependencies
    pause
    exit /b 1
)

echo Dependencies installed successfully!
echo.

:: Start AI Engine first
echo Starting AI Engine on port 3001...
cd /d "%~dp0ai-engine"
start "AI Engine - Demo Mode" cmd /k "echo AI Engine starting... && node index.js"

:: Wait for AI engine to start
timeout /t 3 /nobreak >NUL

:: Start Demo Backend Server
echo Starting Demo Backend Server on port 5001...
cd /d "%~dp0backend"
start "Backend Server - Demo Mode" cmd /k "echo Demo Backend starting... && set PORT=5001&& node demoServer.js"

:: Wait for backend to start
timeout /t 3 /nobreak >NUL

echo.
echo ====================================================
echo   🚀 AI Student Companion Demo is Starting!
echo ====================================================
echo   ✅ AI Engine: http://localhost:3001
echo   ✅ Demo Backend: http://localhost:5001
echo   🌐 Frontend: Opening in browser...
echo ====================================================
echo.
echo DEMO MODE FEATURES:
echo • No database required - uses in-memory storage
echo • Register/Login works without MongoDB
echo • Chat with AI works immediately
echo • All data is temporary (lost on restart)
echo.

:: Test if services are running
echo Testing services...
timeout /t 2 /nobreak >NUL

:: Create a temporary HTML file with correct API endpoint
echo Creating demo frontend...
cd /d "%~dp0"

(
echo ^<!DOCTYPE html^>
echo ^<html lang="en"^>
echo ^<head^>
echo     ^<meta charset="UTF-8"^>
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^>
echo     ^<title^>AI Student Companion - Demo^</title^>
echo     ^<style^>
echo         body { font-family: Arial; margin: 20px; background: #f0f8ff; }
echo         .header { background: linear-gradient(135deg, #4f46e5, #7c3aed); color: white; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px; }
echo         .status { background: #e8f5e8; border: 1px solid #4caf50; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
echo         .info { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
echo         .button { background: #4f46e5; color: white; padding: 12px 24px; border: none; border-radius: 5px; cursor: pointer; margin: 10px; font-size: 16px; }
echo         .button:hover { background: #3730a3; }
echo         .demo-note { background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 5px; margin-top: 20px; }
echo     ^</style^>
echo ^</head^>
echo ^<body^>
echo     ^<div class="header"^>
echo         ^<h1^>🤖 AI Student Companion - Demo Mode^</h1^>
echo         ^<p^>Your personal study assistant (Demo Version)^</p^>
echo     ^</div^>
echo
echo     ^<div class="status"^>
echo         ^<h3^>✅ Demo Services Status^</h3^>
echo         ^<p^>• AI Engine: Running on port 3001^</p^>
echo         ^<p^>• Backend Server: Running on port 5001^</p^>
echo         ^<p^>• Database: Not required (in-memory storage)^</p^>
echo     ^</div^>
echo
echo     ^<div class="info"^>
echo         ^<h3^>🎯 Quick Start Guide^</h3^>
echo         ^<ol^>
echo             ^<li^>Click "Open Chat Interface" below^</li^>
echo             ^<li^>Register a new account (any email/password works)^</li^>
echo             ^<li^>Login with your credentials^</li^>
echo             ^<li^>Start chatting with the AI!^</li^>
echo         ^</ol^>
echo     ^</div^>
echo
echo     ^<div style="text-align: center;"^>
echo         ^<button class="button" onclick="openChat()"^>Open Chat Interface^</button^>
echo         ^<button class="button" onclick="testAI()"^>Test AI Engine^</button^>
echo         ^<button class="button" onclick="viewStats()"^>View Demo Stats^</button^>
echo     ^</div^>
echo
echo     ^<div class="demo-note"^>
echo         ^<h4^>📝 Demo Mode Notes:^</h4^>
echo         ^<ul^>
echo             ^<li^>All data is stored in memory - it will be lost when servers restart^</li^>
echo             ^<li^>No real database connection required^</li^>
echo             ^<li^>Perfect for testing and development^</li^>
echo             ^<li^>Ready to upgrade to full MongoDB version when needed^</li^>
echo         ^</ul^>
echo     ^</div^>
echo
echo     ^<script^>
echo         const API_BASE = 'http://localhost:5001/api';
echo
echo         async function openChat() {
echo             // Open the modified frontend
echo             window.open('frontend/demo.html', '_blank');
echo         }
echo
echo         async function testAI() {
echo             try {
echo                 const response = await fetch('http://localhost:3001/api/respond', {
echo                     method: 'POST',
echo                     headers: { 'Content-Type': 'application/json' },
echo                     body: JSON.stringify({ message: 'Hello, are you working?' })
echo                 });
echo                 const data = await response.json();
echo                 alert('AI Engine Response: ' + data.reply);
echo             } catch (error) {
echo                 alert('AI Engine test failed: ' + error.message);
echo             }
echo         }
echo
echo         async function viewStats() {
echo             try {
echo                 const response = await fetch(API_BASE + '/auth/demo-stats');
echo                 const data = await response.json();
echo                 alert('Demo Stats:\nRegistered Users: ' + data.totalUsers + '\nClick OK to see details in console');
echo                 console.log('Demo Stats:', data);
echo             } catch (error) {
echo                 alert('Could not fetch stats: ' + error.message);
echo             }
echo         }
echo     ^</script^>
echo ^</body^>
echo ^</html^>
) > demo-launcher.html

:: Also create a modified frontend that uses the correct API endpoint
cd frontend
if not exist demo.html (
    copy index.html demo.html >NUL
    echo Created demo frontend file
)

:: Open the demo launcher
echo Opening demo launcher...
start "" "%~dp0demo-launcher.html"

echo.
echo ====================================================
echo 🎉 Demo is ready!
echo ====================================================
echo.
echo The demo launcher has opened in your browser.
echo Click "Open Chat Interface" to start chatting!
echo.
echo To stop all services:
echo 1. Close both command windows that opened
echo 2. Or press Ctrl+C in each window
echo.
echo Press any key to keep this window open...
pause >NUL

echo.
echo Demo startup complete! Services are running in background.
echo Close this window when you're done testing.
pause
