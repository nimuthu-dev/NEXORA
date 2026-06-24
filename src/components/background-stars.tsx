'use client';

import { useEffect, useState } from 'react';
import { 
  GraduationCap, 
  Book, 
  Code, 
  Brain, 
  Atom,
  Cpu,
  Variable,
  Layers,
  Terminal,
  Binary
} from 'lucide-react';

export function BackgroundStars() {
  const [mounted, setMounted] = useState(false);
  const [stars, setStars] = useState<{ id: number; top: string; left: string; size: string; delay: string; duration: string; depth: number }[]>([]);
  const [academicAssets, setAcademicAssets] = useState<{ id: number; top: string; left: string; icon: any; size: number; delay: string; duration: string; depth: number }[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setMounted(true);

    // Detect initial theme
    const checkTheme = () => {
      setTheme(document.documentElement.classList.contains('light') ? 'light' : 'dark');
    };
    checkTheme();

    // Watch for theme class changes on <html>
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    // Twinkling Stars
    const newStars = Array.from({ length: 280 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 2.2 + 0.5}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 6 + 4}s`,
      depth: Math.floor(Math.random() * 8) + 1
    }));
    setStars(newStars);

    // Academic floating icons
    const iconPool = [GraduationCap, Book, Code, Brain, Atom, Cpu, Variable, Layers, Terminal, Binary];
    const newAssets = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      icon: iconPool[i % iconPool.length],
      size: Math.random() * 20 + 20,
      delay: `${Math.random() * -40}s`,
      duration: `${Math.random() * 40 + 30}s`,
      depth: Math.random() * 2 + 0.5
    }));
    setAcademicAssets(newAssets);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

  if (!mounted) return null;

  const isLight = theme === 'light';

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-500"
      style={{ background: isLight ? 'hsl(210 20% 97%)' : '#000508' }}
    >
      <style>{`
        @keyframes flow {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(1deg) skewX(0.5deg); }
        }
        @keyframes drift-1 {
          0% { transform: translate(100px, -20px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translate(500px, 350px) rotate(360deg); opacity: 0; }
        }
        @keyframes drift-2 {
          0% { transform: translate(450px, -20px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { transform: translate(850px, 350px) rotate(180deg); opacity: 0; }
        }
        @keyframes drift-3 {
          0% { transform: translate(850px, -20px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.8; }
          90% { opacity: 0.8; }
          100% { transform: translate(1250px, 350px) rotate(450deg); opacity: 0; }
        }
        @keyframes drift-4 {
          0% { transform: translate(250px, -20px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translate(650px, 350px) rotate(270deg); opacity: 0; }
        }
        @keyframes drift-5 {
          0% { transform: translate(1050px, -20px) rotate(0deg); opacity: 0; }
          10% { opacity: 0.75; }
          90% { opacity: 0.75; }
          100% { transform: translate(1380px, 350px) rotate(320deg); opacity: 0; }
        }
        @keyframes branch-sway-left {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(2deg) scale(1.01); }
        }
        @keyframes branch-sway-right {
          0%, 100% { transform: scaleX(-1) rotate(0deg); }
          50% { transform: scaleX(-1) rotate(2deg) scale(1.01); }
        }
        .animate-flow {
          animation: flow 8s linear infinite;
        }
        .animate-flow-slow {
          animation: flow 12s linear infinite;
        }
        .animate-sway {
          animation: sway 6s ease-in-out infinite;
        }
        .animate-branch-sway-left {
          animation: branch-sway-left 10s ease-in-out infinite;
        }
        .animate-branch-sway-right {
          animation: branch-sway-right 12s ease-in-out infinite;
        }
        .animate-petal-1 { animation: drift-1 14s linear infinite; }
        .animate-petal-2 { animation: drift-2 18s linear infinite; }
        .animate-petal-3 { animation: drift-3 12s linear infinite; }
        .animate-petal-4 { animation: drift-4 16s linear infinite; }
        .animate-petal-5 { animation: drift-5 15s linear infinite; }
      `}</style>

      {/* Atmosphere blobs */}
      <div 
        className="absolute inset-0 opacity-60 transition-transform duration-1000 ease-out"
        style={{ 
          background: isLight
            ? `radial-gradient(circle at 20% 20%, rgba(41,141,255,0.10) 0%, transparent 60%),
               radial-gradient(circle at 80% 80%, rgba(41,141,255,0.08) 0%, transparent 70%)`
            : `radial-gradient(circle at 20% 20%, rgba(41,141,255,0.08) 0%, transparent 60%),
               radial-gradient(circle at 80% 80%, rgba(0,82,212,0.15) 0%, transparent 70%),
               radial-gradient(circle at 50% 50%, rgba(0,0,0,1) 0%, transparent 100%)`,
          transform: `translate(${(mousePos.x - window.innerWidth / 2) * 0.015}px, ${(mousePos.y - window.innerHeight / 2) * 0.015}px)` 
        }}
      />
      
      {/* Subtle grid */}
      <div className="absolute inset-0" style={{
        opacity: isLight ? 0.04 : 0.05,
        backgroundImage: isLight
          ? `linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px),
             linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px)`
          : `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
             linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)`,
        backgroundSize: '100px 100px',
        transform: `translate(${(mousePos.x - window.innerWidth / 2) * 0.008}px, ${(mousePos.y - window.innerHeight / 2) * 0.008}px)`
      }} />

      {/* Stars — twinkle in dark mode */}
      {!isLight && stars.map((star) => (
        <div
          key={star.id}
          className="absolute bg-white rounded-full animate-twinkle"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            opacity: 0.4,
            boxShadow: '0 0 6px rgba(255,255,255,0.4)',
            animationDelay: star.delay,
            animationDuration: star.duration,
            transform: `translate(${(mousePos.x - window.innerWidth / 2) * (star.depth * 0.008)}px, ${(mousePos.y - window.innerHeight / 2) * (star.depth * 0.008)}px)`
          }}
        />
      ))}

      {/* Floating academic icons */}
      {academicAssets.map((asset) => (
        <div
          key={asset.id}
          className="absolute animate-float-slow select-none transition-all"
          style={{
            top: asset.top,
            left: asset.left,
            opacity: isLight ? 0.05 : 0.08,
            color: isLight ? '#298DFF' : 'white',
            animationDelay: asset.delay,
            animationDuration: asset.duration,
            transform: `translate(${(mousePos.x - window.innerWidth / 2) * (asset.depth * 0.02)}px, ${(mousePos.y - window.innerHeight / 2) * (asset.depth * 0.02)}px)`
          }}
        >
          <asset.icon size={asset.size} strokeWidth={1} />
        </div>
      ))}

      {/* Animated Low-Poly Landscape with Cherry Blossoms */}
      {true && (
        <>
          {/* Organic Cherry Blossom Branches */}
          <div 
            className="fixed left-0 top-0 w-[240px] h-[340px] md:w-[280px] md:h-[400px] lg:w-[350px] lg:h-[500px] z-10 pointer-events-none hidden md:block"
            style={{ transform: `translateY(${-scrollY * 0.15}px)` }}
          >
            <div className="w-full h-full origin-top-left animate-branch-sway-left">
              <svg viewBox="0 0 300 450" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="pink-petal-grad" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#ffccd5" />
                    <stop offset="70%" stopColor="#ffb3c1" />
                    <stop offset="100%" stopColor="#ff85a1" />
                  </linearGradient>
                </defs>
                {/* Main Branch Path */}
                <path d="M -10,-10 C 80,40 140,90 180,160 C 200,200 170,260 210,310 C 230,330 260,350 290,340" fill="none" stroke="#3d2314" strokeWidth="7" strokeLinecap="round" />
                {/* Secondary Branch 1 */}
                <path d="M 60,25 C 100,65 110,120 90,160" fill="none" stroke="#3d2314" strokeWidth="4.5" strokeLinecap="round" />
                {/* Secondary Branch 2 */}
                <path d="M 130,80 C 170,90 200,75 220,95" fill="none" stroke="#3d2314" strokeWidth="3.5" strokeLinecap="round" />
                {/* Secondary Branch 3 */}
                <path d="M 180,180 C 220,200 240,185 260,200" fill="none" stroke="#3d2314" strokeWidth="3" strokeLinecap="round" />
                
                {/* Leaves */}
                <OrganicLeaf x={40} y={30} scale={0.8} rotation={20} />
                <OrganicLeaf x={90} y={60} scale={0.7} rotation={-45} />
                <OrganicLeaf x={150} y={110} scale={0.9} rotation={60} />
                <OrganicLeaf x={200} y={150} scale={0.8} rotation={15} />
                <OrganicLeaf x={240} y={200} scale={0.75} rotation={-30} />
                
                {/* Flower Buds */}
                <OrganicBud x={70} y={120} scale={0.85} rotation={10} />
                <OrganicBud x={110} y={150} scale={0.8} rotation={135} />
                <OrganicBud x={220} y={80} scale={0.9} rotation={45} />
                <OrganicBud x={250} y={230} scale={0.8} rotation={-60} />

                {/* Flowers along the branches */}
                <OrganicFlower x={50} y={25} scale={0.75} rotation={12} />
                <OrganicFlower x={80} y={45} scale={0.9} rotation={45} />
                <OrganicFlower x={110} y={75} scale={1.1} rotation={120} />
                <OrganicFlower x={145} y={105} scale={1.0} rotation={200} />
                <OrganicFlower x={180} y={160} scale={1.2} rotation={35} />
                <OrganicFlower x={190} y={220} scale={0.95} rotation={80} />
                <OrganicFlower x={210} y={280} scale={1.05} rotation={150} />
                <OrganicFlower x={250} y={320} scale={0.9} rotation={220} />
                <OrganicFlower x={280} y={340} scale={0.8} rotation={10} />
                
                {/* Clustered flowers off-branch */}
                <OrganicFlower x={95} y={100} scale={0.85} rotation={55} />
                <OrganicFlower x={160} y={85} scale={0.95} rotation={15} />
                <OrganicFlower x={215} y={190} scale={1.0} rotation={95} />
                <OrganicFlower x={240} y={160} scale={0.8} rotation={260} />
              </svg>
            </div>
          </div>

          <div 
            className="fixed right-0 top-0 w-[240px] h-[340px] md:w-[280px] md:h-[400px] lg:w-[350px] lg:h-[500px] z-10 pointer-events-none hidden md:block"
            style={{ transform: `translateY(${-scrollY * 0.15}px)` }}
          >
            <div className="w-full h-full origin-top-right scale-x-[-1] animate-branch-sway-right">
              <svg viewBox="0 0 300 450" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Main Branch Path */}
                <path d="M -10,-10 C 80,40 140,90 180,160 C 200,200 170,260 210,310 C 230,330 260,350 290,340" fill="none" stroke="#3d2314" strokeWidth="7" strokeLinecap="round" />
                {/* Secondary Branch 1 */}
                <path d="M 60,25 C 100,65 110,120 90,160" fill="none" stroke="#3d2314" strokeWidth="4.5" strokeLinecap="round" />
                {/* Secondary Branch 2 */}
                <path d="M 130,80 C 170,90 200,75 220,95" fill="none" stroke="#3d2314" strokeWidth="3.5" strokeLinecap="round" />
                {/* Secondary Branch 3 */}
                <path d="M 180,180 C 220,200 240,185 260,200" fill="none" stroke="#3d2314" strokeWidth="3" strokeLinecap="round" />
                
                {/* Leaves */}
                <OrganicLeaf x={40} y={30} scale={0.8} rotation={20} />
                <OrganicLeaf x={90} y={60} scale={0.7} rotation={-45} />
                <OrganicLeaf x={150} y={110} scale={0.9} rotation={60} />
                <OrganicLeaf x={200} y={150} scale={0.8} rotation={15} />
                <OrganicLeaf x={240} y={200} scale={0.75} rotation={-30} />
                
                {/* Flower Buds */}
                <OrganicBud x={70} y={120} scale={0.85} rotation={10} />
                <OrganicBud x={110} y={150} scale={0.8} rotation={135} />
                <OrganicBud x={220} y={80} scale={0.9} rotation={45} />
                <OrganicBud x={250} y={230} scale={0.8} rotation={-60} />

                {/* Flowers along the branches */}
                <OrganicFlower x={50} y={25} scale={0.75} rotation={12} />
                <OrganicFlower x={80} y={45} scale={0.9} rotation={45} />
                <OrganicFlower x={110} y={75} scale={1.1} rotation={120} />
                <OrganicFlower x={145} y={105} scale={1.0} rotation={200} />
                <OrganicFlower x={180} y={160} scale={1.2} rotation={35} />
                <OrganicFlower x={190} y={220} scale={0.95} rotation={80} />
                <OrganicFlower x={210} y={280} scale={1.05} rotation={150} />
                <OrganicFlower x={250} y={320} scale={0.9} rotation={220} />
                <OrganicFlower x={280} y={340} scale={0.8} rotation={10} />
                
                {/* Clustered flowers off-branch */}
                <OrganicFlower x={95} y={100} scale={0.85} rotation={55} />
                <OrganicFlower x={160} y={85} scale={0.95} rotation={15} />
                <OrganicFlower x={215} y={190} scale={1.0} rotation={95} />
                <OrganicFlower x={240} y={160} scale={0.8} rotation={260} />
              </svg>
            </div>
          </div>

          {/* Mountains & Cherry Trees Horizon Landscape */}
          <div 
            className="absolute bottom-0 left-0 w-full z-10 pointer-events-none select-none"
            style={{ transform: `translateY(${scrollY * 0.18}px)` }}
          >
            <svg 
              viewBox="0 0 1440 400" 
              width="100%" 
              height="100%" 
              preserveAspectRatio="none"
              className="w-full h-[250px] md:h-[350px]"
              xmlns="http://www.w3.org/2000/svg"
            >
            {/* Low-Poly Mountains */}
            <polygon points="-50,400 300,120 700,400" fill={isLight ? "#bde0fe" : "#1e293b"} opacity={isLight ? 0.4 : 0.25} />
            <polygon points="300,120 300,400 700,400" fill={isLight ? "#a2d2ff" : "#0f172a"} opacity={isLight ? 0.4 : 0.25} />

            <polygon points="750,400 1150,140 1550,400" fill={isLight ? "#bde0fe" : "#1e293b"} opacity={isLight ? 0.4 : 0.25} />
            <polygon points="1150,140 1150,400 1550,400" fill={isLight ? "#a2d2ff" : "#0f172a"} opacity={isLight ? 0.4 : 0.25} />

            {/* Mid Hills */}
            <polygon points="80,400 450,200 820,400" fill={isLight ? "#a7c957" : "#0f2d1f"} />
            <polygon points="450,200 450,400 820,400" fill={isLight ? "#94b746" : "#0a2216"} />

            <polygon points="550,400 980,180 1380,400" fill={isLight ? "#8bc34a" : "#0e3a24"} />
            <polygon points="980,180 980,400 1380,400" fill={isLight ? "#7cb342" : "#092f1b"} />

            {/* Foreground Hills */}
            <polygon points="-100,400 280,260 700,400" fill={isLight ? "#6a994e" : "#072c1a"} />
            <polygon points="280,260 280,400 700,400" fill={isLight ? "#58813f" : "#051f12"} />

            <polygon points="700,400 1120,270 1550,400" fill={isLight ? "#38b000" : "#0a361e"} opacity={isLight ? 0.85 : 0.7} />
            <polygon points="1120,270 1120,400 1550,400" fill={isLight ? "#008000" : "#062714"} opacity={isLight ? 0.85 : 0.7} />

            {/* River */}
            <River isLight={isLight} />

            {/* Green Pine Trees */}
            <PineTree x={80} y={350} scale={0.4} delay="1.2s" isLight={isLight} />
            <PineTree x={120} y={330} scale={0.65} delay="0s" isLight={isLight} />
            <PineTree x={150} y={365} scale={0.5} delay="2.5s" isLight={isLight} />
            
            <PineTree x={1270} y={335} scale={0.6} delay="0.3s" isLight={isLight} />
            <PineTree x={1330} y={375} scale={0.8} delay="1.5s" isLight={isLight} />
            <PineTree x={1390} y={390} scale={0.7} delay="2.8s" isLight={isLight} />

            {/* Cherry Blossom Trees (Sakura) - Placed Left and Right */}
            {/* Left cherry blossoms */}
            <CherryTree x={190} y={350} scale={0.7} delay="0.5s" isLight={isLight} />
            <CherryTree x={240} y={380} scale={0.95} delay="1.4s" isLight={isLight} />

            {/* Right cherry blossoms */}
            <CherryTree x={1140} y={350} scale={0.75} delay="0.8s" isLight={isLight} />
            <CherryTree x={1200} y={370} scale={0.9} delay="2s" isLight={isLight} />

            {/* Bushes near river */}
            <Bush x={510} y={385} scale={0.7} delay="0.5s" isLight={isLight} />
            <Bush x={545} y={400} scale={0.9} delay="1.4s" isLight={isLight} />
            <Bush x={885} y={375} scale={0.75} delay="2.2s" isLight={isLight} />
            <Bush x={925} y={395} scale={0.9} delay="0.8s" isLight={isLight} />

            {/* Floating Cherry Blossom Petals inside the SVG */}
            <g opacity="0.85">
              <path d="M 0,0 C -2,-4 2,-8 4,-6 C 5,-2 3,2 0,0" fill="#ffccd5" className="animate-petal-1" />
              <path d="M 0,0 C -2,-4 2,-8 4,-6 C 5,-2 3,2 0,0" fill="#ffb3c1" className="animate-petal-2" />
              <path d="M 0,0 C -2,-4 2,-8 4,-6 C 5,-2 3,2 0,0" fill="#ff85a1" className="animate-petal-3" />
              <path d="M 0,0 C -2,-4 2,-8 4,-6 C 5,-2 3,2 0,0" fill="#ffccd5" className="animate-petal-4" />
              <path d="M 0,0 C -2,-4 2,-8 4,-6 C 5,-2 3,2 0,0" fill="#ffb3c1" className="animate-petal-5" />
            </g>
            </svg>
          </div>
        </>
      )}
    </div>
  );
}

// Low-poly rendering helper components
function PineTree({ x, y, scale = 1, delay = '0s', isLight = true }: { x: number; y: number; scale?: number; delay?: string; isLight?: boolean }) {
  const bottomFill = isLight ? "#2d6a4f" : "#0d2617";
  const bottomShadow = isLight ? "#1b4332" : "#07170e";
  const midFill = isLight ? "#40916c" : "#143a24";
  const midShadow = isLight ? "#2d6a4f" : "#0d2617";
  const topFill = isLight ? "#52b788" : "#1a4e32";
  const topShadow = isLight ? "#40916c" : "#143a24";

  return (
    <g 
      transform={`translate(${x}, ${y}) scale(${scale})`} 
      className="origin-bottom animate-sway"
      style={{ animationDelay: delay }}
    >
      {/* Trunk */}
      <polygon points="-6,0 6,0 4,-35 -4,-35" fill="#5c4033" />
      <polygon points="-4,-35 0,-35 0,0 -6,0" fill="#4d3227" />
      
      {/* Bottom tier */}
      <polygon points="-35,-35 35,-35 0,-75" fill={bottomFill} />
      <polygon points="-35,-35 0,-35 0,-75" fill={bottomShadow} />

      {/* Middle tier */}
      <polygon points="-28,-65 28,-65 0,-100" fill={midFill} />
      <polygon points="-28,-65 0,-65 0,-100" fill={midShadow} />

      {/* Top tier */}
      <polygon points="-20,-90 20,-90 0,-120" fill={topFill} />
      <polygon points="-20,-90 0,-90 0,-120" fill={topShadow} />
    </g>
  );
}

function CherryTree({ x, y, scale = 1, delay = '0s', isLight = true }: { x: number; y: number; scale?: number; delay?: string; isLight?: boolean }) {
  const cluster1 = isLight ? "#ffccd5" : "#d8bbff";
  const cluster2 = isLight ? "#ffb3c1" : "#c8b6ff";
  const cluster3 = isLight ? "#ff85a1" : "#e8c5e5";
  const highlight = isLight ? "#fff0f3" : "#f1c0e8";

  return (
    <g 
      transform={`translate(${x}, ${y}) scale(${scale})`} 
      className="origin-bottom animate-sway"
      style={{ animationDelay: delay }}
    >
      {/* Trunk */}
      <polygon points="-5,0 5,0 3,-30 -3,-30" fill="#5c4033" />
      <polygon points="-3,-30 0,-30 0,0 -5,0" fill="#4d3227" />
      
      {/* Branches */}
      <polygon points="-3,-25 -12,-38 -8,-40 -1,-28" fill="#5c4033" />
      <polygon points="3,-25 12,-38 8,-40 1,-28" fill="#5c4033" />

      {/* Blossom Clusters */}
      {/* Left cluster */}
      <polygon points="-30,-35 -10,-55 -5,-30" fill={cluster1} />
      <polygon points="-30,-35 -20,-20 -5,-30" fill={cluster2} />
      
      {/* Right cluster */}
      <polygon points="5,-30 10,-55 30,-35" fill={cluster1} />
      <polygon points="5,-30 20,-20 30,-35" fill={cluster2} />

      {/* Center cluster */}
      <polygon points="-20,-45 0,-70 20,-45" fill={cluster2} />
      <polygon points="-20,-45 0,-40 20,-45" fill={cluster3} />
      
      {/* Highlights */}
      <polygon points="-10,-60 0,-75 10,-60" fill={highlight} />
    </g>
  );
}

function Bush({ x, y, scale = 1, delay = '0s', isLight = true }: { x: number; y: number; scale?: number; delay?: string; isLight?: boolean }) {
  const foliage1 = isLight ? "#74c69d" : "#123c23";
  const foliage2 = isLight ? "#52b788" : "#0a2616";
  const highlight1 = isLight ? "#95d5b2" : "#1d5835";
  const highlight2 = isLight ? "#74c69d" : "#123c23";

  return (
    <g 
      transform={`translate(${x}, ${y}) scale(${scale})`}
      className="origin-bottom animate-sway"
      style={{ animationDelay: delay }}
    >
      {/* Trunk */}
      <polygon points="-4,0 4,0 2,-20 -2,-20" fill="#5c4033" />
      
      {/* Foliage */}
      <polygon points="-25,-20 25,-20 0,-45" fill={foliage1} />
      <polygon points="-25,-20 0,-20 0,-45" fill={foliage2} />
      
      <polygon points="-15,-35 15,-35 0,-60" fill={highlight1} />
      <polygon points="-15,-35 0,-35 0,-60" fill={highlight2} />
    </g>
  );
}

function River({ isLight = true }: { isLight?: boolean }) {
  const bed = isLight ? "#52b3e5" : "#0d3c5c";
  const shadow = isLight ? "#3a86c8" : "#07263d";
  const flowColor1 = isLight ? "#ffffff" : "#4ffbdf"; 
  const flowColor2 = isLight ? "#e0f2fe" : "#b0efff"; 

  return (
    <g>
      {/* Base River Bed */}
      <path 
        d="M 680,180 Q 640,240 730,290 T 580,400 L 850,400 Q 880,320 830,270 T 730,180 Z" 
        fill={bed} 
      />
      {/* Left shadow of river */}
      <path 
        d="M 680,180 Q 640,240 730,290 T 580,400 L 615,400 Q 750,300 660,240 T 690,180 Z" 
        fill={shadow} 
        opacity="0.3"
      />
      {/* Flow lines */}
      <path 
        d="M 690,190 Q 650,245 725,295 T 600,395" 
        fill="none" 
        stroke={flowColor1} 
        strokeWidth="2" 
        strokeDasharray="15 30" 
        className="animate-flow" 
      />
      <path 
        d="M 710,210 Q 675,255 745,305 T 630,395" 
        fill="none" 
        stroke={flowColor2} 
        strokeWidth="1.5" 
        strokeDasharray="10 25" 
        className="animate-flow-slow" 
      />
    </g>
  );
}

// Organic Cherry Blossom SVG Helper Components
function OrganicFlower({ x, y, scale = 1, rotation = 0, opacity = 1, fillGrad = 'url(#pink-petal-grad)' }: { x: number; y: number; scale?: number; rotation?: number; opacity?: number; fillGrad?: string }) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`} opacity={opacity}>
      {/* 5 Petals */}
      <path d="M0,0 C-10,-15 -5,-25 0,-24 C5,-25 10,-15 0,0" fill={fillGrad} />
      <path d="M0,0 C12,-14 21,-7 19,-2 C17,3 9,15 0,0" fill={fillGrad} transform="rotate(72)" />
      <path d="M0,0 C20,3 23,14 18,17 C13,20 1,17 0,0" fill={fillGrad} transform="rotate(144)" />
      <path d="M0,0 C-2,20 -13,21 -17,16 C-21,11 -12,1 0,0" fill={fillGrad} transform="rotate(216)" />
      <path d="M0,0 C-20,0 -21,-12 -16,-16 C-11,-20 -1,-10 0,0" fill={fillGrad} transform="rotate(288)" />
      
      {/* Flower Center pistil details */}
      <circle cx="0" cy="0" r="3.5" fill="#f87171" />
      
      {/* Stamens radiating from center */}
      <line x1="0" y1="0" x2="0" y2="-6" stroke="#fbbf24" strokeWidth="0.8" />
      <line x1="0" y1="0" x2="5.7" y2="-1.8" stroke="#fbbf24" strokeWidth="0.8" />
      <line x1="0" y1="0" x2="3.5" y2="4.8" stroke="#fbbf24" strokeWidth="0.8" />
      <line x1="0" y1="0" x2="-3.5" y2="4.8" stroke="#fbbf24" strokeWidth="0.8" />
      <line x1="0" y1="0" x2="-5.7" y2="-1.8" stroke="#fbbf24" strokeWidth="0.8" />
      
      {/* Center dot */}
      <circle cx="0" cy="0" r="1.5" fill="#f59e0b" />
    </g>
  );
}

