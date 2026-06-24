'use client';

import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Layers, 
  Cpu, 
  Flame, 
  Move,
  Code,
  Network,
  Infinity as InfinityIcon
} from 'lucide-react';

const STACK_ITEMS = [
  { name: 'Next.js 15', category: 'App Architecture', icon: Layers, color: 'rgba(255,255,255,0.05)' },
  { name: 'React 19', category: 'Component Engine', icon: InfinityIcon, color: 'rgba(56,189,248,0.05)' },
  { name: 'Genkit AI', category: 'Neural Framework', icon: Cpu, color: 'rgba(139,92,246,0.08)' },
  { name: 'Firebase', category: 'Cloud Datastore', icon: Flame, color: 'rgba(41,141,255,0.08)' },
  { name: 'Tailwind CSS', category: 'Utility Styling', icon: Code, color: 'rgba(56,189,248,0.05)' },
  { name: 'Framer Motion', category: '3D Transitions', icon: Move, color: 'rgba(236,72,153,0.05)' },
];

export function TechStackGrid() {
  return (
    <div className="w-full py-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 max-w-5xl mx-auto px-4">
        {STACK_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, duration: 0.6 }}
              whileHover={{ y: -6, scale: 1.03 }}
              className="relative p-6 rounded-[2rem] bg-slate-950/40 border border-white/5 hover:border-primary/20 flex flex-col justify-between h-[150px] transition-all duration-300 group shadow-lg"
            >
              {/* Background gradient hint */}
              <div 
                className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(120px circle at 50% 50%, ${item.color}, transparent 80%)` }}
              />

              <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-white/40 group-hover:text-primary group-hover:bg-primary/5 transition-all duration-500 z-10">
                <Icon className="w-5 h-5" />
              </div>

              <div className="flex flex-col gap-1 text-left z-10">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest leading-none">
                  {item.category}
                </span>
                <span className="text-sm font-bold text-white/95 mt-1 group-hover:translate-x-0.5 transition-transform duration-300">
                  {item.name}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
