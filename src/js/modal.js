// Tracks every currently-open modal (by root element) so that when two
// dialogs are stacked (e.g. the rating popup opened on top of the exercise
// modal), Escape closes only the topmost one instead of both at once.
const openStack = [];

export function createModal(rootEl, { onClose } = {}) {
  let isOpen = false;
  let onKeydown = null;

  const backdrop = rootEl.querySelector('[data-modal-backdrop]');
  const closeBtn = rootEl.querySelector('[data-modal-close]');

  function close() {
    if (!isOpen) return;

    rootEl.classList.remove('is-open');

    const index = openStack.indexOf(rootEl);
    if (index !== -1) openStack.splice(index, 1);

    if (openStack.length === 0) {
      document.body.classList.remove('has-modal-open');
    }

    if (onKeydown) {
      document.removeEventListener('keydown', onKeydown);
      onKeydown = null;
    }

    backdrop?.removeEventListener('click', close);
    closeBtn?.removeEventListener('click', close);

    isOpen = false;
    onClose?.();
  }

  function open() {
    if (isOpen) return;

    rootEl.classList.add('is-open');
    document.body.classList.add('has-modal-open');
    openStack.push(rootEl);

    onKeydown = (event) => {
      if (event.key === 'Escape' && openStack[openStack.length - 1] === rootEl) {
        close();
      }
    };
    document.addEventListener('keydown', onKeydown);

    backdrop?.addEventListener('click', close);
    closeBtn?.addEventListener('click', close);

    isOpen = true;
  }

  return { open, close, isOpen: () => isOpen };
}
