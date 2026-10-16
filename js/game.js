// Lógica pura del juego: selección del Pokémon secreto y comparación de
// cada intento contra él. No toca el DOM ni hace fetch directamente.

import { MAX_DEX } from "./pokeApi.js";
import { dailyItem, randomItemExcluding } from "./random.js";

export const MAX_ATTEMPTS = 8;

const ALL_IDS = Array.from({ length: MAX_DEX }, (_, i) => i + 1);

/** Fecha (UTC) en formato YYYY-MM-DD, usada para saber si cambió el día. */
export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/** Id del día 1..MAX_DEX: mismo secreto para todos, sin repetir hasta recorrer la Pokédex. */
export function getDailyPokemonId(date = new Date()) {
  return dailyItem(ALL_IDS, "pokemon", date);
}

/** Id aleatorio 1..MAX_DEX que no esté en `excludeIds`, o null si ya han salido todos. */
export function getRandomPokemonId(excludeIds = []) {
  return randomItemExcluding(ALL_IDS, excludeIds);
}

function compareTypeSlots(guessTypes, secretTypes) {
  const guessSlots = [guessTypes[0] ?? null, guessTypes[1] ?? null];
  const secretSlots = [secretTypes[0] ?? null, secretTypes[1] ?? null];
  return guessSlots.map((guessType, i) => {
    if (guessType === secretSlots[i]) {
      return { value: guessType, status: "green" };
    }
    if (guessType && secretTypes.includes(guessType)) {
      return { value: guessType, status: "yellow" };
    }
    return { value: guessType, status: "red" };
  });
}

function compareCategorical(guessValue, secretValue) {
  return { value: guessValue, status: guessValue === secretValue ? "green" : "red" };
}

/**
 * Compara un Pokémon adivinado contra el secreto y devuelve el resultado
 * fila por fila para pintar en la tabla, más si fue acierto total.
 */
export function compareGuess(secret, guess) {
  return {
    pokemon: guess,
    win: guess.id === secret.id,
    types: compareTypeSlots(guess.types, secret.types),
    generation: compareCategorical(guess.generation, secret.generation),
    stage: compareCategorical(guess.stage, secret.stage),
    color: compareCategorical(guess.colorEs, secret.colorEs),
  };
}
