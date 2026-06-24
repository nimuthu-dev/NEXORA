'use client';

import { Check, X } from 'lucide-react';

const NEXORA_FEATURES = [
  'Hyper-Efficient Fetching',
  'Secure Course Vault',
  'Trajectory Modeling',
  'AI Instant Derivations',
  'Real-Time Exam Countdown',
  'Active GPA Simulations',
];

const TRADITIONAL_FEATURES = [
  'Generic Outdated Docs',
  'Manual Course Files',
  'Rigid Unscaled Layouts',
  'No Active Analytics',
  'No Time Tracking',
  'Static Manual Calculations',
];

export function ComparisonTable() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      <div className="relative glass border-foreground/10 p-8 md:p-14 rounded-[3.5rem] shadow-2xl backdrop-blur-md overflow-hidden group">
        
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] rounded-full pointer-events-none -mr-20 -mt-20" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          
          {/* Nexora Column */}
          <div className="flex flex-col gap-8 text-left border-b md:border-b-0 md:border-r border-foreground/10 pb-10 md:pb-0 md:pr-12">
            <div>
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">SYSTEM CORE</span>
              <h3 className="text-3xl font-black text-foreground mt-2">Nexora Academic OS</h3>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed mt-2 italic">A custom-engineered ecosystem built strictly for student productivity.</p>
            </div>
            
            <div className="flex flex-col gap-4">
              {NEXORA_FEATURES.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 group/item">
                  <div className="w-6 h-6 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover/item:scale-110 transition-transform shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-bold text-foreground/80 group-hover/item:text-foreground transition-colors">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Traditional Column */}
          <div className="flex flex-col gap-8 text-left md:pl-6">
            <div>
              <span className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.4em]">DEFAULT FLOW</span>
              <h3 className="text-3xl font-black text-foreground/50 mt-2">Traditional Flow</h3>
              <p className="text-xs text-foreground/40 font-medium leading-relaxed mt-2 italic">Manual, un-coordinated strategies that struggle to scale under workload.</p>
            </div>
            
            <div className="flex flex-col gap-4">
              {TRADITIONAL_FEATURES.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 opacity-75">
                  <div className="w-6 h-6 rounded-full bg-foreground/[0.03] border border-foreground/10 flex items-center justify-center text-foreground/30 shrink-0">
                    <X className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium text-foreground/60">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
