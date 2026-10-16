// Utilidades de aleatoriedad compartidas por Pokémon y One Piece: el orden
// fijo del reto diario y el sorteo sin repeticiones de los modos ilimitados.

const DAY_MS = 24 * 60 * 60 * 1000;

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Generador pseudoaleatorio con semilla (mulberry32): mismos números en todos los navegadores. */
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Copia barajada (Fisher-Yates) de `items`, siempre igual para la misma semilla. */
function seededShuffle(items, seed) {
  const rand = mulberry32(seed);
  const result = items.slice();
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Elemento del día: `items` se baraja una vez con una semilla fija (`salt`) y
 * cada día UTC avanza una posición en ese orden. Así no se repite ninguno
 * hasta haber pasado por todos.
 */
export function dailyItem(items, salt, date = new Date()) {
  const order = seededShuffle(items, hashString(salt));
  const day = Math.floor(date.getTime() / DAY_MS);
  return order[day % order.length];
}

/** Elemento al azar de `items` cuyo `getId` no esté en `excludeIds`, o null si no queda ninguno. */
export function randomItemExcluding(items, excludeIds = [], getId = (item) => item) {
  const excluded = new Set(excludeIds);
  const candidates = items.filter((item) => !excluded.has(getId(item)));
  if (candidates.length === 0) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}
