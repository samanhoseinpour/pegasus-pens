/* <pg-tabs>: accessible tabs (arrow keys, Home/End), and it follows block selection in the theme editor. */
if (!customElements.get('pg-tabs')) {
  class PgTabs extends HTMLElement {
    connectedCallback() {
      this.tabs = [...this.querySelectorAll('[role="tab"]')];
      if (this.tabs.length < 2) return;

      this.tabs.forEach((tab) => {
        tab.addEventListener('click', () => this.select(tab));
        tab.addEventListener('keydown', (event) => this.onKey(event, tab));
      });

      this.addEventListener('shopify:block:select', (event) => {
        const tab = this.querySelector(`#PgTab-${event.detail.blockId}`);
        if (tab) this.select(tab);
      });
    }

    select(tab, focus = false) {
      this.tabs.forEach((other) => {
        const selected = other === tab;
        other.setAttribute('aria-selected', String(selected));
        other.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(other.getAttribute('aria-controls'));
        if (panel) panel.hidden = !selected;
      });
      if (focus) tab.focus();
    }

    onKey(event, tab) {
      const last = this.tabs.length - 1;
      const index = this.tabs.indexOf(tab);
      const target = {
        ArrowRight: index === last ? 0 : index + 1,
        ArrowLeft: index === 0 ? last : index - 1,
        Home: 0,
        End: last,
      }[event.key];
      if (target === undefined) return;
      event.preventDefault();
      this.select(this.tabs[target], true);
    }
  }

  customElements.define('pg-tabs', PgTabs);
}
