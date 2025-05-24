
'use server';

/**
 * @fileOverview Gera texto educativo e científico sobre três conceitos psicológicos,
 * explicando-os e mostrando suas inter-relações de forma acessível para leigos.
 *
 * - generateMotivationalText - A function that generates the educational text.
 * - GenerateMotivationalTextInput - The input type for the generateMotivationalText function.
 * - GenerateMotivationalTextOutput - The return type for the generateMotivationalText function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateMotivationalTextInputSchema = z.object({
  concept1: z.string().describe('The first psychological concept.'),
  concept1Description: z.string().describe('The complex description of the first psychological concept.'),
  concept2: z.string().describe('The second psychological concept.'),
  concept2Description: z.string().describe('The complex description of the second psychological concept.'),
  concept3: z.string().describe('The third psychological concept.'),
  concept3Description: z.string().describe('The complex description of the third psychological concept.'),
});
export type GenerateMotivationalTextInput = z.infer<typeof GenerateMotivationalTextInputSchema>;

const GenerateMotivationalTextOutputSchema = z.object({
  motivationalText: z.string().describe('The generated educational text integrating the three concepts in Brazilian Portuguese, written for laypeople.'),
});
export type GenerateMotivationalTextOutput = z.infer<typeof GenerateMotivationalTextOutputSchema>;

export async function generateMotivationalText(
  input: GenerateMotivationalTextInput
): Promise<GenerateMotivationalTextOutput> {
  return generateMotivationalTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateScientificExplanationPrompt', // Renamed for clarity, though old name was fine for internal use
  input: {
    schema: z.object({
      concept1: z.string().describe('The first psychological concept.'),
      concept1Description: z.string().describe('The complex description of the first psychological concept.'),
      concept2: z.string().describe('The second psychological concept.'),
      concept2Description: z.string().describe('The complex description of the second psychological concept.'),
      concept3: z.string().describe('The third psychological concept.'),
      concept3Description: z.string().describe('The complex description of the third psychological concept.'),
    }),
  },
  output: {
    schema: z.object({
      motivationalText: z // Keeping this name for compatibility with frontend
        .string()
        .describe('The generated educational text integrating the three concepts in Brazilian Portuguese, written for laypeople.'),
    }),
  },
  prompt: `Você é um psicólogo e educador experiente, com habilidade excepcional para explicar conceitos psicológicos complexos de forma clara, concisa e envolvente para o público leigo. Sua linguagem deve ser informativa, mas acessível, evitando jargões desnecessários e mantendo a precisão científica.

Você receberá três conceitos psicológicos, juntamente com suas descrições detalhadas. Sua tarefa é:
1.  Explicar brevemente cada conceito em linguagem simples, garantindo que um leigo possa compreendê-los.
2.  Descrever como esses três conceitos se inter-relacionam, se complementam ou contrastam, destacando as conexões e interdependências entre eles.
3.  Fornecer exemplos práticos, estudos de caso simplificados ou ilustrar como esses conceitos podem ser observados ou aplicados na vida cotidiana das pessoas.
4.  O texto deve ser primariamente informativo e educativo. O objetivo é que o leitor aprenda sobre os conceitos e suas relações de uma maneira interessante e cientificamente embasada. Evite um tom excessivamente motivacional, de autoajuda superficial ou imperativo.
5.  Use parágrafos curtos e uma estrutura clara para facilitar a leitura e a compreensão.

O texto gerado DEVE estar em Português do Brasil.

Aqui estão os conceitos:

Conceito 1: {{concept1}}
Descrição Detalhada: {{concept1Description}}

Conceito 2: {{concept2}}
Descrição Detalhada: {{concept2Description}}

Conceito 3: {{concept3}}
Descrição Detalhada: {{concept3Description}}

Com base nesses três conceitos e suas descrições, componha um texto educativo e integrado. O texto deve ter pelo menos 250 palavras para garantir uma explicação adequada e profundidade, e ser escrito inteiramente em Português do Brasil. Foque em clareza, precisão científica (adaptada para leigos) e exemplos práticos.
`,
});

const generateMotivationalTextFlow = ai.defineFlow<
  typeof GenerateMotivationalTextInputSchema,
  typeof GenerateMotivationalTextOutputSchema
>(
  {
    name: 'generateMotivationalTextFlow',
    inputSchema: GenerateMotivationalTextInputSchema,
    outputSchema: GenerateMotivationalTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
