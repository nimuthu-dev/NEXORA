
"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Library, 
  Target, 
  Bot, 
  BarChart3, 
  ListTodo, 
  Trophy,
  Search,
  Settings,
  LogOut,
  Palette,
  ChevronLeft
} from "lucide-react"
import { useState, useEffect } from "react"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/firebase"
import { signOut } from "firebase/auth"

const menuItems = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Resources", icon: Library, href: "/resources" },
  { label: "Mock Arena", icon: Target, href: "/mock-arena" },
  { label: "Nexora AI", icon: Bot, href: "/ai" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
  { label: "Assignments", icon: ListTodo, href: "/assignments" },
  { label: "Leaderboard", icon: Trophy, href: "/leaderboard" },
]

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const safeGetItem = (key: string): string | null => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorage.getItem(key);
    }
  } catch (e) {
    console.warn("localStorage read blocked:", e);
  }
  return null;
};

const safeSetItem = (key: string, value: string) => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.setItem(key, value);
    }
  } catch (e) {
    console.warn("localStorage write blocked:", e);
  }
};

const safeRemoveItem = (key: string) => {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      localStorage.removeItem(key);
    }
  } catch (e) {
    console.warn("localStorage delete blocked:", e);
  }
};

export function DashboardSidebar({ isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const auth = useAuth()
  const [theme, setTheme] = useState<'default' | 'nebula' | 'supernova'>('default')
  const [degree, setDegree] = useState<string>('cs')
  const [year, setYear] = useState<string>('1')
  const [semester, setSemester] = useState<string>('1')
  
  const iitLogo = PlaceHolderImages.find(img => img.id === 'iit-logo');

  useEffect(() => {
    const savedTheme = safeGetItem('nexora-theme') as any
    const savedDegree = safeGetItem('nexora-degree')
    const savedYear = safeGetItem('nexora-year')
    const savedSemester = safeGetItem('nexora-semester')
    
    if (savedTheme) setTheme(savedTheme)
    if (savedDegree) setDegree(savedDegree)
    if (savedYear) setYear(savedYear)
    if (savedSemester) setSemester(savedSemester)

    const handleProfileChange = () => {
      setDegree(safeGetItem('nexora-degree') || 'cs')
      setYear(safeGetItem('nexora-year') || '1')
      setSemester(safeGetItem('nexora-semester') || '1')
    }

    window.addEventListener('profile-change', handleProfileChange)
    return () => window.removeEventListener('profile-change', handleProfileChange)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    safeSetItem('nexora-theme', theme)
  }, [theme])

  const updateProfile = (key: string, value: string) => {
    safeSetItem(key, value)
    window.dispatchEvent(new Event('profile-change'))
    
    if (key === 'nexora-degree') setDegree(value)
    if (key === 'nexora-year') setYear(value)
    if (key === 'nexora-semester') setSemester(value)
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      // Clear onboarding status but keep academic preferences if desired
      // We clear nexora-onboarded to ensure the next login flow is fresh
      safeRemoveItem('nexora-onboarded')
      router.push('/')
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.aside 
          initial={{ x: -288 }}
          animate={{ x: 0 }}
          exit={{ x: -288 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed left-0 top-0 h-screen w-72 glass border-r border-white/5 p-6 flex flex-col gap-6 z-[100] overflow-hidden shadow-[20px_0_50px_rgba(0,0,0,0.5)]"
        >
          <div className="flex items-center justify-between mb-2">
            <Link href="/" className="flex items-center gap-3 px-2 group">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative w-10 h-10 rounded-xl overflow-hidden transition-transform"
              >
                {iitLogo && (
                  <Image 
                    src={iitLogo.imageUrl} 
                    alt="IIT Logo" 
                    fill 
                    className="object-cover" 
                    data-ai-hint={iitLogo.imageHint}
                  />
                )}
              </motion.div>
              <span className="text-2xl font-black tracking-tighter group-hover:text-primary transition-colors">NEXORA</span>
            </Link>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-white/5 opacity-40 hover:opacity-100 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>

          <div className="px-2 flex flex-col gap-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Academic Profile</p>
            
            <div className="flex flex-col gap-2">
              <Select value={degree} onValueChange={(v) => updateProfile('nexora-degree', v)}>
                <SelectTrigger className="w-full bg-white/5 border-white/5 rounded-xl h-9 text-[9px] font-bold uppercase tracking-tight">
                  <SelectValue placeholder="Degree" />
                </SelectTrigger>
                <SelectContent className="glass border-white/10 rounded-xl">
                  <SelectItem value="cs" className="text-[10px] font-bold uppercase">BSc (Hons) CS</SelectItem>
                  <SelectItem value="se" className="text-[10px] font-bold uppercase">BSc (Eng) SE</SelectItem>
                  <SelectItem value="aids" className="text-[10px] font-bold uppercase">BSc (Hons) AI & DS</SelectItem>
                </SelectContent>
              </Select>

              <div className="grid grid-cols-2 gap-2">
                <Select value={year} onValueChange={(v) => updateProfile('nexora-year', v)}>
                  <SelectTrigger className="w-full bg-white/5 border-white/5 rounded-xl h-9 text-[9px] font-bold uppercase tracking-tight">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/10 rounded-xl">
                    {['1', '2', '3', '4'].map(y => (
                      <SelectItem key={y} value={y} className="text-[10px] font-bold">YEAR {y}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={semester} onValueChange={(v) => updateProfile('nexora-semester', v)}>
                  <SelectTrigger className="w-full bg-white/5 border-white/5 rounded-xl h-9 text-[9px] font-bold uppercase tracking-tight">
                    <SelectValue placeholder="Sem" />
                  </SelectTrigger>
                  <SelectContent className="glass border-white/10 rounded-xl">
                    {['1', '2'].map(s => (
                      <SelectItem key={s} value={s} className="text-[10px] font-bold">SEM {s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              placeholder="Command + K" 
              className="w-full bg-white/5 border border-white/5 rounded-2xl py-2 pl-10 pr-4 text-sm outline-none focus:ring-1 focus:ring-primary transition-all"
            />
          </div>

          <nav className="flex-1 flex flex-col gap-1 overflow-y-auto scrollbar-hide">
            <p className="px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Menu</p>
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
              >
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all group",
                    pathname === item.href 
                      ? "bg-primary text-primary-foreground font-semibold shadow-xl shadow-primary/20" 
                      : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 transition-transform group-hover:scale-110", pathname === item.href ? "text-primary-foreground" : "text-muted-foreground")} />
                  <span className="text-sm">{item.label}</span>
                </motion.div>
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-white/5">
            <div className="px-2 mb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                <Palette className="w-3 h-3" /> Appearance
              </p>
              <div className="flex gap-2">
                <ThemeButton color="bg-blue-500" active={theme === 'default'} onClick={() => setTheme('default')} title="Deep Space" />
                <ThemeButton color="bg-purple-500" active={theme === 'nebula'} onClick={() => setTheme('nebula')} title="Nebula" />
                <ThemeButton color="bg-cyan-500" active={theme === 'supernova'} onClick={() => setTheme('supernova')} title="Supernova" />
              </div>
            </div>
            <Link href="/settings">
              <motion.div whileHover={{ x: 4 }} className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 text-muted-foreground transition-all">
                <Settings className="w-5 h-5" />
                <span className="text-sm">Settings</span>
              </motion.div>
            </Link>
            <motion.button 
              onClick={handleLogout}
              whileHover={{ x: 4 }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all w-full text-left"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm">Log Out</span>
            </motion.button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

function ThemeButton({ color, active, onClick, title }: any) {
  return (
    <motion.button 
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick} 
      className={cn("w-6 h-6 rounded-full border-2", color, active ? 'border-white' : 'border-transparent')} 
      title={title} 
    />
  )
}
