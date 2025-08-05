'use client';

import { useState } from 'react';
import { FormProvider } from './contexts/FormContext';
import { LandingPage } from './components/LandingPage';
import { TeamBuilderFlow } from './components/TeamBuilderFlow';

export default function Home() {
  const [showTeamBuilder, setShowTeamBuilder] = useState(false);

  const handleGetStarted = () => {
    setShowTeamBuilder(true);
  };

  if (!showTeamBuilder) {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  return (
    <FormProvider>
      <TeamBuilderFlow />
    </FormProvider>
  );
}
