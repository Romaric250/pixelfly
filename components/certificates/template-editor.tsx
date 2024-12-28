"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Redo, Save, Undo, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTemplate } from "@/hooks/use-templates";
import { Field } from "@/lib/local-storage";
import { Canvas } from "./editor/canvas";
import { FieldList } from "./editor/field-list";
import { FieldTypeSelector } from "./editor/flield-type-selector";
import { UndoRedoProvider, useUndoRedo } from "@/hooks/use-undo-redo";
import { FieldInspector } from "./editor/field-inspector";

interface TemplateEditorProps {
  templateId: string;
  onClose: () => void;
}

export function TemplateEditor({ templateId, onClose }: TemplateEditorProps) {
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const { template, updateFields } = useTemplate(templateId);
  const { state: fields, add, update, remove, undo, redo, canUndo, canRedo } = useUndoRedo<Field[]>([]);

  const handleAddField = (field: Field) => {
    add([...fields, field]);
  };

  const handleUpdateField = (id: string, updates: Partial<Field>) => {
    update(
      fields.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const handleDeleteField = (id: string) => {
    remove(fields.filter((f) => f.id !== id));
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
    <UndoRedoProvider initialState={[]}> {/* Ensure undo/redo works */}
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
            {selectedField && (
              <FieldInspector
                field={fields.find((f) => f.id === selectedField)!}
                onUpdate={(updates) => handleUpdateField(selectedField, updates)}
              />
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 border-t">
          <Button disabled={!canUndo} onClick={undo}>
            <Undo className="w-4 h-4 mr-2" />
          </Button>
          <Button disabled={!canRedo} onClick={redo}>
            <Redo className="w-4 h-4 mr-2" />
          </Button>
        </div>
      </motion.div>
    </UndoRedoProvider>
  );
}
