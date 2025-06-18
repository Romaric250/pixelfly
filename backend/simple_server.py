#!/usr/bin/env python3
"""
Simple Flask server for testing
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route('/health')
def health():
    print("Health check requested")
    return jsonify({"status": "healthy"})

@app.route('/api/enhance', methods=['POST', 'OPTIONS'])
def enhance():
    print(f"Enhance endpoint called with method: {request.method}")
    
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        print(f"Received data: {data}")
        
        return jsonify({
            "success": True,
            "enhanced_base64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
            "processing_time": 1.0,
            "enhancements_applied": ["test_enhancement"]
        })
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    print("Starting simple server on port 5001")
    app.run(host='0.0.0.0', port=5001, debug=False)
