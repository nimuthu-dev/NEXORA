"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Target, Timer, BarChart3, ChevronRight, PlayCircle, Lock, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"

const exams = [
  { id: 1, title: "Mid-Term Mock: Data Structures", time: "60 mins", difficulty: "Medium", questions: 30, status: "Available" },
  { id: 2, title: "Final Prep: Discrete Mathematics", time: "120 mins", difficulty: "Hard", questions: 50, status: "Attempted" },
  { id: 3, title: "Interactive Quiz: OOP Principles", time: "20 mins", difficulty: "Easy", questions: 15, status: "Available" },
  { id: 4, title: "Past Paper 2023: Algorithms", time: "180 mins", difficulty: "Hard", questions: 60, status: "Locked" },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

export default function MockArenaPage() {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-8"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight">Mock Arena</h1>
          <p className="text-muted-foreground">Test your knowledge under real exam conditions.</p>
        </div>
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="glass px-6 py-4 rounded-[24px] flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <Target className="w-6 h-6 text-accent" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black">84%</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg Accuracy</span>
          </div>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {exams.map((exam) => (
          <motion.div key={exam.id} variants={item}>
            <ExamCard exam={exam} />
          </motion.div>
        ))}
      </div>

      <motion.div variants={item}>
        <Card className="glass border-white/5 rounded-[32px] mt-4 overflow-hidden">
          <CardHeader>
            <CardTitle>Performance History</CardTitle>
            <CardDescription>Your recent attempts and scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              <HistoryItem title="CS201 Algorithms" score="92%" date="Today" />
              <HistoryItem title="MA102 Discrete Maths" score="78%" date="Yesterday" />
              <HistoryItem title="PH101 Physics Lab" score="85%" date="3 days ago" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}

function ExamCard({ exam }: { exam: any }) {
  const isLocked = exam.status === "Locked"
  
  return (
    <Card className={cn(
      "glass border-white/5 rounded-[32px] group overflow-hidden transition-all hover:bg-white/5",
      isLocked && "opacity-60"
    )}>
      <CardContent className="p-8 flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <Badge variant="outline" className={cn(
              "w-fit text-[10px] uppercase font-bold tracking-widest",
              exam.difficulty === "Easy" ? "text-green-400 border-green-400/20 bg-green-400/10" :
              exam.difficulty === "Medium" ? "text-yellow-400 border-yellow-400/20 bg-yellow-400/10" :
              "text-red-400 border-red-400/20 bg-red-400/10"
            )}>
              {exam.difficulty}
            </Badge>
            <h3 className="text-xl font-bold mt-2">{exam.title}</h3>
          </div>
          {isLocked ? <Lock className="w-6 h-6 text-muted-foreground" /> : <PlayCircle className="w-8 h-8 text-primary opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all" />}
        </div>

        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Timer className="w-4 h-4" />
            <span className="text-xs font-medium">{exam.time}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span className="text-xs font-medium">{exam.questions} Qs</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <BarChart3 className="w-4 h-4" />
            <span className="text-xs font-medium">{exam.status}</span>
          </div>
        </div>

        <Button 
          disabled={isLocked} 
          className="w-full rounded-2xl h-12 premium-gradient border-none font-bold transition-all active:scale-95 shadow-lg shadow-primary/10"
        >
          {exam.status === "Attempted" ? "Review Results" : "Start Exam"}
        </Button>
      </CardContent>
    </Card>
  )
}

function HistoryItem({ title, score, date }: { title: string, score: string, date: string }) {
  return (
    <motion.div 
      whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
      className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 transition-all"
    >
      <div className="flex flex-col gap-1">
        <span className="font-bold">{title}</span>
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>
      <div className="flex items-center gap-4">
        <span className={cn(
          "text-lg font-black",
          parseInt(score) > 85 ? "text-green-500" : "text-primary"
        )}>{score}</span>
        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/10">
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>
    </motion.div>
  )
}
