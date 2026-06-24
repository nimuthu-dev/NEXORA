'use client';

import { motion } from 'framer-motion';

const TICKER_ITEMS = [
  'NEXORA CORE // SYSTEM',
  'NEURAL SYNC // LINK',
  'GPA COMPUTATION // ENGINE',
  'MOCK ARENA // SIMULATION',
  'IIT ACADEMIC OS // v1.0',
];

export function FramerTicker() {
  const duplicatedItems = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="w-full overflow-hidden border-y border-border bg-muted/30 py-6 backdrop-blur-md relative z-10 select-none">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-20 pointer-events-none" />
      
      <motion.div
        className="flex gap-16 whitespace-nowrap"
        animate={{ x: [0, -1200] }}
        transition={{
          ease: 'linear',
          duration: 30,
          repeat: Infinity,
        }}
        style={{ width: 'max-content' }}
      >
        {duplicatedItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-4">
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/50">{item}</span>
            <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
