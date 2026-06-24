'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, useScroll, useSpring, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Navbar } from '@/components/landing/navbar';
import dynamic from 'next/dynamic';
const SplashScreen = dynamic(
  () => import('@/components/splash-screen').then((mod) => mod.SplashScreen),
  { ssr: false }
);
import { VisitorCounter } from '@/components/visitor-counter';
import { useFirestore } from '@/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { 
  Rocket, 
  ChevronDown,
  Bot,
  Sparkles,
  Zap,
  Shield,
  BarChart3,
  Calculator,
  Mail,
  MessageSquare,
  Plus,
  Trash2,
  Send,
  Heart,
  Target,
  Timer,
  BookOpen
} from 'lucide-react';
import { audioManager } from "@/components/landing/sound-controller";
import { ScrollShowcaseBox } from '@/components/landing/scroll-showcase-box';

// Framer-Style 3D Custom Components
import { ThreeDCard } from '@/components/landing/three-d-card';
import { ThreeDHeroVisual } from '@/components/landing/three-d-hero-visual';
import { ScrollReveal, TextReveal } from '@/components/landing/scroll-reveal';
import { FramerTicker } from '@/components/landing/framer-ticker';
import { GlowingBorder } from '@/components/landing/glowing-border';
import { FloatingDock } from '@/components/landing/floating-dock';
import { TechStackGrid } from '@/components/landing/tech-stack-grid';
import { ComparisonTable } from '@/components/landing/comparison-table';
import ScrollFloat from '@/components/ui/ScrollFloat';

export default function LandingPage({
  params,
  searchParams,
}: {
  params: Promise<any>;
  searchParams: Promise<any>;
}) {
  // Explicitly ignore params and searchParams as we don't use them on the home page,
  // but destructuring them from props prevents enumeration warnings in Next.js 15.
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = useCallback(() => {
    setShowSplash(false);
  }, []);

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return <LandingContent />;
}

