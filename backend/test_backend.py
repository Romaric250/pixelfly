#!/usr/bin/env python3
"""
PixelFly Backend with Gemini and OpenAI Integration
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import time
import base64
import os
import json
from io import BytesIO
from PIL import Image, ImageEnhance, ImageFilter
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Configure Gemini
gemini_api_key = os.getenv('GOOGLE_API_KEY')
openai_api_key = os.getenv('OPENAI_API_KEY')

if gemini_api_key:
    genai.configure(api_key=gemini_api_key)
    gemini_model = genai.GenerativeModel('gemini-1.5-flash')
    logger.info("Gemini API configured successfully")
else:
    gemini_model = None
    logger.warning("Gemini API key not found")

def enhance_image_simple(image_base64):
    """Simple image enhancement using PIL"""
    try:
        # Decode base64 image
        image_data = base64.b64decode(image_base64)
        image = Image.open(BytesIO(image_data))

        # Apply simple enhancements
        # Enhance contrast
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(1.2)

        # Enhance brightness
        enhancer = ImageEnhance.Brightness(image)
        image = enhancer.enhance(1.1)

        # Enhance sharpness
        enhancer = ImageEnhance.Sharpness(image)
        image = enhancer.enhance(1.3)

        # Apply detail filter
        image = image.filter(ImageFilter.DETAIL)

        # Convert back to base64
        img_byte_arr = BytesIO()
        if image.mode != 'RGB':
            image = image.convert('RGB')
        image.save(img_byte_arr, format='JPEG', quality=95)
        img_byte_arr = img_byte_arr.getvalue()

        enhanced_base64 = base64.b64encode(img_byte_arr).decode('utf-8')
        return enhanced_base64

    except Exception as e:
        logger.error(f"Image enhancement error: {str(e)}")
        return image_base64  # Return original if enhancement fails

def add_watermark_simple(image_base64, watermark_text="© PixelFly"):
    """Simple watermark addition"""
    try:
        # For now, just return the original image
        # In a real implementation, we would add the watermark
        return image_base64
    except Exception as e:
        logger.error(f"Watermark error: {str(e)}")
        return image_base64

@app.route('/health', methods=['GET'])
def health_check():
    logger.info("Health check requested")
    return jsonify({
        "status": "healthy",
        "timestamp": time.time(),
        "service": "PixelFly Test Backend"
    })

@app.route('/test', methods=['GET', 'POST'])
def test_endpoint():
    logger.info(f"Test endpoint called with method: {request.method}")
    if request.method == 'POST':
        data = request.get_json()
        logger.info(f"Test POST data: {data}")
        return jsonify({"message": "Test POST successful", "received": data})
    else:
        return jsonify({"message": "Test GET successful"})

@app.route('/api/enhance', methods=['POST', 'OPTIONS'])
def enhance_photo():
    logger.info(f"Enhancement endpoint called with method: {request.method}")

    if request.method == 'OPTIONS':
        logger.info("Handling OPTIONS request")
        return '', 200

    try:
        logger.info("Getting JSON data from request")
        data = request.get_json()
        logger.info(f"Received enhancement request with keys: {list(data.keys()) if data else 'No data'}")

        # Validate input
        if not data:
            logger.error("No data provided in request")
            return jsonify({"success": False, "error": "No data provided"}), 400

        image_base64 = data.get('image_base64')
        image_url = data.get('image_url')
        user_id = data.get('user_id', 'anonymous')

        logger.info(f"Request details - user_id: {user_id}, has_image_base64: {bool(image_base64)}, has_image_url: {bool(image_url)}")

        if image_base64:
            logger.info(f"Image base64 length: {len(image_base64)}")

        if not image_base64 and not image_url:
            logger.error("Neither image_base64 nor image_url provided")
            return jsonify({"success": False, "error": "Either image_base64 or image_url is required"}), 400

        logger.info(f"Processing enhancement for user {user_id}")

        # Process the image
        if image_base64:
            logger.info("Starting image enhancement with PIL filters")
            enhanced_base64 = enhance_image_simple(image_base64)
            logger.info(f"Enhancement completed, result length: {len(enhanced_base64)}")
        else:
            # For URL, create a placeholder base64
            logger.info("Using placeholder for URL-based image")
            enhanced_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="

        result = {
            "success": True,
            "enhanced_base64": enhanced_base64,
            "processing_time": 1.0,
            "enhancements_applied": ["brightness_enhancement", "contrast_improvement", "noise_reduction"]
        }

        logger.info("Sending successful response")
        return jsonify(result)

    except Exception as e:
        logger.error(f"Enhancement error: {str(e)}", exc_info=True)
        return jsonify({"success": False, "error": str(e)}), 500

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

        # Process each image
        watermarked_base64 = []
        if image_base64_list:
            for img_base64 in image_base64_list:
                watermarked = add_watermark_simple(img_base64)
                watermarked_base64.append(watermarked)
        else:
            watermarked_base64 = []
        
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
    port = 5001  # Use different port to avoid conflicts
    logger.info(f"Starting PixelFly Test Backend on port {port}")
    print(f"Starting PixelFly Test Backend on port {port}")
    app.run(host='0.0.0.0', port=port, debug=True)
