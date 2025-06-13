"use client";

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ImageComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  alt: string;
  className?: string;
}

export function ImageComparisonSlider({ 
  beforeImage, 
  afterImage, 
  alt, 
  className = "" 
}: ImageComparisonSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className={`relative overflow-hidden rounded-2xl cursor-col-resize select-none ${className}`}
      style={{ aspectRatio: '4/3' }}
    >
      {/* Before Image (Background) */}
      <img
        src={beforeImage}
        alt={`${alt} - Before`}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* After Image (Clipped) */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={afterImage}
          alt={`${alt} - After`}
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>

      {/* Slider Line */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
      >
        {/* Slider Handle */}
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-purple-600 cursor-col-resize flex items-center justify-center"
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="flex gap-0.5">
            <div className="w-0.5 h-4 bg-purple-600 rounded-full"></div>
            <div className="w-0.5 h-4 bg-purple-600 rounded-full"></div>
          </div>
        </motion.div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4">
        <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold">
          Before
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
          After
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-xs font-medium">
          Drag to compare
        </div>
      </div>
    </div>
  );
}
