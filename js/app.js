import { createRouter } from "./core/router.js";
import { readSetting } from "./core/storage.js";
import { homeModule } from "./modules/home.js";
import { paldexModule } from "./modules/paldex.js";
import { regionsModule } from "./modules/regions.js";
import { basesModule } from "./modules/bases.js";
import { settingsModule } from "./modules/settings.js";

const APP_VERSION = "0.1.0";

const routes = {
  home: homeModule,
  paldex: paldexModule,
  regions: regionsModule,
  bases: basesModule,
  settings: settingsModule
};

function applySavedTheme() {
  const savedTheme = readSetting("theme", "dark");
  document.documentElement.dataset.theme =
    savedTheme === "light" ? "light" : "dark";
}

function updateNavigation(route) {
  document.querySelectorAll("[data-route]").forEach((button) => {
    const isCurrent = button.dataset.route === route;

    if (button.classList.contains("nav-item")) {
      if (isCurrent) {
        button.setAttribute("aria-current", "page");
      } else {
        button.removeAttribute("aria-current");
      }
    }
  });
}

function bindGlobalNavigation(router) {
  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", () => router.navigate(button.dataset.route));
  });
}

function updateConnectionStatus() {
  const status = document.querySelector("#connection-status");
  if (!status) return;

  const online = navigator.onLine;
  status.dataset.online = String(online);
  status.querySelector("span:last-child").textContent =
    online ? "Online" : "Offline";
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
  applySavedTheme();

  const outlet = document.querySelector("#app-view");
  const router = createRouter({
    routes,
    outlet,
    onRouteChange: updateNavigation
  });

  bindGlobalNavigation(router);
  router.start();

  updateConnectionStatus();
  window.addEventListener("online", updateConnectionStatus);
  window.addEventListener("offline", updateConnectionStatus);

  registerServiceWorker();
  console.info(`Eolas Companion ${APP_VERSION} initialized.`);
}

document.addEventListener("DOMContentLoaded", initialize);
