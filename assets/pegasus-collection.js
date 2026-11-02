/* One or two columns on phones (the switch in the facets toolbar, snippets/facets.liquid).
   The choice lives on <html data-pg-cols="1|2"> and in localStorage; assets/pegasus-collection.css turns it into widths.
   With no choice, the section's own "columns on mobile" setting applies. Listeners are on `document`, and a rAF-throttled
   observer on <main> re-applies the state after filtering or a section re-render, so nothing here needs re-initialising. */
(() => {
  if (window.__pgCollection) return;
  window.__pgCollection = true;

  const KEY = 'pg-cols';
  const root = document.documentElement;
  const phone = window.matchMedia('(max-width: 749px)');

  const read = () => {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return null;
    }
  };
  const write = (value) => {
    try {
      localStorage.setItem(KEY, value);
    } catch (e) {
      /* private mode: the choice lasts until the page is left */
    }
  };

  if (read() === '1' || read() === '2') root.dataset.pgCols = read();

  const isOneColumn = () => {
    if (root.dataset.pgCols) return root.dataset.pgCols === '1';
    const grid = document.getElementById('product-grid');
    return !!grid && grid.classList.contains('grid--1-col-tablet-down');
  };

  function refresh() {
    const one = isOneColumn();
    document.querySelectorAll('[data-pg-cols-toggle]').forEach((button) => {
      button.hidden = false;
      button.setAttribute('aria-pressed', String(one));
    });
    // The cards ask for half-width photos (their markup was written for two columns). In one column the photos are twice
    // as wide, so ask for the full width, or the grain of the wood is stretched and soft.
    document.querySelectorAll('#product-grid img[sizes]').forEach((img) => {
      if (!img.dataset.pgSizes) img.dataset.pgSizes = img.getAttribute('sizes');
      img.setAttribute('sizes', one && phone.matches ? 'calc(100vw - 35px)' : img.dataset.pgSizes);
    });
  }

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-pg-cols-toggle]');
    if (!button) return;
    root.dataset.pgCols = isOneColumn() ? '2' : '1';
    write(root.dataset.pgCols);
    refresh();
  });

  let queued = false;
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      refresh();
    });
  };

  phone.addEventListener('change', queue);
  new MutationObserver(queue).observe(document.getElementById('MainContent') || document.body, {
    childList: true,
    subtree: true,
  });
  refresh();
})();
