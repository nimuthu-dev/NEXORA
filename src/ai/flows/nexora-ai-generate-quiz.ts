'use server';
/**
 * @fileOverview A Genkit flow for generating interactive quiz questions based on a module or topic.
 *
 * - generateQuizQuestions - A function that handles the quiz question generation process.
 * - GenerateQuizQuestionsInput - The input type for the generateQuizQuestions function.
 * - GenerateQuizQuestionsOutput - The return type for the generateQuizQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const QuizQuestionSchema = z.object({
  question: z.string().describe('The quiz question text.'),
  type: z.enum(['multiple_choice', 'short_answer']).describe('The type of quiz question.'),
  options: z.array(z.string()).optional().describe('An array of possible answers for multiple_choice questions. Only include if type is multiple_choice.'),
  correctAnswer: z.string().describe('The correct answer to the question.'),
});

const GenerateQuizQuestionsInputSchema = z.object({
  moduleName: z.string().describe('The name of the module for which to generate quiz questions.'),
  topic: z.string().describe('The specific topic within the module.'),
  difficulty: z.enum(['easy', 'medium', 'hard']).describe('The difficulty level of the quiz questions.'),
  numberOfQuestions: z.number().int().min(1).max(10).describe('The number of quiz questions to generate (between 1 and 10).'),
});
export type GenerateQuizQuestionsInput = z.infer<typeof GenerateQuizQuestionsInputSchema>;

const GenerateQuizQuestionsOutputSchema = z.object({
  quizQuestions: z.array(QuizQuestionSchema).describe('An array of generated quiz questions.'),
});
export type GenerateQuizQuestionsOutput = z.infer<typeof GenerateQuizQuestionsOutputSchema>;

export async function generateQuizQuestions(input: GenerateQuizQuestionsInput): Promise<GenerateQuizQuestionsOutput> {
  return generateQuizQuestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizQuestionsPrompt',
  input: {schema: GenerateQuizQuestionsInputSchema},
  output: {schema: GenerateQuizQuestionsOutputSchema},
  prompt: `You are an AI assistant specialized in creating interactive quiz questions for IIT students.\nGenerate {{numberOfQuestions}} {{difficulty}} quiz questions on the topic of "{{topic}}" from the "{{moduleName}}" module.\nEnsure a mix of multiple_choice and short_answer questions.\nFor multiple_choice questions, provide 4 options.\nThe correct answer must be clearly indicated.\n\nGenerate the questions in JSON format following the provided schema.`,
});

const generateQuizQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuizQuestionsFlow',
    inputSchema: GenerateQuizQuestionsInputSchema,
    outputSchema: GenerateQuizQuestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
