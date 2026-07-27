const FALLBACK_ROUTE = "home";

export function createRouter({ routes, outlet, onRouteChange }) {
  function currentRoute() {
    const route = window.location.hash.replace(/^#\/?/, "").trim();
    return routes[route] ? route : FALLBACK_ROUTE;
  }

  function navigate(route) {
    const safeRoute = routes[route] ? route : FALLBACK_ROUTE;
    const hash = `#/${safeRoute}`;

    if (window.location.hash === hash) {
      render(safeRoute);
    } else {
      window.location.hash = hash;
    }
  }

  function render(route = currentRoute()) {
    const module = routes[route] ?? routes[FALLBACK_ROUTE];
    outlet.innerHTML = module.render();
    module.mount?.({ navigate, refresh: () => render(route) });
    onRouteChange?.(route);
    outlet.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  window.addEventListener("hashchange", () => render());

  return {
    navigate,
    start() {
      if (!window.location.hash) {
        navigate(FALLBACK_ROUTE);
      } else {
        render();
      }
    }
  };
}
