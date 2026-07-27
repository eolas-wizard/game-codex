import { createRouter } from "./core/router.js";
import { getState } from "./core/state.js";
import { getRegion } from "./core/regions.js";
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

function applyAppearance() {
  const state = getState();
  document.documentElement.dataset.mode = state.mode;
  document.documentElement.dataset.region = state.activeRegion;
  updateRegionLabel();
}

function updateRegionLabel() {
  const label = document.querySelector("#active-region-label");
  if (!label) return;

  label.textContent = getRegion(getState().activeRegion).name;
}

function updateNavigation(route) {
  document.querySelectorAll("[data-route]").forEach((button) => {
    const current = button.dataset.route === route;

    if (current) {
      button.setAttribute("aria-current", "page");
    } else {
      button.removeAttribute("aria-current");
    }
  });
}

function bindNavigation(router) {
  document.querySelectorAll("[data-route]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      router.navigate(link.dataset.route);
    });
  });
}

function updateConnectionStatus() {
  const status = document.querySelector("#connection-status");
  if (!status) return;
  status.textContent = navigator.onLine ? "Online" : "Offline";
}

async function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  try {
    await navigator.serviceWorker.register("./service-worker.js");
  } catch (error) {
    console.error("Service worker registration failed.", error);
  }
}

function initialize() {
  applyAppearance();

  const router = createRouter({
    routes,
    outlet: document.querySelector("#app-view"),
    onRouteChange: updateNavigation
  });

  bindNavigation(router);
  router.start();

  updateConnectionStatus();
  window.addEventListener("online", updateConnectionStatus);
  window.addEventListener("offline", updateConnectionStatus);
  document.addEventListener("eolas:region-changed", updateRegionLabel);

  registerServiceWorker();
}

document.addEventListener("DOMContentLoaded", initialize);
