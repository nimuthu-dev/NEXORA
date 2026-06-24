"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  Filter, 
  Folder, 
  FileText, 
  Download, 
  Star, 
  MoreVertical,
  ChevronRight,
  TrendingUp,
  Clock,
  GraduationCap,
  Layers,
  Calendar,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const allResources = [
  // Year 1 Shared (CS/SE) - Sem 1
  // SOFTWARE DEVELOPMENT
  { id: 1, name: "Intro_to_Programming.pdf", type: "PDF", size: "12.4 MB", module: "CS101", date: "2 days ago", stars: 120, degree: ["cs", "se"], year: 1, semester: 1, category: "lecture" },
  { id: 21, name: "SD_Lec01.pdf", type: "PDF", size: "1.1 MB", module: "CS101", date: "Just now", stars: 15, degree: ["cs", "se"], year: 1, semester: 1, category: "lecture" },
  { id: 22, name: "SD_Lec02.pdf", type: "PDF", size: "1.8 MB", module: "CS101", date: "Just now", stars: 22, degree: ["cs", "se"], year: 1, semester: 1, category: "lecture" },
  { id: 23, name: "SD_Lec03.pptx", type: "PPTX", size: "2.4 MB", module: "CS101", date: "Just now", stars: 19, degree: ["cs", "se"], year: 1, semester: 1, category: "lecture" },
  { id: 24, name: "SD_Lec04.pptx", type: "PPTX", size: "2.0 MB", module: "CS101", date: "Just now", stars: 11, degree: ["cs", "se"], year: 1, semester: 1, category: "lecture" },
  { id: 25, name: "SD_Lec05.pdf", type: "PDF", size: "1.5 MB", module: "CS101", date: "Just now", stars: 30, degree: ["cs", "se"], year: 1, semester: 1, category: "lecture" },
  { id: 26, name: "SD_Lec06.pptx", type: "PPTX", size: "3.1 MB", module: "CS101", date: "Just now", stars: 14, degree: ["cs", "se"], year: 1, semester: 1, category: "lecture" },
  { id: 27, name: "SD_Lec07.pdf", type: "PDF", size: "2.2 MB", module: "CS101", date: "Just now", stars: 25, degree: ["cs", "se"], year: 1, semester: 1, category: "lecture" },
  { id: 28, name: "SD_Lec11_Revision.pptx", type: "PPTX", size: "176 KB", module: "CS101", date: "Just now", stars: 40, degree: ["cs", "se"], year: 1, semester: 1, category: "lecture" },
  
  { id: 31, name: "SD_Tutorial01.pdf", type: "PDF", size: "850 KB", module: "CS101", date: "Just now", stars: 8, degree: ["cs", "se"], year: 1, semester: 1, category: "tutorial" },
  { id: 32, name: "SD_Tutorial02.pdf", type: "PDF", size: "1.2 MB", module: "CS101", date: "Just now", stars: 12, degree: ["cs", "se"], year: 1, semester: 1, category: "tutorial" },
  { id: 33, name: "SD_Tutorial03.pdf", type: "PDF", size: "980 KB", module: "CS101", date: "Just now", stars: 15, degree: ["cs", "se"], year: 1, semester: 1, category: "tutorial" },
  { id: 34, name: "SD_Tutorial04.pdf", type: "PDF", size: "1.1 MB", module: "CS101", date: "Just now", stars: 9, degree: ["cs", "se"], year: 1, semester: 1, category: "tutorial" },
  { id: 35, name: "SD_Tutorial05.pdf", type: "PDF", size: "1.4 MB", module: "CS101", date: "Just now", stars: 18, degree: ["cs", "se"], year: 1, semester: 1, category: "tutorial" },
  { id: 36, name: "SD_Tutorial06.pdf", type: "PDF", size: "1.0 MB", module: "CS101", date: "Just now", stars: 7, degree: ["cs", "se"], year: 1, semester: 1, category: "tutorial" },
  { id: 37, name: "SD_Tutorial07.pdf", type: "PDF", size: "1.3 MB", module: "CS101", date: "Just now", stars: 11, degree: ["cs", "se"], year: 1, semester: 1, category: "tutorial" },
  { id: 38, name: "SD_Tutorial09.pdf", type: "PDF", size: "1.2 MB", module: "CS101", date: "Just now", stars: 16, degree: ["cs", "se"], year: 1, semester: 1, category: "tutorial" },
  
  { id: 41, name: "SD_Final_Exam_2024.pdf", type: "PDF", size: "2.1 MB", module: "CS101", date: "3 days ago", stars: 52, degree: ["cs", "se"], year: 1, semester: 1, category: "paper" },

  // COMPUTER SYSTEMS FUNDAMENTALS (CSF)
  { id: 2, name: "CSF_Lec01_Introduction.pdf", type: "PDF", size: "4.2 MB", module: "CS102", date: "1 week ago", stars: 85, degree: ["cs", "se"], year: 1, semester: 1, category: "lecture" },
  { id: 45, name: "CSF_Lec02_Architecture.pptx", type: "PPTX", size: "6.1 MB", module: "CS102", date: "4 days ago", stars: 45, degree: ["cs", "se"], year: 1, semester: 1, category: "lecture" },
  { id: 46, name: "CSF_Tutorial01.pdf", type: "PDF", size: "1.2 MB", module: "CS102", date: "5 days ago", stars: 32, degree: ["cs", "se"], year: 1, semester: 1, category: "tutorial" },
  { id: 47, name: "CSF_Tutorial02.pdf", type: "PDF", size: "1.5 MB", module: "CS102", date: "2 days ago", stars: 22, degree: ["cs", "se"], year: 1, semester: 1, category: "tutorial" },
  { id: 48, name: "CSF_Past_Paper_2023.pdf", type: "PDF", size: "3.4 MB", module: "CS102", date: "1 month ago", stars: 60, degree: ["cs", "se"], year: 1, semester: 1, category: "paper" },

  // MATHEMATICS (MATHS)
  { id: 12, name: "Discrete_Mathematics_Calculus.pdf", type: "PDF", size: "8.1 MB", module: "MA101", date: "4 days ago", stars: 92, degree: ["cs", "se"], year: 1, semester: 1, category: "lecture" },
  { id: 51, name: "Maths_Lec02_Set_Theory.pdf", type: "PDF", size: "2.3 MB", module: "MA101", date: "2 days ago", stars: 40, degree: ["cs", "se"], year: 1, semester: 1, category: "lecture" },
  { id: 52, name: "Maths_Tutorial01_Sets.pdf", type: "PDF", size: "1.1 MB", module: "MA101", date: "Yesterday", stars: 29, degree: ["cs", "se"], year: 1, semester: 1, category: "tutorial" },
  { id: 53, name: "Maths_Tutorial02_Relations.pdf", type: "PDF", size: "1.3 MB", module: "MA101", date: "Just now", stars: 18, degree: ["cs", "se"], year: 1, semester: 1, category: "tutorial" },
  { id: 54, name: "Maths_Exam_Prep_Guide.pdf", type: "PDF", size: "4.5 MB", module: "MA101", date: "2 weeks ago", stars: 74, degree: ["cs", "se"], year: 1, semester: 1, category: "paper" },

  // ENGLISH
  { id: 61, name: "English_Lec01_Academic_Writing.pdf", type: "PDF", size: "3.2 MB", module: "EN101", date: "1 week ago", stars: 25, degree: ["cs", "se"], year: 1, semester: 1, category: "lecture" },
  { id: 62, name: "English_Tutorial01_Grammar.pdf", type: "PDF", size: "900 KB", module: "EN101", date: "5 days ago", stars: 15, degree: ["cs", "se"], year: 1, semester: 1, category: "tutorial" },
  { id: 63, name: "English_Presentation_Rubric.pdf", type: "PDF", size: "1.5 MB", module: "EN101", date: "Yesterday", stars: 33, degree: ["cs", "se"], year: 1, semester: 1, category: "lecture" },

  // DESIGN
  { id: 71, name: "Design_Lec01_User_Interface_Principles.pdf", type: "PDF", size: "6.8 MB", module: "DS101", date: "3 days ago", stars: 55, degree: ["cs", "se"], year: 1, semester: 1, category: "lecture" },
  { id: 72, name: "Design_Tutorial01_Figma_Wireframing.pdf", type: "PDF", size: "4.2 MB", module: "DS101", date: "Yesterday", stars: 48, degree: ["cs", "se"], year: 1, semester: 1, category: "tutorial" },
  { id: 73, name: "Design_Mock_Project_Brief.pdf", type: "PDF", size: "2.1 MB", module: "DS101", date: "Just now", stars: 19, degree: ["cs", "se"], year: 1, semester: 1, category: "lecture" },

  // Other Semesters/Years
  // Year 1 Shared (CS/SE) - Sem 2
  { id: 11, name: "Data_Structures_Intro.pdf", type: "PDF", size: "10.1 MB", module: "CS102", date: "3 days ago", stars: 95, degree: ["cs", "se"], year: 1, semester: 2, category: "lecture" },
  { id: 13, name: "Object_Oriented_Design.pdf", type: "PDF", size: "6.5 MB", module: "CS105", date: "5 days ago", stars: 78, degree: ["cs", "se"], year: 1, semester: 2, category: "lecture" },

  // CS Specific Year 2+
  { id: 3, name: "Algorithms_Final_Notes.pdf", type: "PDF", size: "15.1 MB", module: "CS201", date: "5 hours ago", stars: 142, degree: ["cs"], year: 2, semester: 1, category: "lecture" },
  { id: 14, name: "Database_Management_Systems.pdf", type: "PDF", size: "12.2 MB", module: "CS205", date: "2 days ago", stars: 88, degree: ["cs"], year: 2, semester: 1, category: "lecture" },
  { id: 9, name: "Distributed_Systems_Arch.pdf", type: "PDF", size: "18.5 MB", module: "CS302", date: "2 weeks ago", stars: 65, degree: ["cs"], year: 3, semester: 1, category: "lecture" },
  
  // SE Specific Year 2+
  { id: 4, name: "Software_Lifecycle_V2.pdf", type: "PDF", size: "8.2 MB", module: "SE205", date: "3 days ago", stars: 92, degree: ["se"], year: 2, semester: 1, category: "lecture" },
  { id: 15, name: "Requirements_Engineering_Guide.pdf", type: "PDF", size: "5.4 MB", module: "SE208", date: "6 days ago", stars: 54, degree: ["se"], year: 2, semester: 1, category: "lecture" },
  { id: 10, name: "Agile_Project_Management.docx", type: "DOCX", size: "5.1 MB", module: "SE305", date: "1 month ago", stars: 110, degree: ["se"], year: 3, semester: 2, category: "lecture" },
  
  // AI-DS Consolidated Degree
  { id: 5, name: "AI_Foundations_Year1.pdf", type: "PDF", size: "14.8 MB", module: "AIDS101", date: "Yesterday", stars: 56, degree: ["aids"], year: 1, semester: 1, category: "lecture" },
  { id: 6, name: "Neural_Networks_Advanced.pdf", type: "PDF", size: "22.4 MB", module: "AIDS202", date: "4 days ago", stars: 204, degree: ["aids"], year: 2, semester: 1, category: "lecture" },
  { id: 7, name: "Big_Data_Analytics_Tools.zip", type: "ZIP", size: "45.1 MB", module: "AIDS301", date: "2 weeks ago", stars: 156, degree: ["aids"], year: 3, semester: 1, category: "lecture" },
  { id: 8, name: "Statistical_Modeling_V1.pdf", type: "PDF", size: "11.1 MB", module: "AIDS102", date: "3 weeks ago", stars: 78, degree: ["aids"], year: 1, semester: 2, category: "lecture" },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const item = {
  hidden: { y: 10, opacity: 0 },
  show: { y: 0, opacity: 1 }
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

export default function ResourcesPage() {
  const [degree, setDegree] = useState<string>("cs")
  const [year, setYear] = useState<string>("1")
  const [semester, setSemester] = useState<string>("1")
  const [search, setSearch] = useState("")
  const [moduleFilter, setModuleFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  useEffect(() => {
    const handleProfileChange = () => {
      const savedDegree = safeGetItem('nexora-degree')
      const savedYear = safeGetItem('nexora-year')
      const savedSemester = safeGetItem('nexora-semester')
      
      if (savedDegree) setDegree(savedDegree)
      if (savedYear) setYear(savedYear)
      if (savedSemester) setSemester(savedSemester)
    }

    handleProfileChange()
    window.addEventListener('profile-change', handleProfileChange)
    return () => window.removeEventListener('profile-change', handleProfileChange)
  }, [])

  // Reset module filter when segment changes to prevent listing empty resources
  useEffect(() => {
    setModuleFilter("all")
  }, [year, semester, degree])

  const updateFilter = (key: string, value: string) => {
    safeSetItem(key, value)
    window.dispatchEvent(new Event('profile-change'))
  }

  // 1. Filter by Degree, Year, and Semester (Segment)
  const segmentResources = allResources.filter(res => {
    // Logic for matching Degree (including shared Year 1 for CS/SE)
    const isSharedYear1 = res.year === 1 && parseInt(year) === 1 && 
                          (degree === 'cs' || degree === 'se') && 
                          (res.degree.includes('cs') || res.degree.includes('se'))
    
    const matchesDegree = isSharedYear1 || res.degree.includes(degree)
    const matchesYear = res.year === parseInt(year)
    const matchesSemester = res.semester === parseInt(semester)

    return matchesDegree && matchesYear && matchesSemester
  })

  // 2. Extract unique modules from this segment and map to names
  const availableModules = Array.from(
    new Set(segmentResources.map(res => res.module))
  ).map(modCode => {
    let fullName = modCode;
    if (modCode === "CS101") fullName = "Software Development (SD)";
    else if (modCode === "CS102") fullName = "Computer Systems Fundamentals (CSF)";
    else if (modCode === "MA101") fullName = "Mathematics (MATHS)";
    else if (modCode === "EN101") fullName = "English Module";
    else if (modCode === "DS101") fullName = "Design Module";
    else if (modCode === "SE105") fullName = "Logical Systems";
    else if (modCode === "CS105") fullName = "Object Oriented Design";
    else if (modCode === "CS201") fullName = "Advanced Algorithms";
    else if (modCode === "CS205") fullName = "Database Management";
    else if (modCode === "CS302") fullName = "Distributed Systems";
    else if (modCode === "SE205") fullName = "Software Lifecycle";
    else if (modCode === "SE208") fullName = "Requirements Engineering";
    else if (modCode === "SE305") fullName = "Agile Project Management";
    else if (modCode === "AIDS101") fullName = "AI Foundations";
    else if (modCode === "AIDS202") fullName = "Neural Networks";
    else if (modCode === "AIDS301") fullName = "Big Data Analytics";
    else if (modCode === "AIDS102") fullName = "Statistical Modeling";
    return { code: modCode, name: fullName };
  })

  // 3. Filter by selected module
  const moduleFilteredResources = segmentResources.filter(res => {
    if (moduleFilter === "all") return true;
    return res.module === moduleFilter;
  })

  // 4. Calculate actual count per category based on module filter
  const lectureCount = moduleFilteredResources.filter(res => res.category === "lecture").length;
  const tutorialCount = moduleFilteredResources.filter(res => res.category === "tutorial").length;
  const paperCount = moduleFilteredResources.filter(res => res.category === "paper").length;

  // 5. Filter by category (interactive folder card selector)
  const categoryFilteredResources = moduleFilteredResources.filter(res => {
    if (categoryFilter === "all") return true;
    return res.category === categoryFilter;
  })

  // 6. Filter by search input
  const filteredResources = categoryFilteredResources.filter(res => {
    const matchesSearch = res.name.toLowerCase().includes(search.toLowerCase()) || 
                          res.module.toLowerCase().includes(search.toLowerCase())
    return matchesSearch;
  })

  const toggleCategoryFilter = (cat: string) => {
    if (categoryFilter === cat) {
      setCategoryFilter("all");
    } else {
      setCategoryFilter(cat);
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-10 text-foreground"
    >
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 bg-white/5 p-8 rounded-[3rem] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-32 -mt-32" />
        
        <div className="flex flex-col gap-3 relative z-10">
          <div className="flex items-center gap-3 text-primary mb-1">
            <GraduationCap className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Resource Module // {degree.toUpperCase()} // ACTIVE</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Resource Vault</h1>
          <p className="text-muted-foreground italic max-w-xl">Curriculum-aligned assets are automatically filtered for your academic segment.</p>
        </div>

        {/* Navigation Dropdown Filters */}
        <div className="flex flex-wrap gap-4 relative z-10">
          
          {/* Module Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-[8px] font-black uppercase tracking-widest text-white/30 px-1 flex items-center gap-2">
              <Filter className="w-3 h-3" /> Module Filter
            </label>
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-56 bg-white/5 border-white/10 rounded-2xl h-12 text-[10px] font-bold uppercase tracking-widest">
                <SelectValue placeholder="All Modules" />
              </SelectTrigger>
              <SelectContent className="glass border-white/10 rounded-2xl">
                <SelectItem value="all" className="text-[10px] font-bold uppercase py-3">All Modules</SelectItem>
                {availableModules.map(mod => (
                  <SelectItem key={mod.code} value={mod.code} className="text-[10px] font-bold uppercase py-3">
                    {mod.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[8px] font-black uppercase tracking-widest text-white/30 px-1 flex items-center gap-2">
              <Filter className="w-3 h-3" /> Degree
            </label>
            <Select value={degree} onValueChange={(v) => updateFilter('nexora-degree', v)}>
              <SelectTrigger className="w-48 bg-white/5 border-white/10 rounded-2xl h-12 text-[10px] font-bold uppercase tracking-widest">
                <SelectValue placeholder="Degree" />
              </SelectTrigger>
              <SelectContent className="glass border-white/10 rounded-2xl">
                <SelectItem value="cs" className="text-[10px] font-bold uppercase py-3">BSc (Hons) CS</SelectItem>
                <SelectItem value="se" className="text-[10px] font-bold uppercase py-3">BSc (Eng) SE</SelectItem>
                <SelectItem value="aids" className="text-[10px] font-bold uppercase py-3">BSc (Hons) AI & DS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[8px] font-black uppercase tracking-widest text-white/30 px-1 flex items-center gap-2">
              <Calendar className="w-3 h-3" /> Year
            </label>
            <Select value={year} onValueChange={(v) => updateFilter('nexora-year', v)}>
              <SelectTrigger className="w-32 bg-white/5 border-white/10 rounded-2xl h-12 text-[10px] font-bold uppercase tracking-widest">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="glass border-white/10 rounded-2xl">
                {['1', '2', '3', '4'].map(y => (
                  <SelectItem key={y} value={y} className="text-[10px] font-bold py-3 uppercase">Year {y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[8px] font-black uppercase tracking-widest text-white/30 px-1 flex items-center gap-2">
              <Sparkles className="w-3 h-3" /> Sem
            </label>
            <Select value={semester} onValueChange={(v) => updateFilter('nexora-semester', v)}>
              <SelectTrigger className="w-32 bg-white/5 border-white/10 rounded-2xl h-12 text-[10px] font-bold uppercase tracking-widest">
                <SelectValue placeholder="Sem" />
              </SelectTrigger>
              <SelectContent className="glass border-white/10 rounded-2xl">
                {['1', '2'].map(s => (
                  <SelectItem key={s} value={s} className="text-[10px] font-bold py-3 uppercase">Sem {s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-8">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search modules, papers, notes..." 
              className="w-full bg-white/5 border border-white/5 rounded-[2rem] h-20 pl-16 pr-6 text-lg focus:ring-primary focus:border-primary transition-all shadow-xl"
            />
          </div>

          {/* Interactive Folder Cards (LECTURES / TUTORIALS / PAPERS) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <FolderCard 
              name="Lecture Notes" 
              count={lectureCount} 
              color="text-blue-400" 
              delay={0.1} 
              active={categoryFilter === "lecture"} 
              onClick={() => toggleCategoryFilter("lecture")}
            />
            <FolderCard 
              name="Tutorials" 
              count={tutorialCount} 
              color="text-purple-400" 
              delay={0.2} 
              active={categoryFilter === "tutorial"} 
              onClick={() => toggleCategoryFilter("tutorial")}
            />
            <FolderCard 
              name="Past Papers" 
              count={paperCount} 
              color="text-cyan-400" 
              delay={0.3} 
              active={categoryFilter === "paper"} 
              onClick={() => toggleCategoryFilter("paper")}
            />
          </div>

          <motion.div variants={container} initial="hidden" animate="show">
            <Card className="glass border-white/5 rounded-[3rem] overflow-hidden shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 bg-white/5 p-8">
                <CardTitle className="text-xl flex items-center gap-3 font-black italic">
                  <FileText className="w-6 h-6 text-primary" />
                  Segment Assets
                </CardTitle>
                <div className="flex gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full">
                    {filteredResources.length} Results
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <AnimatePresence mode="popLayout">
                  {filteredResources.length > 0 ? (
                    <div className="flex flex-col">
                      {filteredResources.map((file) => (
                        <motion.div 
                          key={file.id} 
                          variants={item}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <FileItem file={file} />
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-32 text-center flex flex-col items-center gap-6 text-muted-foreground"
                    >
                      <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center border border-white/5 mb-2">
                        <Layers className="w-10 h-10 opacity-20" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <p className="text-xl font-black italic text-white/60">No Specialized Assets</p>
                        <p className="text-sm font-medium italic">Adjust filters or search parameters to discover other files.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="col-span-12 lg:col-span-3 flex flex-col gap-8">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="glass border-white/5 rounded-[3rem] shadow-xl">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-lg flex items-center gap-2 font-black italic">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Trending
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 flex flex-col gap-6">
                <TrendingItem name="Exam_Guide_2024.pdf" stats="42 downloads" />
                <TrendingItem name="Formula_Sheet.pdf" stats="28 downloads" color="text-secondary" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <Card className="glass border-white/5 rounded-[3rem] shadow-xl">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-lg flex items-center gap-2 font-black italic">
                  <Clock className="w-5 h-5 text-accent" />
                  Vault Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 flex flex-col gap-6">
                <ActivityItem text={`Synchronised Y${year} S${semester} curriculum`} time="10m ago" />
                <ActivityItem text={`Viewed ${degree.toUpperCase()} Hub`} time="2h ago" />
                <ActivityItem text={`Downloaded ${degree.toUpperCase()} Notes`} time="4h ago" />
              </CardContent>
            </Card>
          </motion.div>
          
          <Button className="w-full h-20 rounded-[2.5rem] premium-gradient border-none font-black text-xs tracking-[0.3em] shadow-2xl active:scale-95 transition-all">
            UPLOAD NEW ASSET
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

function FolderCard({ name, count, color, delay, active, onClick }: { name: string, count: number, color: string, delay: number, active: boolean, onClick: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "glass p-8 rounded-[2.5rem] border transition-all cursor-pointer group shadow-lg flex flex-col justify-between min-h-[160px]",
        active 
          ? "border-primary bg-white/10 shadow-[0_0_20px_rgba(41,141,255,0.15)] scale-[1.03]" 
          : "border-white/5 hover:scale-[1.02] hover:bg-white/5"
      )}
    >
      <div className={cn("mb-6 group-hover:scale-110 transition-transform", color)}>
        <Folder className="w-12 h-12 fill-current opacity-20" />
      </div>
      <div>
        <h3 className="font-black text-xl italic tracking-tight">{name}</h3>
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">{count} items detected</p>
      </div>
    </motion.div>
  )
}

function FileItem({ file }: { file: any }) {
  return (
    <div className="flex items-center gap-6 px-8 py-6 hover:bg-white/5 transition-all border-t border-white/5 first:border-t-0 group">
      <div className="w-12 h-12 rounded-[1.25rem] bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
        <FileText className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <div className="flex flex-col flex-1 gap-1">
        <span className="font-black text-lg italic group-hover:text-white transition-colors">{file.name}</span>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-muted-foreground uppercase tracking-widest font-black">
          <span className="text-white/40">{file.type}</span>
          <span className="opacity-20">•</span>
          <span>{file.size}</span>
          <span className="opacity-20">•</span>
          <span className="text-primary/60">{file.module}</span>
          <span className="opacity-20">•</span>
          <span className="text-accent/60">S{file.semester}</span>
          <span className="opacity-20">•</span>
          <span className="text-green-500">{file.category.toUpperCase()}</span>
        </div>
      </div>
      <div className="flex items-center gap-8">
        <div className="hidden sm:flex items-center gap-1.5 text-muted-foreground">
          <Star className="w-4 h-4 fill-yellow-500/20 text-yellow-500" />
          <span className="text-xs font-black">{file.stars}</span>
        </div>
        <div className="flex gap-3">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-primary/20 hover:text-primary border border-transparent hover:border-primary/20">
              <Download className="w-5 h-5" />
            </Button>
          </motion.div>
          <Button variant="ghost" size="icon" className="w-10 h-10 rounded-xl hover:bg-white/10">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function TrendingItem({ name, stats, color = "text-primary" }: any) {
  return (
    <motion.div 
      whileHover={{ x: 8 }}
      className="flex items-center gap-4 group cursor-pointer"
    >
      <div className="relative shrink-0">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center bg-current opacity-10", color)} />
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center absolute inset-0", color)}>
          <FileText className="w-6 h-6" />
        </div>
      </div>
      <div className="flex flex-col text-sm gap-0.5">
        <span className="font-black italic group-hover:text-primary transition-colors tracking-tight truncate max-w-[140px]">{name}</span>
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stats}</span>
      </div>
    </motion.div>
  )
}

function ActivityItem({ text, time }: { text: string, time: string }) {
  return (
    <div className="flex flex-col gap-1.5 border-l border-white/5 pl-5 relative">
      <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_10px_rgba(255,59,48,0.5)]" />
      <p className="text-xs font-bold leading-relaxed text-white/80 italic">{text}</p>
      <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{time}</span>
    </div>
  )
}
