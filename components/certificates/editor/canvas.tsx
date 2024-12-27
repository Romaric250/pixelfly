"use client";

import { useRef, useEffect, useState } from "react";
import { Template, Field } from "@/lib/local-storage";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Minus, RotateCcw } from "lucide-react";

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
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(1);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateCanvasSize = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas) return;

      const image = new Image();
      image.src = template.url;
      image.onload = () => {
        // Calculate scale to fit container while maintaining aspect ratio
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        const imageAspect = image.width / image.height;
        const containerAspect = containerWidth / containerHeight;

        let newScale;
        if (imageAspect > containerAspect) {
          newScale = containerWidth / image.width;
        } else {
          newScale = containerHeight / image.height;
        }

        // Apply scale with some padding
        newScale *= 0.9;
        setScale(newScale);

        // Set canvas size
        canvas.width = image.width;
        canvas.height = image.height;
        
        renderCanvas();
      };
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [template.url]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw template image
    const image = new Image();
    image.src = template.url;
    ctx.drawImage(image, 0, 0);

    // Draw fields
    fields.forEach(field => {
      ctx.strokeStyle = field.id === selectedField ? "#0ea5e9" : "#64748b";
      ctx.lineWidth = 2;
      ctx.strokeRect(field.x, field.y, field.width, field.height);

      // Draw field type indicator
      ctx.fillStyle = field.id === selectedField ? "#0ea5e9" : "#64748b";
      ctx.font = "12px sans-serif";
      ctx.fillText(field.type, field.x + 4, field.y + 16);
    });
  };

  useEffect(() => {
    renderCanvas();
  }, [fields, selectedField, scale, pan]);

  const getMousePos = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left - pan.x) / scale,
      y: (e.clientY - rect.top - pan.y) / scale,
    };
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(s => Math.min(Math.max(s * delta, 0.1), 5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || e.button === 2) { // Middle or right click for panning
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    } else {
      const pos = getMousePos(e);
      setIsDrawing(true);
      setStartPos(pos);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
      return;
    }

    if (!isDrawing) return;

    const pos = getMousePos(e);
    renderCanvas();

    // Draw selection rectangle
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = "#0ea5e9";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        startPos.x,
        startPos.y,
        pos.x - startPos.x,
        pos.y - startPos.y
      );
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isDragging) {
      setIsDragging(false);
      return;
    }

    if (!isDrawing) return;

    const pos = getMousePos(e);
    setIsDrawing(false);

    // Create new field if selection is large enough
    const width = Math.abs(pos.x - startPos.x);
    const height = Math.abs(pos.y - startPos.y);
    if (width > 10 && height > 10) {
      const newField: Field = {
        id: crypto.randomUUID(),
        x: Math.min(startPos.x, pos.x),
        y: Math.min(startPos.y, pos.y),
        width,
        height,
        type: "text",
      };
      onAddField(newField);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[600px] bg-muted/30 rounded-lg overflow-hidden"
      onWheel={handleWheel}
      onContextMenu={e => e.preventDefault()}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => {
          setIsDrawing(false);
          setIsDragging(false);
        }}
        style={{
          cursor: isDrawing ? 'crosshair' : isDragging ? 'grab' : 'default',
          transform: `scale(${scale}) translate(${pan.x/scale}px, ${pan.y/scale}px)`,
          transformOrigin: '0 0',
        }}
        className="absolute"
      />
      
      <div className="absolute bottom-4 right-4 space-x-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setScale(s => s * 1.1)}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setScale(s => s * 0.9)}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => {
            setScale(1);
            setPan({ x: 0, y: 0 });
          }}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}