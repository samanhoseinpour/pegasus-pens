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

  // Reveal only once the images inside have loaded, or a wipe would play over an empty box. A stalled image
  // must not keep the element hidden, so the wait is capped.
  function reveal(el) {
    var waiting = [].filter.call(el.querySelectorAll('img'), function (img) { return !img.complete; });
    var done = false;
    function go() {
      if (done) return;
      done = true;
      el.classList.remove('pg-pending');
      el.classList.add('pg-in');
    }
    if (!waiting.length) return go();
    var left = waiting.length;
    function one() { if (--left === 0) go(); }
    waiting.forEach(function (img) {
      // A fully clipped image never counts as near the viewport, so a lazy one would not start loading.
      img.loading = 'eager';
      img.addEventListener('load', one, { once: true });
      img.addEventListener('error', one, { once: true });
    });
    setTimeout(go, 2500);
  }

  var io = enabled
    ? new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            reveal(entry.target);
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
      el.classList.add('pg-pending');
      reveal(el);
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

  // The header shrinks to one row after it has been scrolled past (see "Compact header" in pegasus-chrome.css). Keeping
  // its full height reserved in the layout means the page never moves when that happens: browsers without scroll
  // anchoring (Safari, so every iPhone and iPad) would otherwise jump by the difference. This holds at every width, because
  // the header compacts at every width. The height changes with the width, so it is measured again after a resize.
  var heldWidth = 0;
  function holdHeader() {
    var header = document.querySelector('.section-header');
    if (!header || header.classList.contains('scrolled-past-header')) return;
    header.style.minHeight = '';
    header.style.minHeight = header.offsetHeight + 'px';
    heldWidth = window.innerWidth;
  }

  // Back-to-top button (snippet in layout/theme.liquid): appears after a screen and a bit of scrolling.
  var topButton = document.querySelector('[data-pg-top]');
  if (topButton) {
    topButton.addEventListener('click', function () {
      // With Lenis running, let it do the scrolling: a native smooth scroll would fight its easing.
      var lenis = window.Pegasus && window.Pegasus.lenis;
      if (lenis) lenis.scrollTo(0, { duration: 1.4 });
      else window.scrollTo({ top: 0, behavior: reduced.matches ? 'auto' : 'smooth' });
      var logo = document.querySelector('.header__heading-link');
      if (logo) logo.focus({ preventScroll: true });
    });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      root.toggleAttribute('data-scrolled', window.scrollY > 8);
      // A resize while the header was compact could not be measured; do it as soon as the full header is back.
      if (window.scrollY < 8 && heldWidth !== window.innerWidth) holdHeader();
      if (topButton) topButton.classList.toggle('is-visible', window.scrollY > window.innerHeight * 1.2);
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', holdHeader);
  onScroll();
  holdHeader();
  window.addEventListener('load', holdHeader);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(holdHeader);
  document.addEventListener('shopify:section:load', holdHeader);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { init(); });
  else init();

  document.addEventListener('shopify:section:load', function (event) { init(event.target); });

  window.Pegasus = { init: init, enabled: enabled, reduced: reduced };
})();
