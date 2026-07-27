import { getState, addBookmark, deleteBookmark } from "../core/state.js";

export const paldexModule = {
  render() {
    const state = getState();
    const palBookmarks = state.bookmarks.filter((item) => item.type === "Pal");

    return `
      <section class="page">
        <header class="page-header">
          <p class="page-kicker">Field guide</p>
          <h1 class="page-title">Paldex</h1>
          <p class="page-description">
            The finished guide will organize every Pal around the questions
            players actually ask: where to find it, what it does, what it drops,
            how to use it, and what to remember.
          </p>
        </header>

        <form id="bookmark-form" class="editor-sheet">
          <label>
            Bookmark a Pal
            <input name="title" maxlength="80" placeholder="Mammorest" required>
          </label>
          <label>
            Why save it?
            <input name="detail" maxlength="140" placeholder="Alpha route, drops, breeding target…">
          </label>
          <button class="button button-primary" type="submit">Add bookmark</button>
        </form>

        <section class="section">
          <div class="section-heading">
            <h2>Pal bookmarks</h2>
            <small>${palBookmarks.length}</small>
          </div>
          <div class="bookmark-list">
            ${
              palBookmarks.length
                ? palBookmarks.map(bookmarkCard).join("")
                : emptyBookmarks()
            }
          </div>
        </section>

        <section class="section empty-page">
          <div class="empty-symbol" aria-hidden="true">◉</div>
          <h2>Verified Pal records are not loaded yet</h2>
          <p>
            The next Paldex iteration will establish the full record model before
            importing production data, so the guide does not repeat the partial-data problem.
          </p>
        </section>
      </section>
    `;
  },

  mount({ refresh }) {
    const form = document.querySelector("#bookmark-form");
    form?.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);

      addBookmark({
        id: crypto.randomUUID?.() ?? String(Date.now()),
        title: String(data.get("title")).trim(),
        detail: String(data.get("detail")).trim() || "Saved Pal reference",
        type: "Pal"
      });

      refresh();
    });

    document.querySelectorAll("[data-delete-bookmark]").forEach((button) => {
      button.addEventListener("click", () => {
        deleteBookmark(button.dataset.deleteBookmark);
        refresh();
      });
    });
  }
};

function bookmarkCard(item) {
  return `
    <article class="bookmark-card">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.detail)}</p>
      <div class="bookmark-meta"><span>${item.type}</span></div>
      <div class="inline-actions">
        <button class="button button-danger" type="button" data-delete-bookmark="${item.id}">
          Remove
        </button>
      </div>
    </article>
  `;
}

function emptyBookmarks() {
  return `
    <article class="empty-page">
      <div class="empty-symbol" aria-hidden="true">✦</div>
      <h2>No Pal bookmarks</h2>
      <p>Save a Pal you want to find, breed, capture, or research later.</p>
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
