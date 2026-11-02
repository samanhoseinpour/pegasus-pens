/* <pg-constellation>: turns page scroll into a drawn constellation, one star (and pen family) at a time.
 * It pins only when motion is allowed. Otherwise the static layout shows everything at once. */
if (!customElements.get('pg-constellation')) {
  const WINDOWS = [0, 0.23, 0.46, 0.69, 0.92];
  const clamp = (value) => Math.min(1, Math.max(0, value));

  class PgConstellation extends HTMLElement {
    connectedCallback() {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
      const motionOff = document.documentElement.getAttribute('data-pg-motion') === 'off';
      const designMode = !!(window.Shopify && window.Shopify.designMode);
      if (reduced.matches || motionOff || designMode || !('IntersectionObserver' in window)) return;

      this.reduced = reduced;
      this.panels = [...this.querySelectorAll('.pg-const__panel')];
      this.buttons = [...this.querySelectorAll('[data-star-button]')];
      this.stars = [1, 2, 3, 4, 5, 6].map((n) => this.querySelector(`.pg-star--${n}`));
      this.count = this.panels.length;
      if (!this.count) return;

      this.classList.add('is-pinned');
      this.state = '';
      this.ticking = false;
      this.visible = true;

      this.onScroll = () => {
        if (this.ticking || !this.visible) return;
        this.ticking = true;
        requestAnimationFrame(() => {
          this.render();
          this.ticking = false;
        });
      };

      this.observer = new IntersectionObserver((entries) => {
        this.visible = entries[0].isIntersecting;
        if (this.visible) this.onScroll();
      }, { rootMargin: '50% 0px' });
      this.observer.observe(this);

      window.addEventListener('scroll', this.onScroll, { passive: true });
      window.addEventListener('resize', this.onScroll);
      this.buttons.forEach((button) => button.addEventListener('click', () => this.jump(Number(button.dataset.starButton))));
      this.render();
    }

    disconnectedCallback() {
      this.observer?.disconnect();
      window.removeEventListener('scroll', this.onScroll);
      window.removeEventListener('resize', this.onScroll);
    }

    progress() {
      const rect = this.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      return total > 0 ? clamp(-rect.top / total) : 0;
    }

    render() {
      const p = this.progress();
      let step = 1;
      for (let i = 1; i <= this.count; i++) if (p >= WINDOWS[i - 1]) step = i;
      const complete = p >= WINDOWS[4];

      const key = `${step}|${complete}|${p.toFixed(3)}`;
      if (key === this.state) return;
      this.state = key;

      for (let k = 1; k <= 4; k++) {
        this.style.setProperty(`--seg-${k}`, clamp((p - WINDOWS[k - 1]) / (WINDOWS[k] - WINDOWS[k - 1])).toFixed(3));
      }
      const tail = clamp((p - WINDOWS[4]) / (1 - WINDOWS[4])).toFixed(3);
      this.style.setProperty('--seg-5', tail);
      this.style.setProperty('--seg-6', tail);

      this.stars.forEach((star, i) => {
        if (!star) return;
        star.classList.toggle('is-lit', i < 4 ? i + 1 <= step : complete);
        star.classList.toggle('is-active', i < 4 && i + 1 === step);
      });
      this.panels.forEach((panel, i) => panel.classList.toggle('is-active', i + 1 === step));
      this.buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i + 1 === step)));
    }

    jump(step) {
      const total = this.offsetHeight - window.innerHeight;
      const top = this.getBoundingClientRect().top + window.scrollY + (WINDOWS[step - 1] + 0.02) * total;
      window.scrollTo({ top, behavior: this.reduced.matches ? 'auto' : 'smooth' });
    }
  }

  customElements.define('pg-constellation', PgConstellation);
}
