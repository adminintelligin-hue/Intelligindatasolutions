@echo off
echo Looking for your uploaded transparent logo...
powershell -Command "$source = (Get-ChildItem -Path 'C:\Users\Admin\.gemini\antigravity\brain\af24827a-ab39-4eb4-8691-49f0bc6a4c8c\*.png' | Sort-Object LastWriteTime -Descending | Select-Object -First 1).FullName; if ($source) { Copy-Item $source -Destination 'c:\intelligin Web\logo.png' -Force; Copy-Item $source -Destination 'c:\intelligin Web\favicon.png' -Force; Write-Host '✅ SUCCESS: Transparent Logo and Favicon applied perfectly!' -ForegroundColor Green } else { Write-Host '❌ Could not find logo.' -ForegroundColor Red }"
echo.
echo You can now press F5 in VS Code to see your website!
pause
