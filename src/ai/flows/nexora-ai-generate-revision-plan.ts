'use server';
/**
 * @fileOverview A Genkit flow for the Nexora AI Assistant to generate personalized revision notes or a study plan for a module.
 *
 * - generateRevisionPlan - A function that handles the generation of revision notes or a study plan.
 * - NexoraAIGenerateRevisionPlanInput - The input type for the generateRevisionPlan function.
 * - NexoraAIGenerateRevisionPlanOutput - The return type for the generateRevisionPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NexoraAIGenerateRevisionPlanInputSchema = z.object({
  moduleName: z.string().describe('The name of the module (e.g., "Data Structures and Algorithms").'),
  moduleCode: z.string().describe('The code of the module (e.g., "CS201").'),
  keyTopics: z.string().describe('A comma-separated list of key topics covered in the module or a general description of the module content.'),
  studyGoal: z.enum(['revision_notes', 'study_plan']).describe('The student\'s study goal: "revision_notes" for revision notes or "study_plan" for a study plan.'),
  additionalInfo: z.string().optional().describe('Any additional information or specific requests from the student (e.g., "focus on algorithms", "prepare for a midterm").'),
});
export type NexoraAIGenerateRevisionPlanInput = z.infer<typeof NexoraAIGenerateRevisionPlanInputSchema>;

const NexoraAIGenerateRevisionPlanOutputSchema = z.object({
  generatedContent: z.string().describe('The generated revision notes or study plan.'),
});
export type NexoraAIGenerateRevisionPlanOutput = z.infer<typeof NexoraAIGenerateRevisionPlanOutputSchema>;

export async function generateRevisionPlan(input: NexoraAIGenerateRevisionPlanInput): Promise<NexoraAIGenerateRevisionPlanOutput> {
  return nexoraAIGenerateRevisionPlanFlow(input);
}

const nexoraAIGenerateRevisionPlanPrompt = ai.definePrompt({
  name: 'nexoraAIGenerateRevisionPlanPrompt',
  input: {schema: NexoraAIGenerateRevisionPlanInputSchema},
  output: {schema: NexoraAIGenerateRevisionPlanOutputSchema},
  prompt: `You are an expert academic assistant and tutor for IIT students. Your goal is to help students efficiently prepare for their modules.

The student needs assistance with the module: "{{{moduleName}}}" (Code: {{{moduleCode}}}).
Key topics covered: {{{keyTopics}}}

The student's specific goal is to receive {{{studyGoal}}}.

Based on the goal:

If the goal is 'revision_notes', generate comprehensive, concise, and easy-to-understand revision notes for the module "{{{moduleName}}}". Focus on the most important concepts and formulas. Structure them clearly with headings and bullet points.

If the goal is 'study_plan', create a detailed and personalized study plan for the module "{{{moduleName}}}". The plan should be structured for effective preparation, including daily or weekly breakdown, suggested activities (e.g., "review lecture notes", "practice problems", "solve past papers"), and estimated time allocation. Assume a preparation period of 1-2 weeks unless specified in additional information.

{{#if additionalInfo}}
Consider the following additional information or specific requests from the student:
{{{additionalInfo}}}
{{/if}}

Ensure the output is directly usable by an IIT student for their studies.`,
});

const nexoraAIGenerateRevisionPlanFlow = ai.defineFlow(
  {
    name: 'nexoraAIGenerateRevisionPlanFlow',
    inputSchema: NexoraAIGenerateRevisionPlanInputSchema,
    outputSchema: NexoraAIGenerateRevisionPlanOutputSchema,
  },
  async input => {
    const {output} = await nexoraAIGenerateRevisionPlanPrompt(input);
    return output!;
  }
);
