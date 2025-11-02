@echo off
title AI Student Companion - Starting Services
color 0A
echo.
echo ========================================================
echo         AI STUDENT COMPANION - STARTUP SCRIPT
echo ========================================================
echo.
echo Starting AI Engine and Backend Server...
echo.

:: Kill any existing node processes to start fresh
taskkill /F /IM node.exe >nul 2>&1

:: Wait a moment for processes to close
timeout /t 2 /nobreak >nul

echo [1/3] Starting AI Engine on port 3001...
cd /d "%~dp0ai-engine"
start "AI Engine" cmd /k "color 0B && echo AI ENGINE RUNNING ON PORT 3001 && node index.js"

:: Wait for AI Engine to start
timeout /t 3 /nobreak >nul

echo [2/3] Starting Backend Server on port 5001...
cd /d "%~dp0backend"
start "Backend Server" cmd /k "color 0E && echo BACKEND SERVER RUNNING ON PORT 5001 && set PORT=5001&& node demoServer.js"

:: Wait for Backend to start
timeout /t 3 /nobreak >nul

echo [3/3] Opening Chatbot Interface...
cd /d "%~dp0"
start "" "%~dp0unified-chatbot.html"

echo.
echo ========================================================
echo   SUCCESS! All services are starting up!
echo ========================================================
echo.
echo   AI Engine:       http://localhost:3001
echo   Backend Server:  http://localhost:5001
echo   Chatbot:         Opened in your browser
echo.
echo ========================================================
echo.
echo IMPORTANT: Keep the AI Engine and Backend Server windows open!
echo Close them when you're done using the chatbot.
echo.
echo This window can be closed now.
echo.
pause
