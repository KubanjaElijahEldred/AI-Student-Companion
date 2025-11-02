# AI Student Companion - PowerShell Startup Script
param(
    [switch]$NoWait
)

# Set console properties
$Host.UI.RawUI.WindowTitle = "AI Student Companion - Startup"
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "    🎓 AI STUDENT COMPANION - COMPLETE STARTUP" -ForegroundColor Yellow
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    try {
        $connection = New-Object System.Net.Sockets.TcpClient
        $connection.Connect("localhost", $Port)
        $connection.Close()
        return $true
    }
    catch {
        return $false
    }
}

# Function to wait for service to start
function Wait-ForService {
    param([int]$Port, [string]$ServiceName, [int]$TimeoutSeconds = 30)
    
    Write-Host "⏳ Waiting for $ServiceName to start on port $Port..." -ForegroundColor Yellow
    
    $timeout = (Get-Date).AddSeconds($TimeoutSeconds)
    while ((Get-Date) -lt $timeout) {
        if (Test-Port -Port $Port) {
            Write-Host "✅ $ServiceName is ready!" -ForegroundColor Green
            return $true
        }
        Start-Sleep -Seconds 1
    }
    
    Write-Host "⚠️  $ServiceName failed to start within $TimeoutSeconds seconds" -ForegroundColor Red
    return $false
}

# Check if Ollama is installed
try {
    $ollamaVersion = & ollama --version 2>$null
    Write-Host "✅ Ollama found: $ollamaVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ ERROR: Ollama is not installed!" -ForegroundColor Red
    Write-Host "Please install Ollama from: https://ollama.ai/download" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if Node.js is available
try {
    $nodeVersion = & node --version 2>$null
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ ERROR: Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""

# Kill existing processes
Write-Host "[0/4] 🧹 Cleaning up existing processes..." -ForegroundColor Cyan
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Get-Process -Name "ollama" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Start Ollama Service
Write-Host "[1/4] 🚀 Starting Ollama Service..." -ForegroundColor Cyan
if (-not (Test-Port -Port 11434)) {
    Start-Process -FilePath "ollama" -ArgumentList "serve" -WindowStyle Minimized
    if (-not (Wait-ForService -Port 11434 -ServiceName "Ollama")) {
        Write-Host "Failed to start Ollama service" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    Write-Host "✅ Ollama service already running" -ForegroundColor Green
}

# Start AI Engine
Write-Host "[2/4] 🧠 Starting AI Engine..." -ForegroundColor Cyan
$aiEnginePath = Join-Path $PSScriptRoot "ai-engine"
if (Test-Path $aiEnginePath) {
    Start-Process -FilePath "node" -ArgumentList "ollamaEngine.js" -WorkingDirectory $aiEnginePath -WindowStyle Minimized
    Wait-ForService -Port 3001 -ServiceName "AI Engine" | Out-Null
} else {
    Write-Host "⚠️  AI Engine directory not found" -ForegroundColor Yellow
}

# Start Backend Server
Write-Host "[3/4] 🔧 Starting Backend Server..." -ForegroundColor Cyan
$backendPath = Join-Path $PSScriptRoot "backend"
if (Test-Path $backendPath) {
    Start-Process -FilePath "node" -ArgumentList "demoServer.js" -WorkingDirectory $backendPath -WindowStyle Minimized
    Wait-ForService -Port 5001 -ServiceName "Backend Server" | Out-Null
} else {
    Write-Host "⚠️  Backend directory not found" -ForegroundColor Yellow
}

# Open Web Interface
Write-Host "[4/4] 🌐 Opening AI Student Companion..." -ForegroundColor Cyan
$jsAppPath = Join-Path $PSScriptRoot "js-app.html"
if (Test-Path $jsAppPath) {
    Start-Process $jsAppPath
    Write-Host "✅ JavaScript application opened!" -ForegroundColor Green
} else {
    Write-Host "⚠️  js-app.html not found, trying backend URL..." -ForegroundColor Yellow
    Start-Process "http://localhost:5001"
    Write-Host "✅ Opening web interface via backend server!" -ForegroundColor Green
}

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "    ✅ AI STUDENT COMPANION IS NOW RUNNING!" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# Display service status
Write-Host "🔗 Services Status:" -ForegroundColor White
Write-Host "   - Ollama Service:  http://localhost:11434" -ForegroundColor $(if (Test-Port 11434) { "Green" } else { "Red" })
Write-Host "   - AI Engine:       http://localhost:3001" -ForegroundColor $(if (Test-Port 3001) { "Green" } else { "Red" })
Write-Host "   - Backend Server:  http://localhost:5001" -ForegroundColor $(if (Test-Port 5001) { "Green" } else { "Red" })
Write-Host ""

Write-Host "🎯 Features Available:" -ForegroundColor White
Write-Host "   - 🔐 User Authentication with Profile Pictures" -ForegroundColor Cyan
Write-Host "   - 📸 Camera Capture & Gallery Selection" -ForegroundColor Cyan
Write-Host "   - 🌓 Light/Dark Mode Toggle" -ForegroundColor Cyan
Write-Host "   - 🤖 Raw AI Model Integration (llama3.2:1b)" -ForegroundColor Cyan
Write-Host "   - 💬 Real-time Chat Interface" -ForegroundColor Cyan
Write-Host ""

Write-Host "📝 Instructions:" -ForegroundColor White
Write-Host "   1. Register a new account or login" -ForegroundColor Gray
Write-Host "   2. Add your profile picture (camera/gallery)" -ForegroundColor Gray
Write-Host "   3. Start chatting with Mr. Elijah!" -ForegroundColor Gray
Write-Host ""

if (-not $NoWait) {
    Write-Host "Press any key to stop all services..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    
    Write-Host ""
    Write-Host "🛑 Shutting down AI Student Companion..." -ForegroundColor Red
    
    # Stop all services
    Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    Get-Process -Name "ollama" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    
    Write-Host "✅ All services stopped successfully." -ForegroundColor Green
    Write-Host "👋 Thank you for using AI Student Companion!" -ForegroundColor Cyan
}
