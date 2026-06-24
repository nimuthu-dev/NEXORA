'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface NexoraSplashProps {
  onComplete: () => void;
}

const WORDMARK_LETTERS = [
  { char: 'N', path: 'M5 35 V5 L25 35 V5' },
  { char: 'E', path: 'M25 5 H5 V35 H25 M5 20 H22' },
  { char: 'X', path: 'M5 5 L25 35 M25 5 L5 35' },
  { char: 'O', path: 'M15 5 C8 5 5 12 5 20 C5 28 8 35 15 35 C22 35 25 28 25 20 C25 12 22 5 15 5 Z' },
  { char: 'R', path: 'M5 35 V5 H18 C23 5 25 12 25 19 C25 25 22 28 17 28 H5 M14 28 L25 35' },
  { char: 'A', path: 'M5 35 L15 5 L25 35 M9 23 H21' },
];

export function NexoraSplash({ onComplete }: NexoraSplashProps) {
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<'drawing' | 'bloom' | 'exit'>('drawing');
  const onCompleteRef = useRef(onComplete);

  // Sync ref with updated callback
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setMounted(true);

    const timers = [
      setTimeout(() => setStage('bloom'), 1800),
      setTimeout(() => setStage('exit'), 2800),
      setTimeout(() => {
        onCompleteRef.current();
      }, 3500)
    ];

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, []);

  if (!mounted) return null;

  const isBloom = stage === 'bloom';

  return (
    <div className="fixed inset-0 z-50 bg-[#0D0B14] flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Deep Background Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px',
        }} 
      />

      {/* Central Ambient Core Bloom */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ 
            opacity: isBloom ? 0.35 : 0.05, 
            scale: isBloom ? 1.2 : 0.9 
          }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="w-[480px] h-[480px] bg-[#298DFF]/20 blur-[130px] rounded-full" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ 
            opacity: isBloom ? 0.20 : 0, 
            scale: isBloom ? 1.1 : 0.8 
          }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className="w-[380px] h-[380px] bg-[#00C2FF]/15 blur-[110px] rounded-full" 
        />
      </div>

      <AnimatePresence mode="wait">
        {stage !== 'exit' && (
          <motion.div
            key="nexora-sequence"
            className="relative flex flex-col items-center justify-center z-10"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 8, 
              filter: "blur(20px)",
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* SVG Nexus Geometry Container */}
            <div className="relative w-56 h-56 flex items-center justify-center">
              <svg 
                className="w-40 h-40 md:w-48 md:h-48 overflow-visible" 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Red-to-Purple Gradient Fill */}
                  <linearGradient id="emblem-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#298DFF" />
                    <stop offset="100%" stopColor="#00C2FF" />
                  </linearGradient>

                  {/* Faint radar lines gradient */}
                  <linearGradient id="radar-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(41, 141, 255, 0.15)" />
                    <stop offset="100%" stopColor="rgba(0, 194, 255, 0.03)" />
                  </linearGradient>

                  {/* Glow filter for fine strokes */}
                  <filter id="emblem-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* --- Fine Orbital Radar Grid (Nexus Geometry Guides) --- */}
                {/* Diagonal Crossing Guides */}
                <motion.line
                  x1="15" y1="15" x2="85" y2="85"
                  stroke="rgba(41, 141, 255, 0.08)"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                />
                <motion.line
                  x1="15" y1="85" x2="85" y2="15"
                  stroke="rgba(0, 194, 255, 0.08)"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.4, ease: "easeOut" }}
                />

                {/* Concentric Compass Rings */}
                <motion.circle
                  cx="50" cy="50" r="42"
                  stroke="url(#radar-grad)"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.8, ease: "linear" }}
                />
                <motion.circle
                  cx="50" cy="50" r="32"
                  stroke="url(#radar-grad)"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.6, ease: "linear" }}
                />

                {/* --- Central "N" Outline Path --- */}
                <motion.path
                  d="M30 75 V25 H40 L60 65 V25 H70 V75 H60 L40 35 V75 H30 Z"
                  stroke="url(#emblem-grad)"
                  strokeWidth="1"
                  strokeLinejoin="miter"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                />
                
                {/* Glowing stroke outline overlay */}
                <motion.path
                  d="M30 75 V25 H40 L60 65 V25 H70 V75 H60 L40 35 V75 H30 Z"
                  stroke="url(#emblem-grad)"
                  strokeWidth="3.5"
                  strokeLinejoin="miter"
                  filter="url(#emblem-glow)"
                  className="opacity-40"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                />

                {/* --- Solid Gradient Fill Bloom --- */}
                <motion.path
                  d="M30 75 V25 H40 L60 65 V25 H70 V75 H60 L40 35 V75 H30 Z"
                  fill="url(#emblem-grad)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isBloom ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </svg>
            </div>

            {/* Custom SVG Sequential Stroke Writing Wordmark */}
            <div className="mt-8 flex justify-center items-center">
              <svg 
                className="w-[280px] sm:w-[380px] md:w-[480px] h-auto overflow-visible" 
                viewBox="0 0 210 40" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="word-grad-red" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#298DFF" />
                    <stop offset="100%" stopColor="#00C2FF" />
                  </linearGradient>
                  <filter id="word-glow-red" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {WORDMARK_LETTERS.map((letter, idx) => {
                  const delay = 0.4 + idx * 0.2; // Staggered start times
                  return (
                    <g key={idx} transform={`translate(${idx * 35}, 0)`}>
                      {/* Glow stroke */}
                      <motion.path
                        d={letter.path}
                        stroke="url(#word-grad-red)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#word-glow-red)"
                        className="opacity-45"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          pathLength: { delay, duration: 1.1, ease: [0.16, 1, 0.3, 1] }
                        }}
                      />
                      {/* Base sharp stroke */}
                      <motion.path
                        d={letter.path}
                        stroke="url(#word-grad-red)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          pathLength: { delay, duration: 1.1, ease: [0.16, 1, 0.3, 1] }
                        }}
                      />
                      {/* Fill color transition once stage changes to bloom */}
                      <motion.path
                        d={letter.path}
                        fill="url(#word-grad-red)"
                        initial={{ fillOpacity: 0 }}
                        animate={isBloom ? { fillOpacity: 0.15 } : { fillOpacity: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                      />
                      {/* White Solid overlay on bloom stage */}
                      <motion.path
                        d={letter.path}
                        stroke="#ffffff"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ opacity: 0 }}
                        animate={isBloom ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Sub-label */}
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.3em" }}
              animate={isBloom ? { opacity: 0.6, letterSpacing: "0.55em" } : {}}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-[#00C2FF] font-black uppercase text-xs md:text-sm mt-6 tracking-[0.55em] text-center"
            >
              Academic OS v1.0
            </motion.p>
            
            {/* System Info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isBloom ? { opacity: 0.35, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="mt-16 flex flex-col items-center gap-1.5"
            >
              <p className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-white/40 font-black">System Architecture</p>
              <p className="text-white font-black text-[9px] md:text-[10px] tracking-widest uppercase">Nimuthu Pathirathne</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
