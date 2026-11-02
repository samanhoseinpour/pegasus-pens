/* <pg-rail>: snap-scrolling row with a hairline progress bar, previous/next buttons and mouse drag.
 * Markup contract: [data-rail-track] > [data-rail-item], plus the pegasus-rail-controls snippet. */
if (!customElements.get('pg-rail')) {
  class PgRail extends HTMLElement {
    connectedCallback() {
      this.track = this.querySelector('[data-rail-track]');
      if (!this.track) return;
      this.prev = this.querySelector('[data-rail-prev]');
      this.next = this.querySelector('[data-rail-next]');
      this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      this.onScroll = () => this.update();

      this.track.addEventListener('scroll', this.onScroll, { passive: true });
      this.prev?.addEventListener('click', () => this.go(-1));
      this.next?.addEventListener('click', () => this.go(1));
      this.observer = new ResizeObserver(this.onScroll);
      this.observer.observe(this.track);
      this.enableDrag();
      this.update();
    }

    disconnectedCallback() {
      this.observer?.disconnect();
      this.track?.removeEventListener('scroll', this.onScroll);
    }

    go(direction) {
      const item = this.track.querySelector('[data-rail-item]');
      const gap = parseFloat(getComputedStyle(this.track).columnGap) || 0;
      const step = (item ? item.getBoundingClientRect().width : this.track.clientWidth) + gap;
      const visible = Math.max(1, Math.floor((this.track.clientWidth + gap) / step));
      this.track.scrollBy({ left: direction * step * visible, behavior: this.reduced.matches ? 'auto' : 'smooth' });
    }

    snap() {
      const items = [...this.track.querySelectorAll('[data-rail-item]')];
      if (!items.length) return;
      const here = this.track.scrollLeft;
      const nearest = items.reduce((best, item) => (Math.abs(item.offsetLeft - here) < Math.abs(best.offsetLeft - here) ? item : best));
      this.track.scrollTo({ left: nearest.offsetLeft, behavior: this.reduced.matches ? 'auto' : 'smooth' });
    }

    update() {
      const { scrollLeft, scrollWidth, clientWidth } = this.track;
      const max = scrollWidth - clientWidth;
      this.style.setProperty('--rail-start', scrollWidth ? scrollLeft / scrollWidth : 0);
      this.style.setProperty('--rail-size', scrollWidth ? clientWidth / scrollWidth : 1);
      if (this.prev) this.prev.disabled = scrollLeft <= 1;
      if (this.next) this.next.disabled = scrollLeft >= max - 1;
      this.toggleAttribute('data-static', max <= 1);
    }

    enableDrag() {
      let startX = 0;
      let startScroll = 0;
      let moved = false;
      let active = false;

      this.track.addEventListener('pointerdown', (event) => {
        if (event.pointerType !== 'mouse' || event.button !== 0) return;
        active = true;
        moved = false;
        startX = event.clientX;
        startScroll = this.track.scrollLeft;
      });

      window.addEventListener('pointermove', (event) => {
        if (!active) return;
        const dx = event.clientX - startX;
        if (Math.abs(dx) > 5) {
          moved = true;
          this.track.classList.add('is-dragging');
        }
        if (moved) this.track.scrollLeft = startScroll - dx;
      });

      window.addEventListener('pointerup', () => {
        if (!active) return;
        active = false;
        this.track.classList.remove('is-dragging');
        if (moved) this.snap();
      });

      // Links and images start a native drag that would swallow our pointer events.
      this.track.addEventListener('dragstart', (event) => event.preventDefault());

      // A drag must not follow the link under the pointer.
      this.track.addEventListener(
        'click',
        (event) => {
          if (moved) {
            event.preventDefault();
            event.stopPropagation();
            moved = false;
          }
        },
        true
      );
    }
  }

  customElements.define('pg-rail', PgRail);
}
