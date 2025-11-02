@echo off
title AI Student Companion - Starting Services
color 0A
cls

echo.
echo ============================================================
echo          AI STUDENT COMPANION - STARTUP
echo ============================================================
echo.
echo Starting your chatbot services...
echo.

:: Kill existing node processes
echo [Step 1/4] Cleaning up old processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul
echo     Done!

:: Start AI Engine
echo.
echo [Step 2/4] Starting AI Engine on port 3001...
cd /d "%~dp0ai-engine"
start "AI ENGINE - DO NOT CLOSE" cmd /k "color 0B && title AI ENGINE RUNNING - Port 3001 && echo. && echo ============================================ && echo    AI ENGINE IS NOW RUNNING && echo    Port: 3001 && echo    Status: ACTIVE && echo ============================================ && echo. && echo KEEP THIS WINDOW OPEN! && echo Close it only when done using chatbot. && echo. && node index.js"
echo     AI Engine starting...

:: Wait for AI Engine to initialize
timeout /t 3 /nobreak >nul

:: Start Backend Server with simpleServer.js
echo.
echo [Step 3/4] Starting Backend Server on port 5001...
cd /d "%~dp0backend"
start "BACKEND SERVER - DO NOT CLOSE" cmd /k "color 0E && title BACKEND SERVER RUNNING - Port 5001 && echo. && echo ============================================ && echo    BACKEND SERVER IS NOW RUNNING && echo    Port: 5001 && echo    Status: ACTIVE && echo ============================================ && echo. && echo KEEP THIS WINDOW OPEN! && echo Close it only when done using chatbot. && echo. && set PORT=5001&& node simpleServer.js"
echo     Backend Server starting...

:: Wait for Backend to initialize
timeout /t 4 /nobreak >nul

:: Open Chatbot
echo.
echo [Step 4/4] Opening Chatbot Interface...
cd /d "%~dp0"
start "" "CHATBOT-SIMPLE.html"
timeout /t 2 /nobreak >nul

:: Show success message
cls
echo.
echo ============================================================
echo          SUCCESS! YOUR CHATBOT IS NOW RUNNING!
echo ============================================================
echo.
echo   AI Engine:      http://localhost:3001
echo   Backend Server: http://localhost:5001
echo   Chatbot:        Opened in your browser
echo.
echo ============================================================
echo.
echo IMPORTANT REMINDERS:
echo.
echo   1. Two windows opened:
echo      - "AI ENGINE - DO NOT CLOSE"
echo      - "BACKEND SERVER - DO NOT CLOSE"
echo.
echo   2. Keep BOTH windows open while using the chatbot!
echo.
echo   3. In your browser, you should now see:
echo      - Green dots showing services are online
echo      - You can now register, login, and chat!
echo.
echo   4. To stop the chatbot:
echo      - Close the browser tab
echo      - Close both service windows
echo.
echo ============================================================
echo.
echo This window can now be closed.
echo The services are running in separate windows.
echo.
echo Press any key to close this window...
pause >nul
exit
