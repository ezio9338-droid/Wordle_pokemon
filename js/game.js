// Lógica pura del juego: selección del Pokémon secreto y comparación de
// cada intento contra él. No toca el DOM ni hace fetch directamente.

import { MAX_DEX } from "./pokeApi.js";

export const MAX_ATTEMPTS = 8;

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Fecha (UTC) en formato YYYY-MM-DD, usada como semilla del reto diario. */
export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/** Id determinista 1..MAX_DEX a partir de la fecha: mismo secreto todo el día. */
export function getDailyPokemonId(date = new Date()) {
  const seed = hashString(todayKey(date));
  return (seed % MAX_DEX) + 1;
}

/** Id aleatorio 1..MAX_DEX para el modo ilimitado. */
export function getRandomPokemonId(excludeId = null) {
  let id = excludeId;
  while (id === excludeId) {
    id = Math.floor(Math.random() * MAX_DEX) + 1;
  }
  return id;
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
    category: compareCategorical(guess.categoryEs, secret.categoryEs),
  };
}
