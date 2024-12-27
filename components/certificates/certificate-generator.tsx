"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTemplates } from "@/hooks/use-templates";
import { generateCertificates } from "@/lib/certificates";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTemplate } from "@/hooks/use-templates";

export function CertificateGenerator() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [names, setNames] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const { templates } = useTemplates();
  const { template } = useTemplate(selectedTemplateId);

  const handleGenerate = async () => {
    if (!selectedTemplateId || !template || !names.trim()) return;

    setGenerating(true);
    try {
      const nameList = names
        .split("\n")
        .filter(name => name.trim())
        .map(name => ({ name: name.trim() }));

      const blob = await generateCertificates(
        selectedTemplateId,
        template,
        nameList
      );
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'certificates.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Select Template</h2>
        <Select
          value={selectedTemplateId}
          onValueChange={setSelectedTemplateId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Choose a template" />
          </SelectTrigger>
          <SelectContent>
            {templates.map(template => (
              <SelectItem key={template.id} value={template.id}>
                {template.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">Enter Names</h2>
        <Textarea
          value={names}
          onChange={(e) => setNames(e.target.value)}
          placeholder="Enter names (one per line)"
          rows={10}
        />
      </div>

      <Button
        onClick={handleGenerate}
        disabled={!selectedTemplateId || !names.trim() || generating}
        className="w-full"
      >
        <Download className="w-4 h-4 mr-2" />
        {generating ? "Generating..." : "Generate Certificates"}
      </Button>
    </div>
  );
}