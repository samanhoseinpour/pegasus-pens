/* <pg-personalize>: engraving and gift options on the product page.
   Each group has a switch. Its fields are disabled (so they are not submitted) until the switch is on.
   The fields belong to the product form through their `form` attribute, so Craft's add-to-cart request
   carries them as line item properties without any extra code. */

if (!customElements.get('pg-personalize')) {
  customElements.define(
    'pg-personalize',
    class PgPersonalize extends HTMLElement {
      connectedCallback() {
        this.formId = this.dataset.form;
        this.engraving = this.querySelector('[data-group="engraving"]');
        this.input = this.querySelector('[data-engraving-input]');
        this.preview = this.querySelector('[data-preview]');
        this.previewBox = this.querySelector('[data-preview-box]');
        this.error = this.querySelector('[data-error-slot]');
        this.note = this.querySelector('[data-quantity-note]');

        this.querySelectorAll('[data-group]').forEach((group) => {
          group.querySelector('[data-toggle]').addEventListener('change', () => this.sync(group));
          this.sync(group);
        });

        this.querySelectorAll('[data-limit]').forEach((field) => {
          field.addEventListener('input', () => this.update(field));
          this.update(field);
        });

        // The home page engraving preview and the featured pen link here with ?engrave=<text>: open the panel, with the
        // text filled in. An empty ?engrave= (the "Engrave it" link) opens it and puts the cursor in the field.
        const params = new URLSearchParams(window.location.search);
        if (this.input && params.has('engrave')) {
          const wanted = (params.get('engrave') || '').trim();
          this.engraving.querySelector('[data-toggle]').checked = true;
          this.input.value = wanted.slice(0, Number(this.input.dataset.limit));
          this.sync(this.engraving);
          this.update(this.input);
          if (!wanted) requestAnimationFrame(() => this.input.focus());
        }

        // Listening on the document survives the product form being re-rendered, and the capture phase
        // runs before Craft's own submit handler, so an invalid form is stopped before it is sent.
        this.onDocumentEvent = this.onDocumentEvent.bind(this);
        document.addEventListener('submit', this.onDocumentEvent, true);
        document.addEventListener('change', this.onDocumentEvent);
        document.addEventListener('input', this.onDocumentEvent);
        this.updateNote();
      }

      disconnectedCallback() {
        document.removeEventListener('submit', this.onDocumentEvent, true);
        document.removeEventListener('change', this.onDocumentEvent);
        document.removeEventListener('input', this.onDocumentEvent);
      }

      sync(group) {
        const open = group.querySelector('[data-toggle]').checked;
        group.querySelector('[data-panel]').classList.toggle('is-open', open);
        group.querySelectorAll('[data-field]').forEach((field) => (field.disabled = !open));
        if (group === this.engraving) {
          if (!open) this.setError('');
          this.updateNote();
        }
      }

      update(field) {
        const max = field.dataset.limit;
        const counter = field.parentElement.querySelector('[data-counter-slot]');
        if (counter) {
          counter.textContent = this.dataset.counter
            .replace('{count}', field.value.length)
            .replace('{max}', max);
        }
        if (field === this.input) {
          const text = field.value.trim();
          this.preview.textContent = text;
          this.previewBox.toggleAttribute('data-empty', !text);
          this.setError('');
        }
      }

      setError(message) {
        if (!this.error) return;
        this.error.textContent = message;
        this.input.setAttribute('aria-invalid', message ? 'true' : 'false');
      }

      updateNote() {
        if (!this.note) return;
        const quantity = document.querySelector(`input[name="quantity"][form="${this.formId}"]`);
        const open = this.engraving.querySelector('[data-toggle]').checked;
        this.note.hidden = !(open && quantity && Number(quantity.value) > 1);
      }

      onDocumentEvent(event) {
        if (event.type === 'submit') {
          // Not `.id`: a form with a field named "id" (the variant) returns that field instead.
          if (event.target.getAttribute('id') !== this.formId) return;
          // A whitespace-only value would otherwise be saved as a real property.
          this.querySelectorAll('input[type="text"], textarea').forEach((field) => (field.value = field.value.trim()));
          const wanted = this.engraving && this.engraving.querySelector('[data-toggle]').checked;
          if (wanted && !this.input.value) {
            event.preventDefault();
            event.stopImmediatePropagation();
            this.setError(this.dataset.error);
            this.input.focus();
          }
          return;
        }
        if (event.target.name === 'quantity') this.updateNote();
      }
    }
  );
}
