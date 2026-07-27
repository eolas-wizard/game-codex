import { getState, addBookmark, deleteBookmark } from "../core/state.js";

export const basesModule = {
  render() {
    const state = getState();
    const bases = state.bookmarks.filter((item) => item.type === "Base");

    return `
      <section class="page">
        <header class="page-header">
          <p class="page-kicker">Expedition planning</p>
          <h1 class="page-title">Bases</h1>
          <p class="page-description">
            Save candidate locations and the reason each place matters before
            the full production and network planner arrives.
          </p>
        </header>

        <form id="base-form" class="editor-sheet">
          <label>
            Base name
            <input name="title" maxlength="80" placeholder="Coal outpost" required>
          </label>
          <label>
            Purpose or location
            <input name="detail" maxlength="140" placeholder="Coal, ore, sulfur, travel route…">
          </label>
          <button class="button button-primary" type="submit">Save base note</button>
        </form>

        <section class="section">
          <div class="section-heading">
            <h2>Base notes</h2>
            <small>${bases.length}</small>
          </div>
          <div class="bookmark-list">
            ${
              bases.length
                ? bases.map(baseCard).join("")
                : `
                  <article class="empty-page">
                    <div class="empty-symbol" aria-hidden="true">⌂</div>
                    <h2>No base notes</h2>
                    <p>Save a possible location, its purpose, or the resource route it supports.</p>
                  </article>
                `
            }
          </div>
        </section>
      </section>
    `;
  },

  mount({ refresh }) {
    const form = document.querySelector("#base-form");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);

      addBookmark({
        id: crypto.randomUUID?.() ?? String(Date.now()),
        title: String(data.get("title")).trim(),
        detail: String(data.get("detail")).trim() || "Saved base location",
        type: "Base"
      });

      refresh();
    });

    document.querySelectorAll("[data-delete-base]").forEach((button) => {
      button.addEventListener("click", () => {
        deleteBookmark(button.dataset.deleteBase);
        refresh();
      });
    });
  }
};

function baseCard(item) {
  return `
    <article class="bookmark-card">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.detail)}</p>
      <div class="bookmark-meta"><span>Base</span></div>
      <div class="inline-actions">
        <button class="button button-danger" type="button" data-delete-base="${item.id}">
          Remove
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
