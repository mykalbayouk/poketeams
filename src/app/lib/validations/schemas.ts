import { z } from 'zod';

// Pokemon selection validation
export const pokemonSelectionSchema = z.object({
  pokemonInput: z.string(),
  useAllAvailable: z.boolean().default(false),
}).refine(
  (data) => {
    // If useAllAvailable is true, pokemonInput can be empty
    // If useAllAvailable is false, pokemonInput must have content
    return data.useAllAvailable || data.pokemonInput.trim().length > 0;
  },
  {
    message: 'Please enter at least one Pokemon name or select "Use all available Pokemon"',
    path: ['pokemonInput'],
  }
);

// Battle format validation
export const battleFormatSchema = z.object({
  battleFormat: z.string().min(1, 'Please select a battle format'),
});

// Playstyle selection validation
export const playstyleSchema = z.object({
  playstyles: z.array(z.string()).min(1, 'Please select at least one playstyle').max(3, 'Please select at most 3 playstyles'),
});

// Team generation request validation
export const teamRequestSchema = z.object({
  pokemonNames: z.array(z.string()).min(1, 'At least one Pokemon is required'),
  battleFormat: z.string().min(1, 'Battle format is required'),
  playstyles: z.array(z.string()).min(1, 'At least one playstyle is required').max(3, 'At most 3 playstyles are allowed'),
});

// Complete form validation
export const completeFormSchema = z.object({
  pokemon: pokemonSelectionSchema,
  format: battleFormatSchema,
  playstyles: playstyleSchema,
});

export type PokemonSelectionFormData = z.infer<typeof pokemonSelectionSchema>;
export type BattleFormatFormData = z.infer<typeof battleFormatSchema>;
export type PlaystyleFormData = z.infer<typeof playstyleSchema>;
export type TeamRequestData = z.infer<typeof teamRequestSchema>;
export type CompleteFormData = z.infer<typeof completeFormSchema>;
