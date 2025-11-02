@echo off
title AI Student Companion - Advanced Version
color 0A

echo.
echo ===================================================
echo    AI STUDENT COMPANION - ADVANCED VERSION
echo ===================================================
echo.
echo Starting all services...
echo.

REM Start Advanced AI Engine
echo [1/2] Starting Advanced AI Engine (Port 3001)...
cd /d "%~dp0ai-engine"
start "AI Engine - Advanced" cmd /k "node advancedEngine.js"
timeout /t 3 /nobreak >nul

REM Start Advanced Backend
echo [2/2] Starting Advanced Backend (Port 5001)...
cd /d "%~dp0backend"
start "Backend - Advanced" cmd /k "node advancedServer.js"
timeout /t 3 /nobreak >nul

echo.
echo ===================================================
echo    ALL SERVICES STARTED!
echo ===================================================
echo.
echo Services running:
echo   - AI Engine: http://localhost:3001
echo   - Backend:   http://localhost:5001
echo.
echo Advanced Features Available:
echo   - Study Notes Management
echo   - Spaced Repetition Flashcards
echo   - Study Session Tracking
echo   - Quiz System with Auto-Grading
echo   - Progress Analytics and XP System
echo   - Achievement System
echo   - Leaderboard
echo.
echo Opening browser...
timeout /t 2 /nobreak >nul
start "" "unified-chatbot.html"

echo.
echo Press any key to stop all services...
pause >nul

REM Close all service windows
taskkill /FI "WindowTitle eq AI Engine - Advanced*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq Backend - Advanced*" /T /F >nul 2>&1

echo.
echo All services stopped.
echo.
pause
