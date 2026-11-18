/* <pg-404>: Shopify renders every missing page as /404, so Liquid never sees the address the visitor asked for.
   This writes it into [data-pg-address] (as text) and shows the hidden "Looking for …?" line whose data-handle
   matches the address's last part (/about, /hardwood, /collections/<pen>). Without JS both stay hidden. */

if (!customElements.get('pg-404')) {
  customElements.define(
    'pg-404',
    class Pg404 extends HTMLElement {
      connectedCallback() {
        let path = location.pathname;
        try {
          path = decodeURIComponent(path);
        } catch (e) {
          // a malformed %-escape: keep the raw path
        }

        const address = this.querySelector('[data-pg-address]');
        if (address) {
          address.textContent = location.host + path;
          address.hidden = false;
        }

        const slug = (path.split('/').filter(Boolean).pop() || '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
        if (!slug) return;
        const hit = [...this.querySelectorAll('[data-handle]')].find((el) => el.dataset.handle === slug);
        if (hit) hit.hidden = false;
      }
    }
  );
}
