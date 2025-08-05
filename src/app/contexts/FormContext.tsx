'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { FormState, TeamResponse, PokemonSelection } from '../types';
import { saveToSessionStorage, loadFromSessionStorage, saveTeamData, clearTeamData } from '../lib/utils';

// Action types for the reducer
type FormAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'SET_POKEMON_SELECTION'; payload: PokemonSelection }
  | { type: 'SET_BATTLE_FORMAT'; payload: string }
  | { type: 'SET_PLAYSTYLES'; payload: string[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_RESULT'; payload: TeamResponse | null }
  | { type: 'RESET_FORM' }
  | { type: 'LOAD_FROM_STORAGE'; payload: Partial<FormState> };

// Initial state
const initialState: FormState = {
  step: 1,
  pokemonSelection: {
    pokemonNames: [],
    useAllAvailable: false
  },
  battleFormat: '',
  playstyles: [],
  isLoading: false,
  error: null,
  result: null
};

// Reducer function
function formReducer(state: FormState, action: FormAction): FormState {
  console.log('FormContext Reducer - Action:', action.type);
  if ('payload' in action) {
    console.log('FormContext Reducer - Payload:', action.payload);
  }
  console.log('FormContext Reducer - Current State:', { step: state.step, hasResult: !!state.result });
  
  switch (action.type) {
    case 'SET_STEP':
      console.log('Setting step to:', action.payload);
      return { ...state, step: action.payload, error: null };
    case 'SET_POKEMON_SELECTION':
      console.log('Setting Pokemon selection:', action.payload);
      return { ...state, pokemonSelection: action.payload, error: null };
    case 'SET_BATTLE_FORMAT':
      console.log('Setting battle format:', action.payload);
      return { ...state, battleFormat: action.payload, error: null };
    case 'SET_PLAYSTYLES':
      console.log('Setting playstyles:', action.payload);
      return { ...state, playstyles: action.payload, error: null };
    case 'SET_LOADING':
      console.log('Setting loading state:', action.payload);
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      console.log('Setting error:', action.payload);
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_RESULT':
      console.log('Setting result:', action.payload ? 'Team generated successfully' : 'Result cleared');
      if (action.payload) {
        // Save team data to localStorage for persistence
        saveTeamData(action.payload);
      }
      return { ...state, result: action.payload, isLoading: false, error: null };
    case 'RESET_FORM':
      return { ...initialState };
    case 'LOAD_FROM_STORAGE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

// Context type
interface FormContextType {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
  nextStep: () => void;
  prevStep: () => void;
  resetForm: () => void;
  saveProgress: () => void;
}

// Create context
const FormContext = createContext<FormContextType | undefined>(undefined);

// Session storage key
const STORAGE_KEY = 'pokemon-team-builder-form';

// Provider component
interface FormProviderProps {
  children: ReactNode;
}

export function FormProvider({ children }: FormProviderProps) {
  const [state, dispatch] = useReducer(formReducer, initialState);

  // Load from session storage on mount
  useEffect(() => {
    const savedState = loadFromSessionStorage(STORAGE_KEY, {});
    if (Object.keys(savedState).length > 0) {
      dispatch({ type: 'LOAD_FROM_STORAGE', payload: savedState });
    }
  }, []);

  // Save to session storage when state changes (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      saveToSessionStorage(STORAGE_KEY, state);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [state]);

  const nextStep = () => {
    console.log('FormContext - nextStep called, current step:', state.step);
    if (state.step < 5) {
      console.log('FormContext - Moving to step:', state.step + 1);
      dispatch({ type: 'SET_STEP', payload: state.step + 1 });
    } else {
      console.log('FormContext - Already at final step, not moving');
    }
  };

  const prevStep = () => {
    console.log('FormContext - prevStep called, current step:', state.step);
    if (state.step > 1) {
      console.log('FormContext - Moving to step:', state.step - 1);
      dispatch({ type: 'SET_STEP', payload: state.step - 1 });
    } else {
      console.log('FormContext - Already at first step, not moving');
    }
  };

  const resetForm = () => {
    console.log('FormContext - Resetting form and clearing all data');
    clearTeamData(); // Clear stored team data
    dispatch({ type: 'RESET_FORM' });
  };

  const saveProgress = () => {
    saveToSessionStorage(STORAGE_KEY, state);
  };

  const contextValue: FormContextType = {
    state,
    dispatch,
    nextStep,
    prevStep,
    resetForm,
    saveProgress
  };

  return (
    <FormContext.Provider value={contextValue}>
      {children}
    </FormContext.Provider>
  );
}

// Custom hook to use the form context
export function useForm() {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
}

// Convenience hooks for specific actions
export function usePokemonSelection() {
  const { state, dispatch } = useForm();
  
  const setPokemonSelection = (selection: PokemonSelection) => {
    dispatch({ type: 'SET_POKEMON_SELECTION', payload: selection });
  };

  return {
    pokemonSelection: state.pokemonSelection,
    setPokemonSelection
  };
}

export function useBattleFormat() {
  const { state, dispatch } = useForm();
  
  const setBattleFormat = (format: string) => {
    dispatch({ type: 'SET_BATTLE_FORMAT', payload: format });
  };

  return {
    battleFormat: state.battleFormat,
    setBattleFormat
  };
}

export function usePlaystyles() {
  const { state, dispatch } = useForm();
  
  const setPlaystyles = (styles: string[]) => {
    dispatch({ type: 'SET_PLAYSTYLES', payload: styles });
  };

  return {
    playstyles: state.playstyles,
    setPlaystyles
  };
}

export function useTeamGeneration() {
  const { state, dispatch } = useForm();
  
  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setResult = (result: TeamResponse | null) => {
    dispatch({ type: 'SET_RESULT', payload: result });
  };

  return {
    isLoading: state.isLoading,
    error: state.error,
    result: state.result,
    setLoading,
    setError,
    setResult
  };
}
