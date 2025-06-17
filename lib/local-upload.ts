/**
 * Local file upload handler for development
 * Converts files to base64 and handles them locally
 */

export interface UploadResult {
  url: string;
  name: string;
  size: number;
  type: string;
  base64?: string;
}

export class LocalUploadHandler {
  /**
   * Convert file to base64 data URL
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert file to base64'));
        }
      };
      reader.onerror = () => reject(new Error('File reading failed'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Upload files locally (convert to base64)
   */
  async uploadFiles(files: File[]): Promise<UploadResult[]> {
    const results: UploadResult[] = [];

    for (const file of files) {
      try {
        const base64 = await this.fileToBase64(file);
        
        // Create a mock URL for the file
        const mockUrl = `data:${file.type};base64,${base64.split(',')[1]}`;
        
        results.push({
          url: mockUrl,
          name: file.name,
          size: file.size,
          type: file.type,
          base64: base64.split(',')[1] // Remove data URL prefix
        });
      } catch (error) {
        console.error(`Failed to process file ${file.name}:`, error);
        throw new Error(`Failed to process file: ${file.name}`);
      }
    }

    return results;
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File, maxSize: number = 8 * 1024 * 1024): boolean {
    // Check file size
    if (file.size > maxSize) {
      throw new Error(`File ${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      throw new Error(`File ${file.name} is not an image`);
    }

    return true;
  }

  /**
   * Create a mock useUploadThing hook for local development
   */
  createMockUploadThing() {
    return {
      startUpload: async (files: File[]) => {
        // Validate files
        files.forEach(file => this.validateFile(file));
        
        // Upload files
        return await this.uploadFiles(files);
      },
      isUploading: false
    };
  }
}

// Export singleton instance
export const localUploadHandler = new LocalUploadHandler();

/**
 * Hook that switches between UploadThing and local upload based on environment
 */
export function useFileUpload(endpoint: string, callbacks?: {
  onClientUploadComplete?: (res: UploadResult[]) => void;
  onUploadError?: (error: Error) => void;
}) {
  const useLocalUpload = process.env.NEXT_PUBLIC_USE_LOCAL_UPLOAD === 'true';

  if (useLocalUpload) {
    // Use local upload for development
    return {
      startUpload: async (files: File[]) => {
        try {
          const results = await localUploadHandler.uploadFiles(files);
          callbacks?.onClientUploadComplete?.(results);
          return results;
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Upload failed');
          callbacks?.onUploadError?.(err);
          throw err;
        }
      },
      isUploading: false
    };
  } else {
    // Use UploadThing for production (when keys are available)
    // This would import and use the real useUploadThing hook
    throw new Error('UploadThing not configured. Set UPLOADTHING_SECRET and UPLOADTHING_APP_ID in .env.local');
  }
}
