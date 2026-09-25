import { getPokemon, getPokemonNameList } from "./pokeApi.js";
import { compareGuess, getDailyPokemonId, getRandomPokemonId, todayKey, MAX_ATTEMPTS } from "./game.js";
import { translateType, stageLabel } from "./translations.js";
import {
  compareGuess as compareOnePieceGuess,
  getDailyCharacter,
  getRandomCharacter,
  getCharacterById,
  todayKey as opTodayKey,
  MAX_ATTEMPTS as OP_MAX_ATTEMPTS,
} from "./onePieceGame.js";
import { CHARACTERS as ONE_PIECE_CHARACTERS } from "./onePieceData.js";

const STORAGE_PREFIX = "pokedle:v1:";
const OP_STORAGE_PREFIX = "onepiece:v1:";

const els = {
  tabDaily: document.getElementById("tab-daily"),
  tabUnlimited: document.getElementById("tab-unlimited"),
  tabSilhouette: document.getElementById("tab-silhouette"),
  wordleSection: document.getElementById("wordle-mode"),
  silhouetteSection: document.getElementById("silhouette-mode"),
  revealSprite: document.getElementById("reveal-sprite"),
  revealPlaceholder: document.getElementById("reveal-placeholder"),
  revealName: document.getElementById("reveal-name"),
  form: document.getElementById("guess-form"),
  input: document.getElementById("guess-input"),
  suggestions: document.getElementById("suggestions-list"),
  submit: document.getElementById("guess-submit"),
  attemptsCounter: document.getElementById("attempts-counter"),
  feedback: document.getElementById("feedback-message"),
  tbody: document.getElementById("guesses-body"),
  endPanel: document.getElementById("end-panel"),
  endMessage: document.getElementById("end-message"),
  shareButton: document.getElementById("share-button"),
  newGameButton: document.getElementById("new-game-button"),
  statsTitle: document.querySelector("#stats-panel h2"),
  statPlayed: document.getElementById("stat-played"),
  statWins: document.getElementById("stat-wins"),
  statStreak: document.getElementById("stat-streak"),
  statMaxStreak: document.getElementById("stat-max-streak"),
  maxAttemptsLabel: document.getElementById("max-attempts-label"),
  silhouetteSprite: document.getElementById("silhouette-sprite"),
  silhouettePlaceholder: document.getElementById("silhouette-placeholder"),
  silhouetteName: document.getElementById("silhouette-name"),
  silhouetteForm: document.getElementById("silhouette-form"),
  silhouetteInput: document.getElementById("silhouette-input"),
  silhouetteSuggestions: document.getElementById("silhouette-suggestions"),
  silhouetteSubmit: document.getElementById("silhouette-submit"),
  silhouetteFeedback: document.getElementById("silhouette-feedback"),
  silhouetteRevealButton: document.getElementById("silhouette-reveal-button"),
  silhouetteNextButton: document.getElementById("silhouette-next-button"),
  silhouetteStatPlayed: document.getElementById("silhouette-stat-played"),
  silhouetteStatCorrect: document.getElementById("silhouette-stat-correct"),
  silhouetteStatStreak: document.getElementById("silhouette-stat-streak"),
  silhouetteStatMaxStreak: document.getElementById("silhouette-stat-max-streak"),
};

const franchiseEls = {
  franchisePokemon: document.getElementById("franchise-pokemon"),
  franchiseOnePiece: document.getElementById("franchise-onepiece"),
  pokemonApp: document.getElementById("pokemon-app"),
  onePieceApp: document.getElementById("onepiece-app"),
  pokemonFooterNote: document.getElementById("pokemon-footer-note"),
  onePieceFooterNote: document.getElementById("onepiece-footer-note"),
};

