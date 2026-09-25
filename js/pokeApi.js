// Capa de acceso a PokeAPI: fetch + normalización + caché en localStorage.
// Todas las llamadas se hacen desde el navegador de quien juega, no hay
// backend propio.

import { translateType, translateColor, generationNumber } from "./translations.js";

export const MAX_DEX = 1025; // último número de Pokédex nacional soportado (Gen IX)

const API_BASE = "https://pokeapi.co/api/v2";
const CACHE_PREFIX = "pokedle:v1:";
const memoryCache = new Map();

function readCache(key) {
  if (memoryCache.has(key)) return memoryCache.get(key);
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return undefined;
    const value = JSON.parse(raw);
    memoryCache.set(key, value);
    return value;
  } catch {
    return undefined;
  }
}

function writeCache(key, value) {
  memoryCache.set(key, value);
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(value));
  } catch {
    // localStorage lleno o no disponible: seguimos solo con caché en memoria
  }
}

async function fetchJson(url) {
  const cached = readCache(url);
  if (cached !== undefined) return cached;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error ${res.status} al pedir ${url}`);
  const data = await res.json();
  writeCache(url, data);
  return data;
}

/**
 * Busca al Pokémon dentro de su cadena evolutiva y devuelve en qué posición
 * está (depth) y si todavía puede evolucionar más (canEvolveFurther).
 * Esto permite distinguir un Pokémon sin ninguna evolución (depth 0 y no
 * puede evolucionar) de la primera fase de una familia con más evoluciones
 * (depth 0 mas sí puede evolucionar).
 */
function findEvolutionNode(chainNode, targetName, depth = 0) {
  if (chainNode.species.name === targetName) {
    return { depth, canEvolveFurther: chainNode.evolves_to.length > 0 };
  }
  for (const next of chainNode.evolves_to) {
    const found = findEvolutionNode(next, targetName, depth + 1);
    if (found !== null) return found;
  }
  return null;
}

/**
 * Convierte (depth, canEvolveFurther) en una categoría de etapa evolutiva:
 * 0 = sin evolución, 1 = primera fase, 2 = segunda fase, 3 = tercera fase...
 */
function evolutionStageCategory({ depth, canEvolveFurther }) {
  if (depth === 0 && !canEvolveFurther) return 0; // sin evolución
  return depth + 1;
}

function spanishName(names, fallback) {
  const entry = names.find((n) => n.language.name === "es");
  return entry ? entry.name : fallback;
}

/**
 * Devuelve los datos normalizados de un Pokémon por id o nombre (en inglés/slug).
 */
export async function getPokemon(idOrName) {
  const cacheKey = `pokemon:${idOrName}`;
  const cached = readCache(cacheKey);
  if (cached !== undefined) return cached;

  const [pokemon, species] = await Promise.all([
    fetchJson(`${API_BASE}/pokemon/${idOrName}`),
    fetchJson(`${API_BASE}/pokemon-species/${idOrName}`),
  ]);

  const chain = await fetchJson(species.evolution_chain.url);
  const evoNode = findEvolutionNode(chain.chain, species.name) ?? { depth: 0, canEvolveFurther: false };
  const stage = evolutionStageCategory(evoNode);

  const types = pokemon.types
    .sort((a, b) => a.slot - b.slot)
    .map((t) => t.type.name);

  const normalized = {
    id: pokemon.id,
    nameEn: pokemon.name,
    nameEs: spanishName(species.names, pokemon.name),
    sprite:
      pokemon.sprites?.other?.["official-artwork"]?.front_default ??
      pokemon.sprites?.front_default ??
      null,
    types,
    typesEs: types.map(translateType),
    generation: generationNumber(species.generation.name),
    color: species.color?.name ?? null,
    colorEs: translateColor(species.color?.name),
    stage,
  };

  writeCache(cacheKey, normalized);
  return normalized;
}

/**
 * Lista de {id, name} de los MAX_DEX Pokémon base, para el autocompletado.
 * Se pide una sola vez y se guarda en caché local.
 */
export async function getPokemonNameList() {
  const cacheKey = "species-list";
  const cached = readCache(cacheKey);
  if (cached !== undefined) return cached;

  const data = await fetchJson(`${API_BASE}/pokemon-species?limit=${MAX_DEX}&offset=0`);
  const list = data.results.map((entry) => {
    const id = Number(entry.url.split("/").filter(Boolean).pop());
    return { id, name: entry.name };
  });

  writeCache(cacheKey, list);
  return list;
}
