/* Photo scrub for product cards (snippets/card-product.liquid renders `data-pg-frames` on `.card__media`).
   A mouse picks the photo by its position across the card's photo, a horizontal swipe changes it on touch, and the
   chosen frame is written to `data-pg-active`, which assets/pegasus.css turns into opacity. One set of listeners on
   `document`, so cards that arrive later (filtering, pagination, section re-render) need no setup.
   Keyboard users are not left out of anything: every photo is on the product page, and the card is one link. */
(() => {
  if (window.__pgCardGallery) return;
  window.__pgCardGallery = true;

  let hovered = null; // the photo box the mouse is over
  let swipe = null; // a touch gesture in progress
  let swallowClicksUntil = 0;

  const frames = (box) => Number(box.dataset.pgFrames) || 1;
  const clamp = (box, i) => Math.min(frames(box) - 1, Math.max(0, i));
  const boxOf = (el) => {
    const card = el.closest && el.closest('.card-wrapper');
    return card && card.querySelector('.card__media[data-pg-frames]');
  };

  function release() {
    if (hovered) delete hovered.dataset.pgActive;
    hovered = null;
  }

  function scrub(e) {
    if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    const box = boxOf(e.target);
    if (box !== hovered) release();
    if (!box) return;
    hovered = box;
    const r = box.getBoundingClientRect();
    if (e.clientY < r.top || e.clientY > r.bottom) return; // over the title: keep the photo that is showing
    box.dataset.pgActive = clamp(box, Math.floor(((e.clientX - r.left) / r.width) * frames(box)));
  }

  document.addEventListener('pointerover', scrub);
  document.addEventListener('pointermove', scrub);
  document.documentElement.addEventListener('pointerleave', release);

  document.addEventListener('pointerdown', (e) => {
    const box = e.pointerType === 'touch' ? boxOf(e.target) : null;
    swipe = box && { box, id: e.pointerId, x: e.clientX, y: e.clientY };
  });

  document.addEventListener('pointerup', (e) => {
    if (!swipe || e.pointerId !== swipe.id) return;
    const { box, x, y } = swipe;
    swipe = null;
    const dx = e.clientX - x;
    if (Math.abs(dx) < 30 || Math.abs(dx) < Math.abs(e.clientY - y) * 1.5) return; // a tap, or a vertical scroll
    box.dataset.pgActive = clamp(box, Number(box.dataset.pgActive || 0) + (dx < 0 ? 1 : -1));
    swallowClicksUntil = Date.now() + 500; // the swipe must not also open the product
  });

  document.addEventListener('pointercancel', () => {
    swipe = null;
  });

  document.addEventListener(
    'click',
    (e) => {
      if (Date.now() < swallowClicksUntil) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );
})();
