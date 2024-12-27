"use client";

import { useRef, useEffect, useState } from "react";
import { Template, Field } from "@/lib/local-storage";

interface CanvasProps {
  template: Template;
  fields: Field[];
  selectedField: string | null;
  onAddField: (field: Field) => void;
  onSelectField: (id: string | null) => void;
  onUpdateField: (id: string, updates: Partial<Field>) => void;
}

export function Canvas({
  template,
  fields,
  selectedField,
  onAddField,
  onSelectField,
  onUpdateField,
}: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Load and draw template image
    const image = new Image();
    image.src = template.url;
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
      
      // Draw fields
      fields.forEach(field => {
        ctx.strokeStyle = field.id === selectedField ? "#0ea5e9" : "#64748b";
        ctx.lineWidth = 2;
        ctx.strokeRect(field.x, field.y, field.width, field.height);
      });
    };
  }, [template, fields, selectedField]);

  const getMousePos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getMousePos(e);
    setIsDrawing(true);
    setStartPos(pos);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const pos = getMousePos(e);
    
    // Redraw canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const image = new Image();
    image.src = template.url;
    ctx.drawImage(image, 0, 0);

    // Draw existing fields
    fields.forEach(field => {
      ctx.strokeStyle = field.id === selectedField ? "#0ea5e9" : "#64748b";
      ctx.lineWidth = 2;
      ctx.strokeRect(field.x, field.y, field.width, field.height);
    });

    // Draw new selection
    ctx.strokeStyle = "#0ea5e9";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      startPos.x,
      startPos.y,
      pos.x - startPos.x,
      pos.y - startPos.y
    );
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDrawing) return;

    const pos = getMousePos(e);
    setIsDrawing(false);

    // Create new field
    const newField: Field = {
      id: crypto.randomUUID(),
      x: Math.min(startPos.x, pos.x),
      y: Math.min(startPos.y, pos.y),
      width: Math.abs(pos.x - startPos.x),
      height: Math.abs(pos.y - startPos.y),
      type: "text",
    };

    onAddField(newField);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="border rounded-lg cursor-crosshair"
    />
  );
}