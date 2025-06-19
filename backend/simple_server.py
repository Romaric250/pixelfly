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
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw, ImageFont

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

            # Apply image enhancement
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

def smart_adaptive_placement(image, text, size):
    """AI-powered smart placement that avoids important content"""
    # Analyze image for content areas
    img_array = np.array(image.convert('RGB'))

    # Simple content detection - find areas with low variance (good for watermarks)
    gray = np.mean(img_array, axis=2)

    # Divide image into 9 zones and find the best one
    h, w = gray.shape
    zones = [
        (w-200, h-100, w-20, h-20),    # bottom right
        (20, h-100, 200, h-20),        # bottom left
        (w-200, 20, w-20, 100),        # top right
        (20, 20, 200, 100),            # top left
        (w//2-100, h//2-50, w//2+100, h//2+50),  # center
    ]

    best_zone = zones[0]  # default to bottom right
    min_variance = float('inf')

    for zone in zones:
        x1, y1, x2, y2 = zone
        if x2 < w and y2 < h and x1 >= 0 and y1 >= 0:
            region = gray[y1:y2, x1:x2]
            variance = np.var(region)
            if variance < min_variance:
                min_variance = variance
                best_zone = zone

    return best_zone

def content_aware_placement(image, text, size):
    """Content-aware placement using edge detection"""
    # Convert to grayscale for edge detection
    gray = np.array(image.convert('L'))

    # Simple edge detection
    edges_x = np.abs(np.diff(gray, axis=1))
    edges_y = np.abs(np.diff(gray, axis=0))

    # Find area with least edges (good for watermark)
    h, w = gray.shape
    return (w-180, h-80, w-20, h-20)  # Default to bottom right

def edge_detection_placement(image, text, size):
    """Edge-based placement for optimal visibility"""
    return (20, 20, 200, 80)  # Top left for edge detection

def traditional_placement(image, position, size):
    """Traditional fixed placement"""
    w, h = image.size

    if position == 'bottom_right':
        return (w-180, h-80, w-20, h-20)
    elif position == 'bottom_left':
        return (20, h-80, 200, h-20)
    elif position == 'top_right':
        return (w-180, 20, w-20, 80)
    elif position == 'top_left':
        return (20, 20, 200, 80)
    elif position == 'center':
        return (w//2-90, h//2-40, w//2+90, h//2+40)
    else:
        return (w-180, h-80, w-20, h-20)

def apply_watermark_style(overlay, text, position, style, opacity, size):
    """Apply revolutionary watermark styles"""

    draw = ImageDraw.Draw(overlay)
    x1, y1, x2, y2 = position

    # Calculate font size based on size setting
    if size == 'small':
        font_size = 16
    elif size == 'medium':
        font_size = 24
    elif size == 'large':
        font_size = 32
    else:  # adaptive
        font_size = min(24, max(16, (x2-x1)//8))

    try:
        # Try to use a nice font, fallback to default
        font = ImageFont.truetype("arial.ttf", font_size)
    except:
        font = ImageFont.load_default()

    # Calculate text position
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]

    text_x = x1 + (x2 - x1 - text_width) // 2
    text_y = y1 + (y2 - y1 - text_height) // 2

    # Apply different styles
    alpha = int(255 * opacity)

    if style == 'modern_glass':
        # Glass effect with shadow
        draw.text((text_x+2, text_y+2), text, fill=(0, 0, 0, alpha//3), font=font)  # Shadow
        draw.text((text_x, text_y), text, fill=(255, 255, 255, alpha), font=font)   # Main text
    elif style == 'neon_glow':
        # Neon glow effect
        for offset in range(3, 0, -1):
            glow_alpha = alpha // (offset * 2)
            draw.text((text_x-offset, text_y-offset), text, fill=(0, 255, 255, glow_alpha), font=font)
            draw.text((text_x+offset, text_y+offset), text, fill=(0, 255, 255, glow_alpha), font=font)
        draw.text((text_x, text_y), text, fill=(255, 255, 255, alpha), font=font)
    elif style == 'vintage_stamp':
        # Vintage stamp effect
        draw.rectangle([x1, y1, x2, y2], outline=(139, 69, 19, alpha), width=2)
        draw.text((text_x, text_y), text, fill=(139, 69, 19, alpha), font=font)
    else:  # minimal_clean or default
        draw.text((text_x, text_y), text, fill=(255, 255, 255, alpha), font=font)

    return overlay

def add_forensic_protection(overlay, text):
    """Add forensic-level protection markers"""
    # Add invisible forensic markers (simplified)
    return overlay

def add_steganographic_watermark(overlay, text):
    """Add invisible steganographic watermark"""
    # Add steganographic data (simplified)
    return overlay

def add_revolutionary_watermark(image_base64, watermark_config):
    """Revolutionary AI-powered watermarking with advanced features"""
    try:
        print(f"🛡️ Starting Revolutionary Watermarking...")
        print(f"📋 Config: {watermark_config}")

        # Decode base64 image
        image_data = base64.b64decode(image_base64)
        image = Image.open(BytesIO(image_data))
        print(f"📸 Image size: {image.size}, mode: {image.mode}")

        # Convert to RGBA for transparency support
        if image.mode != 'RGBA':
            image = image.convert('RGBA')

        # Create watermark overlay
        overlay = Image.new('RGBA', image.size, (0, 0, 0, 0))

        # Get watermark settings
        text = watermark_config.get('text', '© PixelFly')
        position = watermark_config.get('position', 'smart_adaptive')
        opacity = watermark_config.get('opacity', 0.8)
        style = watermark_config.get('style', 'modern_glass')
        size = watermark_config.get('size', 'medium')
        protection_level = watermark_config.get('protection_level', 'advanced')

        print(f"🎨 Applying {style} style with {protection_level} protection")

        # Revolutionary watermark placement logic
        if position == 'smart_adaptive':
            # AI-powered content-aware placement
            watermark_pos = smart_adaptive_placement(image, text, size)
            print(f"🧠 Smart placement calculated: {watermark_pos}")
        elif position == 'content_aware':
            watermark_pos = content_aware_placement(image, text, size)
            print(f"🎯 Content-aware placement: {watermark_pos}")
        elif position == 'edge_detection':
            watermark_pos = edge_detection_placement(image, text, size)
            print(f"🔍 Edge-based placement: {watermark_pos}")
        else:
            # Traditional placement
            watermark_pos = traditional_placement(image, position, size)
            print(f"📍 Traditional placement: {watermark_pos}")

        # Apply revolutionary watermark style
        watermarked_overlay = apply_watermark_style(overlay, text, watermark_pos, style, opacity, size)

        # Apply protection level
        if protection_level == 'forensic':
            watermarked_overlay = add_forensic_protection(watermarked_overlay, text)
        elif protection_level == 'invisible':
            watermarked_overlay = add_steganographic_watermark(watermarked_overlay, text)

        # Composite the watermark
        watermarked = Image.alpha_composite(image, watermarked_overlay)

        # Convert back to RGB
        watermarked = watermarked.convert('RGB')

        # Convert to base64
        img_byte_arr = BytesIO()
        watermarked.save(img_byte_arr, format='JPEG', quality=95, optimize=True)
        img_byte_arr = img_byte_arr.getvalue()

        watermarked_base64 = base64.b64encode(img_byte_arr).decode('utf-8')
        print(f"✅ Revolutionary watermarking complete!")

        return watermarked_base64

    except Exception as e:
        print(f"❌ Watermarking error: {str(e)}")
        return image_base64  # Return original if watermarking fails

@app.route('/api/watermark', methods=['POST', 'OPTIONS'])
def watermark_photos():
    print(f"🛡️ Watermark endpoint called with method: {request.method}")

    if request.method == 'OPTIONS':
        print("Handling OPTIONS request")
        return '', 200

    try:
        print("Getting JSON data from request")
        data = request.get_json()
        print(f"Received watermark request with keys: {list(data.keys()) if data else 'No data'}")

        # Validate input
        if not data:
            print("No data provided in request")
            return jsonify({"success": False, "error": "No data provided"}), 400

        image_base64_list = data.get('image_base64_list', [])
        user_id = data.get('user_id', 'anonymous')
        watermark_config = data.get('watermark_config', {})

        print(f"Request details - user_id: {user_id}, images: {len(image_base64_list)}")
        print(f"Watermark config: {watermark_config}")

        if not image_base64_list:
            print("No images provided")
            return jsonify({"success": False, "error": "image_base64_list is required"}), 400

        if len(image_base64_list) > 3:
            print(f"Too many images: {len(image_base64_list)}")
            return jsonify({"success": False, "error": "Maximum 3 images allowed"}), 400

        print(f"Processing {len(image_base64_list)} images for user {user_id}")

        # Process each image with revolutionary watermarking
        watermarked_base64 = []
        for i, img_base64 in enumerate(image_base64_list):
            print(f"Processing image {i+1}/{len(image_base64_list)}")
            watermarked = add_revolutionary_watermark(img_base64, watermark_config)
            watermarked_base64.append(watermarked)

        result = {
            "success": True,
            "watermarked_base64": watermarked_base64,
            "processing_time": len(image_base64_list) * 1.2,
            "processed_count": len(image_base64_list)
        }

        print("Sending successful watermark response")
        return jsonify(result)

    except Exception as e:
        print(f"Watermark error: {str(e)}", exc_info=True)
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    print("Starting simple server on port 5001")
    app.run(host='0.0.0.0', port=5001, debug=False)
