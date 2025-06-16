"""
PixelFly Flask Backend
AI-powered photo enhancement and watermarking service
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_restful import Api, Resource
import os
from dotenv import load_dotenv
import logging

# Import our services
from services.photo_enhancer import PhotoEnhancementService
from services.watermark_service import WatermarkService
from services.ai_orchestrator import AIOrchestrator

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication
api = Api(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize services
photo_enhancer = PhotoEnhancementService()
watermark_service = WatermarkService()
ai_orchestrator = AIOrchestrator()

class HealthCheck(Resource):
    """Health check endpoint"""
    def get(self):
        return {
            "status": "healthy",
            "service": "PixelFly Backend",
            "version": "1.0.0",
            "features": ["photo_enhancement", "watermarking"]
        }

class PhotoEnhancement(Resource):
    """Photo enhancement endpoint"""
    def post(self):
        try:
            data = request.get_json()
            
            # Validate required fields
            if not data or 'image_url' not in data:
                return {"error": "image_url is required"}, 400
            
            image_url = data['image_url']
            user_id = data.get('user_id', 'anonymous')
            enhancement_type = data.get('enhancement_type', 'auto')
            
            logger.info(f"Processing photo enhancement for user {user_id}")
            
            # Process the image
            result = ai_orchestrator.enhance_photo(
                image_url=image_url,
                user_id=user_id,
                enhancement_type=enhancement_type
            )
            
            return {
                "success": True,
                "enhanced_url": result['enhanced_url'],
                "processing_time": result['processing_time'],
                "enhancements_applied": result['enhancements_applied']
            }
            
        except Exception as e:
            logger.error(f"Photo enhancement error: {str(e)}")
            return {"error": str(e)}, 500

class BulkWatermarking(Resource):
    """Bulk watermarking endpoint"""
    def post(self):
        try:
            data = request.get_json()
            
            # Validate required fields
            if not data or 'image_urls' not in data:
                return {"error": "image_urls array is required"}, 400
            
            image_urls = data['image_urls']
            user_id = data.get('user_id', 'anonymous')
            watermark_config = data.get('watermark_config', {})
            
            logger.info(f"Processing bulk watermarking for user {user_id}, {len(image_urls)} images")
            
            # Process the images
            result = ai_orchestrator.bulk_watermark(
                image_urls=image_urls,
                user_id=user_id,
                watermark_config=watermark_config
            )
            
            return {
                "success": True,
                "watermarked_urls": result['watermarked_urls'],
                "processing_time": result['processing_time'],
                "processed_count": result['processed_count']
            }
            
        except Exception as e:
            logger.error(f"Bulk watermarking error: {str(e)}")
            return {"error": str(e)}, 500

class AICapabilities(Resource):
    """Get available AI capabilities"""
    def get(self):
        return {
            "enhancement_types": [
                "auto",
                "portrait",
                "landscape", 
                "food",
                "product",
                "low_light",
                "vintage"
            ],
            "watermark_types": [
                "text",
                "logo",
                "signature",
                "copyright"
            ],
            "ai_models": [
                "gemini-pro-vision",
                "custom-enhancement-model",
                "watermark-detection-model"
            ]
        }

# Register API endpoints
api.add_resource(HealthCheck, '/health')
api.add_resource(PhotoEnhancement, '/api/enhance')
api.add_resource(BulkWatermarking, '/api/watermark')
api.add_resource(AICapabilities, '/api/capabilities')

@app.route('/')
def index():
    return {
        "message": "PixelFly Backend API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "enhance": "/api/enhance",
            "watermark": "/api/watermark",
            "capabilities": "/api/capabilities"
        }
    }

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_ENV') == 'development'
    
    logger.info(f"Starting PixelFly Backend on port {port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
