import { REGIONS } from "../core/regions.js";
import { getState, setActiveRegion } from "../core/state.js";

export const regionsModule = {
  render() {
    const state = getState();

    return `
      <section class="page">
        <header class="page-header">
          <p class="page-kicker">World guide</p>
          <h1 class="page-title">Regions</h1>
          <p class="page-description">
            Choose the expedition region that should shape the journal.
            Regional identity changes the atmosphere without replacing the content.
          </p>
        </header>

        <div class="region-list">
          ${REGIONS.map((region) => regionCard(region, state.activeRegion)).join("")}
        </div>

        <section class="section empty-page">
          <div class="empty-symbol" aria-hidden="true">⌖</div>
          <h2>Regional guide layers come next</h2>
          <p>
            Landmarks, dungeons, fast travel, resources, bosses, discoveries,
            and regional completion will attach to this world-first structure.
          </p>
        </section>
      </section>
    `;
  },

  mount({ refresh }) {
    document.querySelectorAll("[data-region-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        const region = button.dataset.regionChoice;
        setActiveRegion(region);
        document.documentElement.dataset.region = region;
        document.dispatchEvent(new CustomEvent("eolas:region-changed"));
        refresh();
      });
    });
  }
};

function regionCard(region, activeRegion) {
  return `
    <button
      class="region-card"
      type="button"
      data-region-choice="${region.id}"
      aria-pressed="${region.id === activeRegion}"
    >
      <span
        class="region-swatch"
        style="--swatch-a:${region.swatchA};--swatch-b:${region.swatchB};"
        aria-hidden="true"
      >${region.mark}</span>
      <span>
        <h3>${region.name}</h3>
        <p>${region.description}</p>
      </span>
      <span class="card-arrow" aria-hidden="true">›</span>
    </button>
  `;
}
