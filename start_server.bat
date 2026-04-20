@echo off
echo Starting Intelligin Website Server...
echo Open Chrome and go to: http://localhost:5500
echo Press Ctrl+C to stop the server.
echo.
python -m http.server 5500
pause
