// Initial minimal Pokemon list for testing
// This will be expanded later with the full Pokemon list
export const pokemonList = [
  "Pikachu",
  "Charizard", 
  "Blastoise",
  "Venusaur",
  "Alakazam",
  "Machamp",
  "Gengar",
  "Dragonite",
  "Mewtwo",
  "Mew",
  "Tyranitar",
  "Lugia",
  "Ho-Oh",
  "Blaziken",
  "Swampert",
  "Sceptile",
  "Metagross",
  "Rayquaza",
  "Garchomp",
  "Lucario",
  "Dialga",
  "Palkia",
  "Giratina",
  "Arceus",
  "Reshiram",
  "Zekrom",
  "Kyurem",
  "Xerneas",
  "Yveltal",
  "Zygarde",
  "Tapu Koko",
  "Tapu Lele", 
  "Tapu Bulu",
  "Tapu Fini",
  "Solgaleo",
  "Lunala",
  "Necrozma",
  "Dragapult",
  "Corviknight",
  "Toxapex",
  "Ferrothorn",
  "Rotom-Heat",
  "Rotom-Wash",
  "Landorus-Therian",
  "Heatran",
  "Gliscor",
  "Clefable",
  "Magnezone",
  "Scizor",
  "Volcarona"
];

// Popular competitive Pokemon for better AI generation
export const getRandomPokemon = (count: number): string[] => {
  const shuffled = [...pokemonList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const normalizePokemonName = (name: string): string => {
  return name.trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/^(.)/g, (match) => match.toUpperCase());
};

export const validatePokemonName = (name: string): boolean => {
  const normalized = normalizePokemonName(name);
  return pokemonList.some(pokemon => 
    pokemon.toLowerCase() === normalized.toLowerCase()
  );
};
