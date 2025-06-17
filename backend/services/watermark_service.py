"""
Watermark Service for PixelFly
Intelligent watermarking with AI-powered placement and styling
"""

import os
import time
import asyncio
import requests
from typing import Dict, Any, List, Tuple
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageEnhance
import cv2
import logging
from io import BytesIO

logger = logging.getLogger(__name__)

class WatermarkService:
    """
    Advanced watermarking service with AI-powered placement optimization
    """
    
    def __init__(self):
        self.default_font_size = 24
        self.default_opacity = 0.7
        self.supported_positions = [
            "top_left", "top_right", "bottom_left", "bottom_right", 
            "center", "top_center", "bottom_center"
        ]
    
    async def add_watermark_async(self, image_url: str, watermark_config: Dict[str, Any], return_format: str = "base64") -> Dict[str, Any]:
        """
        Asynchronously add watermark to image with AI-optimized placement
        """
        start_time = time.time()
        
        try:
            # Download the image
            image = await self._download_image(image_url)
            
            # Analyze optimal watermark placement
            placement_analysis = await self._analyze_watermark_placement(image, watermark_config)
            
            # Apply watermark
            watermarked_image = await self._apply_watermark(image, watermark_config, placement_analysis)

            # Return base64 or URL based on return_format
            if return_format == "base64":
                watermarked_base64 = await self._image_to_base64(watermarked_image)
                result = {
                    "watermarked_base64": watermarked_base64,
                    "watermark_config": watermark_config,
                    "placement_analysis": placement_analysis,
                    "processing_time": time.time() - start_time
                }
            else:
                # Upload watermarked image
                watermarked_url = await self._upload_watermarked_image(watermarked_image, image_url)
                result = {
                    "watermarked_url": watermarked_url,
                    "watermark_config": watermark_config,
                    "placement_analysis": placement_analysis,
                    "processing_time": time.time() - start_time
                }

            return result
            
        except Exception as e:
            logger.error(f"Watermarking error: {str(e)}")
            raise e
    
    async def bulk_watermark_async(self, image_urls: List[str], watermark_config: Dict[str, Any], return_format: str = "base64") -> Dict[str, Any]:
        """
        Bulk watermarking with consistent styling
        """
        start_time = time.time()
        results = []
        
        # Process images concurrently
        tasks = [
            self.add_watermark_async(url, watermark_config) 
            for url in image_urls
        ]
        
        completed_results = await asyncio.gather(*tasks, return_exceptions=True)
        
        for i, result in enumerate(completed_results):
            if isinstance(result, Exception):
                logger.error(f"Failed to watermark image {i}: {str(result)}")
            else:
                results.append(result["watermarked_url"])
        
        return {
            "watermarked_urls": results,
            "processing_time": time.time() - start_time,
            "processed_count": len(results),
            "total_requested": len(image_urls)
        }
    
    async def _download_image(self, image_url: str) -> Image.Image:
        """Download image from URL"""
        try:
            response = requests.get(image_url, timeout=30)
            response.raise_for_status()
            return Image.open(BytesIO(response.content))
        except Exception as e:
            logger.error(f"Failed to download image: {str(e)}")
            raise e
    
    async def _analyze_watermark_placement(self, image: Image.Image, config: Dict[str, Any]) -> Dict[str, Any]:
        """
        AI-powered analysis for optimal watermark placement
        """
        try:
            # Convert to numpy array for analysis
            img_array = np.array(image)
            width, height = image.size
            
            # Analyze image composition
            composition_analysis = self._analyze_composition(img_array)
            
            # Find optimal placement zones
            placement_zones = self._find_placement_zones(img_array, composition_analysis)
            
            # Determine best watermark style
            style_recommendations = self._recommend_watermark_style(img_array, config)
            
            return {
                "optimal_position": placement_zones["best_position"],
                "placement_zones": placement_zones,
                "style_recommendations": style_recommendations,
                "composition_analysis": composition_analysis,
                "image_dimensions": {"width": width, "height": height}
            }
            
        except Exception as e:
            logger.error(f"Placement analysis error: {str(e)}")
            return self._fallback_placement_analysis(image, config)
    
    def _analyze_composition(self, img_array: np.ndarray) -> Dict[str, Any]:
        """Analyze image composition for watermark placement"""
        height, width = img_array.shape[:2]
        
        # Divide image into zones
        zones = {
            "top_left": img_array[0:height//3, 0:width//3],
            "top_right": img_array[0:height//3, 2*width//3:width],
            "bottom_left": img_array[2*height//3:height, 0:width//3],
            "bottom_right": img_array[2*height//3:height, 2*width//3:width],
            "center": img_array[height//3:2*height//3, width//3:2*width//3]
        }
        
        zone_analysis = {}
        for zone_name, zone_data in zones.items():
            # Calculate zone characteristics
            brightness = np.mean(zone_data)
            contrast = np.std(zone_data)
            complexity = self._calculate_complexity(zone_data)
            
            zone_analysis[zone_name] = {
                "brightness": float(brightness),
                "contrast": float(contrast),
                "complexity": float(complexity),
                "suitability_score": self._calculate_suitability_score(brightness, contrast, complexity)
            }
        
        return zone_analysis
    
    def _calculate_complexity(self, zone_data: np.ndarray) -> float:
        """Calculate visual complexity of a zone"""
        try:
            # Convert to grayscale if needed
            if len(zone_data.shape) == 3:
                gray = cv2.cvtColor(zone_data, cv2.COLOR_RGB2GRAY)
            else:
                gray = zone_data
            
            # Use Sobel edge detection to measure complexity
            sobelx = cv2.Sobel(gray, cv2.CV_64F, 1, 0, ksize=3)
            sobely = cv2.Sobel(gray, cv2.CV_64F, 0, 1, ksize=3)
            edge_magnitude = np.sqrt(sobelx**2 + sobely**2)
            
            return np.mean(edge_magnitude)
        except Exception:
            return 0.0
    
    def _calculate_suitability_score(self, brightness: float, contrast: float, complexity: float) -> float:
        """Calculate how suitable a zone is for watermarking"""
        # Prefer zones with:
        # - Moderate brightness (not too dark or bright)
        # - Good contrast
        # - Low complexity (less visual interference)
        
        brightness_score = 1.0 - abs(brightness - 128) / 128  # Prefer mid-range brightness
        contrast_score = min(contrast / 50, 1.0)  # Prefer good contrast
        complexity_score = max(0, 1.0 - complexity / 100)  # Prefer low complexity
        
        return (brightness_score + contrast_score + complexity_score) / 3
    
    def _find_placement_zones(self, img_array: np.ndarray, composition_analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Find the best zones for watermark placement"""
        # Sort zones by suitability score
        sorted_zones = sorted(
            composition_analysis.items(),
            key=lambda x: x[1]["suitability_score"],
            reverse=True
        )
        
        best_position = sorted_zones[0][0]
        
        return {
            "best_position": best_position,
            "ranked_positions": [zone[0] for zone in sorted_zones],
            "suitability_scores": {zone[0]: zone[1]["suitability_score"] for zone in sorted_zones}
        }
    
    def _recommend_watermark_style(self, img_array: np.ndarray, config: Dict[str, Any]) -> Dict[str, Any]:
        """Recommend watermark styling based on image characteristics"""
        avg_brightness = np.mean(img_array)
        
        # Recommend opacity based on image brightness
        if avg_brightness < 100:  # Dark image
            recommended_opacity = 0.8
            recommended_color = "white"
        elif avg_brightness > 180:  # Bright image
            recommended_opacity = 0.9
            recommended_color = "black"
        else:  # Medium brightness
            recommended_opacity = 0.7
            recommended_color = "white" if avg_brightness < 140 else "black"
        
        # Recommend size based on image dimensions
        height, width = img_array.shape[:2]
        recommended_size = max(12, min(48, width // 40))
        
        return {
            "recommended_opacity": recommended_opacity,
            "recommended_color": recommended_color,
            "recommended_size": recommended_size,
            "recommended_font": "Arial"
        }
    
    async def _apply_watermark(self, image: Image.Image, config: Dict[str, Any], placement_analysis: Dict[str, Any]) -> Image.Image:
        """Apply watermark to the image"""
        try:
            watermarked_image = image.copy()
            draw = ImageDraw.Draw(watermarked_image)
            
            # Get watermark configuration
            text = config.get("text", "© PixelFly")
            position = config.get("position", placement_analysis["optimal_position"])
            opacity = config.get("opacity", placement_analysis["style_recommendations"]["recommended_opacity"])
            color = config.get("color", placement_analysis["style_recommendations"]["recommended_color"])
            font_size = config.get("font_size", placement_analysis["style_recommendations"]["recommended_size"])
            
            # Load font
            try:
                font = ImageFont.truetype("arial.ttf", font_size)
            except:
                font = ImageFont.load_default()
            
            # Calculate text position
            text_bbox = draw.textbbox((0, 0), text, font=font)
            text_width = text_bbox[2] - text_bbox[0]
            text_height = text_bbox[3] - text_bbox[1]
            
            img_width, img_height = image.size
            margin = 20
            
            # Position mapping
            positions = {
                "top_left": (margin, margin),
                "top_right": (img_width - text_width - margin, margin),
                "bottom_left": (margin, img_height - text_height - margin),
                "bottom_right": (img_width - text_width - margin, img_height - text_height - margin),
                "center": ((img_width - text_width) // 2, (img_height - text_height) // 2),
                "top_center": ((img_width - text_width) // 2, margin),
                "bottom_center": ((img_width - text_width) // 2, img_height - text_height - margin)
            }
            
            text_position = positions.get(position, positions["bottom_right"])
            
            # Create watermark with transparency
            if opacity < 1.0:
                # Create a transparent overlay
                overlay = Image.new('RGBA', image.size, (0, 0, 0, 0))
                overlay_draw = ImageDraw.Draw(overlay)
                
                # Convert color to RGBA with opacity
                if color == "white":
                    rgba_color = (255, 255, 255, int(255 * opacity))
                elif color == "black":
                    rgba_color = (0, 0, 0, int(255 * opacity))
                else:
                    rgba_color = (*color, int(255 * opacity)) if isinstance(color, tuple) else (128, 128, 128, int(255 * opacity))
                
                overlay_draw.text(text_position, text, font=font, fill=rgba_color)
                
                # Composite the overlay onto the image
                watermarked_image = Image.alpha_composite(watermarked_image.convert('RGBA'), overlay)
                watermarked_image = watermarked_image.convert('RGB')
            else:
                # Direct text drawing
                draw.text(text_position, text, font=font, fill=color)
            
            logger.info(f"Applied watermark: '{text}' at {position}")
            return watermarked_image
            
        except Exception as e:
            logger.error(f"Watermark application error: {str(e)}")
            return image  # Return original if watermarking fails
    
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

    async def _upload_watermarked_image(self, watermarked_image: Image.Image, original_url: str) -> str:
        """Upload watermarked image and return URL"""
        # TODO: Integrate with actual storage service (UploadThing or Firebase)
        # For now, return a placeholder URL

        filename = f"watermarked_{int(time.time())}.jpg"
        placeholder_url = f"https://storage.pixelfly.com/watermarked/{filename}"

        logger.info(f"Watermarked image would be uploaded as: {placeholder_url}")
        return placeholder_url
    
    def _fallback_placement_analysis(self, image: Image.Image, config: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback analysis when AI analysis fails"""
        return {
            "optimal_position": "bottom_right",
            "placement_zones": {"best_position": "bottom_right"},
            "style_recommendations": {
                "recommended_opacity": 0.7,
                "recommended_color": "white",
                "recommended_size": 24,
                "recommended_font": "Arial"
            },
            "composition_analysis": {},
            "image_dimensions": {"width": image.width, "height": image.height},
            "fallback": True
        }
