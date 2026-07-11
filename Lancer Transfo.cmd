@echo off
rem === Lanceur de l'app Transfo ===
rem Double-clique sur ce fichier : il installe ce qu'il faut (la 1re fois),
rem demarre l'app et ouvre ton navigateur tout seul.

cd /d "%~dp0"
title Transfo - Matteo

where node >nul 2>nul
if errorlevel 1 (
  echo [ERREUR] Node.js n'est pas installe. Telecharge-le sur https://nodejs.org
  pause
  exit /b 1
)

if not exist node_modules (
  echo Premiere utilisation : installation des dependances, ca prend ~1 minute...
  call npm install
)

echo.
echo  ============================================
echo   Transfo demarre sur http://localhost:5173
echo   Laisse cette fenetre ouverte pendant que
echo   tu utilises l'app. Ferme-la pour arreter.
echo  ============================================
echo.
call npx vite --open
pause
