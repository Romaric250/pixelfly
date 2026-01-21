/**
 * Backend Client for PixelFly
 * Handles communication with Flask backend for AI processing
 */

interface EnhancementRequest {
  image_url?: string;
  image_base64?: string;
  user_id: string;
  enhancement_type?: string;
  return_format?: 'url' | 'base64';
}

interface WatermarkRequest {
  image_urls?: string[];
  image_base64_list?: string[];
  user_id: string;
  watermark_config?: {
    text?: string;
    position?: string;
    opacity?: number;
    color?: string;
    font_size?: number;
  };
  return_format?: 'url' | 'base64';
}

interface EnhancementResponse {
  success: boolean;
  enhanced_url?: string;
  enhanced_base64?: string;
  original_filename?: string;
  processing_time: number;
  enhancements_applied: string[];
  error?: string;
}

interface WatermarkResponse {
  success: boolean;
  watermarked_urls?: string[];
  watermarked_base64?: string[];
  original_filenames?: string[];
  processing_time: number;
  processed_count: number;
  error?: string;
}

interface BackendCapabilities {
  enhancement_types: string[];
  watermark_types: string[];
  ai_models: string[];
}

class BackendClient {
  private baseUrl: string;

  constructor() {
    // Use environment variable or fallback based on environment
    if (process.env.NODE_ENV === 'production') {
      // In production, use Vercel deployment URL
      this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://pixelfly.onrender.com';
    } else {
      // In development, use local backend
      this.baseUrl = "http://localhost:5000";
    }
    console.log('Backend client initialized with URL:', this.baseUrl);
  }

  /**
   * Check if backend is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`);
      const data = await response.json();
      return data.status === 'healthy';
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }

  async refreshStats(): Promise<void> {
    try {
      console.log('🔄 Triggering stats refresh...');
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/stats?t=${timestamp}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Stats refreshed:', data);

        // Dispatch a custom event to notify components that stats have been updated
        window.dispatchEvent(new CustomEvent('statsUpdated', { detail: data }));
      } else {
        console.error('Failed to refresh stats:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Failed to refresh stats:', error);
    }
  }

  /**
   * Enhance a single photo using AI
   */
  async enhancePhoto(request: EnhancementRequest): Promise<EnhancementResponse> {
    try {
      // Default to base64 return format for direct download
      const enhancedRequest = {
        ...request,
        return_format: request.return_format || 'base64'
      };

      console.log('Sending enhancement request to:', `${this.baseUrl}/api/enhance`);
      console.log('Request payload:', {
        ...enhancedRequest,
        image_base64: enhancedRequest.image_base64 ? `[${enhancedRequest.image_base64.length} chars]` : 'none'
      });

      const response = await fetch(`${this.baseUrl}/api/enhance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enhancedRequest),
      });

      console.log('Backend response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        throw new Error(`Backend error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Backend response:', {
        success: result.success,
        enhanced_base64_length: result.enhanced_base64?.length,
        processing_time: result.processing_time,
        enhancements_applied: result.enhancements_applied
      });

      return result;
    } catch (error) {
      console.error('Photo enhancement failed:', error);
      throw error;
    }
  }

  /**
   * Add watermarks to multiple photos
   */
  async bulkWatermark(request: WatermarkRequest): Promise<WatermarkResponse> {
    try {
      // Default to base64 return format for direct download
      const enhancedRequest = {
        ...request,
        return_format: request.return_format || 'base64'
      };

      const response = await fetch(`${this.baseUrl}/api/watermark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enhancedRequest),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Bulk watermarking failed:', error);
      throw error;
    }
  }

  /**
   * Revolutionary watermarking method
   */
  async watermarkPhotos(request: any): Promise<any> {
    try {
      console.log('Sending watermark request to:', `${this.baseUrl}/api/watermark`);
      console.log('Request payload:', request);

      const response = await fetch(`${this.baseUrl}/api/watermark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      console.log('Watermark response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Watermark error response:', errorText);
        throw new Error(`Backend error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Watermark response:', {
        success: result.success,
        processed_count: result.processed_count,
        processing_time: result.processing_time
      });

      return result;
    } catch (error) {
      console.error('Watermarking failed:', error);
      throw error;
    }
  }

  /**
   * Get backend AI capabilities
   */
  async getCapabilities(): Promise<BackendCapabilities> {
    try {
      const response = await fetch(`${this.baseUrl}/api/capabilities`);
      
      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get capabilities:', error);
      // Return default capabilities
      return {
        enhancement_types: ['auto', 'portrait', 'landscape', 'food'],
        watermark_types: ['text', 'logo'],
        ai_models: ['gemini-pro-vision']
      };
    }
  }

  /**
   * Process photo enhancement with progress tracking
   */
  async enhancePhotoWithProgress(
    request: EnhancementRequest,
    onProgress?: (progress: number) => void
  ): Promise<EnhancementResponse> {
    // Simulate progress for now (in production, use WebSockets or polling)
    if (onProgress) {
      onProgress(10); // Started
      setTimeout(() => onProgress(30), 500); // Analyzing
      setTimeout(() => onProgress(60), 1000); // Processing
      setTimeout(() => onProgress(90), 1500); // Finalizing
    }

    const result = await this.enhancePhoto(request);
    
    if (onProgress) {
      onProgress(100); // Complete
    }

    return result;
  }

  /**
   * Process bulk watermarking with progress tracking
   */
  async bulkWatermarkWithProgress(
    request: WatermarkRequest,
    onProgress?: (progress: number, processed: number, total: number) => void
  ): Promise<WatermarkResponse> {
    const total = (request.image_urls || request.image_base64_list || []).length;
    
    // Simulate progress for now
    if (onProgress) {
      onProgress(0, 0, total);
      
      // Simulate processing each image
      for (let i = 0; i < total; i++) {
        setTimeout(() => {
          const progress = ((i + 1) / total) * 100;
          onProgress(progress, i + 1, total);
        }, (i + 1) * 200);
      }
    }

    return await this.bulkWatermark(request);
  }

  /**
   * Download base64 image as file
   */
  downloadBase64Image(base64Data: string, filename: string, format: string = 'jpeg') {
    try {
      // Remove data URL prefix if present
      const base64 = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');

      // Convert base64 to blob
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: `image/${format}` });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download image:', error);
      throw error;
    }
  }

  /**
   * Download multiple base64 images as ZIP (simplified version)
   */
  downloadMultipleBase64Images(base64Images: string[], filenames: string[], format: string = 'jpeg') {
    base64Images.forEach((base64, index) => {
      const filename = filenames[index] || `image-${index + 1}.${format}`;
      // Add small delay to prevent browser blocking multiple downloads
      setTimeout(() => {
        this.downloadBase64Image(base64, filename, format);
      }, index * 100);
    });
  }
}

// Export singleton instance
export const backendClient = new BackendClient();

// Export types
export type {
  EnhancementRequest,
  WatermarkRequest,
  EnhancementResponse,
  WatermarkResponse,
  BackendCapabilities
};
