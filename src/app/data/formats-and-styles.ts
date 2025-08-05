import { BattleFormat, Playstyle } from '../types';

export const battleFormats: BattleFormat[] = [
  {
    id: 'gen9ou',
    name: 'Generation 9 OU Singles',
    description: 'Current generation competitive singles format'
  },
  {
    id: 'gen9vgc',
    name: 'Generation 9 VGC Doubles',
    description: 'Official Video Game Championship doubles format'
  },
  {
    id: 'natdexou',
    name: 'National Dex Singles',
    description: 'Singles format including all Pokemon across generations'
  },
  {
    id: 'natdexdoubles',
    name: 'National Dex Doubles',
    description: 'Doubles format including all Pokemon across generations'
  },
  {
    id: 'gen8ou',
    name: 'Generation 8 OU Singles',
    description: 'Previous generation competitive singles format'
  },
  {
    id: 'monotype',
    name: 'Monotype',
    description: 'Teams must consist of Pokemon sharing a single type'
  },
  {
    id: 'custom',
    name: 'Custom Format',
    description: 'Specify your own format requirements'
  }
];

export const playstyles: Playstyle[] = [
  // Weather Teams
  {
    id: 'sun',
    name: 'Sun Team',
    description: 'Focus on Drought/Solar Power synergies',
    category: 'weather'
  },
  {
    id: 'rain',
    name: 'Rain Team',
    description: 'Drizzle-based team with Swift Swim sweepers',
    category: 'weather'
  },
  {
    id: 'sand',
    name: 'Sand Team',
    description: 'Sandstorm teams with Sand Rush/Force',
    category: 'weather'
  },
  {
    id: 'snow',
    name: 'Snow Team',
    description: 'Hail/Snow teams with Aurora Veil support',
    category: 'weather'
  },

  // Speed Control
  {
    id: 'trickroom',
    name: 'Trick Room',
    description: 'Slow, powerful Pokemon with Trick Room support',
    category: 'speed'
  },
  {
    id: 'tailwind',
    name: 'Tailwind',
    description: 'Medium speed Pokemon with Tailwind support',
    category: 'speed'
  },
  {
    id: 'speedboost',
    name: 'Speed Boost',
    description: 'Focus on speed boosting abilities and moves',
    category: 'speed'
  },

  // Defensive
  {
    id: 'stall',
    name: 'Stall',
    description: 'Defensive team focused on outlasting opponents',
    category: 'defensive'
  },
  {
    id: 'bulkyoffense',
    name: 'Bulky Offense',
    description: 'Balance of offensive and defensive capabilities',
    category: 'defensive'
  },
  {
    id: 'balance',
    name: 'Balance',
    description: 'Well-rounded team with varied roles',
    category: 'defensive'
  },

  // Offensive
  {
    id: 'hyperoffense',
    name: 'Hyper Offense',
    description: 'Maximum offensive pressure with setup sweepers',
    category: 'offensive'
  },
  {
    id: 'choiceitems',
    name: 'Choice Items',
    description: 'Team built around Choice Band/Specs/Scarf',
    category: 'offensive'
  },
  {
    id: 'setupsweepers',
    name: 'Setup Sweepers',
    description: 'Focus on stat-boosting moves and sweeping',
    category: 'offensive'
  },

  // Utility
  {
    id: 'support',
    name: 'Support',
    description: 'Team focused on utility and support moves',
    category: 'utility'
  },
  {
    id: 'hazardcontrol',
    name: 'Hazard Control',
    description: 'Entry hazard setting and removal focus',
    category: 'utility'
  },
  {
    id: 'pivot',
    name: 'Pivot Team',
    description: 'U-turn/Volt Switch momentum control',
    category: 'utility'
  },

  // Specialty
  {
    id: 'monotypeteam',
    name: 'Monotype Team',
    description: 'Single-type team composition',
    category: 'specialty'
  },
  {
    id: 'gimmick',
    name: 'Gimmick Team',
    description: 'Unique strategy or theme-based team',
    category: 'specialty'
  }
];

export const getPlaystylesByCategory = (category: string): Playstyle[] => {
  return playstyles.filter(style => style.category === category);
};

export const playstyleCategories = [
  { id: 'weather', name: 'Weather Teams', description: 'Teams built around weather conditions' },
  { id: 'speed', name: 'Speed Control', description: 'Teams focused on speed manipulation' },
  { id: 'defensive', name: 'Defensive', description: 'Defensive and balanced team styles' },
  { id: 'offensive', name: 'Offensive', description: 'Aggressive and offensive strategies' },
  { id: 'utility', name: 'Utility', description: 'Support and utility-focused teams' },
  { id: 'specialty', name: 'Specialty', description: 'Unique and specialized team types' }
];
