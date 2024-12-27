"use client";

import { Field } from "@/lib/local-storage";
import { Button } from "@/components/ui/button";
import { Type, Calendar, Image } from "lucide-react";

interface FieldTypeSelectorProps {
  onSelect: (field: Field) => void;
}

const FIELD_TYPES = [
  { type: "text", icon: Type, label: "Text" },
  { type: "date", icon: Calendar, label: "Date" },
  { type: "image", icon: Image, label: "Image" },
] as const;

export function FieldTypeSelector({ onSelect }: FieldTypeSelectorProps) {
  const createField = (type: Field["type"]) => {
    const field: Field = {
      id: crypto.randomUUID(),
      type,
      x: 0,
      y: 0,
      width: 100,
      height: 30,
    };
    onSelect(field);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Add Field</h3>
      <div className="grid grid-cols-3 gap-2">
        {FIELD_TYPES.map(({ type, icon: Icon, label }) => (
          <Button
            key={type}
            variant="outline"
            className="flex flex-col gap-2 h-auto py-4"
            onClick={() => createField(type)}
          >
            <Icon className="w-5 h-5" />
            <span className="text-sm">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}