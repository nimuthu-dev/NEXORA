"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sun, Moon } from "lucide-react"
import { useState, useEffect } from "react"
import { VisitorCounter } from "@/components/visitor-counter"
import { audioManager } from "@/components/landing/sound-controller";

export function Navbar() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
    const hasClass = document.documentElement.classList.contains('light');
    const initialTheme = savedTheme || (hasClass ? 'light' : 'dark');
    setTheme(initialTheme);
    
    if (initialTheme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/40 backdrop-blur-xl transition-colors duration-300">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-3 group"
          onMouseEnter={() => audioManager?.triggerTick()}
          onClick={() => audioManager?.triggerPop()}
        >
          <motion.div 
            whileHover={{ rotate: 5, scale: 1.05 }}
            className="relative w-10 h-10 flex items-center justify-center"
          >
            <svg 
              className="w-8 h-8 overflow-visible" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="nav-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#298DFF" />
                  <stop offset="100%" stopColor="#00C2FF" />
                </linearGradient>
              </defs>
              <path
                d="M30 75 V25 H40 L60 65 V25 H70 V75 H60 L40 35 V75 H30 Z"
                fill="url(#nav-logo-grad)"
              />
            </svg>
          </motion.div>
          <span className="text-2xl font-black tracking-tighter text-foreground">NEXORA</span>
        </Link>
        
        {/* Futuristic real-time visitor count */}
        <div className="hidden lg:flex items-center gap-6">
          <VisitorCounter />
        </div>

        <div className="flex items-center gap-4">
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => audioManager?.triggerTick()}
            onClick={() => {
              toggleTheme();
              audioManager?.triggerPop();
            }}
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-border bg-white/[0.02] dark:bg-white/[0.02] light:bg-black/[0.02] text-muted-foreground hover:text-foreground transition-all hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-black/10"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </motion.button>

          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => audioManager?.triggerTick()}
            onClick={() => audioManager?.triggerPop()}
          >
            <Button variant="outline" className="rounded-full px-8 h-11 text-[10px] font-black uppercase tracking-widest bg-background/50 border-border text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all shadow-lg" asChild>
              <Link href="/onboarding">Login</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </nav>
  )
}
