// Lógica pura del juego de One Piece: mismo espíritu que game.js, pero sin
// llamadas a red (los datos ya están en memoria en onePieceData.js).

import { CHARACTERS } from "./onePieceData.js";

export const MAX_ATTEMPTS = 8;

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/** Personaje determinista por fecha: mismo secreto todo el día para todos. */
export function getDailyCharacter(date = new Date()) {
  const seed = hashString(`onepiece:${todayKey(date)}`);
  return CHARACTERS[seed % CHARACTERS.length];
}

/** Personaje aleatorio para el modo ilimitado. */
export function getRandomCharacter(excludeId = null) {
  if (CHARACTERS.length === 1) return CHARACTERS[0];
  let character = null;
  while (!character || character.id === excludeId) {
    character = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
  }
  return character;
}

export function getCharacterById(id) {
  return CHARACTERS.find((c) => c.id === id) ?? null;
}

function compareCategorical(guessValue, secretValue) {
  return { value: guessValue, status: guessValue === secretValue ? "green" : "red" };
}

export function compareGuess(secret, guess) {
  return {
    character: guess,
    win: guess.id === secret.id,
    arc: compareCategorical(guess.arc, secret.arc),
    affiliation: compareCategorical(guess.affiliation, secret.affiliation),
    devilFruit: compareCategorical(guess.devilFruit, secret.devilFruit),
    race: compareCategorical(guess.race, secret.race),
    alive: compareCategorical(guess.status, secret.status),
  };
}
