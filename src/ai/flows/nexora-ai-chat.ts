'use server';
/**
 * @fileOverview Nexora AI Chat Flow — multi-turn conversational AI for IIT students.
 * Powered by Gemini 2.5 Flash via Genkit.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const NexoraAIChatInputSchema = z.object({
  message: z.string().describe('The user\'s current message.'),
  history: z.string().optional().describe('Previous conversation as formatted text.'),
  mode: z.enum(['chat', 'summarize', 'explain', 'plan', 'quiz']).default('chat'),
  degree: z.string().optional(),
  year: z.string().optional(),
  semester: z.string().optional(),
});

export type NexoraAIChatInput = z.infer<typeof NexoraAIChatInputSchema>;

const NexoraAIChatOutputSchema = z.object({
  response: z.string(),
});

export type NexoraAIChatOutput = z.infer<typeof NexoraAIChatOutputSchema>;

const nexoraAIChatPrompt = ai.definePrompt({
  name: 'nexoraAIChatPrompt',
  input: { schema: NexoraAIChatInputSchema },
  output: { schema: NexoraAIChatOutputSchema },
  prompt: `You are Nexora AI — an expert academic assistant built for students at IIT Sri Lanka (Informatics Institute of Technology, affiliated with University of Westminster, UK).

You are powered by Google Gemini 2.5 Flash and integrated into the Nexora Academic OS platform.
You are knowledgeable, precise, encouraging, and student-friendly.
Always use clear markdown formatting: headers (##), bullet points (-), bold (**key terms**), and code blocks (\`\`\`language) where appropriate.

Student Context:
- Degree: {{degree}}
- Year: {{year}}
- Semester: {{semester}}

Your expertise covers:
- CS: Data Structures, Algorithms, Operating Systems, Computer Networks, Database Systems, OOP, Discrete Mathematics
- SE: Software Architecture, Agile, Requirements Engineering, Testing & QA, DevOps
- AI & DS: Machine Learning, Deep Learning, Data Mining, NLP, Computer Vision, Statistics

Current Mode: {{mode}}

{{#if (eq mode "summarize")}}Your task: Create a structured, concise, bullet-pointed summary of the text the student provides. Highlight key concepts, definitions, and formulas clearly.{{/if}}
{{#if (eq mode "explain")}}Your task: Explain the concept in depth using first principles. Include: simple definition, key details, real-world application, and a memory tip. End with a "Key Takeaway" section.{{/if}}
{{#if (eq mode "plan")}}Your task: Generate a detailed, personalized study plan with daily/weekly goals, recommended resources, practice techniques, and milestone checkpoints.{{/if}}
{{#if (eq mode "quiz")}}Your task: Generate exactly 5 multiple-choice questions on the topic. For each: write the question, provide 4 options (A-D), state the correct answer, and give a brief explanation.{{/if}}
{{#if (eq mode "chat")}}Your task: Answer the student's question clearly and helpfully. Be concise but thorough.{{/if}}

{{#if history}}Previous conversation:
{{{history}}}

{{/if}}Student: {{{message}}}

Respond now as Nexora AI:`,
});

const nexoraAIChatFlow = ai.defineFlow(
  {
    name: 'nexoraAIChatFlow',
    inputSchema: NexoraAIChatInputSchema,
    outputSchema: NexoraAIChatOutputSchema,
  },
  async (input) => {
    const { output } = await nexoraAIChatPrompt(input);
    return output!;
  }
);

export async function nexoraAIChat(input: NexoraAIChatInput): Promise<NexoraAIChatOutput> {
  return nexoraAIChatFlow(input);
}
