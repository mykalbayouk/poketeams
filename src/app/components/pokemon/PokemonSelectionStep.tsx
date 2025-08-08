'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { usePokemonSelection, useForm as useFormContext } from '../../contexts/FormContext';
import { pokemonList } from '../../data/pokemon-list';
import { parsePokemonInput } from '../../lib/utils';
import { pokemonSelectionSchema, PokemonSelectionFormData } from '../../lib/validations/schemas';

export function PokemonSelectionStep() {
  const { nextStep } = useFormContext();
  const { pokemonSelection, setPokemonSelection } = usePokemonSelection();
  const [showPreview, setShowPreview] = useState(false);
  
  console.log('PokemonSelectionStep - Current selection:', pokemonSelection);

  const form = useForm<PokemonSelectionFormData>({
    resolver: zodResolver(pokemonSelectionSchema),
    defaultValues: {
      pokemonInput: pokemonSelection.pokemonNames.join('\n'),
      useAllAvailable: pokemonSelection.useAllAvailable
    }
  });

  const watchedInput = form.watch('pokemonInput');
  const watchedUseAll = form.watch('useAllAvailable');

  const parsedPokemon = parsePokemonInput(watchedInput);
  const finalPokemonList = watchedUseAll ? pokemonList : parsedPokemon;
  

  const onSubmit = (data: PokemonSelectionFormData) => {
    const pokemonNames = data.useAllAvailable
      ? pokemonList
      : parsePokemonInput(data.pokemonInput);

    console.log('PokemonSelectionStep - Final pokemon names:', pokemonNames);

    setPokemonSelection({
      pokemonNames,
      useAllAvailable: data.useAllAvailable
    });

    nextStep();
  };

  const handleUseAll = () => {
    console.log('PokemonSelectionStep - Use All button clicked, current state:', watchedUseAll);
    form.setValue('useAllAvailable', !watchedUseAll);
    if (!watchedUseAll) {
      form.setValue('pokemonInput', '');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Select Your Pokemon</CardTitle>
          <CardDescription>
            Choose the Pokemon you want to build a team from. You can either select all available Pokemon or input your own list.
          </CardDescription>
        </CardHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6 pt-8">
            {/* Use All Available Pokemon Option */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="useAll"
                className="h-4 w-4 rounded border-gray-300"
                checked={watchedUseAll}
                onChange={handleUseAll}
              />
              <label htmlFor="useAll" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Use List of Highest Rated Competitive Pokemon ({pokemonList.length} Pokemon)
              </label>
            </div>

            {/* Manual Pokemon Input */}
            {!watchedUseAll && (
              <div className="space-y-2">
                <label htmlFor="pokemonInput" className="text-sm font-medium">
                  Enter Pokemon Names
                </label>
                <Textarea
                  id="pokemonInput"
                  placeholder="Enter Pokemon names (one per line or comma-separated)&#10;Example:&#10;Pikachu&#10;Charizard&#10;Blastoise"
                  className="min-h-[120px]"
                  {...form.register('pokemonInput')}
                />
                {form.formState.errors.pokemonInput && (
                  <p className="text-sm text-red-600">
                    {form.formState.errors.pokemonInput.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Separate Pokemon names with commas or new lines. The AI will validate and research all Pokemon data.
                </p>
              </div>
            )}

            {/* Pokemon Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Selected Pokemon ({finalPokemonList.length})
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  {showPreview ? 'Hide' : 'Show'} Preview
                </Button>
              </div>
              
              {showPreview && (
                <div className="border rounded-md p-3 max-h-48 overflow-y-auto">
                  {finalPokemonList.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                      {finalPokemonList.map((pokemon, index) => (
                        <div key={index} className="text-sm p-2 bg-gray-100 text-gray-800 rounded border">
                          {pokemon}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No Pokemon selected</p>
                  )}
                </div>
              )}
            </div>

            {/* Information Box */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h4 className="text-sm font-medium text-blue-900 mb-2">How it works</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• The AI will research all Pokemon data including stats, moves, and abilities</li>
                <li>• You only need to provide Pokemon names - the AI handles everything else</li>
                <li>• Teams will be generated in Pokemon Showdown format</li>
                <li>• Common name variations and typos will be automatically corrected</li>
              </ul>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <div></div>
            <Button 
              type="submit" 
              disabled={finalPokemonList.length === 0}
              className="min-w-[120px]"
            >
              Next Step
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
