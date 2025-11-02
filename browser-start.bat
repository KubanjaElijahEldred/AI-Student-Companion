@echo off
title AI Student Companion - Browser Access
echo ====================================================
echo   AI Student Companion - Browser Access Setup
echo ====================================================
echo.

:: Change to the project directory
cd /d "%~dp0"

echo [1/4] Stopping any existing Node.js processes...
tasklist /FI "IMAGENAME eq node.exe" 2>NUL | find /I /N "node.exe">NUL
if "%ERRORLEVEL%"=="0" (
    taskkill /F /IM node.exe >NUL 2>&1
    timeout /t 2 /nobreak >NUL
    echo     Existing processes stopped.
) else (
    echo     No existing processes found.
)

echo.
echo [2/4] Starting AI Engine (Port 3001)...
cd ai-engine
start "AI Engine" /min cmd /c "echo AI Engine Starting... && node index.js && pause"
cd ..

echo.
echo [3/4] Starting Backend Server (Port 5001)...
cd backend
start "Backend Server" /min cmd /c "echo Backend Server Starting... && set PORT=5001&& node demoServer.js && pause"
cd ..

echo.
echo [4/4] Opening Browser Portal...
timeout /t 5 /nobreak >NUL
start "" "index.html"

echo.
echo ====================================================
echo   🌐 BROWSER ACCESS READY!
echo ====================================================
echo   Web Portal: Just opened in your browser
echo   AI Engine: http://localhost:3001
echo   Backend: http://localhost:5001
echo ====================================================
echo.
echo AVAILABLE INTERFACES:
echo • Web Portal (Main dashboard)
echo • Direct Chat (No login required)
echo • Full Application (With user accounts)
echo • API Tester (For developers)
echo.
echo Services are starting in the background...
echo Wait 10-15 seconds for full initialization.
echo.
echo Press any key to exit this window (services will keep running)
pause >NUL

echo Services are now running in background windows.
echo Close the "AI Engine" and "Backend Server" windows to stop services.
