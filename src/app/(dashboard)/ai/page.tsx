"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Bot,
  Send,
  Sparkles,
  FileText,
  Lightbulb,
  Calendar,
  Brain,
  Trash2,
  ChevronRight,
  Copy,
  Check,
  Loader2,
  Zap,
  GraduationCap,
} from "lucide-react"
import { nexoraAIChat } from "@/ai/flows/nexora-ai-chat"
import { cn } from "@/lib/utils"

type Mode = "chat" | "summarize" | "explain" | "plan" | "quiz"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  mode?: Mode
}

const MODES: { id: Mode; label: string; icon: React.ReactNode; description: string; placeholder: string }[] = [
  {
    id: "chat",
    label: "Ask Anything",
    icon: <Sparkles className="w-4 h-4" />,
    description: "Free-form academic Q&A",
    placeholder: "Ask me anything about your modules, concepts, or studies...",
  },
  {
    id: "summarize",
    label: "Summarize",
    icon: <FileText className="w-4 h-4" />,
    description: "Summarize lecture notes",
    placeholder: "Paste your lecture notes or text here to get a clear, bullet-pointed summary...",
  },
  {
    id: "explain",
    label: "Explain",
    icon: <Lightbulb className="w-4 h-4" />,
    description: "Deep-dive explanations",
    placeholder: "What concept should I explain in detail? (e.g. 'Binary search trees', 'TCP/IP model')",
  },
  {
    id: "plan",
    label: "Study Plan",
    icon: <Calendar className="w-4 h-4" />,
    description: "Generate revision plans",
    placeholder: "Which module or exam are you preparing for? (e.g. 'Data Structures final exam in 2 weeks')",
  },
  {
    id: "quiz",
    label: "Quiz Me",
    icon: <Brain className="w-4 h-4" />,
    description: "Practice with questions",
    placeholder: "Which topic should I quiz you on? (e.g. 'Operating systems memory management')",
  },
]

