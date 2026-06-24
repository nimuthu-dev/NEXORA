'use client';

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Flame,
  Calendar as CalendarIcon,
  Library,
  Target,
  Bot,
  FileText,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Users,
  BookOpen,
  Plus,
  Trash2,
  BellRing,
  ThumbsUp,
  Sparkles,
  Sun,
  Moon,
  Send,
  ExternalLink,
  LineChart as ChartIcon,
  LogOut,
  GraduationCap,
  X,
  Award,
  BarChart2,
  Trophy,
  TrendingUp,
  ChevronRight,
  PlayCircle,
  Lock,
  BarChart3,
  Timer,
  Code,
  Cpu,
  Binary,
  Languages,
  Palette,
  ArrowLeft
} from "lucide-react"
import { nexoraAIChat } from "@/ai/flows/nexora-ai-chat"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import { cn } from "@/lib/utils"

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
}
const item = {
  hidden: { y: 15, opacity: 0 },
  show: { y: 0, opacity: 1 }
}

interface DeadlineItem {
  id: string;
  title: string;
  module: string;
  date: string;
  type: "deadline" | "evaluation";
  priority: "High" | "Medium" | "Low";
}
interface MarkItem {
  id: string;
  module: string;
  name: string;
  score: number;
}

const safeGetItem = (key: string): string | null => {
  try { if (typeof window !== "undefined" && window.localStorage) return localStorage.getItem(key); } catch (e) {}
  return null;
};
const safeSetItem = (key: string, value: string) => {
  try { if (typeof window !== "undefined" && window.localStorage) localStorage.setItem(key, value); } catch (e) {}
};
const safeRemoveItem = (key: string) => {
  try { if (typeof window !== "undefined" && window.localStorage) localStorage.removeItem(key); } catch (e) {}
};

const focusModulesData = [
  {
    code: "CS101", name: "Software Development",
    desc: "Python programming foundations, control flow, functions, lists, and file DBs.",
    type: "Core Module • Y1S1", color: "from-blue-500 to-indigo-600", iconName: "Code",
    resources: {
      lec: [
        { name: "SD_Lec01_Introduction.pdf", size: "1.1 MB", week: 1 },
        { name: "SD_Lec02_Variables_Types.pdf", size: "1.8 MB", week: 2 },
        { name: "SD_Lec03_Conditionals.pptx", size: "2.4 MB", week: 3 },
        { name: "SD_Lec04_Loops.pptx", size: "2.0 MB", week: 4 },
        { name: "SD_Lec05_User_Defined_Functions.pdf", size: "1.5 MB", week: 5 },
        { name: "SD_Lec06_Lists.pptx", size: "2.5 MB", week: 6 },
        { name: "SD_Lec07_Databases_SQLite.pdf", size: "335 KB", week: 7 },
        { name: "SD_Lec08_Strings.pdf", size: "1.2 MB", week: 8 },
        { name: "SD_Lec11_Revision.pptx", size: "176 KB", week: 11 }
      ],
      tut: [
        { name: "SD_Tutorial01_Syntax.pdf", size: "581 KB", week: 1 },
        { name: "SD_Tutorial02_Conditionals.pdf", size: "564 KB", week: 2 },
        { name: "SD_Tutorial03_Loops.pdf", size: "249 KB", week: 3 },
        { name: "SD_Tutorial04_Functions.pdf", size: "440 KB", week: 4 },
        { name: "SD_Tutorial05_Lists.pdf", size: "208 KB", week: 5 },
        { name: "SD_Tutorial07_Lists_Dicts.pdf", size: "298 KB", week: 7 },
        { name: "SD_Tutorial08_Strings.pdf", size: "460 KB", week: 8 },
        { name: "SD_Tutorial09_Databases_SQLite.pdf", size: "214 KB", week: 9 }
      ],
      rev: [
        { name: "Python_Hand_Written_Notes.pdf", size: "26.0 MB", week: 11 },
        { name: "Python_Revision_Material.docx", size: "29 KB", week: 11 },
        { name: "Python_Revision_Part2.docx", size: "12 KB", week: 11 },
        { name: "SD_Lec11_Revision.pptx", size: "176 KB", week: 11 }
      ]
    }
  },
  {
    code: "CS102", name: "Computer Systems Fundamentals",
    desc: "System architectures, logic gates, Boolean algebra, assembly, and registers.",
    type: "Core Module • Y1S1", color: "from-purple-500 to-pink-600", iconName: "Cpu",
    resources: {
      lec: [
        { name: "CSF_Lecture_1_Part_1_of_2.pdf", size: "170 KB", week: 1 },
        { name: "CSF_Lecture_1_Part_2_of_2.pdf", size: "106 KB", week: 1 },
        { name: "CSF_Lecture2_Part_1_of_2.pdf", size: "112 KB", week: 2 },
        { name: "CSF_Binary_Operations.pdf", size: "135 KB", week: 3 },
        { name: "CSF_Range_of_Values_Unsigned.pdf", size: "161 KB", week: 3 },
        { name: "CSF_Signed_Integers.pdf", size: "313 KB", week: 4 },
        { name: "CSF_Real_values_in_Binary_2.pdf", size: "332 KB", week: 5 },
        { name: "CSF_1_Data_Storage.pdf", size: "97 KB", week: 7 },
        { name: "CSF_2_Character_Codes.pdf", size: "1.0 MB", week: 8 },
        { name: "CSF_3_Images.pdf", size: "149 KB", week: 9 },
        { name: "CSF_File_Systems.pdf", size: "360 KB", week: 10 },
        { name: "CSF_Operating_Systems.pdf", size: "1.3 MB", week: 10 },
        { name: "CSF_File_Types.pdf", size: "783 KB", week: 11 },
        { name: "CSF_Networking.pdf", size: "591 KB", week: 12 }
      ],
      tut: [
        { name: "CSF_Tutorial_Bicimal.pdf", size: "101 KB", week: 2 },
        { name: "CSF_Tutorial_IEEE_754_Standard.pdf", size: "98 KB", week: 5 },
        { name: "CSF_Tutorial_IEEE_754_Solutions.pdf", size: "3 KB", week: 5 },
        { name: "CSF_Tutorial_DSZ_dd.pdf", size: "12 KB", week: 8 },
        { name: "CSF_Tutorial_OS_QA.pdf", size: "5 KB", week: 10 }
      ]
    }
  },
  {
    code: "MA101", name: "Mathematics",
    desc: "Discrete structures, set theory, functions, proofs, relations, and matrices.",
    type: "Core Module • Y1S1", color: "from-orange-500 to-red-600", iconName: "Binary",
    resources: {
      lec: [
        { name: "MathsComp_Lecture1.pdf", size: "19.0 MB", week: 1 },
        { name: "MathsComp_Lecture2.pdf", size: "2.8 MB", week: 2 },
        { name: "MathsComp_Lecture3.pdf", size: "9.6 MB", week: 3 },
        { name: "MathsComp_Lecture4.pdf", size: "2.7 MB", week: 4 },
        { name: "MathsComp_Lecture5.pdf", size: "11.0 MB", week: 5 },
        { name: "MathsComp_Lecture7.pdf", size: "2.9 MB", week: 7 },
        { name: "MathsComp_Lecture8.pdf", size: "533 KB", week: 8 },
        { name: "MathsComp_Lecture10.pdf", size: "665 KB", week: 9 },
        { name: "MathsComp_Lecture09.pdf", size: "2.8 MB", week: 10 },
        { name: "MathsComp_Lecture11.pdf", size: "2.9 MB", week: 11 }
      ],
      tut: [
        { name: "SeminarTasks0_MathComp.pdf", size: "1.0 MB", week: 2 },
        { name: "SeminarTasks1_MathComp.pdf", size: "114 KB", week: 2 },
        { name: "SeminarTasks2_MathComp.pdf", size: "620 KB", week: 3 },
        { name: "SeminarTasks3_MathComp.pdf", size: "142 KB", week: 4 },
        { name: "SeminarTasks4_MathComp.pdf", size: "545 KB", week: 5 },
        { name: "SeminarTasks7_MathComp.pdf", size: "393 KB", week: 7 },
        { name: "SeminarTasks7_MathComp_Solutions.docx", size: "1.2 MB", week: 7 },
        { name: "SeminarTasks8_MathComp.pdf", size: "124 KB", week: 8 },
        { name: "SeminarTasks9_MathComp_Solutions.docx", size: "41 KB", week: 8 },
        { name: "SeminarTasks09_MathComp.pdf", size: "111 KB", week: 9 },
        { name: "SeminarTasks10_MathComp_Solutions.docx", size: "56 KB", week: 10 },
        { name: "SeminarTasks11_MathComp.pdf", size: "543 KB", week: 11 }
      ],
      rev: [
        { name: "MathComp_MockExamPaper_2024.pdf", size: "474 KB", week: 11 }
      ]
    }
  },
  {
    code: "EN101", name: "English Module",
    desc: "Academic literacy, communication, writing conventions, and presentation skills.",
    type: "Required • Y1S1", color: "from-cyan-500 to-teal-600", iconName: "Languages",
    resources: {
      lec: [
        { name: "English_Lec01_Academic_Writing.pdf", size: "3.2 MB", week: 1 },
        { name: "English_Presentation_Rubric.pdf", size: "1.5 MB", week: 2 }
      ],
      tut: [{ name: "English_Tutorial01_Grammar.pdf", size: "900 KB", week: 1 }]
    }
  },
  {
    code: "DS101", name: "Design Module",
    desc: "Algorithms, Software Development Life Cycle (SDLC), Program Design, and Flowcharts.",
    type: "Elective • Y1S1", color: "from-green-500 to-emerald-600", iconName: "Palette",
    resources: {
      lec: [
        { name: "Design_Lecture1_Algorithms.pdf", size: "382 KB", week: 1 },
        { name: "Design_Lecture2_SDLC.pdf", size: "719 KB", week: 2 },
        { name: "Design_Lecture2_Program_Design.pdf", size: "177 KB", week: 2 },
        { name: "Design_Lecture3_Program_Design.pdf", size: "177 KB", week: 3 }
      ],
      tut: [
        { name: "Design_Tutorial1_Algorithms.pdf", size: "87 KB", week: 1 },
        { name: "Design_Tutorial2_Flowcharts.pdf", size: "107 KB", week: 2 }
      ]
    }
  }
];

