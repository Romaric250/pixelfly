"""
Simple Flask test app to verify the backend setup
"""

from flask import Flask, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return jsonify({
        "message": "PixelFly Backend API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "test": "/test"
        }
    })

@app.route('/health')
def health():
    return jsonify({
        "status": "healthy",
        "service": "PixelFly Backend",
        "version": "1.0.0"
    })

@app.route('/test')
def test():
    return jsonify({
        "message": "Backend is working!",
        "python_packages": {
            "flask": "installed",
            "flask_cors": "installed",
            "pillow": "installed",
            "opencv": "installed",
            "numpy": "installed",
            "requests": "installed"
        }
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"Starting PixelFly Test Backend on port {port}")
    app.run(host='0.0.0.0', port=port, debug=True)
