@echo off
cd /d "%~dp0"

echo Starting AI Student Companion Backend...
cd backend

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo Starting server on port 5000...
call npm start
