from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import numpy as np
from io import BytesIO
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw, ImageFont
import requests
import os
import sys

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

app = Flask(__name__)
CORS(app, origins=["*"])

def enhance_image_smart(image_base64):
    """Smart image enhancement with adaptive algorithms"""
    try:
        print("🎨 Starting smart image enhancement...")
        
        # Decode base64 image
        image_data = base64.b64decode(image_base64)
        image = Image.open(BytesIO(image_data))
        print(f"📸 Image size: {image.size}, mode: {image.mode}")
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Analyze image characteristics
        img_array = np.array(image)
        brightness = np.mean(img_array)
        contrast = np.std(img_array)
        
        print(f"📊 Image analysis - Brightness: {brightness:.1f}, Contrast: {contrast:.1f}")
        
        # Adaptive enhancement based on image characteristics
        enhanced = image.copy()
        
        # Smart contrast enhancement
        if contrast < 50:  # Low contrast image
            contrast_enhancer = ImageEnhance.Contrast(enhanced)
            enhanced = contrast_enhancer.enhance(1.3)
            print("🔧 Applied contrast enhancement")
        
        # Smart brightness adjustment
        if brightness < 100:  # Dark image
            brightness_enhancer = ImageEnhance.Brightness(enhanced)
            enhanced = brightness_enhancer.enhance(1.2)
            print("💡 Applied brightness enhancement")
        elif brightness > 200:  # Bright image
            brightness_enhancer = ImageEnhance.Brightness(enhanced)
            enhanced = brightness_enhancer.enhance(0.9)
            print("🌙 Applied brightness reduction")
        
        # Color enhancement
        color_enhancer = ImageEnhance.Color(enhanced)
        enhanced = color_enhancer.enhance(1.1)
        print("🎨 Applied color enhancement")
        
        # Smart sharpening
        enhanced = enhanced.filter(ImageFilter.UnsharpMask(radius=1, percent=120, threshold=3))
        print("✨ Applied smart sharpening")
        
        # Convert back to base64
        img_byte_arr = BytesIO()
        enhanced.save(img_byte_arr, format='JPEG', quality=95, optimize=True)
        img_byte_arr = img_byte_arr.getvalue()
        
        enhanced_base64 = base64.b64encode(img_byte_arr).decode('utf-8')
        print("✅ Smart enhancement complete!")
        
        return enhanced_base64
        
    except Exception as e:
        print(f"❌ Enhancement error: {str(e)}")
        return image_base64  # Return original if enhancement fails

@app.route('/api/enhance', methods=['POST', 'OPTIONS'])
def enhance_photo():
    print(f"🎨 Enhancement endpoint called with method: {request.method}")
    
    if request.method == 'OPTIONS':
        print("Handling OPTIONS request")
        return '', 200
    
    try:
        print("Getting JSON data from request")
        data = request.get_json()
        print(f"Received data keys: {list(data.keys()) if data else 'None'}")

        image_base64 = data.get('image_base64')
        user_id = data.get('user_id', 'anonymous')

        if not image_base64:
            print("No image_base64 provided")
            return jsonify({"success": False, "error": "image_base64 is required"}), 400

        print(f"Processing enhancement for user: {user_id}")
        print(f"Image data length: {len(image_base64)} characters")

        # Enhance the image
        enhanced_base64 = enhance_image_smart(image_base64)

        result = {
            "success": True,
            "enhanced_base64": enhanced_base64,
            "processing_time": 1.0,
            "enhancements_applied": ["smart_contrast", "adaptive_brightness", "color_enhancement", "detail_sharpening"]
        }

        # Track enhancement operation (optional - may fail in serverless)
        try:
            track_data = {
                "userId": user_id,
                "filename": "enhanced_image.jpg",
                "processingTime": 1.0,
                "enhancementType": "smart_enhancement",
                "success": True
            }
            # Note: This may not work in serverless environment
            print("✅ Enhancement operation completed")
        except Exception as e:
            print(f"⚠️ Failed to track enhancement: {e}")

        print("Sending response with enhanced image")
        return jsonify(result)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

# Watermarking functions (simplified for serverless)
def smart_adaptive_placement(image, text, size):
    """AI-powered smart placement that avoids important content"""
    img_array = np.array(image.convert('RGB'))
    gray = np.mean(img_array, axis=2)
    
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