const opEls = {
  tabDaily: document.getElementById("op-tab-daily"),
  tabUnlimited: document.getElementById("op-tab-unlimited"),
  revealPlaceholder: document.getElementById("op-reveal-placeholder"),
  revealName: document.getElementById("op-reveal-name"),
  form: document.getElementById("op-guess-form"),
  input: document.getElementById("op-guess-input"),
  suggestions: document.getElementById("op-suggestions-list"),
  submit: document.getElementById("op-guess-submit"),
  attemptsCounter: document.getElementById("op-attempts-counter"),
  feedback: document.getElementById("op-feedback-message"),
  tbody: document.getElementById("op-guesses-body"),
  endPanel: document.getElementById("op-end-panel"),
  endMessage: document.getElementById("op-end-message"),
  shareButton: document.getElementById("op-share-button"),
  newGameButton: document.getElementById("op-new-game-button"),
  statsTitle: document.getElementById("op-stats-title"),
  statPlayed: document.getElementById("op-stat-played"),
  statWins: document.getElementById("op-stat-wins"),
  statStreak: document.getElementById("op-stat-streak"),
  statMaxStreak: document.getElementById("op-stat-max-streak"),
  maxAttemptsLabel: document.getElementById("op-max-attempts-label"),
};

els.maxAttemptsLabel.textContent = String(MAX_ATTEMPTS);
opEls.maxAttemptsLabel.textContent = String(OP_MAX_ATTEMPTS);

const opNameList = ONE_PIECE_CHARACTERS.map((c) => ({ id: c.id, name: c.name }));

let mode = "daily"; // "daily" | "unlimited"
let nameList = [];

function statsKey(forMode) {
  return `${STORAGE_PREFIX}${forMode}:stats`;
}

function loadStatsFor(forMode) {
  try {
    const raw = localStorage.getItem(statsKey(forMode));
    return raw ? JSON.parse(raw) : { played: 0, wins: 0, streak: 0, maxStreak: 0 };
  } catch {
    return { played: 0, wins: 0, streak: 0, maxStreak: 0 };
  }
}

function saveStatsFor(forMode, statsValue) {
  try {
    localStorage.setItem(statsKey(forMode), JSON.stringify(statsValue));
  } catch {
    /* ignorar */
  }
}

function storageKey(suffix) {
  return `${STORAGE_PREFIX}${mode}:${suffix}`;
}

function loadState() {
  try {
    const raw = localStorage.getItem(storageKey("state"));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(storageKey("state"), JSON.stringify(state));
  } catch {
    /* almacenamiento no disponible: la partida sigue en memoria */
  }
}

function loadStats() {
  return loadStatsFor(mode);
}

function saveStats(statsValue) {
  saveStatsFor(mode, statsValue);
}

function freshState() {
  const secretId = mode === "daily" ? getDailyPokemonId() : getRandomPokemonId();
  return {
    date: todayKey(),
    secretId,
    guessIds: [],
    finished: false,
    won: false,
  };
}

let state = null;
let stats = null;

function ensureState() {
  const stored = loadState();
  if (!stored) {
    state = freshState();
    saveState(state);
    return;
  }
  if (mode === "daily" && stored.date !== todayKey()) {
    // Nuevo día: nuevo secreto diario, se mantienen las estadísticas.
    state = freshState();
    saveState(state);
    return;
  }
  state = stored;
}

function setFeedback(msg) {
  els.feedback.textContent = msg ?? "";
}

function updateAttemptsCounter() {
  els.attemptsCounter.textContent = `Intento ${state.guessIds.length} / ${MAX_ATTEMPTS}`;
}

function setRevealed(pokemon) {
  els.revealPlaceholder.hidden = true;
  els.revealSprite.hidden = false;
  els.revealSprite.src = pokemon.sprite ?? "";
  els.revealSprite.classList.remove("silhouette");
  els.revealName.hidden = false;
  els.revealName.textContent = pokemon.nameEs;
}

function setHidden() {
  els.revealPlaceholder.hidden = false;
  els.revealSprite.hidden = true;
  els.revealSprite.classList.add("silhouette");
  els.revealName.hidden = true;
  els.revealName.textContent = "";
}

