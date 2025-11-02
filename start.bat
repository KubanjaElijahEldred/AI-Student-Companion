@echo off
echo Starting AI Student Companion...
echo.

echo Installing dependencies for backend...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo Installing dependencies for AI engine...
cd ..\ai-engine
call npm install
if %errorlevel% neq 0 (
    echo Failed to install AI engine dependencies
    pause
    exit /b 1
)

echo.
echo Starting services...
echo.

echo Starting AI Engine on port 3001...
start "AI Engine" cmd /k "cd /d %~dp0ai-engine && npm start"

timeout /t 3 /nobreak >nul

echo Starting Backend Server on port 5000...
start "Backend Server" cmd /k "cd /d %~dp0backend && npm start"

timeout /t 3 /nobreak >nul

echo.
echo ================================================
echo   AI Student Companion is starting up!
echo ================================================
echo   Backend Server: http://localhost:5000
echo   AI Engine: http://localhost:3001
echo   Frontend: Open frontend/index.html in browser
echo ================================================
echo.
echo Press any key to open the frontend...
pause >nul

start "" "%~dp0frontend\index.html"

echo.
echo All services are running!
echo Close this window to stop all services.
echo.
pause
