import { z } from 'zod';

// Pokemon selection validation
export const pokemonSelectionSchema = z.object({
  pokemonInput: z.string().min(1, 'Please enter at least one Pokemon name'),
  useAllAvailable: z.boolean().default(false),
});

// Battle format validation
export const battleFormatSchema = z.object({
  battleFormat: z.string().min(1, 'Please select a battle format'),
});

// Playstyle selection validation
export const playstyleSchema = z.object({
  playstyles: z.array(z.string()).length(1, 'Please select exactly one playstyle'),
});

// Team generation request validation
export const teamRequestSchema = z.object({
  pokemonNames: z.array(z.string()).min(1, 'At least one Pokemon is required'),
  battleFormat: z.string().min(1, 'Battle format is required'),
  playstyles: z.array(z.string()).length(1, 'Exactly one playstyle is required'),
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
