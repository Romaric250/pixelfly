"use client";

import { useState } from "react";
import { Field } from "@/lib/local-storage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface FieldInspectorProps {
  field: Field;
  onUpdate: (updates: Partial<Field>) => void;
}

export function FieldInspector({ field, onUpdate }: FieldInspectorProps) {
  const [localField, setLocalField] = useState<Field>(field);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalField((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdate(localField);
  };

  return (
    <div className="p-4 border rounded-lg space-y-4">
      <h3 className="text-lg font-semibold">Field Inspector</h3>
      <div className="space-y-2">
        <div>
          <label className="block text-sm font-medium">Field ID</label>
          <Input
            name="id"
            value={localField.id}
            onChange={handleChange}
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Field Type</label>
          <Input
            name="type"
            value={localField.type}
            onChange={handleChange}
            disabled
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Field Value</label>
          <Input
            name="value"
            value={localField.value}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">X Position</label>
          <Input
            name="x"
            type="number"
            value={localField.x}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Y Position</label>
          <Input
            name="y"
            type="number"
            value={localField.y}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Width</label>
          <Input
            name="width"
            type="number"
            value={localField.width}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Height</label>
          <Input
            name="height"
            type="number"
            value={localField.height}
            onChange={handleChange}
          />
        </div>
      </div>
      <Button onClick={handleSave}>Save</Button>
    </div>
  );
}