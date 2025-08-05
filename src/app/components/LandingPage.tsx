'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Zap, Users, Trophy, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [showExample, setShowExample] = useState(false);

  const handleGetStarted = () => {
    onGetStarted();
  };

  const handleShowExample = () => {
    setShowExample(!showExample);
  };

  const exampleTeam = `Charizard @ Choice Specs
Ability: Solar Power
Tera Type: Fire
EVs: 252 SpA / 4 SpD / 252 Spe
Timid Nature
IVs: 0 Atk
- Fire Blast
- Solar Beam
- Air Slash
- Focus Blast

Venusaur @ Life Orb
Ability: Chlorophyll
Tera Type: Grass
EVs: 252 SpA / 4 SpD / 252 Spe
Modest Nature
IVs: 0 Atk
- Solar Beam
- Sludge Bomb
- Earth Power
- Sleep Powder`;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="bg-primary/10 p-4 rounded-full">
              <Sparkles className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            Pokemon Team Builder
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
            Generate competitive Pokemon teams instantly with AI. 
            <br />
            <span className="text-primary font-semibold">No signup required</span> • Showdown format • Expert strategy guides
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-6">
              <Zap className="mr-2 h-5 w-5" />
              Start Building Team
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleShowExample}
              className="text-lg px-8 py-6"
            >
              {showExample ? 'Hide' : 'View'} Example Team
            </Button>
          </div>

          {/* Example Team Preview */}
          {showExample && (
            <Card className="max-w-2xl mx-auto mb-12 text-left card-contrast">
              <CardHeader>
                <CardTitle className="text-card-foreground">Example Generated Team</CardTitle>
                <CardDescription>
                  Sun-based team optimized for Generation 9 OU Singles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-sm bg-muted text-muted-foreground p-4 rounded-md overflow-x-auto font-mono">
                  {exampleTeam}
                </pre>
                <p className="text-sm text-muted-foreground mt-3">
                  Complete with strategy guide, win conditions, and matchup advice.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center card-contrast">
            <CardHeader>
              <div className="mx-auto bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-card-foreground">AI-Powered Generation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Advanced AI analyzes your Pokemon list and creates optimal team compositions with perfect movesets, EVs, and strategies.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center card-contrast">
            <CardHeader>
              <div className="mx-auto bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-card-foreground">Competitive Ready</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Teams generated in Pokemon Showdown format, optimized for current meta with proper items, abilities, and natures.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center card-contrast">
            <CardHeader>
              <div className="mx-auto bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-card-foreground">Expert Strategy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Get comprehensive strategy guides with win conditions, synergies, and matchup advice for every team.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">Select Pokemon</h3>
              <p className="text-sm text-muted-foreground">
                Input your available Pokemon or use our curated list
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">Choose Format</h3>
              <p className="text-sm text-muted-foreground">
                Pick your competitive format (OU, VGC, National Dex)
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">Select Playstyles</h3>
              <p className="text-sm text-muted-foreground">
                Define your strategy (offense, weather, utility)
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">Get Team</h3>
              <p className="text-sm text-muted-foreground">
                Receive optimized team with strategy guide
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">Ready to Build Your Team?</CardTitle>
              <CardDescription className="text-lg">
                Join thousands of trainers using AI-powered team building
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button size="lg" onClick={onGetStarted} className="text-lg px-8 py-6">
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Your First Team
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                No account required • Free to use • Instant results
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
