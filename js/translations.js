// Traducciones estáticas ES para atributos que no vienen traducidos
// directamente y baratos de mantener sin peticiones extra a la PokeAPI.

export const TYPE_ES = {
  normal: "Normal",
  fighting: "Lucha",
  flying: "Volador",
  poison: "Veneno",
  ground: "Tierra",
  rock: "Roca",
  bug: "Bicho",
  ghost: "Fantasma",
  steel: "Acero",
  fire: "Fuego",
  water: "Agua",
  grass: "Planta",
  electric: "Eléctrico",
  psychic: "Psíquico",
  ice: "Hielo",
  dragon: "Dragón",
  dark: "Siniestro",
  fairy: "Hada",
  stellar: "Astral",
  unknown: "???",
};

export const COLOR_ES = {
  black: "Negro",
  blue: "Azul",
  brown: "Marrón",
  gray: "Gris",
  green: "Verde",
  pink: "Rosa",
  purple: "Morado",
  red: "Rojo",
  white: "Blanco",
  yellow: "Amarillo",
};

export const HABITAT_ES = {
  cave: "Cueva",
  forest: "Bosque",
  grassland: "Pradera",
  mountain: "Montaña",
  rare: "Raro",
  rough_terrain: "Terreno abrupto",
  sea: "Mar",
  urban: "Urbano",
  "waters-edge": "Orilla del agua",
  waters_edge: "Orilla del agua",
  desconocido: "Desconocido",
};

export const GENERATION_ES = {
  "generation-i": 1,
  "generation-ii": 2,
  "generation-iii": 3,
  "generation-iv": 4,
  "generation-v": 5,
  "generation-vi": 6,
  "generation-vii": 7,
  "generation-viii": 8,
  "generation-ix": 9,
};

export function translateType(slug) {
  return TYPE_ES[slug] ?? slug;
}

export function translateColor(slug) {
  return COLOR_ES[slug] ?? slug;
}

export function translateHabitat(slug) {
  if (!slug) return "Desconocido";
  return HABITAT_ES[slug] ?? slug;
}

export function generationNumber(slug) {
  return GENERATION_ES[slug] ?? null;
}

export function categoryLabel({ isLegendary, isMythical }) {
  if (isMythical) return "Mítico";
  if (isLegendary) return "Legendario";
  return "Normal";
}

export const STAGE_LABELS = ["Sin evolución", "Primera fase", "Segunda fase", "Tercera fase"];

export function stageLabel(stage) {
  return STAGE_LABELS[stage] ?? `Fase ${stage}`;
}
