# VidlyzerBot Audio Fix Script for Windows
# Run this script in PowerShell as Administrator

Write-Host "🔧 VidlyzerBot Audio Fix Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Function to run command and check result
function Run-Command {
    param(
        [string]$Command,
        [string]$Description
    )
    
    Write-Host "`n📦 $Description..." -ForegroundColor Yellow
    try {
        Invoke-Expression $Command
        Write-Host "✅ $Description completed successfully" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ $Description failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Check Node.js and npm versions
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
    
    # Check if Node.js version is compatible
    $nodeVersionNumber = $nodeVersion -replace 'v', ''
    $majorVersion = [int]($nodeVersionNumber.Split('.')[0])
    
    if ($majorVersion -lt 18) {
        Write-Host "⚠️  Warning: Node.js version is quite old. Consider updating to Node.js 20.x LTS" -ForegroundColor Yellow
    }
    elseif ($majorVersion -eq 18) {
        Write-Host "⚠️  Note: Using Node.js 18.x. Some packages may show warnings. This is normal." -ForegroundColor Yellow
    }
    else {
        Write-Host "✅ Node.js version is up to date" -ForegroundColor Green
    }
}
catch {
    Write-Host "❌ Node.js/npm is not available. Please install Node.js first." -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n🚀 Starting audio system fix...`n" -ForegroundColor Cyan

# Step 1: Clean existing installation
Write-Host "Step 1: Cleaning existing installation" -ForegroundColor Magenta
if (Test-Path "node_modules") {
    Run-Command "Remove-Item -Recurse -Force node_modules" "Removing node_modules"
}
if (Test-Path "package-lock.json") {
    Run-Command "Remove-Item -Force package-lock.json" "Removing package-lock.json"
}

# Step 2: Install dependencies
Write-Host "`nStep 2: Installing dependencies" -ForegroundColor Magenta
if (-not (Run-Command "npm install" "Installing all dependencies")) {
    Write-Host "❌ Failed to install dependencies. Please run manually:" -ForegroundColor Red
    Write-Host "   npm install" -ForegroundColor Yellow
    exit 1
}

# Step 3: Verify critical packages
Write-Host "`nStep 3: Verifying critical packages" -ForegroundColor Magenta
$criticalPackages = @(
    "@discordjs/opus",
    "@discordjs/voice", 
    "discord-player",
    "ffmpeg-static",
    "prism-media"
)

$allPackagesOk = $true
foreach ($pkg in $criticalPackages) {
    $packagePath = "node_modules\$pkg"
    if (Test-Path $packagePath) {
        Write-Host "✅ $pkg - OK" -ForegroundColor Green
    }
    else {
        Write-Host "❌ $pkg - MISSING" -ForegroundColor Red
        $allPackagesOk = $false
    }
}

if (-not $allPackagesOk) {
    Write-Host "`n❌ Some critical packages are missing. Please install manually:" -ForegroundColor Red
    Write-Host "   npm install @discordjs/opus @discordjs/voice discord-player ffmpeg-static prism-media" -ForegroundColor Yellow
    exit 1
}

# Step 4: Check bot files
Write-Host "`nStep 4: Checking bot configuration files" -ForegroundColor Magenta
$botFiles = @("src\index.js", "src\features\music\index.js", ".env.example")
foreach ($file in $botFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file - OK" -ForegroundColor Green
    }
    else {
        Write-Host "❌ $file - MISSING" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Audio fix completed!" -ForegroundColor Green
Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Make sure your .env file is properly configured" -ForegroundColor White
Write-Host "2. Start the bot: npm run bot" -ForegroundColor White
Write-Host "3. Test with: /play test song" -ForegroundColor White
Write-Host "4. Test radio: /radio start lofi" -ForegroundColor White
Write-Host "`n✨ The Opus encoding errors should now be resolved!" -ForegroundColor Green

Write-Host "`nPress any key to continue..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")