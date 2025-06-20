"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
// import { Progress } from "@/components/ui/progress"; // Temporarily commented out
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Sparkles, Download, Zap, Image as ImageIcon } from "lucide-react";
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
  const [previewModal, setPreviewModal] = useState<{isOpen: boolean, imageData: string, title: string, type: 'original' | 'enhanced'}>({
    isOpen: false,
    imageData: '',
    title: '',
    type: 'original'
  });

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setResult(null);
    setIsProcessing(true);
    setProgress(0);

    try {
      const file = files[0];
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
      console.error('Error in handleFileChange:', error);
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
            <p className="text-xl text-gray-600 mb-4">
              Transform your photos to iPhone 14 Pro Max quality with AI
            </p>
            {!session && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
                <p className="text-purple-800 text-sm">
                  🎉 <strong>Free Trial:</strong> Try photo enhancement without signing up!
                  <a href="/sign-up" className="text-purple-600 hover:text-purple-700 underline ml-1">
                    Create an account
                  </a> to save your enhanced photos and access more features.
                </p>
              </div>
            )}
          </div>

          {/* Backend Status */}
          <BackendStatus />

          {/* Upload Area */}
          <Card>
            <CardContent className="p-8">
              <div className={`border-2 border-dashed rounded-xl p-12 text-center transition-all border-gray-300 hover:border-purple-400 hover:bg-gray-50 ${isProcessing ? "opacity-50" : ""}`}>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-purple-600" />
                  </div>

                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      Upload a photo to enhance
                    </p>
                    <p className="text-gray-500 mt-2">
                      Select a photo • Max 8MB • JPG, PNG, WebP
                    </p>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    disabled={isProcessing}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                </div>
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
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
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
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-center text-gray-800">🔍 Before & After Comparison</h3>

                  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                    {/* Enhancement Info Header */}
                    <div className="mb-4 text-center">
                      <h4 className="text-lg font-semibold text-gray-800">
                        📷 {result.originalFilename || 'Enhanced Photo'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Processing time: {result.processingTime?.toFixed(2)}s • {result.enhancementsApplied?.length} enhancements applied
                      </p>
                    </div>

                    {/* Images Grid */}
                    <div className="grid lg:grid-cols-2 gap-6">
                      {/* Original */}
                      <div className="space-y-3">
                        <h5 className="font-semibold text-gray-700 text-center flex items-center justify-center gap-2">
                          📸 Original Image
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Before</span>
                        </h5>
                        <div className="relative rounded-xl overflow-hidden border-2 border-gray-300 shadow-md hover:shadow-lg transition-shadow">
                          <img
                            src={result.originalUrl}
                            alt="Original photo"
                            className="w-full h-auto max-h-96 object-contain bg-gray-50 cursor-pointer hover:opacity-90 transition-opacity"
                            onError={(e) => {
                              console.error('Failed to load original image');
                              e.currentTarget.style.display = 'none';
                            }}
                            onLoad={() => console.log('Original image loaded successfully')}
                            onClick={() => setPreviewModal({
                              isOpen: true,
                              imageData: result.originalUrl.split(',')[1] || result.originalUrl,
                              title: `Original - ${result.originalFilename || 'Photo'}`,
                              type: 'original'
                            })}
                          />
                          <div className="absolute top-3 left-3 bg-gray-800 bg-opacity-80 text-white text-sm px-3 py-1 rounded-full">
                            📸 Original
                          </div>
                        </div>
                      </div>

                      {/* Enhanced */}
                      <div className="space-y-3">
                        <h5 className="font-semibold text-purple-700 text-center flex items-center justify-center gap-2">
                          ✨ Enhanced Image
                          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">After AI</span>
                        </h5>
                        <div className="relative rounded-xl overflow-hidden border-2 border-purple-300 shadow-md hover:shadow-lg transition-shadow">
                          <img
                            src={result.enhancedBase64 ? `data:image/jpeg;base64,${result.enhancedBase64}` : result.enhancedUrl}
                            alt="Enhanced photo"
                            className="w-full h-auto max-h-96 object-contain bg-gray-50 cursor-pointer hover:opacity-90 transition-opacity"
                            onError={(e) => {
                              console.error('Failed to load enhanced image');
                              console.log('Enhanced base64 length:', result.enhancedBase64?.length);
                              e.currentTarget.style.display = 'none';
                            }}
                            onLoad={(e) => {
                              console.log('Enhanced image loaded successfully');
                              console.log('Enhanced image dimensions:', e.currentTarget.naturalWidth, 'x', e.currentTarget.naturalHeight);
                            }}
                            onClick={() => setPreviewModal({
                              isOpen: true,
                              imageData: result.enhancedBase64 || (result.enhancedUrl?.split(',')[1] || result.enhancedUrl || ''),
                              title: `Enhanced - ${result.originalFilename || 'Photo'}`,
                              type: 'enhanced'
                            })}
                          />
                          <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-2 py-1 rounded shadow-lg">
                            ✨ AI Enhanced
                          </div>
                          <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded shadow-lg">
                            Enhanced Quality
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Download */}
                    <div className="mt-4 flex justify-center">
                      <button
                        onClick={downloadEnhanced}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                      >
                        📥 Download Enhanced Image
                      </button>
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

      {/* Full-Screen Preview Modal */}
      {previewModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full w-full h-full flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 text-white">
              <div>
                <h3 className="text-xl font-bold">{previewModal.title}</h3>
                <p className="text-sm text-gray-300">
                  {previewModal.type === 'enhanced' ? '✨ AI Enhanced Version' : '📸 Original Version'}
                </p>
              </div>
              <button
                onClick={() => setPreviewModal({isOpen: false, imageData: '', title: '', type: 'original'})}
                className="text-white hover:text-gray-300 text-2xl font-bold p-2"
              >
                ✕
              </button>
            </div>
            {/* Modal Image */}
            <div className="flex-1 flex items-center justify-center">
              <img
                src={previewModal.type === 'original' ? result?.originalUrl : `data:image/jpeg;base64,${previewModal.imageData}`}
                alt={previewModal.title}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  console.error('Failed to load modal image');
                  e.currentTarget.style.display = 'none';
                }}
              />
              
            </div>

            {/* Modal Footer */}
            <div className="mt-4 flex justify-center gap-4">
              <button
                onClick={() => setPreviewModal({isOpen: false, imageData: '', title: '', type: 'original'})}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
              {previewModal.type === 'enhanced' && (
                <button
                  onClick={downloadEnhanced}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  📥 Download Enhanced
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
