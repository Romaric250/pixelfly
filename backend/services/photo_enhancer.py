"""
Photo Enhancement Service for PixelFly
Uses AI models (Gemini + custom algorithms) to enhance photo quality
"""

import os
import time
import asyncio
import requests
from typing import Dict, Any, Optional
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
import cv2
import google.generativeai as genai
from io import BytesIO
import logging

logger = logging.getLogger(__name__)

class PhotoEnhancementService:
    """
    Advanced photo enhancement using AI and traditional image processing
    """
    
    def __init__(self):
        # Configure Gemini for image analysis
        genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
        self.gemini_model = genai.GenerativeModel('gemini-pro-vision')
    
    async def enhance_photo_async(self, image_url: str = None, image_base64: str = None, enhancement_type: str = "auto", quality_score: float = 0.5, return_format: str = "base64") -> Dict[str, Any]:
        """
        Asynchronously enhance a photo using AI-guided processing
        """
        start_time = time.time()
        
        try:
            # Get the image from URL or base64
            if image_base64:
                image = await self._decode_base64_image(image_base64)
            elif image_url:
                image = await self._download_image(image_url)
            else:
                raise ValueError("Either image_url or image_base64 must be provided")
            
            # Analyze image with Gemini
            analysis = await self._analyze_image_with_gemini(image, enhancement_type)
            
            # Apply enhancements based on analysis
            enhanced_image = await self._apply_enhancements(image, analysis, quality_score)
            
            # Convert enhanced image to base64 or URL based on return_format
            if return_format == "base64":
                enhanced_base64 = await self._image_to_base64(enhanced_image)
                result = {
                    "enhanced_base64": enhanced_base64,
                    "enhancements_applied": analysis.get("recommended_enhancements", []),
                    "processing_time": time.time() - start_time,
                    "quality_improvement": analysis.get("quality_improvement", 0.3),
                    "original_analysis": analysis
                }
            else:
                # Upload enhanced image (placeholder - will integrate with storage)
                enhanced_url = await self._upload_enhanced_image(enhanced_image, image_url)
                result = {
                    "enhanced_url": enhanced_url,
                    "enhancements_applied": analysis.get("recommended_enhancements", []),
                    "processing_time": time.time() - start_time,
                    "quality_improvement": analysis.get("quality_improvement", 0.3),
                    "original_analysis": analysis
                }

            return result
            
        except Exception as e:
            logger.error(f"Photo enhancement error: {str(e)}")
            raise e
    
    async def _decode_base64_image(self, image_base64: str) -> Image.Image:
        """Decode base64 image data"""
        try:
            import base64
            # Remove data URL prefix if present
            if ',' in image_base64:
                image_base64 = image_base64.split(',')[1]

            image_data = base64.b64decode(image_base64)
            return Image.open(BytesIO(image_data))
        except Exception as e:
            logger.error(f"Failed to decode base64 image: {str(e)}")
            raise e

    async def _download_image(self, image_url: str) -> Image.Image:
        """Download image from URL"""
        try:
            response = requests.get(image_url, timeout=30)
            response.raise_for_status()
            return Image.open(BytesIO(response.content))
        except Exception as e:
            logger.error(f"Failed to download image: {str(e)}")
            raise e
    
    async def _analyze_image_with_gemini(self, image: Image.Image, enhancement_type: str) -> Dict[str, Any]:
        """
        Use Gemini to analyze the image and recommend enhancements
        """
        try:
            # Convert PIL image to format Gemini can process
            img_byte_arr = BytesIO()
            image.save(img_byte_arr, format='JPEG')
            img_byte_arr = img_byte_arr.getvalue()
            
            prompt = f"""
            Analyze this image for quality enhancement. The requested enhancement type is: {enhancement_type}
            
            Please identify:
            1. Current image quality issues (blur, noise, low contrast, poor lighting, etc.)
            2. Subject type (portrait, landscape, food, product, etc.)
            3. Recommended enhancement techniques
            4. Optimal enhancement parameters
            5. Expected quality improvement percentage
            
            Respond in JSON format with specific recommendations.
            """
            
            # For now, simulate Gemini analysis (replace with actual API call when ready)
            # TODO: Implement actual Gemini API call
            simulated_analysis = {
                "image_type": self._detect_image_type(image),
                "quality_issues": self._detect_quality_issues(image),
                "recommended_enhancements": self._get_recommended_enhancements(image, enhancement_type),
                "enhancement_parameters": self._get_enhancement_parameters(image),
                "quality_improvement": 0.35,
                "confidence": 0.85
            }
            
            return simulated_analysis
            
        except Exception as e:
            logger.error(f"Gemini analysis error: {str(e)}")
            # Fallback to traditional analysis
            return self._fallback_analysis(image, enhancement_type)
    
    def _detect_image_type(self, image: Image.Image) -> str:
        """Detect the type of image (portrait, landscape, etc.)"""
        width, height = image.size
        aspect_ratio = width / height
        
        # Simple heuristics for image type detection
        if 0.7 <= aspect_ratio <= 1.3:
            return "portrait"
        elif aspect_ratio > 1.5:
            return "landscape"
        elif aspect_ratio < 0.7:
            return "vertical"
        else:
            return "general"
    
    def _detect_quality_issues(self, image: Image.Image) -> list:
        """Detect quality issues in the image"""
        issues = []
        
        # Convert to numpy array for analysis
        img_array = np.array(image)
        
        # Check for blur (using Laplacian variance)
        gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
        blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()
        if blur_score < 100:
            issues.append("blur")
        
        # Check for low contrast
        contrast = img_array.std()
        if contrast < 50:
            issues.append("low_contrast")
        
        # Check for noise (simplified)
        noise_score = np.std(img_array)
        if noise_score > 80:
            issues.append("noise")
        
        # Check brightness
        brightness = np.mean(img_array)
        if brightness < 80:
            issues.append("low_light")
        elif brightness > 200:
            issues.append("overexposed")
        
        return issues
    
    def _get_recommended_enhancements(self, image: Image.Image, enhancement_type: str) -> list:
        """Get recommended enhancements based on image analysis"""
        issues = self._detect_quality_issues(image)
        enhancements = []
        
        if "blur" in issues:
            enhancements.append("sharpening")
        if "low_contrast" in issues:
            enhancements.append("contrast_enhancement")
        if "noise" in issues:
            enhancements.append("noise_reduction")
        if "low_light" in issues:
            enhancements.append("brightness_adjustment")
        
        # Add type-specific enhancements
        if enhancement_type == "portrait":
            enhancements.extend(["skin_smoothing", "eye_enhancement"])
        elif enhancement_type == "landscape":
            enhancements.extend(["color_saturation", "sky_enhancement"])
        elif enhancement_type == "food":
            enhancements.extend(["color_warmth", "texture_enhancement"])
        
        # Always add basic enhancements
        enhancements.extend(["color_balance", "detail_enhancement"])
        
        return list(set(enhancements))  # Remove duplicates
    
    def _get_enhancement_parameters(self, image: Image.Image) -> Dict[str, float]:
        """Get optimal enhancement parameters"""
        return {
            "sharpness": 1.3,
            "contrast": 1.2,
            "brightness": 1.1,
            "saturation": 1.15,
            "noise_reduction": 0.8
        }
    
    async def _apply_enhancements(self, image: Image.Image, analysis: Dict[str, Any], quality_score: float) -> Image.Image:
        """Apply AI-guided enhancements to the image"""
        enhanced_image = image.copy()
        enhancements = analysis.get("recommended_enhancements", [])
        parameters = analysis.get("enhancement_parameters", {})
        
        try:
            # Apply sharpening
            if "sharpening" in enhancements:
                enhanced_image = enhanced_image.filter(ImageFilter.UnsharpMask(
                    radius=2, 
                    percent=int(parameters.get("sharpness", 1.3) * 100), 
                    threshold=3
                ))
            
            # Apply contrast enhancement
            if "contrast_enhancement" in enhancements:
                enhancer = ImageEnhance.Contrast(enhanced_image)
                enhanced_image = enhancer.enhance(parameters.get("contrast", 1.2))
            
            # Apply brightness adjustment
            if "brightness_adjustment" in enhancements:
                enhancer = ImageEnhance.Brightness(enhanced_image)
                enhanced_image = enhancer.enhance(parameters.get("brightness", 1.1))
            
            # Apply color saturation
            if "color_saturation" in enhancements:
                enhancer = ImageEnhance.Color(enhanced_image)
                enhanced_image = enhancer.enhance(parameters.get("saturation", 1.15))
            
            # Apply noise reduction (using PIL filters)
            if "noise_reduction" in enhancements:
                enhanced_image = enhanced_image.filter(ImageFilter.MedianFilter(size=3))
            
            # Apply color balance
            if "color_balance" in enhancements:
                enhanced_image = self._apply_color_balance(enhanced_image)
            
            # Apply detail enhancement
            if "detail_enhancement" in enhancements:
                enhanced_image = enhanced_image.filter(ImageFilter.DETAIL)
            
            logger.info(f"Applied enhancements: {enhancements}")
            return enhanced_image
            
        except Exception as e:
            logger.error(f"Enhancement application error: {str(e)}")
            return image  # Return original if enhancement fails
    
    def _apply_color_balance(self, image: Image.Image) -> Image.Image:
        """Apply automatic color balance"""
        try:
            # Convert to numpy array
            img_array = np.array(image)
            
            # Simple color balance using histogram stretching
            for i in range(3):  # RGB channels
                channel = img_array[:, :, i]
                # Stretch histogram to full range
                min_val, max_val = np.percentile(channel, [2, 98])
                img_array[:, :, i] = np.clip(
                    (channel - min_val) * 255 / (max_val - min_val), 0, 255
                )
            
            return Image.fromarray(img_array.astype(np.uint8))
        except Exception as e:
            logger.error(f"Color balance error: {str(e)}")
            return image
    
    async def _image_to_base64(self, image: Image.Image) -> str:
        """Convert PIL image to base64 string"""
        try:
            img_byte_arr = BytesIO()
            # Convert to RGB if needed (for JPEG compatibility)
            if image.mode != 'RGB':
                image = image.convert('RGB')
            image.save(img_byte_arr, format='JPEG', quality=95)
            img_byte_arr = img_byte_arr.getvalue()

            import base64
            base64_string = base64.b64encode(img_byte_arr).decode('utf-8')
            return base64_string
        except Exception as e:
            logger.error(f"Base64 conversion error: {str(e)}")
            raise e

    async def _upload_enhanced_image(self, enhanced_image: Image.Image, original_url: str) -> str:
        """Upload enhanced image and return URL"""
        # TODO: Integrate with actual storage service (UploadThing or Firebase)
        # For now, return a placeholder URL

        # In production, this would:
        # 1. Convert PIL image to bytes
        # 2. Upload to storage service
        # 3. Return the public URL

        # Placeholder implementation
        filename = f"enhanced_{int(time.time())}.jpg"
        placeholder_url = f"https://storage.pixelfly.com/enhanced/{filename}"

        logger.info(f"Enhanced image would be uploaded as: {placeholder_url}")
        return placeholder_url
    
    def _fallback_analysis(self, image: Image.Image, enhancement_type: str) -> Dict[str, Any]:
        """Fallback analysis when Gemini is unavailable"""
        return {
            "image_type": self._detect_image_type(image),
            "quality_issues": self._detect_quality_issues(image),
            "recommended_enhancements": ["sharpening", "contrast_enhancement", "color_balance"],
            "enhancement_parameters": self._get_enhancement_parameters(image),
            "quality_improvement": 0.25,
            "confidence": 0.6,
            "fallback": True
        }
