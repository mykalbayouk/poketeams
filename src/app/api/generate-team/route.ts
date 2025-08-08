import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { teamRequestSchema } from '../../lib/validations/schemas';
import { battleFormats, playstyles } from '../../data/formats-and-styles';
import { teamGenerationLimit, getUserIdentifier } from '../../lib/rate-limit';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  console.log('Team generation request received');
  
  try {
    // 1. RATE LIMITING CHECK (before any expensive operations)
    const userIdentifier = getUserIdentifier(request);
    console.log(`Checking rate limit for user: ${userIdentifier}`);
    
    const { success, limit, reset, remaining } = await teamGenerationLimit.limit(userIdentifier);
    
    if (!success) {
      console.log(`Rate limit exceeded for user: ${userIdentifier}`);
      
      const hoursUntilReset = Math.round((reset - Date.now()) / 1000 / 60 / 60);
      const resetTime = new Date(reset);
      
      return NextResponse.json({
        error: "Daily limit exceeded",
        message: `You can only generate ${limit} teams per day. Your limit resets at ${resetTime.toLocaleTimeString()} (in ${hoursUntilReset} hours).`,
        remaining: 0,
        resetTime: resetTime.toISOString(),
        limit,
        rateLimited: true
      }, { status: 429 });
    }
    
    console.log(`Rate limit OK for user: ${userIdentifier}. ${remaining} requests remaining.`);

    // 2. VALIDATE REQUEST DATA
    const body = await request.json();
    const validatedData = teamRequestSchema.parse(body);

    const { pokemonNames, battleFormat, playstyles: selectedPlaystyles } = validatedData;
    
    console.log(`Request: ${pokemonNames.length} Pokemon, ${battleFormat}, ${selectedPlaystyles.length} playstyles`);

    // 3. PREPARE AI PROMPT (existing code)
    const formatDetails = battleFormats.find(f => f.id === battleFormat);
    const playstyleDetails = selectedPlaystyles.map(id => 
      playstyles.find(p => p.id === id)
    ).filter(Boolean);

    // Construct the AI prompt
    const prompt = `You are a competitive Pokemon team builder expert with access to complete Pokemon data. Generate a 6-Pokemon team for the following criteria:

Available Pokemon: ${pokemonNames.join(', ')}
Battle Format: ${formatDetails?.name || battleFormat} - ${formatDetails?.description || 'Custom format'}
Playstyles: ${playstyleDetails.map(p => `${p?.name} (${p?.description})`).join(', ')}

For each Pokemon in the user's list, you have access to all their data including:
- Base stats, types, abilities (including hidden abilities)
- Complete movepool and learnable moves
- Viable items and competitive builds
- Current meta viability and usage statistics
- Type effectiveness and team synergy

Please select exactly 6 Pokemon from ONLY the provided list, do not choose pokemon outside the list, and generate the team in Pokemon Showdown format with exact specifications:
- Complete movesets with 4 moves each
- Appropriate items for each Pokemon
- Optimal abilities (including hidden abilities if viable)
- Competitive EV spreads and natures
- Tera types for current generation formats (if applicable)
- IV specifications where relevant (0 Attack for special attackers)

Example format structure:
Ninetales @ Heat Rock
Ability: Drought
Shiny: Yes
Tera Type: Flying
EVs: 252 HP / 4 Def / 252 SpD
Sassy Nature
IVs: 0 Atk

- Nasty Plot
- Baton Pass
- Agility
- Flamethrower

Generate a balanced team that:
1. Has good type coverage and synergy
2. Implements the selected playstyles effectively
3. Is optimized for the chosen battle format
4. Has clear roles for each Pokemon (sweeper, wall, support, etc.)
5. Includes proper team building fundamentals

Provide your response in the following format:

TEAM:
[Complete Pokemon Showdown format text for all 6 Pokemon separated with newlines]

STRATEGY:
## Lead Pokemon
[Recommended lead Pokemon name, if doubles choose 2 leads]

## Team Overview
[Brief description of the team's core strategy and how it implements the selected playstyles]

## Win Conditions
- [Primary win condition 1]
- [Primary win condition 2] 

## Key Synergies
[Explain important Pokemon interactions and combos]

## Common Matchups
[Brief advice on how the team performs against common threats and strategies]

## Gameplay Tips
- [Specific tip 1 for playing this team effectively]
- [Specific tip 2 for playing this team effectively]
- [Specific tip 3 for playing this team effectively]
- [Specific tip 4 for playing this team effectively]

Be sure to double check all pokemon are from ONLY the provided list, and that the team is legal and complete with no missing moves, items, or abilities.`;

    console.log('Sending request to OpenAI...');
    
    // 4. MAKE AI REQUEST (existing code)
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert competitive Pokemon team builder with comprehensive knowledge of all Pokemon games, movesets, abilities, and competitive strategies. Always provide complete, legal, and optimized team builds.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });
    
    console.log('OpenAI response received');

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      console.error('No response from OpenAI');
      throw new Error('No response received from OpenAI');
    }
    
    // Parse the response to extract team and strategy
    const teamMatch = response.match(/TEAM:\s*([\s\S]*?)(?=STRATEGY:|$)/);
    const strategyMatch = response.match(/STRATEGY:\s*([\s\S]*?)$/);

    if (!teamMatch) {
      console.error('Could not parse team data');
      throw new Error('Could not parse team data from AI response');
    }

    const showdownText = teamMatch[1].trim();
    const strategy = strategyMatch ? strategyMatch[1].trim() : 'Strategy guide not available';
    
    console.log('Team generated successfully');
    
    // 5. RETURN SUCCESS WITH RATE LIMIT INFO
    console.log(`Team generated successfully for user: ${userIdentifier}. ${remaining - 1} requests remaining.`);
    
    // Return successful response
    return NextResponse.json({
      success: true,
      showdownText,
      strategy,
      leadPokemon: 'See strategy guide',
      winConditions: ['See strategy guide for detailed win conditions'],
      // Include rate limit info for frontend
      rateLimit: {
        remaining: remaining - 1,
        limit,
        resetTime: new Date(reset).toISOString()
      }
    });

  } catch (error) {
    console.error('Team generation failed:', error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'OpenAI API key is not configured. Please check your environment variables.' 
          },
          { status: 500 }
        );
      }
      
      if (error.message.includes('quota') || error.message.includes('billing')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'OpenAI API quota exceeded. Please try again later.' 
          },
          { status: 429 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate team. Please try again.' 
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
