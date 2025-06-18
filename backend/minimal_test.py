#!/usr/bin/env python3
"""
Minimal test to check if Flask is working
"""

from flask import Flask, jsonify
from flask_cors import CORS
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route('/health')
def health():
    logger.info("Health check requested")
    return jsonify({"status": "healthy", "message": "Backend is running!"})

@app.route('/')
def index():
    logger.info("Index requested")
    return jsonify({"message": "PixelFly Backend is running!"})

if __name__ == '__main__':
    logger.info("Starting minimal test backend on port 5000")
    print("Starting minimal test backend on port 5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
