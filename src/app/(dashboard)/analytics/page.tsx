"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts'
import { Trophy, TrendingUp, Target, Award } from "lucide-react"

const gpaData = [
  { semester: 'Sem 1', gpa: 3.42 },
  { semester: 'Sem 2', gpa: 3.56 },
  { semester: 'Sem 3', gpa: 3.82 },
  { semester: 'Sem 4', gpa: 3.75 },
  { semester: 'Sem 5', gpa: 3.91 },
  { semester: 'Sem 6', gpa: 3.88 },
]

const subjectPerformance = [
  { subject: 'Maths', score: 92 },
  { subject: 'Physics', score: 85 },
  { subject: 'CS', score: 96 },
  { subject: 'English', score: 78 },
  { subject: 'Design', score: 88 },
]

export default function AnalyticsPage() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-8"
    >
      <header className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight">GPA Analytics</h1>
        <p className="text-muted-foreground">Track your academic journey and performance trends.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Overall GPA" value="3.82" sub="Top 5% of Batch" icon={<Trophy className="text-yellow-500" />} delay={0.1} />
        <StatCard title="Current Rank" value="#12" sub="out of 240 Students" icon={<Target className="text-primary" />} delay={0.2} />
        <StatCard title="Total Credits" value="124" sub="84% Complete" icon={<TrendingUp className="text-green-500" />} delay={0.3} />
        <StatCard title="Dean's List" value="3 Times" sub="Consecutive Streak" icon={<Award className="text-secondary" />} delay={0.4} />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="col-span-12 lg:col-span-8"
        >
          <Card className="glass border-white/5 rounded-[32px] h-full">
            <CardHeader>
              <CardTitle>GPA Progression</CardTitle>
              <CardDescription>Visualizing your semester-wise growth</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={gpaData}>
                  <defs>
                    <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C9CF5" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#7C9CF5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="semester" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 4.0]} stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}
                    itemStyle={{ color: '#7C9CF5', fontWeight: 'bold' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="gpa" 
                    stroke="#7C9CF5" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorGpa)" 
                    animationDuration={2000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="col-span-12 lg:col-span-4"
        >
          <Card className="glass border-white/5 rounded-[32px] h-full">
            <CardHeader>
              <CardTitle>Subject Mastery</CardTitle>
              <CardDescription>Average performance by field</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={subjectPerformance} layout="vertical">
                  <XAxis type="number" hide />
                  <YAxis dataKey="subject" type="category" stroke="#94A3B8" fontSize={12} width={80} tickLine={false} axisLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }} />
                  <Bar 
                    dataKey="score" 
                    fill="#A78BFA" 
                    radius={[0, 8, 8, 0]} 
                    barSize={20}
                    animationDuration={2000}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}

function StatCard({ title, value, sub, icon, delay }: { title: string, value: string, sub: string, icon: React.ReactNode, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Card className="glass border-white/5 rounded-[28px] overflow-hidden group hover:bg-white/5 transition-all">
        <CardContent className="p-6 flex flex-col gap-2">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{title}</span>
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.2 }}
              className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center transition-transform"
            >
              {icon}
            </motion.div>
          </div>
          <span className="text-3xl font-black">{value}</span>
          <span className="text-xs text-muted-foreground font-medium">{sub}</span>
        </CardContent>
      </Card>
    </motion.div>
  )
}