function renderStats() {
  els.statsTitle.textContent = mode === "daily" ? "Estadísticas (modo diario)" : "Estadísticas (modo ilimitado)";
  els.statPlayed.textContent = stats.played;
  els.statWins.textContent = stats.wins;
  els.statStreak.textContent = stats.streak;
  els.statMaxStreak.textContent = stats.maxStreak;
}

function formattedCategoricalCellHtml(result, formatValue) {
  return `<div class="cell status-${result.status}">${formatValue(result.value)}</div>`;
}

function typeCellHtml(result) {
  const label = result.value ? translateType(result.value) : "—";
  return `<div class="cell status-${result.status}">${label}</div>`;
}

function categoricalCellHtml(result) {
  return `<div class="cell status-${result.status}">${result.value ?? "Desconocido"}</div>`;
}

function renderGuessRow(result) {
  const tr = document.createElement("tr");
  const p = result.pokemon;
  tr.innerHTML = `
    <td>
      <div class="pokemon-cell">
        ${p.sprite ? `<img src="${p.sprite}" alt="${p.nameEs}" />` : ""}
        <span>${p.nameEs}</span>
      </div>
    </td>
    <td>${typeCellHtml(result.types[0])}</td>
    <td>${typeCellHtml(result.types[1])}</td>
    <td>${formattedCategoricalCellHtml(result.generation, (v) => `Gen ${v ?? "?"}`)}</td>
    <td>${formattedCategoricalCellHtml(result.stage, (v) => stageLabel(v))}</td>
    <td>${categoricalCellHtml(result.color)}</td>
  `;
  els.tbody.prepend(tr);
}

function buildShareText() {
  const rows = state.guessResultsCache ?? [];
  const grid = rows
    .map((r) => {
      const cellEmoji = (status) => (status === "green" ? "🟩" : status === "yellow" ? "🟨" : "🟥");
      return [...r.types, r.generation, r.stage, r.color].map((c) => cellEmoji(c.status)).join("");
    })
    .join("\n");
  const title = mode === "daily" ? `Pokédle diario ${todayKey()}` : "Pokédle (ilimitado)";
  const resultLine = state.won ? `${state.guessIds.length}/${MAX_ATTEMPTS}` : `X/${MAX_ATTEMPTS}`;
  return `${title} ${resultLine}\n${grid}`;
}

/** Solo pinta la pantalla de fin de partida; no toca estadísticas. */
function showGameOverUI(secret, won) {
  setRevealed(secret);
  els.endPanel.hidden = false;
  els.endMessage.textContent = won
    ? `¡Correcto! Era ${secret.nameEs}. Lo lograste en ${state.guessIds.length} intento(s).`
    : `Se acabaron los intentos. Era ${secret.nameEs}.`;
  els.shareButton.hidden = false;
  els.newGameButton.hidden = mode !== "unlimited";
  els.input.disabled = true;
  els.submit.disabled = true;
}

/** Actualiza las estadísticas guardadas. Llamar una única vez por partida. */
function recordGameResult(won) {
  stats.played += 1;
  if (won) {
    stats.wins += 1;
    stats.streak += 1;
    stats.maxStreak = Math.max(stats.maxStreak, stats.streak);
  } else {
    stats.streak = 0;
  }
  saveStats(stats);
  renderStats();
}

async function rebuildTableFromState() {
  els.tbody.innerHTML = "";
  state.guessResultsCache = [];
  if (state.guessIds.length === 0) return;
  const secret = await getPokemon(state.secretId);
  for (const id of state.guessIds) {
    const guess = await getPokemon(id);
    const result = compareGuess(secret, guess);
    state.guessResultsCache.push(result);
    renderGuessRow(result);
  }
}

async function refreshView() {
  setHidden();
  els.endPanel.hidden = true;
  els.shareButton.hidden = true;
  els.newGameButton.hidden = mode !== "unlimited";
  els.input.disabled = false;
  els.submit.disabled = false;
  els.input.value = "";
  setFeedback("");
  updateAttemptsCounter();
  renderStats();
  await rebuildTableFromState();

  if (state.finished) {
    const secret = await getPokemon(state.secretId);
    showGameOverUI(secret, state.won);
  }
}

