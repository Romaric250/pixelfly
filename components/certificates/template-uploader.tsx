"use client";

import { useCallback, useState } from "react";
// import { useDropzone } from "react-dropzone"; // Replaced with simple file input
import { motion } from "framer-motion";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadTemplate } from "@/lib/certificates";
import { useTemplates } from "@/hooks/use-templates";

interface TemplateUploaderProps {
  onClose: () => void;
}

export function TemplateUploader({ onClose }: TemplateUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const { addTemplate } = useTemplates();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    try {
      const template = await uploadTemplate(file);
      addTemplate(template);
      onClose();
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  }, [addTemplate, onClose]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onDrop(Array.from(files));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card p-6 rounded-lg"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Upload Template</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 border-muted">
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-medium">
          {uploading ? "Uploading..." : "Upload your template"}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Only PNG files are supported
        </p>
        <input
          type="file"
          accept=".png"
          onChange={handleFileChange}
          disabled={uploading}
          className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
        />
      </div>
    </motion.div>
  );
}