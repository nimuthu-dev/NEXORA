'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Compass, 
  Activity, 
  Flower2, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function ScrollShowcaseBox() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Text refs
  const step1TextRef = useRef<HTMLDivElement>(null);
  const step2TextRef = useRef<HTMLDivElement>(null);
  const step3TextRef = useRef<HTMLDivElement>(null);

  // HUD graphic refs
  const hud1Ref = useRef<HTMLDivElement>(null);
  const hud2Ref = useRef<HTMLDivElement>(null);
  const hud3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    const card = cardRef.current;
    if (!trigger || !card) return;

    const ctx = gsap.context(() => {
      // Main Scroll-pinned Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: 'top top',
          end: '+=1600', // scroll scrollHeight
          scrub: 1, // Smooth scrub tracking
          pin: true,
          anticipatePin: 1,
        }
      });

      // 1. Initial card entrance
      tl.fromTo(card, 
        { scale: 0.88, opacity: 0.7, rotateX: 10 }, 
        { scale: 1, opacity: 1, rotateX: 0, duration: 0.2 }
      );

      // 2. Transition Step 1 -> Step 2
      tl.to(step1TextRef.current, { opacity: 0, y: -25, duration: 0.25 }, '+=0.25')
        .to(hud1Ref.current, { opacity: 0, scale: 0.8, rotate: 180, duration: 0.25 }, '<')
        .to(glowRef.current, { 
          background: 'radial-gradient(circle, rgba(0, 194, 255, 0.24) 0%, transparent 70%)',
          duration: 0.25 
        }, '<')
        .to(card, { borderColor: 'rgba(0, 194, 255, 0.25)', duration: 0.25 }, '<')
        .fromTo(step2TextRef.current, 
          { opacity: 0, y: 25 }, 
          { opacity: 1, y: 0, duration: 0.25 }
        )
        .fromTo(hud2Ref.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.25 },
          '<'
        );

      // 3. Transition Step 2 -> Step 3
      tl.to(step2TextRef.current, { opacity: 0, y: -25, duration: 0.25 }, '+=0.25')
        .to(hud2Ref.current, { opacity: 0, scale: 0.8, rotate: -180, duration: 0.25 }, '<')
        .to(glowRef.current, { 
          background: 'radial-gradient(circle, rgba(239, 68, 68, 0.22) 0%, transparent 70%)',
          duration: 0.25 
        }, '<')
        .to(card, { borderColor: 'rgba(239, 68, 68, 0.25)', duration: 0.25 }, '<')
        .fromTo(step3TextRef.current, 
          { opacity: 0, y: 25 }, 
          { opacity: 1, y: 0, duration: 0.25 }
        )
        .fromTo(hud3Ref.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.25 },
          '<'
        );

      // Continuous Scroll-based Rotations
      gsap.to(hud1Ref.current, { rotate: 360, scrollTrigger: { trigger: trigger, start: 'top top', end: '+=1600', scrub: 1 } });
      gsap.to(hud2Ref.current, { rotate: -360, scrollTrigger: { trigger: trigger, start: 'top top', end: '+=1600', scrub: 1 } });
      gsap.to(hud3Ref.current, { rotate: 360, scrollTrigger: { trigger: trigger, start: 'top top', end: '+=1600', scrub: 1 } });

    }, trigger);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={triggerRef} className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-12">
      {/* Dynamic Scenery Glow Backdrop */}
      <div 
        ref={glowRef}
        className="absolute inset-0 transition-all duration-1000 ease-out pointer-events-none opacity-50 blur-[130px] -z-10"
        style={{ background: 'radial-gradient(circle, rgba(41, 141, 255, 0.22) 0%, transparent 70%)' }}
      />

      {/* Pinned Morphing Console Box */}
      <div 
        ref={cardRef}
        className="relative max-w-4xl w-full mx-6 h-[460px] glass border border-foreground/10 rounded-[3rem] shadow-2xl backdrop-blur-3xl overflow-hidden flex flex-col md:flex-row transition-all duration-500"
        style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
      >
        {/* Left Side: Dynamic Graphics Panel */}
        <div className="md:w-1/2 h-48 md:h-full relative border-b md:border-b-0 md:border-r border-foreground/10 flex items-center justify-center bg-black/10 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:16px_16px]" />
          
          {/* HUD 1 */}
          <div ref={hud1Ref} className="absolute w-44 h-44 md:w-56 md:h-56 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-dashed border-primary/20 animate-spin" style={{ animationDuration: '40s' }} />
            <div className="absolute inset-4 rounded-full border border-primary/10" />
            <div className="absolute inset-8 rounded-full border border-dashed border-primary/30 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />
            <Compass className="w-12 h-12 md:w-16 md:h-16 text-primary drop-shadow-[0_0_15px_rgba(41,141,255,0.4)]" />
          </div>

          {/* HUD 2 */}
          <div ref={hud2Ref} className="absolute w-44 h-44 md:w-56 md:h-56 flex items-center justify-center opacity-0 scale-75">
            <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/20" />
            <div className="absolute inset-6 rounded-full border border-cyan-500/10" />
            <div className="absolute w-36 h-36 rounded-full border-2 border-cyan-400/30 animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute w-24 h-24 rounded-full border border-cyan-400/40 animate-pulse" />
            <Activity className="w-12 h-12 md:w-16 md:h-16 text-cyan-400 drop-shadow-[0_0_15px_rgba(0,194,255,0.4)]" />
          </div>

          {/* HUD 3 */}
          <div ref={hud3Ref} className="absolute w-44 h-44 md:w-56 md:h-56 flex items-center justify-center opacity-0 scale-75">
            <div className="absolute inset-0 rounded-full border border-dashed border-rose-500/20" />
            <div className="absolute inset-4 rounded-full border border-dashed border-rose-500/10 animate-spin" style={{ animationDuration: '15s' }} />
            <div className="absolute w-36 h-36 border border-rose-400/30 rounded-[2.5rem] rotate-45 animate-spin" style={{ animationDuration: '25s' }} />
            <div className="absolute w-24 h-24 border border-rose-400/40 rounded-full animate-pulse" />
            <Flower2 className="w-12 h-12 md:w-16 md:h-16 text-rose-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)]" />
          </div>
        </div>

        {/* Right Side: Step Content Cards */}
        <div className="md:w-1/2 h-auto md:h-full relative flex items-center p-8 md:p-12 text-left">
          
          {/* STEP 1 TEXT */}
          <div ref={step1TextRef} className="flex flex-col gap-5">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-primary animate-pulse" /> Phase 01 // INITIATION
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-foreground">Academic Kickoff</h3>
            <p className="text-sm font-medium leading-relaxed text-foreground/60 dark:text-white/50">
              Lock in your semester targets, sync module requirements, and establish fixed schedules before curriculum execution begins.
            </p>
            <ul className="flex flex-col gap-2 mt-2">
              {["Workspace and credentials synchronization", "Degree/module syllabus indexing", "Goal milestones and calendar blockouts"].map((pt, i) => (
                <li key={i} className="flex items-center gap-3 text-[10px] font-bold text-foreground/50 dark:text-white/40 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary/60 shrink-0" /> {pt}
                </li>
              ))}
            </ul>
          </div>

          {/* STEP 2 TEXT */}
          <div ref={step2TextRef} className="absolute inset-x-8 md:inset-x-12 flex flex-col gap-5 opacity-0 pointer-events-none">
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em] flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" /> Phase 02 // SIMULATIONS
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-foreground">Execution & Training</h3>
            <p className="text-sm font-medium leading-relaxed text-foreground/60 dark:text-white/50">
              Solve mock questions with real-time AI guidance, run timed exam condition simulations, and analyze your conceptual accuracy.
            </p>
            <ul className="flex flex-col gap-2 mt-2">
              {["Adaptive GPA performance trackers", "Time-locked arena simulation tests", "Detailed weakness report mapping"].map((pt, i) => (
                <li key={i} className="flex items-center gap-3 text-[10px] font-bold text-foreground/50 dark:text-white/40 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400/60 shrink-0" /> {pt}
                </li>
              ))}
            </ul>
          </div>

          {/* STEP 3 TEXT */}
          <div ref={step3TextRef} className="absolute inset-x-8 md:inset-x-12 flex flex-col gap-5 opacity-0 pointer-events-none">
            <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em] flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-rose-500 animate-pulse" /> Phase 03 // RESOLUTION
            </span>
            <h3 className="text-3xl md:text-4xl font-black text-foreground">Handoff & Analytics</h3>
            <p className="text-sm font-medium leading-relaxed text-foreground/60 dark:text-white/50">
              Export comprehensive folders, review final semester GPA metrics, and archive alumni study records.
            </p>
            <ul className="flex flex-col gap-2 mt-2">
              {["Full course data backups & archives", "Semester GPA summaries", "Next semester prediction loaders"].map((pt, i) => (
                <li key={i} className="flex items-center gap-3 text-[10px] font-bold text-foreground/50 dark:text-white/40 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-500/60 shrink-0" /> {pt}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
