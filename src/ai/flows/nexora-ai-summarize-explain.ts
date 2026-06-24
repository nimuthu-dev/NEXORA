'use server';
/**
 * @fileOverview This file implements the Nexora AI Summarize/Explain flow.
 * It allows students to summarize lecture notes or explain complex concepts from their IIT syllabus.
 *
 * - nexoraAISummarizeExplain - A function to interact with the AI for summarization or explanation.
 * - NexoraAISummarizeExplainInput - The input type for the nexoraAISummarizeExplain function.
 * - NexoraAISummarizeExplainOutput - The return type for the nexoraAISummarizeExplain function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NexoraAISummarizeExplainInputSchema = z.object({
  text: z
    .string()
    .describe(
      'The lecture notes to summarize or the concept from the IIT syllabus to explain.'
    ),
  requestType: z.enum(['summarize', 'explain']).describe('Whether to summarize the text or explain the concept.'),
});
export type NexoraAISummarizeExplainInput = z.infer<
  typeof NexoraAISummarizeExplainInputSchema
>;

const NexoraAISummarizeExplainOutputSchema = z.object({
  response: z
    .string()
    .describe('The AI-generated summary or explanation of the provided text.'),
});
export type NexoraAISummarizeExplainOutput = z.infer<
  typeof NexoraAISummarizeExplainOutputSchema
>;

// Internal schema for the prompt to handle logic-less Handlebars templates
const SummarizeExplainPromptInputSchema = z.object({
  text: z.string(),
  isSummarize: z.boolean(),
  isExplain: z.boolean(),
});

const nexoraAISummarizeExplainPrompt = ai.definePrompt({
  name: 'nexoraAISummarizeExplainPrompt',
  input: {schema: SummarizeExplainPromptInputSchema},
  output: {schema: NexoraAISummarizeExplainOutputSchema},
  prompt: `You are the Nexora AI Assistant, designed to help IIT students quickly grasp key information and deepen their understanding.

Based on the request type, perform the specified action:

{{#if isSummarize}}Please provide a concise and clear summary of the following lecture notes:

{{/if}}{{#if isExplain}}Please explain the following concept from the IIT syllabus in a clear, concise, and easy-to-understand manner, assuming the student is an IIT student and can handle technical details:

{{/if}}{{{text}}}`, 
});

const nexoraAISummarizeExplainFlow = ai.defineFlow(
  {
    name: 'nexoraAISummarizeExplainFlow',
    inputSchema: NexoraAISummarizeExplainInputSchema,
    outputSchema: NexoraAISummarizeExplainOutputSchema,
  },
  async (input) => {
    // Map the enum input to simple booleans for the prompt template
    const {output} = await nexoraAISummarizeExplainPrompt({
      text: input.text,
      isSummarize: input.requestType === 'summarize',
      isExplain: input.requestType === 'explain',
    });
    return output!;
  }
);

export async function nexoraAISummarizeExplain(
  input: NexoraAISummarizeExplainInput
): Promise<NexoraAISummarizeExplainOutput> {
  return nexoraAISummarizeExplainFlow(input);
}
