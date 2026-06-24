'use client';

import React, { useRef, useState } from 'react';

interface ThreeDCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string; // e.g. "rgba(41, 141, 255, 0.15)"
}

export function ThreeDCard({ children, className = '', glowColor = 'rgba(41, 141, 255, 0.15)' }: ThreeDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [glowPos, setGlowPos] = useState({ px: 0, py: 0 });
  const [mouseActive, setMouseActive] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setGlowPos({
      px: e.clientX - rect.left,
      py: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setMouseActive(true);
  const handleMouseLeave = () => setMouseActive(false);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-full rounded-[2.5rem] transition-all duration-500 ease-out group ${className}`}
    >
      {/* Glow Spotlight Effect */}
      <div
        className="absolute -inset-px rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10"
        style={{
          background: mouseActive
            ? `radial-gradient(350px circle at ${glowPos.px}px ${glowPos.py}px, ${glowColor}, transparent 80%)`
            : 'none',
        }}
      />
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  );
}
