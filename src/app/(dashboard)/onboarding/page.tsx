"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff,
  GraduationCap,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Loader2,
  User
} from "lucide-react"
import { useAuth, useUser } from "@/firebase"
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from "firebase/auth"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

export default function OnboardingPage() {
  const router = useRouter()
  const auth = useAuth()
  const { user, loading: authLoading } = useUser()
  const { toast } = useToast()
  
  const [step, setStep] = useState<'login' | 'signup' | 'initialize' | 'phone'>('login')
  const [isInitializing, setIsInitializing] = useState(false)
  const [status, setStatus] = useState("Awaiting Parameters")
  const [isMounted, setIsMounted] = useState(false)

  // Profile States
  const [degree, setDegree] = useState("")
  const [year, setYear] = useState("")
  const [semester, setSemester] = useState("")

  // Auth States
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Phone Auth States
  const [phoneNumber, setPhoneNumber] = useState("+94")
  const [verificationCode, setVerificationCode] = useState("")
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const [otpSent, setOtpSent] = useState(false)
  const recaptchaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (user && !authLoading) {
      const isAlreadyOnboarded = localStorage.getItem('nexora-onboarded') === 'true'
      if (isAlreadyOnboarded) {
        router.push('/dashboard')
      } else {
        setStep('initialize')
      }
    }
  }, [user, authLoading, router])

  const setupRecaptcha = () => {
    if (!recaptchaRef.current) return
    if ((window as any).recaptchaVerifier) return
    
    try {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {}
      })
    } catch (error) {
      console.error("Recaptcha Setup Error:", error)
    }
  }

  const handlePhoneAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsInitializing(true)
    
    let formattedPhone = phoneNumber.trim()
    if (formattedPhone.startsWith('0')) {
      formattedPhone = '+94' + formattedPhone.substring(1)
    }
    
    if (!formattedPhone.startsWith('+')) {
      toast({ 
        variant: "destructive", 
        title: "Invalid Format", 
        description: "Please include country code (e.g., +94)." 
      })
      setIsInitializing(false)
      return
    }
    
    try {
      if (!otpSent) {
        setupRecaptcha()
        const verifier = (window as any).recaptchaVerifier
        const confirmation = await signInWithPhoneNumber(auth, formattedPhone, verifier)
        setConfirmationResult(confirmation)
        setOtpSent(true)
        toast({ title: "OTP Sent", description: "Verification code transmitted." })
      } else if (confirmationResult) {
        await confirmationResult.confirm(verificationCode)
        toast({ title: "Verified", description: "Identity confirmed via SMS." })
      }
    } catch (error: any) {
      console.error("Phone Auth Error:", error)
      if (error.code === 'auth/operation-not-allowed') {
        toast({ 
          variant: "destructive", 
          title: "Config Required", 
          description: "Enable 'Phone' and your region in Firebase Console > Authentication > Sign-in method." 
        })
      } else if (error.code === 'auth/billing-not-enabled') {
        toast({ 
          variant: "destructive", 
          title: "Billing Required", 
          description: "Phone auth requires the Firebase Blaze (pay-as-you-go) plan. Use Email or Google instead." 
        })
      } else {
        toast({ 
          variant: "destructive", 
          title: "Auth Failed", 
          description: error.message 
        })
      }
    } finally {
      setIsInitializing(false)
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsInitializing(true)
    try {
      if (step === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
        toast({ title: "Authenticated", description: "System link established." })
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
        toast({ title: "Account Created", description: "Welcome to Nexora." })
      }
    } catch (error: any) {
      console.error("Auth Error:", error)
      if (error.code === 'auth/invalid-credential') {
        toast({ variant: "destructive", title: "Auth Failed", description: "Invalid credentials. If you are new, select 'Join Now'." })
      } else {
        toast({ variant: "destructive", title: "Auth Failed", description: error.message })
      }
    } finally {
      setIsInitializing(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsInitializing(true)
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      toast({ title: "Authenticated", description: "Google link established." })
    } catch (error: any) {
      console.error("Google Auth Error:", error)
      if (error.code === 'auth/unauthorized-domain') {
        toast({ 
          variant: "destructive", 
          title: "Domain Restricted", 
          description: "Add this domain to 'Authorized domains' in Firebase Console > Authentication > Settings." 
        })
      } else {
        toast({ variant: "destructive", title: "Google Auth Failed", description: error.message })
      }
    } finally {
      setIsInitializing(false)
    }
  }

  const handleInitialize = async () => {
    if (degree && year && semester) {
      setIsInitializing(true)
      const statuses = [
        "Connecting Neural Core...",
        "Syncing Institutional Modules...",
        "Allocating Academic Vault...",
        "Launching Academic OS...",
      ]

      for (const s of statuses) {
        setStatus(s)
        await new Promise(r => setTimeout(r, 600))
      }

      localStorage.setItem('nexora-degree', degree)
      localStorage.setItem('nexora-year', year)
      localStorage.setItem('nexora-semester', semester)
      localStorage.setItem('nexora-onboarded', 'true')
      window.dispatchEvent(new Event('profile-change'))
      router.push('/dashboard')
    }
  }

  if (!isMounted || authLoading) return null;

  // Determine current stepper state
  const currentStep = 
    (step === 'login' || step === 'signup' || step === 'phone') ? 1 : 
    (step === 'initialize' && !isInitializing) ? 2 : 3;

  const stepperItems = [
    { id: 1, title: "Sign up your account", desc: "Authenticate or build credential path" },
    { id: 2, title: "Set up your workspace", desc: "Map academic degree & term segments" },
    { id: 3, title: "Sync & Launch OS", desc: "Connect dashboard core systems" }
  ]

  return (
    <div className="min-h-screen bg-transparent flex items-center justify-center p-4 md:p-8 relative overflow-hidden font-sans">
      <div id="recaptcha-container" ref={recaptchaRef}></div>
      
      {/* Visual background ambient light blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-[50%] h-[50%] bg-[#298DFF]/5 blur-[120px] rounded-full dark:bg-blue-950/10" />
        <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full dark:bg-blue-950/10" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full w-[94vw] lg:w-[88vw] xl:w-[82vw] max-w-7xl z-10"
      >
        <Card className="w-full glass border-foreground/10 rounded-[3rem] overflow-hidden shadow-2xl backdrop-blur-3xl bg-background/40 dark:bg-slate-950/30 p-3">
          <div className="flex flex-col md:flex-row min-h-[70vh] lg:min-h-[75vh] xl:min-h-[80vh] gap-4">
            
            {/* LEFT PANEL - Dribbble reference styled Card with Blue Glow & Stepper */}
            {/* Using inline styles for text elements to override global .light text-white overrides */}
            <div className="relative overflow-hidden bg-slate-950 rounded-[2.5rem] p-8 md:p-12 md:w-[35%] lg:w-[32%] xl:w-[30%] flex flex-col justify-between shrink-0 min-h-[500px] md:min-h-full border border-white/10 text-left">
              
              {/* Radial gradient background aura (Blue branding to match navbar) */}
              <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[280px] h-[280px] bg-[#298DFF]/25 rounded-full blur-[80px] opacity-80" />
                <div className="absolute bottom-[10%] right-[-10%] w-[200px] h-[200px] bg-[#00C2FF]/15 rounded-full blur-[70px] opacity-40" />
              </div>

              {/* Logo / Brand Header */}
              <div className="relative z-10 flex items-center gap-3">
                <Link href="/" className="flex items-center gap-3 group">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#298DFF] to-[#00C2FF] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                    <span className="text-xl font-black text-white tracking-tight">N</span>
                  </div>
                  <div className="flex flex-col text-left">
                    <h1 className="text-md font-black tracking-tighter" style={{ color: '#ffffff' }}>NEXORA</h1>
                    <p className="text-[7px] font-black uppercase tracking-[0.4em]" style={{ color: '#00C2FF' }}>Student OS v1.0</p>
                  </div>
                </Link>
              </div>

              {/* Center Welcome Messaging */}
              <div className="relative z-10 text-left my-auto py-8">
                <span className="text-[9px] font-bold tracking-[0.35em] uppercase" style={{ color: '#00C2FF' }}>SYS_INITIALIZE v1.0</span>
                <h2 className="text-3xl font-black tracking-tight mt-1.5 mb-3 leading-tight" style={{ color: '#ffffff' }}>
                  Get Started with Us
                </h2>
                <p className="text-xs font-semibold leading-relaxed max-w-[320px]" style={{ color: '#94a3b8' }}>
                  Complete these easy steps to activate your academic dashboard.
                </p>
              </div>

              {/* Dynamic Stepper Component */}
              <div className="relative z-10 flex flex-col gap-3.5 text-left">
                {stepperItems.map((item) => {
                  const isActive = currentStep === item.id;
                  const isCompleted = currentStep > item.id;
                  return (
                    <div 
                      key={item.id}
                      className={cn(
                        "flex items-center gap-3.5 p-3 rounded-2xl border transition-all duration-300",
                        isActive 
                          ? "bg-white border-white shadow-lg shadow-white/10" 
                          : isCompleted
                            ? "bg-emerald-500/10 border-emerald-500/20"
                            : "bg-white/[0.03] border-white/[0.05]"
                      )}
                      style={{
                        backgroundColor: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.03)'
                      }}
                    >
                      <div className={cn(
                        "w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 transition-colors duration-300",
                        isActive 
                          ? "bg-slate-950 text-white" 
                          : isCompleted
                            ? "bg-emerald-500 text-white"
                            : "bg-white/5 text-slate-400"
                      )}
                      style={{
                        color: isActive ? '#ffffff' : isCompleted ? '#ffffff' : '#94a3b8',
                        backgroundColor: isActive ? '#0f172a' : isCompleted ? '#10b981' : 'rgba(255, 255, 255, 0.05)'
                      }}>
                        {isCompleted ? "✓" : item.id}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black leading-tight" 
                              style={{ color: isActive ? '#0f172a' : isCompleted ? '#34d399' : '#94a3b8' }}>
                          {item.title}
                        </span>
                        <span className="text-[8px] font-bold leading-none mt-0.5"
                              style={{ color: isActive ? '#475569' : '#64748b' }}>
                          {item.desc}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* RIGHT PANEL - Interactive Auth / Initialize Form */}
            <div className="flex-1 flex flex-col justify-center p-6 md:p-12 xl:p-16 text-left w-full max-w-lg mx-auto">
              <AnimatePresence mode="wait">
                {isInitializing && currentStep === 3 ? (
                  // SYSTEM SYNCING CONSOLE SCREEN
                  <motion.div 
                    key="syncing-console"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center justify-center gap-6 py-12 text-center"
                  >
                    <div className="relative flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full border-t-2 border-r-2 border-[#298DFF] animate-spin" />
                      <div className="w-16 h-16 rounded-full border-b-2 border-l-2 border-[#00C2FF] animate-spin absolute" style={{ animationDirection: 'reverse' }} />
                      <GraduationCap className="w-8 h-8 text-[#00C2FF] absolute" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <h4 className="text-lg font-black tracking-tight text-foreground uppercase">Syncing Database</h4>
                      <p className="text-xs font-mono text-[#00C2FF] animate-pulse">{status}</p>
                    </div>
                  </motion.div>
                ) : step === 'initialize' ? (
                  // INITIALIZE STEP FORM
                  <motion.div 
                    key="initialize-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-8 w-full"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="w-12 h-12 bg-foreground/5 rounded-2xl flex items-center justify-center border border-foreground/10 mb-2">
                        <GraduationCap className="w-6 h-6 text-[#00C2FF]" />
                      </div>
                      <h3 className="text-3xl font-black tracking-tighter text-foreground">Map Trajectory</h3>
                      <p className="text-slate-800 dark:text-muted-foreground text-sm font-medium leading-relaxed">Choose your segment parameters to sync dashboard modules.</p>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-800 dark:text-muted-foreground/75 px-1">Degree Program</label>
                        <Select value={degree} onValueChange={setDegree}>
                          <SelectTrigger className="h-12 bg-foreground/5 border-foreground/10 rounded-2xl text-xs font-black transition-all hover:bg-foreground/10 text-foreground">
                            <SelectValue placeholder="Choose program..." />
                          </SelectTrigger>
                          <SelectContent className="bg-background border-foreground/10 rounded-2xl">
                            <SelectItem value="cs" className="font-bold py-3 uppercase text-[10px]">BSc Computer Science</SelectItem>
                            <SelectItem value="aids" className="font-bold py-3 uppercase text-[10px]">BSc AI & Data Science</SelectItem>
                            <SelectItem value="se" className="font-bold py-3 uppercase text-[10px]">BSc Software Engineering</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-800 dark:text-muted-foreground/75 px-1">Academic Year</label>
                          <Select value={year} onValueChange={setYear}>
                            <SelectTrigger className="h-12 bg-foreground/5 border-foreground/10 rounded-2xl text-xs font-black hover:bg-foreground/10 text-foreground">
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border-foreground/10 rounded-2xl">
                              {['1', '2', '3', '4'].map(y => (
                                <SelectItem key={y} value={y} className="font-bold py-3">YEAR {y}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-800 dark:text-muted-foreground/75 px-1">Semester Cycle</label>
                          <Select value={semester} onValueChange={setSemester}>
                            <SelectTrigger className="h-12 bg-foreground/5 border-foreground/10 rounded-2xl text-xs font-black hover:bg-foreground/10 text-foreground">
                              <SelectValue placeholder="Sem" />
                            </SelectTrigger>
                            <SelectContent className="bg-background border-foreground/10 rounded-2xl">
                              {['1', '2'].map(s => (
                                <SelectItem key={s} value={s} className="font-bold py-3">SEM {s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Button 
                      onClick={handleInitialize} 
                      disabled={!degree || !year || !semester || isInitializing} 
                      className="h-14 rounded-full bg-foreground text-background hover:bg-foreground/90 text-xs font-black tracking-widest transition-all active:scale-95 shadow-xl flex items-center justify-center gap-3 border-none mt-2"
                    >
                      INITIALIZE WORKSPACE <ArrowRight className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ) : (
                  // AUTHENTICATION FORMS (Login / Signup / Phone)
                  <motion.div 
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex flex-col gap-6 w-full"
                  >
                    {/* Header */}
                    <div className="flex flex-col gap-1 text-left">
                      <h3 className="text-3xl font-black tracking-tight text-foreground leading-tight">
                        {step === 'login' ? 'Sign In' : step === 'signup' ? 'Create Account' : 'Secure Access'}
                      </h3>
                      <p className="text-slate-800 dark:text-muted-foreground text-xs font-medium leading-relaxed">
                        {step === 'login' ? 'Enter credentials to synchronize OS workspace.' : step === 'signup' ? 'Access the neural student network core.' : 'Confirm identity code via phone line.'}
                      </p>
                    </div>

                    {/* Social OAuth Buttons Section (Dribbble styled side-by-side) */}
                    {(step === 'login' || step === 'signup') && (
                      <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Button 
                            type="button" 
                            onClick={handleGoogleLogin} 
                            disabled={isInitializing} 
                            variant="outline" 
                            className="h-12 rounded-2xl bg-foreground/5 border-foreground/10 text-foreground font-black text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-foreground/10 transition-all shadow-sm"
                          >
                            <svg className="w-3.5 h-3.5 text-foreground/80" viewBox="0 0 24 24">
                              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" className="opacity-90"/>
                              <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" className="opacity-80"/>
                              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" className="opacity-90"/>
                            </svg>
                            GOOGLE
                          </Button>
                          <Button 
                            type="button" 
                            onClick={() => setStep('phone')} 
                            disabled={isInitializing} 
                            variant="outline" 
                            className="h-12 rounded-2xl bg-foreground/5 border-foreground/10 text-foreground font-black text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-foreground/10 transition-all shadow-sm"
                          >
                            <Smartphone className="w-3.5 h-3.5 text-foreground/80" />
                            MOBILE
                          </Button>
                        </div>

                        <div className="relative flex items-center justify-center py-1">
                          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-foreground/10"></div></div>
                          <span className="relative bg-background px-4 text-[8px] font-black uppercase tracking-[0.3em] text-slate-700/80 dark:text-muted-foreground/60">or continue with</span>
                        </div>
                      </div>
                    )}

                    {step === 'phone' ? (
                      // PHONE AUTH SUB-FORM
                      <form onSubmit={handlePhoneAuth} className="flex flex-col gap-4 text-left">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-800 dark:text-muted-foreground/75 px-1">Mobile Number</label>
                          <div className="relative group">
                            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-muted-foreground/50 group-focus-within:text-[#00C2FF] transition-colors" />
                            <Input 
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="+94 7X XXX XXXX"
                              className="bg-foreground/5 border-foreground/10 rounded-2xl h-12 pl-12 text-xs focus:ring-blue-500/50 transition-all text-foreground placeholder:text-slate-600/80 dark:placeholder:text-muted-foreground/40"
                              required
                              disabled={otpSent}
                            />
                          </div>
                        </div>

                        {otpSent && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-800 dark:text-muted-foreground/75 px-1">Verification Code</label>
                            <div className="relative group">
                              <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-muted-foreground/50 group-focus-within:text-[#00C2FF] transition-colors" />
                              <Input 
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                placeholder="6-digit OTP"
                                className="bg-foreground/5 border-foreground/10 rounded-2xl h-12 pl-12 text-xs focus:ring-blue-500/50 transition-all text-foreground placeholder:text-slate-600/80 dark:placeholder:text-muted-foreground/40"
                                required
                              />
                            </div>
                          </motion.div>
                        )}

                        <Button 
                          type="submit" 
                          disabled={isInitializing}
                          className="h-12 rounded-full bg-foreground text-background font-black text-xs tracking-widest shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 border-none mt-2"
                        >
                          {isInitializing ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{otpSent ? 'VERIFY OTP' : 'SEND SECURITY CODE'} <ArrowRight className="w-4 h-4" /></>}
                        </Button>
                        
                        <button type="button" onClick={() => { setStep('login'); setOtpSent(false); }} className="text-[9px] text-slate-700 hover:text-slate-900 dark:text-muted-foreground dark:hover:text-foreground transition-colors uppercase font-black tracking-widest mt-1 text-center">
                          Use Email Credentials
                        </button>
                      </form>
                    ) : (
                      // EMAIL & PASSWORD FORM
                      <form onSubmit={handleAuth} className="flex flex-col gap-4 text-left">
                        {step === 'signup' && (
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-800 dark:text-muted-foreground/75 px-1">Full Name</label>
                            <div className="relative group">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-muted-foreground/50 group-focus-within:text-[#00C2FF] transition-colors" />
                              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter full name" className="bg-foreground/5 border-foreground/10 rounded-2xl h-12 pl-12 text-xs focus:ring-blue-500/50 transition-all text-foreground placeholder:text-slate-600/80 dark:placeholder:text-muted-foreground/40" required />
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-black uppercase tracking-widest text-slate-800 dark:text-muted-foreground/75 px-1">Email Address</label>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-muted-foreground/50 group-focus-within:text-[#00C2FF] transition-colors" />
                            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="student_id@iit.ac.lk" className="bg-foreground/5 border-foreground/10 rounded-2xl h-12 pl-12 text-xs focus:ring-blue-500/50 transition-all text-foreground placeholder:text-slate-600/80 dark:placeholder:text-muted-foreground/40" required />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-center px-1">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-800 dark:text-muted-foreground/75">Password</label>
                            {step === 'login' && (
                              <button type="button" className="text-[9px] font-black uppercase tracking-widest text-[#0088FF] dark:text-[#00C2FF] hover:underline">Forgot?</button>
                            )}
                          </div>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-muted-foreground/50 group-focus-within:text-[#00C2FF] transition-colors" />
                            <Input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="bg-foreground/5 border-foreground/10 rounded-2xl h-12 pl-12 pr-12 text-xs focus:ring-blue-500/50 transition-all text-foreground placeholder:text-slate-600/80 dark:placeholder:text-muted-foreground/40" required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-500 dark:text-muted-foreground/50 hover:text-foreground transition-colors">
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <Button type="submit" disabled={isInitializing} className="h-12 rounded-full bg-foreground text-background border-none font-black text-xs tracking-[0.2em] shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95 hover:bg-foreground/90 mt-2">
                          {isInitializing ? <Loader2 className="w-4 h-4 animate-spin" /> : <>{step === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'} <ArrowRight className="w-4 h-4" /></>}
                        </Button>
                      </form>
                    )}

                    <div className="text-center">
                      <p className="text-xs text-slate-800 dark:text-muted-foreground font-semibold">
                        {step === 'login' || step === 'phone' ? "New to Nexora?" : "Already have an account?"}{' '}
                        <button onClick={() => setStep(step === 'login' ? 'signup' : 'login')} className="text-[#0088FF] dark:text-[#00C2FF] font-bold hover:underline ml-1">
                          {step === 'login' ? 'Join Now' : 'Sign In'}
                        </button>
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>
        </Card>
      </motion.div>
    </div>
  )
}