const mockPdfStudyData: Record<string, { summary: string; quiz: { question: string; options: string[]; answer: number; explanation: string; }[]; qaKeywords: { keywords: string[]; answer: string }[]; }> = {
  "SD_Lec01_Introduction.pdf": {
    summary: "Introduction to Python, compiler vs interpreter differences, and basic print outputs.",
    quiz: [
      { question: "Is Python a compiled or interpreted language?", options: ["Strictly compiled", "Interpreted", "Neither", "Assembly only"], answer: 1, explanation: "Python is primarily an interpreted language — the interpreter reads and executes code line by line at runtime." },
      { question: "Which is a valid Python variable name?", options: ["2myVar", "my-var", "_my_var", "my var"], answer: 2, explanation: "Variable names must start with a letter or underscore, and can contain letters, digits, and underscores." },
      { question: "What is the output of print(type(10.5))?", options: ["<class 'int'>", "<class 'str'>", "<class 'float'>", "<class 'boolean'>"], answer: 2, explanation: "10.5 is a decimal number, which belongs to the floating-point type ('float') in Python." }
    ],
    qaKeywords: [
      { keywords: ["compiled", "interpreted", "compiler", "interpreter"], answer: "Python is an interpreted language. Source code is compiled to bytecode (.pyc) then run by the Python Virtual Machine (PVM)." },
      { keywords: ["print", "output"], answer: "The print() function sends outputs to the console. E.g. print('Hello World') outputs Hello World." }
    ]
  },
  "SD_Lec02_Variables_Types.pdf": {
    summary: "Python primitive data types (integers, floats, strings, booleans) and assignment operators.",
    quiz: [
      { question: "How do you declare a string variable in Python?", options: ["x = 'Hello'", "string x = 'Hello'", "x = string('Hello')", "decl x = 'Hello'"], answer: 0, explanation: "Python has dynamic typing; assigning a string value in single or double quotes automatically sets the variable type." },
      { question: "What does 10 // 3 evaluate to?", options: ["3.333...", "3", "1", "0"], answer: 1, explanation: "The // operator performs floor division, discarding the fractional part." },
      { question: "Which type represents truth values in Python?", options: ["String", "Int", "Boolean", "Float"], answer: 2, explanation: "Boolean (bool) type represents truth values: True or False." }
    ],
    qaKeywords: [{ keywords: ["division", "floor", "//"], answer: "SD Lec 02 explains // is floor division: 11 // 3 = 3. The / operator returns a float: 11 / 3 = 3.666..." }]
  },
  "SD_Lec03_Conditionals.pptx": {
    summary: "Conditional branching structures, if-elif-else logic, and relational/logical operators.",
    quiz: [
      { question: "What does 'elif' stand for in Python?", options: ["else if", "either if", "element if", "equal if"], answer: 0, explanation: "In Python, 'elif' is the keyword for 'else if'." },
      { question: "Which operator is used to check equality?", options: ["=", "==", "===", "is"], answer: 1, explanation: "The == operator compares values for equality, whereas = is for assignment." }
    ],
    qaKeywords: [{ keywords: ["conditional", "elif", "else"], answer: "SD Lec 03 covers conditionals. Use 'if condition:' followed by optional 'elif condition:' and 'else:' to direct control flow." }]
  },
  "SD_Lec04_Loops.pptx": {
    summary: "Iterative execution loops, while loops, for loops with range(), and loop control keywords.",
    quiz: [
      { question: "Which keyword exits the current loop immediately?", options: ["continue", "break", "exit", "pass"], answer: 1, explanation: "The 'break' statement terminates the loop containing it." },
      { question: "What is range(3) equivalent to?", options: ["[1, 2, 3]", "[0, 1, 2]", "[0, 1, 2, 3]", "[1, 2]"], answer: 1, explanation: "The range(n) function generates a sequence from 0 up to (but not including) n." }
    ],
    qaKeywords: [{ keywords: ["loop", "for", "while", "break"], answer: "SD Lec 04 details loop statements. 'for' iterates over a sequence, 'while' repeats based on a condition, 'break' exits, 'continue' skips to the next iteration." }]
  },
  "SD_Lec05_User_Defined_Functions.pdf": {
    summary: "Modular code design using user-defined functions, parameters, return statements, and variable scope rules.",
    quiz: [
      { question: "Which keyword is used to define a custom function?", options: ["func", "def", "function", "define"], answer: 1, explanation: "In Python, custom functions are declared using the 'def' keyword." },
      { question: "How do you make a local variable modifiable globally?", options: ["Use the global keyword", "Define it outside the function", "Use var", "It is done automatically"], answer: 0, explanation: "The 'global' keyword allows you to modify a variable in the outer global scope from within a function." }
    ],
    qaKeywords: [{ keywords: ["function", "def", "return", "scope"], answer: "SD Lec 05 details functions. Define them with 'def', pass parameters, return values with 'return', and manage local/global scopes." }]
  },
  "SD_Lec06_Lists.pptx": {
    summary: "Sequences, list creation, append/insert/remove methods, list slicing, and basic list traversals.",
    quiz: [
      { question: "What is the result of [1, 2] + [3]?", options: ["[1, 2, 3]", "[4, 5]", "Error", "[6]"], answer: 0, explanation: "The + operator concatenates lists in Python, returning a new single list." },
      { question: "Which list method adds an element to the end?", options: ["add()", "push()", "append()", "insert()"], answer: 2, explanation: "The append() method appends an object to the end of the list." }
    ],
    qaKeywords: [{ keywords: ["list", "append", "slice", "tuple"], answer: "SD Lec 06 details lists. Lists are mutable ordered sequences defined with []. You can slice them using list[start:end] and append with append()." }]
  },
  "SD_Lec07_Databases_SQLite.pdf": {
    summary: "Lightweight relational databases using SQLite, executing SQL queries, database connections, and cursors.",
    quiz: [
      { question: "Which built-in Python module is used for SQLite?", options: ["sqlite", "db3", "sqlite3", "sqlitedb"], answer: 2, explanation: "Python provides built-in support for SQLite databases via the 'sqlite3' module." },
      { question: "What must you call to save changes to the database?", options: ["conn.save()", "conn.commit()", "conn.update()", "conn.close()"], answer: 1, explanation: "You must call conn.commit() to commit the current transaction and save changes." }
    ],
    qaKeywords: [{ keywords: ["database", "sqlite", "sql", "cursor"], answer: "SD Lec 07 explains SQLite database connection using sqlite3.connect(), cursors for query execution, committing with conn.commit(), and fetchall()." }]
  },
  "SD_Lec08_Strings.pdf": {
    summary: "Text processing in Python, string indexing and slicing, string immutability, and built-in text methods.",
    quiz: [
      { question: "Are strings in Python mutable?", options: ["Yes", "No", "Only if declared globally", "Only numbers"], answer: 1, explanation: "Strings are immutable in Python; you cannot change individual characters in place." },
      { question: "Which method removes leading and trailing whitespace?", options: ["trim()", "strip()", "clean()", "replace()"], answer: 1, explanation: "The strip() method returns a copy of the string with leading and trailing characters (default whitespace) removed." }
    ],
    qaKeywords: [{ keywords: ["string", "strip", "split", "slice"], answer: "SD Lec 08 details strings. Strings are immutable sequences of characters. Access characters by index, slice with string[start:end], and format with f-strings." }]
  },
  "CSF_Lecture_1_Part_1_of_2.pdf": {
    summary: "Core system concepts, logic structures, Boolean values, and basic gate representations.",
    quiz: [
      { question: "Which gate outputs 1 only when both inputs are 1?", options: ["OR", "AND", "XOR", "NAND"], answer: 1, explanation: "The AND gate outputs true (1) if and only if all inputs are true." },
      { question: "Binary representation of decimal 5?", options: ["011", "101", "110", "111"], answer: 1, explanation: "Decimal 5 = 101 in binary (4+0+1)." },
      { question: "What does Boolean Algebra deal with?", options: ["Real numbers", "Complex variables", "Binary variables (0 and 1)", "Differential equations"], answer: 2, explanation: "Boolean algebra deals with binary variables that have values: true (1) and false (0)." }
    ],
    qaKeywords: [{ keywords: ["gate", "and", "or", "xor"], answer: "In CSF Lec 01, AND yields 1 only when all inputs are 1. OR yields 1 if any input is 1. XOR yields 1 if inputs differ." }]
  },
  "Maths_Lec02_Set_Theory.pdf": {
    summary: "Mathematical foundations of Set Theory, unions, intersections, and Cartesian products.",
    quiz: [
      { question: "If A={1,2} and B={2,3}, what is A∩B?", options: ["{1,2,3}", "{2}", "{1,3}", "Ø"], answer: 1, explanation: "Intersection (∩) contains elements common to both sets. Only 2 is in both A and B." },
      { question: "Cardinality of the power set of a 3-element set?", options: ["3", "6", "8", "9"], answer: 2, explanation: "Power set of n elements has 2^n elements. For n=3, 2^3 = 8." },
      { question: "Which operation combines all elements of A and B?", options: ["Intersection", "Difference", "Union", "Complement"], answer: 2, explanation: "Union (∪) gathers all elements that belong to A, B, or both." }
    ],
    qaKeywords: [{ keywords: ["union", "intersection", "cardinality"], answer: "Maths Lec 02: Union (∪) aggregates all elements, Intersection (∩) selects common elements, Cardinality (|A|) is the set size." }]
  },
  "Python_Hand_Written_Notes.pdf": {
    summary: "Comprehensive handwritten revision notes covering core Python programming, syntax rules, functional blocks, and list/database methods.",
    quiz: [
      { question: "Which symbol starts a comment in Python?", options: ["//", "#", "/*", "<!--"], answer: 1, explanation: "Python comments start with the hash character (#) and extend to the end of the physical line." },
      { question: "What is the correct way to output 'Hello' in Python?", options: ["print('Hello')", "echo('Hello')", "system.out.print('Hello')", "Console.WriteLine('Hello')"], answer: 0, explanation: "The print() function is the standard output statement in Python." }
    ],
    qaKeywords: [
      { keywords: ["comment", "#"], answer: "In Python, single-line comments are created using the hash (#) character." },
      { keywords: ["notes", "handwritten"], answer: "These handwritten notes cover Python essentials like loops, conditions, functions, and list operations." }
    ]
  },
  "Python_Revision_Material.docx": {
    summary: "Core Python syntax review sheet, containing standard checklist items, variables, list functions, and control flow references.",
    quiz: [
      { question: "Which list method inserts an element at a specific index?", options: ["append()", "add()", "insert()", "push()"], answer: 2, explanation: "The insert(index, element) method inserts an element at a given index." }
    ],
    qaKeywords: [
      { keywords: ["revision", "checklist", "material"], answer: "This revision material covers high-level concepts for your Python exam, including lists, functions, loops, and conditions." }
    ]
  },
  "Python_Revision_Part2.docx": {
    summary: "Advanced Python practice exercises, covering relational databases, file handling, string operations, and debugging tips.",
    quiz: [
      { question: "Which mode is used to append data to a text file in Python?", options: ["'r'", "'w'", "'a'", "'x'"], answer: 2, explanation: "File mode 'a' stands for append, which adds text to the end of the file." }
    ],
    qaKeywords: [
      { keywords: ["practice", "exercise", "part 2"], answer: "Part 2 covers database connections using SQLite, text file I/O operations, and basic code debugging techniques." }
    ]
  },
  "SD_Tutorial07_Lists_Dicts.pdf": {
    summary: "Python lists and dictionaries tutorial sheet covering indexing, loops, insertions, deletions, and key-value pair operations.",
    quiz: [
      { question: "Which brackets are used to declare a dictionary in Python?", options: ["[]", "{}", "()", "<>"], answer: 1, explanation: "Dictionaries are created using curly brackets {} in Python." },
      { question: "How do you retrieve the keys of a dictionary d?", options: ["d.all_keys()", "d.get_keys()", "d.keys()", "d.names()"], answer: 2, explanation: "The d.keys() method returns a view object containing the keys of the dictionary." }
    ],
    qaKeywords: [
      { keywords: ["dictionary", "dict", "key", "value"], answer: "Dictionaries store data in key-value pairs. Keys must be unique and immutable, values can be of any type." }
    ]
  },
  "SD_Tutorial08_Strings.pdf": {
    summary: "Strings coding exercises covering indexing, slicing, custom validations, immutability, and string manipulations.",
    quiz: [
      { question: "What is the output of 'hello'[1:3]?", options: ["he", "ell", "el", "lo"], answer: 2, explanation: "Slicing string[1:3] returns characters at index 1 and 2, which are 'e' and 'l'." },
      { question: "Which method converts a string to all lowercase?", options: ["lower()", "down()", "toLower()", "casefold()"], answer: 0, explanation: "The lower() method returns the lowercased string." }
    ],
    qaKeywords: [
      { keywords: ["string", "slice", "index"], answer: "Strings are ordered immutable sequences. Slicing syntax is string[start:end:step]." }
    ]
  },
  "SD_Tutorial09_Databases_SQLite.pdf": {
    summary: "Relational database implementation using SQLite, executing CREATE/INSERT/SELECT statements, and handling database connections.",
    quiz: [
      { question: "Which SQL statement is used to retrieve data from a database?", options: ["GET", "SELECT", "RETRIEVE", "FETCH"], answer: 1, explanation: "SELECT is the standard SQL statement to query and retrieve data." },
      { question: "What cursor method retrieves all results of a query?", options: ["fetch()", "fetchall()", "get_all()", "read()"], answer: 1, explanation: "fetchall() returns all rows of a query result set." }
    ],
    qaKeywords: [
      { keywords: ["sqlite3", "connect", "sql"], answer: "Use sqlite3.connect('db_name') to connect and cursor.execute() to run SQL statements." }
    ]
  },
  "MathsComp_Lecture1.pdf": {
    summary: "Intro to Matrices, matrix elements, dimensions, row/column vectors, transpose, and identity matrices.",
    quiz: [
      { question: "What is the transpose of a row matrix?", options: ["A column matrix", "A square matrix", "A scalar", "An identity matrix"], answer: 0, explanation: "Transposing a row matrix swaps its single row with a single column, yielding a column matrix." },
      { question: "What represents an identity matrix?", options: ["All elements are 1", "All elements are 0", "Diagonal elements are 1, others are 0", "Anti-diagonal elements are 1"], answer: 2, explanation: "An identity matrix is a square matrix with 1s on the main diagonal and 0s elsewhere." }
    ],
    qaKeywords: [{ keywords: ["matrix", "transpose", "identity"], answer: "Maths Lecture 1 covers matrix definition, transpose operation (swapping rows/columns), and identity matrices." }]
  },
  "MathsComp_Lecture2.pdf": {
    summary: "Matrix multiplication properties, transposing products, symmetric and skew-symmetric matrices.",
    quiz: [
      { question: "If A is symmetric, which is true?", options: ["A = -A", "A = A^T", "A is identity", "A is singular"], answer: 1, explanation: "A symmetric matrix is equal to its transpose (A = A^T)." },
      { question: "Is matrix multiplication generally commutative (AB = BA)?", options: ["Always", "Never", "Generally no", "Only for 2x2 matrices"], answer: 2, explanation: "Matrix multiplication is not generally commutative: AB does not equal BA in most cases." }
    ],
    qaKeywords: [{ keywords: ["multiplication", "symmetric", "skew-symmetric"], answer: "Maths Lecture 2 covers matrix multiplication rules, symmetric (A = A^T) and skew-symmetric (A = -A^T) properties." }]
  },
  "MathsComp_Lecture3.pdf": {
    summary: "Determinants, minors, cofactors, adjoints, matrix inversion, and solving systems of equations via Cramer's rule.",
    quiz: [
      { question: "Which matrix has no inverse?", options: ["Identity matrix", "Symmetric matrix", "Singular matrix (determinant = 0)", "Orthogonal matrix"], answer: 2, explanation: "A matrix is invertible if and only if its determinant is non-zero. Singular matrices have det = 0, so no inverse." },
      { question: "Cramer's rule is used for solving?", options: ["Integration", "Systems of linear equations", "Vector products", "Matrix eigenvalues"], answer: 1, explanation: "Cramer's rule is an explicit formula for the solution of a system of linear equations using determinants." }
    ],
    qaKeywords: [{ keywords: ["determinant", "inverse", "cramer", "adjoint"], answer: "Maths Lecture 3 covers determinant calculations, finding inverses via adjoints, and Cramer's rule for linear systems." }]
  },
  "MathsComp_Lecture4.pdf": {
    summary: "Vector mathematics, magnitude, unit vectors, scalar (dot) products, and vector (cross) products.",
    quiz: [
      { question: "What is the dot product of two perpendicular vectors?", options: ["1", "0", "Product of magnitudes", "Infinity"], answer: 1, explanation: "The dot product of perpendicular vectors is 0, since cos(90°) = 0." },
      { question: "What does the cross product of two vectors yield?", options: ["A scalar", "A vector perpendicular to both", "A unit vector", "An angle"], answer: 1, explanation: "The cross product yields a vector that is perpendicular to both original vectors." }
    ],
    qaKeywords: [{ keywords: ["vector", "dot product", "cross product", "magnitude"], answer: "Maths Lecture 4 covers vectors, vector addition, magnitude calculations, unit vectors, and dot/cross product definitions." }]
  },
  "MathsComp_Lecture5.pdf": {
    summary: "Complex numbers in standard, polar, and exponential forms, arithmetic operations, conjugates, and Euler's formula.",
    quiz: [
      { question: "What is the value of i^2?", options: ["1", "-1", "0", "sqrt(-1)"], answer: 1, explanation: "By definition, the imaginary unit i is the square root of -1, so i^2 = -1." },
      { question: "What is Euler's formula?", options: ["e^(ix) = cos(x) + i sin(x)", "e^(ix) = sin(x) + i cos(x)", "e^x = 1 + x", "a^2 + b^2 = c^2"], answer: 0, explanation: "Euler's formula states that e^(ix) = cos(x) + i sin(x)." }
    ],
    qaKeywords: [{ keywords: ["complex number", "conjugate", "euler", "polar form"], answer: "Maths Lecture 5 covers complex number algebra, polar representations, complex conjugates, and Euler's formula." }]
  },
  "MathsComp_Lecture7.pdf": {
    summary: "Arithmetic and geometric progressions, summation of sequences, and infinite geometric series convergence.",
    quiz: [
      { question: "Formula for the n-th term of an Arithmetic Progression?", options: ["a + nd", "a + (n-1)d", "a * r^(n-1)", "n/2 * (2a + d)"], answer: 1, explanation: "The n-th term of an AP is given by a + (n-1)d, where a is the first term and d is the common difference." },
      { question: "When does an infinite geometric series converge?", options: ["|r| > 1", "|r| < 1", "r = 1", "r = -1"], answer: 1, explanation: "An infinite geometric series converges if and only if the absolute value of the common ratio r is less than 1." }
    ],
    qaKeywords: [{ keywords: ["progression", "arithmetic", "geometric", "series"], answer: "Maths Lecture 7 covers arithmetic progression (AP), geometric progression (GP), sequence summing, and infinite series convergence limits." }]
  },
  "MathsComp_Lecture8.pdf": {
    summary: "Mathematical functions, domain and range, one-to-one (injective), onto (surjective), composite, and inverse functions.",
    quiz: [
      { question: "What is a bijective function?", options: ["One-to-one only", "Onto only", "Both one-to-one and onto", "Neither"], answer: 2, explanation: "A bijection is a function that is both injective (one-to-one) and surjective (onto)." },
      { question: "What is the composite function of f(x) and g(x)?", options: ["f(x) + g(x)", "f(g(x))", "f(x) * g(x)", "g(f(x))"], answer: 1, explanation: "The composition of f and g is denoted by (f ∘ g)(x) = f(g(x))." }
    ],
    qaKeywords: [{ keywords: ["function", "domain", "range", "injective", "surjective", "bijective"], answer: "Maths Lecture 8 covers mathematical functions, domain/range concepts, injectivity, surjectivity, composition, and inverse function parameters." }]
  },
  "MathsComp_Lecture10.pdf": {
    summary: "Calculus limits, left-hand and right-hand limits, limit existence criteria, and algebraic limit evaluation strategies.",
    quiz: [
      { question: "When does a limit of f(x) exist at x=a?", options: ["f(a) is defined", "Left limit equals right limit", "Limit is infinity", "f(x) is continuous"], answer: 1, explanation: "A limit exists at x=a if and only if the left-hand limit equals the right-hand limit as x approaches a." },
      { question: "What is the limit of sin(x)/x as x approaches 0?", options: ["0", "1", "Undefined", "Infinity"], answer: 1, explanation: "The standard trigonometric limit limit_{x -> 0} sin(x)/x is equal to 1." }
    ],
    qaKeywords: [{ keywords: ["limit", "calculus", "existence"], answer: "Maths Lecture 10 covers calculus limits, evaluating limits using algebraic techniques, and left/right limits check." }]
  },
  "MathsComp_Lecture09.pdf": {
    summary: "Calculus derivatives, differentiation from first principles, product/quotient rules, and chain rule operations.",
    quiz: [
      { question: "What is the derivative of x^n?", options: ["n * x^(n-1)", "x^(n-1)", "n * x^n", "n * x^(n+1)"], answer: 0, explanation: "The power rule states that d/dx(x^n) = n * x^(n-1)." },
      { question: "Which rule differentiates f(g(x))?", options: ["Product rule", "Quotient rule", "Chain rule", "Power rule"], answer: 2, explanation: "The chain rule is used to differentiate composite functions: d/dx[f(g(x))] = f'(g(x)) * g'(x)." }
    ],
    qaKeywords: [{ keywords: ["derivative", "differentiation", "chain rule", "product rule", "quotient rule"], answer: "Maths Lecture 9 covers differential calculus, first principles definition, and standard differentiation rules (product, quotient, chain)." }]
  },
  "MathsComp_Lecture11.pdf": {
    summary: "Integral calculus, indefinite integrals, integration by substitution, integration by parts, and definite integrals.",
    quiz: [
      { question: "What is the integral of 1/x?", options: ["ln|x| + C", "x^0 + C", "-1/x^2 + C", "e^x + C"], answer: 0, explanation: "The indefinite integral of 1/x is natural log of absolute value of x plus integration constant (ln|x| + C)." },
      { question: "Integration by parts is derived from which rule?", options: ["Chain rule", "Product rule of differentiation", "Quotient rule", "Power rule"], answer: 1, explanation: "Integration by parts is the integral counterpart of the product rule for differentiation." }
    ],
    qaKeywords: [{ keywords: ["integral", "integration", "parts", "substitution", "definite integral"], answer: "Maths Lecture 11 covers integral calculus, anti-derivatives, integration methods (substitution and integration by parts), and definite integral calculations." }]
  },
  "SeminarTasks0_MathComp.pdf": {
    summary: "Matrices and systems of linear equations seminar tasks.",
    quiz: [
      { question: "What is a system of linear equations with no solution called?", options: ["Consistent", "Inconsistent", "Dependent", "Homogeneous"], answer: 1, explanation: "A system of equations that has no solution is inconsistent." }
    ],
    qaKeywords: [{ keywords: ["system", "equations", "linear"], answer: "Seminar Tasks 0 covers representing systems of linear equations using augmented matrices." }]
  },
  "SeminarTasks1_MathComp.pdf": {
    summary: "Matrix multiplication and transpose properties practice exercises.",
    quiz: [
      { question: "For matrix multiplication AB to be defined, what must match?", options: ["Rows of A and columns of B", "Columns of A and rows of B", "Dimensions of both matrices", "Determinants of both"], answer: 1, explanation: "AB is defined if the number of columns in A matches the number of rows in B." }
    ],
    qaKeywords: [{ keywords: ["multiplication", "transpose"], answer: "Seminar Tasks 1 covers matrix multiplication calculations and properties of transposing matrix sums." }]
  },
  "SeminarTasks2_MathComp.pdf": {
    summary: "Determinants, inverse of a matrix, and Cramer's rule tasks.",
    quiz: [
      { question: "How is the determinant of a 2x2 matrix [[a,b],[c,d]] calculated?", options: ["ad + bc", "ad - bc", "ab - cd", "ac - bd"], answer: 1, explanation: "The determinant of a 2x2 matrix is ad - bc." }
    ],
    qaKeywords: [{ keywords: ["determinant", "cramer", "inverse"], answer: "Seminar Tasks 2 covers calculating 2x2 and 3x3 determinants, computing inverse matrices, and applying Cramer's rule." }]
  },
  "SeminarTasks3_MathComp.pdf": {
    summary: "Vector representations, dot products, and cross products problems.",
    quiz: [
      { question: "What is the dot product of [1, 2] and [3, 4]?", options: ["11", "14", "10", "2"], answer: 0, explanation: "Dot product = 1*3 + 2*4 = 3 + 8 = 11." }
    ],
    qaKeywords: [{ keywords: ["vector", "dot", "cross"], answer: "Seminar Tasks 3 covers vector magnitude, direction cosines, dot products, and cross products." }]
  },
  "SeminarTasks4_MathComp.pdf": {
    summary: "Complex numbers standard, polar form, and Euler's formula tasks.",
    quiz: [
      { question: "What is the polar form representation of a complex number z?", options: ["r(cos θ + i sin θ)", "r(sin θ + i cos θ)", "r * e^θ", "a + bi"], answer: 0, explanation: "The polar form of z = a + bi is z = r(cos θ + i sin θ), where r is the modulus and θ is the argument." }
    ],
    qaKeywords: [{ keywords: ["complex", "polar", "euler"], answer: "Seminar Tasks 4 covers arithmetic of complex numbers, plotting on the Argand diagram, and conversions to polar form." }]
  },
  "SeminarTasks7_MathComp.pdf": {
    summary: "Arithmetic and geometric progression sequences and series exercises.",
    quiz: [
      { question: "What is the common ratio of the geometric progression 2, 6, 18, 54...?", options: ["3", "4", "2", "6"], answer: 0, explanation: "The common ratio r is obtained by dividing any term by its preceding term: 6 / 2 = 3." }
    ],
    qaKeywords: [{ keywords: ["progression", "arithmetic", "geometric"], answer: "Seminar Tasks 7 covers solving sequence terms and sum limits for arithmetic and geometric progressions." }]
  },
  "SeminarTasks7_MathComp_Solutions.docx": {
    summary: "Detailed solutions for AP and GP progressions tutorial tasks.",
    quiz: [
      { question: "What is the sum of an infinite geometric progression with a=10 and r=0.5?", options: ["15", "20", "30", "10"], answer: 1, explanation: "Sum S = a / (1 - r) = 10 / (1 - 0.5) = 10 / 0.5 = 20." }
    ],
    qaKeywords: [{ keywords: ["solutions", "progressions", "gp", "ap"], answer: "This document provides step-by-step solutions for arithmetic and geometric progression sums." }]
  },
  "SeminarTasks8_MathComp.pdf": {
    summary: "Functions domain/range, bijective properties, composite, and inverse function exercises.",
    quiz: [
      { question: "What is the inverse function of f(x) = 2x + 3?", options: ["(x - 3)/2", "2x - 3", "x/2 - 3", "3x + 2"], answer: 0, explanation: "Solving y = 2x + 3 for x yields x = (y - 3)/2. Thus, the inverse is (x - 3)/2." }
    ],
    qaKeywords: [{ keywords: ["function", "inverse", "composite"], answer: "Seminar Tasks 8 covers function mapping classifications, composite function calculations, and proving injectivity." }]
  },
  "SeminarTasks9_MathComp_Solutions.docx": {
    summary: "Detailed solutions for limits, left-hand/right-hand limits calculus questions.",
    quiz: [
      { question: "What is the limit of (x^2 - 1)/(x - 1) as x approaches 1?", options: ["1", "2", "0", "Undefined"], answer: 1, explanation: "Factoring the numerator: (x - 1)(x + 1)/(x - 1) = x + 1. The limit as x approaches 1 is 1 + 1 = 2." }
    ],
    qaKeywords: [{ keywords: ["solutions", "limits", "calculus"], answer: "This document contains detailed worked solutions for evaluating algebraic and trigonometric limits." }]
  },
  "SeminarTasks09_MathComp.pdf": {
    summary: "Limits evaluation and calculus foundations tutorial sheet.",
    quiz: [
      { question: "If the left limit of f(x) as x->a is 5, and the right limit is 6, what is the limit?", options: ["5.5", "5", "6", "Does not exist"], answer: 3, explanation: "A limit exists if and only if the left-hand limit is equal to the right-hand limit." }
    ],
    qaKeywords: [{ keywords: ["limits", "calculus", "existence"], answer: "Seminar Tasks 9 covers finding limits algebraically, checking continuity, and graphing boundary limits." }]
  },
  "SeminarTasks10_MathComp_Solutions.docx": {
    summary: "Detailed solutions for derivative rules, chain rule, and first principles calculus questions.",
    quiz: [
      { question: "What is the derivative of e^(2x)?", options: ["e^(2x)", "2 * e^(2x)", "2x * e^(2x-1)", "0.5 * e^(2x)"], answer: 1, explanation: "Applying the chain rule: d/dx[e^(2x)] = e^(2x) * d/dx(2x) = 2 * e^(2x)." }
    ],
    qaKeywords: [{ keywords: ["solutions", "derivatives", "chain rule"], answer: "This document contains detailed worked solutions for product, quotient, and chain rule differentiation questions." }]
  },
  "SeminarTasks11_MathComp.pdf": {
    summary: "Integral calculus, indefinite/definite integrals, integration by parts and substitution sheet.",
    quiz: [
      { question: "What is the integral of cos(x)?", options: ["sin(x) + C", "-sin(x) + C", "cos(x) + C", "-cos(x) + C"], answer: 0, explanation: "The integral of cos(x) is sin(x) + C, since the derivative of sin(x) is cos(x)." }
    ],
    qaKeywords: [{ keywords: ["integral", "integration", "parts", "substitution"], answer: "Seminar Tasks 11 covers indefinite/definite integrals, using u-substitution, and integration by parts." }]
  },
  "MathComp_MockExamPaper_2024.pdf": {
    summary: "Official 2024 Mathematics Mock Exam Paper covering matrices, vectors, complex numbers, progressions, and calculus.",
    quiz: [
      { question: "What is the modulus of the complex number 3 + 4i?", options: ["5", "7", "25", "1"], answer: 0, explanation: "The modulus r = sqrt(3^2 + 4^2) = sqrt(9 + 16) = sqrt(25) = 5." }
    ],
    qaKeywords: [{ keywords: ["mock", "exam", "paper", "revision"], answer: "This is the official mock paper for Mathematics, testing all first-semester syllabus modules." }]
  },
  "Design_Lecture1_Algorithms.pdf": {
    summary: "Step-by-step logic design, properties of algorithms, and basic algorithmic problem solving.",
    quiz: [
      { question: "Which property of an algorithm states that it must eventually terminate?", options: ["Finiteness", "Definiteness", "Effectiveness", "Generality"], answer: 0, explanation: "Finiteness states that an algorithm must terminate after a finite number of steps." },
      { question: "What is a language-agnostic representation of algorithmic logic called?", options: ["Compiler", "Pseudocode", "Machine Code", "Assembly"], answer: 1, explanation: "Pseudocode is an informal, high-level description of an algorithm that mimics code but is meant for human reading." }
    ],
    qaKeywords: [{ keywords: ["algorithm", "properties", "finiteness", "logic"], answer: "Design Lecture 1 covers the definition of algorithms, their core properties (finiteness, definiteness, effectiveness, input/output), and basic problem decomposition." }]
  },
  "Design_Lecture2_SDLC.pdf": {
    summary: "Software Development Life Cycle phases including requirements, design, implementation, testing, and deployment.",
    quiz: [
      { question: "In which SDLC phase is the system architecture and database schema designed?", options: ["Requirements Gathering", "System Design", "Implementation", "Testing"], answer: 1, explanation: "The Design phase is where software engineers create architectural plans, database diagrams, and system wireframes." },
      { question: "Which phase of the SDLC focuses on translating design documents into working source code?", options: ["Planning", "Testing", "Implementation", "Maintenance"], answer: 2, explanation: "The Implementation (or Coding) phase is where programmers write the software code." }
    ],
    qaKeywords: [{ keywords: ["sdlc", "phases", "lifecycle", "development"], answer: "Design Lecture 2 covers the Software Development Life Cycle (SDLC), describing phases: Requirements, Design, Implementation, Testing, Deployment, and Maintenance." }]
  },
  "Design_Lecture2_Program_Design.pdf": {
    summary: "Program design methodologies, top-down design, and representation tools like pseudocode and flowcharts.",
    quiz: [
      { question: "What design approach decomposes a large system into smaller, more manageable modules?", options: ["Bottom-up design", "Top-down design", "Spaghetti coding", "Monolithic design"], answer: 1, explanation: "Top-down design starts with the high-level system and breaks it down into smaller sub-modules." },
      { question: "Which tool represents program control flows visually using shapes?", options: ["Pseudocode", "Flowchart", "Compiler", "Interpreter"], answer: 1, explanation: "A flowchart is a visual representation of the sequence of steps and decisions needed to perform a process." }
    ],
    qaKeywords: [{ keywords: ["program design", "top-down", "modular", "decomposition"], answer: "This lecture explains top-down modular decomposition, program flowchart symbols, and structured programming principles." }]
  },
  "Design_Lecture3_Program_Design.pdf": {
    summary: "Advanced control structures, nested selections, loop controls, and logical exception handling.",
    quiz: [
      { question: "Which loop control is best when the number of iterations is known beforehand?", options: ["While loop", "Definite (for) loop", "Infinite loop", "Sentinel loop"], answer: 1, explanation: "A for loop is a definite loop used when the number of iterations is predetermined." }
    ],
    qaKeywords: [{ keywords: ["selection", "loops", "control", "nested"], answer: "Lecture 3 covers advanced control structures, including nested conditionals, loops (while/for), and structural design refinement." }]
  },
  "Design_Tutorial1_Algorithms.pdf": {
    summary: "Tutorial worksheet for writing basic algorithms and problem-solving steps.",
    quiz: [
      { question: "What is the first step in solving any algorithmic problem?", options: ["Write code", "Understand and define the problem", "Compile the program", "Run tests"], answer: 1, explanation: "You must fully understand the problem requirements and inputs/outputs before designing a solution." }
    ],
    qaKeywords: [{ keywords: ["tutorial", "algorithms", "problems", "tasks"], answer: "Tutorial 1 asks you to write algorithms for finding the maximum of three numbers and summing integers from 1 to N." }]
  },
  "Design_Tutorial2_Flowcharts.pdf": {
    summary: "Tutorial sheet for drawing UML flowcharts with process blocks and decision diamonds.",
    quiz: [
      { question: "Which shape represents a decision/conditional branch in a flowchart?", options: ["Rectangle", "Oval", "Diamond", "Parallelogram"], answer: 2, explanation: "A diamond shape is used for decisions (like checking if X > Y), leading to Yes/No branching paths." }
    ],
    qaKeywords: [{ keywords: ["flowchart", "shapes", "diamond", "rectangle"], answer: "Tutorial 2 guides you through drawing flowcharts using standard shapes: ovals for start/end, rectangles for processes, and diamonds for decision branches." }]
  }
};

