@echo off
title PDFnerd Intelligent Workspace
echo ===================================================
echo Starting PDFnerd Backend (Port 5000) and Frontend (Port 5173)
echo ===================================================

start "PDFnerd Backend (Port 5000)" cmd /k "cd /d %~dp0server && node server.js"
timeout /t 2 /nobreak >nul
start "PDFnerd Frontend (Port 5173)" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo Both servers launched successfully!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo ===================================================
