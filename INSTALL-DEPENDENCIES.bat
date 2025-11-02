@echo off
title Installing Dependencies - AI Student Companion
color 0B

echo.
echo ===================================================
echo    AI STUDENT COMPANION - DEPENDENCY INSTALLER
echo ===================================================
echo.
echo This will install all required dependencies...
echo.
pause

REM Check if Node.js is installed
echo [1/4] Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)
echo Node.js found!
node --version
echo.

REM Check if MongoDB is installed
echo [2/4] Checking MongoDB installation...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MongoDB may not be installed or not in PATH
    echo You can use MongoDB Atlas (cloud) instead
    echo Or download MongoDB from: https://www.mongodb.com/try/download/community
    echo.
) else (
    echo MongoDB found!
    mongod --version | findstr /C:"db version"
    echo.
)

REM Install backend dependencies
echo [3/4] Installing Backend Dependencies...
cd /d "%~dp0backend"
if not exist "package.json" (
    echo ERROR: backend/package.json not found!
    pause
    exit /b 1
)
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)
echo Backend dependencies installed successfully!
echo.

REM Install AI engine dependencies
echo [4/4] Installing AI Engine Dependencies...
cd /d "%~dp0ai-engine"
if not exist "package.json" (
    echo ERROR: ai-engine/package.json not found!
    pause
    exit /b 1
)
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install AI engine dependencies
    pause
    exit /b 1
)
echo AI Engine dependencies installed successfully!
echo.

cd /d "%~dp0"

echo ===================================================
echo    INSTALLATION COMPLETE!
echo ===================================================
echo.
echo All dependencies have been installed successfully!
echo.
echo Next Steps:
echo   1. Make sure MongoDB is running
echo   2. Configure backend/.env file
echo   3. Run START-ADVANCED.bat to start the app
echo.
echo For MongoDB setup:
echo   - Local: Start MongoDB service
echo   - Cloud: Get connection string from MongoDB Atlas
echo.
echo See QUICK-START-GUIDE.md for detailed instructions.
echo.
pause
