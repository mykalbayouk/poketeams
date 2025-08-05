import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { TeamResponse } from '../../types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parsePokemonInput(input: string): string[] {
  return input
    .split(/[,\n]/)
    .map(name => name.trim())
    .filter(name => name.length > 0)
    .map(name => {
      // Normalize Pokemon names (capitalize first letter, handle special cases)
      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    });
}

export function formatPokemonName(name: string): string {
  return name
    .trim()
    .split(/[-\s]+/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('-');
}

export function copyToClipboard(text: string): Promise<boolean> {
  return navigator.clipboard.writeText(text)
    .then(() => true)
    .catch(() => false);
}

export function downloadText(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function saveToSessionStorage(key: string, data: unknown): void {
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn('Failed to save to session storage:', error);
  }
}

export function loadFromSessionStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn('Failed to load from session storage:', error);
    return defaultValue;
  }
}

export function clearSessionStorage(key: string): void {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.warn('Failed to clear session storage:', error);
  }
}

// Team data specific storage functions
const TEAM_DATA_KEY = 'pokemon-team-builder-team-data';

export function saveTeamData(teamData: TeamResponse): void {
  try {
    // Save to both localStorage and sessionStorage for redundancy
    localStorage.setItem(TEAM_DATA_KEY, JSON.stringify(teamData));
    sessionStorage.setItem(TEAM_DATA_KEY, JSON.stringify(teamData));
    console.log('Utils - Team data saved to storage:', {
      hasShowdownText: !!teamData.showdownText,
      hasStrategy: !!teamData.strategy
    });
  } catch (error) {
    console.error('Failed to save team data:', error);
  }
}

export function loadTeamData(): TeamResponse | null {
  try {
    // Try localStorage first, then sessionStorage
    let data = localStorage.getItem(TEAM_DATA_KEY);
    if (!data) {
      data = sessionStorage.getItem(TEAM_DATA_KEY);
    }
    
    if (data) {
      const parsedData = JSON.parse(data);
      console.log('Utils - Team data loaded from storage:', {
        hasShowdownText: !!parsedData.showdownText,
        hasStrategy: !!parsedData.strategy
      });
      return parsedData;
    }
    
    console.log('Utils - No team data found in storage');
    return null;
  } catch (error) {
    console.error('Failed to load team data:', error);
    return null;
  }
}

export function clearTeamData(): void {
  try {
    localStorage.removeItem(TEAM_DATA_KEY);
    sessionStorage.removeItem(TEAM_DATA_KEY);
    console.log('Utils - Team data cleared from storage');
  } catch (error) {
    console.error('Failed to clear team data:', error);
  }
}
