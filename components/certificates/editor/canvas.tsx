"use client";

import { useState, useEffect, useRef } from "react";
import { useUndoRedo } from "@/hooks/use-undo-redo";
import { Field } from "@/lib/local-storage";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Minus, RotateCcw } from "lucide-react";

interface CanvasProps {
  template: { url: string };
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const { state: field, add, update, remove, undo, redo, canUndo, canRedo } = useUndoRedo<Field[]>([]);


  useEffect(() => {
    const img = new Image();
    img.src = template.url;
    img.onload = () => setImage(img);
  }, [template.url]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !image) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw template image
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Draw fields
    fields.forEach((field) => {
      ctx.save();
      ctx.translate(field.x, field.y);
      ctx.rotate((field.rotation || 0) * (Math.PI / 180));

      ctx.strokeStyle = field.id === selectedField ? "#0ea5e9" : "#64748b";
      ctx.lineWidth = 2;
      ctx.strokeRect(0, 0, field.width, field.height);

      ctx.fillStyle = "#000";
      ctx.font = "16px sans-serif";
      ctx.fillText(field.type || "Text", 5, 15);

      ctx.restore();
    });
  };

  useEffect(() => {
    renderCanvas();
  }, [fields, selectedField, image, scale, pan]);

  const getMousePos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - pan.x) / scale,
      y: (e.clientY - rect.top - pan.y) / scale,
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getMousePos(e);
    const field = fields.find(
      (f) =>
        pos.x >= f.x &&
        pos.x <= f.x + f.width &&
        pos.y >= f.y &&
        pos.y <= f.y + f.height
    );
    if (field) {
      onSelectField(field.id);
      setIsDragging(true);
      setDragStart(pos);
    } else {
      onSelectField(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedField) return;

    const pos = getMousePos(e);
    const dx = pos.x - dragStart.x;
    const dy = pos.y - dragStart.y;
    setDragStart(pos);

    onUpdateField(selectedField, {
      x: (fields.find((f) => f.id === selectedField)?.x || 0) + dx,
      y: (fields.find((f) => f.id === selectedField)?.y || 0) + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[600px] bg-muted/30 rounded-lg overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="absolute"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          cursor: isDragging ? "grabbing" : "default",
          transform: `scale(${scale}) translate(${pan.x}px, ${pan.y}px)`,
          transformOrigin: "0 0",
        }}
      />

      <div className="absolute bottom-4 right-4 space-x-2">
        <Button disabled={!canUndo} onClick={undo}>
          Undo
        </Button>
        <Button disabled={!canRedo} onClick={redo}>
          Redo
        </Button>
      </div>
    </div>
  );
}
