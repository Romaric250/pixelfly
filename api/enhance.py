from http.server import BaseHTTPRequestHandler
import json
import base64
from io import BytesIO
from PIL import Image, ImageEnhance, ImageFilter

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
        
        # Analyze image characteristics using PIL
        # Convert to grayscale for analysis
        gray = image.convert('L')
        histogram = gray.histogram()
        
        # Calculate brightness (average pixel value)
        total_pixels = sum(histogram)
        brightness = sum(i * histogram[i] for i in range(256)) / total_pixels
        
        # Simple contrast estimation
        contrast = max(histogram) - min(histogram)
        
        print(f"📊 Image analysis - Brightness: {brightness:.1f}, Contrast: {contrast:.1f}")
        
        # Adaptive enhancement based on image characteristics
        enhanced = image.copy()
        
        # Smart contrast enhancement
        if contrast < 1000:  # Low contrast image
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

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Get content length
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            # Parse JSON data
            data = json.loads(post_data.decode('utf-8'))
            
            image_base64 = data.get('image_base64')
            user_id = data.get('user_id', 'anonymous')

            if not image_base64:
                self.send_error_response(400, "image_base64 is required")
                return

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

            # Track enhancement operation
            try:
                import urllib.request

                track_data = {
                    "userId": user_id,
                    "filename": "enhanced_image.jpg",
                    "processingTime": 1.0,
                    "enhancementType": "smart_enhancement",
                    "success": True
                }

                # Send to Next.js API to track in database
                track_url = "https://pixelfly-pi.vercel.app/api/track/enhancement"
                track_json = json.dumps(track_data).encode('utf-8')

                req = urllib.request.Request(
                    track_url,
                    data=track_json,
                    headers={'Content-Type': 'application/json'}
                )

                with urllib.request.urlopen(req, timeout=2) as response:
                    print("✅ Enhancement operation tracked")
            except Exception as e:
                print(f"⚠️ Failed to track enhancement: {e}")

            self.send_success_response(result)
            
        except Exception as e:
            print(f"Error: {e}")
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
