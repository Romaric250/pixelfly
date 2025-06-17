"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Sparkles, Download } from "lucide-react";

export default function EnhancePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleEnhance = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      alert("Enhancement complete! (Demo mode - backend integration ready)");
    }, 2000);
  };

  return (
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Upload Photo for Enhancement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer text-purple-600 hover:text-purple-700 font-medium"
              >
                Click to select a photo
              </label>
              <p className="text-gray-500 mt-2">JPG, PNG, WebP up to 8MB</p>
            </div>

            {selectedFile && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium">Selected: {selectedFile.name}</p>
                <p className="text-sm text-gray-600">
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            <div className="flex justify-center">
              <Button
                onClick={handleEnhance}
                disabled={!selectedFile || isProcessing}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
              >
                {isProcessing ? (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                    Enhancing...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Enhance Photo
                  </>
                )}
              </Button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 font-medium">🚀 Backend Ready!</p>
              <p className="text-blue-700 text-sm mt-1">
                Flask backend is running on port 5000 with full AI processing capabilities.
                This demo shows the UI - full integration coming next!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Metadata moved to layout.tsx since this is a client component
