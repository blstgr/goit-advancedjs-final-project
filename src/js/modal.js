// Tracks every currently-open modal (by root element) so that when two
// dialogs are stacked (e.g. the rating popup opened on top of the exercise
// modal), Escape closes only the topmost one instead of both at once.
const openStack = [];

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function createModal(rootEl, { onClose } = {}) {
  let isOpen = false;
  let onKeydown = null;
  let previouslyFocused = null;

  const backdrop = rootEl.querySelector('[data-modal-backdrop]');
  const closeBtn = rootEl.querySelector('[data-modal-close]');
  const panel = rootEl.querySelector('.modal__panel');

  function getFocusable() {
    return panel ? Array.from(panel.querySelectorAll(FOCUSABLE_SELECTOR)) : [];
  }

  function trapTab(event) {
    const focusable = getFocusable();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  function close() {
    if (!isOpen) return;

    rootEl.classList.remove('is-open');
    rootEl.setAttribute('aria-hidden', 'true');

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

    if (previouslyFocused && document.contains(previouslyFocused)) {
      previouslyFocused.focus();
    }
    previouslyFocused = null;

    onClose?.();
  }

  function open() {
    if (isOpen) return;

    previouslyFocused = document.activeElement;

    rootEl.classList.add('is-open');
    rootEl.removeAttribute('aria-hidden');
    document.body.classList.add('has-modal-open');
    openStack.push(rootEl);

    onKeydown = (event) => {
      if (openStack[openStack.length - 1] !== rootEl) return;

      if (event.key === 'Escape') {
        close();
      } else if (event.key === 'Tab') {
        trapTab(event);
      }
    };
    document.addEventListener('keydown', onKeydown);

    backdrop?.addEventListener('click', close);
    closeBtn?.addEventListener('click', close);

    isOpen = true;
    closeBtn?.focus();
  }

  return { open, close, isOpen: () => isOpen };
}