const defaultPdfStudyData = {
  summary: "Curriculum-aligned lecture notes for Y1S1 CS/SE syllabus.",
  quiz: [
    { question: "Key rule for Y1S1 coursework submissions?", options: ["Submit late freely", "No plagiarism — academic integrity required", "Copying is allowed", "Share answers publicly"], answer: 1, explanation: "Academic integrity is critical. Plagiarism or collusion results in severe penalties." },
    { question: "Best way to get help with academic concepts?", options: ["Ignore lecturers", "Ask Nexora AI Tutor and study slide notes", "Use other universities' syllabuses", "Do nothing"], answer: 1, explanation: "Using lecture slides, tutorials, and AI tutoring helps clarify core study topics." },
    { question: "What does a study timer assist with?", options: ["Increases stress", "Enables pomodoro tracking for focus", "Speeds up time", "Closes tabs"], answer: 1, explanation: "Tracking intervals using countdown timers organizes focus blocks and improves retention." }
  ],
  qaKeywords: []
};

const mockSlidesData: Record<string, string[]> = {
  "SD_Lec01_Introduction.pdf": [
    "📌 Slide 1: Welcome to Software Development\n\n• Course Code: CS101\n• Instructor: Dr. Alan Turing\n• Focus: Python Programming & Foundations\n• Objective: Learn compiler vs interpreter, variables, and output statement rules.",
    "📌 Slide 2: Compiler vs Interpreter\n\n• Compiler: Translates the entire source code into machine code at once (e.g. C++).\n• Interpreter: Translates and executes source code line by line at runtime (e.g. Python).\n• Python compiles code to bytecode (.pyc) which is then executed by the Python Virtual Machine (PVM).",
    "📌 Slide 3: Variables & Memory\n\n• In Python, variables are dynamically typed.\n• Assign values using the '=' operator.\n• Variable names must start with a letter or underscore, and can contain alphanumeric characters and underscores.",
    "📌 Slide 4: First Python Program\n\n```python\n# Hello World Example\nprint(\"Hello, Nexora Student!\")\n\nx = 10\ny = 20\nprint(\"Sum =\", x + y)\n```\n\n• Run with: `python hello.py`"
  ],
  "SD_Lec02_Variables_Types.pdf": [
    "📌 Slide 1: Variables & Core Data Types\n\n• Primitive Types: Integer, Float, String, Boolean.\n• Dynamic typing: Variable type is determined at runtime based on the assigned value.\n• Use `type(variable)` to inspect the current data type.",
    "📌 Slide 2: Mathematical Operators\n\n• Addition: `+`, Subtraction: `-`, Multiplication: `*`\n• Division: `/` (returns a float, e.g. `10 / 3` is `3.333`)\n• Floor Division: `//` (discards fractions, e.g. `10 // 3` is `3`)\n• Modulo: `%` (returns remainder, e.g. `10 % 3` is `1`)",
    "📌 Slide 3: String Operations\n\n• Concatenation: `str1 + str2`\n• Repetition: `str1 * 3`\n• Indexing: `str1[0]` (zero-based)\n• Slicing: `str1[start:end]`"
  ],
  "CSF_Lecture_1_Part_1_of_2.pdf": [
    "📌 Slide 1: Computer Systems Fundamentals\n\n• Course Code: CS102\n• Lecturer: Prof. Grace Hopper\n• Focus: Logic Gates, Boolean Algebra, Computer Systems Architecture.",
    "📌 Slide 2: Logic Gates & Truth Tables\n\n• AND Gate: Outputs 1 if and only if both inputs are 1.\n• OR Gate: Outputs 1 if at least one input is 1.\n• NOT Gate: Inverts the input (1 to 0, 0 to 1).\n• XOR Gate: Outputs 1 if inputs are different.",
    "📌 Slide 3: Binary & Decimal\n\n• Computers use base-2 representation (binary: 0 and 1).\n• Decimal is base-10.\n• Example: Decimal 5 in binary is 101."
  ],
  "Maths_Lec02_Set_Theory.pdf": [
    "📌 Slide 1: Set Theory Foundations\n\n• Course Code: MA101\n• Lecturer: Dr. Ada Lovelace\n• Focus: Math structures, sets, relations, functions, and proofs.",
    "📌 Slide 2: Core Set Operations\n\n• Union (A ∪ B): Elements in A, B, or both.\n• Intersection (A ∩ B): Elements common to both sets.\n• Set Difference (A - B): Elements in A but not in B.\n• Cardinality (|A|): Number of elements in set A.",
    "📌 Slide 3: Power Sets\n\n• The set of all subsets of A.\n• If |A| = n, then the power set has 2^n elements."
  ],
  "Design_Lecture1_Algorithms.pdf": [
    "📌 Slide 1: Introduction to Algorithms\n\n• Course Code: DS101\n• Focus: Algorithmic Thinking & Logic\n• Objective: Learn definitions, properties, and step-by-step problem-solving.",
    "📌 Slide 2: Algorithmic Properties\n\n• Finiteness: Must terminate after a finite steps.\n• Definiteness: Each step must be clear and unambiguous.\n• Input/Output: Clearly defined bounds.\n• Effectiveness: Feasible and simple operations.",
    "📌 Slide 3: Algorithmic Representation\n\n• Represented using text statements, pseudocode, flowcharts, or high-level languages."
  ],
  "Design_Lecture2_SDLC.pdf": [
    "📌 Slide 1: Software Development Life Cycle (SDLC)\n\n• Focus: Structured Engineering Pipelines\n• Purpose: Deliver high-quality software on time and budget.",
    "📌 Slide 2: Phases of SDLC\n\n• 1. Requirements & Planning\n• 3. Implementation (Coding)\n• 4. Testing & Deployment\n• 5. Maintenance\n• 2. Design (Architecture & Mockups)",
    "📌 Slide 3: Key Objectives\n\n• Minimize developer error, improve documentation, and maintain standard build releases."
  ],
  "Design_Lecture2_Program_Design.pdf": [
    "📌 Slide 1: Program Design Principles\n\n• Focus: Structuring software code flow before implementation.",
    "📌 Slide 2: Top-down Decomposition\n\n• Break a complex module into smaller, independent sub-routines.\n• Improves modularity, testability, and code reusability.",
    "📌 Slide 3: Flowchart Elements\n\n• Ovals: Start/End\n• Rectangles: Operations & Assignments\n• Diamonds: Conditionals & Decisions\n• Parallelograms: Input/Output"
  ],
  "Design_Lecture3_Program_Design.pdf": [
    "📌 Slide 1: Advanced Program Design\n\n• Focus: Logic Control & Branch Structures.",
    "📌 Slide 2: Control Logic Structures\n\n• Sequence: Default linear execution.\n• Selection: Nested if-else and switch statements.\n• Iteration: Definite (for) and indefinite (while) loop structures."
  ],
  "Design_Tutorial1_Algorithms.pdf": [
    "📌 Slide 1: Tutorial 1: Algorithms\n\n• Problem Sheet exercises mapping step-by-step logic designs.\n• Tasks include finding maximum values and integer summations."
  ],
  "Design_Tutorial2_Flowcharts.pdf": [
    "📌 Slide 1: Tutorial 2: Flowcharts\n\n• Visualizing sequence, selection, and loop conditions using standard UML flowchart shapes."
  ]
};

const getFallbackSlides = (filename: string) => {
  return [
    `📌 Slide 1: ${filename.replace(/_/g, ' ').replace('.pdf', '').replace('.pptx', '')}\n\n• Document: ${filename}\n• Course: Nexora Academic Suite Syllabus\n• Status: Full Document Available\n• Action: Use the download button to save this resource locally.`,
    `📌 Slide 2: Document Summary\n\n• This file contains lecture and course material designed for the Y1S1 syllabus.\n• Read through this slide deck to review key definitions and test your knowledge.\n• Use the chatbot on the right to ask questions about specific sub-concepts in this PDF.`,
    `📌 Slide 3: Active Learning Checklist\n\n• [ ] Read slide notes\n• [ ] Answer interactive quiz questions\n• [ ] Ask Nexora AI Tutor to explain complex formulas\n• [ ] Try mock exams in Mock Arena`
  ];
};

interface PdfElement {
  id: string;
  type: 'heading' | 'paragraph' | 'bullet' | 'code';
  content: string;
}

interface PdfPage {
  title: string;
  subtitle: string;
  elements: PdfElement[];
}