async function handleGuessSubmit(event) {
  event.preventDefault();
  if (state.finished) return;

  const typed = els.input.value.trim().toLowerCase();
  const match = nameList.find((p) => p.name.toLowerCase() === typed);
  if (!match) {
    setFeedback("Elige un Pokémon válido de la lista de sugerencias.");
    return;
  }
  if (state.guessIds.includes(match.id)) {
    setFeedback("Ya has probado ese Pokémon.");
    return;
  }

  els.submit.disabled = true;
  setFeedback("Buscando datos del Pokémon...");
  try {
    const [secret, guess] = await Promise.all([getPokemon(state.secretId), getPokemon(match.id)]);
    const result = compareGuess(secret, guess);

    state.guessIds.push(match.id);
    state.guessResultsCache = state.guessResultsCache ?? [];
    state.guessResultsCache.push(result);
    saveState(state);

    renderGuessRow(result);
    updateAttemptsCounter();
    setFeedback("");
    els.input.value = "";
    wordleAutocomplete.hide();

    if (result.win || state.guessIds.length >= MAX_ATTEMPTS) {
      state.finished = true;
      state.won = result.win;
      saveState(state);
      recordGameResult(result.win);
      showGameOverUI(secret, result.win);
    } else {
      els.submit.disabled = false;
    }
  } catch (err) {
    console.error(err);
    setFeedback("No se pudo conectar con PokeAPI. Revisa tu conexión e inténtalo de nuevo.");
    els.submit.disabled = false;
  }
}

/**
 * Autocompletado reutilizable: filtra la lista de candidatos que devuelva
 * `getCandidates` mientras se escribe, y permite elegir con click o
 * teclado (flechas + Enter).
 */
function setupAutocomplete({ input, list, getCandidates, onSelect }) {
  let activeIndex = -1;

  function hide() {
    list.hidden = true;
    list.innerHTML = "";
    activeIndex = -1;
    input.setAttribute("aria-expanded", "false");
  }

  function render(matches) {
    if (matches.length === 0) {
      hide();
      return;
    }
    list.innerHTML = matches.map((p) => `<li>${p.name}</li>`).join("");
    list.hidden = false;
    activeIndex = -1;
    input.setAttribute("aria-expanded", "true");
  }

  function select(name) {
    input.value = name;
    hide();
    input.focus();
    onSelect?.(name);
  }

  input.addEventListener("input", () => {
    const value = input.value.trim().toLowerCase();
    if (!value) {
      hide();
      return;
    }
    const matches = getCandidates()
      .filter((p) => p.name.toLowerCase().includes(value))
      .slice(0, 8);
    render(matches);
  });

  input.addEventListener("keydown", (event) => {
    const items = [...list.querySelectorAll("li")];
    if (list.hidden || items.length === 0) return;

    if (event.key === "ArrowDown") {
      event.preventDefault();
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      select(items[activeIndex].textContent);
      return;
    } else {
      return;
    }
    items.forEach((li, i) => li.classList.toggle("is-active", i === activeIndex));
  });

  input.addEventListener("blur", () => setTimeout(hide, 150));
  list.addEventListener("mousedown", (event) => {
    const li = event.target.closest("li");
    if (li) select(li.textContent);
  });

  return { hide };
}

function setActiveTab(activeButton) {
  for (const btn of [els.tabDaily, els.tabUnlimited, els.tabSilhouette]) {
    const isActive = btn === activeButton;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-selected", String(isActive));
  }
}

async function switchMode(newMode) {
  mode = newMode;
  setActiveTab(mode === "daily" ? els.tabDaily : els.tabUnlimited);
  els.wordleSection.hidden = false;
  els.silhouetteSection.hidden = true;

  stats = loadStats();
  ensureState();
  await refreshView();
}

async function startNewUnlimitedGame() {
  state = freshState();
  saveState(state);
  await refreshView();
}

function copyShareText() {
  const text = buildShareText();
  navigator.clipboard?.writeText(text).then(
    () => setFeedback("Resultado copiado al portapapeles."),
    () => setFeedback(text),
  );
}

