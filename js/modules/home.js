export const homeModule = {
  render() {
    return `
      <section class="page">
        <article class="hero-card">
          <p class="hero-eyebrow">Palworld companion</p>
          <h1 class="hero-title">Play more.<br>Research less.</h1>
          <p class="hero-copy">
            Eolas keeps the decisions, discoveries, and planning tools you
            need close at hand—without turning your play session into homework.
          </p>
          <div class="hero-actions">
            <button class="button button-primary" type="button" data-go="paldex">
              Continue journey
            </button>
            <button class="button" type="button" data-go="regions">
              Explore regions
            </button>
          </div>
        </article>

        <section class="section">
          <div class="section-heading">
            <h2>Your journey</h2>
            <p>Local to this device</p>
          </div>
          <div class="stats-grid">
            <article class="stat-card">
              <h3>Paldex</h3>
              <p class="stat-value">0%</p>
              <p class="stat-caption">Completion tracking arrives in a later module.</p>
            </article>
            <article class="stat-card">
              <h3>Regions</h3>
              <p class="stat-value">—</p>
              <p class="stat-caption">Regional discovery data is not loaded yet.</p>
            </article>
            <article class="stat-card">
              <h3>Bases</h3>
              <p class="stat-value">0</p>
              <p class="stat-caption">No base plans saved on this device.</p>
            </article>
            <article class="stat-card">
              <h3>Status</h3>
              <p class="stat-value">Ready</p>
              <p class="stat-caption">Foundation module is active.</p>
            </article>
          </div>
        </section>

        <section class="section">
          <div class="section-heading">
            <h2>Choose your next task</h2>
          </div>
          <div class="card-grid">
            ${actionCard("paldex", "◉", "Find a Pal", "Search, browse, and eventually track Pal discoveries.")}
            ${actionCard("regions", "◇", "Explore a Region", "Open the regional layer for location-based decisions.")}
            ${actionCard("bases", "⌂", "Plan a Base", "Prepare a base network and record useful locations.")}
            ${actionCard("settings", "⚙", "Adjust Eolas", "Choose appearance and review app information.")}
          </div>
        </section>
      </section>
    `;
  },

  mount({ navigate }) {
    document.querySelectorAll("[data-go]").forEach((button) => {
      button.addEventListener("click", () => navigate(button.dataset.go));
    });
  }
};

function actionCard(route, icon, title, description) {
  return `
    <button class="action-card" type="button" data-go="${route}">
      <span class="action-icon" aria-hidden="true">${icon}</span>
      <span>
        <h3>${title}</h3>
        <p>${description}</p>
      </span>
      <span class="action-arrow" aria-hidden="true">›</span>
    </button>
  `;
}