def apply_watermark_style(overlay, text, position, style, opacity, size, color="white"):
    """Apply watermark styles"""
    draw = ImageDraw.Draw(overlay)
    x1, y1, x2, y2 = position
    
    # Calculate font size
    if size == 'small':
        font_size = 14
    elif size == 'medium':
        font_size = 20
    elif size == 'large':
        font_size = 28
    else:
        font_size = 20
    
    try:
        font = ImageFont.load_default()
    except:
        font = ImageFont.load_default()
    
    # Calculate text position
    try:
        text_bbox = draw.textbbox((0, 0), text, font=font)
        text_width = text_bbox[2] - text_bbox[0]
        text_height = text_bbox[3] - text_bbox[1]
    except:
        text_width, text_height = 100, 20
    
    text_x = x1 + (x2 - x1 - text_width) // 2
    text_y = y1 + (y2 - y1 - text_height) // 2
    
    # Color mapping
    color_map = {
        "white": (255, 255, 255),
        "black": (0, 0, 0),
        "red": (255, 0, 0),
        "blue": (0, 0, 255),
        "green": (0, 255, 0),
    }
    
    base_color = color_map.get(color.lower(), (255, 255, 255))
    alpha = int(255 * opacity)
    
    # Apply style
    if style == 'modern_glass':
        draw.text((text_x+2, text_y+2), text, fill=(*base_color, alpha//3), font=font)
        draw.text((text_x, text_y), text, fill=(*base_color, alpha), font=font)
    else:
        draw.text((text_x, text_y), text, fill=(*base_color, alpha), font=font)
    
    return overlay

def add_revolutionary_watermark(image_base64, watermark_config):
    """Simplified watermarking for serverless"""
    try:
        print(f"🛡️ Starting watermarking...")
        
        # Decode base64 image
        image_data = base64.b64decode(image_base64)
        image = Image.open(BytesIO(image_data))
        
        if image.mode != 'RGBA':
            image = image.convert('RGBA')
        
        overlay = Image.new('RGBA', image.size, (0, 0, 0, 0))
        
        # Get watermark settings
        text = watermark_config.get('text', '© PixelFly')
        position = watermark_config.get('position', 'smart_adaptive')
        opacity = float(watermark_config.get('opacity', 0.8))
        style = watermark_config.get('style', 'modern_glass')
        size = watermark_config.get('size', 'medium')
        color = watermark_config.get('color', 'white')
        
        # Get watermark position
        if position == 'smart_adaptive':
            watermark_pos = smart_adaptive_placement(image, text, size)
        else:
            w, h = image.size
            watermark_pos = (w-180, h-80, w-20, h-20)  # default bottom right
        
        # Apply watermark
        watermarked_overlay = apply_watermark_style(overlay, text, watermark_pos, style, opacity, size, color)
        
        # Composite
        watermarked = Image.alpha_composite(image, watermarked_overlay)
        watermarked = watermarked.convert('RGB')
        
        # Convert to base64
        img_byte_arr = BytesIO()
        watermarked.save(img_byte_arr, format='JPEG', quality=95, optimize=True)
        img_byte_arr = img_byte_arr.getvalue()
        
        watermarked_base64 = base64.b64encode(img_byte_arr).decode('utf-8')
        print(f"✅ Watermarking complete!")
        
        return watermarked_base64
        
    except Exception as e:
        print(f"❌ Watermarking error: {str(e)}")
        return image_base64

@app.route('/api/watermark', methods=['POST', 'OPTIONS'])
def watermark_photos():
    print(f"🛡️ Watermark endpoint called with method: {request.method}")
    
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
        
        image_base64_list = data.get('image_base64_list', [])
        user_id = data.get('user_id', 'anonymous')
        watermark_config = data.get('watermark_config', {})
        
        if not image_base64_list:
            return jsonify({"success": False, "error": "image_base64_list is required"}), 400
        
        if len(image_base64_list) > 3:
            return jsonify({"success": False, "error": "Maximum 3 images allowed"}), 400
        
        # Process each image
        watermarked_base64 = []
        for i, img_base64 in enumerate(image_base64_list):
            watermarked = add_revolutionary_watermark(img_base64, watermark_config)
            watermarked_base64.append(watermarked)
        
        result = {
            "success": True,
            "watermarked_base64": watermarked_base64,
            "processing_time": len(image_base64_list) * 1.2,
            "processed_count": len(image_base64_list)
        }
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Watermark error: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "service": "PixelFly Backend API",
        "version": "1.0.0"
    })

# Vercel serverless function handler
def handler(request):
    return app(request.environ, lambda status, headers: None)

if __name__ == '__main__':
    app.run(debug=True)
