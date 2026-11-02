/* <pg-scrub>: writes --p (0 to 1) as the text block travels from low on the screen to the upper middle.
   The words' opacity is pure CSS. No motion allowed (reduced motion, theme editor, motion off): never activates. */

if (!customElements.get('pg-scrub')) {
  customElements.define(
    'pg-scrub',
    class PgScrub extends HTMLElement {
      connectedCallback() {
        const allowed =
          !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
          !(window.Shopify && window.Shopify.designMode) &&
          document.documentElement.getAttribute('data-pg-motion') !== 'off';
        if (!allowed) return;

        this.classList.add('is-scrub');
        this.ticking = false;
        this.onScroll = () => {
          if (this.ticking) return;
          this.ticking = true;
          requestAnimationFrame(() => {
            this.update();
            this.ticking = false;
          });
        };
        window.addEventListener('scroll', this.onScroll, { passive: true });
        window.addEventListener('resize', this.onScroll);
        this.update();
      }

      disconnectedCallback() {
        window.removeEventListener('scroll', this.onScroll);
        window.removeEventListener('resize', this.onScroll);
      }

      update() {
        const rect = this.getBoundingClientRect();
        const vh = window.innerHeight;
        const start = vh * 0.82; // the top edge reaches this line: nothing lit yet
        const end = vh * 0.4; // the bottom edge reaches this line: everything lit
        const p = (start - rect.top) / (start - end + rect.height);
        this.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(4));
      }
    }
  );
}
