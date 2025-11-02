@echo off
title AI Student Companion - Ollama Edition
color 0A

echo.
echo ======================================================
echo    AI STUDENT COMPANION - OLLAMA POWERED
echo ======================================================
echo.

REM Check if Ollama is installed
where ollama >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Ollama is not installed!
    echo.
    echo Please install Ollama from: https://ollama.ai/download
    echo.
    pause
    exit /b 1
)

echo [1/3] Starting Ollama Service...
start "Ollama Service" cmd /k "ollama serve"
timeout /t 3 /nobreak >nul

echo [2/3] Starting AI Engine with Ollama...
cd /d "%~dp0ai-engine"
start "AI Engine - Ollama" cmd /k "node ollamaEngine.js"
timeout /t 3 /nobreak >nul

echo [3/3] Starting Advanced Backend...
cd /d "%~dp0backend"
start "Backend - Advanced" cmd /k "node advancedServer.js"
timeout /t 3 /nobreak >nul

echo.
echo ======================================================
echo    ALL SERVICES STARTED!
echo ======================================================
echo.
echo Services running:
echo   - Ollama:     http://localhost:11434
echo   - AI Engine:  http://localhost:3001
echo   - Backend:    http://localhost:5001
echo.
echo Model: llama3.2:1b (Lightweight & Fast)
echo.
echo Opening modern UI...
timeout /t 2 /nobreak >nul
start "" "modern-ui.html"

echo.
echo Press any key to stop all services...
pause >nul

taskkill /FI "WindowTitle eq Ollama Service*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq AI Engine - Ollama*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq Backend - Advanced*" /T /F >nul 2>&1

echo All services stopped.
pause
