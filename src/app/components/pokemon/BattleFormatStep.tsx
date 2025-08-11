'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { useBattleFormat, useForm as useFormContext } from '../../contexts/FormContext';
import { battleFormats } from '../../data/formats-and-styles';
import { battleFormatSchema, BattleFormatFormData } from '../../lib/validations/schemas';
import { cn } from '../../lib/utils';

export function BattleFormatStep() {
  const { nextStep, prevStep } = useFormContext();
  const { battleFormat, setBattleFormat } = useBattleFormat();

  const form = useForm<BattleFormatFormData>({
    resolver: zodResolver(battleFormatSchema),
    defaultValues: {
      battleFormat: battleFormat
    }
  });

  const selectedFormat = form.watch('battleFormat');

  const onSubmit = (data: BattleFormatFormData) => {
    setBattleFormat(data.battleFormat);
    nextStep();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Select Battle Format</CardTitle>
          <CardDescription>
            Choose the competitive format for your team. This determines the rules and restrictions for team building.
          </CardDescription>
        </CardHeader>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {battleFormats.map((format) => (
                <label
                  key={format.id}
                  className={cn(
                    'relative flex cursor-pointer rounded-lg border p-4 transition-all hover:bg-accent hover:text-accent-foreground',
                    selectedFormat === format.id
                      ? 'border-primary bg-primary/5 ring-1 ring-primary'
                      : 'border-border'
                  )}
                >
                  <input
                    type="radio"
                    value={format.id}
                    className="sr-only"
                    {...form.register('battleFormat')}
                  />
                  
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        'h-4 w-4 rounded-full border-2 flex items-center justify-center',
                        selectedFormat === format.id
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      )}>
                        {selectedFormat === format.id && (
                          <div className="h-2 w-2 rounded-full bg-primary-foreground" />
                        )}
                      </div>
                      <h3 className="font-medium text-foreground">{format.name}</h3>
                    </div>
                    
                    <p className="mt-2 text-sm text-muted-foreground">
                      {format.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {form.formState.errors.battleFormat && (
              <p className="text-sm text-destructive">
                {form.formState.errors.battleFormat.message}
              </p>
            )}

            {/* Selected Format Details */}
            {selectedFormat && (
              <div className="mt-6 p-4 bg-accent border border-border rounded-lg">
                <h4 className="text-sm font-medium text-accent-foreground mb-2">
                  Selected Format Details
                </h4>
                <p className="text-sm text-muted-foreground">
                  {battleFormats.find(f => f.id === selectedFormat)?.description}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  The AI will generate a team optimized for this format&apos;s metagame and rules.
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
              disabled={!selectedFormat}
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
