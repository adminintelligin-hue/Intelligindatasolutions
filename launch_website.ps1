# Intelligin Website Launcher
# This script copies the real logo and starts the web server

Write-Host "Setting up Intelligin website..." -ForegroundColor Cyan

# Step 1: Copy the real logo to the website folder
# The logo file shared in the chat is saved at:
$logoSource = "C:\Users\Admin\.gemini\antigravity\brain\af24827a-ab39-4eb4-8691-49f0bc6a4c8c\intelligin_logo_1776700841205.png"
$websiteDir = "c:\intelligin Web"

if (Test-Path $logoSource) {
    Copy-Item $logoSource "$websiteDir\logo.png" -Force
    Copy-Item $logoSource "$websiteDir\favicon.png" -Force
    Write-Host "✓ Real logo copied successfully!" -ForegroundColor Green
} else {
    Write-Host "Logo file not found at expected path. Please copy your logo manually as logo.png" -ForegroundColor Yellow
}

# Step 2: Start the web server
Write-Host ""
Write-Host "Starting web server on http://localhost:5500" -ForegroundColor Cyan
Write-Host "Opening Chrome..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server when done." -ForegroundColor Gray
Write-Host ""

# Open Chrome
Start-Process "chrome" "http://localhost:5500/index.html" -ErrorAction SilentlyContinue

# Start server
python -m http.server 5500 --directory $websiteDir
