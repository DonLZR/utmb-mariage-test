/* BROCÉLIANDE V3.9.0 — ouverture cinématique : zoom avant et fondu noir.
   Module volontairement isolé : aucun impact sur les formulaires, la carte ou Apps Script. */
(() => {
  'use strict';
  const cover = document.getElementById('bookCover');
  const trigger = document.getElementById('bookCoverOpen');
  if (!cover || !trigger) {
    document.body.classList.remove('book-closed');
    return;
  }

  let opening = false;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  function finish(target) {
    cover.hidden = true;
    document.body.classList.remove('book-closed', 'book-opening');
    opening = false;
    if (target) {
      const destination = document.querySelector(target);
      if (destination) destination.scrollIntoView({ block: 'start', behavior: reduced.matches ? 'auto' : 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
    window.dispatchEvent(new CustomEvent('broceliande:cover-opened'));
  }

  function openCover(target) {
    if (opening || cover.hidden) return;
    opening = true;
    document.body.classList.add('book-opening');
    cover.classList.add('is-opening');
    window.setTimeout(() => finish(target || '#programme'), reduced.matches ? 0 : 960);
  }

  trigger.addEventListener('click', () => openCover('#programme'));

  function reopenCover() {
    opening = false;
    cover.classList.remove('is-opening');
    cover.hidden = false;
    document.body.classList.remove('book-opening');
    document.body.classList.add('book-closed');
    window.scrollTo({ top: 0, behavior: 'auto' });
    requestAnimationFrame(() => trigger.focus({ preventScroll: true }));
  }
  window.BroceliandeCover = Object.freeze({ open: openCover, reopen: reopenCover });

  /* Les liens de la bannière restent utilisables même lorsque la couverture est fermée. */
  document.addEventListener('click', event => {
    if (cover.hidden || opening) return;
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const target = link.getAttribute('href');
    if (!target || target === '#') return;
    event.preventDefault();
    openCover(target);
  }, true);
})();
