'use client';

import { useForm } from '../contexts/FormContext';
import { StepNavigation } from './StepNavigation';
import { PokemonSelectionStep } from './pokemon/PokemonSelectionStep';
import { BattleFormatStep } from './pokemon/BattleFormatStep';
import { PlaystyleStep } from './pokemon/PlaystyleStep';
import { TeamGenerationStep } from './team/TeamGenerationStep';
import { TeamResultsStep } from './team/TeamResultsStep';

export function TeamBuilderFlow() {
  const { state } = useForm();

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return <PokemonSelectionStep />;
      case 2:
        return <BattleFormatStep />;
      case 3:
        return <PlaystyleStep />;
      case 4:
        return <TeamGenerationStep />;
      case 5:
        return <TeamResultsStep />;
      default:
        return <PokemonSelectionStep />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto">
        <StepNavigation />
        <main className="pb-8">
          {renderStep()}
        </main>
      </div>
    </div>
  );
}
