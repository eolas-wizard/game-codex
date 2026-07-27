import { createRouter } from "./core/router.js";
import { getState, setMode } from "./core/state.js";
import { homeModule } from "./modules/home.js";
import { regionsModule } from "./modules/regions.js";
import { paldexModule } from "./modules/paldex.js";
import { basesModule } from "./modules/bases.js";
import { settingsModule } from "./modules/settings.js";

const routes = {
  home: homeModule,
  regions: regionsModule,
  paldex: paldexModule,
  bases: basesModule,
  settings: settingsModule
};

const outlet = document.querySelector("#app");
const router = createRouter({
  routes,
  defaultRoute: "home",
  async onRender(route, module) {
    applyTheme();
    updateNavigation(route);
    outlet.innerHTML = await module.render();
    module.mount?.({
      navigate: router.navigate,
      refresh: () => router.renderCurrent()
    });
    outlet.focus({ preventScroll:true });
  }
});

document.querySelectorAll("[data-route]").forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    router.navigate(link.dataset.route);
  });
});

document.querySelector("#quick-theme")?.addEventListener("click", () => {
  const current = getState().mode;
  setMode(current === "dark" ? "light" : "dark");
  applyTheme();
  router.renderCurrent();
});

function applyTheme() {
  const state = getState();
  document.documentElement.dataset.mode = state.mode;
  document.documentElement.dataset.region = state.activeRegion;
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    "content",
    state.mode === "dark" ? "#111713" : "#f4f1e8"
  );
}

function updateNavigation(route) {
  document.querySelectorAll("[data-route]").forEach(link => {
    if (link.dataset.route === route) link.setAttribute("aria-current","page");
    else link.removeAttribute("aria-current");
  });
}

applyTheme();
router.start();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js"));
}
