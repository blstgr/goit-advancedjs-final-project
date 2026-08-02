export function createModal(rootEl) {
  let isOpen = false;
  let onKeydown = null;

  function close() {
    if (!isOpen) return;

    rootEl.classList.remove('is-open');
    document.body.classList.remove('has-modal-open');

    if (onKeydown) {
      document.removeEventListener('keydown', onKeydown);
      onKeydown = null;
    }

    isOpen = false;
  }

  function open() {
    if (isOpen) return;

    rootEl.classList.add('is-open');
    document.body.classList.add('has-modal-open');

    onKeydown = (event) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKeydown);

    isOpen = true;
  }

  const backdrop = rootEl.querySelector('[data-modal-backdrop]');
  const closeBtn = rootEl.querySelector('[data-modal-close]');

  backdrop?.addEventListener('click', close);
  closeBtn?.addEventListener('click', close);

  return { open, close, isOpen: () => isOpen };
}
