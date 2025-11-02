@echo off
cd /d "%~dp0"

REM Try PowerShell first (better experience)
powershell -ExecutionPolicy Bypass -File "START-APP.ps1" 2>nul
if %errorlevel% equ 0 goto END

REM Fallback to batch script
call "START-APP.bat"

:END