// ---- Modo Silueta: practicar el nombre de Pokémon aleatorios sin pistas ----

let silhouetteTarget = null;
let silhouetteFinished = false;
let silhouetteStats = { played: 0, wins: 0, streak: 0, maxStreak: 0 };

function normalizeGuessText(text) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function namesMatch(typed, pokemon) {
  const normalizedTyped = normalizeGuessText(typed);
  return (
    normalizedTyped === normalizeGuessText(pokemon.nameEn) || normalizedTyped === normalizeGuessText(pokemon.nameEs)
  );
}

function renderSilhouetteStats() {
  els.silhouetteStatPlayed.textContent = silhouetteStats.played;
  els.silhouetteStatCorrect.textContent = silhouetteStats.wins;
  els.silhouetteStatStreak.textContent = silhouetteStats.streak;
  els.silhouetteStatMaxStreak.textContent = silhouetteStats.maxStreak;
}

function recordSilhouetteResult(correct) {
  silhouetteStats.played += 1;
  if (correct) {
    silhouetteStats.wins += 1;
    silhouetteStats.streak += 1;
    silhouetteStats.maxStreak = Math.max(silhouetteStats.maxStreak, silhouetteStats.streak);
  } else {
    silhouetteStats.streak = 0;
  }
  saveStatsFor("silhouette", silhouetteStats);
  renderSilhouetteStats();
}

function revealSilhouette() {
  els.silhouetteSprite.hidden = false;
  els.silhouetteSprite.src = silhouetteTarget.sprite ?? "";
  els.silhouetteSprite.classList.remove("silhouette");
  els.silhouettePlaceholder.hidden = true;
  els.silhouetteName.hidden = false;
  els.silhouetteName.textContent = `${silhouetteTarget.nameEs} · Gen ${silhouetteTarget.generation ?? "?"}`;
  els.silhouetteInput.disabled = true;
  els.silhouetteSubmit.disabled = true;
  els.silhouetteRevealButton.hidden = true;
  els.silhouetteNextButton.hidden = false;
  silhouetteFinished = true;
}

function setSilhouetteFeedback(msg, success = false) {
  els.silhouetteFeedback.textContent = msg ?? "";
  els.silhouetteFeedback.classList.toggle("is-success", success);
}

async function loadNewSilhouette() {
  silhouetteFinished = false;
  setSilhouetteFeedback("Cargando un Pokémon nuevo...");
  els.silhouetteInput.value = "";
  els.silhouetteInput.disabled = true;
  els.silhouetteSubmit.disabled = true;
  els.silhouetteRevealButton.hidden = false;
  els.silhouetteNextButton.hidden = true;
  els.silhouetteName.hidden = true;
  els.silhouetteName.textContent = "";
  els.silhouetteSprite.hidden = true;
  els.silhouetteSprite.classList.add("silhouette");
  els.silhouettePlaceholder.hidden = false;

  try {
    const id = getRandomPokemonId(silhouetteTarget?.id ?? null);
    silhouetteTarget = await getPokemon(id);
    els.silhouettePlaceholder.hidden = true;
    els.silhouetteSprite.hidden = false;
    els.silhouetteSprite.src = silhouetteTarget.sprite ?? "";
    els.silhouetteInput.disabled = false;
    els.silhouetteSubmit.disabled = false;
    setSilhouetteFeedback("");
    els.silhouetteInput.focus();
  } catch (err) {
    console.error(err);
    setSilhouetteFeedback("No se pudo cargar un Pokémon nuevo. Revisa tu conexión.");
  }
}

function handleSilhouetteGuess(name) {
  if (silhouetteFinished || !silhouetteTarget) return;
  if (namesMatch(name, silhouetteTarget)) {
    recordSilhouetteResult(true);
    revealSilhouette();
    setSilhouetteFeedback("¡Correcto!", true);
  } else {
    setSilhouetteFeedback("No es correcto, sigue intentando.");
    els.silhouetteInput.value = "";
    els.silhouetteInput.focus();
  }
}

