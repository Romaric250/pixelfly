"use client";

import { useState, useCallback } from "react";
// import { motion } from "framer-motion"; // Removed - not used
// import { useDropzone } from "react-dropzone"; // Replaced with simple file input
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Sparkles, Download, Zap, Image as ImageIcon } from "lucide-react";
// import { useUploadThing } from "@/lib/uploadthing";
import { backendClient } from "@/lib/backend-client";
import { useSession } from "@/lib/auth-client";

interface EnhancementResult {
  originalUrl: string;
  enhancedUrl?: string;
  enhancedBase64?: string;
  originalFilename?: string;
  processingTime: number;
  enhancementsApplied: string[];
}

export function PhotoEnhancer() {
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<EnhancementResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Temporary mock for UploadThing - replace with actual implementation
  const [isUploading, setIsUploading] = useState(false);
  const startUpload = async (files: File[]) => {
    setIsUploading(true);
    try {
      // For now, create a temporary URL for demo
      const file = files[0];
      const tempUrl = URL.createObjectURL(file);
      await processEnhancement(tempUrl, file.name);
    } catch (error) {
      setError("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!session?.user) {
      setError("Please sign in to enhance photos");
      return;
    }

    if (acceptedFiles.length === 0) return;

    setError(null);
    setResult(null);
    setIsProcessing(true);
    setProgress(0);

    try {
      // Upload to UploadThing
      await startUpload(acceptedFiles);
    } catch (error) {
      setError("Failed to upload photo");
      setIsProcessing(false);
    }
  }, [session, startUpload]);

  const processEnhancement = async (imageUrl: string, filename?: string) => {
    try {
      setProgress(20);

      // Call backend for AI enhancement
      const enhancementResult = await backendClient.enhancePhotoWithProgress(
        {
          image_url: imageUrl,
          user_id: session?.user?.id || "anonymous",
          enhancement_type: "auto",
          return_format: "base64" // Request base64 for direct download
        },
        (progress) => setProgress(progress)
      );

      if (enhancementResult.success) {
        setResult({
          originalUrl: imageUrl,
          enhancedUrl: enhancementResult.enhanced_url,
          enhancedBase64: enhancementResult.enhanced_base64,
          originalFilename: filename || enhancementResult.original_filename,
          processingTime: enhancementResult.processing_time,
          enhancementsApplied: enhancementResult.enhancements_applied
        });
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onDrop(Array.from(files));
    }
  };

  const downloadEnhanced = () => {
    if (result?.enhancedBase64) {
      // Download from base64 data
      const filename = result.originalFilename
        ? `enhanced-${result.originalFilename}`
        : 'enhanced-photo.jpg';
      backendClient.downloadBase64Image(result.enhancedBase64, filename);
    } else if (result?.enhancedUrl) {
      // Fallback to URL download
      const link = document.createElement('a');
      link.href = result.enhancedUrl;
      link.download = 'enhanced-photo.jpg';
      link.click();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI Photo Enhancement
        </h1>
        <p className="text-xl text-gray-600">
          Transform your photos to iPhone 14 Pro Max quality with AI
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-8">
          <div className={`border-2 border-dashed rounded-xl p-12 text-center transition-all border-gray-300 hover:border-purple-400 hover:bg-gray-50 ${isProcessing || isUploading ? "opacity-50" : ""}`}>
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
                disabled={isProcessing || isUploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing Progress */}
      {(isProcessing || isUploading) && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-purple-600 animate-spin" />
                <span className="font-medium">
                  {isUploading ? "Uploading photo..." : "Enhancing with AI..."}
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
                <h3 className="font-semibold mb-3 text-gray-700">Original</h3>
                <div className="relative rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={result.originalUrl}
                    alt="Original photo"
                    className="w-full h-64 object-cover"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-purple-700">Enhanced</h3>
                <div className="relative rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={result.enhancedBase64 ? `data:image/jpeg;base64,${result.enhancedBase64}` : result.enhancedUrl}
                    alt="Enhanced photo"
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded text-xs font-medium">
                    AI Enhanced
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
  );
}