function LandingContent() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col min-h-screen selection:bg-primary/30 font-sans bg-transparent scroll-smooth overflow-x-hidden pb-24"
    >
      <motion.div className="scroll-progress" style={{ scaleX }} />
      <Navbar />
      <FloatingDock />
      
      {/* Hero Section - Centered layout with large 3D Zoom on Scroll below */}
      <section id="hero" className="relative min-h-[120vh] flex flex-col items-center justify-start pt-36 pb-16 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          
          {/* Main Title - Slide Masks */}
          <div className="relative mb-6 flex flex-col items-center gap-0 group max-w-4xl">
            <h1 className="flex flex-col items-center text-center select-none cursor-default leading-[0.85] tracking-[-0.04em] font-black w-full">
              <span className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] text-foreground/95 dark:text-white/95 uppercase mb-2 overflow-hidden block" style={{ fontFamily: "'Barlow Condensed', 'Outfit', sans-serif", fontWeight: 900, letterSpacing: '0.02em' }}>
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
                >
                  CONQUER
                </motion.span>
              </span>
              <span className="text-8xl sm:text-[10rem] md:text-[12rem] lg:text-[14rem] bg-gradient-to-b from-red-500 to-rose-700 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(239,68,68,0.45)] overflow-hidden block">
                <motion.span
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="block"
                >
                  IIT
                </motion.span>
              </span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-8 text-base md:text-xl text-foreground/80 dark:text-white/70 font-semibold leading-relaxed max-w-lg"
            >
              Built for IIT students. <br />
              <span className="text-foreground dark:text-white/90 font-black">Study smarter. Score higher. Own your semester.</span>
            </motion.p>
            <div className="absolute -inset-x-20 -inset-y-10 bg-red-500/5 blur-[120px] rounded-full -z-10 pointer-events-none opacity-40 group-hover:opacity-60 transition-opacity duration-1000" />
          </div>
          
          {/* Action Button */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
          >
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              onMouseEnter={() => audioManager?.triggerTick()}
              onClick={() => audioManager?.triggerPop()}
            >
              <Button 
                variant="outline" 
                className="rounded-full px-14 h-16 text-[11px] font-black tracking-widest bg-background/50 border border-border text-foreground hover:bg-foreground hover:text-background transition-all shadow-xl"
                asChild
              >
                <Link href="#features">EXPLORE INFRASTRUCTURE</Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Centered Large 3D Mockup - Zooms and rotates flat on scroll */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotateX: 30 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ delay: 0.5, duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-6xl z-10"
          >
            <ThreeDHeroVisual />
          </motion.div>

        </div>

        <motion.div 
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none"
        >
          <ChevronDown className="w-5 h-5 text-white" />
        </motion.div>
      </section>

      {/* Infinite banner transition */}
      <FramerTicker />

      {/* Comparison Section (Module 01) */}
      <section id="features" className="py-24 relative z-10 border-t border-border">
        <div className="container mx-auto px-6">
          <ScrollReveal direction="up">
            <div className="flex flex-col items-center text-center mb-16 gap-6">
              <span className="text-primary font-bold tracking-[0.5em] uppercase text-[10px]">Module 01 // COMPARISON</span>
              <ScrollFloat
                stagger={0.02}
                animationDuration={0.8}
                textClassName="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-tight text-center max-w-4xl"
              >
                Engineered for Academic Superiority
              </ScrollFloat>
              <div className="h-px w-24 bg-primary/20 mt-4" />
            </div>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <ComparisonTable />
          </ScrollReveal>
        </div>
      </section>

      {/* Workflow Timeline Section (Module 02) */}
      <section id="timeline" className="py-24 relative z-10 border-t border-border">
        <div className="container mx-auto px-6">
          <ScrollReveal direction="up">
            <div className="flex flex-col items-center text-center mb-24 gap-6">
              <span className="text-primary font-bold tracking-[0.5em] uppercase text-[10px]">Module 02 // WORKFLOW</span>
              <ScrollFloat
                stagger={0.02}
                animationDuration={0.8}
                textClassName="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-tight text-center max-w-4xl"
              >
                The Semester Lifecycle
              </ScrollFloat>
              <p className="max-w-xl text-foreground/50 dark:text-white/40 text-sm font-medium leading-relaxed italic text-center">A structured roadmap designed to guarantee high-performance execution.</p>
              <div className="h-px w-24 bg-primary/20 mt-4" />
            </div>
          </ScrollReveal>

          {/* Static Timeline for Mobile Viewports */}
          <div className="max-w-4xl mx-auto flex md:hidden flex-col gap-8">
            <ScrollReveal direction="left" delay={0}>
              <TimelineItem 
                step="Step 01"
                title="Academic Kickoff"
                description="Set your goals, lock your schedule, and load your syllabus."
                points={["System setup & briefings", "Fixed module schedules", "Syllabus configurations"]}
              />
            </ScrollReveal>
            <ScrollReveal direction="left" delay={0.1}>
              <TimelineItem 
                step="Step 02"
                title="Execution & Simulations"
                description="Solve problems with AI, run timed mocks, and track accuracy."
                points={["Interactive GPA projections", "Time-locked mock tests", "Deep analytics review"]}
              />
            </ScrollReveal>
            <ScrollReveal direction="left" delay={0.2}>
              <TimelineItem 
                step="Step 03"
                title="Handoff & Analytics"
                description="Review results, archive records, and prep for what's next."
                points={["Complete folder archives", "Final GPA metrics", "Alumni folder archives"]}
              />
            </ScrollReveal>
          </div>

          {/* Cinematic Scroll Box Showcase for Desktop Viewports */}
          <div className="hidden md:block">
            <ScrollShowcaseBox />
          </div>
        </div>
      </section>

      {/* Tech Stack Grid Section (Module 03) */}
      <section id="stack" className="py-24 relative z-10 border-t border-border">
        <div className="container mx-auto px-6">
          <ScrollReveal direction="up">
            <div className="flex flex-col items-center text-center mb-16 gap-6">
              <span className="text-primary font-bold tracking-[0.5em] uppercase text-[10px]">Module 03 // ENGINE</span>
              <ScrollFloat
                stagger={0.02}
                animationDuration={0.8}
                textClassName="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-tight text-center max-w-4xl"
              >
                Core Platform Stack
              </ScrollFloat>
              <p className="max-w-xl text-foreground/50 dark:text-white/40 text-sm font-medium leading-relaxed italic text-center">Modern, highly optimized frameworks powering Nexora's user experience.</p>
              <div className="h-px w-24 bg-primary/20 mt-4" />
            </div>
          </ScrollReveal>

          <TechStackGrid />
        </div>
      </section>

      {/* AI Assistant Section (Module 04) */}
      <section id="ai" className="py-24 relative z-10 overflow-hidden border-t border-border">
        <div className="container mx-auto px-6">
          <ScrollReveal direction="up">
            <GlowingBorder>
              <ThreeDCard glowColor="rgba(41, 141, 255, 0.15)">
                <div 
                  className="glass rounded-[4rem] border-white/5 p-16 md:p-24 flex flex-col lg:flex-row items-center justify-between gap-16 relative overflow-hidden group bg-slate-950/40 text-left"
                >
                  <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-primary/5 blur-[180px] rounded-full -mr-[400px] -mt-[400px] pointer-events-none" />
                  
                  <div className="flex flex-col gap-10 max-w-2xl relative z-10">
                    <div className="flex items-center gap-5">
                      <span className="text-primary font-bold tracking-[0.4em] uppercase text-[9px]">Module 04 // NEURAL_CORE</span>
                      <div className="h-px w-16 bg-primary/20" />
                    </div>
                    
                    <h2 className="text-6xl md:text-8xl font-extrabold tracking-tight leading-[0.85] text-left">
                      <span className="text-foreground dark:text-white block">Nexora</span>
                      <span className="text-primary block">Intelligence</span>
                    </h2>
                    
                    <p className="text-lg text-foreground/50 dark:text-white/30 font-medium leading-relaxed max-w-lg italic">
                      A high-frequency intellectual companion engineered to summarize complex lectures and solve high-order derivations instantly.
                    </p>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button className="w-fit rounded-full px-12 h-16 bg-primary hover:bg-primary/80 text-white border-none text-[11px] font-bold tracking-widest shadow-xl shadow-primary/20 flex items-center gap-4 transition-all" asChild>
                        <Link href="/ai">
                          INITIALIZE NEURAL LINK <Sparkles className="w-4 h-4" />
                        </Link>
                      </Button>
                    </motion.div>
                  </div>

                  <NeuralCoreVisual />
                </div>
              </ThreeDCard>
            </GlowingBorder>
          </ScrollReveal>
        </div>
      </section>

      {/* Mock Arena Preview Section (Module 05) */}
      <section id="simulation" className="py-24 relative z-10 overflow-hidden border-t border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal direction="left" className="flex flex-col gap-8">
              <div className="flex items-center gap-5">
                <span className="text-primary font-bold tracking-[0.4em] uppercase text-[9px]">Module 05 // SIMULATION</span>
                <div className="h-px w-16 bg-primary/20" />
              </div>
              <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-tight text-left">Mock Arena <br/> Environment</h2>
              <p className="text-lg text-foreground/50 dark:text-white/40 font-medium leading-relaxed italic border-l-2 border-primary/20 pl-8 max-w-md text-left">
                Battle-test your knowledge with time-locked simulations and institutional past papers designed to mirror real exam stressors.
              </p>
              <div className="flex flex-col gap-6">
                <SimulationFeature icon={<Timer className="w-4 h-4 text-primary" />} text="Precision Time Tracking" />
                <SimulationFeature icon={<BookOpen className="w-4 h-4 text-primary" />} text="Institutional Past Paper Vault" />
                <SimulationFeature icon={<BarChart3 className="w-4 h-4 text-primary" />} text="Deep Accuracy Analytics" />
              </div>
              <Button className="w-fit rounded-full px-12 h-16 bg-primary hover:bg-primary/85 text-white border-none text-[11px] font-bold tracking-widest shadow-xl shadow-primary/20 transition-all" asChild>
                <Link href="/mock-arena">
                  ENTER SIMULATION <Target className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </ScrollReveal>

            <ScrollReveal direction="right" className="relative">
              <GlowingBorder borderRadius="rounded-[3rem]">
                <ThreeDCard glowColor="rgba(41, 141, 255, 0.15)">
                  <div className="glass rounded-[3rem] border-white/5 p-8 md:p-12 relative z-10 backdrop-blur-3xl overflow-hidden group bg-slate-950/40 text-left">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="flex flex-col gap-8 relative z-10 animate-fade-in">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black tracking-widest text-primary uppercase">Active Mock Profile</span>
                        <div className="flex gap-1">
                          <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                          <div className="w-1 h-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.2s' }} />
                          <div className="w-1 h-1 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0.4s' }} />
                        </div>
                      </div>
                      <div className="space-y-6">
                        <div className="h-4 w-3/4 bg-white/5 rounded-full animate-pulse" />
                        <div className="h-4 w-1/2 bg-white/5 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                        <div className="h-32 w-full bg-white/5 rounded-[2rem] border border-white/5 flex items-center justify-center">
                          <Target className="w-12 h-12 text-primary/20" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="h-12 bg-white/5 rounded-2xl border border-white/5" />
                        <div className="h-12 bg-primary/20 rounded-2xl border border-primary/20 animate-pulse-glow" />
                      </div>
                    </div>
                  </div>
                </ThreeDCard>
              </GlowingBorder>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[100px] rounded-full" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 blur-[100px] rounded-full" />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* GPA Calculator Section (Module 06) */}
      <section id="gpa" className="py-24 relative z-10 border-t border-border">
        <div className="container mx-auto px-6">
          <ScrollReveal direction="up">
            <div className="flex flex-col items-center text-center gap-6 mb-20">
              <span className="text-primary font-bold tracking-[0.4em] uppercase text-[9px]">Module 06 // ANALYTICS</span>
              <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground dark:text-white">GPA Simulation</h2>
              <p className="max-w-xl text-foreground/50 dark:text-white/40 text-sm font-medium leading-relaxed italic text-center">Precise trajectory modeling for your upcoming semester evaluations.</p>
            </div>
          </ScrollReveal>
          <GpaCalculator />
        </div>
      </section>

      {/* Feedback & Support Section (Module 07) */}
      <section id="support" className="py-24 relative z-10 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <ScrollReveal direction="left" className="flex flex-col gap-10">
              <div className="flex items-center gap-5">
                <span className="text-primary font-bold tracking-[0.4em] uppercase text-[9px]">Module 07 // TERMINAL</span>
                <div className="h-px w-16 bg-primary/20" />
              </div>
              <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-tight text-left">System Feedback <br/> & Support</h2>
              <p className="text-lg text-foreground/50 dark:text-white/40 font-medium leading-relaxed italic border-l-2 border-primary/20 pl-8 text-left">
                Direct transmission link for reporting system anomalies or sharing academic insights with the development core.
              </p>
              
              <div className="flex flex-col gap-8 mt-6">
                <SupportContact icon={<Mail className="w-5 h-5" />} label="Email Protocol" value="nimuthu.rp@gmail.com" />
              </div>
            </ScrollReveal>

            <FeedbackForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-background border-t border-border relative z-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-16">
            <Link href="/" className="flex items-center gap-5 group">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-2xl shadow-primary/20 group-hover:scale-110 transition-transform">
                <span className="text-2xl font-black text-white">N</span>
              </div>
              <span className="text-3xl font-extrabold tracking-tighter text-foreground">NEXORA</span>
            </Link>
            <div className="flex flex-wrap justify-center gap-10 text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground/50">
              <Link href="#hero" className="hover:text-primary transition-colors">ROOT</Link>
              <Link href="#features" className="hover:text-primary transition-colors">COMPARISON</Link>
              <Link href="#timeline" className="hover:text-primary transition-colors">WORKFLOW</Link>
              <Link href="#stack" className="hover:text-primary transition-colors">ENGINE</Link>
              <Link href="#ai" className="hover:text-primary transition-all">NEURAL</Link>
              <Link href="#simulation" className="hover:text-primary transition-all">ARENA</Link>
              <Link href="#gpa" className="hover:text-primary transition-all text-primary/80">GPA</Link>
              <Link href="#support" className="hover:text-primary transition-colors">SUPPORT</Link>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-border flex flex-col gap-3">
            <p className="text-[9px] font-bold tracking-[0.5em] text-muted-foreground/40 uppercase">
              © 2026 NEXORA // ACADEMIC OPERATING SYSTEM
            </p>
            <p className="text-[8px] font-bold tracking-[0.2em] text-muted-foreground/20 uppercase">
              DESIGNED & DEVELOPED BY NIMUTHU PATHIRATHNE
            </p>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}

function NeuralCoreVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const x = useSpring(useTransform(mouseX, [-200, 200], [-15, 15]), { stiffness: 150, damping: 20 });
  const y = useSpring(useTransform(mouseY, [-200, 200], [-15, 15]), { stiffness: 150, damping: 20 });

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative group lg:mr-10 animate-fade-in"
    >
      <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
        {/* Animated Background Rings */}
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{ rotate: { duration: 30, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}
          className="absolute inset-0 rounded-full border border-dashed border-primary/10"
        />
        <motion.div 
          animate={{ rotate: -360, scale: [1, 1.1, 1] }}
          transition={{ rotate: { duration: 25, repeat: Infinity, ease: "linear" }, scale: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
          className="absolute inset-4 rounded-full border border-primary/5"
        />

        {/* Floating Neural Particles */}
        <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                x: Math.random() * 300 - 150, 
                y: Math.random() * 300 - 150,
                opacity: 0.1
              }}
              animate={{ 
                y: [null, Math.random() * -100 - 50],
                opacity: [0.1, 0.4, 0.1],
                scale: [1, 1.5, 1]
              }}
              transition={{ 
                duration: Math.random() * 3 + 2, 
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute w-1 h-1 bg-primary rounded-full"
            />
          ))}
        </div>
        
        {/* Main Central Orb */}
        <motion.div 
          style={{ x, y }}
          className="w-56 h-56 md:w-72 md:h-72 rounded-full bg-black border border-primary/20 flex items-center justify-center relative overflow-hidden group-hover:border-primary/50 transition-colors shadow-[0_0_100px_rgba(253,81,0,0.15)] backdrop-blur-sm z-20"
        >
          {/* Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none" />

          <motion.div
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            className="relative"
          >
            <Bot className="w-28 h-28 md:w-36 md:h-36 text-primary animate-float" />
            <motion.div 
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 blur-xl bg-primary/20 rounded-full -z-10"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function SimulationFeature({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/60 dark:text-white/60">{text}</span>
    </div>
  )
}

function GpaCalculator() {
  const [courses, setCourses] = useState([{ id: 1, credits: '', grade: '' }]);
  const [gpa, setGpa] = useState<number | null>(null);

  const gradeValues: Record<string, number> = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0
  };

  const addCourse = () => {
    setCourses([...courses, { id: Date.now(), credits: '', grade: '' }]);
  };

  const removeCourse = (id: number) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id: number, field: string, value: string) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  useEffect(() => {
    let totalCredits = 0;
    let totalPoints = 0;
    let isValid = true;

    courses.forEach(c => {
      const credits = parseFloat(c.credits);
      const gradeVal = gradeValues[c.grade.toUpperCase()];
      if (!isNaN(credits) && gradeVal !== undefined) {
        totalCredits += credits;
        totalPoints += credits * gradeVal;
      } else if (c.credits !== '' || c.grade !== '') {
        isValid = false;
      }
    });

    if (isValid && totalCredits > 0) {
      setGpa(Math.round((totalPoints / totalCredits) * 100) / 100);
    } else {
      setGpa(null);
    }
  }, [courses]);

  return (
    <ScrollReveal direction="up">
      <GlowingBorder borderRadius="rounded-[3.5rem]" className="max-w-4xl mx-auto shadow-2xl">
        <ThreeDCard glowColor="rgba(41, 141, 255, 0.12)">
          <div 
            className="glass p-12 md:p-16 rounded-[3.5rem] border-foreground/10 w-full dark:bg-slate-950/40 text-left"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            
            <div className="flex flex-col gap-12">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Calculator className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">Course Simulation</h3>
                    <p className="text-[10px] text-foreground/30 uppercase font-bold tracking-[0.2em]">Active Computational Unit</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.3em] mb-2">Simulated GPA</p>
                    <span className={`text-5xl font-black transition-all duration-500 ${gpa ? 'text-primary' : 'text-foreground/10'}`}>
                      {gpa !== null ? gpa.toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <AnimatePresence initial={false}>
                  {courses.map((course, index) => (
                    <motion.div 
                      key={course.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="grid grid-cols-12 gap-5 items-center bg-foreground/[0.02] p-6 rounded-[1.5rem] border border-foreground/[0.05] group/row hover:bg-foreground/[0.04] transition-all"
                    >
                      <div className="col-span-1 text-[10px] font-bold text-foreground/30 text-center">#{index + 1}</div>
                      <div className="col-span-6 md:col-span-7">
                        <input 
                          placeholder="Module Descriptor (Optional)" 
                          className="bg-transparent border-none text-sm font-medium text-foreground placeholder:text-foreground/30 focus-visible:ring-0 outline-none w-full"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input 
                          placeholder="Credits" 
                          value={course.credits}
                          onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                          className="bg-foreground/5 border-foreground/10 text-foreground text-center text-[11px] font-bold rounded-xl h-12 transition-all focus:border-primary/50"
                        />
                      </div>
                      <div className="col-span-2">
                        <select
                          value={course.grade}
                          onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                          className="w-full h-12 rounded-xl text-center text-[11px] font-bold uppercase transition-all cursor-pointer bg-foreground/5 border border-foreground/10 text-foreground outline-none appearance-none px-3"
                        >
                          <option value="" className="bg-background text-foreground">Grade</option>
                          {['A+','A','A-','B+','B','B-','C+','C','C-','D+','D','F'].map(g => (
                            <option key={g} value={g} className="bg-background text-foreground">{g}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-1 flex justify-center">
                        <button 
                          onClick={() => removeCourse(course.id)}
                          className="text-foreground/20 hover:text-primary transition-colors p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                <Button 
                  onClick={addCourse}
                  variant="outline" 
                  className="w-full h-16 rounded-[1.5rem] glass border-white/5 hover:bg-white/5 text-white/40 border-dashed border-2 flex items-center gap-3 group text-[10px] font-bold tracking-[0.2em]"
                >
                  <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> APPEND SIMULATION PARAMETER
                </Button>
              </motion.div>
            </div>
          </div>
        </ThreeDCard>
      </GlowingBorder>
    </ScrollReveal>
  );
}

function FeedbackForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const db = useFirestore();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setLoading(true);

    try {
      addDoc(collection(db, 'support'), {
        email,
        message,
        timestamp: serverTimestamp(),
      })
      .catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: '/support',
          operation: 'create',
          requestResourceData: { email, message },
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
      
      toast({
        title: "Link Established",
        description: "Payload transmitted to Nexora Core successfully.",
      });
      setEmail('');
      setMessage('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Transmission Failed",
        description: "Anomalous link detected. Please retry sync.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollReveal direction="right">
      <GlowingBorder borderRadius="rounded-[3.5rem]">
        <ThreeDCard glowColor="rgba(41, 141, 255, 0.15)">
          <div 
            className="glass p-12 md:p-16 rounded-[3.5rem] border-white/5 flex flex-col gap-10 relative overflow-hidden group bg-slate-950/40 text-left"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 blur-[80px] rounded-full pointer-events-none" />
            
            <div className="flex items-center gap-5">
              <MessageSquare className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold tracking-tight text-white">System Feedback</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 px-2">Identifier</label>
                <Input 
                  type="email" 
                  placeholder="student_id@iit.io" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border-white/10 rounded-2xl h-16 px-8 text-sm focus-visible:ring-primary/20 transition-all"
                  required
                />
              </div>
              
              <div className="flex flex-col gap-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 px-2">Data Payload</label>
                <Textarea 
                  placeholder="Document system feedback or share academic insights..." 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="bg-white/5 border-white/10 rounded-[2rem] min-h-[180px] p-8 text-sm focus-visible:ring-primary/20 transition-all resize-none leading-relaxed"
                  required
                />
              </div>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-18 py-8 rounded-full bg-primary hover:bg-orange-600 text-white border-none font-bold text-[11px] tracking-widest shadow-2xl shadow-primary/20 flex items-center gap-4 group"
                >
                  {loading ? "TRANSMITTING..." : "TRANSMIT FEEDBACK"} 
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </motion.div>
            </form>
          </div>
        </ThreeDCard>
      </GlowingBorder>
    </ScrollReveal>
  );
}

function SupportContact({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.05, backgroundColor: 'var(--accent)' }}
      className="flex items-center gap-8 p-8 rounded-[2.5rem] glass border-foreground/10 transition-all group"
    >
      <div className="w-14 h-14 rounded-2xl bg-foreground/5 flex items-center justify-center text-foreground/35 group-hover:text-primary group-hover:scale-110 transition-all shrink-0">
        {icon}
      </div>
      <div className="flex flex-col gap-1 text-left">
        <span className="text-[10px] font-bold text-foreground/30 uppercase tracking-[0.3em]">{label}</span>
        <span className="text-xl font-semibold text-foreground/80 group-hover:text-foreground transition-colors">{value}</span>
      </div>
    </motion.div>
  );
}

function TimelineItem({ step, title, description, points }: { step: string, title: string, description: string, points: string[] }) {
  return (
    <ScrollReveal direction="up">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start glass border border-foreground/10 p-8 md:p-12 rounded-[2.5rem] hover:border-primary/20 transition-all duration-300">
        <div className="md:col-span-4 flex flex-col items-start gap-1 text-left">
          <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">{step}</span>
          <h3 className="text-xl font-black text-foreground mt-1">{title}</h3>
        </div>
        <div className="md:col-span-5 text-left text-foreground/60 dark:text-white/40 text-sm font-medium leading-relaxed">
          {description}
        </div>
        <div className="md:col-span-3 flex flex-col gap-2 items-start text-left md:pl-6 border-t md:border-t-0 md:border-l border-foreground/10 pt-4 md:pt-0">
          {points.map((pt, i) => (
             <div key={i} className="flex items-center gap-3">
               <div className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
               <span className="text-[9px] font-bold text-foreground/40 dark:text-white/40 uppercase tracking-widest">{pt}</span>
             </div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}


