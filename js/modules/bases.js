export const basesModule = {
  render() {
    return `
      <section class="page">
        <header class="page-header">
          <p class="page-kicker">Plan</p>
          <h1 class="page-title">Bases</h1>
          <p class="page-description">
            Build a useful network rather than keeping scattered notes about
            production, travel, resources, and Pal suitability.
          </p>
        </header>

        <section class="section empty-state">
          <div class="empty-state-symbol" aria-hidden="true">⌂</div>
          <h2>No bases saved</h2>
          <p>
            Base creation, saved locations, roles, and network planning will
            be introduced as their own focused module.
          </p>
        </section>
      </section>
    `;
  }
};
