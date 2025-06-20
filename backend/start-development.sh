#!/bin/bash

# PixelFly Backend Development Startup Script
echo "🔧 Starting PixelFly Backend in Development Mode"

# Set development environment
export FLASK_ENV=development
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
echo "📦 Installing development dependencies..."
pip install -r requirements.txt

# Start the development server
echo "🔧 Starting Flask development server..."
echo "📍 Server will be available at: http://localhost:5001"
echo "🔄 Auto-reload enabled for development"
echo "⚠️  WARNING: This is a development server. Do not use it in production!"
echo ""
echo "🛑 To stop the server, press Ctrl+C"
echo ""

# Start Flask development server
python simple_server.py
