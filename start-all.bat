@echo off
title PDFinity Intelligent Workspace
echo ===================================================
echo Starting PDFinity Backend (Port 5000) and Frontend (Port 5173)
echo ===================================================

start "PDFinity Backend (Port 5000)" cmd /k "cd /d %~dp0server && node server.js"
timeout /t 2 /nobreak >nul
start "PDFinity Frontend (Port 5173)" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo Both servers launched successfully!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo ===================================================
