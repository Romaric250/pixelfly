#!/usr/bin/env python3
"""
Simple test backend to verify the connection
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import time
import base64
from io import BytesIO
from PIL import Image

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "timestamp": time.time(),
        "service": "PixelFly Test Backend"
    })

@app.route('/api/enhance', methods=['POST', 'OPTIONS'])
def enhance_photo():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        logger.info(f"Received enhancement request: {data.keys() if data else 'No data'}")
        
        # Validate input
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        image_base64 = data.get('image_base64')
        image_url = data.get('image_url')
        user_id = data.get('user_id', 'anonymous')
        
        if not image_base64 and not image_url:
            return jsonify({"error": "Either image_base64 or image_url is required"}), 400
        
        logger.info(f"Processing enhancement for user {user_id}")
        
        # Simulate processing
        time.sleep(1)  # Simulate AI processing time
        
        # If we have base64, return the same image as "enhanced"
        if image_base64:
            # Simple test: return the same image
            enhanced_base64 = image_base64
        else:
            # For URL, create a placeholder base64
            enhanced_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
        
        return jsonify({
            "success": True,
            "enhanced_base64": enhanced_base64,
            "processing_time": 1.0,
            "enhancements_applied": ["brightness_enhancement", "contrast_improvement", "noise_reduction"]
        })
        
    except Exception as e:
        logger.error(f"Enhancement error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/watermark', methods=['POST', 'OPTIONS'])
def watermark_photos():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        logger.info(f"Received watermark request: {data.keys() if data else 'No data'}")
        
        # Validate input
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        image_base64_list = data.get('image_base64_list', [])
        image_urls = data.get('image_urls', [])
        user_id = data.get('user_id', 'anonymous')
        
        if not image_base64_list and not image_urls:
            return jsonify({"error": "Either image_base64_list or image_urls is required"}), 400
        
        images_to_process = image_base64_list or image_urls
        logger.info(f"Processing {len(images_to_process)} images for user {user_id}")
        
        # Simulate processing
        time.sleep(len(images_to_process) * 0.5)
        
        # Return the same images as "watermarked"
        watermarked_base64 = image_base64_list if image_base64_list else []
        
        return jsonify({
            "success": True,
            "watermarked_base64": watermarked_base64,
            "processing_time": len(images_to_process) * 0.5,
            "processed_count": len(images_to_process)
        })
        
    except Exception as e:
        logger.error(f"Watermark error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/')
def index():
    return jsonify({
        "message": "PixelFly Test Backend",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "enhance": "/api/enhance",
            "watermark": "/api/watermark"
        }
    })

if __name__ == '__main__':
    logger.info("Starting PixelFly Test Backend on port 5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
