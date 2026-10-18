(() => {
  'use strict';
  const dialog = document.querySelector('.image-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const cards = [...document.querySelectorAll('[data-gallery-image]')];
  const image = dialog.querySelector('.dialog-image');
  const title = dialog.querySelector('.dialog-title');
  const counter = dialog.querySelector('.dialog-counter');
  const close = dialog.querySelector('[data-close]');
  let current = 0;
  let returnFocus = null;

  function show(index) {
    current = (index + cards.length) % cards.length;
    const item = cards[current];
    image.src = item.dataset.galleryImage;
    image.alt = item.dataset.title;
    title.textContent = item.dataset.title;
    counter.textContent = `${String(current + 1).padStart(2, '0')} / ${cards.length}`;
    const next = new Image();
    next.src = cards[(current + 1) % cards.length].dataset.galleryImage;
  }

  cards.forEach((item, index) => item.addEventListener('click', () => {
    returnFocus = item;
    show(index);
    dialog.showModal();
    close.focus({ preventScroll: true });
  }));
  close.addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-prev]').addEventListener('click', () => show(current - 1));
  dialog.querySelector('[data-next]').addEventListener('click', () => show(current + 1));
  dialog.addEventListener('close', () => {
    image.removeAttribute('src');
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); show(current + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(current - 1); }
    if (event.key === 'Home') { event.preventDefault(); show(0); }
    if (event.key === 'End') { event.preventDefault(); show(cards.length - 1); }
    if (event.key === 'Tab') {
      const controls = [...dialog.querySelectorAll('button:not([disabled])')];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
})();
