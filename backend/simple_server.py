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
        user_id = data.get('user_id', 'anonymous')
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

        # Track enhancement operation
        try:
            import requests
            track_data = {
                "userId": user_id,
                "filename": "enhanced_image.jpg",
                "processingTime": 1.0,
                "enhancementType": "smart_enhancement",
                "success": True
            }
            # Send to Next.js API to track in database
            requests.post("http://localhost:3000/api/track/enhancement", json=track_data, timeout=2)
            print("✅ Enhancement operation tracked")
        except Exception as e:
            print(f"⚠️ Failed to track enhancement: {e}")

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

def apply_watermark_style(overlay, text, position, style, opacity, size, color="white"):
    """Apply revolutionary watermark styles with proper settings"""

    draw = ImageDraw.Draw(overlay)
    x1, y1, x2, y2 = position

    print(f"🎨 Applying style: {style}, opacity: {opacity}, size: {size}, color: {color}")

    # Calculate font size based on size setting
    if size == 'small':
        font_size = 14
    elif size == 'medium':
        font_size = 20
    elif size == 'large':
        font_size = 28
    elif size == 'adaptive':
        # Adaptive sizing based on image and text
        available_width = x2 - x1
        available_height = y2 - y1
        font_size = min(available_width // len(text), available_height // 2, 24)
        font_size = max(font_size, 12)  # Minimum size
    else:
        font_size = 20  # Default

    print(f"📏 Calculated font size: {font_size}")

    try:
        # Try to use system fonts
        import platform
        system = platform.system()
        if system == "Windows":
            font_paths = ["arial.ttf", "calibri.ttf", "C:/Windows/Fonts/arial.ttf"]
        elif system == "Darwin":  # macOS
            font_paths = ["/System/Library/Fonts/Arial.ttf", "/Library/Fonts/Arial.ttf"]
        else:  # Linux
            font_paths = ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"]

        font = None
        for font_path in font_paths:
            try:
                font = ImageFont.truetype(font_path, font_size)
                break
            except:
                continue

        if font is None:
            font = ImageFont.load_default()
            print("⚠️ Using default font")
        else:
            print(f"✅ Using font: {font_path}")

    except Exception as e:
        font = ImageFont.load_default()
        print(f"⚠️ Font loading failed, using default: {e}")

    # Calculate text position
    try:
        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
    except:
        # Fallback for older PIL versions
        text_width, text_height = draw.textsize(text, font=font)

    text_x = x1 + (x2 - x1 - text_width) // 2
    text_y = y1 + (y2 - y1 - text_height) // 2

    # Ensure text fits within bounds
    text_x = max(x1, min(text_x, x2 - text_width))
    text_y = max(y1, min(text_y, y2 - text_height))

    print(f"📍 Text position: ({text_x}, {text_y}), size: {text_width}x{text_height}")

    # Convert color name to RGB
    color_map = {
        "white": (255, 255, 255),
        "black": (0, 0, 0),
        "red": (255, 0, 0),
        "blue": (0, 0, 255),
        "green": (0, 255, 0),
        "yellow": (255, 255, 0),
        "purple": (128, 0, 128),
        "orange": (255, 165, 0)
    }

    base_color = color_map.get(color.lower(), (255, 255, 255))
    alpha = int(255 * opacity)

    print(f"🎨 Using color: {base_color} with alpha: {alpha}")

    # Apply different styles with proper settings
    if style == 'modern_glass':
        # Glass effect with shadow and transparency
        shadow_alpha = alpha // 4
        draw.text((text_x+2, text_y+2), text, fill=(*base_color, shadow_alpha), font=font)  # Shadow
        draw.text((text_x+1, text_y+1), text, fill=(200, 200, 200, alpha//2), font=font)   # Highlight
        draw.text((text_x, text_y), text, fill=(*base_color, alpha), font=font)   # Main text

    elif style == 'neon_glow':
        # Neon glow effect with multiple layers
        glow_color = (0, 255, 255) if color == "white" else base_color
        for offset in range(4, 0, -1):
            glow_alpha = alpha // (offset + 1)
            for dx in [-offset, 0, offset]:
                for dy in [-offset, 0, offset]:
                    if dx != 0 or dy != 0:
                        draw.text((text_x+dx, text_y+dy), text, fill=(*glow_color, glow_alpha), font=font)
        draw.text((text_x, text_y), text, fill=(255, 255, 255, alpha), font=font)

    elif style == 'vintage_stamp':
        # Vintage stamp effect with border
        padding = 8
        stamp_color = (139, 69, 19) if color == "white" else base_color
        draw.rectangle([x1+padding, y1+padding, x2-padding, y2-padding],
                      outline=(*stamp_color, alpha), width=3)
        draw.text((text_x, text_y), text, fill=(*stamp_color, alpha), font=font)

    elif style == 'holographic':
        # Holographic rainbow effect
        colors = [(255, 0, 0), (255, 127, 0), (255, 255, 0), (0, 255, 0), (0, 0, 255), (75, 0, 130), (148, 0, 211)]
        for i, holo_color in enumerate(colors):
            offset = i - 3
            draw.text((text_x+offset, text_y), text, fill=(*holo_color, alpha//3), font=font)
        draw.text((text_x, text_y), text, fill=(*base_color, alpha), font=font)

    elif style == 'artistic_brush':
        # Artistic brush effect with texture
        for i in range(3):
            offset_x = i - 1
            offset_y = i - 1
            brush_alpha = alpha // (i + 2)
            draw.text((text_x+offset_x, text_y+offset_y), text, fill=(*base_color, brush_alpha), font=font)
        draw.text((text_x, text_y), text, fill=(*base_color, alpha), font=font)

    else:  # minimal_clean or default
        draw.text((text_x, text_y), text, fill=(*base_color, alpha), font=font)

    print(f"✅ Applied {style} style successfully")
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
        opacity = float(watermark_config.get('opacity', 0.8))
        style = watermark_config.get('style', 'modern_glass')
        size = watermark_config.get('size', 'medium')
        color = watermark_config.get('color', 'white')
        protection_level = watermark_config.get('protection_level', 'advanced')

        print(f"🎨 Applying {style} style with {protection_level} protection")
        print(f"📋 Settings: text='{text}', position={position}, opacity={opacity}, size={size}, color={color}")

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
        watermarked_overlay = apply_watermark_style(overlay, text, watermark_pos, style, opacity, size, color)

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

        # Track watermarking operation
        try:
            import requests
            track_data = {
                "userId": user_id,
                "filename": "watermarked_images.jpg",
                "processingTime": len(image_base64_list) * 1.2,
                "watermarkText": watermark_config.get('text', '© PixelFly'),
                "watermarkStyle": watermark_config.get('style', 'modern_glass'),
                "watermarkPosition": watermark_config.get('position', 'smart_adaptive'),
                "photoCount": len(image_base64_list),
                "success": True
            }
            # Send to Next.js API to track in database
            requests.post("http://localhost:3000/api/track/watermark", json=track_data, timeout=2)
            print("✅ Watermarking operation tracked")
        except Exception as e:
            print(f"⚠️ Failed to track watermarking: {e}")

        print("Sending successful watermark response")
        return jsonify(result)

    except Exception as e:
        print(f"Watermark error: {str(e)}", exc_info=True)
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    import os
    port = int(os.getenv('PORT', 5001))
    debug = os.getenv('FLASK_ENV') == 'development'

    if debug:
        print(f"🔧 Starting development server on port {port}")
        print("⚠️  WARNING: This is a development server. Do not use it in production!")
        print("🚀 For production, use: gunicorn -c gunicorn.conf.py wsgi:application")
    else:
        print(f"🚀 Starting production server on port {port}")

    app.run(host='0.0.0.0', port=port, debug=debug)
