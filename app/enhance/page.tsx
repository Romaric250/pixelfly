"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Sparkles, Download, Zap, Image as ImageIcon } from "lucide-react";
import { useFileUpload } from "@/lib/local-upload";
import { backendClient } from "@/lib/backend-client";
import { useSession } from "@/lib/auth-client";
import { Navbar } from "@/components/navbar";
import { BackendStatus } from "@/components/backend-status";

interface EnhancementResult {
  originalUrl: string;
  enhancedUrl?: string;
  enhancedBase64?: string;
  originalFilename?: string;
  processingTime: number;
  enhancementsApplied: string[];
}

export default function EnhancePage() {
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<EnhancementResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Removed UploadThing dependency - processing files directly

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setError(null);
    setResult(null);
    setIsProcessing(true);
    setProgress(0);

    try {
      const file = acceptedFiles[0];
      console.log('Processing file directly:', file.name, file.size);

      // Convert file to base64 directly
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64Data = e.target?.result as string;
          console.log('File converted to base64, length:', base64Data.length);
          await processEnhancement(base64Data, file.name);
        } catch (error) {
          console.error('Error processing file:', error);
          setError("Failed to process photo");
          setIsProcessing(false);
        }
      };
      reader.onerror = () => {
        setError("Failed to read photo file");
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error in onDrop:', error);
      setError("Failed to upload photo");
      setIsProcessing(false);
    }
  }, []);

  const processEnhancement = async (imageData: string, filename?: string) => {
    try {
      setProgress(20);

      // Test backend connection first
      console.log('Testing backend connection...');
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001';
      console.log('Backend URL:', backendUrl);

      try {
        const healthResponse = await fetch(`${backendUrl}/health`);
        console.log('Health check response:', healthResponse.status);
        if (healthResponse.ok) {
          const healthData = await healthResponse.json();
          console.log('Health check data:', healthData);
        }
      } catch (healthError) {
        console.error('Health check failed:', healthError);
        throw new Error('Backend is not accessible. Please make sure it\'s running on port 5001.');
      }

      // Determine if we have base64 or URL
      const isBase64 = imageData.startsWith('data:');
      let base64Data = '';

      if (isBase64) {
        base64Data = imageData.split(',')[1];
      } else {
        // Convert blob URL to base64
        try {
          const response = await fetch(imageData);
          const blob = await response.blob();
          const reader = new FileReader();
          base64Data = await new Promise((resolve) => {
            reader.onload = () => {
              const result = reader.result as string;
              resolve(result.split(',')[1]);
            };
            reader.readAsDataURL(blob);
          });
        } catch (e) {
          throw new Error("Failed to process image");
        }
      }

      const request = {
        user_id: session?.user?.id || "anonymous",
        enhancement_type: "auto",
        return_format: "base64" as const,
        image_base64: base64Data
      };

      setProgress(50);

      console.log('Calling backend with request:', {
        ...request,
        image_base64: request.image_base64 ? `[${request.image_base64.length} chars]` : 'none'
      });

      // Call backend for AI enhancement
      const enhancementResult = await backendClient.enhancePhotoWithProgress(
        request,
        (progress) => {
          console.log('Progress update:', progress);
          setProgress(progress);
        }
      );

      console.log('Enhancement result:', {
        success: enhancementResult.success,
        enhanced_base64_length: enhancementResult.enhanced_base64?.length,
        processing_time: enhancementResult.processing_time,
        enhancements_applied: enhancementResult.enhancements_applied
      });

      if (enhancementResult.success) {
        // Ensure enhanced_base64 doesn't have data URL prefix
        let enhancedBase64 = enhancementResult.enhanced_base64;
        if (enhancedBase64 && enhancedBase64.startsWith('data:')) {
          enhancedBase64 = enhancedBase64.split(',')[1];
          console.log('Removed data URL prefix from enhanced image');
        }

        const resultData = {
          originalUrl: `data:image/jpeg;base64,${base64Data}`,
          enhancedUrl: enhancementResult.enhanced_url,
          enhancedBase64: enhancedBase64,
          originalFilename: filename || 'photo.jpg',
          processingTime: enhancementResult.processing_time,
          enhancementsApplied: enhancementResult.enhancements_applied
        };

        console.log('Setting result:', {
          originalUrlLength: resultData.originalUrl.length,
          enhancedBase64Length: resultData.enhancedBase64?.length,
          enhancedUrl: resultData.enhancedUrl,
          filename: resultData.originalFilename,
          originalBase64Length: base64Data.length
        });

        setResult(resultData);
      } else {
        throw new Error(enhancementResult.error || "Enhancement failed");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Enhancement failed");
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    maxSize: 8 * 1024 * 1024, // 8MB
    disabled: isProcessing
  });

  const downloadEnhanced = () => {
    if (result?.enhancedBase64) {
      // Download from base64 data
      const filename = result.originalFilename
        ? `enhanced-${result.originalFilename}`
        : 'enhanced-photo.jpg';

      try {
        console.log('Starting download for:', filename);
        console.log('Enhanced base64 length:', result.enhancedBase64.length);

        // Ensure we have clean base64 data
        let base64 = result.enhancedBase64;
        if (base64.startsWith('data:')) {
          base64 = base64.split(',')[1];
          console.log('Removed data URL prefix, new length:', base64.length);
        }

        // Convert base64 to blob
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/jpeg' });

        console.log('Created blob with size:', blob.size, 'bytes');

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log('Download initiated successfully');
      } catch (error) {
        console.error('Download failed:', error);
        setError('Failed to download enhanced image');
      }
    } else if (result?.enhancedUrl) {
      // Fallback to URL download
      const link = document.createElement('a');
      link.href = result.enhancedUrl;
      link.download = 'enhanced-photo.jpg';
      link.click();
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Photo Enhancement
        </h1>
        <p className="text-xl text-gray-600">
          Transform your photos to iPhone 14 Pro Max quality with AI
        </p>
      </div>

      {/* Backend Status */}
      <BackendStatus />

      {/* Upload Area */}
      <Card>
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
              isDragActive
                ? "border-purple-500 bg-purple-50"
                : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
            } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <input {...getInputProps()} />

            <motion.div
              animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
              className="space-y-4"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                <Upload className="w-8 h-8 text-purple-600" />
              </div>

              <div>
                <p className="text-lg font-semibold text-gray-900">
                  {isDragActive ? "Drop your photo here" : "Upload a photo to enhance"}
                </p>
                <p className="text-gray-500 mt-2">
                  Drag & drop or click to select • Max 8MB • JPG, PNG, WebP
                </p>
              </div>
            </motion.div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Progress */}
      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-purple-600 animate-spin" />
                <span className="font-medium">
Enhancing with AI...
                </span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600">
                This may take a few seconds depending on image complexity
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 text-red-700">
              <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">!</span>
              </div>
              <span className="font-medium">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Display */}
      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              Enhancement Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Before/After Comparison */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
                  Original
                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Before</span>
                </h3>
                <div className="relative rounded-lg overflow-hidden bg-gray-100 border-2 border-gray-200">
                  <img
                    src={result.originalUrl}
                    alt="Original photo"
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      console.error('Failed to load original image');
                      e.currentTarget.style.display = 'none';
                    }}
                    onLoad={() => console.log('Original image loaded successfully')}
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-purple-700 flex items-center gap-2">
                  Enhanced
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">After AI</span>
                </h3>
                <div className="relative rounded-lg overflow-hidden bg-gray-100 border-2 border-purple-200">
                  <img
                    src={result.enhancedBase64 ? `data:image/jpeg;base64,${result.enhancedBase64}` : result.enhancedUrl}
                    alt="Enhanced photo"
                    className="w-full h-64 object-cover"
                    onError={(e) => {
                      console.error('Failed to load enhanced image');
                      console.log('Enhanced base64 length:', result.enhancedBase64?.length);
                      console.log('Enhanced image src preview:', result.enhancedBase64 ? `data:image/jpeg;base64,${result.enhancedBase64.substring(0, 50)}...` : result.enhancedUrl);
                      e.currentTarget.style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log('Enhanced image loaded successfully');
                      console.log('Enhanced image dimensions:', e.currentTarget.naturalWidth, 'x', e.currentTarget.naturalHeight);
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                    ✨ AI Enhanced
                  </div>
                  <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                    Enhanced Quality
                  </div>
                </div>
              </div>
            </div>

            {/* Enhancement Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">Enhancements Applied:</h4>
              <div className="flex flex-wrap gap-2 mb-4">
                {result.enhancementsApplied.map((enhancement, index) => (
                  <span
                    key={index}
                    className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {enhancement.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600">
                Processing time: {result.processingTime.toFixed(2)}s
              </p>
            </div>

            {/* Download Button */}
            <div className="flex justify-center">
              <Button
                onClick={downloadEnhanced}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Enhanced Photo
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Features Info */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 text-center">AI Enhancement Features</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Sparkles, title: "Smart Enhancement", desc: "AI analyzes and improves quality automatically" },
              { icon: Zap, title: "Lightning Fast", desc: "Get results in seconds with powerful AI" },
              { icon: ImageIcon, title: "Professional Quality", desc: "iPhone 14 Pro Max level enhancement" }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-medium mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
        </div>
      </div>
    </>
  );
}

// Metadata moved to layout.tsx since this is a client component
