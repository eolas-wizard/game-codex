import { readSetting, writeSetting } from "../core/storage.js";

const THEME_KEY = "theme";

export const settingsModule = {
  render() {
    const theme = readSetting(THEME_KEY, "dark");

    return `
      <section class="page">
        <header class="page-header">
          <p class="page-kicker">Configure</p>
          <h1 class="page-title">Settings</h1>
          <p class="page-description">
            Control how Eolas looks and review the current build.
          </p>
        </header>

        <div class="setting-list">
          <article class="setting-row">
            <div>
              <h3>Appearance</h3>
              <p>Choose the visual mode saved on this device.</p>
            </div>
            <div class="segmented-control" aria-label="Appearance">
              <button
                type="button"
                data-theme-choice="dark"
                aria-pressed="${theme === "dark"}"
              >Dark</button>
              <button
                type="button"
                data-theme-choice="light"
                aria-pressed="${theme === "light"}"
              >Light</button>
            </div>
          </article>

          <article class="setting-row">
            <div>
              <h3>Offline support</h3>
              <p>The application shell is cached after the first successful visit.</p>
            </div>
            <strong>Enabled</strong>
          </article>

          <article class="setting-row">
            <div>
              <h3>Application version</h3>
              <p>Foundation and navigation module.</p>
            </div>
            <strong>0.1.0</strong>
          </article>

          <article class="setting-row">
            <div>
              <h3>Data version</h3>
              <p>No production Pal dataset has been loaded yet.</p>
            </div>
            <strong>0.1.0</strong>
          </article>
        </div>
      </section>
    `;
  },

  mount() {
    document.querySelectorAll("[data-theme-choice]").forEach((button) => {
      button.addEventListener("click", () => {
        const theme = button.dataset.themeChoice;
        document.documentElement.dataset.theme = theme;
        writeSetting(THEME_KEY, theme);

        document.querySelectorAll("[data-theme-choice]").forEach((choice) => {
          choice.setAttribute(
            "aria-pressed",
            String(choice.dataset.themeChoice === theme)
          );
        });
      });
    });
  }
};
