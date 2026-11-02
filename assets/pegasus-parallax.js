/* <pg-parallax>: pins the stage and writes the scroll progress through the section to --p (0 to 1).
   Everything visual is CSS. Without motion (reduced motion, theme editor, motion off) it never pins, so the
   section renders as a plain headline with the pens in a row. */

if (!customElements.get('pg-parallax')) {
  customElements.define(
    'pg-parallax',
    class PgParallax extends HTMLElement {
      connectedCallback() {
        const allowed =
          !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
          !(window.Shopify && window.Shopify.designMode) &&
          document.documentElement.getAttribute('data-pg-motion') !== 'off';
        if (!allowed) return;

        this.classList.add('is-pinned');
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
        const travel = rect.height - window.innerHeight;
        const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0;
        this.style.setProperty('--p', p.toFixed(4));
      }
    }
  );
}
