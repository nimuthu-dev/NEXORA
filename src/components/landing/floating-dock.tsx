'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Brain, 
  Target, 
  Calculator, 
  MessageSquare,
  Sparkles
} from 'lucide-react';

const DOCK_ITEMS = [
  { label: 'Core', href: '#features', icon: Zap },
  { label: 'Neural', href: '#ai', icon: Brain },
  { label: 'Simulation', href: '#simulation', icon: Target },
  { label: 'GPA Calc', href: '#gpa', icon: Calculator },
  { label: 'Support', href: '#support', icon: MessageSquare },
];

export function FloatingDock() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-full px-4 pointer-events-none">
      <div 
        className="pointer-events-auto flex items-end gap-4 bg-background/70 dark:bg-black/40 light:bg-white/70 border border-border px-6 py-3.5 rounded-full backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        {DOCK_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          
          // Calculate scale and vertical offset based on hover state
          let scale = 1;
          let yOffset = 0;

          if (hoveredIndex !== null) {
            const distance = Math.abs(idx - hoveredIndex);
            if (distance === 0) {
              scale = 1.35;
              yOffset = -12;
            } else if (distance === 1) {
              scale = 1.15;
              yOffset = -5;
            }
          }

          return (
            <Link 
              key={item.label}
              href={item.href}
              className="relative group flex flex-col items-center cursor-pointer"
              onMouseEnter={() => setHoveredIndex(idx)}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full mb-3 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-white text-[9px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-xl">
                {item.label}
              </div>

              {/* Dock Icon Container */}
              <motion.div
                style={{ originY: 1 }}
                animate={{ 
                  scale,
                  y: yOffset
                }}
                transition={{ 
                  type: 'spring', 
                  stiffness: 300, 
                  damping: 22 
                }}
                className="w-12 h-12 rounded-full bg-muted/50 border border-border hover:border-primary/40 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors shadow-lg hover:shadow-primary/10"
              >
                <Icon className="w-5 h-5" />
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
