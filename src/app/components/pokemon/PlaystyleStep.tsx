'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { usePlaystyles, useForm as useFormContext } from '../../contexts/FormContext';
import { playstyles, playstyleCategories, getPlaystylesByCategory } from '../../data/formats-and-styles';
import { playstyleSchema, PlaystyleFormData } from '../../lib/validations/schemas';
import { cn } from '../../lib/utils';

export function PlaystyleStep() {
  const { nextStep, prevStep } = useFormContext();
  const { playstyles: selectedPlaystyles, setPlaystyles } = usePlaystyles();

  const form = useForm<PlaystyleFormData>({
    resolver: zodResolver(playstyleSchema),
    defaultValues: {
      playstyles: selectedPlaystyles
    }
  });

  const watchedPlaystyles = form.watch('playstyles') || [];

  const onSubmit = (data: PlaystyleFormData) => {
    setPlaystyles(data.playstyles);
    nextStep();
  };

  const togglePlaystyle = (playstyleId: string) => {
    const currentPlaystyles = watchedPlaystyles;
    
    if (currentPlaystyles.includes(playstyleId)) {
      // Remove if already selected
      form.setValue('playstyles', currentPlaystyles.filter(id => id !== playstyleId));
    } else if (currentPlaystyles.length < 3) {
      // Add if under the limit of 3
      form.setValue('playstyles', [...currentPlaystyles, playstyleId]);
    }
    // If already at 3 selections, do nothing (don't add more)
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Select Team Playstyles</CardTitle>
          <CardDescription>
            Choose up to 3 playstyles that define your team&apos;s strategy. This will guide how the AI builds your team with multiple strategic approaches.
          </CardDescription>
        </CardHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8 pt-8">
            {playstyleCategories.map((category) => {
              const categoryPlaystyles = getPlaystylesByCategory(category.id);
              
              return (
                <div key={category.id} className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categoryPlaystyles.map((playstyle) => {
                      const isSelected = watchedPlaystyles.includes(playstyle.id);
                      
                      return (
                        <button
                          key={playstyle.id}
                          type="button"
                          onClick={() => togglePlaystyle(playstyle.id)}
                          disabled={!isSelected && watchedPlaystyles.length >= 3}
                          className={cn(
                            'relative flex cursor-pointer rounded-lg border p-4 text-left transition-all hover:bg-gray-50 hover:text-gray-900',
                            isSelected
                              ? 'border-primary bg-primary/5 ring-1 ring-primary'
                              : 'border-gray-200',
                            !isSelected && watchedPlaystyles.length >= 3
                              ? 'opacity-50 cursor-not-allowed'
                              : ''
                          )}
                        >
                          <div className="flex flex-1 flex-col">
                            <div className="flex items-center space-x-3">
                              <div className={cn(
                                'h-4 w-4 rounded border-2 flex items-center justify-center',
                                isSelected
                                  ? 'border-primary bg-primary'
                                  : 'border-gray-300'
                              )}>
                                {isSelected && (
                                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              <h4 className="font-medium text-white">{playstyle.name}</h4>
                            </div>
                            
                            <p className="mt-2 text-sm text-gray-200">
                              {playstyle.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {form.formState.errors.playstyles && (
              <p className="text-sm text-red-600">
                {form.formState.errors.playstyles.message}
              </p>
            )}

            {/* Selected Playstyles Summary */}
            {watchedPlaystyles.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="text-sm font-medium text-blue-900 mb-2">
                  Selected Playstyles ({watchedPlaystyles.length}/3)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {watchedPlaystyles.map((styleId) => {
                    const style = playstyles.find(p => p.id === styleId);
                    return style ? (
                      <span
                        key={styleId}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {style.name}
                      </span>
                    ) : null;
                  })}
                </div>
                <p className="text-xs text-blue-700 mt-2">
                  The AI will create a team that combines these strategic approaches.
                  {watchedPlaystyles.length < 3 && ` You can select ${3 - watchedPlaystyles.length} more playstyle${3 - watchedPlaystyles.length === 1 ? '' : 's'}.`}
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button type="button" variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button 
              type="submit" 
              disabled={watchedPlaystyles.length === 0}
              className="min-w-[120px]"
            >
              Generate Team
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