function OrganicBud({ x, y, scale = 1, rotation = 0 }: { x: number; y: number; scale?: number; rotation?: number }) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
      {/* Bud stem */}
      <path d="M0,10 C0,5 3,2 5,0" fill="none" stroke="#3d2314" strokeWidth="1.5" />
      {/* Bud sepals */}
      <path d="M5,0 C2,-3 1,-7 3,-9 C5,-11 7,-9 5,0" fill="#556b2f" />
      {/* Bud petals */}
      <path d="M5,-2 C4,-6 5,-12 7,-13 C9,-14 10,-9 5,-2" fill="#ff85a1" />
      <path d="M5,-2 C6,-5 9,-10 10,-10 C11,-10 9,-6 5,-2" fill="#ffccd5" />
    </g>
  );
}

function OrganicLeaf({ x, y, scale = 1, rotation = 0 }: { x: number; y: number; scale?: number; rotation?: number }) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation}) scale(${scale})`}>
      {/* Leaf blade */}
      <path d="M0,0 C10,-5 20,-2 25,5 C15,10 5,8 0,0" fill="#6b8e23" opacity="0.9" />
      <path d="M0,0 C10,-3 15,-1 25,5" fill="none" stroke="#556b2f" strokeWidth="0.8" />
    </g>
  );
}
