import { REGIONS, getRegion } from "../core/regions.js";
import {
  getState,
  setActiveRegion,
  addNote,
  deleteNote,
  notesForContext,
  toggleRegionObjective
} from "../core/state.js";

let regionGuides = null;

export const regionsModule = {
  async beforeRender() {
    if (regionGuides) return;
    const response = await fetch("./data/games/palworld/region-guides.json");
    if (!response.ok) throw new Error("Region guide data could not be loaded.");
    regionGuides = await response.json();
  },

  render() {
    const state = getState();
    const guide = regionGuides?.guides?.[state.activeRegion] ?? regionGuides?.guides?.["windswept-hills"];
    const appearance = getRegion(state.activeRegion);
    const progress = state.regionProgress[guide ? "windswept-hills" : state.activeRegion] ?? {};
    const completed = guide?.objectives.filter((item) => progress[item.id]).length ?? 0;
    const notes = notesForContext("region", "windswept-hills");

    return `
      <section class="page region-guide-page">
        <header class="page-header compact-header">
          <p class="page-kicker">World guide · playable field pack</p>
          <h1 class="page-title">${guide.name}</h1>
          <p class="page-description">${guide.summary}</p>
          <div class="guide-meta-line">
            <span>${guide.subtitle}</span>
            <span>Recommended level ${guide.levelRange}</span>
            <span>${completed}/${guide.objectives.length} objectives</span>
          </div>
        </header>

        <section class="region-theme-strip" aria-label="Regional atmosphere">
          <div>
            <strong>Journal atmosphere</strong>
            <span>${appearance.name}</span>
          </div>
          <select id="region-theme-select" aria-label="Change journal atmosphere">
            ${REGIONS.map((region) => `<option value="${region.id}" ${region.id === state.activeRegion ? "selected" : ""}>${region.name}</option>`).join("")}
          </select>
        </section>

        <nav class="chapter-jump" aria-label="Region guide sections">
          <a href="#fast-travel">Fast travel</a>
          <a href="#bosses">Alpha bosses</a>
          <a href="#resources">Resources</a>
          <a href="#objectives">Checklist</a>
          <a href="#region-notes">Notes</a>
        </nav>

        ${guideSection("fast-travel", "Fast travel", guide.fastTravel, markerRow)}
        ${guideSection("bosses", "Alpha bosses", guide.bosses, bossRow)}
        ${guideSection("resources", "Resource routes", guide.resources, resourceRow)}

        <section class="section guide-section" id="objectives">
          <div class="section-heading chapter-heading">
            <h2>Expedition checklist</h2>
            <small>${completed} complete</small>
          </div>
          <div class="objective-list">
            ${guide.objectives.map((objective) => `
              <label class="objective-row">
                <input type="checkbox" data-objective="${objective.id}" ${progress[objective.id] ? "checked" : ""}>
                <span>${objective.label}</span>
              </label>
            `).join("")}
          </div>
        </section>

        <section class="section guide-section" id="regional-pals">
          <div class="section-heading chapter-heading">
            <h2>Starter Pal targets</h2>
            <small>Quick capture list</small>
          </div>
          <div class="pal-chip-list">${guide.pals.map((pal) => `<span>${pal}</span>`).join("")}</div>
        </section>

        <section class="section guide-section" id="region-notes">
          <div class="section-heading chapter-heading">
            <h2>Windswept Hills notes</h2>
            <small>${notes.length} saved locally</small>
          </div>
          <form id="region-note-form" class="inline-note-form">
            <input name="title" maxlength="80" placeholder="Short title" required>
            <textarea name="body" maxlength="500" placeholder="Route, cave, spawn, base idea, or reminder" required></textarea>
            <button class="button button-primary" type="submit">Save note</button>
          </form>
          <div class="context-note-list">
            ${notes.length ? notes.map(noteCard).join("") : `<p class="muted-copy">No notes yet for this region.</p>`}
          </div>
        </section>
      </section>
    `;
  },

  mount({ refresh }) {
    document.querySelector("#region-theme-select")?.addEventListener("change", (event) => {
      const region = event.target.value;
      setActiveRegion(region);
      document.documentElement.dataset.region = region;
      document.dispatchEvent(new CustomEvent("eolas:region-changed"));
      refresh();
    });

    document.querySelectorAll("[data-objective]").forEach((input) => {
      input.addEventListener("change", () => {
        toggleRegionObjective("windswept-hills", input.dataset.objective);
        refresh();
      });
    });

    document.querySelector("#region-note-form")?.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      addNote({
        id: crypto.randomUUID?.() ?? String(Date.now()),
        title: String(data.get("title")).trim(),
        body: String(data.get("body")).trim(),
        contextType: "region",
        contextId: "windswept-hills",
        region: "windswept-hills",
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

function guideSection(id, title, items, renderItem) {
  return `<section class="section guide-section" id="${id}">
    <div class="section-heading chapter-heading"><h2>${title}</h2><small>${items.length} entries</small></div>
    <div class="guide-table">${items.map(renderItem).join("")}</div>
  </section>`;
}

function markerRow(item) {
  return `<article class="guide-table-row"><div><strong>${item.name}</strong><span>${item.coordinates}</span></div><p>${item.note}</p></article>`;
}
function bossRow(item) {
  return `<article class="guide-table-row"><div><strong>${item.name}</strong><span>Lv. ${item.level} · ${item.coordinates}</span></div><p>${item.note}</p></article>`;
}
function resourceRow(item) {
  return `<article class="guide-table-row"><div><strong>${item.name}</strong><span>${item.route}</span></div><p>${item.note}</p></article>`;
}
function noteCard(note) {
  const date = new Date(note.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" });
  return `<article class="context-note"><div><strong>${escapeHtml(note.title)}</strong><small>${date}</small></div><p>${escapeHtml(note.body)}</p><button type="button" class="text-button" data-delete-note="${note.id}">Delete</button></article>`;
}
function escapeHtml(value) {
  return String(value).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;");
}
