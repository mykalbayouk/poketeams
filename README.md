# Pokemon Team Builder

An AI-powered web application for generating competitive Pokemon teams instantly. Built with Next.js and powered by OpenAI's GPT models, this tool helps Pokemon trainers create optimized teams for competitive battles.

## Features

### **Smart Team Generation**
- Input your available Pokemon and get AI-generated competitive teams
- Teams are formatted for Pokemon Showdown, ready to import and battle
- Complete movesets, items, abilities, EVs, and competitive builds included

### **Battle Format Support**
- Multiple competitive formats supported (Singles, Doubles, etc.)
- Format-specific strategies and meta considerations
- Tera type optimization for current generation formats

### **Playstyle Customization**
- Choose from various playstyles (Offensive, Defensive, Balanced, etc.)
- AI adapts team composition to match your preferred strategy
- Synergistic team building with role coverage

### **Simple & Fast**
- No account creation required - start building immediately
- 5-step guided process for easy team creation
- Instant results with detailed strategy explanations

### **Export Ready**
- Teams generated in standard Pokemon Showdown format
- Copy-paste directly into Pokemon Showdown for immediate use
- Includes detailed strategy guides and usage tips

## How It Works

1. **Select Pokemon** - Input your available Pokemon list
2. **Choose Format** - Pick your preferred battle format
3. **Set Playstyle** - Select strategies that match your preferences
4. **Generate Team** - AI creates an optimized 6-Pokemon team
5. **Export & Battle** - Copy the Showdown-ready team and start battling

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4 API
- **Deployment**: Vercel
- **Validation**: Zod schemas

## Development

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

Create a `.env.local` file in the root directory and add your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key_here
```

## Project Structure

```
src/app/
├── api/generate-team/     # AI team generation endpoint
├── components/
│   ├── pokemon/           # Pokemon selection and format components
│   ├── team/              # Team generation and results components
│   └── ui/                # Reusable UI components
├── contexts/              # React context for form state
├── data/                  # Pokemon data and format definitions
├── lib/                   # Utilities and validation schemas
└── types/                 # TypeScript type definitions
```

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [Pokemon Showdown](https://pokemonshowdown.com/) - competitive Pokemon battle simulator
- [OpenAI API](https://platform.openai.com/docs) - AI model documentation
- [Tailwind CSS](https://tailwindcss.com/docs) - utility-first CSS framework

## Contributing

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) for framework contributions.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
