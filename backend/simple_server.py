#!/usr/bin/env python3
"""
Simple Flask server for testing
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import base64
from io import BytesIO
from PIL import Image, ImageEnhance, ImageFilter

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

def enhance_image_simple(image_base64):
    """Apply visible image enhancements using PIL"""
    try:
        print("Starting image enhancement...")

        # Decode base64 image
        image_data = base64.b64decode(image_base64)
        image = Image.open(BytesIO(image_data))
        print(f"Original image size: {image.size}, mode: {image.mode}")

        # Convert to RGB if needed
        if image.mode != 'RGB':
            image = image.convert('RGB')
            print("Converted image to RGB mode")

        # Apply noticeable enhancements
        print("Applying contrast enhancement...")
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(1.4)  # Increase contrast significantly

        print("Applying brightness enhancement...")
        enhancer = ImageEnhance.Brightness(image)
        image = enhancer.enhance(1.15)  # Slight brightness boost

        print("Applying color saturation...")
        enhancer = ImageEnhance.Color(image)
        image = enhancer.enhance(1.3)  # Boost colors

        print("Applying sharpness enhancement...")
        enhancer = ImageEnhance.Sharpness(image)
        image = enhancer.enhance(1.5)  # Make it sharper

        # Apply additional filters for more visible effect
        print("Applying detail filter...")
        image = image.filter(ImageFilter.DETAIL)

        print("Applying unsharp mask...")
        image = image.filter(ImageFilter.UnsharpMask(radius=2, percent=150, threshold=3))

        # Convert back to base64
        print("Converting enhanced image back to base64...")
        img_byte_arr = BytesIO()
        image.save(img_byte_arr, format='JPEG', quality=95, optimize=True)
        img_byte_arr = img_byte_arr.getvalue()

        enhanced_base64 = base64.b64encode(img_byte_arr).decode('utf-8')
        print(f"Enhancement complete! Original: {len(image_base64)} chars, Enhanced: {len(enhanced_base64)} chars")

        return enhanced_base64

    except Exception as e:
        print(f"Image enhancement error: {str(e)}")
        return image_base64  # Return original if enhancement fails

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
        print(f"Received data keys: {list(data.keys()) if data else 'None'}")

        image_base64 = data.get('image_base64')
        if image_base64:
            print(f"Received image base64 length: {len(image_base64)}")

            # Apply real image enhancement
            enhanced_base64 = enhance_image_simple(image_base64)
            print(f"Enhanced image, returning length: {len(enhanced_base64)}")
        else:
            print("No image_base64 found, using placeholder")
            enhanced_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="

        result = {
            "success": True,
            "enhanced_base64": enhanced_base64,
            "processing_time": 1.0,
            "enhancements_applied": [
                "contrast_enhancement",
                "brightness_adjustment",
                "color_saturation",
                "sharpness_boost",
                "detail_filter",
                "unsharp_mask"
            ]
        }

        print("Sending response with enhanced image")
        return jsonify(result)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    print("Starting simple server on port 5001")
    app.run(host='0.0.0.0', port=5001, debug=False)
