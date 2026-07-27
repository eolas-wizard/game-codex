import { readValue, writeValue } from "./storage.js";

const DEFAULTS = {
  mode: "dark",
  activeRegion: "windswept-hills",
  expeditionDay: 1,
  notes: [
    {
      id: "welcome-note",
      title: "Begin your field journal",
      body: "Record a discovery, cave entrance, Alpha sighting, resource route, or anything worth returning to.",
      contextType: "region",
      contextId: "windswept-hills",
      region: "windswept-hills",
      createdAt: new Date().toISOString()
    }
  ],
  bookmarks: [
    {
      id: "starter-bookmark",
      title: "Windswept Hills",
      detail: "Current expedition region",
      type: "Region"
    }
  ],
  regionProgress: {}
};

const state = {
  mode: readValue("mode", DEFAULTS.mode),
  activeRegion: readValue("activeRegion", DEFAULTS.activeRegion),
  expeditionDay: readValue("expeditionDay", DEFAULTS.expeditionDay),
  notes: readValue("notes", DEFAULTS.notes),
  bookmarks: readValue("bookmarks", DEFAULTS.bookmarks),
  regionProgress: readValue("regionProgress", DEFAULTS.regionProgress)
};

export function getState() { return state; }

export function setMode(mode) {
  state.mode = mode === "light" ? "light" : "dark";
  writeValue("mode", state.mode);
}

export function setActiveRegion(region) {
  state.activeRegion = region;
  writeValue("activeRegion", region);
}

export function addNote(note) {
  state.notes.unshift(note);
  writeValue("notes", state.notes);
}

export function deleteNote(id) {
  state.notes = state.notes.filter((note) => note.id !== id);
  writeValue("notes", state.notes);
}

export function notesForContext(contextType, contextId) {
  return state.notes.filter((note) => {
    if (note.contextType && note.contextId) {
      return note.contextType === contextType && note.contextId === contextId;
    }
    return contextType === "region" && note.region === contextId;
  });
}

export function toggleRegionObjective(regionId, objectiveId) {
  const region = state.regionProgress[regionId] ?? {};
  region[objectiveId] = !region[objectiveId];
  state.regionProgress = { ...state.regionProgress, [regionId]: region };
  writeValue("regionProgress", state.regionProgress);
}

export function addBookmark(bookmark) {
  state.bookmarks.unshift(bookmark);
  writeValue("bookmarks", state.bookmarks);
}

export function deleteBookmark(id) {
  state.bookmarks = state.bookmarks.filter((bookmark) => bookmark.id !== id);
  writeValue("bookmarks", state.bookmarks);
}
