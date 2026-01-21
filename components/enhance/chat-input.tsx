"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  isProcessing: boolean;
  dragActive: boolean;
  onDrag: (active: boolean) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend: () => void;
}

export function ChatInput({
  input,
  setInput,
  isProcessing,
  dragActive,
  onDrag,
  onDrop,
  onFileSelect,
  onSend,
}: ChatInputProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      onDrag(true);
    } else if (e.type === "dragleave") {
      onDrag(false);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white">
      <div className="max-w-4xl mx-auto p-4">
        {/* Drag and Drop Area */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={onDrop}
          className={cn(
            "mb-3 border-2 border-dashed rounded-xl p-4 text-center transition-all",
            dragActive
              ? "border-purple-500 bg-purple-50"
              : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
          )}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFileSelect}
            className="hidden"
          />
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Upload className="h-4 w-4" />
            <span>
              Drag and drop an image here, or{" "}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                click to upload
              </button>
            </span>
          </div>
        </div>

        {/* Text Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            placeholder="Ask PixelFly anything..."
            className="flex-1 rounded-xl border-gray-200 focus:border-purple-400 focus:ring-purple-400"
            disabled={isProcessing}
          />
          <Button
            onClick={onSend}
            disabled={!input.trim() || isProcessing}
            className="bg-purple-600 hover:bg-purple-700 rounded-xl"
            size="icon"
          >
            {isProcessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
