'use client';

import React from 'react';

interface GlowingBorderProps {
  children: React.ReactNode;
  className?: string;
  borderRadius?: string; // e.g. "rounded-[2.5rem]"
}

export function GlowingBorder({ children, className = '', borderRadius = 'rounded-[2.5rem]' }: GlowingBorderProps) {
  return (
    <div className={`relative p-[1.5px] overflow-hidden ${borderRadius} group/border card-shimmer ${className}`}>
      {/* Subtle static border gradient */}
      <div 
        className="absolute inset-0 rounded-[inherit] pointer-events-none z-0"
        style={{
          background: 'linear-gradient(135deg, rgba(41,141,255,0.25) 0%, rgba(0,194,255,0.08) 50%, rgba(220,38,38,0.15) 100%)',
          opacity: 0,
          transition: 'opacity 0.4s ease',
        }}
      />
      
      {/* Hover border highlight ring */}
      <div 
        className="absolute inset-0 rounded-[inherit] opacity-0 group-hover/border:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{
          background: 'linear-gradient(135deg, rgba(41,141,255,0.4) 0%, rgba(0,194,255,0.15) 50%, rgba(220,38,38,0.2) 100%)',
        }}
      />
      
      {/* Inner Content (Masks the center) */}
      <div className={`relative z-10 w-full h-full ${borderRadius} overflow-hidden`}>
        {children}
      </div>
    </div>
  );
}
