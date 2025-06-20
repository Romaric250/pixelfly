#!/usr/bin/env python3
"""
WSGI entry point for PixelFly Backend
Production-ready Flask application with Gunicorn
"""

import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(__file__))

# Import the Flask application
try:
    from simple_server import app
    print("✅ Successfully imported Flask app from simple_server")
except ImportError as e:
    print(f"❌ Failed to import Flask app: {e}")
    # Fallback to API index if simple_server fails
    try:
        from api.index import app
        print("✅ Successfully imported Flask app from api.index")
    except ImportError as e2:
        print(f"❌ Failed to import from api.index: {e2}")
        raise

# Configure for production
if __name__ != "__main__":
    # Running under WSGI server (Gunicorn)
    print("🚀 Running under WSGI server (production mode)")
    app.config['DEBUG'] = False
    app.config['TESTING'] = False
else:
    # Running directly (development mode)
    print("🔧 Running in development mode")
    app.config['DEBUG'] = True

# WSGI application object
application = app

if __name__ == "__main__":
    # This allows running the file directly for testing
    print("🧪 Running Flask app directly (development mode)")
    app.run(
        host='0.0.0.0',
        port=int(os.getenv('PORT', 5001)),
        debug=True
    )
