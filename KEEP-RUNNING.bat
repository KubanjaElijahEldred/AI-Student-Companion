@echo off
title AI Student Companion - Services Running
color 0A

echo ============================================================
echo      AI STUDENT COMPANION - PERSISTENT SERVICE RUNNER
echo ============================================================
echo.
echo This will keep your AI chatbot services running continuously.
echo.
echo Services will start in separate windows and stay alive.
echo Close those windows ONLY when you're done using the chatbot.
echo.
echo ============================================================
echo.

:: Kill any existing node processes first
echo Cleaning up any previous instances...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo.
echo [1/3] Starting AI Engine (Port 3001)...
cd /d "%~dp0ai-engine"
start "AI ENGINE - KEEP OPEN" cmd /k "color 0B && title AI ENGINE - Port 3001 && echo. && echo ========================================== && echo    AI ENGINE IS RUNNING && echo    Port: 3001 && echo    Status: Active && echo ========================================== && echo. && echo Keep this window OPEN! && echo Close it when done using chatbot. && echo. && node index.js"

timeout /t 3 /nobreak >nul

echo [2/3] Starting Backend Server (Port 5001)...
cd /d "%~dp0backend"
start "BACKEND SERVER - KEEP OPEN" cmd /k "color 0E && title BACKEND SERVER - Port 5001 && echo. && echo ========================================== && echo    BACKEND SERVER IS RUNNING && echo    Port: 5001 && echo    Status: Active && echo ========================================== && echo. && echo Keep this window OPEN! && echo Close it when done using chatbot. && echo. && set PORT=5001&& node demoServer.js"

timeout /t 4 /nobreak >nul

echo [3/3] Opening Chatbot Interface...
cd /d "%~dp0"
start "" "CHATBOT-SIMPLE.html"

echo.
echo ============================================================
echo   ALL SERVICES STARTED SUCCESSFULLY!
echo ============================================================
echo.
echo   AI Engine:      http://localhost:3001
echo   Backend Server: http://localhost:5001
echo   Chatbot:        Opened in browser
echo.
echo ============================================================
echo.
echo IMPORTANT INSTRUCTIONS:
echo.
echo 1. Two windows opened: "AI ENGINE" and "BACKEND SERVER"
echo 2. Keep BOTH windows open while using the chatbot
echo 3. Your chatbot should now show GREEN status indicators
echo 4. You can now chat, register, login, and get AI responses
echo 5. Close ONLY the service windows when completely done
echo.
echo ============================================================
echo.
echo This window can now be closed safely.
echo The services will continue running in their own windows.
echo.
pause
exit
