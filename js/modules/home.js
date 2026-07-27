import { getState, addNote, deleteNote } from "../core/state.js";
import { getRegion } from "../core/regions.js";

export const homeModule = {
  render() {
    const state = getState();
    const region = getRegion(state.activeRegion);

    return `
      <section class="page">
        <article class="journal-cover">
          <p class="cover-overline">Palworld field journal</p>
          <h1 class="cover-title">Continue the expedition.</h1>
          <p class="cover-copy">
            Your notes, routes, discoveries, and guidebook stay together so
            research supports the journey instead of interrupting it.
          </p>
          <div class="cover-meta">
            <span>${region.name}</span>
            <span>Expedition day ${state.expeditionDay}</span>
            <span>${state.notes.length} field ${state.notes.length === 1 ? "note" : "notes"}</span>
          </div>
        </article>

        <section class="section">
          <div class="section-heading">
            <h2>Field notes</h2>
            <small>Saved on this device</small>
          </div>

          <form id="note-form" class="editor-sheet">
            <label>
              Note title
              <input name="title" maxlength="80" placeholder="Cave north of the ruins" required>
            </label>
            <label>
              Observation
              <textarea name="body" maxlength="500" placeholder="What did you discover or want to remember?" required></textarea>
            </label>
            <button class="button button-primary" type="submit">Add field note</button>
          </form>

          <div class="notes-list" style="margin-top: .8rem;">
            ${state.notes.map(noteCard).join("")}
          </div>
        </section>

        <section class="section">
          <div class="section-heading">
            <h2>Open the guidebook</h2>
          </div>
          <div class="journal-grid">
            ${guideCard("regions", "⌖", "World Guide", "Regions, landmarks, routes, dungeons, and discoveries.")}
            ${guideCard("paldex", "◉", "Paldex", "Where to find, uses, drops, skills, strategy, and notes.")}
            ${guideCard("bases", "⌂", "Base Notes", "Locations, production roles, resources, and network planning.")}
            ${guideCard("settings", "⚙", "Journal Settings", "Appearance, regional atmosphere, and build details.")}
          </div>
        </section>
      </section>
    `;
  },

  mount({ navigate, refresh }) {
    document.querySelectorAll("[data-go]").forEach((button) => {
      button.addEventListener("click", () => navigate(button.dataset.go));
    });

    const form = document.querySelector("#note-form");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const state = getState();

      addNote({
        id: crypto.randomUUID?.() ?? String(Date.now()),
        title: String(data.get("title")).trim(),
        body: String(data.get("body")).trim(),
        region: state.activeRegion,
        createdAt: new Date().toISOString()
      });

      refresh();
    });

    document.querySelectorAll("[data-delete-note]").forEach((button) => {
      button.addEventListener("click", () => {
        deleteNote(button.dataset.deleteNote);
        refresh();
      });
    });
  }
};

function guideCard(route, symbol, title, description) {
  return `
    <button class="guide-card" type="button" data-go="${route}">
      <span class="guide-symbol" aria-hidden="true">${symbol}</span>
      <span>
        <h3>${title}</h3>
        <p>${description}</p>
      </span>
      <span class="card-arrow" aria-hidden="true">›</span>
    </button>
  `;
}

function noteCard(note) {
  const region = getRegion(note.region);
  const date = new Date(note.createdAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric"
  });

  return `
    <article class="note-card">
      <h3>${escapeHtml(note.title)}</h3>
      <p>${escapeHtml(note.body)}</p>
      <div class="note-meta">
        <span>${region.name}</span>
        <span>${date}</span>
      </div>
      <div class="inline-actions">
        <button class="button button-danger" type="button" data-delete-note="${note.id}">
          Delete
        </button>
      </div>
    </article>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
