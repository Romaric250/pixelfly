"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Shield, Download, Settings } from "lucide-react";

export default function WatermarkPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [watermarkText, setWatermarkText] = useState("© PixelFly");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleWatermark = async () => {
    if (selectedFiles.length === 0) return;

    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      alert(`Watermarked ${selectedFiles.length} photos! (Demo mode - backend integration ready)`);
    }, 3000);
  };

  return (
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

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Upload Photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="files-upload"
                  />
                  <label
                    htmlFor="files-upload"
                    className="cursor-pointer text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Click to select photos
                  </label>
                  <p className="text-gray-500 mt-2">
                    Select multiple photos • Up to 50 files • Max 8MB each
                  </p>
                </div>

                {selectedFiles.length > 0 && (
                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <p className="font-medium mb-2">{selectedFiles.length} photos selected</p>
                    <div className="grid grid-cols-4 gap-2">
                      {selectedFiles.slice(0, 8).map((file, index) => (
                        <div key={index} className="text-xs text-gray-600 truncate">
                          {file.name}
                        </div>
                      ))}
                      {selectedFiles.length > 8 && (
                        <div className="text-xs text-gray-600">
                          +{selectedFiles.length - 8} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
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
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="© Your Name"
                  />
                </div>

                <Button
                  onClick={handleWatermark}
                  disabled={selectedFiles.length === 0 || isProcessing}
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

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-800 font-medium">🚀 Backend Ready!</p>
                  <p className="text-blue-700 text-sm mt-1">
                    Flask backend with AI watermark placement is running and ready.
                    This demo shows the UI - full integration coming next!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Metadata moved to layout.tsx since this is a client component