const QUICK_PROMPTS: Record<Mode, string[]> = {
  chat: [
    "What's the difference between TCP and UDP?",
    "Explain Big O notation with examples",
    "How do I approach algorithm design problems?",
    "Tips for the upcoming exam season?",
  ],
  summarize: [
    "Paste lecture notes below...",
    "Summarize this chapter excerpt...",
    "Key points from today's lecture...",
  ],
  explain: [
    "Binary search trees",
    "Deadlock in operating systems",
    "Gradient descent algorithm",
    "SOLID principles in OOP",
  ],
  plan: [
    "Data Structures exam in 3 days",
    "Full revision for semester finals",
    "Week-long prep for Database Systems",
    "Quick revision for tomorrow's quiz",
  ],
  quiz: [
    "Object-oriented programming",
    "SQL queries and joins",
    "Sorting algorithms",
    "Computer networks basics",
  ],
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n")

  return (
    <div className="text-sm leading-relaxed space-y-1">
      {lines.map((line, i) => {
        // Code blocks
        if (line.startsWith("```")) {
          return null // handled below
        }
        // Headers
        if (line.startsWith("### ")) {
          return <p key={i} className="font-bold text-foreground mt-3 mb-1 text-base">{line.slice(4)}</p>
        }
        if (line.startsWith("## ")) {
          return <p key={i} className="font-bold text-foreground mt-4 mb-2 text-lg">{line.slice(3)}</p>
        }
        if (line.startsWith("# ")) {
          return <p key={i} className="font-black text-foreground mt-4 mb-2 text-xl">{line.slice(2)}</p>
        }
        // Bullet points
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <div key={i} className="flex gap-2 items-start">
              <span className="text-accent mt-1 shrink-0">•</span>
              <span dangerouslySetInnerHTML={{ __html: formatInline(line.slice(2)) }} />
            </div>
          )
        }
        // Numbered lists
        if (/^\d+\.\s/.test(line)) {
          const match = line.match(/^(\d+)\.\s(.*)/)
          if (match) {
            return (
              <div key={i} className="flex gap-2 items-start">
                <span className="text-accent font-bold shrink-0">{match[1]}.</span>
                <span dangerouslySetInnerHTML={{ __html: formatInline(match[2]) }} />
              </div>
            )
          }
        }
        // Horizontal rule
        if (line === "---") {
          return <hr key={i} className="border-white/10 my-3" />
        }
        // Empty line
        if (line.trim() === "") {
          return <div key={i} className="h-2" />
        }
        // Regular paragraph
        return (
          <p key={i} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
        )
      })}
    </div>
  )
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-bold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-white/10 px-1.5 py-0.5 rounded text-accent font-mono text-xs">$1</code>')
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-all p-1 rounded-lg hover:bg-white/10"
      title="Copy response"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<Mode>("chat")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSidebarOpen(window.innerWidth >= 1024)
    }
  }, [])

  const academicContext = {
    degree: typeof window !== "undefined" ? localStorage.getItem("nexora-degree") || "cs" : "cs",
    year: typeof window !== "undefined" ? localStorage.getItem("nexora-year") || "1" : "1",
    semester: typeof window !== "undefined" ? localStorage.getItem("nexora-semester") || "1" : "1",
  }

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSubmit = async (overrideInput?: string) => {
    const text = overrideInput ?? input
    if (!text.trim() || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
      mode,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
    }

    try {
      // Format history as readable text for the Handlebars prompt template
      const historyText = messages
        .slice(-10)
        .map((m) => `${m.role === 'user' ? 'Student' : 'Nexora AI'}: ${m.content}`)
        .join('\n\n')

      const res = await nexoraAIChat({
        message: text.trim(),
        history: historyText || undefined,
        mode,
        degree: academicContext.degree,
        year: academicContext.year,
        semester: academicContext.semester,
      })

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.response,
        timestamp: new Date(),
        mode,
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch (err) {
      console.error(err)
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please check your API key configuration and try again.",
        timestamp: new Date(),
        mode,
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = Math.min(e.target.scrollHeight, 180) + "px"
  }

  const currentMode = MODES.find((m) => m.id === mode)!

  return (
    <div className="relative flex h-[calc(100dvh-7rem)] lg:h-[calc(100vh-6rem)] gap-0 overflow-hidden rounded-[2rem] border border-white/5 glass shadow-2xl">
      {/* ── Sidebar ── */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 flex flex-col border-r border-white/5 overflow-hidden absolute lg:relative left-0 top-0 h-full z-30 bg-card/98 backdrop-blur-md lg:bg-transparent"
          >
            {/* Sidebar Header */}
            <div className="p-5 border-b border-white/5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#298DFF] to-[#00C2FF] flex items-center justify-center shadow-lg shadow-[#298DFF]/20">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-black text-sm tracking-tight">Nexora AI</h2>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] text-muted-foreground font-medium">Gemini 2.5 Flash</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground text-xs"
                >
                  ✕
                </button>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#298DFF]/10 border border-[#298DFF]/20">
                <Zap className="w-3.5 h-3.5 text-[#298DFF]" />
                <span className="text-[10px] font-bold text-[#298DFF] uppercase tracking-widest">AI-Powered</span>
              </div>
            </div>

            {/* Mode Selector */}
            <div className="p-4 flex-1 overflow-y-auto scrollbar-hide">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 px-1">Mode</p>
              <div className="flex flex-col gap-1">
                {MODES.map((m) => (
                  <motion.button
                    key={m.id}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setMode(m.id)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left",
                      mode === m.id
                        ? "bg-gradient-to-r from-[#298DFF]/20 to-[#00C2FF]/10 text-foreground border border-[#298DFF]/30"
                        : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className={cn("flex-shrink-0", mode === m.id ? "text-[#298DFF]" : "")}>{m.icon}</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-xs">{m.label}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{m.description}</div>
                    </div>
                    {mode === m.id && <ChevronRight className="w-3.5 h-3.5 text-[#298DFF] ml-auto flex-shrink-0" />}
                  </motion.button>
                ))}
              </div>

              {/* Quick Prompts */}
              <div className="mt-6">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3 px-1">
                  Quick Prompts
                </p>
                <div className="flex flex-col gap-1.5">
                  {QUICK_PROMPTS[mode].map((prompt, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSubmit(prompt)}
                      className="text-left px-3 py-2 rounded-xl text-[11px] text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent hover:border-white/10 transition-all leading-snug"
                    >
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Stats */}
              {messages.length > 0 && (
                <div className="mt-6 px-1">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Session</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/5 rounded-xl p-2.5 text-center">
                      <p className="text-lg font-black text-[#298DFF]">{messages.filter(m => m.role === "user").length}</p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Messages</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-2.5 text-center">
                      <p className="text-lg font-black text-[#00C2FF]">{messages.filter(m => m.role === "assistant").length}</p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wide">Responses</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Academic Context */}
            <div className="p-4 border-t border-white/5">
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5">
                <GraduationCap className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-bold">Context</p>
                  <p className="text-[11px] font-semibold truncate">
                    {academicContext.degree?.toUpperCase()} · Y{academicContext.year} S{academicContext.semester}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Chat Area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/2 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="w-8 h-8 rounded-lg hover:bg-white/5 transition-all flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect y="2" width="16" height="2" rx="1" />
                <rect y="7" width="16" height="2" rx="1" />
                <rect y="12" width="16" height="2" rx="1" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">{currentMode.label} Mode</span>
              <Badge
                variant="outline"
                className="text-[10px] uppercase font-bold tracking-widest bg-[#298DFF]/10 border-[#298DFF]/20 text-[#298DFF]"
              >
                Online
              </Badge>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={() => setMessages([])}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors px-3 py-1.5 rounded-lg hover:bg-destructive/10"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          <AnimatePresence mode="popLayout">
            {messages.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="h-full flex flex-col items-center justify-center text-center gap-6 py-12"
              >
                {/* Hero Icon */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#298DFF] to-[#00C2FF] flex items-center justify-center shadow-2xl shadow-[#298DFF]/30">
                    <Bot className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-background animate-pulse" />
                </motion.div>

                <div>
                  <h3 className="text-2xl font-black mb-2">
                    Hi, I&apos;m{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#298DFF] to-[#00C2FF]">
                      Nexora AI
                    </span>
                  </h3>
                  <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
                    Your intelligent academic companion powered by Gemini 2.5 Flash. Ask me anything about your studies.
                  </p>
                </div>

                {/* Suggested prompts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg mt-2">
                  {QUICK_PROMPTS.chat.map((p, i) => (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSubmit(p)}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#298DFF]/30 hover:bg-[#298DFF]/5 text-left text-sm text-muted-foreground hover:text-foreground transition-all leading-snug"
                    >
                      {p}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 mt-1">
                    {msg.role === "assistant" ? (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#298DFF] to-[#00C2FF] flex items-center justify-center shadow-lg shadow-[#298DFF]/20">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <span className="text-white font-black text-xs">U</span>
                      </div>
                    )}
                  </div>

                  {/* Bubble */}
                  <div className={cn("max-w-[75%] flex flex-col gap-1 group", msg.role === "user" ? "items-end" : "items-start")}>
                    <div
                      className={cn(
                        "px-4 py-3 rounded-2xl",
                        msg.role === "user"
                          ? "bg-gradient-to-br from-[#298DFF]/20 to-[#00C2FF]/10 border border-[#298DFF]/20 text-foreground text-sm"
                          : "bg-white/5 border border-white/10 text-foreground"
                      )}
                    >
                      {msg.role === "assistant" ? (
                        <MarkdownRenderer content={msg.content} />
                      ) : (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-[10px] text-muted-foreground">{formatTime(msg.timestamp)}</span>
                      {msg.role === "assistant" && <CopyButton text={msg.content} />}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>

          {/* Thinking indicator */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#298DFF] to-[#00C2FF] flex items-center justify-center shadow-lg shadow-[#298DFF]/20 flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="px-4 py-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                      className="w-2 h-2 rounded-full bg-[#298DFF]"
                    />
                  ))}
                  <span className="ml-2 text-xs text-muted-foreground">Nexora AI is thinking...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-white/5 flex-shrink-0">
          <div className="relative flex items-end gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 focus-within:border-[#298DFF]/40 transition-all">
            {/* Mode pill */}
            <div className="absolute top-3 left-3">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#298DFF] bg-[#298DFF]/10 px-2 py-0.5 rounded-full">
                {currentMode.label}
              </span>
            </div>

            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={currentMode.placeholder}
              rows={1}
              className="flex-1 bg-transparent border-none resize-none outline-none focus:ring-0 text-sm pl-0 pt-7 pb-1 min-h-[52px] max-h-[180px] placeholder:text-muted-foreground/50 scrollbar-hide"
            />

            <div className="flex-shrink-0 flex items-center gap-2 pb-1">
              <span className="text-[10px] text-muted-foreground hidden sm:block">⏎ Send</span>
              <Button
                disabled={loading || !input.trim()}
                onClick={() => handleSubmit()}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#298DFF] to-[#00C2FF] hover:opacity-90 border-none p-0 flex items-center justify-center shadow-lg shadow-[#298DFF]/20 disabled:opacity-30 transition-all"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Send className="w-4 h-4 text-white" />
                )}
              </Button>
            </div>
          </div>
          <p className="text-center text-[10px] text-muted-foreground/40 mt-2">
            Nexora AI can make mistakes. Verify important academic information.
          </p>
        </div>
      </div>
    </div>
  )
}
