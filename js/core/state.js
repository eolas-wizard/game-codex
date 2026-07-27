import { loadState, saveState } from "./storage.js";

const DEFAULT_STATE = {
  mode: "dark",
  activeRegion: "windswept-hills",
  expeditionDay: 1,
  notes: [],
  bookmarks: [],
  completed: {}
};

let state = normalize(loadState(DEFAULT_STATE));

export function getState() { return structuredClone(state); }

export function setMode(mode) {
  state.mode = mode === "light" ? "light" : "dark";
  persist();
}
export function setActiveRegion(region) {
  state.activeRegion = region;
  persist();
}
export function addNote(note) {
  state.notes.unshift({ contextType:"general", contextId:"general", ...note });
  persist();
}
export function deleteNote(id) {
  state.notes = state.notes.filter(n => n.id !== id);
  persist();
}
export function addBookmark(item) {
  state.bookmarks.unshift(item);
  persist();
}
export function deleteBookmark(id) {
  state.bookmarks = state.bookmarks.filter(item => item.id !== id);
  persist();
}
export function toggleCompleted(id) {
  state.completed[id] = !state.completed[id];
  persist();
}
function persist() { saveState(state); }
function normalize(value) {
  return {
    ...DEFAULT_STATE,
    ...(value || {}),
    notes: Array.isArray(value?.notes) ? value.notes : [],
    bookmarks: Array.isArray(value?.bookmarks) ? value.bookmarks : [],
    completed: value?.completed && typeof value.completed === "object" ? value.completed : {}
  };
}
