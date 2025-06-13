"use client";

interface DottedBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function DottedBackground({ children, className = "" }: DottedBackgroundProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Base background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50" />

      {/* Primary dotted pattern - very visible */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(100, 100, 100, 0.8) 2px, transparent 2px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Secondary smaller dots */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(140, 140, 140, 0.5) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          backgroundPosition: '15px 15px'
        }}
      />

      {/* Purple tint overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50/20 via-transparent to-purple-50/10" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
