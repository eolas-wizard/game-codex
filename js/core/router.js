const DEFAULT_ROUTE = "home";

export function createRouter({ routes, outlet, onRouteChange }) {
  function getRouteFromHash() {
    const candidate = window.location.hash.replace(/^#\/?/, "").trim();
    return candidate && routes[candidate] ? candidate : DEFAULT_ROUTE;
  }

  function navigate(route) {
    const safeRoute = routes[route] ? route : DEFAULT_ROUTE;
    const nextHash = `#/${safeRoute}`;

    if (window.location.hash === nextHash) {
      render(safeRoute);
      return;
    }

    window.location.hash = nextHash;
  }

  function render(route = getRouteFromHash()) {
    const module = routes[route] ?? routes[DEFAULT_ROUTE];
    outlet.innerHTML = module.render();
    module.mount?.({ navigate });
    onRouteChange?.(route);
    outlet.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  window.addEventListener("hashchange", () => render());

  return {
    start() {
      if (!window.location.hash) {
        navigate(DEFAULT_ROUTE);
      } else {
        render();
      }
    },
    navigate
  };
}
