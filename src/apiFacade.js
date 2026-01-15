// apiFacade.js
// A "facade" is a single module that centralizes all HTTP calls.
// Components call facade methods instead of writing fetch logic everywhere.
// This keeps pages simpler and avoids repeating token/headers/error handling.

const BASE_URL = import.meta.env.VITE_API_URL; // set in .env, e.g. https://.../api

const LOGIN_ENDPOINT = "/auth/login";
const REGISTER_ENDPOINT = "/auth/register";

// -------------------- Helpers --------------------

// Converts non-OK HTTP responses into thrown Errors with a readable message.
// Also safely handles 204 responses and empty JSON bodies.
async function handleHttpErrors(res) {
  if (!res.ok) {
    // backend often returns {msg: "..."} or {message: "..."}
    const errorBody = await res.json().catch(() => ({}));
    const msg = errorBody?.msg || errorBody?.message || "Request failed";

    const err = new Error(msg);
    err.status = res.status;
    err.body = errorBody;
    throw err;
  }

  // 204 means "success but no body"
  if (res.status === 204) return null;

  // Some endpoints might return empty body even with 200
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

// Builds fetch options (method + headers + optional token + optional body)
function makeOptions(method, addToken, body) {
  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  // Add JWT token if requested and available
  if (addToken && loggedIn()) {
    opts.headers.Authorization = `Bearer ${getToken()}`;
  }

  if (body !== undefined) {
    opts.body = JSON.stringify(body);
  }

  return opts;
}

// -------------------- Token helpers --------------------

// Stores token in localStorage and notifies UI (TopBar) that auth changed
function setToken(token) {
  localStorage.setItem("token", token);
  window.dispatchEvent(new Event("auth-change"));
}

function getToken() {
  return localStorage.getItem("token");
}

function loggedIn() {
  return getToken() != null;
}

// Clears auth state + notifies UI
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("roles");
  localStorage.removeItem("username");
  window.dispatchEvent(new Event("auth-change"));
}

// -------------------- Auth --------------------

// Logs in user.
// If backend returns token + username, store them.
// Then UI updates because of "auth-change".
function login(username, password) {
  const options = makeOptions("POST", false, { username, password });

  return fetch(`${BASE_URL}${LOGIN_ENDPOINT}`, options)
    .then(handleHttpErrors)
    .then((res) => {
      if (res?.token) setToken(res.token);

      if (res?.username) {
        localStorage.setItem("username", res.username);
        window.dispatchEvent(new Event("auth-change"));
      }

      if (res?.roles) localStorage.setItem("roles", JSON.stringify(res.roles));
      return res;
    });
}

// Registers user, usually returns token too (depending on backend)
// You currently navigate to login after register, so token is optional.
function register(username, password) {
  const options = makeOptions("POST", false, { username, password });

  return fetch(`${BASE_URL}${REGISTER_ENDPOINT}`, options)
    .then(handleHttpErrors)
    .then((res) => {
      if (res?.token) setToken(res.token);
      if (res?.username) localStorage.setItem("username", res.username);
      if (res?.roles) localStorage.setItem("roles", JSON.stringify(res.roles));
      return res;
    });
}

// -------------------- Heroes --------------------
// Heroes endpoints require authentication so addToken = true

function getHeroes() {
  const options = makeOptions("GET", true);
  return fetch(`${BASE_URL}/heroes`, options).then(handleHttpErrors);
}

function getHero(id) {
  const options = makeOptions("GET", true);
  return fetch(`${BASE_URL}/heroes/${id}`, options).then(handleHttpErrors);
}

function createHero(hero) {
  const options = makeOptions("POST", true, hero);
  return fetch(`${BASE_URL}/heroes`, options).then(handleHttpErrors);
}

function updateHero(id, hero) {
  const options = makeOptions("PUT", true, hero);
  return fetch(`${BASE_URL}/heroes/${id}`, options).then(handleHttpErrors);
}

function deleteHero(id) {
  const options = makeOptions("DELETE", true);
  return fetch(`${BASE_URL}/heroes/${id}`, options).then(handleHttpErrors);
}

// -------------------- Monsters --------------------
// Monsters fetch is public in your setup, create/update/delete requires token.

function getMonsters() {
  const options = makeOptions("GET", false);
  return fetch(`${BASE_URL}/monsters`, options).then(handleHttpErrors);
}

function getMonster(id) {
  const options = makeOptions("GET", false);
  return fetch(`${BASE_URL}/monsters/${id}`, options).then(handleHttpErrors);
}

function createMonster(monster) {
  const options = makeOptions("POST", true, monster);
  return fetch(`${BASE_URL}/monsters`, options).then(handleHttpErrors);
}

function updateMonster(id, monster) {
  const options = makeOptions("PUT", true, monster);
  return fetch(`${BASE_URL}/monsters/${id}`, options).then(handleHttpErrors);
}

function deleteMonster(id) {
  const options = makeOptions("DELETE", true);
  return fetch(`${BASE_URL}/monsters/${id}`, options).then(handleHttpErrors);
}

function populateMonsters() {
  const options = makeOptions("GET", false);
  return fetch(`${BASE_URL}/monsters/populate`, options).then(handleHttpErrors);
}

// -------------------- Battles --------------------
// Start battle requires token (authenticated).
// Getting battle details currently uses addToken=false in your code —
// that’s fine if your backend allows it public.

function startBattle(heroId, monsterId) {
  const options = makeOptions("POST", true, { heroId, monsterId });
  return fetch(`${BASE_URL}/battles/start`, options).then(handleHttpErrors);
}

function getBattles() {
  const options = makeOptions("GET", false);
  return fetch(`${BASE_URL}/battles`, options).then(handleHttpErrors);
}

function getBattle(id) {
  const options = makeOptions("GET", false);
  return fetch(`${BASE_URL}/battles/${id}`, options).then(handleHttpErrors);
}

function getBattleDetails(id) {
  const options = makeOptions("GET", false);
  return fetch(`${BASE_URL}/battles/${id}/details`, options).then(handleHttpErrors);
}

// -------------------- Export facade --------------------
// This object is what your pages import.
// Keeps a clean API surface for the UI.
const facade = {
  makeOptions,
  handleHttpErrors,

  login,
  register,
  logout,
  loggedIn,
  setToken,
  getToken,

  getHeroes,
  getHero,
  createHero,
  updateHero,
  deleteHero,

  getMonsters,
  getMonster,
  createMonster,
  updateMonster,
  deleteMonster,
  populateMonsters,

  startBattle,
  getBattles,
  getBattle,
  getBattleDetails,
};

export default facade;