function handleSilhouetteSubmit(event) {
  event.preventDefault();
  const typed = els.silhouetteInput.value.trim();
  if (!typed) return;
  silhouetteAutocomplete.hide();
  handleSilhouetteGuess(typed);
}

function handleSilhouetteGiveUp() {
  if (silhouetteFinished || !silhouetteTarget) return;
  recordSilhouetteResult(false);
  revealSilhouette();
  setSilhouetteFeedback(`Era ${silhouetteTarget.nameEs} (Gen ${silhouetteTarget.generation ?? "?"}).`);
}

async function switchToSilhouette() {
  mode = "silhouette";
  setActiveTab(els.tabSilhouette);
  els.wordleSection.hidden = true;
  els.silhouetteSection.hidden = false;

  silhouetteStats = loadStatsFor("silhouette");
  renderSilhouetteStats();

  if (!silhouetteTarget) {
    await loadNewSilhouette();
  }
}

// ==== One Piece: mismo juego, datos locales en vez de PokeAPI ====

let opMode = "daily"; // "daily" | "unlimited"
let opState = null;
let opStats = null;

function opStorageKey(suffix) {
  return `${OP_STORAGE_PREFIX}${opMode}:${suffix}`;
}

function opLoadState() {
  try {
    const raw = localStorage.getItem(opStorageKey("state"));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function opSaveState(value) {
  try {
    localStorage.setItem(opStorageKey("state"), JSON.stringify(value));
  } catch {
    /* la partida sigue en memoria */
  }
}

function opStatsKey(forMode) {
  return `${OP_STORAGE_PREFIX}${forMode}:stats`;
}

function opLoadStatsFor(forMode) {
  try {
    const raw = localStorage.getItem(opStatsKey(forMode));
    return raw ? JSON.parse(raw) : { played: 0, wins: 0, streak: 0, maxStreak: 0 };
  } catch {
    return { played: 0, wins: 0, streak: 0, maxStreak: 0 };
  }
}

function opSaveStats(value) {
  try {
    localStorage.setItem(opStatsKey(opMode), JSON.stringify(value));
  } catch {
    /* ignorar */
  }
}

function opFreshState() {
  const secret = opMode === "daily" ? getDailyCharacter() : getRandomCharacter();
  return { date: opTodayKey(), secretId: secret.id, guessIds: [], finished: false, won: false };
}

function opEnsureState() {
  const stored = opLoadState();
  if (!stored || (opMode === "daily" && stored.date !== opTodayKey())) {
    opState = opFreshState();
    opSaveState(opState);
    return;
  }
  opState = stored;
}

function opSetFeedback(msg) {
  opEls.feedback.textContent = msg ?? "";
}

function opUpdateAttemptsCounter() {
  opEls.attemptsCounter.textContent = `Intento ${opState.guessIds.length} / ${OP_MAX_ATTEMPTS}`;
}

function opSetRevealed(character) {
  opEls.revealPlaceholder.hidden = true;
  opEls.revealName.hidden = false;
  opEls.revealName.textContent = character.name;
}

function opSetHidden() {
  opEls.revealPlaceholder.hidden = false;
  opEls.revealName.hidden = true;
  opEls.revealName.textContent = "";
}

function opRenderStats() {
  opEls.statsTitle.textContent = opMode === "daily" ? "Estadísticas (modo diario)" : "Estadísticas (modo ilimitado)";
  opEls.statPlayed.textContent = opStats.played;
  opEls.statWins.textContent = opStats.wins;
  opEls.statStreak.textContent = opStats.streak;
  opEls.statMaxStreak.textContent = opStats.maxStreak;
}

function opRenderGuessRow(result) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td><div class="pokemon-cell"><span>${result.character.name}</span></div></td>
    <td>${categoricalCellHtml(result.arc)}</td>
    <td>${categoricalCellHtml(result.affiliation)}</td>
    <td>${categoricalCellHtml(result.devilFruit)}</td>
    <td>${categoricalCellHtml(result.race)}</td>
  `;
  opEls.tbody.prepend(tr);
}

function opBuildShareText() {
  const rows = opState.guessResultsCache ?? [];
  const grid = rows
    .map((r) => {
      const cellEmoji = (status) => (status === "green" ? "🟩" : "🟥");
      return [r.arc, r.affiliation, r.devilFruit, r.race].map((c) => cellEmoji(c.status)).join("");
    })
    .join("\n");
  const title = opMode === "daily" ? `One Piecedle diario ${opTodayKey()}` : "One Piecedle (ilimitado)";
  const resultLine = opState.won ? `${opState.guessIds.length}/${OP_MAX_ATTEMPTS}` : `X/${OP_MAX_ATTEMPTS}`;
  return `${title} ${resultLine}\n${grid}`;
}

function opShowGameOverUI(secret, won) {
  opSetRevealed(secret);
  opEls.endPanel.hidden = false;
  opEls.endMessage.textContent = won
    ? `¡Correcto! Era ${secret.name}. Lo lograste en ${opState.guessIds.length} intento(s).`
    : `Se acabaron los intentos. Era ${secret.name}.`;
  opEls.shareButton.hidden = false;
  opEls.newGameButton.hidden = opMode !== "unlimited";
  opEls.input.disabled = true;
  opEls.submit.disabled = true;
}

function opRecordGameResult(won) {
  opStats.played += 1;
  if (won) {
    opStats.wins += 1;
    opStats.streak += 1;
    opStats.maxStreak = Math.max(opStats.maxStreak, opStats.streak);
  } else {
    opStats.streak = 0;
  }
  opSaveStats(opStats);
  opRenderStats();
}

function opRebuildTableFromState() {
  opEls.tbody.innerHTML = "";
  opState.guessResultsCache = [];
  if (opState.guessIds.length === 0) return;
  const secret = getCharacterById(opState.secretId);
  for (const id of opState.guessIds) {
    const guess = getCharacterById(id);
    const result = compareOnePieceGuess(secret, guess);
    opState.guessResultsCache.push(result);
    opRenderGuessRow(result);
  }
}

function opRefreshView() {
  opSetHidden();
  opEls.endPanel.hidden = true;
  opEls.shareButton.hidden = true;
  opEls.newGameButton.hidden = opMode !== "unlimited";
  opEls.input.disabled = false;
  opEls.submit.disabled = false;
  opEls.input.value = "";
  opSetFeedback("");
  opUpdateAttemptsCounter();
  opRenderStats();
  opRebuildTableFromState();

  if (opState.finished) {
    opShowGameOverUI(getCharacterById(opState.secretId), opState.won);
  }
}

function opHandleGuessSubmit(event) {
  event.preventDefault();
  if (opState.finished) return;

  const typed = opEls.input.value.trim().toLowerCase();
  const match = opNameList.find((p) => p.name.toLowerCase() === typed);
  if (!match) {
    opSetFeedback("Elige un personaje válido de la lista de sugerencias.");
    return;
  }
  if (opState.guessIds.includes(match.id)) {
    opSetFeedback("Ya has probado ese personaje.");
    return;
  }

  const secret = getCharacterById(opState.secretId);
  const guess = getCharacterById(match.id);
  const result = compareOnePieceGuess(secret, guess);

  opState.guessIds.push(match.id);
  opState.guessResultsCache = opState.guessResultsCache ?? [];
  opState.guessResultsCache.push(result);
  opSaveState(opState);

  opRenderGuessRow(result);
  opUpdateAttemptsCounter();
  opSetFeedback("");
  opEls.input.value = "";
  onePieceAutocomplete.hide();

  if (result.win || opState.guessIds.length >= OP_MAX_ATTEMPTS) {
    opState.finished = true;
    opState.won = result.win;
    opSaveState(opState);
    opRecordGameResult(result.win);
    opShowGameOverUI(secret, result.win);
  }
}

function opSetActiveTab(activeButton) {
  for (const btn of [opEls.tabDaily, opEls.tabUnlimited]) {
    const isActive = btn === activeButton;
    btn.classList.toggle("is-active", isActive);
    btn.setAttribute("aria-selected", String(isActive));
  }
}

function switchOnePieceMode(newMode) {
  opMode = newMode;
  opSetActiveTab(opMode === "daily" ? opEls.tabDaily : opEls.tabUnlimited);
  opStats = opLoadStatsFor(opMode);
  opEnsureState();
  opRefreshView();
}

function startNewOnePieceGame() {
  opState = opFreshState();
  opSaveState(opState);
  opRefreshView();
}

function copyOnePieceShareText() {
  const text = opBuildShareText();
  navigator.clipboard?.writeText(text).then(
    () => opSetFeedback("Resultado copiado al portapapeles."),
    () => opSetFeedback(text),
  );
}

// ==== Selector de franquicia (Pokémon / One Piece) ====

function switchFranchise(franchise) {
  const isPokemon = franchise === "pokemon";
  document.body.classList.toggle("theme-onepiece", !isPokemon);
  franchiseEls.franchisePokemon.classList.toggle("is-active", isPokemon);
  franchiseEls.franchisePokemon.setAttribute("aria-selected", String(isPokemon));
  franchiseEls.franchiseOnePiece.classList.toggle("is-active", !isPokemon);
  franchiseEls.franchiseOnePiece.setAttribute("aria-selected", String(!isPokemon));
  franchiseEls.pokemonApp.hidden = !isPokemon;
  franchiseEls.onePieceApp.hidden = isPokemon;
  franchiseEls.pokemonFooterNote.hidden = !isPokemon;
  franchiseEls.onePieceFooterNote.hidden = isPokemon;

  if (!isPokemon && !opState) {
    switchOnePieceMode("daily");
  }
}

let wordleAutocomplete;
let silhouetteAutocomplete;
let onePieceAutocomplete;

async function init() {
  els.form.addEventListener("submit", handleGuessSubmit);
  wordleAutocomplete = setupAutocomplete({ input: els.input, list: els.suggestions, getCandidates: () => nameList });

  els.silhouetteForm.addEventListener("submit", handleSilhouetteSubmit);
  silhouetteAutocomplete = setupAutocomplete({
    input: els.silhouetteInput,
    list: els.silhouetteSuggestions,
    getCandidates: () => nameList,
  });
  els.silhouetteRevealButton.addEventListener("click", handleSilhouetteGiveUp);
  els.silhouetteNextButton.addEventListener("click", loadNewSilhouette);

  els.tabDaily.addEventListener("click", () => switchMode("daily"));
  els.tabUnlimited.addEventListener("click", () => switchMode("unlimited"));
  els.tabSilhouette.addEventListener("click", () => switchToSilhouette());
  els.shareButton.addEventListener("click", copyShareText);
  els.newGameButton.addEventListener("click", startNewUnlimitedGame);

  opEls.form.addEventListener("submit", opHandleGuessSubmit);
  onePieceAutocomplete = setupAutocomplete({
    input: opEls.input,
    list: opEls.suggestions,
    getCandidates: () => opNameList,
  });
  opEls.tabDaily.addEventListener("click", () => switchOnePieceMode("daily"));
  opEls.tabUnlimited.addEventListener("click", () => switchOnePieceMode("unlimited"));
  opEls.shareButton.addEventListener("click", copyOnePieceShareText);
  opEls.newGameButton.addEventListener("click", startNewOnePieceGame);

  franchiseEls.franchisePokemon.addEventListener("click", () => switchFranchise("pokemon"));
  franchiseEls.franchiseOnePiece.addEventListener("click", () => switchFranchise("onepiece"));

  setFeedback("Cargando lista de Pokémon...");
  try {
    nameList = await getPokemonNameList();
    setFeedback("");
  } catch (err) {
    console.error(err);
    setFeedback("No se pudo cargar la lista de Pokémon desde PokeAPI. Revisa tu conexión.");
  }

  await switchMode("daily");
}

init();
