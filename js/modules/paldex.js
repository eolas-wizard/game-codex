export const paldexModule = {
  render() {
    return `
      <section class="page">
        <header class="page-header">
          <p class="page-kicker">Reference</p>
          <h1 class="page-title">Paldex</h1>
          <p class="page-description">
            Find the Pal that fits the decision in front of you. Full records
            and completion tracking will be added after the data model is verified.
          </p>
        </header>

        <section class="panel">
          <label class="search-field">
            <span aria-hidden="true">⌕</span>
            <input
              id="pal-search"
              type="search"
              placeholder="Search Pals"
              autocomplete="off"
              disabled
            >
          </label>

          <div class="filter-row" aria-label="Paldex filters">
            <button class="filter-chip" type="button" aria-pressed="true">All</button>
            <button class="filter-chip" type="button" aria-pressed="false">Favorites</button>
            <button class="filter-chip" type="button" aria-pressed="false">Recently viewed</button>
            <button class="filter-chip" type="button" aria-pressed="false">Incomplete</button>
          </div>
        </section>

        <section class="section empty-state">
          <div class="empty-state-symbol" aria-hidden="true">◉</div>
          <h2>The Paldex shell is ready</h2>
          <p>
            The complete Pal dataset has not been imported. This module avoids
            presenting another partial or inaccurate list.
          </p>
        </section>
      </section>
    `;
  }
};