const mockPdfPagesData: Record<string, PdfPage[]> = {
  "SD_Lec01_Introduction.pdf": [
    {
      title: "Software Development (CS101) - Lecture 1",
      subtitle: "Introduction to Computer Programming & Python Foundations",
      elements: [
        { id: "sd1-h1", type: "heading", content: "1.1 Introduction to Computer Programming" },
        { id: "sd1-p1", type: "paragraph", content: "Computer programming is the process of designing and building an executable computer program to accomplish a specific computing result or to perform a specific task. Programming involves generating algorithms, analyzing their complexity, and implementing them in a target language." },
        { id: "sd1-b1", type: "bullet", content: "• Algorithm: A logical sequence of steps to solve a problem.\n• High-Level Languages: Human-readable syntax (Python, Java, C++).\n• Machine Code: The low-level binary code (0s and 1s) executed directly by hardware." },
        { id: "sd1-h2", type: "heading", content: "1.2 Compilers vs Interpreters" },
        { id: "sd1-p2", type: "paragraph", content: "A compiler translates the entire source code written in a high-level language into machine code (object code) before execution. Examples include C, C++, and Rust. An interpreter translates and executes the source code line by line at runtime. Examples include Python, JavaScript, and Ruby." },
        { id: "sd1-p3", type: "paragraph", content: "Python uses a hybrid approach: source code is first compiled to an intermediate bytecode (.pyc), which is then interpreted and run by the Python Virtual Machine (PVM)." }
      ]
    },
    {
      title: "Software Development (CS101) - Lecture 1 (Page 2)",
      subtitle: "Python Syntax & First Program",
      elements: [
        { id: "sd1-h3", type: "heading", content: "1.3 Python Syntax Basics" },
        { id: "sd1-p4", type: "paragraph", content: "Python is known for its highly readable syntax. Code blocks are defined by indentation instead of curly braces. Spacing is syntactically significant: standard indentation is 4 spaces." },
        { id: "sd1-c1", type: "code", content: "# Hello World Example\nprint(\"Hello, Nexora Student!\")\n\nx = 10\ny = 20\nprint(\"Sum =\", x + y)" },
        { id: "sd1-h4", type: "heading", content: "1.4 Variable Declarations" },
        { id: "sd1-p5", type: "paragraph", content: "Variables in Python do not require explicit type declaration. Variable names must start with a letter or underscore, and can contain letters, digits, and underscores. Variables are dynamically typed: their type is determined at runtime based on the value assigned to them." }
      ]
    }
  ],
  "SD_Lec02_Variables_Types.pdf": [
    {
      title: "Software Development (CS101) - Lecture 2",
      subtitle: "Python Primitive Types & Basic Operators",
      elements: [
        { id: "sd2-h1", type: "heading", content: "2.1 Primitive Data Types" },
        { id: "sd2-p1", type: "paragraph", content: "Python has several built-in primitive data types that represent simple values. Understanding these types is essential for managing memory and data manipulation." },
        { id: "sd2-b1", type: "bullet", content: "• Integer (int): Whole numbers, positive or negative (e.g. 42, -5).\n• Float (float): Decimal numbers (e.g. 3.14, -0.001).\n• String (str): Text characters enclosed in single or double quotes.\n• Boolean (bool): Truth values, representing either True or False." },
        { id: "sd2-h2", type: "heading", content: "2.2 Arithmetic Operators" },
        { id: "sd2-p2", type: "paragraph", content: "Python supports standard mathematical operators, as well as specialized operators for division. Division (/) always returns a floating-point number. Floor division (//) discards the fraction. Modulo (%) returns the remainder of the division." }
      ]
    }
  ],
  "SD_Lec03_Control_Flow.pptx": [
    {
      title: "Software Development (CS101) - Lecture 3",
      subtitle: "Conditional Branching Structures",
      elements: [
        { id: "sd3-h1", type: "heading", content: "3.1 Conditionals (If-Else)" },
        { id: "sd3-p1", type: "paragraph", content: "Control flow refers to the order in which individual statements, instructions or function calls of an imperative program are executed. Conditional statements allow a program to execute different blocks of code based on whether a condition is True or False." },
        { id: "sd3-c1", type: "code", content: "score = 85\nif score >= 90:\n    print(\"Grade: A\")\nelif score >= 80:\n    print(\"Grade: B\")\nelse:\n    print(\"Grade: F\")" }
      ]
    },
    {
      title: "Software Development (CS101) - Lecture 3 (Page 2)",
      subtitle: "Loops & Iterative Constructs",
      elements: [
        { id: "sd3-h2", type: "heading", content: "3.2 Iteration Loops (While and For)" },
        { id: "sd3-p2", type: "paragraph", content: "Loops are used to repeat a block of code multiple times. A 'for' loop is generally used when the number of iterations is known beforehand, whereas a 'while' loop repeats until a specific condition becomes false." },
        { id: "sd3-b1", type: "bullet", content: "• For loop: Iterates over a sequence (list, range, string).\n• While loop: Executes as long as the condition evaluates to True.\n• Loop control: break exits the loop immediately, continue skips to the next iteration." },
        { id: "sd3-c2", type: "code", content: "# While loop example\ncount = 1\nwhile count <= 3:\n    print(\"Count:\", count)\n    count += 1\n\n# For loop with range\nfor i in range(3):\n    print(\"Iteration:\", i)" }
      ]
    }
  ],
  "SD_Lec04_Functions.pptx": [
    {
      title: "Software Development (CS101) - Lecture 4",
      subtitle: "Defining and Reusing Functions",
      elements: [
        { id: "sd4-h1", type: "heading", content: "4.1 Defining and Calling Functions" },
        { id: "sd4-p1", type: "paragraph", content: "A function is a block of organized, reusable code that is used to perform a single, related action. Functions provide better modularity for your application and a high degree of code reusability. In Python, functions are defined using the 'def' keyword." },
        { id: "sd4-c1", type: "code", content: "def greet_student(name):\n    return f\"Welcome, {name}!\"\n\nmessage = greet_student(\"Alex\")\nprint(message)" }
      ]
    },
    {
      title: "Software Development (CS101) - Lecture 4 (Page 2)",
      subtitle: "Variables Scope Rules",
      elements: [
        { id: "sd4-h2", type: "heading", content: "4.2 Function Scope: Local vs Global" },
        { id: "sd4-p2", type: "paragraph", content: "Variables defined inside a function body have a local scope, and those defined outside have a global scope. Local variables can only be accessed within the function, while global variables can be accessed throughout the module." },
        { id: "sd4-b1", type: "bullet", content: "• Local Scope: Parameters and variables created inside the function body.\n• Global Scope: Variables created in the main body of the script.\n• Global Keyword: Used to modify global variables inside local function scopes." },
        { id: "sd4-c2", type: "code", content: "x = 10 # Global variable\n\ndef my_function():\n    global x\n    x = 20 # Modifies global x\n    y = 5  # Local variable\n    print(\"Inside function local y:\", y)\n\nmy_function()\nprint(\"Outside function global x:\", x)" }
      ]
    }
  ],
  "SD_Lec05_User_Defined_Functions.pdf": [
    {
      title: "Software Development (CS101) - Lecture 5",
      subtitle: "Defining Custom Functions & Code Reuse",
      elements: [
        { id: "sd5-h1", type: "heading", content: "5.1 Defining Custom Functions" },
        { id: "sd5-p1", type: "paragraph", content: "User-defined functions allow developers to create modular, reusable blocks of code for operations specific to their application. Functions are defined with parameters and return values." },
        { id: "sd5-b1", type: "bullet", content: "• Defining: Use 'def function_name(parameters):' to specify a function.\n• Returning values: Return data using the 'return' keyword.\n• Invoking: Execute the function by calling its name with actual arguments." },
        { id: "sd5-c1", type: "code", content: "def calculate_bmi(weight, height):\n    return weight / (height ** 2)\n\nbmi = calculate_bmi(70, 1.75)\nprint(f'BMI: {bmi:.2f}')" }
      ]
    }
  ],
  "SD_Lec06_Lists.pptx": [
    {
      title: "Software Development (CS101) - Lecture 6",
      subtitle: "Ordered and Mutable Lists in Python",
      elements: [
        { id: "sd6-h1", type: "heading", content: "6.1 Python Lists" },
        { id: "sd6-p1", type: "paragraph", content: "Lists are ordered, mutable sequences of elements, created using square brackets []. Lists can contain duplicate elements and elements of different data types." },
        { id: "sd6-b1", type: "bullet", content: "• Append: Add to the end of the list.\n• Indexing: Access elements using index (0-based).\n• Slicing: Extract a sublist using list[start:end]." },
        { id: "sd6-c1", type: "code", content: "fruits = ['apple', 'banana', 'cherry']\nfruits.append('orange')\nprint(fruits[1:3]) # ['banana', 'cherry']" }
      ]
    }
  ],
  "SD_Lec07_Databases_SQLite.pdf": [
    {
      title: "Software Development (CS101) - Lecture 7",
      subtitle: "Relational Databases & SQLite in Python",
      elements: [
        { id: "sd7-h1", type: "heading", content: "7.1 SQLite Database Integration" },
        { id: "sd7-p1", type: "paragraph", content: "SQLite is a lightweight, disk-based database engine. Python has built-in support for SQLite via the sqlite3 module. It allows SQL operations on local database files." },
        { id: "sd7-b1", type: "bullet", content: "• Connection: sqlite3.connect('database.db')\n• Cursor: cursor = conn.cursor() to execute statements.\n• Commit: conn.commit() to save modifications.\n• Fetch: cursor.fetchall() to retrieve results." },
        { id: "sd7-c1", type: "code", content: "import sqlite3\nconn = sqlite3.connect('student.db')\ncursor = conn.cursor()\ncursor.execute('CREATE TABLE IF NOT EXISTS students (id TEXT, name TEXT)')\nconn.commit()\nconn.close()" }
      ]
    }
  ],
  "SD_Lec08_Strings.pdf": [
    {
      title: "Software Development (CS101) - Lecture 8",
      subtitle: "String Formatting & Operations",
      elements: [
        { id: "sd8-h1", type: "heading", content: "8.1 String Formatting & Operations" },
        { id: "sd8-p1", type: "paragraph", content: "Strings in Python are immutable sequences of Unicode characters. Python offers a wide array of built-in methods to clean, format, search, and manipulate text." },
        { id: "sd8-b1", type: "bullet", content: "• Slicing: string[start:end:step]\n• Methods: upper(), lower(), strip(), split(), replace()\n• Formatting: f-strings f'Hello {name}' is preferred." },
        { id: "sd8-c1", type: "code", content: "text = '  Python Programming  '\nclean_text = text.strip().upper()\nprint(clean_text) # 'PYTHON PROGRAMMING'\nprint(clean_text.split()) # ['PYTHON', 'PROGRAMMING']" }
      ]
    }
  ],
  "SD_Lec11_Revision.pptx": [
    {
      title: "Software Development (CS101) - Lecture 11",
      subtitle: "Course revision & key highlights",
      elements: [
        { id: "sd11-h1", type: "heading", content: "11.1 Software Development Revision Checklist" },
        { id: "sd11-p1", type: "paragraph", content: "Prepare for the final CS101 software development examination by reviewing all core coding blocks. The exam consists of both theoretical definitions and practical python scripting tasks." },
        { id: "sd11-b1", type: "bullet", content: "• Syntax & Types: Variables, operators, expressions, and string formatting.\n• Logic & Loops: Nested conditional logic, boundary case loops, and list comprehensions.\n• Data Operations: File reading/writing, error handling, dictionaries, and basic class design." }
      ]
    }
  ],
  "SD_Tutorial01_Syntax.pdf": [
    {
      title: "Software Development (CS101) - Tutorial 1",
      subtitle: "Syntax Basics & Printing Exercises",
      elements: [
        { id: "sdt1-h1", type: "heading", content: "Tutorial 1: Python Basics & Printing" },
        { id: "sdt1-p1", type: "paragraph", content: "Practice writing basic python commands and executing assignments in the interpreter console. Answer all questions below and verify using python shell." },
        { id: "sdt1-b1", type: "bullet", content: "• Task 1: Write a python script to declare three variables representing a student name, age, and grade.\n• Task 2: Print a formatted message using f-strings to display the student record.\n• Task 3: Calculate the area of a circle with radius = 7 using the formula: Area = pi * r^2." }
      ]
    }
  ],
  "SD_Tutorial02_Conditionals.pdf": [
    {
      title: "Software Development (CS101) - Tutorial 2",
      subtitle: "Indentation & Conditional Branching Tasks",
      elements: [
        { id: "sdt2-h1", type: "heading", content: "Tutorial 2: Conditional Statements" },
        { id: "sdt2-p1", type: "paragraph", content: "Implement conditional branching logic using if, elif, and else statements. Ensure correct indentation and nested rules." },
        { id: "sdt2-b1", type: "bullet", content: "• Task 1: Check if an input integer is even or odd, printing a matching message.\n• Task 2: Grade calculator: Input numerical score (0-100) and output letter grade (A, B, C, D, F).\n• Task 3: Write a program that inputs three numbers and prints the maximum of the three." }
      ]
    }
  ],
  "SD_Tutorial03_Loops.pdf": [
    {
      title: "Software Development (CS101) - Tutorial 3",
      subtitle: "Iteration Loops & Control Statements",
      elements: [
        { id: "sdt3-h1", type: "heading", content: "Tutorial 3: Iterative Loop Tasks" },
        { id: "sdt3-p1", type: "paragraph", content: "Write loops using both while and for statements. Implement early exit controls and nested loop logic." },
        { id: "sdt3-b1", type: "bullet", content: "• Task 1: Print all numbers from 1 to 50 that are divisible by both 3 and 5.\n• Task 2: Calculate the factorial of a user-input integer using a while loop.\n• Task 3: Write a nested loop program to print a right-aligned triangle of asterisks (*)." }
      ]
    }
  ],
  "SD_Tutorial04_Functions.pdf": [
    {
      title: "Software Development (CS101) - Tutorial 4",
      subtitle: "Modular Function Specifications",
      elements: [
        { id: "sdt4-h1", type: "heading", content: "Tutorial 4: Functions & Modularization" },
        { id: "sdt4-p1", type: "paragraph", content: "Decompose programs into modular functions. Write input parameters, default values, and return statements." },
        { id: "sdt4-b1", type: "bullet", content: "• Task 1: Create a function is_prime(n) that returns True if n is prime and False otherwise.\n• Task 2: Write a function calculator(a, b, op) that performs addition, subtraction, multiplication, or division based on string op.\n• Task 3: Write a recursive function to compute the n-th Fibonacci number." }
      ]
    }
  ],
  "SD_Tutorial05_Lists.pdf": [
    {
      title: "Software Development (CS101) - Tutorial 5",
      subtitle: "List Operations & Comprehensions",
      elements: [
        { id: "sdt5-h1", type: "heading", content: "Tutorial 5: Lists & Sequences" },
        { id: "sdt5-p1", type: "paragraph", content: "Use list methods, slicing operations, and list comprehensions to filter and transform sequences." },
        { id: "sdt5-b1", type: "bullet", content: "• Task 1: Write a program that inputs a list of integers and returns a new list containing only the unique elements.\n• Task 2: Print the second-largest element in a list of numbers without sorting.\n• Task 3: Use a list comprehension to square all even numbers in a given range." }
      ]
    }
  ],
  "CSF_Lecture_1_Part_1_of_2.pdf": [
    {
      title: "Computer Systems Fundamentals (CS102) - Lecture 1",
      subtitle: "Digital Logic, Systems Architecture & Logic Gates",
      elements: [
        { id: "csf1-h1", type: "heading", content: "1.1 Computer Logic Systems" },
        { id: "csf1-p1", type: "paragraph", content: "Digital systems represent information using discrete binary signals. These logic levels are modeled mathematically using Boolean Algebra, where variable values are either True (1) or False (0)." },
        { id: "csf1-h2", type: "heading", content: "1.2 Logic Gates & Operations" },
        { id: "csf1-p2", type: "paragraph", content: "Logic gates are the basic building blocks of digital circuits. They take binary inputs and produce a single binary output based on logical rules." },
        { id: "csf1-b1", type: "bullet", content: "• AND Gate: Output is 1 if and only if all inputs are 1.\n• OR Gate: Output is 1 if at least one input is 1.\n• NOT Gate: Inverts the input (1 becomes 0, 0 becomes 1).\n• XOR Gate: Output is 1 if inputs are different." }
      ]
    }
  ],
  "CSF_Lec02_Architecture.pptx": [
    {
      title: "Computer Systems Fundamentals (CS102) - Lecture 2",
      subtitle: "CPU Architectures & Registers",
      elements: [
        { id: "csf2-h1", type: "heading", content: "2.1 Von Neumann Architecture Model" },
        { id: "csf2-p1", type: "paragraph", content: "The Von Neumann architecture is a theoretical design model for a stored-program digital computer. It describes a system where program data and instruction data share the same memory space." },
        { id: "csf2-b1", type: "bullet", content: "• CPU (Central Processing Unit): The hardware component that executes instructions.\n• ALU (Arithmetic Logic Unit): Performs arithmetic and logical operations.\n• Control Unit (CU): Directs hardware operations and manages signal transmissions." }
      ]
    },
    {
      title: "Computer Systems Fundamentals (CS102) - Lecture 2 (Page 2)",
      subtitle: "Execution Cycles & Pipelines",
      elements: [
        { id: "csf2-h2", type: "heading", content: "2.2 Instruction Cycle (Fetch-Decode-Execute)" },
        { id: "csf2-p2", type: "paragraph", content: "The instruction cycle is the process by which a computer retrieves a program instruction from its memory, determines what actions the instruction requires, and carries out those actions." },
        { id: "csf2-b2", type: "bullet", content: "• Fetch: Read the instruction from memory location stored in Program Counter.\n• Decode: Control Unit decodes the instruction code to determine the required actions.\n• Execute: Execute instructions using registers and ALU, then update the Program Counter." }
      ]
    }
  ],
  "CSF_Tutorial01_Logic_Gates.pdf": [
    {
      title: "Computer Systems Fundamentals (CS102) - Tutorial 1",
      subtitle: "Logic gates and circuits assignment",
      elements: [
        { id: "csft1-h1", type: "heading", content: "Tutorial 1: Logic Gates Truth Tables" },
        { id: "csft1-p1", type: "paragraph", content: "Analyze fundamental logic circuits. Draw truth tables and write logical expressions for each configuration." },
        { id: "csft1-b1", type: "bullet", content: "• Task 1: Complete the truth table for a 3-input NAND gate (inputs A, B, and C).\n• Task 2: Express the XOR logic gate using combinations of AND, OR, and NOT gates.\n• Task 3: Find the output logic levels of a circuit combining AND and OR gates given input combinations." }
      ]
    }
  ],
  "CSF_Tutorial02_Boolean_Math.pdf": [
    {
      title: "Computer Systems Fundamentals (CS102) - Tutorial 2",
      subtitle: "Boolean simplification tasks",
      elements: [
        { id: "csft2-h1", type: "heading", content: "Tutorial 2: Boolean Algebra Laws" },
        { id: "csft2-p1", type: "paragraph", content: "Apply theorems of Boolean algebra to simplify logical expressions and minimize logical gates." },
        { id: "csft2-b1", type: "bullet", content: "• Task 1: Simplify the Boolean expression: Y = A'B + AB + AB'.\n• Task 2: Prove De Morgan's Laws: (A + B)' = A'B' and (AB)' = A' + B' using truth tables.\n• Task 3: Minimize the logic function F = A(B + C) + B'(A + C) to its simplest SOP form." }
      ]
    }
  ],
  "Discrete_Mathematics_Calculus.pdf": [
    {
      title: "Discrete Mathematics (MA101) - Lecture 1",
      subtitle: "Discrete Structures Foundations",
      elements: [
        { id: "dmc-h1", type: "heading", content: "1.1 Discrete Structures Foundations" },
        { id: "dmc-p1", type: "paragraph", content: "Discrete mathematics studies mathematical structures that are fundamentally discrete rather than continuous. This covers topics such as sets, graphs, logic, and combinatorics, which form the base for computer science." },
        { id: "dmc-b1", type: "bullet", content: "• Propositions: Statements that are either strictly True or False.\n• Graph Theory: Modeling networks using vertices (nodes) and edges (connections).\n• Combinatorics: Counting methods, permutations, and mathematical combinations." }
      ]
    },
    {
      title: "Discrete Mathematics (MA101) - Lecture 1 (Page 2)",
      subtitle: "Introductory Calculus & Limit Operations",
      elements: [
        { id: "dmc-h2", type: "heading", content: "1.2 Introduction to Calculus Limits" },
        { id: "dmc-p2", type: "paragraph", content: "Calculus deals with change and motion, bridging discrete steps into continuous curves. The core foundation of calculus is the limit, which describes the behavior of a function as its input approaches a value." },
        { id: "dmc-b2", type: "bullet", content: "• Limit Concept: limit of f(x) as x approaches c is L.\n• Derivatives: Measure the instantaneous rate of change of a function.\n• Integrals: Find the area under a curve by summing infinite infinitesimal rectangles." }
      ]
    }
  ],
  "Maths_Lec02_Set_Theory.pdf": [
    {
      title: "Discrete Mathematics (MA101) - Lecture 2",
      subtitle: "Syllabus Set Theory: Operations & Cardinalities",
      elements: [
        { id: "m2-h1", type: "heading", content: "2.1 Foundational Set Concepts" },
        { id: "m2-p1", type: "paragraph", content: "A set is a well-defined collection of distinct objects. Objects in a set are called elements. Set theory forms the basis of discrete mathematics and relational databases." },
        { id: "m2-h2", type: "heading", content: "2.2 Set Operations" },
        { id: "m2-b1", type: "bullet", content: "• Union (A ∪ B): All elements in set A, set B, or both.\n• Intersection (A ∩ B): Elements common to both A and B.\n• Difference (A - B): Elements in A but not in B.\n• Power Set: Set of all subsets of a set. A set of size n has 2^n subsets." }
      ]
    }
  ],
  "Maths_Tutorial01_Sets.pdf": [
    {
      title: "Discrete Mathematics (MA101) - Tutorial 1",
      subtitle: "Set Operations & Venn Diagram Exercises",
      elements: [
        { id: "mt1-h1", type: "heading", content: "Tutorial 1: Sets and Venn Diagrams" },
        { id: "mt1-p1", type: "paragraph", content: "Perform set theoretic operations. Illustrate set intersections, unions, and subsets using Venn diagrams." },
        { id: "mt1-b1", type: "bullet", content: "• Task 1: Given Universal Set U = {1..10}, A = {2,4,6,8}, B = {1,2,3,4,5}. Find (A ∪ B)' and A ∩ B'.\n• Task 2: Draw a Venn diagram representing the relation: A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C).\n• Task 3: Prove that if A is a subset of B, then B' is a subset of A'." }
      ]
    }
  ],
  "Maths_Tutorial02_Relations.pdf": [
    {
      title: "Discrete Mathematics (MA101) - Tutorial 2",
      subtitle: "Binary Relations & Equivalence Classes",
      elements: [
        { id: "mt2-h1", type: "heading", content: "Tutorial 2: Relations and Properties" },
        { id: "mt2-p1", type: "paragraph", content: "Determine properties of mathematical relations defined on sets. Analyze equivalence relations." },
        { id: "mt2-b1", type: "bullet", content: "• Task 1: Determine if relation R = {(x,y) | x - y is divisible by 3} is reflexive, symmetric, and transitive.\n• Task 2: Define equivalence relation and find the equivalence classes of the relation defined in Task 1.\n• Task 3: Draw the directed graph representation of the relation S = {(1,2), (2,3), (3,1), (2,2)}." }
      ]
    }
  ],
  "English_Lec01_Academic_Writing.pdf": [
    {
      title: "English Module (EN101) - Lecture 1",
      subtitle: "Formal Writing Standards & Conventions",
      elements: [
        { id: "el1-h1", type: "heading", content: "1.1 Academic Literacy Standards" },
        { id: "el1-p1", type: "paragraph", content: "Academic writing is a formal style of writing used in universities and scholarly publications. It is characterized by its structured logic, evidence-based arguments, precise vocabulary, and objective tone." },
        { id: "el1-b1", type: "bullet", content: "• Objective Tone: Write impersonally (avoid first-person 'I' or 'we' in formal reports).\n• Citation Standards: Always attribute source materials using standard citation styles (APA, IEEE).\n• Structural Logic: Standard academic structure (Introduction, Body Paragraphs, Conclusion)." }
      ]
    }
  ],
  "English_Presentation_Rubric.pdf": [
    {
      title: "English Module (EN101) - Rubric Guide",
      subtitle: "Oral Presentation Performance Rubric",
      elements: [
        { id: "epr-h1", type: "heading", content: "1.1 Evaluation Criteria for Presentations" },
        { id: "epr-p1", type: "paragraph", content: "Presentations are graded across four main areas of communication: organization, verbal delivery, visual aids, and response to questions." },
        { id: "epr-b1", type: "bullet", content: "• Organization (25%): Clear flow, well-structured introduction, transitions, and summary.\n• Delivery (25%): Clear articulation, eye contact, appropriate pacing, and body language.\n• Slide Design (25%): Clean design, minimal text, appropriate charts, high readability.\n• Q&A Response (25%): Accurate and concise responses to assessor questions." }
      ]
    }
  ],
  "English_Tutorial01_Grammar.pdf": [
    {
      title: "English Module (EN101) - Tutorial 1",
      subtitle: "Sentence Structures & Syntax Worksheets",
      elements: [
        { id: "et1-h1", type: "heading", content: "Tutorial 1: Grammar & Writing Tasks" },
        { id: "et1-p1", type: "paragraph", content: "Strengthen sentence structure, clarity, and grammatical precision in academic reports." },
        { id: "et1-b1", type: "bullet", content: "• Task 1: Identify and correct sentence fragments and run-on sentences in the worksheet.\n• Task 2: Convert informal colloquial sentences into formal, objective academic statements.\n• Task 3: Rewrite paragraphs to ensure proper subject-verb agreement and active/passive voice balance." }
      ]
    }
  ],
  "Design_Lecture1_Algorithms.pdf": [
    {
      title: "Design Module (DS101) - Lecture 1",
      subtitle: "Introduction to Algorithms & Problem Solving",
      elements: [
        { id: "dla1-h1", type: "heading", content: "1.1 Introduction to Algorithms" },
        { id: "dla1-p1", type: "paragraph", content: "An algorithm is a step-by-step procedure or set of rules to be followed in calculations or other problem-solving operations, especially by a computer. In this lecture, we examine properties of algorithms (finiteness, definiteness, input, output, effectiveness) and how they translate to software logic." },
        { id: "dla1-b1", type: "bullet", content: "• Input/Output: Well-defined inputs and outputs.\n• Finiteness: Must terminate after a finite number of steps.\n• Definiteness: Each step must be clearly and unambiguously defined.\n• Effectiveness: Steps must be basic enough to be carried out in practice." }
      ]
    }
  ],
  "Design_Lecture2_SDLC.pdf": [
    {
      title: "Design Module (DS101) - Lecture 2",
      subtitle: "Software Development Life Cycle (SDLC)",
      elements: [
        { id: "dl2s-h1", type: "heading", content: "2.1 Understanding SDLC Phases" },
        { id: "dl2s-p1", type: "paragraph", content: "The Software Development Life Cycle (SDLC) is a structured process used by the software industry to design, develop, and test high-quality software. It provides a systematic pipeline for building software products effectively." },
        { id: "dl2s-b1", type: "bullet", content: "• Planning & Requirements: Defining project goals and capturing user specifications.\n• Architecture & Design: Creating system design, database models, and user interface layouts.\n• Implementation (Coding): Translating design models into working source code.\n• Testing & Deployment: Validating program functionality and releasing it to production." }
      ]
    }
  ],
  "Design_Lecture2_Program_Design.pdf": [
    {
      title: "Design Module (DS101) - Lecture 2 Part 2",
      subtitle: "Program Design Principles & Tools",
      elements: [
        { id: "dl2p-h1", type: "heading", content: "2.2 Program Design Methodologies" },
        { id: "dl2p-p1", type: "paragraph", content: "Program design involves planning the code structure before programming starts. Key methodologies include top-down design (decomposing a problem into smaller sub-problems) and structured programming (using sequence, selection, and iteration)." },
        { id: "dl2p-b1", type: "bullet", content: "• Modular Design: Breaking a program into independent, reusable function blocks.\n• Pseudocode: A text-based, language-agnostic representation of algorithmic logic.\n• Flowcharts: Visual diagrams that represent logical control flows and operations." }
      ]
    }
  ],
  "Design_Lecture3_Program_Design.pdf": [
    {
      title: "Design Module (DS101) - Lecture 3",
      subtitle: "Advanced Program Design & Logical Control",
      elements: [
        { id: "dl3p-h1", type: "heading", content: "3.1 Logical Structures & Refinements" },
        { id: "dl3p-p1", type: "paragraph", content: "Building on basic design, advanced program design focuses on refining control structures, handling exceptional states, and optimizing flow structures to ensure code readability and maintainability." },
        { id: "dl3p-b1", type: "bullet", content: "• Selection Rules: Nested if-else logic and multi-branch switch/case statements.\n• Loop Control: Indefinite (while) vs definite (for) loops and sentinel values.\n• Error Handling: Designing logic blocks to anticipate and recover from invalid input states." }
      ]
    }
  ],
  "Design_Tutorial1_Algorithms.pdf": [
    {
      title: "Design Module (DS101) - Tutorial 1",
      subtitle: "Introduction to Algorithms Sheet",
      elements: [
        { id: "dta1-h1", type: "heading", content: "Tutorial 1: Algorithmic Problem Solving" },
        { id: "dta1-p1", type: "paragraph", content: "Solve the following foundational algorithmic design problems by writing step-by-step logic plans." },
        { id: "dta1-b1", type: "bullet", content: "• Task 1: Write an algorithm to find the largest of three input numbers.\n• Task 2: Design an algorithm to calculate the sum of all integers from 1 to N.\n• Task 3: List the properties of an algorithm and evaluate whether a cooking recipe is a true algorithm." }
      ]
    }
  ],
  "Design_Tutorial2_Flowcharts.pdf": [
    {
      title: "Design Module (DS101) - Tutorial 2",
      subtitle: "Flowcharts and Logical Branches",
      elements: [
        { id: "dta2-h1", type: "heading", content: "Tutorial 2: Drawing Logic Flowcharts" },
        { id: "dta2-p1", type: "paragraph", content: "Translate programmatic logic into visual flowcharts using standard UML symbol representations." },
        { id: "dta2-b1", type: "bullet", content: "• Terminal (Ovals): Representing the start and end of the flowchart execution.\n• Process (Rectangles): Representing operations, calculations, or variable assignments.\n• Decision (Diamonds): Representing logical branches/conditionals (e.g. Is X > 0?).\n• Task: Draw a flowchart for a program that prompts a user for their score, and outputs \"Pass\" if score >= 40, else \"Fail\"." }
      ]
    }
  ]
};

