"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ImageViewerState } from "@/app/enhance/page";
import { cn } from "@/lib/utils";

interface ImageViewerProps {
  viewer: ImageViewerState;
  onClose: () => void;
}

export function ImageViewer({ viewer, onClose }: ImageViewerProps) {
  return (
    <Dialog open={viewer.isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className={cn(
          "max-w-[95vw] max-h-[95vh] w-[95vw] h-[95vh] p-0 bg-black/95 border-none flex flex-col",
          "translate-x-[-50%] translate-y-[-50%] left-1/2 top-1/2"
        )}
      >
        <div className="relative w-full h-full flex flex-col min-h-0">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-800 shrink-0">
            <div>
              <h3 className="text-white font-semibold">{viewer.title}</h3>
              <p className="text-sm text-gray-400">
                {viewer.type === "enhanced" ? "PixelFly Enhanced" : "Original Image"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-gray-800"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          {/* Image Container - Properly centered and responsive */}
          <div className="flex-1 flex items-center justify-center p-4 overflow-auto min-h-0">
            <img
              src={viewer.imageUrl}
              alt={viewer.title}
              className="max-w-full max-h-full w-auto h-auto object-contain"
              style={{ maxHeight: 'calc(95vh - 100px)' }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
