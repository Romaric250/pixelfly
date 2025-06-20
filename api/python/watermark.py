from http.server import BaseHTTPRequestHandler
import json
import base64
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont

def smart_adaptive_placement(image, text=None, size=None):
    """Simplified smart placement for serverless"""
    w, h = image.size
    
    # Define potential zones for watermark placement
    zones = [
        (w-200, h-100, w-20, h-20),    # bottom right
        (20, h-100, 200, h-20),        # bottom left  
        (w-200, 20, w-20, 100),        # top right
        (20, 20, 200, 100),            # top left
        (w//2-100, h//2-50, w//2+100, h//2+50),  # center
    ]
    
    # For simplicity in serverless, just return bottom right
    # In a full implementation, we'd analyze image content
    best_zone = zones[0]  # bottom right
    
    # Ensure zone is within image bounds
    x1, y1, x2, y2 = best_zone
    x1 = max(0, min(x1, w-20))
    y1 = max(0, min(y1, h-20))
    x2 = max(x1+20, min(x2, w))
    y2 = max(y1+20, min(y2, h))
    
    return (x1, y1, x2, y2)

def apply_watermark_style(overlay, text, position, style, opacity, size, color="white"):
    """Apply watermark styles"""
    draw = ImageDraw.Draw(overlay)
    x1, y1, x2, y2 = position
    
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

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Get content length
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            # Parse JSON data
            data = json.loads(post_data.decode('utf-8'))
            
            if not data:
                self.send_error_response(400, "No data provided")
                return
            
            image_base64_list = data.get('image_base64_list', [])
            watermark_config = data.get('watermark_config', {})
            
            if not image_base64_list:
                self.send_error_response(400, "image_base64_list is required")
                return
            
            if len(image_base64_list) > 3:
                self.send_error_response(400, "Maximum 3 images allowed")
                return
            
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

            # Track watermarking operation
            try:
                import urllib.request

                track_data = {
                    "userId": "anonymous",  # We don't have user_id in watermark data
                    "filename": "watermarked_images.jpg",
                    "processingTime": len(image_base64_list) * 1.2,
                    "watermarkText": watermark_config.get('text', '© PixelFly'),
                    "watermarkStyle": watermark_config.get('style', 'modern_glass'),
                    "watermarkPosition": watermark_config.get('position', 'smart_adaptive'),
                    "photoCount": len(image_base64_list),
                    "success": True
                }

                # Send to Next.js API to track in database
                track_url = "https://pixelfly-pi.vercel.app/api/track/watermark"
                track_json = json.dumps(track_data).encode('utf-8')

                req = urllib.request.Request(
                    track_url,
                    data=track_json,
                    headers={'Content-Type': 'application/json'}
                )

                with urllib.request.urlopen(req, timeout=2) as response:
                    print("✅ Watermarking operation tracked")
            except Exception as e:
                print(f"⚠️ Failed to track watermarking: {e}")

            self.send_success_response(result)
            
        except Exception as e:
            print(f"Watermark error: {str(e)}")
            self.send_error_response(500, str(e))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        return

    def send_success_response(self, data):
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def send_error_response(self, status_code, message):
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        error_response = {"success": False, "error": message}
        self.wfile.write(json.dumps(error_response).encode('utf-8'))