const getFallbackPdfPages = (filename: string): PdfPage[] => {
  return [
    {
      title: `${filename.replace(/_/g, ' ').replace('.pdf', '').replace('.pptx', '')}`,
      subtitle: "Nexora Academic Suite Course Notes",
      elements: [
        { id: "fb-h1", type: "heading", content: "1. Course Outline & Key Objectives" },
        { id: "fb-p1", type: "paragraph", content: "This document contains official syllabus study material for the active semester. Read through this textbook mockup to review core definitions and complete the Q&A checklist." },
        { id: "fb-b1", type: "bullet", content: "• Topic Coverage: Comprehensive syllabus lectures and tutorial guides.\n• Evaluation Criteria: Practice key formulas, logic mappings, and programming concepts.\n• Syllabus Alignment: Fully aligned with the University Year 1 semester curriculum." },
        { id: "fb-h2", type: "heading", content: "2. Active Reading & Annotations" },
        { id: "fb-p2", type: "paragraph", content: "To study effectively, select the Highlight Tool in the top toolbar to mark crucial paragraphs, or click the Text Tool to type custom notes directly onto this A4 page." }
      ]
    }
  ];
};

export default function DashboardPage() {
  const [time, setTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [mounted, setMounted] = useState(false);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  const [selectedYear, setSelectedYear] = useState<string>("Y1S1");
  const [currentCalMonth, setCurrentCalMonth] = useState(new Date().getMonth());
  const [currentCalYear, setCurrentCalYear] = useState(new Date().getFullYear());
  const [selectedCalDate, setSelectedCalDate] = useState<string>("");

  const [activeTab, setActiveTab] = useState<"home" | "calendar" | "tracker" | "ai" | "summary" | "mock-arena" | "analytics">("home");
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [studyMode, setStudyMode] = useState<"lec" | "tut" | "rev">("lec");
  const [activePdf, setActivePdf] = useState<string | null>(null);
  const [viewingPdf, setViewingPdf] = useState<string | null>(null);
  const [mobileTab, setMobileTab] = useState<'viewer' | 'chat'>('viewer');
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [pdfViewMode, setPdfViewMode] = useState<'pdf' | 'notes'>('pdf');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [pdfTool, setPdfTool] = useState<"pan" | "highlight" | "text">("pan");
  const [highlightColor, setHighlightColor] = useState<string>("rgba(253, 224, 71, 0.45)"); // Yellow default
  const [highlights, setHighlights] = useState<Record<string, string>>({});
  const [annotations, setAnnotations] = useState<Array<{ id: string, pageNum: number, x: number, y: number, text: string, isEditing: boolean }>>([]);
  const [zoom, setZoom] = useState<number>(100);

  useEffect(() => {
    if (viewingPdf) {
      setActiveSlideIndex(0);
      setHighlights({});
      setAnnotations([]);
      setZoom(100);
      setPdfTool("pan");
      setMobileTab('viewer');
      setActivePdf(viewingPdf);
    }
  }, [viewingPdf]);

  useEffect(() => {
    setIsMobileDevice(window.innerWidth < 768);
    const handleResize = () => setIsMobileDevice(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [pdfSubTab, setPdfSubTab] = useState<"qa" | "quiz">("qa");
  const [pdfMessages, setPdfMessages] = useState<{ sender: 'user' | 'ai'; text: string; time: string }[]>([]);
  const [pdfInput, setPdfInput] = useState("");
  const [userQuizAnswers, setUserQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerIsActive, setTimerIsActive] = useState(false);

  const [aiMessages, setAiMessages] = useState<{ sender: 'user' | 'ai'; text: string; time: string }[]>([]);
  const [aiInput, setAiInput] = useState("");

  const [streakCount, setStreakCount] = useState(0);
  const [streakTarget, setStreakTarget] = useState(30);

  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newModule, setNewModule] = useState("Software Development");
  const [newType, setNewType] = useState<"deadline" | "evaluation">("deadline");
  const [newDate, setNewDate] = useState("");
  const [newPriority, setNewPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [alerts, setAlerts] = useState<{ id: string; text: string; daysLeft: number; type: "critical" | "warning" }[]>([]);

  const [marks, setMarks] = useState<MarkItem[]>([]);
  const [markModule, setMarkModule] = useState("Software Development");
  const [markName, setMarkName] = useState("");
  const [markScore, setMarkScore] = useState<string>("");
  const [cheerMessage, setCheerMessage] = useState<{ text: string; status: "up" | "down" | "neutral" }>({ text: "Record your first grades to start tracking your academic progress!", status: "neutral" });

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrevMonth = () => {
    if (currentCalMonth === 0) { setCurrentCalMonth(11); setCurrentCalYear(p => p - 1); }
    else setCurrentCalMonth(p => p - 1);
  };
  const handleNextMonth = () => {
    if (currentCalMonth === 11) { setCurrentCalMonth(0); setCurrentCalYear(p => p + 1); }
    else setCurrentCalMonth(p => p + 1);
  };
  const getFormattedDateString = (day: number) => {
    const m = (currentCalMonth + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    return `${currentCalYear}-${m}-${d}`;
  };
  const isToday = (day: number) => {
    const d = new Date();
    return d.getDate() === day && d.getMonth() === currentCalMonth && d.getFullYear() === currentCalYear;
  };
  const handleDayClick = (day: number) => {
    const dateStr = getFormattedDateString(day);
    if (selectedCalDate === dateStr) { setSelectedCalDate(""); setNewDate(""); }
    else { setSelectedCalDate(dateStr); setNewDate(dateStr); }
  };

  useEffect(() => {
    setMounted(true);
    const updateClock = () => {
      const now = new Date();
      let h = now.getHours();
      const m = now.getMinutes().toString().padStart(2, '0');
      const s = now.getSeconds().toString().padStart(2, '0');
      const ampm = h >= 12 ? 'pm' : 'am';
      h = h % 12 || 12;
      setTime(`${h}:${m}:${s} ${ampm}`);
    };
    updateClock();
    const clockTimer = setInterval(updateClock, 1000);
    setCurrentDate(new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }));
    try {
      const saved = localStorage.getItem('theme') as 'dark' | 'light';
      const hasLight = document.documentElement.classList.contains('light');
      const initial = saved || (hasLight ? 'light' : 'dark');
      setThemeMode(initial);
      document.documentElement.classList.toggle('light', initial === 'light');
      document.documentElement.classList.toggle('dark', initial === 'dark');
    } catch (e) {}
    const streak = safeGetItem("nexora-streak");
    if (streak) setStreakCount(parseInt(streak));
    const target = safeGetItem("nexora-target");
    if (target) setStreakTarget(parseInt(target));
    try {
      const saved = safeGetItem("nexora-deadlines");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const clean = parsed.filter((d: DeadlineItem) => d.id !== "1" && d.id !== "2" && d.id !== "3");
          setDeadlines(clean);
          safeSetItem("nexora-deadlines", JSON.stringify(clean));
        }
      }
    } catch (e) {}
    try {
      const saved = safeGetItem("nexora-marks");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) { setMarks(parsed); calculateCheerMessage(parsed); }
      }
    } catch (e) {}
    setAiMessages([{ sender: 'ai', text: "Hi! I'm your Nexora AI study assistant. Ask me anything about Software Development, CSF, Mathematics, English, or Design modules.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    return () => clearInterval(clockTimer);
  }, []);

  useEffect(() => { if (mounted) calculateAlerts(deadlines); }, [deadlines, mounted]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (timerIsActive) {
      interval = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) { setTimerIsActive(false); try { alert("Focus block complete! Great work."); } catch (e) {} return 25 * 60; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [timerIsActive]);

  const toggleTheme = () => {
    const next = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(next);
    try {
      localStorage.setItem('theme', next);
      document.documentElement.classList.toggle('light', next === 'light');
      document.documentElement.classList.toggle('dark', next === 'dark');
    } catch (e) {}
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const calculateAlerts = (list: DeadlineItem[]) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const result: { id: string; text: string; daysLeft: number; type: "critical" | "warning" }[] = [];
    list.forEach(item => {
      const d = new Date(item.date); d.setHours(0, 0, 0, 0);
      const diff = Math.ceil((d.getTime() - today.getTime()) / 86400000);
      if (diff >= 0 && diff <= 3) {
        result.push({ id: item.id, text: `"${item.title}" (${item.module}) is due ${diff === 0 ? "today" : diff === 1 ? "tomorrow" : `in ${diff} days`}!`, daysLeft: diff, type: diff <= 1 ? "critical" : "warning" });
      }
    });
    setAlerts(result);
  };

  const calculateCheerMessage = (all: MarkItem[]) => {
    if (all.length === 0) { setCheerMessage({ text: "🚀 Enter your first assessment grades to start tracking your academic progress!", status: "neutral" }); return; }
    const latest = all[all.length - 1];
    if (all.length === 1) { setCheerMessage({ text: `🎉 Great start! You logged ${latest.score}% in ${latest.module}. Keep recording to track your trend!`, status: "neutral" }); return; }
    const prev = all.slice(0, -1);
    const prevAvg = Math.round(prev.reduce((a, m) => a + m.score, 0) / prev.length);
    if (latest.score >= prevAvg) {
      setCheerMessage({ text: `🔥 Fantastic work! ${latest.score}% in ${latest.module} beats your previous average of ${prevAvg}%. You're crushing this semester!`, status: "up" });
    } else {
      setCheerMessage({ text: `💪 Don't worry! ${latest.score}% in ${latest.module} is slightly below your avg of ${prevAvg}%. Review the lecture notes — you've got this!`, status: "down" });
    }
  };

  const calcGPA = () => {
    if (!marks.length) return "N/A";
    const avg = marks.reduce((a, m) => a + m.score, 0) / marks.length;
    if (avg >= 80) return "4.0 (A)";
    if (avg >= 70) return "3.6 (A-)";
    if (avg >= 60) return "3.0 (B)";
    if (avg >= 50) return "2.0 (C)";
    if (avg >= 40) return "1.0 (D)";
    return "0.0 (F)";
  };

  const incrementStreak = () => { const v = streakCount + 1; setStreakCount(v); safeSetItem("nexora-streak", v.toString()); };
  const resetStreak = () => { setStreakCount(0); safeSetItem("nexora-streak", "0"); };
  const changeTarget = (e: React.ChangeEvent<HTMLInputElement>) => { const v = parseInt(e.target.value) || 0; setStreakTarget(v); safeSetItem("nexora-target", v.toString()); };

  const handleAddDeadline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate) return;
    const newItem: DeadlineItem = { id: Date.now().toString(), title: newTitle, module: newModule, date: newDate, type: newType, priority: newPriority };
    const updated = [...deadlines, newItem];
    setDeadlines(updated);
    safeSetItem("nexora-deadlines", JSON.stringify(updated));
    setNewTitle(""); setNewDate("");
  };
  const handleDeleteDeadline = (id: string) => {
    const updated = deadlines.filter(i => i.id !== id);
    setDeadlines(updated);
    safeSetItem("nexora-deadlines", JSON.stringify(updated));
  };
  const handleAddMark = (e: React.FormEvent) => {
    e.preventDefault();
    const s = parseInt(markScore);
    if (!markName.trim() || isNaN(s) || s < 0 || s > 100) return;
    const updated = [...marks, { id: Date.now().toString(), module: markModule, name: markName, score: s }];
    setMarks(updated);
    safeSetItem("nexora-marks", JSON.stringify(updated));
    calculateCheerMessage(updated);
    setMarkName(""); setMarkScore("");
  };
  const handleClearMarks = () => {
    setMarks([]); safeRemoveItem("nexora-marks");
    setCheerMessage({ text: "🚀 Record your first grades to start tracking your academic progress!", status: "neutral" });
  };

  const handleSendAiMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiInput.trim()) return;
    const msg = { sender: 'user' as const, text: aiInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setAiMessages(p => [...p, msg]);
    const lower = aiInput.toLowerCase();
    setAiInput("");
    setTimeout(() => {
      let reply = "That's a great question! Could you specify which module subtopic you'd like help with?";
      if (lower.includes("python") || lower.includes("software development") || lower.includes(" sd ")) reply = "🐍 For Software Development, key concepts include conditional structures (if/else), lists, dictionaries, custom functions, and file I/O. Focus on writing clean, documented code!";
      else if (lower.includes("csf") || lower.includes("gate") || lower.includes("binary") || lower.includes("computer system")) reply = "💻 CSF covers digital logic and architectures. Remember: AND (both=1), OR (at least one=1), XOR (different inputs). Practice binary↔decimal conversions!";
      else if (lower.includes("math") || lower.includes("discrete") || lower.includes("set") || lower.includes("proof")) reply = "📐 In Maths, set theory is foundational. Core ops: Union (∪), Intersection (∩), Cartesian Product (A×B). Practice direct proofs, contradiction, and induction!";
      else if (lower.includes("design") || lower.includes("ux") || lower.includes("figma") || lower.includes("ui")) reply = "🎨 Design Module focuses on UI/UX principles: consistent layouts, 8pt grid, clear typography hierarchy, and WCAG AA accessibility contrast (4.5:1 ratio).";
      else if (lower.includes("english") || lower.includes("writing") || lower.includes("academic")) reply = "📝 English requires academic literacy. Use the PEEL structure (Point, Evidence, Explanation, Link), academic vocabulary, and Harvard referencing.";
      else if (lower.match(/^(hi|hello|hey)/)) reply = "Hello! I can explain syllabus concepts, summarize lectures, or quiz you on SD, CSF, Maths, English, or Design. What shall we study?";
      setAiMessages(p => [...p, { sender: 'ai', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }, 750);
  };

  const handleSendPdfMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentPdf = viewingPdf || activePdf;
    if (!pdfInput.trim() || !currentPdf) return;
    const userText = pdfInput;
    const msg = { sender: 'user' as const, text: userText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setPdfMessages(p => [...p, msg]);
    setPdfInput("");

    try {
      const doc = mockPdfStudyData[currentPdf] || defaultPdfStudyData;
      let reply = "";
      const lower = userText.toLowerCase();

      // Quick keyword matching for instant response
      for (const kw of doc.qaKeywords) {
        if (kw.keywords.some(k => lower.includes(k))) {
          reply = kw.answer;
          break;
        }
      }

      if (!reply) {
        // Build conversation history text
        const historyText = pdfMessages
          .slice(-10)
          .map(m => `${m.sender === 'user' ? 'Student' : 'Nexora AI'}: ${m.text}`)
          .join('\n\n');

        // Call the real Genkit AI Chat server action
        const aiRes = await nexoraAIChat({
          message: `The student is studying the lecture note: "${currentPdf}". Summary: "${doc.summary}". Question: ${userText}`,
          history: historyText || undefined,
          mode: 'chat'
        });
        reply = aiRes.response;
      }

      setPdfMessages(p => [...p, { sender: 'ai', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } catch (err) {
      console.error("AI Chat error:", err);
      // Fallback
      const doc = mockPdfStudyData[currentPdf] || defaultPdfStudyData;
      let reply = `Based on ${currentPdf}, this relates to your upcoming evaluations. Try the mock quiz for practice!`;
      const lower = userText.toLowerCase();
      for (const kw of doc.qaKeywords) {
        if (kw.keywords.some(k => lower.includes(k))) { reply = kw.answer; break; }
      }
      setPdfMessages(p => [...p, { sender: 'ai', text: reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    }
  };

  const handleSelectQuizOption = (qIdx: number, optIdx: number) => {
    if (!quizSubmitted) setUserQuizAnswers(p => ({ ...p, [qIdx]: optIdx }));
  };
  const handleSubmitQuiz = () => {
    if (!activePdf) return;
    const doc = mockPdfStudyData[activePdf] || defaultPdfStudyData;
    const score = doc.quiz.filter((q, i) => userQuizAnswers[i] === q.answer).length;
    setQuizScore(score); setQuizSubmitted(true);
    if (score === doc.quiz.length) setStreakCount(p => { const n = p + 1; safeSetItem("nexora-streak", n.toString()); return n; });
  };

  const activeFocusModule = focusModulesData.find(m => m.name === activeModule);

  const ModuleIcon = ({ name, cls }: { name: string; cls?: string }) => {
    const c = cls ?? "w-4 h-4";
    if (name === "Code") return <Code className={c} />;
    if (name === "Cpu") return <Cpu className={c} />;
    if (name === "Binary") return <Binary className={c} />;
    if (name === "Languages") return <Languages className={c} />;
    if (name === "Palette") return <Palette className={c} />;
    return <FileText className={c} />;
  };

  const avg = marks.length ? Math.round(marks.reduce((a, m) => a + m.score, 0) / marks.length) : 0;
  const streakPct = streakTarget > 0 ? Math.min(100, Math.round((streakCount / streakTarget) * 100)) : 0;
  const circ = 2 * Math.PI * 36;

  if (!mounted) {
    return <div className="flex items-center justify-center min-h-[500px]"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-5 max-w-[1600px] mx-auto text-foreground">

      {/* ══ Professional Application Header ══ */}
      <motion.header variants={item} className="w-full flex items-center gap-2 sm:gap-3 px-2.5 py-2 sm:px-4 sm:py-3 bg-card border border-border rounded-xl sm:rounded-2xl shadow-sm">
        {/* Nexora Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 flex items-center justify-center">
            <svg 
              className="w-8 h-8 overflow-visible" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="header-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#298DFF" />
                  <stop offset="100%" stopColor="#00C2FF" />
                </linearGradient>
              </defs>
              <path
                d="M30 75 V25 H40 L60 65 V25 H70 V75 H60 L40 35 V75 H30 Z"
                fill="url(#header-logo-grad)"
              />
            </svg>
          </div>
          <div className="hidden sm:flex flex-col leading-none">
            <span className="text-foreground font-black text-sm tracking-wide">NEXORA</span>
            <span className="text-[9px] text-primary font-bold uppercase tracking-widest">Academic Suite</span>
          </div>
        </div>

        <div className="w-px h-6 bg-border shrink-0 hidden sm:block" />

        {/* Tab Navigation */}
        <nav className="flex-1 flex items-center gap-0.5 overflow-x-auto">
          {([
            { key: "home", label: "Study Hub" },
            { key: "calendar", label: "Calendar" },
            { key: "tracker", label: "Grades" },
            { key: "ai", label: "AI Tutor" },
            { key: "mock-arena", label: "Mock Arena" },
            { key: "analytics", label: "Analytics" },
            { key: "summary", label: "Summary" },
          ] as { key: typeof activeTab; label: string }[]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-all",
                activeTab === tab.key
                  ? "bg-primary text-white shadow-sm shadow-primary/25"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden lg:flex flex-col items-end leading-none">
            <span className="font-mono text-foreground font-black text-sm">{time}</span>
            <span className="text-[9px] text-muted-foreground mt-0.5">{currentDate}</span>
          </div>
          <div className="w-px h-6 bg-border hidden lg:block" />
          <div className="flex items-center gap-1 px-1.5 py-1 sm:px-2.5 sm:py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg sm:rounded-xl">
            <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400" />
            <span className="text-xs sm:text-sm font-black text-orange-400 leading-none">{streakCount}</span>
            <span className="text-[8px] sm:text-[9px] text-orange-400/50 font-bold">/{streakTarget}</span>
          </div>
          <Button onClick={toggleTheme} variant="ghost" size="icon" className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted" title="Toggle theme">
            {themeMode === 'dark' ? <Sun className="w-3.5 h-3.5 text-yellow-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
          </Button>
          <Button variant="ghost" size="icon" className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl text-muted-foreground hover:text-red-400 hover:bg-red-500/10" title="Sign out"
            onClick={() => { try { localStorage.clear(); } catch (e) {} window.location.href = '/'; }}
          >
            <LogOut className="w-3.5 h-3.5" />
          </Button>
        </div>
      </motion.header>

      {/* ══ Dynamic Tab Content ══ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.18 }}
          className="w-full flex flex-col gap-5"
        >

          {/* ─── TAB 1: STUDY HUB ─── */}
          {activeTab === "home" && (
            <div className="flex flex-col gap-5">

              {/* Module Selector */}
              <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {activeModule ? "Active Module" : "Choose a Module"}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-md uppercase">{selectedYear}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <select value={selectedYear} onChange={e => { setSelectedYear(e.target.value); setActiveModule(null); setActivePdf(null); }}
                      className="h-8 rounded-lg px-2.5 bg-muted border border-border text-foreground text-xs outline-none cursor-pointer">
                      <option value="Y1S1">Year 1 · Sem 1</option>
                      <option value="Y1S2">Year 1 · Sem 2 (Locked)</option>
                      <option value="Y2S1">Year 2 · Sem 1 (Locked)</option>
                    </select>
                    {(activeModule || activePdf) && (
                      <Button onClick={() => { setActiveModule(null); setActivePdf(null); }} size="sm" variant="outline" className="h-8 px-3 rounded-lg text-xs border-border hover:bg-muted text-foreground">
                        ← Reselect
                      </Button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3.5">
                  {focusModulesData.map(mod => {
                    const sel = activeModule === mod.name;
                    return (
                      <button key={mod.code} onClick={() => { setActiveModule(mod.name); setActivePdf(null); setStudyMode("lec"); }}
                        className={cn("flex items-center gap-2 sm:gap-3.5 p-2.5 sm:p-4 rounded-lg sm:rounded-xl border cursor-pointer text-left transition-all w-full",
                          sel ? "bg-primary/10 border-primary/50 shadow-md ring-1 ring-primary/20" : "bg-card border-border hover:border-primary/30 hover:bg-muted/50"
                        )}
                      >
                        <div className={cn("w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-tr flex items-center justify-center text-white shrink-0 shadow-sm", mod.color)}>
                          <ModuleIcon name={mod.iconName} cls="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0 leading-tight">
                          <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-wider text-muted-foreground">{mod.code}</span>
                          <span className={cn("text-[10px] sm:text-xs font-bold mt-0.5 sm:mt-1 truncate", sel ? "text-primary font-black" : "text-foreground")}>{mod.name}</span>
                        </div>
                        {sel && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {selectedYear !== "Y1S1" ? (
                <div className="flex flex-col items-center justify-center p-16 bg-card border border-border rounded-2xl text-center min-h-[280px]">
                  <Library className="w-10 h-10 text-muted-foreground/20 mb-3" />
                  <h3 className="font-bold text-sm text-foreground">No resources for {selectedYear}</h3>
                  <p className="text-xs text-muted-foreground mt-1">Switch back to Year 1 Sem 1 to access modules.</p>
                </div>
              ) : !activeModule ? (
                <div className="flex flex-col items-center justify-center p-16 bg-card border border-dashed border-border rounded-2xl text-center min-h-[280px]">
                  <Library className="w-12 h-12 text-primary/20 mb-4" />
                  <h3 className="font-black text-xl text-foreground">Select a Module Above</h3>
                  <p className="text-xs text-muted-foreground mt-2 max-w-sm">Choose a module to access lecture slides, tutorial sheets, and interactive AI Study Decks.</p>
                </div>
              ) : activeModule && !activePdf && activeFocusModule ? (
                <div className="flex flex-col gap-5">
                  {/* Active module hero — BIG display */}
                  <div className="flex items-center gap-5 p-6 bg-card border border-border rounded-2xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.04] bg-gradient-to-br from-primary to-indigo-600 pointer-events-none" />
                    <div className={cn("w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white shadow-lg shrink-0", activeFocusModule.color)}>
                      <ModuleIcon name={activeFocusModule.iconName} cls="w-7 h-7" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <span className="text-[10px] text-primary font-black uppercase tracking-widest">{activeFocusModule.code} · {activeFocusModule.type}</span>
                      <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight mt-0.5">{activeModule}</h2>
                      <p className="text-[11px] text-muted-foreground/70 mt-1 hidden sm:block">{activeFocusModule.desc}</p>
                    </div>
                  </div>

                  {/* Lec / Tut / Rev toggle */}
                  <div className={cn("grid gap-2 bg-muted p-1.5 rounded-xl border border-border", 
                    activeFocusModule.resources.rev ? "grid-cols-3" : "grid-cols-2"
                  )}>
                    {([["lec", "📖 Lectures"], ["tut", "✏️ Tutorials"]] as const).map(([mode, label]) => (
                      <button key={mode} onClick={() => setStudyMode(mode)}
                        className={cn("py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all", studyMode === mode ? "bg-primary text-white shadow-md border-none" : "text-muted-foreground hover:text-foreground hover:bg-card/45")}
                      >
                        {label}
                      </button>
                    ))}
                    {activeFocusModule.resources.rev && (
                      <button onClick={() => setStudyMode("rev")}
                        className={cn("py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all", studyMode === "rev" ? "bg-primary text-white shadow-md border-none" : "text-muted-foreground hover:text-foreground hover:bg-card/45")}
                      >
                        🐍 Revisions
                      </button>
                    )}
                  </div>

                  {/* File list grouped by weeks */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-1">
                      {activeFocusModule.resources[studyMode]?.length || 0} files — click to open Study Deck
                    </span>
                    {(() => {
                      const resourcesList = activeFocusModule.resources[studyMode] || [];
                      const groupedByWeek: Record<string, typeof resourcesList> = {};
                      resourcesList.forEach(res => {
                        const weekKey = (res as any).week ? `Week ${(res as any).week}` : "General / Additional Resources";
                        if (!groupedByWeek[weekKey]) {
                          groupedByWeek[weekKey] = [];
                        }
                        groupedByWeek[weekKey].push(res);
                      });

                      const sortedWeekKeys = Object.keys(groupedByWeek).sort((a, b) => {
                        if (a.startsWith("Week") && b.startsWith("Week")) {
                          const numA = parseInt(a.replace("Week ", ""), 10);
                          const numB = parseInt(b.replace("Week ", ""), 10);
                          return numA - numB;
                        }
                        if (a.startsWith("Week")) return -1;
                        if (b.startsWith("Week")) return 1;
                        return a.localeCompare(b);
                      });

                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
                          {sortedWeekKeys.map((weekName) => (
                            <div key={weekName} className="flex flex-col gap-3 p-4 bg-muted/20 border border-border/40 rounded-2xl h-fit">
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00C2FF] px-1 shrink-0">
                                  {weekName}
                                </span>
                                <div className="h-[1px] bg-foreground/10 flex-grow" />
                              </div>
                              <div className="flex flex-col gap-2.5">
                                {groupedByWeek[weekName].map((res, idx) => (
                                  <div key={idx} onClick={() => { setActivePdf(res.name); setPdfSubTab("qa"); setPdfMessages([{ sender: 'ai', text: `Study Deck loaded for "${res.name}". Ask me anything, or take the mock quiz!`, time: "Just now" }]); setUserQuizAnswers({}); setQuizSubmitted(false); }}
                                    className="flex items-center justify-between p-3 bg-card border border-border rounded-xl group hover:border-primary/40 hover:bg-muted/40 transition-all cursor-pointer"
                                  >
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                                        <FileText className="w-3.5 h-3.5" />
                                      </div>
                                      <div className="min-w-0">
                                        <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors block truncate" title={res.name}>{res.name}</span>
                                        <span className="block text-[8px] text-muted-foreground font-semibold leading-none mt-0.5">{res.size}</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                      <button onClick={e => { e.stopPropagation(); setViewingPdf(res.name); setPdfViewMode('pdf'); }}
                                        className="text-[8px] font-bold uppercase border border-border hover:border-primary/40 hover:bg-primary/10 text-muted-foreground hover:text-primary rounded-lg px-2 py-1 transition-colors">
                                        {res.name.endsWith(".pdf") ? "View PDF" : res.name.endsWith(".pptx") ? "View Slides" : "View Doc"}
                                      </button>
                                      <button onClick={e => { e.stopPropagation(); setViewingPdf(res.name); setPdfViewMode('notes'); }}
                                        className="text-[8px] font-bold uppercase text-primary bg-primary/10 hover:bg-primary hover:text-white rounded-lg px-2 py-1 transition-colors">
                                        Short Notes
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ) : activeModule && activePdf && activeFocusModule ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left: file info + timer */}
                  <Card className="lg:col-span-7 bg-card border border-border rounded-2xl p-6 flex flex-col gap-5">
                    <div className="flex items-center justify-between">
                      <button onClick={() => setActivePdf(null)} className="text-xs font-bold text-primary hover:text-foreground transition-colors flex items-center gap-1">
                        ← Back to Files
                      </button>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { setViewingPdf(activePdf); setPdfViewMode('pdf'); }}
                          className="text-[9px] font-bold uppercase border border-border hover:border-primary/40 hover:bg-primary/10 text-muted-foreground hover:text-primary px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all">
                          {activePdf.endsWith(".pdf") ? "View PDF" : activePdf.endsWith(".pptx") ? "View Slides" : "View Doc"} <ExternalLink className="w-3 h-3" />
                        </button>
                        <button onClick={() => { setViewingPdf(activePdf); setPdfViewMode('notes'); }}
                          className="text-[9px] font-bold uppercase bg-primary text-white hover:opacity-90 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all">
                          Short Notes
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-[9px] font-black text-primary uppercase tracking-wider">{activeFocusModule.code} · {studyMode === "lec" ? "Lecture Note" : studyMode === "tut" ? "Tutorial" : "Revision Material"}</span>
                        <h3 className="text-base font-black text-foreground leading-tight">{activePdf}</h3>
                      </div>
                    </div>
                    <div className="bg-muted p-4 rounded-xl border border-border">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1.5">Context Summary</p>
                      <p className="text-xs text-foreground/70 italic leading-relaxed">"{mockPdfStudyData[activePdf]?.summary || defaultPdfStudyData.summary}"</p>
                    </div>
                    {/* Pomodoro */}
                    <div className="flex flex-col items-center bg-background border border-border p-5 rounded-xl gap-3">
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Pomodoro Focus Timer</span>
                      <span className="text-5xl font-mono font-black text-primary tracking-widest">{formatTimer(timerSeconds)}</span>
                      <div className="flex gap-2">
                        <Button onClick={() => setTimerIsActive(!timerIsActive)} className={cn("px-6 h-9 rounded-xl flex items-center gap-2 font-bold text-xs uppercase shadow-sm", timerIsActive ? "bg-red-500 hover:bg-red-600" : "bg-emerald-500 hover:bg-emerald-600")}>
                          {timerIsActive ? <><Pause className="w-3.5 h-3.5" />Pause</> : <><Play className="w-3.5 h-3.5 fill-white" />Start Focus</>}
                        </Button>
                        <Button onClick={() => { setTimerIsActive(false); setTimerSeconds(25 * 60); }} variant="outline" size="icon" className="w-9 h-9 rounded-xl border-border text-muted-foreground hover:text-foreground">
                          <RotateCcw className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Card>

                  {/* Right: QA / Quiz */}
                  <div className="lg:col-span-5 flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-1.5 bg-muted p-1 rounded-xl">
                      {([["qa", "Ask AI (Q&A)"], ["quiz", "Mock Quiz"]] as const).map(([tab, label]) => (
                        <button key={tab} onClick={() => setPdfSubTab(tab)}
                          className={cn("py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all", pdfSubTab === tab ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground")}
                        >{label}</button>
                      ))}
                    </div>

                    {pdfSubTab === "qa" && (
                      <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 flex-1 min-h-[300px]">
                        <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[220px] pr-1">
                          {pdfMessages.map((msg, i) => (
                            <div key={i} className={cn("max-w-[90%] p-3 rounded-xl text-[11px] leading-relaxed", msg.sender === 'user' ? "bg-primary text-white self-end rounded-tr-none" : "bg-muted text-foreground border border-border self-start rounded-tl-none")}>
                              {msg.text}
                            </div>
                          ))}
                        </div>
                        <form onSubmit={handleSendPdfMessage} className="flex gap-2 bg-muted p-1.5 rounded-lg border border-border">
                          <Input value={pdfInput} onChange={e => setPdfInput(e.target.value)} placeholder="Ask about this PDF..." className="bg-transparent border-none text-[11px] h-8 focus-visible:ring-0 flex-1 px-2 text-foreground placeholder:text-muted-foreground" />
                          <Button type="submit" size="icon" className="w-8 h-8 rounded-lg bg-primary text-white shrink-0"><Send className="w-3.5 h-3.5" /></Button>
                        </form>
                      </div>
                    )}

                    {pdfSubTab === "quiz" && (
                      <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-4 max-h-[380px] overflow-y-auto">
                        {!quizSubmitted ? (
                          <div className="flex flex-col gap-4 text-xs">
                            {(mockPdfStudyData[activePdf]?.quiz || defaultPdfStudyData.quiz).map((q, qi) => (
                              <div key={qi} className="flex flex-col gap-2">
                                <p className="font-bold text-foreground">{qi + 1}. {q.question}</p>
                                <div className="flex flex-col gap-1.5">
                                  {q.options.map((opt, oi) => (
                                    <button key={oi} onClick={() => handleSelectQuizOption(qi, oi)}
                                      className={cn("text-left p-2.5 rounded-lg border text-[11px] font-medium transition-all", userQuizAnswers[qi] === oi ? "bg-primary/15 border-primary text-foreground" : "bg-muted border-border text-muted-foreground hover:text-foreground hover:border-primary/30")}
                                    >{opt}</button>
                                  ))}
                                </div>
                              </div>
                            ))}
                            <Button onClick={handleSubmitQuiz} disabled={Object.keys(userQuizAnswers).length < (mockPdfStudyData[activePdf]?.quiz || defaultPdfStudyData.quiz).length}
                              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase text-[10px] tracking-wider py-2.5 rounded-lg">
                              Submit Answers
                            </Button>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-4 text-xs">
                            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center justify-between">
                              <div>
                                <span className="text-[9px] font-black uppercase text-muted-foreground block">Score</span>
                                <span className="text-xl font-black text-emerald-500">{quizScore} / {(mockPdfStudyData[activePdf]?.quiz || defaultPdfStudyData.quiz).length}</span>
                              </div>
                              <span className="text-[9px] font-black uppercase bg-emerald-500 text-white px-2 py-1 rounded-lg">
                                {quizScore === (mockPdfStudyData[activePdf]?.quiz || defaultPdfStudyData.quiz).length ? "+1 Streak!" : "Reviewed"}
                              </span>
                            </div>
                            {(mockPdfStudyData[activePdf]?.quiz || defaultPdfStudyData.quiz).map((q, qi) => (
                              <div key={qi} className="bg-muted border border-border p-3 rounded-xl flex flex-col gap-1.5">
                                <div className="flex items-start gap-2">
                                  <span className={userQuizAnswers[qi] === q.answer ? "text-emerald-500 font-bold" : "text-red-500 font-bold"}>{userQuizAnswers[qi] === q.answer ? "✓" : "✗"}</span>
                                  <p className="font-bold text-foreground text-[11px]">{qi + 1}. {q.question}</p>
                                </div>
                                <p className="text-[10px] text-muted-foreground pl-4"><strong className="text-foreground">Explanation:</strong> {q.explanation}</p>
                              </div>
                            ))}
                            <Button onClick={() => { setUserQuizAnswers({}); setQuizSubmitted(false); }} variant="outline" className="w-full border-border text-foreground text-[10px] font-black uppercase tracking-wider py-2.5 rounded-lg hover:bg-muted">
                              Retake Quiz
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* ─── TAB 2: CALENDAR & ALERTS ─── */}
          {activeTab === "calendar" && (
            <div className="flex flex-col gap-5">
              {alerts.length > 0 && (
                <div className="flex flex-col gap-2">
                  {alerts.map(alert => (
                    <div key={alert.id} className={cn("flex items-center gap-3 p-3.5 rounded-xl border", alert.type === "critical" ? "bg-red-500/10 border-red-500/25" : "bg-amber-500/10 border-amber-500/25")}>
                      <BellRing className={cn("w-4 h-4 shrink-0", alert.type === "critical" ? "text-red-500 animate-bounce" : "text-amber-500")} />
                      <span className="text-xs font-semibold text-foreground flex-1">{alert.text}</span>
                      <span className={cn("text-[9px] font-black uppercase px-2 py-1 rounded-lg border shrink-0", alert.type === "critical" ? "text-red-500 bg-red-500/10 border-red-500/20" : "text-amber-500 bg-amber-500/10 border-amber-500/20")}>
                        {alert.daysLeft === 0 ? "Today!" : `${alert.daysLeft}d left`}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                {/* Calendar */}
                <div className="xl:col-span-7 bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <button onClick={handlePrevMonth} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors font-bold text-base">‹</button>
                    <span className="text-sm font-black text-foreground uppercase tracking-wide">{monthNames[currentCalMonth]} {currentCalYear}</span>
                    <button onClick={handleNextMonth} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors font-bold text-base">›</button>
                  </div>
                  <div className="grid grid-cols-7 text-center">
                    {["S","M","T","W","T","F","S"].map((d, i) => (
                      <span key={i} className="text-[10px] font-black uppercase text-muted-foreground py-1">{d}</span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array(new Date(currentCalYear, currentCalMonth, 1).getDay()).fill(null).map((_, i) => <div key={i} />)}
                    {Array.from({ length: new Date(currentCalYear, currentCalMonth + 1, 0).getDate() }, (_, i) => i + 1).map(day => {
                      const fd = getFormattedDateString(day);
                      const tod = isToday(day);
                      const sel = selectedCalDate === fd;
                      const evts = deadlines.filter(d => d.date === fd);
                      return (
                        <button key={day} onClick={() => handleDayClick(day)}
                          className={cn("aspect-square rounded-xl flex flex-col items-center justify-center p-1 transition-all text-[11px] border font-medium",
                            sel ? "bg-primary text-white border-primary font-bold shadow-sm shadow-primary/20"
                              : tod ? "bg-primary/15 border-primary/40 text-primary font-black"
                              : "bg-transparent border-transparent hover:bg-muted text-foreground hover:border-border"
                          )}
                        >
                          <span>{day}</span>
                          {evts.length > 0 && (
                            <div className="flex gap-0.5 mt-0.5">
                              {evts.slice(0, 2).map((ev, i) => (
                                <span key={i} className={cn("w-1 h-1 rounded-full", ev.priority === "High" ? "bg-red-500" : ev.priority === "Medium" ? "bg-amber-500" : "bg-emerald-500", sel ? "bg-white/70" : "")} />
                              ))}
                              {evts.length > 2 && <span className="text-[6px] font-bold">+</span>}
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-4 pt-2 border-t border-border">
                    {([["High","bg-red-500"],["Medium","bg-amber-500"],["Low","bg-emerald-500"]] as const).map(([l,c]) => (
                      <div key={l} className="flex items-center gap-1.5">
                        <span className={cn("w-2 h-2 rounded-full", c)} />
                        <span className="text-[9px] text-muted-foreground font-semibold">{l} Priority</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right column */}
                <div className="xl:col-span-5 flex flex-col gap-4">
                  <form onSubmit={handleAddDeadline} className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3">
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                      <Plus className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold text-foreground">Add Event</span>
                    </div>
                    <Input placeholder="Title (e.g. Lab Report 04, Final Exam)" value={newTitle} onChange={e => setNewTitle(e.target.value)}
                      className="h-9 rounded-lg bg-muted border-border text-xs text-foreground placeholder:text-muted-foreground" required />
                    <div className="grid grid-cols-2 gap-2">
                      <select value={newModule} onChange={e => setNewModule(e.target.value)} className="h-9 rounded-lg px-3 bg-muted border border-border text-foreground text-xs outline-none cursor-pointer">
                        <option>Software Development</option>
                        <option value="Computer Systems Fundamentals (CSF)">CSF</option>
                        <option>Mathematics</option>
                        <option value="English Module">English</option>
                        <option value="Design Module">Design</option>
                      </select>
                      <select value={newType} onChange={e => setNewType(e.target.value as any)} className="h-9 rounded-lg px-3 bg-muted border border-border text-foreground text-xs outline-none cursor-pointer">
                        <option value="deadline">Deadline</option>
                        <option value="evaluation">Evaluation</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="date" value={newDate} onChange={e => { setNewDate(e.target.value); setSelectedCalDate(e.target.value); }}
                        className="h-9 rounded-lg px-3 bg-muted border border-border text-foreground text-xs outline-none cursor-pointer" required />
                      <select value={newPriority} onChange={e => setNewPriority(e.target.value as any)} className="h-9 rounded-lg px-3 bg-muted border border-border text-foreground text-xs outline-none cursor-pointer">
                        <option value="High">🔴 High</option>
                        <option value="Medium">🟡 Medium</option>
                        <option value="Low">🟢 Low</option>
                      </select>
                    </div>
                    <Button type="submit" className="h-9 bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider rounded-lg">Save Event</Button>
                  </form>

                  <div className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-3">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                      <span className="text-xs font-bold text-foreground">
                        {selectedCalDate ? `Events on ${selectedCalDate}` : "All Events"} ({deadlines.filter(d => !selectedCalDate || d.date === selectedCalDate).length})
                      </span>
                      {selectedCalDate && (
                        <button onClick={() => { setSelectedCalDate(""); setNewDate(""); }} className="text-[10px] text-primary hover:text-foreground font-semibold transition-colors">Show All</button>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-1">
                      {deadlines.filter(d => !selectedCalDate || d.date === selectedCalDate).length > 0 ? (
                        deadlines.filter(d => !selectedCalDate || d.date === selectedCalDate).map(item => (
                          <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-xl border border-border group hover:border-primary/20 transition-colors">
                            <div className="flex items-center gap-2.5">
                              <span className={cn("w-2 h-2 rounded-full shrink-0", item.priority === "High" ? "bg-red-500" : item.priority === "Medium" ? "bg-amber-500" : "bg-emerald-500")} />
                              <div>
                                <span className="text-xs font-bold text-foreground block">{item.title}</span>
                                <span className="text-[9px] text-primary font-semibold uppercase">{item.module}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] text-muted-foreground font-semibold">{item.date}</span>
                              <Button onClick={() => handleDeleteDeadline(item.id)} variant="ghost" size="icon" className="w-6 h-6 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex flex-col items-center py-8 text-muted-foreground">
                          <CalendarIcon className="w-7 h-7 opacity-20 mb-2" />
                          <span className="text-[10px] font-semibold">No events found</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB 3: GRADES & GPA ─── */}
          {activeTab === "tracker" && (
            <div className="flex flex-col gap-5">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Logged Assessments", value: String(marks.length), sub: "entries recorded", color: "text-foreground" },
                  { label: "Semester Average", value: marks.length ? `${avg}%` : "—", sub: `${avg}% score`, color: "text-primary" },
                  { label: "Estimated GPA", value: calcGPA(), sub: "grade estimate", color: "text-emerald-500" },
                ].map(stat => (
                  <div key={stat.label} className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                    <span className={cn("text-4xl font-black", stat.color)}>{stat.value}</span>
                    {stat.label === "Semester Average" && marks.length > 0 && (
                      <div className="w-full h-1.5 bg-muted rounded-full mt-1 overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${avg}%` }} />
                      </div>
                    )}
                    <span className="text-[10px] text-muted-foreground">{stat.sub}</span>
                  </div>
                ))}
              </div>

              {/* Cheer */}
              <div className={cn("flex items-start gap-3 p-4 rounded-xl border", cheerMessage.status === "up" ? "bg-emerald-500/10 border-emerald-500/20" : cheerMessage.status === "down" ? "bg-orange-500/10 border-orange-500/20" : "bg-muted border-border")}>
                <ThumbsUp className={cn("w-4 h-4 shrink-0 mt-0.5", cheerMessage.status === "up" ? "text-emerald-500" : cheerMessage.status === "down" ? "text-orange-500" : "text-primary")} />
                <p className="text-xs text-foreground leading-relaxed">{cheerMessage.text}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <Card className="lg:col-span-4 bg-card border border-border rounded-2xl p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2 pb-2 border-b border-border">
                    <BarChart2 className="w-4 h-4 text-primary" />
                    <span className="text-sm font-bold text-foreground">Log Assessment</span>
                  </div>
                  <form onSubmit={handleAddMark} className="flex flex-col gap-3">
                    <select value={markModule} onChange={e => setMarkModule(e.target.value)} className="h-9 rounded-lg px-3 bg-muted border border-border text-foreground text-xs outline-none cursor-pointer">
                      <option>Software Development</option>
                      <option value="Computer Systems Fundamentals (CSF)">CSF</option>
                      <option>Mathematics</option>
                      <option value="English Module">English</option>
                      <option value="Design Module">Design</option>
                    </select>
                    <Input placeholder="Assessment name" value={markName} onChange={e => setMarkName(e.target.value)} className="h-9 rounded-lg bg-muted border-border text-xs text-foreground placeholder:text-muted-foreground" required />
                    <Input type="number" min="0" max="100" placeholder="Score (0–100)" value={markScore} onChange={e => setMarkScore(e.target.value)} className="h-9 rounded-lg bg-muted border-border text-xs text-foreground placeholder:text-muted-foreground" required />
                    <Button type="submit" className="h-9 bg-primary hover:bg-primary/90 text-white font-bold text-xs uppercase tracking-wider rounded-lg">Record Score</Button>
                  </form>
                </Card>

                <Card className="lg:col-span-8 bg-card border border-border rounded-2xl p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="text-sm font-bold text-foreground">Grade History</span>
                    {marks.length > 0 && <button onClick={handleClearMarks} className="text-[9px] text-red-500 hover:text-red-400 font-bold uppercase tracking-wider">Clear All</button>}
                  </div>
                  <div className="flex flex-col gap-2 max-h-[320px] overflow-y-auto pr-1">
                    {marks.length > 0 ? (
                      [...marks].reverse().map((mark, i) => {
                        const c = mark.score >= 70 ? "text-emerald-500" : mark.score >= 50 ? "text-amber-500" : "text-red-500";
                        const bc = mark.score >= 70 ? "bg-emerald-500" : mark.score >= 50 ? "bg-amber-500" : "bg-red-500";
                        return (
                          <div key={mark.id} className={cn("flex items-center justify-between p-3 rounded-xl border transition-all", i === 0 ? "bg-primary/5 border-primary/20" : "bg-muted border-border")}>
                            <div>
                              <span className="text-xs font-bold text-foreground block">{mark.name}</span>
                              <span className="text-[9px] text-muted-foreground font-semibold uppercase">{mark.module}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="w-20 h-1.5 bg-border rounded-full overflow-hidden hidden sm:block">
                                <div className={cn("h-full rounded-full", bc)} style={{ width: `${mark.score}%` }} />
                              </div>
                              <span className={cn("text-lg font-black italic", c)}>{mark.score}%</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="flex flex-col items-center py-12 text-muted-foreground">
                        <ChartIcon className="w-10 h-10 opacity-10 mb-2" />
                        <span className="text-xs font-semibold">No grades recorded yet</span>
                        <span className="text-[10px] mt-1 text-muted-foreground">Add your first assessment using the form</span>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* ─── TAB 4: AI TUTOR ─── */}
          {activeTab === "ai" && (
            <Card className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-5 min-h-[500px] h-[calc(100dvh-15rem)] lg:h-[600px]">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <span className="text-sm font-black text-foreground">Nexora AI Tutor</span>
                    <p className="text-[10px] text-muted-foreground">Ask anything about Y1S1 modules</p>
                  </div>
                </div>
                <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">● Online</span>
              </div>
              <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1">
                {aiMessages.map((msg, i) => (
                  <div key={i} className={cn("max-w-[82%] rounded-2xl p-4 text-xs leading-relaxed flex flex-col gap-1", msg.sender === 'user' ? "bg-primary text-white self-end rounded-tr-none" : "bg-muted border border-border text-foreground self-start rounded-tl-none")}>
                    <p>{msg.text}</p>
                    <span className="text-[8px] opacity-50 self-end font-semibold">{msg.time}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendAiMessage} className="flex gap-2 bg-muted p-2 rounded-xl border border-border">
                <Input value={aiInput} onChange={e => setAiInput(e.target.value)} placeholder="Ask about Python, CSF, Maths, Design or English..." className="bg-transparent border-none text-xs h-10 focus-visible:ring-0 flex-1 px-3 text-foreground placeholder:text-muted-foreground" />
                <Button type="submit" size="icon" className="w-10 h-10 rounded-lg bg-primary hover:bg-primary/90 text-white shrink-0"><Send className="w-4 h-4" /></Button>
              </form>
            </Card>
          )}

          {/* ─── TAB 5: SUMMARY ─── */}
          {activeTab === "summary" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {/* Profile */}
              <Card className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20 shrink-0 relative">
                    NP
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-card flex items-center justify-center">
                      <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-base font-black text-foreground">Nimuthu Pathirathne</h3>
                    <p className="text-xs text-muted-foreground">BSc (Hons) Computer Science</p>
                    <p className="text-[10px] text-primary font-semibold mt-0.5">Year 1 · Semester 1 · Active</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border">
                  <div className="bg-muted rounded-xl p-3 text-center">
                    <span className="text-2xl font-black text-foreground">{marks.length}</span>
                    <p className="text-[9px] text-muted-foreground uppercase font-semibold mt-0.5">Assessments</p>
                  </div>
                  <div className="bg-muted rounded-xl p-3 text-center">
                    <span className="text-2xl font-black text-primary">{marks.length ? `${avg}%` : "—"}</span>
                    <p className="text-[9px] text-muted-foreground uppercase font-semibold mt-0.5">Avg Score</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 pt-2 border-t border-border">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Appearance</span>
                  <div className="grid grid-cols-2 gap-1.5 bg-muted p-1 rounded-lg">
                    {([["light", Sun, "Light"], ["dark", Moon, "Dark"]] as const).map(([mode, Icon, label]) => (
                      <button key={mode} onClick={() => {
                        setThemeMode(mode);
                        try { localStorage.setItem('theme', mode); document.documentElement.classList.toggle('light', mode === 'light'); document.documentElement.classList.toggle('dark', mode === 'dark'); } catch (e) {}
                      }} className={cn("py-2 rounded-md text-[10px] font-bold uppercase flex items-center justify-center gap-1.5 transition-all", themeMode === mode ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground")}>
                        <Icon className="w-3 h-3" /> {label}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Streak */}
              <Card className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-foreground">Study Streak</span>
                  <Flame className="w-5 h-5 text-orange-400" />
                </div>
                <div className="flex items-center gap-5">
                  <div className="relative w-24 h-24 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 88 88">
                      <circle cx="44" cy="44" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted" />
                      <motion.circle
                        initial={{ strokeDashoffset: circ }}
                        animate={{ strokeDashoffset: circ - (circ * streakPct / 100) }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        cx="44" cy="44" r="36" stroke="currentColor" strokeWidth="8" fill="transparent"
                        strokeDasharray={circ} strokeLinecap="round" className="text-orange-400"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-foreground leading-none">{streakCount}</span>
                      <span className="text-[8px] text-muted-foreground font-semibold">days</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div>
                      <span className="text-2xl font-black text-orange-400">{streakPct}%</span>
                      <p className="text-[10px] text-muted-foreground">of target reached</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground">Goal:</span>
                      <input type="number" min="1" value={streakTarget} onChange={changeTarget} className="bg-muted border border-border rounded-lg px-2 py-1 text-xs font-black text-foreground w-16 outline-none text-center" />
                      <span className="text-[10px] text-muted-foreground">days</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={incrementStreak} className="flex-1 h-9 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs uppercase">+ Focus Day</Button>
                  <Button onClick={resetStreak} variant="outline" className="h-9 px-4 rounded-xl border-border text-muted-foreground hover:text-foreground hover:bg-muted text-xs font-bold uppercase">Reset</Button>
                </div>
              </Card>

              {/* GPA Overview */}
              <Card className="bg-card border border-border rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-foreground">Academic Overview</span>
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div className="bg-gradient-to-br from-primary/10 to-indigo-500/10 border border-primary/20 rounded-xl p-4 text-center">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Estimated GPA</span>
                  <p className="text-3xl font-black text-primary mt-1">{calcGPA()}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">based on {marks.length} assessments</p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">Module Scores</span>
                  {focusModulesData.map(mod => {
                    const modMarks = marks.filter(m => m.module === mod.name || (m.module === "Computer Systems Fundamentals (CSF)" && mod.code === "CS102"));
                    const modAvg = modMarks.length > 0 ? Math.round(modMarks.reduce((a, m) => a + m.score, 0) / modMarks.length) : null;
                    return (
                      <div key={mod.code} className="flex items-center justify-between p-2.5 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className={cn("w-5 h-5 rounded bg-gradient-to-br flex items-center justify-center text-white text-[7px] font-black", mod.color)}>{mod.code.slice(0, 2)}</div>
                          <span className="text-xs font-semibold text-foreground">{mod.name}</span>
                        </div>
                        <span className={cn("text-xs font-black", modAvg !== null ? (modAvg >= 70 ? "text-emerald-500" : modAvg >= 50 ? "text-amber-500" : "text-red-500") : "text-muted-foreground")}>
                          {modAvg !== null ? `${modAvg}%` : "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          )}

          {/* ─── TAB 6: MOCK ARENA ─── */}
          {activeTab === "mock-arena" && (
            <div className="flex flex-col gap-6">
              <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 p-4 bg-card border border-border rounded-2xl">
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-black tracking-tight text-foreground">Mock Arena</h1>
                  <p className="text-xs text-muted-foreground">Test your knowledge under real exam conditions.</p>
                </div>
                <div className="bg-muted px-4 py-2.5 rounded-xl flex items-center gap-3 border border-border">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-lg font-black text-foreground">84%</span>
                    <span className="text-[8px] uppercase tracking-wider text-muted-foreground">Avg Accuracy</span>
                  </div>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[
                  { id: 1, title: "Mid-Term Mock: Data Structures", time: "60 mins", difficulty: "Medium", questions: 30, status: "Available" },
                  { id: 2, title: "Final Prep: Discrete Mathematics", time: "120 mins", difficulty: "Hard", questions: 50, status: "Attempted" },
                  { id: 3, title: "Interactive Quiz: OOP Principles", time: "20 mins", difficulty: "Easy", questions: 15, status: "Available" },
                  { id: 4, title: "Past Paper 2023: Algorithms", time: "180 mins", difficulty: "Hard", questions: 60, status: "Locked" },
                ].map((exam) => {
                  const isLocked = exam.status === "Locked";
                  return (
                    <Card key={exam.id} className={cn(
                      "bg-card border border-border rounded-2xl overflow-hidden transition-all hover:bg-muted/35 hover:border-primary/30",
                      isLocked && "opacity-60"
                    )}>
                      <div className="p-6 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                          <div className="flex flex-col gap-1">
                            <Badge variant="outline" className={cn(
                              "w-fit text-[8px] uppercase font-black tracking-widest",
                              exam.difficulty === "Easy" ? "text-green-400 border-green-400/20 bg-green-400/10" :
                              exam.difficulty === "Medium" ? "text-yellow-400 border-yellow-400/20 bg-yellow-400/10" :
                              "text-red-400 border-red-400/20 bg-red-400/10"
                            )}>
                              {exam.difficulty}
                            </Badge>
                            <h3 className="text-base font-bold text-foreground mt-1.5">{exam.title}</h3>
                          </div>
                          {isLocked ? <Lock className="w-5 h-5 text-muted-foreground" /> : <PlayCircle className="w-6 h-6 text-primary" />}
                        </div>

                        <div className="flex flex-wrap gap-4 text-muted-foreground">
                          <div className="flex items-center gap-1.5 text-xs font-semibold">
                            <Timer className="w-3.5 h-3.5" />
                            <span>{exam.time}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-semibold">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{exam.questions} Qs</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-semibold">
                            <BarChart3 className="w-3.5 h-3.5" />
                            <span>{exam.status}</span>
                          </div>
                        </div>

                        <Button 
                          disabled={isLocked} 
                          className="w-full rounded-xl h-10 bg-primary hover:bg-primary/95 text-white font-bold text-xs uppercase tracking-wide border-none transition-all active:scale-95 shadow-md shadow-primary/10"
                        >
                          {exam.status === "Attempted" ? "Review Results" : "Start Exam"}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <Card className="bg-card border border-border rounded-2xl p-6">
                <h3 className="text-base font-black text-foreground">Performance History</h3>
                <p className="text-xs text-muted-foreground">Your recent attempts and scores</p>
                
                <div className="flex flex-col gap-3 mt-4">
                  {[
                    { title: "CS201 Algorithms", score: "92%", date: "Today" },
                    { title: "MA102 Discrete Maths", score: "78%", date: "Yesterday" },
                    { title: "PH101 Physics Lab", score: "85%", date: "3 days ago" },
                  ].map((hist, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl bg-muted border border-border hover:bg-muted/80 transition-all">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-xs text-foreground">{hist.title}</span>
                        <span className="text-[10px] text-muted-foreground font-semibold">{hist.date}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "text-base font-black",
                          parseInt(hist.score) > 85 ? "text-emerald-500" : "text-primary"
                        )}>{hist.score}</span>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground">
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ─── TAB 7: GPA ANALYTICS ─── */}
          {activeTab === "analytics" && (
            <div className="flex flex-col gap-6">
              <header className="flex flex-col gap-1 p-4 bg-card border border-border rounded-2xl">
                <h1 className="text-2xl font-black tracking-tight text-foreground">GPA Analytics</h1>
                <p className="text-xs text-muted-foreground">Track your academic journey and performance trends.</p>
              </header>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { title: "Overall GPA", value: "3.82", sub: "Top 5% of Batch", icon: <Trophy className="w-4 h-4 text-yellow-500" /> },
                  { title: "Current Rank", value: "#12", sub: "out of 240 Students", icon: <Target className="w-4 h-4 text-primary" /> },
                  { title: "Total Credits", value: "124", sub: "84% Complete", icon: <TrendingUp className="w-4 h-4 text-emerald-500" /> },
                  { title: "Dean's List", value: "3 Times", sub: "Consecutive Streak", icon: <Award className="w-4 h-4 text-indigo-500" /> },
                ].map((stat, idx) => (
                  <Card key={idx} className="bg-card border border-border rounded-2xl hover:bg-muted/30 transition-all">
                    <div className="p-5 flex flex-col gap-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{stat.title}</span>
                        <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center border border-border">
                          {stat.icon}
                        </div>
                      </div>
                      <span className="text-2xl font-black text-foreground">{stat.value}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold">{stat.sub}</span>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <Card className="lg:col-span-8 bg-card border border-border rounded-2xl p-6">
                  <div className="mb-4">
                    <h3 className="text-base font-black text-foreground">GPA Progression</h3>
                    <p className="text-xs text-muted-foreground">Visualizing your semester-wise growth</p>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={[
                        { semester: 'Sem 1', gpa: 3.42 },
                        { semester: 'Sem 2', gpa: 3.56 },
                        { semester: 'Sem 3', gpa: 3.82 },
                        { semester: 'Sem 4', gpa: 3.75 },
                        { semester: 'Sem 5', gpa: 3.91 },
                        { semester: 'Sem 6', gpa: 3.88 },
                      ]}>
                        <defs>
                          <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="semester" stroke="currentColor" className="text-muted-foreground opacity-60 text-[10px]" tickLine={false} axisLine={false} />
                        <YAxis domain={[0, 4.0]} stroke="currentColor" className="text-muted-foreground opacity-60 text-[10px]" tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                          labelStyle={{ color: 'var(--foreground)', fontWeight: 'bold', fontSize: '11px' }}
                          itemStyle={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '11px' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="gpa" 
                          stroke="var(--primary)" 
                          strokeWidth={3} 
                          fillOpacity={1} 
                          fill="url(#colorGpa)" 
                          animationDuration={1500}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="lg:col-span-4 bg-card border border-border rounded-2xl p-6">
                  <div className="mb-4">
                    <h3 className="text-base font-black text-foreground">Subject Mastery</h3>
                    <p className="text-xs text-muted-foreground">Average performance by field</p>
                  </div>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { subject: 'Maths', score: 92 },
                        { subject: 'Physics', score: 85 },
                        { subject: 'CS', score: 96 },
                        { subject: 'English', score: 78 },
                        { subject: 'Design', score: 88 },
                      ]} layout="vertical">
                        <XAxis type="number" hide />
                        <YAxis dataKey="subject" type="category" stroke="currentColor" className="text-muted-foreground opacity-60 text-[10px]" width={60} tickLine={false} axisLine={false} />
                        <Tooltip 
                          cursor={{ fill: 'rgba(255,255,255,0.02)' }} 
                          contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                          itemStyle={{ color: 'var(--primary)', fontSize: '11px' }}
                        />
                        <Bar 
                          dataKey="score" 
                          fill="var(--primary)" 
                          radius={[0, 6, 6, 0]} 
                          barSize={16}
                          animationDuration={1500}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* ══ In-App PDF Viewer Modal (Interactive A4 Document Reader & Annotator) ══ */}
      <AnimatePresence>
        {viewingPdf && (() => {
          const pages = mockPdfPagesData[viewingPdf] || getFallbackPdfPages(viewingPdf);
          
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-background flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-4 md:px-5 py-3 border-b border-border bg-card shrink-0">
                <div className="flex items-center gap-2 md:gap-3">
                  <Button 
                    onClick={() => setViewingPdf(null)} 
                    variant="ghost" 
                    size="icon" 
                    className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                  
                  <div className="hidden sm:flex w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-xs md:text-sm font-bold text-foreground block max-w-[120px] sm:max-w-none truncate">{viewingPdf}</span>
                    <p className="text-[8px] md:text-[9px] text-muted-foreground">Nexora Interactive PDF Workstation</p>
                  </div>
                </div>

                {/* Centered Mode Toggle */}
                <div className="flex items-center bg-muted p-0.5 rounded-lg border border-border shrink-0">
                  <button
                    onClick={() => setPdfViewMode('pdf')}
                    className={cn(
                      "px-2 md:px-3 py-1.5 text-[9px] md:text-[10px] font-bold rounded-md transition-all flex items-center gap-1 md:gap-1.5",
                      pdfViewMode === 'pdf'
                        ? "bg-card text-foreground shadow-sm animate-in fade-in-50 duration-200"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <FileText className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    Full PDF
                  </button>
                  <button
                    onClick={() => setPdfViewMode('notes')}
                    className={cn(
                      "px-2 md:px-3 py-1.5 text-[9px] md:text-[10px] font-bold rounded-md transition-all flex items-center gap-1 md:gap-1.5",
                      pdfViewMode === 'notes'
                        ? "bg-card text-foreground shadow-sm animate-in fade-in-50 duration-200"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <svg className="w-3 h-3 md:w-3.5 md:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                    Short Notes
                  </button>
                </div>

                <div className="flex items-center gap-1.5 md:gap-2.5 shrink-0">
                  <a 
                    href={`/${viewingPdf}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[9px] font-black text-primary border border-primary/20 bg-primary/5 rounded-lg px-2.5 py-1.5 uppercase hover:bg-primary/10 transition-colors shrink-0 flex items-center gap-1"
                  >
                    Open Full Screen
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="hidden lg:inline-flex text-[9px] font-black text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1.5 uppercase tracking-wide">
                    🔒 Protected PDF View
                  </span>
                  <Button onClick={() => setViewingPdf(null)} variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted">
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* Modal Body */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-muted/20">
                
                {/* Left Area: Document Viewer & Toolbar (2/3 width) */}
                <div className={cn(
                  "flex-1 flex flex-col overflow-hidden",
                  mobileTab !== 'viewer' && "hidden md:flex"
                )}>
                  {pdfViewMode === 'notes' ? (
                    <>
                      {/* Floating Editor Toolbar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-border bg-card">
                    {/* Tool Buttons */}
                    <div className="flex items-center gap-1.5">
                      <Button
                        onClick={() => setPdfTool("pan")}
                        variant={pdfTool === "pan" ? "default" : "outline"}
                        className="h-8 px-3 rounded-lg text-xs font-bold gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4M12 8v8"/></svg>
                        Pan Cursor
                      </Button>
                      <Button
                        onClick={() => setPdfTool("highlight")}
                        variant={pdfTool === "highlight" ? "default" : "outline"}
                        className="h-8 px-3 rounded-lg text-xs font-bold gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12 14 4-4L9 3 5 7l7 7Z"/><path d="m17 21-3.5-3.5"/><path d="M9 22H3v-6"/></svg>
                        Highlighter
                      </Button>
                      <Button
                        onClick={() => setPdfTool("text")}
                        variant={pdfTool === "text" ? "default" : "outline"}
                        className="h-8 px-3 rounded-lg text-xs font-bold gap-1.5"
                      >
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                        Add Text
                      </Button>
                    </div>

                    {/* Colors & Zoom & Clear */}
                    <div className="flex items-center gap-4">
                      {/* Color selectors for Highlighter */}
                      {pdfTool === "highlight" && (
                        <div className="flex items-center gap-1.5 bg-muted px-2 py-1 rounded-lg border border-border">
                          {([
                            { label: "Yellow", val: "rgba(253, 224, 71, 0.45)", cls: "bg-yellow-300 border-yellow-400" },
                            { label: "Green", val: "rgba(134, 239, 172, 0.45)", cls: "bg-green-300 border-green-400" },
                            { label: "Blue", val: "rgba(147, 197, 253, 0.45)", cls: "bg-blue-300 border-blue-400" }
                          ]).map(col => (
                            <button
                              key={col.label}
                              onClick={() => setHighlightColor(col.val)}
                              className={cn(
                                "w-4 h-4 rounded-full border-2 transition-transform",
                                col.cls,
                                highlightColor === col.val ? "scale-110 ring-2 ring-primary/40" : "opacity-60 hover:opacity-100"
                              )}
                              title={col.label}
                            />
                          ))}
                        </div>
                      )}

                      {/* Zoom Controls */}
                      <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg border border-border">
                        <Button variant="ghost" size="icon" className="w-7 h-7 rounded-md text-foreground hover:bg-card" onClick={() => setZoom(z => Math.max(80, z - 20))}>-</Button>
                        <span className="text-[10px] font-mono font-bold px-1.5 text-foreground">{zoom}%</span>
                        <Button variant="ghost" size="icon" className="w-7 h-7 rounded-md text-foreground hover:bg-card" onClick={() => setZoom(z => Math.min(120, z + 20))}>+</Button>
                      </div>

                      {/* Reset Annotations */}
                      <Button
                        variant="ghost"
                        onClick={() => { setHighlights({}); setAnnotations([]); }}
                        className="h-8 px-2.5 rounded-lg text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 font-bold uppercase"
                      >
                        Clear Edits
                      </Button>
                    </div>
                  </div>

                  {/* Scrollable document viewer */}
                  <div className="flex-1 overflow-y-auto p-8 relative flex flex-col items-center">
                    
                    {/* Zoomable A4 Document Page list */}
                    <div 
                      style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                      className="transition-transform duration-200 flex flex-col gap-8 w-full max-w-[800px]"
                    >
                      {pages.map((page, pageIdx) => (
                        <div
                          key={pageIdx}
                          onClick={(e) => {
                            if (pdfTool !== "text") return;
                            // Spawn annotation input on click
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = ((e.clientX - rect.left) / rect.width) * 100;
                            const y = ((e.clientY - rect.top) / rect.height) * 100;
                            const newAnnot = {
                              id: `annot-${Date.now()}`,
                              pageNum: pageIdx,
                              x,
                              y,
                              text: "",
                              isEditing: true
                            };
                            setAnnotations(prev => [...prev, newAnnot]);
                          }}
                          className={cn(
                            "bg-white text-zinc-900 border border-zinc-300 shadow-xl p-12 relative select-none rounded-none aspect-[1/1.41] flex flex-col justify-between overflow-hidden shrink-0",
                            pdfTool === "highlight" ? "cursor-cell" : pdfTool === "text" ? "cursor-text" : "cursor-default"
                          )}
                        >
                          {/* Watermark/Header line */}
                          <div className="flex justify-between items-center text-[10px] text-zinc-400 font-mono border-b border-zinc-200 pb-3 uppercase tracking-wider shrink-0">
                            <span>NEXORA SECURE DOCUMENT VIEWER</span>
                            <span>PAGE {pageIdx + 1} OF {pages.length}</span>
                          </div>

                          {/* Page content rendering */}
                          <div className="flex-1 my-6 flex flex-col gap-6 text-zinc-800 overflow-hidden">
                            {/* Page header */}
                            <div className="flex flex-col gap-1 shrink-0">
                              <h2 className="text-xl font-black text-zinc-950 leading-tight">{page.title}</h2>
                              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{page.subtitle}</p>
                            </div>

                            {/* Elements list */}
                            <div className="flex flex-col gap-4 overflow-y-auto pr-1">
                              {page.elements.map((el) => {
                                const isHighlighted = !!highlights[el.id];
                                const hlColor = highlights[el.id] || "transparent";

                                return (
                                  <div
                                    key={el.id}
                                    onClick={(e) => {
                                      if (pdfTool !== "highlight") return;
                                      e.stopPropagation(); // prevent spawning a text annot box
                                      setHighlights(prev => {
                                        const next = { ...prev };
                                        if (next[el.id]) delete next[el.id];
                                        else next[el.id] = highlightColor;
                                        return next;
                                      });
                                    }}
                                    style={{ backgroundColor: hlColor }}
                                    className={cn(
                                      "transition-colors rounded px-1 -mx-1",
                                      pdfTool === "highlight" && "hover:bg-yellow-100 cursor-cell"
                                    )}
                                  >
                                    {el.type === "heading" && (
                                      <h3 className="text-sm font-black text-zinc-900 mt-2 mb-1 border-l-2 border-zinc-400 pl-2">
                                        {el.content}
                                      </h3>
                                    )}

                                    {el.type === "paragraph" && (
                                      <p className="text-xs text-zinc-700 leading-relaxed text-justify">
                                        {el.content}
                                      </p>
                                    )}

                                    {el.type === "bullet" && (
                                      <ul className="list-none flex flex-col gap-1.5 text-xs text-zinc-700 leading-relaxed pl-1">
                                        {el.content.split('\n').map((item, itemIdx) => (
                                          <li key={itemIdx} className="flex gap-2">
                                            <span>•</span>
                                            <span>{item.replace(/^•\s*/, '')}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    )}

                                    {el.type === "code" && (
                                      <pre className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg font-mono text-[10px] overflow-x-auto text-zinc-900 leading-normal">
                                        <code>{el.content}</code>
                                      </pre>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Footer line */}
                          <div className="flex justify-between items-center text-[9px] text-zinc-400 font-mono border-t border-zinc-150 pt-3 shrink-0">
                            <span>{viewingPdf}</span>
                            <span>CLASSIFIED: NEXORA STUDENT PORTAL</span>
                          </div>

                          {/* Absolute floating annotations layer */}
                          {annotations
                            .filter(annot => annot.pageNum === pageIdx)
                            .map(annot => (
                              <div
                                key={annot.id}
                                style={{ left: `${annot.x}%`, top: `${annot.y}%` }}
                                onClick={(e) => e.stopPropagation()} // prevent double triggers
                                className="absolute z-[120] -translate-x-1/2 -translate-y-1/2 select-text"
                              >
                                {annot.isEditing ? (
                                  <div className="bg-yellow-100 border border-yellow-300 shadow-xl rounded-lg p-2 flex items-center gap-1.5 w-48">
                                    <input
                                      autoFocus
                                      type="text"
                                      value={annot.text}
                                      onChange={(e) => {
                                        const txt = e.target.value;
                                        setAnnotations(prev => prev.map(a => a.id === annot.id ? { ...a, text: txt } : a));
                                      }}
                                      onBlur={() => {
                                        if (!annot.text.trim()) {
                                          setAnnotations(prev => prev.filter(a => a.id !== annot.id));
                                        } else {
                                          setAnnotations(prev => prev.map(a => a.id === annot.id ? { ...a, isEditing: false } : a));
                                        }
                                      }}
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                          if (!annot.text.trim()) {
                                            setAnnotations(prev => prev.filter(a => a.id !== annot.id));
                                          } else {
                                            setAnnotations(prev => prev.map(a => a.id === annot.id ? { ...a, isEditing: false } : a));
                                          }
                                        }
                                      }}
                                      className="bg-transparent text-[11px] outline-none text-zinc-800 w-full font-sans"
                                      placeholder="Add note..."
                                    />
                                  </div>
                                ) : (
                                  <div className="bg-yellow-200/95 border border-yellow-300 text-zinc-900 shadow-md rounded-lg py-1.5 px-2.5 flex items-center gap-2 group/annot text-[10px] font-semibold whitespace-nowrap animate-in fade-in-50 zoom-in-95">
                                    <span>📝 {annot.text}</span>
                                    <button
                                      onClick={() => {
                                        setAnnotations(prev => prev.filter(a => a.id !== annot.id));
                                      }}
                                      className="opacity-0 group-hover/annot:opacity-100 w-3.5 h-3.5 rounded bg-yellow-400 hover:bg-yellow-500 flex items-center justify-center text-zinc-800 text-[8px] font-black leading-none transition-opacity"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                        </div>
                      ))}
                    </div>

                  </div>
                    </>
                  ) : (
                    <div className="flex-1 w-full h-full bg-card relative">
                      <iframe
                        src={viewingPdf.endsWith(".pdf") && !isMobileDevice ? `/${viewingPdf}` : `https://docs.google.com/viewer?url=${encodeURIComponent(`https://nexoraedu.vercel.app/${viewingPdf}`)}&embedded=true`}
                        className="w-full h-full border-none"
                        title="Full Document Viewer"
                      />
                    </div>
                  )}
                </div>

                {/* Right Area: Sidebar (1/3 width) */}
                <div className={cn(
                  "w-full md:w-80 lg:w-96 border-t md:border-t-0 md:border-l border-border bg-card flex flex-col shrink-0",
                  mobileTab !== 'chat' && "hidden md:flex"
                )}>
                  <div className="p-4 border-b border-border">
                    <span className="text-[10px] font-black uppercase text-muted-foreground tracking-wider">
                      Study Companion
                    </span>
                    <h4 className="font-black text-sm text-foreground mt-1 truncate">{viewingPdf}</h4>
                  </div>
                  
                  {/* Summary & Q&A panel */}
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                    <div className="bg-muted/50 border border-border rounded-xl p-3.5 flex flex-col gap-1.5">
                      <span className="text-[9px] font-black uppercase text-primary tracking-widest">Document Summary</span>
                      <p className="text-xs text-foreground/80 leading-relaxed italic">
                        "{mockPdfStudyData[viewingPdf]?.summary || defaultPdfStudyData.summary}"
                      </p>
                    </div>

                    <div className="flex-1 flex flex-col border border-border rounded-xl overflow-hidden bg-muted/20">
                      <div className="px-3.5 py-2.5 bg-muted border-b border-border flex items-center justify-between shrink-0">
                        <span className="text-[9px] font-black uppercase text-muted-foreground">Quick AI Chat</span>
                        <Badge variant="outline" className="text-[8px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20 font-bold uppercase">
                          Syllabus AI
                        </Badge>
                      </div>
                      
                      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 min-h-[160px] max-h-[250px] md:max-h-none">
                        {(pdfMessages.length ? pdfMessages : [
                          { sender: 'ai', text: `You are studying "${viewingPdf}". Ask me any syllabus questions or review notes directly here!`, time: "Now" }
                        ]).map((msg, idx) => (
                          <div key={idx} className={cn("flex flex-col gap-1 max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed",
                            msg.sender === 'user'
                              ? "bg-primary text-white ml-auto rounded-tr-sm"
                              : "bg-card border border-border text-foreground mr-auto rounded-tl-sm"
                          )}>
                            <span>{msg.text}</span>
                          </div>
                        ))}
                      </div>

                      <form onSubmit={handleSendPdfMessage} className="p-2 border-t border-border bg-card flex gap-1.5">
                        <Input
                          value={pdfInput}
                          onChange={e => setPdfInput(e.target.value)}
                          placeholder="Ask a question..."
                          className="bg-transparent border-none focus-visible:ring-0 text-xs h-8 flex-1 px-2 text-foreground"
                        />
                        <Button type="submit" size="icon" className="w-8 h-8 rounded-lg bg-primary hover:bg-primary/95 text-white shrink-0">
                          <Send className="w-3 h-3" />
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>

              </div>

              {/* Mobile Tab Bar */}
              <div className="md:hidden flex border-t border-border bg-card shrink-0 h-12">
                <button
                  onClick={() => setMobileTab('viewer')}
                  className={cn(
                    "flex-1 py-3 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5",
                    mobileTab === 'viewer' ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground"
                  )}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Document Viewer
                </button>
                <button
                  onClick={() => setMobileTab('chat')}
                  className={cn(
                    "flex-1 py-3 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5",
                    mobileTab === 'chat' ? "border-primary text-primary bg-primary/5" : "border-transparent text-muted-foreground"
                  )}
                >
                  <Bot className="w-3.5 h-3.5" />
                  AI Companion
                </button>
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

    </motion.div>
  );
}
