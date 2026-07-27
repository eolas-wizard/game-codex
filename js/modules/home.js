import { getState, addNote, deleteNote } from "../core/state.js";
import { getRegion } from "../core/regions.js";

export const homeModule = {
  render() {
    const state = getState();
    const region = getRegion(state.activeRegion);
    const palBookmarks = state.bookmarks.filter((item) => item.type === "Pal");
    const baseBookmarks = state.bookmarks.filter((item) => item.type === "Base");

    return `
      <section class="page">
        <article class="journal-cover">
          <p class="cover-overline">Eolas Companion · Palworld Field Journal</p>
          <h1 class="cover-title">Resume your expedition.</h1>
          <p class="cover-copy">
            Pick up where you left off, review the region, and keep useful
            discoveries close without turning the journal into a dashboard.
          </p>
          <div class="cover-meta">
            <span>${region.name}</span>
            <span>Expedition day ${state.expeditionDay}</span>
            <span>${state.notes.length} field notes</span>
          </div>
          <div class="cover-actions">
            <button class="button button-primary" type="button" data-go="regions">Open current region</button>
            <button class="button" type="button" data-go="paldex">Browse Paldex</button>
          </div>
        </article>

        <section class="section">
          <div class="section-heading chapter-heading">
            <h2>Expedition at a glance</h2>
            <small>Stored on this device</small>
          </div>
          <div class="expedition-grid">
            ${statusCard("⌖", "Current Region", region.name, "Continue world guide", "regions")}
            ${statusCard("✎", "Field Notes", String(state.notes.length), "Review discoveries", "home")}
            ${statusCard("◉", "Pal Bookmarks", String(palBookmarks.length), "Open saved Pals", "paldex")}
            ${statusCard("⌂", "Base Plans", String(baseBookmarks.length), "Review locations", "bases")}
          </div>
        </section>

        <section class="section">
          <div class="section-heading chapter-heading">
            <h2>World guide</h2>
            <small>Choose what you need</small>
          </div>
          <div class="journal-grid">
            ${guideCard("regions", "⌖", "Regions", "Landmarks, routes, dungeons, resources, bosses, and regional progress.")}
            ${guideCard("paldex", "◉", "Paldex", "Habitats, drops, work suitability, combat use, breeding, and personal notes.")}
            ${guideCard("bases", "⌂", "Base Planner", "Candidate locations, resource purpose, production roles, and network ideas.")}
            ${guideCard("settings", "⚙", "Appearance", "Switch reading mode and regional atmosphere independently.")}
          </div>
        </section>

        <section class="section">
          <div class="section-heading chapter-heading">
            <h2>Featured field references</h2>
            <small>Starter guide structure</small>
          </div>
          <div class="reference-grid">
            ${referenceCard("Getting Started", "First shelter, early technology, food, and safe exploration priorities.", ["Early Game", "Checklist"])}
            ${referenceCard("Resource Routes", "Keep notes for ore, coal, sulfur, quartz, oil, and reliable fast-travel loops.", ["World", "Resources"])}
            ${referenceCard("Pal Research", "Compare habitat, work suitability, drops, partner skills, and capture plans.", ["Paldex", "Research"])}
          </div>
        </section>

        <section class="section">
          <div class="section-heading chapter-heading">
            <h2>Field notes</h2>
            <small>Saved locally</small>
          </div>
          <form id="note-form" class="editor-sheet">
            <label>Note title
              <input name="title" maxlength="80" placeholder="Cave north of the ruins" required>
            </label>
            <label>Observation
              <textarea name="body" maxlength="500" placeholder="What did you discover or want to remember?" required></textarea>
            </label>
            <button class="button button-primary" type="submit">Add field note</button>
          </form>
          <div class="notes-list notes-spaced">
            ${state.notes.map(noteCard).join("")}
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

function statusCard(symbol, label, value, action, route) {
  return `<button class="status-card" type="button" data-go="${route}">
    <span class="status-symbol" aria-hidden="true">${symbol}</span>
    <span><small>${label}</small><strong>${value}</strong><em>${action}</em></span>
  </button>`;
}

function guideCard(route, symbol, title, description) {
  return `<button class="guide-card" type="button" data-go="${route}">
    <span class="guide-symbol" aria-hidden="true">${symbol}</span>
    <span><h3>${title}</h3><p>${description}</p></span>
    <span class="card-arrow" aria-hidden="true">›</span>
  </button>`;
}

function referenceCard(title, description, tags) {
  return `<article class="reference-card">
    <p class="reference-label">Guidebook entry</p>
    <h3>${title}</h3>
    <p>${description}</p>
    <div class="tag-row">${tags.map(tag => `<span>${tag}</span>`).join("")}</div>
  </article>`;
}

function noteCard(note) {
  const region = getRegion(note.region);
  const date = new Date(note.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return `<article class="note-card">
    <h3>${escapeHtml(note.title)}</h3>
    <p>${escapeHtml(note.body)}</p>
    <div class="note-meta"><span>${region.name}</span><span>${date}</span></div>
    <div class="inline-actions"><button class="button button-danger" type="button" data-delete-note="${note.id}">Delete</button></div>
  </article>`;
}

function escapeHtml(value) {
  return String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
}
