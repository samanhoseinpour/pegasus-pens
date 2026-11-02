/* <pg-sticky-atc>: a bar that appears once the real buy buttons have scrolled out of view above the viewport.
 * It never submits anything itself. Its button clicks the real submit button, and its label, state and price
 * are mirrored from the real ones, so loading, errors and sold-out behave exactly as they do on the page. */
if (!customElements.get('pg-sticky-atc')) {
  class PgStickyAtc extends HTMLElement {
    connectedCallback() {
      const id = this.dataset.sectionId;
      this.main = document.getElementById(`ProductSubmitButton-${id}`);
      if (!this.main) return;

      this.button = this.querySelector('[data-sticky-submit]');
      this.label = this.querySelector('[data-sticky-label]');
      this.priceBox = this.querySelector('[data-sticky-price]');
      this.variantBox = this.querySelector('[data-sticky-variant]');
      this.thumb = this.querySelector('[data-sticky-thumb]');
      this.pastButtons = false;

      this.button.addEventListener('click', () => this.main.click());

      this.buttonObserver = new MutationObserver(() => this.syncButton());
      this.buttonObserver.observe(this.main, {
        attributes: true,
        attributeFilter: ['disabled', 'aria-disabled', 'class'],
        childList: true,
        subtree: true,
        characterData: true,
      });
      this.syncButton();

      const price = document.getElementById(`price-${id}`);
      if (price && this.priceBox) {
        this.priceObserver = new MutationObserver(() => this.syncPrice(price));
        this.priceObserver.observe(price, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
      }

      if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
        this.unsubscribe = subscribe(PUB_SUB_EVENTS.variantChange, (event) => this.onVariant(event, id));
      }

      // Not an IntersectionObserver: it only reports state changes, so a jump straight past the buttons
      // (restored scroll position, an anchor link) would never be noticed.
      this.target = this.main.closest('.product-form__buttons') || this.main;
      this.ticking = false;
      this.onScroll = () => {
        if (this.ticking) return;
        this.ticking = true;
        requestAnimationFrame(() => {
          this.ticking = false;
          this.pastButtons = this.target.getBoundingClientRect().bottom < 0;
          this.update();
        });
      };
      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onScroll);
      this.onScroll();
    }

    disconnectedCallback() {
      this.buttonObserver?.disconnect();
      this.priceObserver?.disconnect();
      window.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('resize', this.onScroll);
      this.unsubscribe?.();
    }

    update() {
      this.classList.toggle('is-visible', this.pastButtons);
      this.toggleAttribute('inert', !this.pastButtons);
    }

    syncButton() {
      const busy = this.main.classList.contains('loading') || this.main.getAttribute('aria-disabled') === 'true';
      const text = [...this.main.querySelectorAll('span')]
        .filter((span) => !span.classList.contains('hidden') && !span.closest('.loading__spinner'))
        .map((span) => span.textContent.trim())
        .find(Boolean);
      if (text) this.label.textContent = text;
      this.button.disabled = this.main.hasAttribute('disabled');
      this.button.classList.toggle('is-busy', busy && !this.main.hasAttribute('disabled'));
    }

    syncPrice(source) {
      this.priceBox.innerHTML = source.innerHTML;
      this.priceBox.classList.toggle('hidden', source.classList.contains('hidden'));
    }

    onVariant(event, id) {
      const { sectionId, variant } = event.data || {};
      if (sectionId !== id || !variant) return;
      if (this.variantBox) this.variantBox.textContent = variant.title;
      const image = variant.featured_media?.preview_image?.src;
      if (this.thumb && image) {
        const url = new URL(image, window.location.origin);
        url.searchParams.set('width', '120');
        url.searchParams.set('height', '120');
        this.thumb.src = url.toString();
      }
    }
  }

  customElements.define('pg-sticky-atc', PgStickyAtc);
}
