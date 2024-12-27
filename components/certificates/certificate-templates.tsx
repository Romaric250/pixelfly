"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateUploader } from "./template-uploader";
import { TemplateEditor } from "./template-editor";
import { TemplateList } from "./template-list";
import { useTemplates } from "@/hooks/use-templates";

export function CertificateTemplates() {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { templates } = useTemplates();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Certificate Templates</h2>
        <Button onClick={() => setIsUploading(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Template
        </Button>
      </div>

      {isUploading ? (
        <TemplateUploader onClose={() => setIsUploading(false)} />
      ) : selectedTemplate ? (
        <TemplateEditor 
          templateId={selectedTemplate} 
          onClose={() => setSelectedTemplate(null)} 
        />
      ) : (
        <TemplateList 
          templates={templates} 
          onSelect={setSelectedTemplate} 
        />
      )}
    </div>
  );
}