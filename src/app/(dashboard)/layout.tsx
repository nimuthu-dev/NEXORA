'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import dynamic from 'next/dynamic';
const NexoraSplash = dynamic(
  () => import('@/components/ui/NexoraSplash').then((mod) => mod.NexoraSplash),
  { ssr: false }
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [showSplash, setShowSplash] = useState(true);

  // Sync light/dark mode standard theme class
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme') || 'dark';
      if (savedTheme === 'light') {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      }
    } catch (e) {
      console.warn("Storage blocked:", e);
    }
  }, []);


  // Hide the sidebar and navigation completely during onboarding
  const isOnboarding = pathname === '/onboarding';

  if (isOnboarding) {
    return (
      <div className="min-h-screen bg-transparent">
        <main className="flex-1">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className={cn("flex min-h-screen bg-background relative", showSplash ? "overflow-hidden h-screen" : "")}>
      {/* Premium Cinema-Grade Splash Loader */}
      <AnimatePresence mode="wait">
        {showSplash && (
          <NexoraSplash onComplete={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      <main 
        className="flex-1 transition-all duration-500 ease-[0.16, 1, 0.3, 1] relative"
      >
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          animate={!showSplash ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="p-4 sm:p-6 md:p-10 max-w-[1600px] mx-auto"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
