/* Smooth wheel scrolling with Lenis (assets/lenis.min.js, MIT). Loaded only when the theme setting is on.
   It is left off for visitors who prefer reduced motion, in the theme editor, and when motion is off in the theme
   settings. Touch scrolling stays native (Lenis smooths the mouse wheel only by default), and keyboard scrolling and
   anchors are untouched, so focus handling such as the skip link keeps working. The scroll position is still the real
   one (Lenis calls scrollTo each frame), so every scroll listener, `position: sticky` and CSS scroll-driven animation
   in the theme behaves as before. */
(function () {
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var designMode = !!(window.Shopify && window.Shopify.designMode);
  if (typeof window.Lenis !== 'function') return;
  if (reduced.matches || designMode) return;
  if (root.getAttribute('data-pg-smooth') === 'off' || root.getAttribute('data-pg-motion') === 'off') return;

  // A wheel over something that scrolls by itself (a drawer, the search results, a long list, a textarea) must scroll
  // that, not the page. Lenis calls this for each node in the event's path.
  function scrollsItself(node) {
    if (!(node instanceof HTMLElement) || node === root || node === document.body) return false;
    var overflow = window.getComputedStyle(node).overflowY;
    return (overflow === 'auto' || overflow === 'scroll') && node.scrollHeight > node.clientHeight + 1;
  }

  var lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true, anchors: false, autoRaf: true, prevent: scrollsItself });
  window.Pegasus = window.Pegasus || {};
  window.Pegasus.lenis = lenis;

  // Craft locks the page by styling <body> overflow (classes such as overflow-hidden) while a drawer, modal or menu is
  // open. Reading the computed style follows its media queries too.
  function syncLock() {
    if (window.getComputedStyle(document.body).overflow === 'hidden') lenis.stop();
    else lenis.start();
  }
  new MutationObserver(syncLock).observe(document.body, { attributes: true, attributeFilter: ['class', 'style'] });
  syncLock();

  reduced.addEventListener('change', function () {
    if (!reduced.matches) return;
    lenis.destroy();
    delete window.Pegasus.lenis;
  });
})();
