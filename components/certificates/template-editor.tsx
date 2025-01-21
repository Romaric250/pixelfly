"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTemplate } from "@/hooks/use-templates"
import type { Field } from "@/lib/local-storage"
import { Canvas } from "./editor/canvas"
import { FieldList } from "./editor/field-list"
import { FieldTypeSelector } from "./editor/field-type-selector"
import { UndoRedoProvider, useUndoRedo } from "@/hooks/use-undo-redo"
import { FieldInspector } from "./editor/field-inspector"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

interface TemplateEditorProps {
  templateId: string
  onClose: () => void
}

function TemplateEditorContent({ templateId, onClose }: TemplateEditorProps) {
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const { template, updateFields } = useTemplate(templateId)
  const { state: fields, add, update, remove, undo, redo, canUndo, canRedo } = useUndoRedo<Field[]>([])

  const handleAddField = (field: Field) => {
    add([...fields, field])
    toast.success("Field added")
  }

  const handleUpdateField = (id: string, updates: Partial<Field>) => {
    update(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)))
  }

  const handleDeleteField = (id: string) => {
    remove(fields.filter((f) => f.id !== id))
    if (selectedField === id) {
      setSelectedField(null)
    }
    toast.success("Field deleted")
  }

  const handleSave = () => {
    updateFields(fields)
    toast.success("Changes saved successfully")
    onClose()
  }

  if (!template) return null

  return (
    <div className="flex flex-col h-full bg-background">
      <motion.div
        className="flex justify-between items-center p-4 border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-lg font-semibold">Edit Template: {template.name}</h3>
        <div className="flex items-center gap-2">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 min-h-0 flex-1">
        <div className="lg:col-span-3 min-h-0">
          <Canvas
            template={template}
            fields={fields}
            selectedField={selectedField}
            onAddField={handleAddField}
            onSelectField={setSelectedField}
            onUpdateField={handleUpdateField}
            undo={undo}
            redo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
        </div>
        <div className="space-y-4">
          <ScrollArea className="h-[calc(100vh-14rem)]">
            <div className="p-4 space-y-6">
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
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}

export function TemplateEditor(props: TemplateEditorProps) {
  return (
    <UndoRedoProvider initialState={[]}>
      <TooltipProvider>
        <TemplateEditorContent {...props} />
      </TooltipProvider>
    </UndoRedoProvider>
  )
}

