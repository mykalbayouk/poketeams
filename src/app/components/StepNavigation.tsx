'use client';

import { useForm } from '../contexts/FormContext';
import { Progress } from './ui/progress';
import { cn } from '../lib/utils';

const steps = [
  { id: 1, name: 'Pokemon Selection', description: 'Choose Pokemon' },
  { id: 2, name: 'Battle Format', description: 'Select format' },
  { id: 3, name: 'Playstyles', description: 'Choose strategy' },
  { id: 4, name: 'Generate Team', description: 'AI creates team' },
  { id: 5, name: 'Results', description: 'Your team is ready' }
];

export function StepNavigation() {
  const { state } = useForm();
  const progress = (state.step / steps.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Step {state.step} of {steps.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Breadcrumbs */}
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between">
          {steps.map((step, stepIdx) => (
            <li key={step.id} className={cn(
              'relative',
              stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''
            )}>
              {/* Connector Line */}
              {stepIdx !== steps.length - 1 && (
                <div
                  className="absolute inset-0 flex items-center"
                  aria-hidden="true"
                >
                  <div className={cn(
                    'h-0.5 w-full',
                    step.id < state.step ? 'bg-primary' : 'bg-border'
                  )} />
                </div>
              )}
              
              {/* Step Circle and Label */}
              <div className="relative flex items-center justify-center">
                <div className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium',
                  step.id < state.step
                    ? 'bg-primary text-primary-foreground'
                    : step.id === state.step
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background'
                    : 'bg-muted text-muted-foreground'
                )}>
                  {step.id < state.step ? (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                
                {/* Step Label */}
                <div className="absolute top-10 -left-16 w-32 text-center">
                  <div className={cn(
                    'text-xs font-medium',
                    step.id <= state.step ? 'text-primary' : 'text-muted-foreground'
                  )}>
                    {step.name}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {step.description}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
}
