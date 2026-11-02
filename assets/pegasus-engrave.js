/* <pg-engrave>: the home page engraving preview. The plate shows what the visitor types, character by
   character. The first time it scrolls into view it also "engraves" the sample text once, as a demo.
   The form is a plain GET form to a product (?engrave=...), so it works without this script. */

if (!customElements.get('pg-engrave')) {
  customElements.define(
    'pg-engrave',
    class PgEngrave extends HTMLElement {
      connectedCallback() {
        this.plate = this.querySelector('[data-plate]');
        this.line = this.querySelector('[data-line]');
        this.input = this.querySelector('[data-input]');
        this.count = this.querySelector('[data-count]');
        this.limit = Number(this.dataset.limit) || 20;
        this.sample = this.dataset.sample || '';
        this.shown = '';

        this.input.addEventListener('input', (event) => {
          this.stopDemo();
          this.render(this.input.value.trim(), (event.inputType || '').startsWith('insert'));
        });
        this.updateCount();

        const calm =
          window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
          (window.Shopify && window.Shopify.designMode) ||
          document.documentElement.getAttribute('data-pg-motion') === 'off' ||
          !('IntersectionObserver' in window);
        if (calm || !this.sample) return;

        this.observer = new IntersectionObserver(
          (entries) => {
            if (!entries[0].isIntersecting) return;
            this.observer.disconnect();
            this.demo();
          },
          { threshold: 0.6 }
        );
        this.observer.observe(this.plate);
      }

      disconnectedCallback() {
        this.stopDemo();
        if (this.observer) this.observer.disconnect();
      }

      demo() {
        if (this.input.value) return;
        let i = 0;
        this.timer = setInterval(() => {
          i++;
          this.render(this.sample.slice(0, i));
          if (i >= this.sample.length) this.stopDemo();
        }, 120);
      }

      stopDemo() {
        clearInterval(this.timer);
      }

      // Only the added characters are appended (and animated), so the earlier ones are not restarted.
      // The text is added as text nodes, so nothing a visitor types is ever read as markup.
      render(text, animateLast) {
        const before = this.shown;
        const added = text.length > before.length && text.startsWith(before);
        this.shown = text;
        if (!added) this.line.textContent = '';
        [...(added ? text.slice(before.length) : text)].forEach((char) => {
          const span = document.createElement('span');
          span.className = 'pg-eng__c' + (added ? ' is-new' : '');
          span.textContent = char;
          this.line.append(span);
        });
        if (animateLast && !added && this.line.lastChild) this.line.lastChild.classList.add('is-new');
        this.plate.toggleAttribute('data-empty', !text);
        const n = (text || this.sample).length;
        this.plate.dataset.size = n <= 8 ? 'xl' : n <= 14 ? 'l' : n <= 22 ? 'm' : 's';
        this.updateCount();
      }

      updateCount() {
        this.count.textContent = this.dataset.counter
          .replace('{count}', this.input.value.length)
          .replace('{max}', this.limit);
      }
    }
  );
}
