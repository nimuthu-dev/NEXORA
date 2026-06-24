'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useScroll } from 'framer-motion';
import { 
  Calculator, 
  Brain, 
  Target, 
  Cpu, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export function ThreeDHeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 1. Scroll-driven animation values
  const { scrollY } = useScroll();
  
  // Transition scroll pixels (0px to 600px scroll)
  // Starts in isometric perspective, rotates flat as user scrolls down
  const scrollRotateX = useSpring(useTransform(scrollY, [0, 500], [55, 0]), { stiffness: 90, damping: 20 });
  const scrollRotateY = useSpring(useTransform(scrollY, [0, 500], [-15, 0]), { stiffness: 90, damping: 20 });
  const scrollRotateZ = useSpring(useTransform(scrollY, [0, 500], [10, 0]), { stiffness: 90, damping: 20 });
  const scrollScale = useSpring(useTransform(scrollY, [0, 500], [0.85, 1.15]), { stiffness: 90, damping: 20 });
  const scrollYOffset = useSpring(useTransform(scrollY, [0, 500], [0, 80]), { stiffness: 90, damping: 20 });

  // Floating layer scroll parallax: widgets drift apart at different rates along Y axis
  const widgetGpaY = useSpring(useTransform(scrollY, [0, 500], [0, -100]), { stiffness: 80, damping: 22 });
  const widgetNeuralY = useSpring(useTransform(scrollY, [0, 500], [0, 110]), { stiffness: 80, damping: 22 });
  const widgetArenaY = useSpring(useTransform(scrollY, [0, 500], [0, -40]), { stiffness: 80, damping: 22 });

  // 2. Mouse interactive tilt values (adds relative tilt on top of scroll)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const mouseRotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), { stiffness: 120, damping: 25 });
  const mouseRotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 25 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseX, mouseY]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[550px] lg:h-[700px] flex items-center justify-center select-none"
      style={{ perspective: 1800 }}
    >
      {/* Scroll-Driven Outer Wrapper */}
      <motion.div
        style={{
          rotateX: scrollRotateX,
          rotateY: scrollRotateY,
          rotateZ: scrollRotateZ,
          scale: scrollScale,
          y: scrollYOffset,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-[340px] h-[340px] md:w-[450px] md:h-[450px] flex items-center justify-center"
      >
        {/* Mouse-Driven Inner Wrapper */}
        <motion.div
          style={{
            rotateX: mouseRotateX,
            rotateY: mouseRotateY,
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full h-full flex items-center justify-center"
        >
          {/* Neon Atmosphere backing glow */}
          <div className="absolute inset-0 bg-primary/10 blur-[130px] rounded-full -translate-z-50 pointer-events-none" />

          {/* Layer 0: Main Screen Mockup (Base Motherboard) */}
          <div 
            style={{ transform: 'translateZ(-15px)' }}
            className="absolute inset-0 bg-black/60 rounded-[3rem] border border-white/10 backdrop-blur-md p-8 flex flex-col justify-between overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          >
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px]" />
            
            <div className="flex justify-between items-start z-10">
              <div>
                <div className="text-[10px] text-primary font-black uppercase tracking-widest">NEXORA SYSTEM PREVIEW</div>
                <div className="text-[7px] text-white/20 font-mono tracking-widest mt-1">SYS_STATUS_SECURE // OK</div>
              </div>
              <Cpu className="w-5 h-5 text-primary/40 animate-pulse" />
            </div>

            <div className="flex justify-between items-end z-10">
              <div className="flex gap-2 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
                <span className="text-[8px] text-white/40 font-mono">CORE_ENGINE_ACTIVE</span>
              </div>
              <div className="text-[7px] text-white/15 font-mono">PORT // 3000</div>
            </div>
          </div>

          {/* Layer 1: GPA Calculator Widget (Floating Z: 60px + Scroll Parallax) */}
          <motion.div
            style={{ 
              transform: 'translateZ(70px)',
              y: widgetGpaY
            }}
            animate={{ x: [0, -3, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-[-20px] left-[-40px] w-[190px] h-[140px] bg-slate-900/90 border border-white/10 rounded-[1.5rem] p-4 flex flex-col justify-between shadow-[0_15px_30px_rgba(0,0,0,0.5)] backdrop-blur-md group hover:border-primary/50 transition-all duration-300"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/20 text-primary">
                  <Calculator className="w-3.5 h-3.5" />
                </div>
                <span className="text-[8px] font-bold text-white/80">GPA ENGINE</span>
              </div>
              <ArrowUpRight className="w-3 h-3 text-white/30 group-hover:text-primary transition-colors" />
            </div>
            <div className="flex items-end justify-between my-2">
              <div className="flex flex-col">
                <span className="text-[7px] text-white/30 font-bold uppercase tracking-wider">PROJECTED</span>
                <span className="text-2xl font-black text-white leading-none mt-1">3.94</span>
              </div>
              <div className="flex gap-1 items-end h-8">
                <div className="w-1.5 h-[50%] bg-primary/20 rounded-sm" />
                <div className="w-1.5 h-[70%] bg-primary/40 rounded-sm" />
                <div className="w-1.5 h-[65%] bg-primary/30 rounded-sm" />
                <div className="w-1.5 h-[95%] bg-primary rounded-sm shadow-[0_0_10px_rgba(41,141,255,0.5)]" />
              </div>
            </div>
            <div className="text-[7px] text-white/30 border-t border-white/5 pt-2 flex justify-between">
              <span>IIT-102: A+</span>
              <span>IIT-104: A</span>
            </div>
          </motion.div>

          {/* Layer 2: Neural Core Widget (Floating Z: 130px + Scroll Parallax) */}
          <motion.div
            style={{ 
              transform: 'translateZ(140px)',
              y: widgetNeuralY
            }}
            animate={{ x: [0, 4, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute bottom-[-20px] right-[-30px] w-[210px] h-[150px] bg-slate-950/90 border border-cyan-400/10 rounded-[1.5rem] p-4 flex flex-col justify-between shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-md hover:border-cyan-400/50 transition-all duration-300"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-400/20 text-cyan-400">
                  <Brain className="w-3.5 h-3.5 animate-pulse" />
                </div>
                <span className="text-[8px] font-bold text-white/80">NEURAL CORE</span>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            
            <div className="w-full h-8 flex items-center justify-center overflow-hidden my-1">
              <svg className="w-full h-full stroke-cyan-400/50" viewBox="0 0 100 20" fill="none">
                <motion.path
                  d="M0,10 Q10,2 20,10 T40,10 T60,10 T80,10 T100,10"
                  strokeWidth="1.5"
                  animate={{
                    d: [
                      "M0,10 Q10,0 20,10 T40,10 T60,10 T80,10 T100,10",
                      "M0,10 Q10,18 20,10 T40,10 T60,10 T80,10 T100,10",
                      "M0,10 Q10,0 20,10 T40,10 T60,10 T80,10 T100,10"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              </svg>
            </div>

            <div className="flex justify-between items-center text-[7px] text-cyan-400/60 font-mono tracking-wider border-t border-cyan-400/5 pt-2">
              <span>SYNC_SUCCESS</span>
              <span className="animate-pulse">LATENCY_4MS</span>
            </div>
          </motion.div>

          {/* Layer 3: Mock Arena Widget (Floating Z: 200px + Scroll Parallax) */}
          <motion.div
            style={{ 
              transform: 'translateZ(210px)',
              y: widgetArenaY
            }}
            animate={{ x: [0, -2, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-[110px] left-[140px] w-[180px] h-[110px] bg-slate-900/90 border border-purple-500/10 rounded-[1.5rem] p-4 flex flex-col justify-between shadow-[0_25px_45px_rgba(0,0,0,0.6)] backdrop-blur-md hover:border-purple-500/50 transition-all duration-300"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
                  <Target className="w-3.5 h-3.5" />
                </div>
                <span className="text-[8px] font-bold text-white/80">MOCK ENVIRONMENT</span>
              </div>
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
            </div>
            <div className="my-2">
              <div className="text-[6px] text-white/30 uppercase tracking-widest font-black">ARENA COUNTDOWN</div>
              <div className="text-lg font-black text-purple-400 font-mono tracking-wider mt-0.5">02:14:58</div>
            </div>
            <div className="text-[7px] text-white/30 border-t border-white/5 pt-2 flex justify-between items-center">
              <span>Active Simulator</span>
              <span className="text-[6px] bg-purple-500/20 text-purple-400 px-1 rounded font-bold">LIVE</span>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
