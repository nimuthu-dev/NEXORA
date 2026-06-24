'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface SplashScreenProps {
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

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState<'drawing' | 'logo' | 'exit'>('drawing');
  const onCompleteRef = useRef(onComplete);

  // Keep ref updated with latest parent callback
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    setMounted(true);

    const timers = [
      setTimeout(() => setStage('logo'), 2100),
      setTimeout(() => setStage('exit'), 3800),
      setTimeout(() => {
        onCompleteRef.current();
      }, 4500)
    ];

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, []); // Run strictly once on mount to prevent restarts

  if (!mounted) return null;

  const isLogoStage = stage === 'logo';

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden select-none"
      style={{ background: '#000508' }}
    >
      {/* Liquid Aurora Background Layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary aurora blob */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.18, scale: 1, x: [0, 30, -20, 0], y: [0, -20, 15, 0] }}
          transition={{ opacity: { duration: 2 }, scale: { duration: 2 }, x: { duration: 12, repeat: Infinity, ease: 'easeInOut' as const }, y: { duration: 10, repeat: Infinity, ease: 'easeInOut' as const } }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(41,141,255,0.5) 0%, rgba(0,194,255,0.15) 50%, transparent 75%)', filter: 'blur(60px)' }}
        />
        {/* Secondary blob top-left */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.12, x: [-20, 10, -20], y: [0, 30, 0] }}
          transition={{ opacity: { duration: 2, delay: 0.5 }, x: { duration: 14, repeat: Infinity, ease: 'easeInOut' as const }, y: { duration: 11, repeat: Infinity, ease: 'easeInOut' as const } }}
          className="absolute -top-[10%] -left-[10%] w-[500px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(0,194,255,0.3) 0%, transparent 70%)', filter: 'blur(80px)' }}
        />
        {/* Third blob bottom-right */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1, x: [0, -25, 0], y: [0, -15, 0] }}
          transition={{ opacity: { duration: 2, delay: 1 }, x: { duration: 16, repeat: Infinity, ease: 'easeInOut' as const }, y: { duration: 13, repeat: Infinity, ease: 'easeInOut' as const } }}
          className="absolute -bottom-[10%] -right-[10%] w-[500px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(41,141,255,0.2) 0%, transparent 70%)', filter: 'blur(100px)' }}
        />
        {/* Fine grid overlay for texture */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.15) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        {stage !== 'exit' && (
          <motion.div
            key="logo-sequence"
            className="relative flex flex-col items-center justify-center z-10"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 2.3, 
              filter: "blur(16px)"
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* SVG Emblem Container */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg 
                className="w-36 h-36 md:w-40 md:h-40 overflow-visible" 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  {/* Sui Electric Blue Gradient */}
                  <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#298DFF" />
                    <stop offset="100%" stopColor="#00C2FF" />
                  </linearGradient>
                  
                  {/* Faint blueprint lines gradient */}
                  <linearGradient id="blueprint-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(41, 141, 255, 0.1)" />
                    <stop offset="100%" stopColor="rgba(0, 194, 255, 0.02)" />
                  </linearGradient>
                  
                  {/* High fidelity glow filter */}
                  <filter id="glow-blur" x="-40%" y="-40%" width="180%" height="180%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* --- Blueprint Construction Lines --- */}
                {/* Center Axis (Vertical) */}
                <motion.line
                  x1="50" y1="10" x2="50" y2="90"
                  stroke="rgba(41, 141, 255, 0.08)"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                {/* Center Axis (Horizontal) */}
                <motion.line
                  x1="10" y1="50" x2="90" y2="50"
                  stroke="rgba(41, 141, 255, 0.08)"
                  strokeWidth="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, ease: "easeOut" }}
                />
                {/* Circular Helper Compass Ring */}
                <motion.circle
                  cx="50" cy="50" r="35"
                  stroke="url(#blueprint-grad)"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.6, ease: "linear" }}
                />

                {/* --- Main Emblem Line Drawing & Expansion --- */}
                {/* Path 1: Left Vertical Pillar */}
                <motion.path
                  d="M28 75 V25"
                  stroke="url(#logo-grad)"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, strokeWidth: 2.5 }}
                  animate={{ 
                    pathLength: 1, 
                    strokeWidth: isLogoStage ? 10.5 : 2.5 
                  }}
                  transition={{
                    pathLength: { delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                    strokeWidth: { duration: 0.5, ease: "easeOut" }
                  }}
                />
                <motion.path
                  d="M28 75 V25"
                  stroke="url(#logo-grad)"
                  strokeLinecap="round"
                  filter="url(#glow-blur)"
                  className="opacity-45"
                  initial={{ pathLength: 0, strokeWidth: 4 }}
                  animate={{ 
                    pathLength: 1, 
                    strokeWidth: isLogoStage ? 22 : 4 
                  }}
                  transition={{
                    pathLength: { delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                    strokeWidth: { duration: 0.5, ease: "easeOut" }
                  }}
                />

                {/* Path 2: Diagonal Pillar */}
                <motion.path
                  d="M38 27 L62 73"
                  stroke="url(#logo-grad)"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, strokeWidth: 2.5 }}
                  animate={{ 
                    pathLength: 1, 
                    strokeWidth: isLogoStage ? 10.5 : 2.5 
                  }}
                  transition={{
                    pathLength: { delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                    strokeWidth: { duration: 0.5, ease: "easeOut" }
                  }}
                />
                <motion.path
                  d="M38 27 L62 73"
                  stroke="url(#logo-grad)"
                  strokeLinecap="round"
                  filter="url(#glow-blur)"
                  className="opacity-45"
                  initial={{ pathLength: 0, strokeWidth: 4 }}
                  animate={{ 
                    pathLength: 1, 
                    strokeWidth: isLogoStage ? 22 : 4 
                  }}
                  transition={{
                    pathLength: { delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                    strokeWidth: { duration: 0.5, ease: "easeOut" }
                  }}
                />

                {/* Path 3: Right Vertical Pillar */}
                <motion.path
                  d="M72 75 V25"
                  stroke="url(#logo-grad)"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, strokeWidth: 2.5 }}
                  animate={{ 
                    pathLength: 1, 
                    strokeWidth: isLogoStage ? 10.5 : 2.5 
                  }}
                  transition={{
                    pathLength: { delay: 1.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                    strokeWidth: { duration: 0.5, ease: "easeOut" }
                  }}
                />
                <motion.path
                  d="M72 75 V25"
                  stroke="url(#logo-grad)"
                  strokeLinecap="round"
                  filter="url(#glow-blur)"
                  className="opacity-45"
                  initial={{ pathLength: 0, strokeWidth: 4 }}
                  animate={{ 
                    pathLength: 1, 
                    strokeWidth: isLogoStage ? 22 : 4 
                  }}
                  transition={{
                    pathLength: { delay: 1.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
                    strokeWidth: { duration: 0.5, ease: "easeOut" }
                  }}
                />

                {/* --- Vector Joint Ripple Flares --- */}
                {/* Joint 1 (top left ripple at t = 0.8s) */}
                <motion.circle
                  cx="28" cy="25" r="3.5"
                  fill="#00C2FF"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 2.5, 0], opacity: [0, 0.9, 0] }}
                  transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
                />
                {/* Joint 2 (bottom right ripple at t = 1.3s) */}
                <motion.circle
                  cx="62" cy="73" r="3.5"
                  fill="#00C2FF"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 2.5, 0], opacity: [0, 0.9, 0] }}
                  transition={{ delay: 1.3, duration: 0.5, ease: "easeOut" }}
                />
                {/* Joint 3 (top right ripple at t = 1.8s) */}
                <motion.circle
                  cx="72" cy="25" r="3.5"
                  fill="#00C2FF"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 2.5, 0], opacity: [0, 0.9, 0] }}
                  transition={{ delay: 1.8, duration: 0.5, ease: "easeOut" }}
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
                  <linearGradient id="word-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#298DFF" />
                    <stop offset="100%" stopColor="#00C2FF" />
                  </linearGradient>
                  <filter id="word-glow" x="-30%" y="-30%" width="160%" height="160%">
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
                        stroke="url(#word-grad)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        filter="url(#word-glow)"
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
                        stroke="url(#word-grad)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          pathLength: { delay, duration: 1.1, ease: [0.16, 1, 0.3, 1] }
                        }}
                      />
                      {/* Fill color transition once stage changes to logo */}
                      <motion.path
                        d={letter.path}
                        fill="url(#word-grad)"
                        initial={{ fillOpacity: 0 }}
                        animate={isLogoStage ? { fillOpacity: 0.15 } : { fillOpacity: 0 }}
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
                        animate={isLogoStage ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Sub-label Fade-in */}
            <motion.p
              initial={{ opacity: 0, letterSpacing: "0.3em" }}
              animate={isLogoStage ? { opacity: 0.6, letterSpacing: "0.55em" } : {}}
              transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-primary font-black uppercase text-xs md:text-sm mt-6 tracking-[0.55em] text-center"
            >
              Academic OS v1.0
            </motion.p>
            
            {/* System Info Fade-in */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isLogoStage ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="mt-14 flex flex-col items-center gap-3"
            >
              <p className="text-[9px] md:text-[10px] uppercase tracking-[0.5em] text-white/30 font-bold">System Architecture</p>
              <motion.p
                initial={{ opacity: 0, letterSpacing: '0.1em' }}
                animate={isLogoStage ? { opacity: 1, letterSpacing: '0.15em' } : {}}
                transition={{ duration: 1, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-black text-sm md:text-lg tracking-[0.15em] uppercase"
                style={{
                  background: 'linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.8) 60%, rgba(41,141,255,0.7) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Nimuthu Pathirathne
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
