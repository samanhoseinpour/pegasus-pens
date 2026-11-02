/* Pegasus Pens motion layer. No dependencies.
 * Off when: reduced motion is requested, the theme editor is open, or the merchant disables motion.
 * Content already on screen is never hidden, so nothing flashes. */
(function () {
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var designMode = !!(window.Shopify && window.Shopify.designMode);
  var enabled =
    root.getAttribute('data-pg-motion') !== 'off' && !reduced.matches && !designMode && 'IntersectionObserver' in window;

  var WIPE = '[data-pg-wipe], .banner__media, .image-with-text__media';
  var RISE =
    '[data-pg-rise], .banner__heading, .image-with-text__heading, .rich-text__heading, .collapsible-content__heading, .title--primary';

  var io = enabled
    ? new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.remove('pg-pending');
            entry.target.classList.add('pg-in');
            io.unobserve(entry.target);
          });
        },
        { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
      )
    : null;

  function splitWords(el) {
    if (el.dataset.pgSplit || el.children.length) return;
    var text = el.textContent.trim();
    if (!text) return;
    var frag = document.createDocumentFragment();
    var words = text.split(/\s+/);
    words.forEach(function (word, i) {
      var outer = document.createElement('span');
      var inner = document.createElement('span');
      outer.className = 'pg-w';
      outer.setAttribute('aria-hidden', 'true');
      inner.className = 'pg-wi';
      inner.style.setProperty('--i', i);
      inner.textContent = word;
      outer.appendChild(inner);
      frag.appendChild(outer);
      if (i < words.length - 1) frag.appendChild(document.createTextNode(' '));
    });
    el.setAttribute('aria-label', text);
    el.textContent = '';
    el.appendChild(frag);
    el.dataset.pgSplit = '1';
  }

  function watch(el) {
    if (el.dataset.pgSeen) return;
    el.dataset.pgSeen = '1';
    var rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      el.classList.add('pg-in');
      return;
    }
    el.classList.add('pg-pending');
    io.observe(el);
  }

  function init(scope) {
    if (!enabled) return;
    scope = scope || document;
    scope.querySelectorAll(WIPE).forEach(function (el) {
      el.classList.add('pg-wipe');
      watch(el);
    });
    scope.querySelectorAll(RISE).forEach(function (el) {
      splitWords(el);
      watch(el);
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      root.toggleAttribute('data-scrolled', window.scrollY > 8);
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
  else init();

  document.addEventListener('shopify:section:load', function (event) { init(event.target); });

  window.Pegasus = { init: init, enabled: enabled, reduced: reduced };
})();
