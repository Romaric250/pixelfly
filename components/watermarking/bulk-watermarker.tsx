"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
// import { useDropzone } from "react-dropzone"; // Replaced with simple file input
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Upload, Shield, Download, Settings, Images, Zap } from "lucide-react";
// import { useUploadThing } from "@/lib/uploadthing";
import { backendClient } from "@/lib/backend-client";
import { useSession } from "@/lib/auth-client";

interface WatermarkConfig {
  text: string;
  position: string;
  opacity: number;
  color: string;
  fontSize: number;
}

interface WatermarkResult {
  originalUrls: string[];
  watermarkedUrls?: string[];
  watermarkedBase64?: string[];
  originalFilenames?: string[];
  processingTime: number;
  processedCount: number;
}

export function BulkWatermarker() {
  const { data: session } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [result, setResult] = useState<WatermarkResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [uploadedFilenames, setUploadedFilenames] = useState<string[]>([]);

  const [watermarkConfig, setWatermarkConfig] = useState<WatermarkConfig>({
    text: "© PixelFly",
    position: "bottom_right",
    opacity: 70,
    color: "white",
    fontSize: 24
  });

  // Temporary mock for UploadThing - replace with actual implementation
  const [isUploading, setIsUploading] = useState(false);
  const startUpload = async (files: File[]) => {
    setIsUploading(true);
    try {
      // For now, create temporary URLs for demo
      const urls = files.map(file => URL.createObjectURL(file));
      const filenames = files.map(file => file.name);
      setUploadedFiles(urls);
      setUploadedFilenames(filenames);
    } catch (error) {
      setError("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!session?.user) {
      setError("Please sign in to watermark photos");
      return;
    }

    if (acceptedFiles.length === 0) return;

    setError(null);
    setResult(null);
    setUploadedFiles([]);
    setUploadedFilenames([]);
    setTotalCount(acceptedFiles.length);

    try {
      // Upload to UploadThing
      await startUpload(acceptedFiles);
    } catch (error) {
      setError("Failed to upload photos");
    }
  }, [session, startUpload]);

  const processWatermarking = async () => {
    if (uploadedFiles.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setProcessedCount(0);

    try {
      // Call backend for bulk watermarking
      const watermarkResult = await backendClient.bulkWatermarkWithProgress(
        {
          image_urls: uploadedFiles,
          user_id: session?.user?.id || "anonymous",
          watermark_config: {
            text: watermarkConfig.text,
            position: watermarkConfig.position,
            opacity: watermarkConfig.opacity / 100,
            color: watermarkConfig.color,
            font_size: watermarkConfig.fontSize
          },
          return_format: "base64" // Request base64 for direct download
        },
        (progress, processed, total) => {
          setProgress(progress);
          setProcessedCount(processed);
          setTotalCount(total);
        }
      );

      if (watermarkResult.success) {
        setResult({
          originalUrls: uploadedFiles,
          watermarkedUrls: watermarkResult.watermarked_urls,
          watermarkedBase64: watermarkResult.watermarked_base64,
          originalFilenames: uploadedFilenames,
          processingTime: watermarkResult.processing_time,
          processedCount: watermarkResult.processed_count
        });
      } else {
        throw new Error(watermarkResult.error || "Watermarking failed");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Watermarking failed");
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

  const downloadAll = () => {
    if (result?.watermarkedBase64) {
      // Download from base64 data
      const filenames = result.originalFilenames?.map((name, index) =>
        `watermarked-${name}` || `watermarked-photo-${index + 1}.jpg`
      ) || result.watermarkedBase64.map((_, index) => `watermarked-photo-${index + 1}.jpg`);

      backendClient.downloadMultipleBase64Images(result.watermarkedBase64, filenames);
    } else if (result?.watermarkedUrls) {
      // Fallback to URL download
      result.watermarkedUrls.forEach((url, index) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = `watermarked-photo-${index + 1}.jpg`;
        link.click();
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bulk Photo Watermarking
        </h1>
        <p className="text-xl text-gray-600">
          Add watermarks to multiple photos at once with AI-powered placement
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all border-gray-300 hover:border-purple-400 hover:bg-gray-50 ${isProcessing || isUploading ? "opacity-50" : ""}`}>
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                    <Images className="w-8 h-8 text-purple-600" />
                  </div>

                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      Upload photos to watermark
                    </p>
                    <p className="text-gray-500 mt-2">
                      Select up to 50 photos • Max 8MB each
                    </p>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                    disabled={isProcessing || isUploading}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    {uploadedFiles.length} photos uploaded
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {uploadedFiles.slice(0, 8).map((url, index) => (
                      <div key={index} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={url}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {uploadedFiles.length > 8 && (
                      <div className="aspect-square rounded-lg bg-gray-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600">
                          +{uploadedFiles.length - 8}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Watermark Configuration */}
        <div className="space-y-6">
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
                <Select
                  value={watermarkConfig.position}
                  onValueChange={(value) => setWatermarkConfig(prev => ({ ...prev, position: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top_left">Top Left</SelectItem>
                    <SelectItem value="top_right">Top Right</SelectItem>
                    <SelectItem value="bottom_left">Bottom Left</SelectItem>
                    <SelectItem value="bottom_right">Bottom Right</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="opacity">Opacity: {watermarkConfig.opacity}%</Label>
                <Slider
                  id="opacity"
                  min={10}
                  max={100}
                  step={5}
                  value={[watermarkConfig.opacity]}
                  onValueChange={(value) => setWatermarkConfig(prev => ({ ...prev, opacity: value[0] }))}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="color">Color</Label>
                <Select
                  value={watermarkConfig.color}
                  onValueChange={(value) => setWatermarkConfig(prev => ({ ...prev, color: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="gray">Gray</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="font-size">Font Size: {watermarkConfig.fontSize}px</Label>
                <Slider
                  id="font-size"
                  min={12}
                  max={48}
                  step={2}
                  value={[watermarkConfig.fontSize]}
                  onValueChange={(value) => setWatermarkConfig(prev => ({ ...prev, fontSize: value[0] }))}
                  className="mt-2"
                />
              </div>

              <Button
                onClick={processWatermarking}
                disabled={uploadedFiles.length === 0 || isProcessing}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                <Shield className="w-4 h-4 mr-2" />
                Add Watermarks
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
  );
}
