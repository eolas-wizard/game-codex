export function createRouter({ routes, defaultRoute, onRender }) {
  let currentRoute = defaultRoute;
  async function render(route) {
    const safeRoute = routes[route] ? route : defaultRoute;
    currentRoute = safeRoute;
    const module = routes[safeRoute];
    await onRender(safeRoute, {
      ...module,
      render: async () => module.render()
    });
  }
  async function renderCurrent() { await render(currentRoute); }
  function navigate(route) {
    const next = routes[route] ? route : defaultRoute;
    if (location.hash !== `#/${next}`) location.hash = `#/${next}`;
    else render(next);
  }
  function routeFromHash() { return location.hash.replace(/^#\/?/,"") || defaultRoute; }
  function start() {
    window.addEventListener("hashchange",()=>render(routeFromHash()));
    render(routeFromHash());
  }
  return { start, navigate, renderCurrent };
}
