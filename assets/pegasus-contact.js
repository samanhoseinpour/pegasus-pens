/* <pg-contact>: the contact page. Choosing a topic engraves it on the plate, shows that topic's hint, and relabels
   the "pen or order" field (hiding it when the topic has no label for it). The form is plain HTML and works without
   this script: every field is submitted, the plate just stays empty. ?topic=<text> in the address preselects a topic. */

if (!customElements.get('pg-contact')) {
  customElements.define(
    'pg-contact',
    class PgContact extends HTMLElement {
      connectedCallback() {
        this.plate = this.querySelector('[data-plate]');
        this.line = this.querySelector('[data-line]');
        this.hint = this.querySelector('[data-hint]:not(input)');
        this.ref = this.querySelector('[data-ref]');
        this.refText = this.querySelector('[data-ref-text]');
        this.defaultRef = this.refText ? this.refText.textContent : '';
        this.topics = [...this.querySelectorAll('[data-topic]')];

        this.topics.forEach((input) => input.addEventListener('change', () => this.choose(input, true)));

        const wanted = (new URLSearchParams(window.location.search).get('topic') || '').trim().toLowerCase();
        const preset = wanted && this.topics.find((input) => input.value.toLowerCase() === wanted);
        if (preset) {
          preset.checked = true;
          this.choose(preset, false);
        }
      }

      choose(input, animate) {
        this.engrave(input.value, animate);
        if (this.hint) this.hint.textContent = input.dataset.hint || '';
        if (this.refText) this.refText.textContent = input.dataset.refLabel || this.defaultRef;
        // A topic whose label for the field is empty keeps the default label; the field itself stays, because a
        // visitor can always have a pen or an order in mind.
      }

      // Characters are added as text nodes in <span>s, so what is chosen is never read as markup.
      engrave(text, animate) {
        this.line.textContent = '';
        [...text].forEach((char, i) => {
          const span = document.createElement('span');
          span.className = 'pg-contact__c' + (animate ? ' is-new' : '');
          span.style.setProperty('--i', i);
          span.textContent = char;
          this.line.append(span);
        });
        this.plate.toggleAttribute('data-empty', !text);
        this.plate.dataset.size = text.length <= 11 ? 'l' : text.length <= 16 ? 'm' : 's';
      }
    }
  );
}
