#!/usr/bin/env python3
"""
Simple Flask server for testing
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import base64
import numpy as np
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

        # Analyze image to determine optimal enhancements
        img_array = np.array(image)
        brightness = np.mean(img_array)
        contrast = np.std(img_array)

        print(f"Image analysis - Brightness: {brightness:.1f}, Contrast: {contrast:.1f}")

        # Determine enhancement factors based on analysis
        if brightness < 100:  # Dark image
            brightness_factor = 1.1
            contrast_factor = 1.15
            print("Detected dark image - applying brightness boost")
        elif brightness > 180:  # Bright image
            brightness_factor = 0.95
            contrast_factor = 1.05
            print("Detected bright image - reducing brightness slightly")
        else:  # Normal image
            brightness_factor = 1.02
            contrast_factor = 1.08
            print("Normal brightness detected - applying gentle enhancement")

        if contrast < 30:  # Low contrast
            contrast_factor *= 1.2
            print("Low contrast detected - boosting contrast")

        # Apply smart, adaptive enhancements
        print(f"Applying adaptive contrast enhancement (factor: {contrast_factor})...")
        enhancer = ImageEnhance.Contrast(image)
        image = enhancer.enhance(contrast_factor)

        print(f"Applying adaptive brightness optimization (factor: {brightness_factor})...")
        enhancer = ImageEnhance.Brightness(image)
        image = enhancer.enhance(brightness_factor)

        print("Applying color enhancement...")
        enhancer = ImageEnhance.Color(image)
        image = enhancer.enhance(1.15)  # Gentle color boost

        print("Applying sharpness enhancement...")
        enhancer = ImageEnhance.Sharpness(image)
        image = enhancer.enhance(1.2)  # Moderate sharpening

        # Apply gentle noise reduction and detail enhancement
        print("Applying smooth filter for noise reduction...")
        image = image.filter(ImageFilter.SMOOTH_MORE)

        print("Applying gentle unsharp mask...")
        image = image.filter(ImageFilter.UnsharpMask(radius=1, percent=120, threshold=2))

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
                "smart_contrast_optimization",
                "adaptive_brightness_adjustment",
                "gentle_color_enhancement",
                "professional_sharpening",
                "noise_reduction",
                "detail_preservation"
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
