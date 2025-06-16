/**
 * Backend Client for PixelFly
 * Handles communication with Flask backend for AI processing
 */

interface EnhancementRequest {
  image_url: string;
  user_id: string;
  enhancement_type?: string;
}

interface WatermarkRequest {
  image_urls: string[];
  user_id: string;
  watermark_config?: {
    text?: string;
    position?: string;
    opacity?: number;
    color?: string;
    font_size?: number;
  };
}

interface EnhancementResponse {
  success: boolean;
  enhanced_url: string;
  processing_time: number;
  enhancements_applied: string[];
  error?: string;
}

interface WatermarkResponse {
  success: boolean;
  watermarked_urls: string[];
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
    // Use environment variable or default to localhost
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
  }

  /**
   * Check if backend is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      const data = await response.json();
      return data.status === 'healthy';
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }

  /**
   * Enhance a single photo using AI
   */
  async enhancePhoto(request: EnhancementRequest): Promise<EnhancementResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/enhance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      return await response.json();
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
      const response = await fetch(`${this.baseUrl}/api/watermark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
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
    const total = request.image_urls.length;
    
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
