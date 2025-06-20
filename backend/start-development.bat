@echo off
REM PixelFly Backend Development Startup Script for Windows

echo 🔧 Starting PixelFly Backend in Development Mode

REM Set development environment
set FLASK_ENV=development
set PYTHONPATH=%cd%

REM Check if virtual environment exists
if not exist "venv" if not exist ".venv" if "%VIRTUAL_ENV%"=="" (
    echo ⚠️  No virtual environment detected. Creating one...
    python -m venv venv
    call venv\Scripts\activate.bat
    echo ✅ Virtual environment created and activated
) else (
    echo ✅ Virtual environment detected
    if exist "venv" (
        call venv\Scripts\activate.bat
    ) else if exist ".venv" (
        call .venv\Scripts\activate.bat
    )
)

REM Install/upgrade dependencies
echo 📦 Installing development dependencies...
pip install -r requirements.txt

REM Start the development server
echo 🔧 Starting Flask development server...
echo 📍 Server will be available at: http://localhost:5001
echo 🔄 Auto-reload enabled for development
echo ⚠️  WARNING: This is a development server. Do not use it in production!
echo.
echo 🛑 To stop the server, press Ctrl+C
echo.

REM Start Flask development server
python simple_server.py
