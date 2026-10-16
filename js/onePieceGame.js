// Lógica pura del juego de One Piece: mismo espíritu que game.js, pero sin
// llamadas a red (los datos ya están en memoria en onePieceData.js).

import { CHARACTERS } from "./onePieceData.js";
import { dailyItem, randomItemExcluding } from "./random.js";

export const MAX_ATTEMPTS = 8;

export function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/** Personaje del día: mismo secreto para todos, sin repetir hasta recorrer la lista. */
export function getDailyCharacter(date = new Date()) {
  return dailyItem(CHARACTERS, "onepiece", date);
}

/** Personaje aleatorio cuyo id no esté en `excludeIds`, o null si ya han salido todos. */
export function getRandomCharacter(excludeIds = []) {
  return randomItemExcluding(CHARACTERS, excludeIds, (c) => c.id);
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
