"use client";

interface DottedBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function DottedBackground({ children, className = "" }: DottedBackgroundProps) {
  return (
    <div className={`relative bg-white ${className}`}>
      {/* Primary dotted pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.9) 1.5px, transparent 1.5px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Secondary smaller dots for texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255, 255, 255, 0.6) 0.5px, transparent 0.5px)`,
          backgroundSize: '16px 16px',
          backgroundPosition: '8px 8px'
        }}
      />

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-purple-50/20 to-transparent" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
