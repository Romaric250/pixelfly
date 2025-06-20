@echo off
REM PixelFly Backend Production Startup Script for Windows

echo 🚀 Starting PixelFly Backend in Production Mode

REM Set production environment
set FLASK_ENV=production
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
echo 📦 Installing production dependencies...
pip install -r requirements.txt

REM Check if Gunicorn is installed (Note: Gunicorn doesn't work on Windows)
echo ⚠️  Note: Gunicorn is not available on Windows
echo 🔧 Using Waitress server instead for Windows production deployment

REM Install Waitress for Windows
pip install waitress

REM Start the production server with Waitress
echo 🚀 Starting Waitress server...
echo 📍 Server will be available at: http://localhost:5001
echo 🔧 Using Waitress WSGI server for Windows
echo 📊 Threads: 4
echo.
echo 🛑 To stop the server, press Ctrl+C
echo.

REM Start Waitress
waitress-serve --host=0.0.0.0 --port=5001 --threads=4 wsgi:application
