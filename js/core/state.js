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
  ]
};

const state = {
  mode: readValue("mode", DEFAULTS.mode),
  activeRegion: readValue("activeRegion", DEFAULTS.activeRegion),
  expeditionDay: readValue("expeditionDay", DEFAULTS.expeditionDay),
  notes: readValue("notes", DEFAULTS.notes),
  bookmarks: readValue("bookmarks", DEFAULTS.bookmarks)
};

export function getState() {
  return state;
}

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

export function addBookmark(bookmark) {
  state.bookmarks.unshift(bookmark);
  writeValue("bookmarks", state.bookmarks);
}

export function deleteBookmark(id) {
  state.bookmarks = state.bookmarks.filter((bookmark) => bookmark.id !== id);
  writeValue("bookmarks", state.bookmarks);
}
