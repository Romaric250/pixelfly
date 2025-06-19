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
  const [previewModal, setPreviewModal] = useState<{isOpen: boolean, imageData: string, title: string, type: 'original' | 'watermarked'}>({
    isOpen: false,
    imageData: '',
    title: '',
    type: 'original'
  });

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
                      <div key={index} className="relative group">
                        <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 hover:border-purple-300 transition-colors">
                          <img
                            src={`data:image/jpeg;base64,${base64}`}
                            alt={uploadedFilenames[index]}
                            className="w-full h-40 object-contain bg-gray-50 hover:scale-105 transition-transform cursor-pointer"
                            onError={(e) => {
                              console.error('Failed to load preview image', index);
                              e.currentTarget.style.display = 'none';
                            }}
                            onClick={() => {
                              // Open image in new tab for full view
                              const newWindow = window.open();
                              if (newWindow) {
                                newWindow.document.write(`
                                  <html>
                                    <head><title>${uploadedFilenames[index]}</title></head>
                                    <body style="margin:0; background:#000; display:flex; justify-content:center; align-items:center; min-height:100vh;">
                                      <img src="data:image/jpeg;base64,${base64}" style="max-width:100%; max-height:100%; object-fit:contain;" />
                                    </body>
                                  </html>
                                `);
                              }
                            }}
                          />
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                            {uploadedFilenames[index]?.substring(0, 20)}...
                          </div>
                          <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            {index + 1}
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-sm font-medium">
                              🔍 Click to view full size
                            </span>
                          </div>
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
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-center text-gray-800">🔍 Before & After Preview</h3>
                <div className="space-y-8">
                  {result.watermarkedBase64.map((watermarkedBase64, index) => (
                    <div key={index} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                      {/* Image Info Header */}
                      <div className="mb-4 text-center">
                        <h4 className="text-lg font-semibold text-gray-800">
                          📷 {uploadedFilenames[index] || `Image ${index + 1}`}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Watermark: {watermarkConfig.text} • Style: {watermarkConfig.style} • Position: {watermarkConfig.position}
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
                              src={`data:image/jpeg;base64,${uploadedFiles[index]}`}
                              alt={`Original ${uploadedFilenames[index]}`}
                              className="w-full h-auto max-h-96 object-contain bg-gray-50 cursor-pointer hover:opacity-90 transition-opacity"
                              onError={(e) => {
                                console.error('Failed to load original image', index);
                                e.currentTarget.style.display = 'none';
                              }}
                              onClick={() => setPreviewModal({
                                isOpen: true,
                                imageData: uploadedFiles[index],
                                title: `Original - ${uploadedFilenames[index]}`,
                                type: 'original'
                              })}
                            />
                            <div className="absolute top-3 left-3 bg-gray-800 bg-opacity-80 text-white text-sm px-3 py-1 rounded-full">
                              📸 Original
                            </div>
                          </div>
                        </div>

                        {/* Watermarked */}
                        <div className="space-y-3">
                          <h5 className="font-semibold text-purple-700 text-center flex items-center justify-center gap-2">
                            🛡️ Watermarked Image
                            <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">After</span>
                          </h5>
                          <div className="relative rounded-xl overflow-hidden border-2 border-purple-300 shadow-md hover:shadow-lg transition-shadow">
                            <img
                              src={`data:image/jpeg;base64,${watermarkedBase64}`}
                              alt={`Watermarked ${uploadedFilenames[index]}`}
                              className="w-full h-auto max-h-96 object-contain bg-gray-50 cursor-pointer hover:opacity-90 transition-opacity"
                              onError={(e) => {
                                console.error('Failed to load watermarked image', index);
                                e.currentTarget.style.display = 'none';
                              }}
                              onLoad={() => console.log(`Watermarked image ${index} loaded successfully`)}
                              onClick={() => setPreviewModal({
                                isOpen: true,
                                imageData: watermarkedBase64,
                                title: `Watermarked - ${uploadedFilenames[index]}`,
                                type: 'watermarked'
                              })}
                            />
                            {/* Move overlays to top to avoid hiding watermarks */}
                            <div className="absolute top-3 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-lg">
                              {watermarkConfig.style}
                            </div>
                            <div className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded shadow-lg">
                              ✅ Watermarked
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="mt-4 flex justify-center gap-3">
                        <button
                          onClick={() => {
                            // Download individual image
                            try {
                              const byteCharacters = atob(watermarkedBase64);
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
                              link.click();
                              document.body.removeChild(link);
                              URL.revokeObjectURL(url);
                            } catch (error) {
                              console.error('Download failed for image', index, error);
                            }
                          }}
                          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                        >
                          📥 Download This Image
                        </button>
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

      {/* Full-Screen Preview Modal */}
      {previewModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full w-full h-full flex flex-col">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 text-white">
              <div>
                <h3 className="text-xl font-bold">{previewModal.title}</h3>
                <p className="text-sm text-gray-300">
                  {previewModal.type === 'watermarked' ? '🛡️ Watermarked Version' : '📸 Original Version'}
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
                src={`data:image/jpeg;base64,${previewModal.imageData}`}
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
              {previewModal.type === 'watermarked' && (
                <button
                  onClick={() => {
                    try {
                      const byteCharacters = atob(previewModal.imageData);
                      const byteNumbers = new Array(byteCharacters.length);
                      for (let i = 0; i < byteCharacters.length; i++) {
                        byteNumbers[i] = byteCharacters.charCodeAt(i);
                      }
                      const byteArray = new Uint8Array(byteNumbers);
                      const blob = new Blob([byteArray], { type: 'image/jpeg' });

                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.download = `watermarked-${previewModal.title.replace('Watermarked - ', '')}.jpg`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                    } catch (error) {
                      console.error('Download failed:', error);
                    }
                  }}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  📥 Download
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Metadata moved to layout.tsx since this is a client component
