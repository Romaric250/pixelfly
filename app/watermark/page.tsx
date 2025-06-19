"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Shield, Download, Settings, Zap } from "lucide-react";
// import { useFileUpload } from "@/lib/local-upload"; // Removed - processing files directly
import { backendClient } from "@/lib/backend-client";
import { useSession } from "@/lib/auth-client";
import { Navbar } from "@/components/navbar";
import { BackendStatus } from "@/components/backend-status";

interface WatermarkResult {
  watermarkedUrls?: string[];
  watermarkedBase64?: string[];
  processingTime: number;
  processedCount: number;
}

export default function WatermarkPage() {
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [result, setResult] = useState<WatermarkResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [uploadedFilenames, setUploadedFilenames] = useState<string[]>([]);

  // Revolutionary watermark configuration
  const [watermarkConfig, setWatermarkConfig] = useState({
    text: "© PixelFly",
    position: "smart_adaptive",
    opacity: 0.8,
    color: "white",
    style: "modern_glass",
    size: "medium",
    protection_level: "advanced",
    blend_mode: "overlay"
  });

  // Removed UploadThing dependency - processing files directly

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Limit to max 3 files
    if (acceptedFiles.length > 3) {
      setError("Maximum 3 photos allowed. Please select up to 3 images.");
      return;
    }

    if (acceptedFiles.length === 0) return;

    setError(null);
    setResult(null);
    setIsProcessing(true);
    setProgress(0);
    setTotalCount(acceptedFiles.length);

    try {
      // Process files directly without UploadThing
      const base64Files: string[] = [];
      const filenames: string[] = [];

      for (const file of acceptedFiles) {
        const reader = new FileReader();
        const base64 = await new Promise<string>((resolve) => {
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        base64Files.push(base64.split(',')[1]); // Remove data URL prefix
        filenames.push(file.name);
      }

      setUploadedFiles(base64Files);
      setUploadedFilenames(filenames);
      setIsProcessing(false);
    } catch (error) {
      setError("Failed to process photos");
      setIsProcessing(false);
    }
  }, []);

  const processWatermarking = async () => {
    if (uploadedFiles.length === 0) return;

    try {
      setIsProcessing(true);
      setProgress(0);
      setProcessedCount(0);

      console.log('Starting revolutionary watermarking process...');
      console.log('Config:', watermarkConfig);
      console.log('Files to process:', uploadedFiles.length);

      // Call backend for revolutionary watermarking
      const request = {
        image_base64_list: uploadedFiles,
        user_id: "anonymous", // session?.user?.id || "anonymous",
        watermark_config: watermarkConfig
      };

      setProgress(30);

      const watermarkResult = await backendClient.watermarkPhotos(request);

      setProgress(80);

      if (watermarkResult.success) {
        setResult({
          watermarkedBase64: watermarkResult.watermarked_base64,
          processingTime: watermarkResult.processing_time,
          processedCount: watermarkResult.processed_count
        });
        setProgress(100);
      } else {
        throw new Error(watermarkResult.error || "Watermarking failed");
      }

    } catch (error) {
      console.error('Watermarking error:', error);
      setError(error instanceof Error ? error.message : "Watermarking failed");
      setProgress(0);
    } finally {
      setIsProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 3, // Revolutionary limit: max 3 photos
    maxSize: 8 * 1024 * 1024, // 8MB per file
    disabled: isProcessing
  });

  const downloadAll = () => {
    if (result?.watermarkedBase64) {
      result.watermarkedBase64.forEach((base64, index) => {
        try {
          // Convert base64 to blob and download
          const byteCharacters = atob(base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: 'image/jpeg' });

          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `watermarked-${uploadedFilenames[index] || `image-${index + 1}.jpg`}`;
          document.body.appendChild(link);
          setTimeout(() => {
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }, index * 200);
        } catch (error) {
          console.error('Download failed for image', index, error);
        }
      });
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🛡️ Revolutionary AI Watermarking
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Intelligent watermarking with adaptive placement and advanced protection
        </p>
        <div className="flex justify-center gap-4 text-sm text-purple-600 font-medium">
          <span>🧠 Smart Adaptive Placement</span>
          <span>🎨 Multiple Artistic Styles</span>
          <span>🔒 Advanced Protection</span>
          <span>📸 1-3 Photos Max</span>
        </div>
      </div>

      {/* Backend Status */}
      <BackendStatus />

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Upload Area */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
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
                      {isDragActive ? "Drop your photos here" : "Upload photos to watermark"}
                    </p>
                    <p className="text-gray-500 mt-2">
                      Drag & drop or click to select • 1-3 photos only • Max 8MB each
                    </p>
                    <p className="text-xs text-purple-600 mt-1">
                      ✨ AI will intelligently place watermarks to avoid important content
                    </p>
                  </div>
                </motion.div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <p className="font-medium mb-4">{uploadedFiles.length} photos uploaded</p>

                  {/* Image Previews */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {uploadedFiles.slice(0, 3).map((base64, index) => (
                      <div key={index} className="relative">
                        <img
                          src={`data:image/jpeg;base64,${base64}`}
                          alt={uploadedFilenames[index]}
                          className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                          onError={(e) => {
                            console.error('Failed to load preview image', index);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {uploadedFilenames[index]?.substring(0, 15)}...
                        </div>
                        <div className="absolute top-1 right-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                          {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* File List */}
                  <div className="grid grid-cols-2 gap-2">
                    {uploadedFilenames.map((filename, index) => (
                      <div key={index} className="text-xs text-gray-600 truncate flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {filename}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          {/* Watermark Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Watermark Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="watermark-text">🎨 Watermark Text</Label>
                <Input
                  id="watermark-text"
                  value={watermarkConfig.text}
                  onChange={(e) => setWatermarkConfig(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="© Your Name"
                />
              </div>

              <div>
                <Label htmlFor="position">🧠 Smart Placement</Label>
                <select
                  id="position"
                  value={watermarkConfig.position}
                  onChange={(e) => setWatermarkConfig(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="smart_adaptive">🤖 AI Smart Adaptive</option>
                  <option value="content_aware">🎯 Content Aware</option>
                  <option value="edge_detection">🔍 Edge Detection</option>
                  <option value="bottom_right">📍 Bottom Right</option>
                  <option value="bottom_left">📍 Bottom Left</option>
                  <option value="top_right">📍 Top Right</option>
                  <option value="top_left">📍 Top Left</option>
                  <option value="center">📍 Center</option>
                </select>
              </div>

              <div>
                <Label htmlFor="style">✨ Watermark Style</Label>
                <select
                  id="style"
                  value={watermarkConfig.style}
                  onChange={(e) => setWatermarkConfig(prev => ({ ...prev, style: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="modern_glass">🔮 Modern Glass</option>
                  <option value="neon_glow">⚡ Neon Glow</option>
                  <option value="vintage_stamp">📜 Vintage Stamp</option>
                  <option value="holographic">🌈 Holographic</option>
                  <option value="minimal_clean">🎯 Minimal Clean</option>
                  <option value="artistic_brush">🎨 Artistic Brush</option>
                </select>
              </div>

              <div>
                <Label htmlFor="protection">🔒 Protection Level</Label>
                <select
                  id="protection"
                  value={watermarkConfig.protection_level}
                  onChange={(e) => setWatermarkConfig(prev => ({ ...prev, protection_level: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="basic">🛡️ Basic Protection</option>
                  <option value="advanced">🔐 Advanced Protection</option>
                  <option value="forensic">🕵️ Forensic Level</option>
                  <option value="invisible">👻 Invisible Steganography</option>
                </select>
              </div>

              <div>
                <Label htmlFor="opacity">💫 Opacity: {Math.round(watermarkConfig.opacity * 100)}%</Label>
                <input
                  type="range"
                  id="opacity"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={watermarkConfig.opacity}
                  onChange={(e) => setWatermarkConfig(prev => ({ ...prev, opacity: parseFloat(e.target.value) }))}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="color">🎨 Color</Label>
                <select
                  id="color"
                  value={watermarkConfig.color}
                  onChange={(e) => setWatermarkConfig(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="white">⚪ White</option>
                  <option value="black">⚫ Black</option>
                  <option value="red">🔴 Red</option>
                  <option value="blue">🔵 Blue</option>
                  <option value="green">🟢 Green</option>
                  <option value="yellow">🟡 Yellow</option>
                  <option value="purple">🟣 Purple</option>
                  <option value="orange">🟠 Orange</option>
                </select>
              </div>

              <div>
                <Label htmlFor="size">📏 Size</Label>
                <select
                  id="size"
                  value={watermarkConfig.size}
                  onChange={(e) => setWatermarkConfig(prev => ({ ...prev, size: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="small">🔸 Small</option>
                  <option value="medium">🔹 Medium</option>
                  <option value="large">🔶 Large</option>
                  <option value="adaptive">🎯 Adaptive</option>
                </select>
              </div>

              <Button
                onClick={processWatermarking}
                disabled={uploadedFiles.length === 0 || isProcessing}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isProcessing ? (
                  <>
                    <Shield className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Add Watermarks
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Processing Progress */}
      {isProcessing && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-purple-600 animate-spin" />
                <span className="font-medium">
                  Processing watermarks... ({processedCount}/{totalCount})
                </span>
              </div>
              <Progress value={progress} className="w-full" />
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
              <Shield className="w-5 h-5 text-purple-600" />
              Watermarking Complete!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Processing Stats */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600">{result.processedCount}</div>
                  <div className="text-sm text-gray-600">Photos Processed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{result.processingTime.toFixed(1)}s</div>
                  <div className="text-sm text-gray-600">Processing Time</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{watermarkConfig.text}</div>
                  <div className="text-sm text-gray-600">Watermark Text</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-600">{watermarkConfig.position.replace('_', ' ')}</div>
                  <div className="text-sm text-gray-600">Position</div>
                </div>
              </div>
            </div>

            {/* Before/After Preview */}
            {result.watermarkedBase64 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center">🔍 Before & After Preview</h3>
                <div className="grid gap-6">
                  {result.watermarkedBase64.map((watermarkedBase64, index) => (
                    <div key={index} className="grid md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      {/* Original */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-gray-700 text-center">📸 Original</h4>
                        <div className="relative rounded-lg overflow-hidden border-2 border-gray-200">
                          <img
                            src={`data:image/jpeg;base64,${uploadedFiles[index]}`}
                            alt={`Original ${uploadedFilenames[index]}`}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              console.error('Failed to load original image', index);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <div className="absolute bottom-2 left-2 bg-gray-800 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                            Original
                          </div>
                        </div>
                      </div>

                      {/* Watermarked */}
                      <div className="space-y-2">
                        <h4 className="font-medium text-purple-700 text-center">🛡️ Watermarked</h4>
                        <div className="relative rounded-lg overflow-hidden border-2 border-purple-200">
                          <img
                            src={`data:image/jpeg;base64,${watermarkedBase64}`}
                            alt={`Watermarked ${uploadedFilenames[index]}`}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              console.error('Failed to load watermarked image', index);
                              e.currentTarget.style.display = 'none';
                            }}
                            onLoad={() => console.log(`Watermarked image ${index} loaded successfully`)}
                          />
                          <div className="absolute bottom-2 left-2 bg-purple-600 bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                            🛡️ Protected
                          </div>
                          <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                            ✅ Enhanced
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Download Button */}
            <div className="flex justify-center">
              <Button
                onClick={downloadAll}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
              >
                <Download className="w-5 h-5 mr-2" />
                Download All Watermarked Photos ({result.processedCount})
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
        </div>
      </div>
    </>
  );
}

// Metadata moved to layout.tsx since this is a client component
