'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { 
  useForm as useFormContext, 
  usePokemonSelection, 
  useBattleFormat, 
  usePlaystyles, 
  useTeamGeneration 
} from '../../contexts/FormContext';
import { clearTeamData } from '../../lib/utils';
import { TeamResponse } from '../../types';
import { playstyles as allPlaystyles } from '../../data/formats-and-styles';

export function TeamGenerationStep() {
  const { nextStep, prevStep } = useFormContext();
  const { pokemonSelection } = usePokemonSelection();
  const { battleFormat } = useBattleFormat();
  const { playstyles } = usePlaystyles();
  const { isLoading, error, result, setLoading, setError, setResult } = useTeamGeneration();
  const hasStartedGeneration = useRef(false);
  const [progress, setProgress] = useState(0);
  

  const generateTeam = useCallback(async () => {
    console.log('TeamGenerationStep - generateTeam called');
    
    // Clear any old data before starting new generation
    setResult(null);
    clearTeamData();
    
    setLoading(true);
    setError(null);
    setProgress(0);

    // Simulate progress during generation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev; // Don't go to 100 until actually complete
        return prev + Math.random() * 15; // Random increments for realistic feel
      });
    }, 800);

    try {
      const requestData = {
        pokemonNames: pokemonSelection.pokemonNames,
        battleFormat,
        playstyles,
      };

      console.log('TeamGenerationStep - Request data:', requestData);

      let response;
      let data: TeamResponse;
      
      try {
        console.log('TeamGenerationStep - Making fetch request to /api/generate-team');
        response = await fetch('/api/generate-team', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
        });
        
        console.log('TeamGenerationStep - Response received, OK:', response.ok, 'Status:', response.status);


      } catch (fetchError) {
        console.error('TeamGenerationStep - Fetch request failed:', fetchError);
        const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown fetch error';
        throw new Error(`Network request failed: ${errorMessage}`);
      }

      try {
        data = await response.json();


        // Print the complete API response to console

      } catch (parseError) {
        console.error('TeamGenerationStep - Failed to parse JSON:', parseError);
        // Don't try to read response.text() after json() has been called
        console.error('TeamGenerationStep - Response status:', response.status, response.statusText);
        const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown parse error';
        throw new Error(`Failed to parse response: ${errorMessage}`);
      }

      if (!response.ok) {
        console.error('TeamGenerationStep - Response not OK:', response.status);
        
        // Handle rate limiting specifically  
        if (response.status === 429 && data.rateLimited) {
          const resetTime = data.resetTime ? new Date(data.resetTime) : new Date();
          const timeString = resetTime.toLocaleString();
          
          throw new Error(
            `${data.message}\n\n` +
            `Your daily limit resets at ${timeString}.\n` +
            `This helps us manage server costs and ensure fair access for everyone.`
          );
        }
        
        throw new Error(data.error || 'Failed to generate team');
      }

      if (data.success) {
        // Complete the progress
        clearInterval(progressInterval);
        setProgress(100);
        
        // Optional: Show remaining count
        if (data.rateLimit) {
          console.log(`Generation successful. ${data.rateLimit.remaining} attempts remaining today.`);
        }
        
        setResult(data);
        // Note: nextStep() will be called automatically by useEffect when result is set
      } else {
        console.error('TeamGenerationStep - Team generation failed:', data.error);
        throw new Error(data.error || 'Team generation failed');
      }
    } catch (err) {
      console.error('TeamGenerationStep - Error during generation:', err);
      clearInterval(progressInterval);
      setProgress(0);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      console.log('TeamGenerationStep - Setting loading to false');
      clearInterval(progressInterval);
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemonSelection, battleFormat, playstyles]); // Intentionally exclude context setters to reduce recreations

  // Clear old data when component mounts to ensure fresh generation
  useEffect(() => {
    
    // If we're back on this step, reset the generation state
    hasStartedGeneration.current = false;
    setProgress(0);
    
    // Only clear if we're coming back to regenerate (don't clear on first visit)
    if (result) {
      setResult(null);
      clearTeamData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount to avoid multiple triggers

  // Auto-generate team when component mounts (only once)
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('TeamGenerationStep - useEffect triggered, hasStarted:', hasStartedGeneration.current, 'isLoading:', isLoading, 'error:', error, 'result:', !!result);
      
      // Start generation automatically only if we don't have a result yet and haven't started
      if (!hasStartedGeneration.current && !isLoading && !error && !result) {
        console.log('TeamGenerationStep - Starting automatic generation');
        hasStartedGeneration.current = true;
        generateTeam();
      } else {
        console.log('TeamGenerationStep - Skipping generation:', {
          hasStarted: hasStartedGeneration.current,
          isLoading,
          hasError: !!error,
          hasResult: !!result
        });
      }
    }, 100); // Small delay to ensure state is properly initialized
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to only run once on mount

  // Navigate to next step when result is available
  useEffect(() => {
    if (result && !isLoading && !error) {
      
      // Add a small delay to show success state briefly before navigating
      setTimeout(() => {
        nextStep();
      }, 1000); // Show success for 2 seconds before auto-navigation
    }
  }, [result, isLoading, error, nextStep]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Generating Your Team</CardTitle>
          <CardDescription>
            Our AI is analyzing your Pokemon and creating the perfect competitive team based on your preferences.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-8">
          {/* Generation Status */}
          <div className="space-y-4">
            {isLoading ? (
              <>
                <div className="text-center space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <h3 className="text-lg font-medium">Generating Team...</h3>
                  <p className="text-muted-foreground">
                    The AI is researching Pokemon data and creating your optimal team composition.
                  </p>
                </div>
                
                <Progress value={progress} className="w-full" />
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">What&apos;s happening:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Analyzing {pokemonSelection.pokemonNames.length} available Pokemon</li>
                    <li>• Researching stats, abilities, and movesets</li>
                    <li>• Optimizing for {battleFormat} format</li>
                    <li>• Implementing selected playstyle</li>
                    <li>• Creating Pokemon Showdown format team</li>
                    <li>• Generating strategy guide and tips</li>
                  </ul>
                </div>
              </>
            ) : error ? (
              <div className="text-center space-y-4">
                <div className="text-destructive">
                  <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-destructive">Generation Failed</h3>
                <p className="text-destructive">{error}</p>
                
                <div className="space-y-2">
                  <Button onClick={generateTeam} className="w-full">
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={prevStep} className="w-full">
                    Go Back and Modify Selections
                  </Button>
                </div>
              </div>
            ) : result ? (
              <div className="text-center space-y-4">
                <div className="text-primary">
                  <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-foreground">Team Generated Successfully!</h3>
                <p className="text-muted-foreground">
                  Your competitive Pokemon team is ready. Proceeding to results...
                </p>
                
                {/* Auto-navigation countdown */}
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground mb-2">
                    Automatically continuing in a moment...
                  </p>
                  <Button onClick={nextStep} className="w-full max-w-xs">
                    Continue to Results
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <h3 className="text-lg font-medium">Generating Team</h3>
                <p className="text-muted-foreground">
                  May take a few moments depending on the number of Pokemon and complexity of your selections.
                </p>
              </div>
            )}
          </div>

          {/* Selection Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <h4 className="font-medium text-white">Pokemon Count</h4>
              <p className="text-2xl font-bold text-primary">{pokemonSelection.pokemonNames.length}</p>
              <p className="text-sm text-muted-foreground">Available Pokemon</p>
            </div>
            
            <div className="text-center">
              <h4 className="font-medium text-white">Battle Format</h4>
              <p className="text-sm text-primary font-medium">{battleFormat}</p>
              <p className="text-sm text-muted-foreground">Competitive Format</p>
            </div>
            
            <div className="text-center">
              <h4 className="font-medium text-white">Playstyle</h4>
              <p className="text-sm text-primary font-medium">
                {playstyles.length > 0 
                  ? allPlaystyles.find(p => p.id === playstyles[0])?.name || playstyles[0]
                  : 'None'
                }
              </p>
              <p className="text-sm text-muted-foreground">Selected Strategy</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
