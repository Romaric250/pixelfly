"""
Image Processor Utility for PixelFly
Common image processing functions and utilities
"""

import os
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance
import cv2
from typing import Tuple, Dict, Any
import logging

logger = logging.getLogger(__name__)

class ImageProcessor:
    """
    Utility class for common image processing operations
    """
    
    @staticmethod
    def resize_image(image: Image.Image, max_size: Tuple[int, int] = (2048, 2048), maintain_aspect: bool = True) -> Image.Image:
        """Resize image while maintaining aspect ratio"""
        try:
            if maintain_aspect:
                image.thumbnail(max_size, Image.Resampling.LANCZOS)
                return image
            else:
                return image.resize(max_size, Image.Resampling.LANCZOS)
        except Exception as e:
            logger.error(f"Image resize error: {str(e)}")
            return image
    
    @staticmethod
    def normalize_image(image: Image.Image) -> Image.Image:
        """Normalize image for consistent processing"""
        try:
            # Convert to RGB if needed
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize if too large
            if image.width > 4096 or image.height > 4096:
                image = ImageProcessor.resize_image(image, (4096, 4096))
            
            return image
        except Exception as e:
            logger.error(f"Image normalization error: {str(e)}")
            return image
    
    @staticmethod
    def calculate_image_quality_score(image: Image.Image) -> float:
        """Calculate a quality score for the image (0-1)"""
        try:
            img_array = np.array(image)
            
            # Convert to grayscale for analysis
            if len(img_array.shape) == 3:
                gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
            else:
                gray = img_array
            
            # Calculate various quality metrics
            
            # 1. Sharpness (Laplacian variance)
            sharpness = cv2.Laplacian(gray, cv2.CV_64F).var()
            sharpness_score = min(sharpness / 1000, 1.0)  # Normalize
            
            # 2. Contrast (standard deviation)
            contrast = np.std(gray)
            contrast_score = min(contrast / 100, 1.0)  # Normalize
            
            # 3. Brightness distribution
            brightness = np.mean(gray)
            brightness_score = 1.0 - abs(brightness - 128) / 128  # Prefer mid-range
            
            # 4. Dynamic range
            dynamic_range = np.max(gray) - np.min(gray)
            dynamic_range_score = dynamic_range / 255
            
            # Weighted average
            quality_score = (
                sharpness_score * 0.3 +
                contrast_score * 0.3 +
                brightness_score * 0.2 +
                dynamic_range_score * 0.2
            )
            
            return min(max(quality_score, 0.0), 1.0)
            
        except Exception as e:
            logger.error(f"Quality score calculation error: {str(e)}")
            return 0.5  # Default medium quality
    
    @staticmethod
    def detect_faces(image: Image.Image) -> list:
        """Detect faces in the image"""
        try:
            img_array = np.array(image)
            gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
            
            # Load face cascade (you might need to download this)
            face_cascade_path = cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
            face_cascade = cv2.CascadeClassifier(face_cascade_path)
            
            faces = face_cascade.detectMultiScale(gray, 1.1, 4)
            
            return [{"x": int(x), "y": int(y), "width": int(w), "height": int(h)} 
                   for (x, y, w, h) in faces]
            
        except Exception as e:
            logger.error(f"Face detection error: {str(e)}")
            return []
    
    @staticmethod
    def apply_gaussian_blur(image: Image.Image, radius: float = 1.0) -> Image.Image:
        """Apply Gaussian blur to image"""
        try:
            return image.filter(ImageFilter.GaussianBlur(radius=radius))
        except Exception as e:
            logger.error(f"Gaussian blur error: {str(e)}")
            return image
    
    @staticmethod
    def apply_unsharp_mask(image: Image.Image, radius: float = 2.0, percent: int = 150, threshold: int = 3) -> Image.Image:
        """Apply unsharp mask for sharpening"""
        try:
            return image.filter(ImageFilter.UnsharpMask(radius=radius, percent=percent, threshold=threshold))
        except Exception as e:
            logger.error(f"Unsharp mask error: {str(e)}")
            return image
    
    @staticmethod
    def adjust_brightness(image: Image.Image, factor: float = 1.0) -> Image.Image:
        """Adjust image brightness"""
        try:
            enhancer = ImageEnhance.Brightness(image)
            return enhancer.enhance(factor)
        except Exception as e:
            logger.error(f"Brightness adjustment error: {str(e)}")
            return image
    
    @staticmethod
    def adjust_contrast(image: Image.Image, factor: float = 1.0) -> Image.Image:
        """Adjust image contrast"""
        try:
            enhancer = ImageEnhance.Contrast(image)
            return enhancer.enhance(factor)
        except Exception as e:
            logger.error(f"Contrast adjustment error: {str(e)}")
            return image
    
    @staticmethod
    def adjust_saturation(image: Image.Image, factor: float = 1.0) -> Image.Image:
        """Adjust image color saturation"""
        try:
            enhancer = ImageEnhance.Color(image)
            return enhancer.enhance(factor)
        except Exception as e:
            logger.error(f"Saturation adjustment error: {str(e)}")
            return image
    
    @staticmethod
    def remove_noise(image: Image.Image, method: str = "median") -> Image.Image:
        """Remove noise from image"""
        try:
            if method == "median":
                return image.filter(ImageFilter.MedianFilter(size=3))
            elif method == "gaussian":
                return image.filter(ImageFilter.GaussianBlur(radius=0.5))
            else:
                return image.filter(ImageFilter.SMOOTH)
        except Exception as e:
            logger.error(f"Noise removal error: {str(e)}")
            return image
    
    @staticmethod
    def auto_color_balance(image: Image.Image) -> Image.Image:
        """Apply automatic color balance"""
        try:
            img_array = np.array(image)
            
            # Apply histogram stretching for each channel
            for i in range(3):  # RGB channels
                channel = img_array[:, :, i]
                # Get 2nd and 98th percentiles to avoid outliers
                p2, p98 = np.percentile(channel, (2, 98))
                # Stretch histogram
                img_array[:, :, i] = np.clip((channel - p2) * 255 / (p98 - p2), 0, 255)
            
            return Image.fromarray(img_array.astype(np.uint8))
        except Exception as e:
            logger.error(f"Auto color balance error: {str(e)}")
            return image
    
    @staticmethod
    def get_image_histogram(image: Image.Image) -> Dict[str, Any]:
        """Get image histogram data"""
        try:
            img_array = np.array(image)
            
            if len(img_array.shape) == 3:
                # RGB image
                hist_r = np.histogram(img_array[:, :, 0], bins=256, range=(0, 256))[0]
                hist_g = np.histogram(img_array[:, :, 1], bins=256, range=(0, 256))[0]
                hist_b = np.histogram(img_array[:, :, 2], bins=256, range=(0, 256))[0]
                
                return {
                    "red": hist_r.tolist(),
                    "green": hist_g.tolist(),
                    "blue": hist_b.tolist(),
                    "type": "rgb"
                }
            else:
                # Grayscale image
                hist = np.histogram(img_array, bins=256, range=(0, 256))[0]
                return {
                    "gray": hist.tolist(),
                    "type": "grayscale"
                }
                
        except Exception as e:
            logger.error(f"Histogram calculation error: {str(e)}")
            return {"error": str(e)}
    
    @staticmethod
    def convert_format(image: Image.Image, target_format: str = "JPEG", quality: int = 95) -> bytes:
        """Convert image to specified format and return bytes"""
        try:
            from io import BytesIO
            
            output = BytesIO()
            
            # Ensure RGB mode for JPEG
            if target_format.upper() == "JPEG" and image.mode != "RGB":
                image = image.convert("RGB")
            
            image.save(output, format=target_format, quality=quality)
            return output.getvalue()
            
        except Exception as e:
            logger.error(f"Format conversion error: {str(e)}")
            raise e
