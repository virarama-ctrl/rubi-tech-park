import React from 'react';

interface FuturisticBackgroundProps {
  className?: string;
  variant?: 'hero' | 'section' | 'subtle';
  children?: React.ReactNode;
}

export const FuturisticBackground: React.FC<FuturisticBackgroundProps> = ({
  className = '',
  variant = 'section',
  children
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* 1. Fine Technical Grid Pattern */}
      <div 
        className="absolute inset-0 cyber-grid pointer-events-none opacity-45 -z-20" 
        aria-hidden="true" 
      />

      {/* 2. Soft Ambient Lighting Orbs */}
      <div 
        className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-[#00D4FF]/10 blur-[120px] pointer-events-none -z-10" 
        aria-hidden="true" 
      />
      <div 
        className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-[#8057FF]/10 blur-[130px] pointer-events-none -z-10" 
        aria-hidden="true" 
      />
      <div 
        className="absolute -bottom-24 left-10 w-96 h-96 rounded-full bg-[#356BFF]/10 blur-[140px] pointer-events-none -z-10" 
        aria-hidden="true" 
      />

      {/* 3. Subtle Vector Network Nodes & Circuit Conduits for Hero / Major Sections */}
      {variant === 'hero' && (
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none opacity-20 -z-10" 
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="cyber-line-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#356BFF" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8057FF" stopOpacity="0.1" />
            </linearGradient>
            <pattern id="tech-dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="#00D4FF" fillOpacity="0.2" />
            </pattern>
          </defs>

          {/* Dot field */}
          <rect width="100%" height="100%" fill="url(#tech-dots)" />

          {/* Network Bus Traces */}
          <path 
            d="M 50 120 L 300 120 L 450 240 L 700 240 L 850 160 L 1200 160" 
            fill="none" 
            stroke="url(#cyber-line-grad)" 
            strokeWidth="1.2" 
            strokeDasharray="6 8"
          />
          <path 
            d="M 150 400 L 400 400 L 550 520 L 900 520 L 1050 420 L 1400 420" 
            fill="none" 
            stroke="#00D4FF" 
            strokeOpacity="0.25" 
            strokeWidth="1" 
          />
          
          {/* Glowing Network Nodes */}
          <circle cx="300" cy="120" r="3" fill="#00D4FF" />
          <circle cx="450" cy="240" r="4" fill="#356BFF" />
          <circle cx="700" cy="240" r="3" fill="#8057FF" />
          <circle cx="400" cy="400" r="3.5" fill="#00D4FF" />
          <circle cx="550" cy="520" r="3" fill="#00E5A3" />
        </svg>
      )}

      {children}
    </div>
  );
};
