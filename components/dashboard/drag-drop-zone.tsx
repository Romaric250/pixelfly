"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { Upload, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function DragDropZone() {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setUploading(true);
    // Simulate upload
    setTimeout(() => {
      setUploading(false);
      setUploaded(true);
      setTimeout(() => setUploaded(false), 2000);
    }, 1500);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    }
  });

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-lg border-2 border-dashed p-8"
    >
      <div
        {...getRootProps()}
        className={cn(
          "h-64 rounded-lg flex items-center justify-center",
          isDragActive && "bg-primary/5"
        )}
      >
        <input {...getInputProps()} />
        <div className="text-center space-y-4">
          {uploading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Upload className="h-12 w-12 mx-auto text-primary" />
            </motion.div>
          ) : uploaded ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              <Check className="h-12 w-12 mx-auto text-green-500" />
            </motion.div>
          ) : (
            <Upload className="h-12 w-12 mx-auto text-primary" />
          )}
          <div>
            <p className="text-lg font-medium">
              {uploading
                ? "Uploading..."
                : uploaded
                ? "Upload Complete!"
                : "Drop your images here"}
            </p>
            <p className="text-sm text-muted-foreground">
              or click to select files
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}