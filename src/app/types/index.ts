// Core types for the Pokemon Team Builder application

export interface PokemonSelection {
  pokemonNames: string[]; // Just names, AI handles all data
  useAllAvailable: boolean; // Uses minimal pokemonList
}

export interface TeamRequest {
  pokemonNames: string[]; // Simple array of Pokemon names
  battleFormat: string;
  playstyles: string[];
}

export interface TeamResponse {
  showdownText: string; // Complete Showdown format with all details
  strategy: string;
  leadPokemon: string;
  winConditions: string[];
  success: boolean;
  error?: string;
}

export interface BattleFormat {
  id: string;
  name: string;
  description: string;
}

export interface Playstyle {
  id: string;
  name: string;
  description: string;
  category: 'weather' | 'speed' | 'defensive' | 'offensive' | 'utility' | 'specialty';
}

export interface FormState {
  step: number;
  pokemonSelection: PokemonSelection;
  battleFormat: string;
  playstyles: string[];
  isLoading: boolean;
  error: string | null;
  result: TeamResponse | null;
}

export interface StepProps {
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

// Form validation schemas
export interface PokemonFormData {
  pokemonInput: string;
  useAllAvailable: boolean;
}

export interface FormatFormData {
  battleFormat: string;
}

export interface PlaystyleFormData {
  playstyles: string[];
}
