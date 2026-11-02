/* <pg-slider>: stacked hero slides that crossfade.
   - It changes slides by itself only when the merchant allows it AND motion is allowed (not reduced motion, not the
     theme editor). The progress line of the active dot is a CSS animation, and its `animationend` moves to the next
     slide, so pausing (CSS animation-play-state) pauses the timing too.
   - It holds while the pointer or keyboard focus is inside, and while the tab is hidden or the slider is off screen.
     There are no arrows or pause button (the owner asked for a clean bar): the dots are the controls, and swiping works
     on touch screens.
   - Inactive slides are `inert`, so their links and buttons are not reachable. */

if (!customElements.get('pg-slider')) {
  customElements.define(
    'pg-slider',
    class PgSlider extends HTMLElement {
      connectedCallback() {
        this.slides = [...this.querySelectorAll('[data-slide]')];
        this.dots = [...this.querySelectorAll('[data-dot]')];
        this.index = Math.max(0, this.slides.findIndex((s) => s.classList.contains('is-active')));
        this.holds = new Set();

        const motion =
          !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
          !(window.Shopify && window.Shopify.designMode) &&
          this.ownerDocument.documentElement.getAttribute('data-pg-motion') !== 'off';
        this.autoplay = this.dataset.autoplay === 'true' && motion && this.slides.length > 1;
        this.style.setProperty('--pg-slide-time', `${Number(this.dataset.interval) || 7000}ms`);

        this.setAttribute('data-ready', '');
        this.show(this.index);

        this.dots.forEach((dot, i) => dot.addEventListener('click', () => this.show(i)));
        this.addEventListener('animationend', (e) => {
          if (this.autoplay && e.animationName === 'pg-dot-fill') this.step(1);
        });

        if (this.autoplay) {
          this.setAttribute('data-playing', '');
          this.addEventListener('pointerenter', () => this.hold('pointer'));
          this.addEventListener('pointerleave', () => this.release('pointer'));
          // Only keyboard focus holds it; a mouse click on a control should not stop the slider for good.
          this.addEventListener('focusin', (e) => e.target.matches(':focus-visible') && this.hold('focus'));
          this.addEventListener('focusout', () => this.release('focus'));
          this.onVisibility = () => (document.hidden ? this.hold('tab') : this.release('tab'));
          document.addEventListener('visibilitychange', this.onVisibility);
          this.observer = new IntersectionObserver(
            (entries) => (entries[0].isIntersecting ? this.release('view') : this.hold('view')),
            { threshold: 0.3 }
          );
          this.observer.observe(this);
        }

        // Swipe on touch screens.
        let startX = 0;
        let startY = 0;
        this.addEventListener('touchstart', (e) => ((startX = e.touches[0].clientX), (startY = e.touches[0].clientY)), { passive: true });
        this.addEventListener('touchend', (e) => {
          const dx = e.changedTouches[0].clientX - startX;
          const dy = e.changedTouches[0].clientY - startY;
          if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) this.step(dx < 0 ? 1 : -1);
        });

        // Theme editor: selecting a slide shows it and stops the automatic change.
        this.onSelect = (e) => {
          const i = this.slides.indexOf(e.target);
          if (i > -1) this.show(i);
        };
        this.addEventListener('shopify:block:select', this.onSelect);
      }

      disconnectedCallback() {
        document.removeEventListener('visibilitychange', this.onVisibility);
        if (this.observer) this.observer.disconnect();
      }

      step(direction) {
        this.show((this.index + direction + this.slides.length) % this.slides.length);
      }

      show(i) {
        this.index = i;
        this.slides.forEach((slide, n) => {
          const on = n === i;
          slide.classList.toggle('is-active', on);
          slide.toggleAttribute('inert', !on);
        });
        this.dots.forEach((dot, n) => {
          const on = n === i;
          dot.classList.toggle('is-active', on);
          if (on) dot.setAttribute('aria-current', 'true');
          else dot.removeAttribute('aria-current');
        });
        // The progress line restarts by itself: its animation only exists on the active dot, so moving the
        // class to another dot starts that dot's animation from zero.
      }

      hold(reason) {
        this.holds.add(reason);
        this.classList.add('is-held');
      }

      release(reason) {
        this.holds.delete(reason);
        if (!this.holds.size) this.classList.remove('is-held');
      }
    }
  );
}
