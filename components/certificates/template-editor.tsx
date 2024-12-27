"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTemplate } from "@/hooks/use-templates";
import { Field } from "@/lib/local-storage";
import { Canvas } from "./editor/canvas";
import { FieldList } from "./editor/field-list";
import { FieldTypeSelector } from "./editor/flield-type-selector";

interface TemplateEditorProps {
  templateId: string;
  onClose: () => void;
}

export function TemplateEditor({ templateId, onClose }: TemplateEditorProps) {
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const { template, updateFields } = useTemplate(templateId);

  const handleAddField = (field: Field) => {
    setFields(prev => [...prev, field]);
  };

  const handleUpdateField = (id: string, updates: Partial<Field>) => {
    setFields(prev => prev.map(f => 
      f.id === id ? { ...f, ...updates } : f
    ));
  };

  const handleDeleteField = (id: string) => {
    setFields(prev => prev.filter(f => f.id !== id));
    if (selectedField === id) {
      setSelectedField(null);
    }
  };

  const handleSave = () => {
    updateFields(fields);
    onClose();
  };

  if (!template) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg overflow-hidden"
    >
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-semibold">Edit Template: {template.name}</h3>
        <div className="flex gap-2">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="col-span-2">
          <Canvas
            template={template}
            fields={fields}
            selectedField={selectedField}
            onAddField={handleAddField}
            onSelectField={setSelectedField}
            onUpdateField={handleUpdateField}
          />
        </div>
        <div className="space-y-4">
          <FieldTypeSelector onSelect={handleAddField} />
          <FieldList
            fields={fields}
            selectedField={selectedField}
            onSelect={setSelectedField}
            onUpdate={handleUpdateField}
            onDelete={handleDeleteField}
          />
        </div>
      </div>
    </motion.div>
  );
}