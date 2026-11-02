/* Progress line under the phone gallery: a thumb, one photo wide, that slides along a hairline as the photos are
   swiped. It reads the scroll position of Craft's slider list, so Craft's own counter and buttons are untouched. */
if (!customElements.get('pg-gallery-progress')) {
  customElements.define(
    'pg-gallery-progress',
    class extends HTMLElement {
      connectedCallback() {
        this.slider = this.parentElement && this.parentElement.querySelector('[id^="Slider-Gallery"]');
        if (!this.slider) return;
        this.onScroll = () => this.update();
        this.slider.addEventListener('scroll', this.onScroll, { passive: true });
        this.resizeObserver = new ResizeObserver(this.onScroll);
        this.resizeObserver.observe(this.slider);
        this.update();
      }

      disconnectedCallback() {
        if (this.slider) this.slider.removeEventListener('scroll', this.onScroll);
        if (this.resizeObserver) this.resizeObserver.disconnect();
      }

      update() {
        const slides = Array.from(this.slider.children).filter((el) => el.offsetWidth > 0).length;
        const max = this.slider.scrollWidth - this.slider.clientWidth;
        const p = max > 0 ? Math.min(1, Math.max(0, this.slider.scrollLeft / max)) : 0;
        this.style.setProperty('--pg-n', Math.max(1, slides));
        this.style.setProperty('--pg-p', p.toFixed(4));
      }
    }
  );
}
