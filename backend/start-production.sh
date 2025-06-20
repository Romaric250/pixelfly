#!/bin/bash

# PixelFly Backend Production Startup Script
echo "🚀 Starting PixelFly Backend in Production Mode"

# Set production environment
export FLASK_ENV=production
export PYTHONPATH="$(pwd)"

# Check if virtual environment exists
if [ ! -d "venv" ] && [ ! -d ".venv" ] && [ -z "$VIRTUAL_ENV" ]; then
    echo "⚠️  No virtual environment detected. Creating one..."
    python3 -m venv venv
    source venv/bin/activate
    echo "✅ Virtual environment created and activated"
else
    echo "✅ Virtual environment detected"
    if [ -d "venv" ]; then
        source venv/bin/activate
    elif [ -d ".venv" ]; then
        source .venv/bin/activate
    fi
fi

# Install/upgrade dependencies
echo "📦 Installing production dependencies..."
pip install -r requirements.txt

# Check if Gunicorn is installed
if ! command -v gunicorn &> /dev/null; then
    echo "❌ Gunicorn not found. Installing..."
    pip install gunicorn==21.2.0
fi

# Start the production server
echo "🚀 Starting Gunicorn server..."
echo "📍 Server will be available at: http://localhost:5001"
echo "🔧 Configuration: gunicorn.conf.py"
echo "📊 Workers: $(python -c 'import multiprocessing; print(multiprocessing.cpu_count() * 2 + 1)')"
echo ""
echo "🛑 To stop the server, press Ctrl+C"
echo ""

# Start Gunicorn with configuration
gunicorn -c gunicorn.conf.py wsgi:application
