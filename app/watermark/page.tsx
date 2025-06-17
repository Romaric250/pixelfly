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
import { useFileUpload } from "@/lib/local-upload";
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

  // Watermark configuration
  const [watermarkConfig, setWatermarkConfig] = useState({
    text: "© PixelFly",
    position: "bottom_right",
    opacity: 0.7,
    color: "white"
  });

  const { startUpload, isUploading } = useFileUpload("bulkWatermarker", {
    onClientUploadComplete: async (res) => {
      if (res && res.length > 0) {
        const base64List = res.map(file => file.base64 || '');
        const filenames = res.map(file => file.name);
        setUploadedFiles(base64List);
        setUploadedFilenames(filenames);
      }
    },
    onUploadError: (error) => {
      setError(`Upload failed: ${error.message}`);
      setIsProcessing(false);
    },
  });

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    setError(null);
    setResult(null);
    setIsProcessing(true);
    setProgress(0);
    setTotalCount(acceptedFiles.length);

    try {
      // Upload files
      await startUpload(acceptedFiles);
    } catch (error) {
      setError("Failed to upload photos");
      setIsProcessing(false);
    }
  }, [startUpload]);

  const processWatermarking = async () => {
    if (uploadedFiles.length === 0) return;

    try {
      setIsProcessing(true);
      setProgress(0);
      setProcessedCount(0);

      // Simulate processing
      for (let i = 0; i < uploadedFiles.length; i++) {
        setTimeout(() => {
          setProcessedCount(i + 1);
          setProgress(((i + 1) / uploadedFiles.length) * 100);
        }, (i + 1) * 300);
      }

      // Complete processing
      setTimeout(() => {
        setResult({
          watermarkedUrls: uploadedFiles, // Same URLs for demo
          watermarkedBase64: undefined,
          processingTime: uploadedFiles.length * 0.3,
          processedCount: uploadedFiles.length
        });
        setIsProcessing(false);
      }, uploadedFiles.length * 300 + 500);

    } catch (error) {
      setError(error instanceof Error ? error.message : "Watermarking failed");
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 50,
    maxSize: 8 * 1024 * 1024, // 8MB per file
    disabled: isProcessing || isUploading
  });

  const downloadAll = () => {
    if (result?.watermarkedUrls) {
      result.watermarkedUrls.forEach((url, index) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = `watermarked-${uploadedFilenames[index] || `image-${index + 1}.jpg`}`;
        setTimeout(() => link.click(), index * 100);
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
          Bulk Photo Watermarking
        </h1>
        <p className="text-xl text-gray-600">
          Add watermarks to multiple photos at once with AI-powered placement
        </p>
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
                } ${isProcessing || isUploading ? "opacity-50 cursor-not-allowed" : ""}`}
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
                      Drag & drop or click to select • Up to 50 files • Max 8MB each
                    </p>
                  </div>
                </motion.div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <p className="font-medium mb-2">{uploadedFiles.length} photos uploaded</p>
                  <div className="grid grid-cols-4 gap-2">
                    {uploadedFilenames.slice(0, 8).map((filename, index) => (
                      <div key={index} className="text-xs text-gray-600 truncate">
                        {filename}
                      </div>
                    ))}
                    {uploadedFilenames.length > 8 && (
                      <div className="text-xs text-gray-600">
                        +{uploadedFilenames.length - 8} more
                      </div>
                    )}
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
                <Label htmlFor="watermark-text">Watermark Text</Label>
                <Input
                  id="watermark-text"
                  value={watermarkConfig.text}
                  onChange={(e) => setWatermarkConfig(prev => ({ ...prev, text: e.target.value }))}
                  placeholder="© Your Name"
                />
              </div>

              <div>
                <Label htmlFor="position">Position</Label>
                <select
                  id="position"
                  value={watermarkConfig.position}
                  onChange={(e) => setWatermarkConfig(prev => ({ ...prev, position: e.target.value }))}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="bottom_right">Bottom Right</option>
                  <option value="bottom_left">Bottom Left</option>
                  <option value="top_right">Top Right</option>
                  <option value="top_left">Top Left</option>
                  <option value="center">Center</option>
                </select>
              </div>

              <div>
                <Label htmlFor="opacity">Opacity: {Math.round(watermarkConfig.opacity * 100)}%</Label>
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
      {(isProcessing || isUploading) && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-purple-600 animate-spin" />
                <span className="font-medium">
                  {isUploading ? "Uploading photos..." : `Processing watermarks... (${processedCount}/${totalCount})`}
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

            <div className="flex justify-center">
              <Button
                onClick={downloadAll}
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
              >
                <Download className="w-5 h-5 mr-2" />
                Download All Watermarked Photos
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
