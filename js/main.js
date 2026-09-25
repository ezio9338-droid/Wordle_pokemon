import { getPokemon, getPokemonNameList } from "./pokeApi.js";
import { compareGuess, getDailyPokemonId, getRandomPokemonId, todayKey, MAX_ATTEMPTS } from "./game.js";
import { translateType, stageLabel } from "./translations.js";

const STORAGE_PREFIX = "pokedle:v1:";

const els = {
  tabDaily: document.getElementById("tab-daily"),
  tabUnlimited: document.getElementById("tab-unlimited"),
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
};

els.maxAttemptsLabel.textContent = String(MAX_ATTEMPTS);

let mode = "daily"; // "daily" | "unlimited"
let nameList = [];
let activeSuggestionIndex = -1;

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
  try {
    const raw = localStorage.getItem(storageKey("stats"));
    return raw ? JSON.parse(raw) : { played: 0, wins: 0, streak: 0, maxStreak: 0 };
  } catch {
    return { played: 0, wins: 0, streak: 0, maxStreak: 0 };
  }
}

function saveStats(stats) {
  try {
    localStorage.setItem(storageKey("stats"), JSON.stringify(stats));
  } catch {
    /* ignorar */
  }
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

function ordinalCellHtml(result, formatValue) {
  const arrow = result.status === "red" ? `<span class="arrow">${result.direction === "up" ? "▲" : "▼"}</span>` : "";
  return `<div class="cell status-${result.status}">${formatValue(result.value)}${arrow}</div>`;
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
    <td>${ordinalCellHtml(result.generation, (v) => `Gen ${v ?? "?"}`)}</td>
    <td>${ordinalCellHtml(result.stage, (v) => stageLabel(v))}</td>
    <td>${categoricalCellHtml(result.color)}</td>
    <td>${categoricalCellHtml(result.habitat)}</td>
    <td>${categoricalCellHtml(result.category)}</td>
  `;
  els.tbody.appendChild(tr);
}

function buildShareText() {
  const rows = state.guessResultsCache ?? [];
  const grid = rows
    .map((r) => {
      const cellEmoji = (status) => (status === "green" ? "🟩" : status === "yellow" ? "🟨" : "🟥");
      return [...r.types, r.generation, r.stage, r.color, r.habitat, r.category].map((c) => cellEmoji(c.status)).join("");
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
    hideSuggestions();

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

function hideSuggestions() {
  els.suggestions.hidden = true;
  els.suggestions.innerHTML = "";
  activeSuggestionIndex = -1;
  els.input.setAttribute("aria-expanded", "false");
}

function renderSuggestions(matches) {
  if (matches.length === 0) {
    hideSuggestions();
    return;
  }
  els.suggestions.innerHTML = matches
    .map((p, i) => `<li data-id="${p.id}" data-index="${i}">${p.name}</li>`)
    .join("");
  els.suggestions.hidden = false;
  activeSuggestionIndex = -1;
  els.input.setAttribute("aria-expanded", "true");
}

function handleInputChange() {
  const value = els.input.value.trim().toLowerCase();
  if (!value) {
    hideSuggestions();
    return;
  }
  const matches = nameList.filter((p) => p.name.toLowerCase().includes(value)).slice(0, 8);
  renderSuggestions(matches);
}

function selectSuggestion(name) {
  els.input.value = name;
  hideSuggestions();
  els.input.focus();
}

function handleSuggestionKeydown(event) {
  const items = [...els.suggestions.querySelectorAll("li")];
  if (els.suggestions.hidden || items.length === 0) return;

  if (event.key === "ArrowDown") {
    event.preventDefault();
    activeSuggestionIndex = Math.min(activeSuggestionIndex + 1, items.length - 1);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    activeSuggestionIndex = Math.max(activeSuggestionIndex - 1, 0);
  } else if (event.key === "Enter" && activeSuggestionIndex >= 0) {
    event.preventDefault();
    selectSuggestion(items[activeSuggestionIndex].textContent);
    return;
  } else {
    return;
  }
  items.forEach((li, i) => li.classList.toggle("is-active", i === activeSuggestionIndex));
}

async function switchMode(newMode) {
  mode = newMode;
  els.tabDaily.classList.toggle("is-active", mode === "daily");
  els.tabDaily.setAttribute("aria-selected", String(mode === "daily"));
  els.tabUnlimited.classList.toggle("is-active", mode === "unlimited");
  els.tabUnlimited.setAttribute("aria-selected", String(mode === "unlimited"));

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

async function init() {
  els.form.addEventListener("submit", handleGuessSubmit);
  els.input.addEventListener("input", handleInputChange);
  els.input.addEventListener("keydown", handleSuggestionKeydown);
  els.input.addEventListener("blur", () => setTimeout(hideSuggestions, 150));
  els.suggestions.addEventListener("mousedown", (e) => {
    const li = e.target.closest("li");
    if (li) selectSuggestion(li.textContent);
  });
  els.tabDaily.addEventListener("click", () => switchMode("daily"));
  els.tabUnlimited.addEventListener("click", () => switchMode("unlimited"));
  els.shareButton.addEventListener("click", copyShareText);
  els.newGameButton.addEventListener("click", startNewUnlimitedGame);

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
