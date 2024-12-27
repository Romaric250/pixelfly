"use client";

import { Field } from "@/lib/local-storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

interface FieldListProps {
  fields: Field[];
  selectedField: string | null;
  onSelect: (id: string | null) => void;
  onUpdate: (id: string, updates: Partial<Field>) => void;
  onDelete: (id: string) => void;
}

export function FieldList({
  fields,
  selectedField,
  onSelect,
  onUpdate,
  onDelete,
}: FieldListProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">Fields</h3>
      <div className="space-y-2">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
              field.id === selectedField ? "border-primary" : ""
            }`}
            onClick={() => onSelect(field.id)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium">Field {index + 1}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(field.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input
                type="number"
                value={field.x}
                onChange={(e) => onUpdate(field.id, { x: +e.target.value })}
                placeholder="X"
              />
              <Input
                type="number"
                value={field.y}
                onChange={(e) => onUpdate(field.id, { y: +e.target.value })}
                placeholder="Y"
              />
              <Input
                type="number"
                value={field.width}
                onChange={(e) => onUpdate(field.id, { width: +e.target.value })}
                placeholder="Width"
              />
              <Input
                type="number"
                value={field.height}
                onChange={(e) => onUpdate(field.id, { height: +e.target.value })}
                placeholder="Height"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}