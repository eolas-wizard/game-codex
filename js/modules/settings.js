import { REGIONS } from "../core/regions.js";
import { getState, setMode, setActiveRegion } from "../core/state.js";

export const settingsModule = {
  render() {
    const state = getState();

    return `
      <section class="page">
        <header class="page-header">
          <p class="page-kicker">Journal configuration</p>
          <h1 class="page-title">Settings</h1>
          <p class="page-description">
            Light and dark control readability. The regional theme controls atmosphere.
          </p>
        </header>

        <div class="setting-list">
          <article class="setting-row">
            <div>
              <h3>Reading mode</h3>
              <p>Choose the underlying paper and ink treatment.</p>
            </div>
            <div class="segmented-control" aria-label="Reading mode">
              <button type="button" data-mode-choice="dark" aria-pressed="${state.mode === "dark"}">Dark</button>
              <button type="button" data-mode-choice="light" aria-pressed="${state.mode === "light"}">Light</button>
            </div>
          </article>

          <article class="setting-row">
            <div>
              <h3>Regional atmosphere</h3>
              <p>Choose the region that shapes the journal's visual identity.</p>
            </div>
            <select id="region-select" aria-label="Regional atmosphere">
              ${REGIONS.map((region) => `
                <option value="${region.id}" ${region.id === state.activeRegion ? "selected" : ""}>
                  ${region.name}
                </option>
              `).join("")}
            </select>
          </article>

          <article class="setting-row">
            <div>
              <h3>Offline shell</h3>
              <p>Core files are cached after the first successful visit.</p>
            </div>
            <strong>Enabled</strong>
          </article>

          <article class="setting-row">
            <div>
              <h3>Iteration</h3>
              <p>Journal shell, regional themes, notes, and bookmarks.</p>
            </div>
            <strong>02</strong>
          </article>
        </div>
      </section>
    `;
  },

  mount({ refresh }) {
    document.querySelectorAll("[data-mode-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        const mode = button.dataset.modeChoice;
        setMode(mode);
        document.documentElement.dataset.mode = mode;
        refresh();
      });
    });

    document.querySelector("#region-select")?.addEventListener("change", (event) => {
      const region = event.target.value;
      setActiveRegion(region);
      document.documentElement.dataset.region = region;
      document.dispatchEvent(new CustomEvent("eolas:region-changed"));
    });
  }
};
