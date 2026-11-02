/* <pg-process>: draws a line down the process steps as the page scrolls, led by a small pen.
   It writes --p (0 to 1, how much of the line is drawn) and marks each step .is-lit once the line reaches its ring.
   The line's length (--pg-rail) is measured in every mode, so it always ends on the last ring.
   No motion allowed (reduced motion, theme editor, motion off): it never goes live, so the line is fully drawn and every step is lit. */

if (!customElements.get('pg-process')) {
  customElements.define(
    'pg-process',
    class PgProcess extends HTMLElement {
      connectedCallback() {
        this.steps = Array.from(this.querySelectorAll('.pg-proc__step'));
        this.edges = [];
        this.rail = 0;
        this.live =
          !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
          !(window.Shopify && window.Shopify.designMode) &&
          document.documentElement.getAttribute('data-pg-motion') !== 'off';

        this.ticking = false;
        this.onScroll = () => {
          if (this.ticking) return;
          this.ticking = true;
          requestAnimationFrame(() => {
            this.ticking = false;
            this.update();
          });
        };

        // Step heights change when fonts and photos load or the width changes, so measure again then.
        this.observer = new ResizeObserver(() => {
          this.measure();
          this.update();
        });
        this.observer.observe(this);

        if (this.live) {
          this.setAttribute('data-live', '');
          window.addEventListener('scroll', this.onScroll, { passive: true });
        }
        this.measure();
        this.update();
      }

      disconnectedCallback() {
        window.removeEventListener('scroll', this.onScroll);
        this.observer.disconnect();
      }

      // Where each ring sits, relative to this element's top edge (scroll cancels out of the difference).
      measure() {
        const top = this.getBoundingClientRect().top;
        this.edges = this.steps.map((step) => {
          const ring = step.querySelector('.pg-proc__node').getBoundingClientRect();
          return { top: ring.top - top, bottom: ring.bottom - top };
        });
        // The line runs from the first ring's bottom edge to the last ring's top edge.
        this.rail = this.edges.length > 1 ? Math.max(0, this.edges[this.edges.length - 1].top - this.edges[0].bottom) : 0;
        this.style.setProperty('--pg-rail', `${this.rail}px`);
      }

      update() {
        if (!this.live || !this.edges.length) return;
        // The line is drawn down to a point 60% of the way down the screen.
        const line = window.innerHeight * 0.6 - this.getBoundingClientRect().top;
        const p = this.rail ? Math.min(1, Math.max(0, (line - this.edges[0].bottom) / this.rail)) : 1;
        this.style.setProperty('--p', p.toFixed(4));
        this.steps.forEach((step, i) => step.classList.toggle('is-lit', line >= this.edges[i].top));
      }
    }
  );
}
