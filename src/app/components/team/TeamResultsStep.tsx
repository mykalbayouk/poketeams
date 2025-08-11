'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { useForm as useFormContext, useTeamGeneration } from '../../contexts/FormContext';
import { copyToClipboard, downloadText, loadTeamData, clearTeamData } from '../../lib/utils';
import { Copy, Download, RefreshCw, Edit } from 'lucide-react';

export function TeamResultsStep() {
  const { prevStep, resetForm } = useFormContext();
  const { result, setResult } = useTeamGeneration();
  const [editableTeam, setEditableTeam] = useState('');
  const [copySuccess, setCopySuccess] = useState<'team' | 'strategy' | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  
  // Try to load from localStorage if no result is available
  useEffect(() => {
    if (!result) {
      const storedResult = loadTeamData();
      if (storedResult) {
        setResult(storedResult);
      } 
    }
  }, [result, setResult]);

  // Clean showdown text by removing markdown code block wrapping
  const cleanShowdownText = (text: string) => {
    if (!text) return text;
    
    // Remove ```plaintext``` or ``` wrapping from the beginning and end
    return text
      .replace(/^```(?:plaintext)?\s*\n?/, '') // Remove opening code block
      .replace(/\n?```\s*$/, '') // Remove closing code block
      .trim();
  };

  // Update editable team when result changes
  useEffect(() => {
    if (result?.showdownText) {
      setEditableTeam(cleanShowdownText(result.showdownText));
    }
  }, [result]);
  
  if (result) {
  }

  if (!result) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Card>
          <CardContent className="text-center py-8">
            <div className="space-y-4">
              <p className="text-muted-foreground">No team data available.</p>
              
              {/* Debug section for development */}
              <div className="text-xs text-muted-foreground space-y-2 max-w-md mx-auto">
                <p>Debug Info:</p>
                <p>• Context result: {result ? 'Available' : 'Missing'}</p>
                <p>• Checking localStorage...</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    const stored = loadTeamData();
                    console.log('Manual localStorage check:', stored);
                    alert(`localStorage result: ${stored ? 'Found data' : 'No data'}`);
                  }}
                >
                  Check Storage
                </Button>
              </div>
              
              <Button onClick={prevStep} className="mt-4">
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCopyTeam = async () => {
    const textToCopy = isEditing ? editableTeam : cleanShowdownText(result.showdownText);
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopySuccess('team');
      setTimeout(() => setCopySuccess(null), 2000);
    }
  };

  const handleCopyStrategy = async () => {
    const success = await copyToClipboard(result.strategy);
    if (success) {
      setCopySuccess('strategy');
      setTimeout(() => setCopySuccess(null), 2000);
    }
  };

  const handleDownload = () => {
    const cleanedTeamText = isEditing ? editableTeam : cleanShowdownText(result.showdownText);
    const content = `POKEMON TEAM\n\n${cleanedTeamText}\n\n\nSTRATEGY GUIDE\n\n${result.strategy}`;
    downloadText(content, 'pokemon-team.txt');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditableTeam(cleanShowdownText(result.showdownText));
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
  };

  const generateNewTeam = () => {
    
    // Clear the result from context
    setResult(null);
    
    // Clear all stored team data
    clearTeamData();
    
    // Clear any component state
    setEditableTeam('');
    setIsEditing(false);
    setCopySuccess(null);
    
    
    // Go back to generation step
    prevStep();
  };

  const handleStartOver = () => {
    
    // Clear the result from context
    setResult(null);
    
    // Clear all stored team data
    clearTeamData();
    
    // Clear any component state
    setEditableTeam('');
    setIsEditing(false);
    setCopySuccess(null);
    
    
    // Reset the entire form to step 1
    resetForm();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Team Display */}
        <Card className="h-fit">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Your Pokemon Team</CardTitle>
                <CardDescription>
                  Pokemon Showdown format - {isEditing ? 'Editing mode' : 'Ready to use'}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleSaveEdit}>
                    Save
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {isEditing ? (
              <Textarea
                ref={textareaRef}
                value={editableTeam}
                onChange={(e) => setEditableTeam(e.target.value)}
                className="min-h-[400px] font-mono text-sm bg-card text-card-foreground border-border focus:ring-ring focus:border-ring"
                placeholder="Edit your team here..."
              />
            ) : (
              <div className="bg-muted rounded-md p-4">
                <pre className="text-sm overflow-x-auto whitespace-pre-wrap font-mono text-muted-foreground">
                  {cleanShowdownText(result.showdownText)}
                </pre>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex space-x-2">
            <Button onClick={handleCopyTeam} className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              {copySuccess === 'team' ? 'Copied!' : 'Copy Team'}
            </Button>
            <Button onClick={handleDownload} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </CardFooter>
        </Card>

        {/* Strategy Guide */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Strategy Guide</CardTitle>
            <CardDescription>
              How to play your team effectively
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="prose prose-sm max-w-none">
              <div className="bg-muted rounded-md p-6 text-muted-foreground">
                <ReactMarkdown 
                  components={{
                    h1: ({children}) => <h1 className="text-xl font-bold mb-4 text-foreground">{children}</h1>,
                    h2: ({children}) => <h2 className="text-lg font-semibold mb-3 text-foreground">{children}</h2>,
                    h3: ({children}) => <h3 className="text-base font-medium mb-2 text-foreground">{children}</h3>,
                    p: ({children}) => <p className="mb-3 text-muted-foreground">{children}</p>,
                    ul: ({children}) => <ul className="mb-3 ml-4 list-disc text-muted-foreground">{children}</ul>,
                    ol: ({children}) => <ol className="mb-3 ml-4 list-decimal text-muted-foreground">{children}</ol>,
                    li: ({children}) => <li className="mb-1 text-muted-foreground">{children}</li>,
                    strong: ({children}) => <strong className="font-semibold text-foreground">{children}</strong>,
                    em: ({children}) => <em className="italic text-muted-foreground">{children}</em>,
                    code: ({children}) => <code className="bg-background px-1 py-0.5 rounded text-primary text-sm">{children}</code>,
                  }}
                >
                  {result.strategy}
                </ReactMarkdown>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button onClick={handleCopyStrategy} variant="outline" className="w-full">
              <Copy className="h-4 w-4 mr-2" />
              {copySuccess === 'strategy' ? 'Copied!' : 'Copy Strategy'}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* AI Disclaimer */}
      <div className="mt-8">
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center">
                  <span className="text-yellow-800 text-sm font-bold">!</span>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-yellow-800 mb-1">AI-Generated Content Notice</h4>
                <p className="text-sm text-yellow-700">
                  This team was generated by an AI and information may be incorrect. Please double-check each Pokemon&apos;s movesets, abilities, and items to ensure they are legal and viable before using in competitive play.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
        <Button onClick={generateNewTeam} variant="outline" size="lg" className="min-w-[200px]">
          <RefreshCw className="h-4 w-4 mr-2" />
          Generate New Team
        </Button>
        <Button onClick={handleStartOver} variant="outline" size="lg" className="min-w-[200px]">
          Start Over
        </Button>
      </div>

      {/* Usage Instructions */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Use Your Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Pokemon Showdown</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Go to Pokemon Showdown (play.pokemonshowdown.com)</li>
                <li>Click &quot;Teambuilder&quot; then &quot;New Team&quot;</li>
                <li>Click &quot;Import/Export&quot; and paste your team</li>
                <li>Save and start battling!</li>
              </ol>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Team Building Tips</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Review the strategy guide before battling</li>
                <li>Practice with the recommended lead Pokemon</li>
                <li>Focus on the listed win conditions</li>
                <li>Adapt based on opponent&apos;s team composition</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
