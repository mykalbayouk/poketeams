// Competitive Pokemon list based on usage statistics
// Updated with popular competitive Pokemon for better team generation
export const pokemonList = [
  "Rapid Strike Urshifu",
  "Incineroar",
  "Rillaboom",
  "Raging Bolt",
  "Amoonguss",
  "Flutter Mane",
  "Ice Rider Calyrex",
  "Shadow Rider Calyrex",
  "Chi-Yu",
  "Farigiraf",
  "Iron Hands",
  "Hearthflame Mask Ogerpon",
  "Cornerstone Mask Ogerpon",
  "Whimsicott",
  "Miraidon",
  "Tornadus",
  "Chien-Pao",
  "Terapagos",
  "Landorus",
  "Pelipper",
  "Single Strike Urshifu",
  "Zamazenta",
  "Female Indeedee",
  "Clefairy",
  "Koraidon",
  "Kyogre",
  "Roaring Moon",
  "Scream Tail",
  "Ditto",
  "Smeargle",
  "Grimmsnarl",
  "Dondozo",
  "Bloodmoon Ursaluna",
  "Galarian Weezing",
  "Gholdengo",
  "Volcarona",
  "Wellspring Mask Ogerpon",
  "Ursaluna",
  "Heatran",
  "Entei",
  "Mienshao",
  "Tatsugiri Droopy Form",
  "Tsareena",
  "Annihilape",
  "Torkoal",
  "Lunala",
  "Zacian",
  "Dragonite",
  "Iron Crown",
  "Brute Bonnet",
  "Gothitelle",
  "Latios",
  "Tatsugiri",
  "Ting-Lu",
  "Galarian Moltres",
  "Regidrago",
  "Iron Jugulis",
  "Groudon",
  "Calyrex",
  "Iron Treads",
  "Ogerpon",
  "Iron Valiant",
  "Umbreon",
  "Iron Bundle",
  "Regieleki",
  "Walking Wake",
  "Wo-Chien",
  "Archaludon",
  "Gallade",
  "Talonflame",
  "Hatterene",
  "Okidogi",
  "Jumpluff",
  "Gastrodon",
  "Basculegion",
  "Gouging Fire",
  "Tyranitar",
  "Thundurus",
  "Comfey",
  "Tinkaton",
  "Kingambit",
  "Eternatus",
  "Sneasler",
  "Electabuzz",
  "Maushold",
  "Overqwil",
  "Sableye",
  "Araquanid",
  "Sinistcha",
  "Iron Leaves",
  "Klefki",
  "Venusaur",
  "Sylveon",
  "Kommo-o",
  "Ceruledge",
  "Milotic",
  "Hisuian Goodra",
  "Indeedee",
  "Corviknight",
  "Sandy Shocks"
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
