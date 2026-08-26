import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createModal } from './modal.js';

function renderModal() {
  document.body.innerHTML = `
    <div class="modal">
      <div class="modal__backdrop" data-modal-backdrop></div>
      <div class="modal__panel">
        <button data-modal-close></button>
      </div>
    </div>
  `;
  return document.querySelector('.modal');
}

describe('createModal', () => {
  let rootEl;

  beforeEach(() => {
    rootEl = renderModal();
  });

  it('adds the is-open class when opened', () => {
    const modal = createModal(rootEl);

    modal.open();

    expect(rootEl.classList.contains('is-open')).toBe(true);
    expect(modal.isOpen()).toBe(true);
  });

  it('closes when the backdrop is clicked', () => {
    const modal = createModal(rootEl);
    modal.open();

    rootEl.querySelector('[data-modal-backdrop]').click();

    expect(rootEl.classList.contains('is-open')).toBe(false);
    expect(modal.isOpen()).toBe(false);
  });

  it('closes when the close button is clicked', () => {
    const modal = createModal(rootEl);
    modal.open();

    rootEl.querySelector('[data-modal-close]').click();

    expect(modal.isOpen()).toBe(false);
  });

  it('closes on Escape key', () => {
    const modal = createModal(rootEl);
    modal.open();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(modal.isOpen()).toBe(false);
  });

  it('removes the keydown listener on close so it does not leak', () => {
    const removeSpy = vi.spyOn(document, 'removeEventListener');
    const modal = createModal(rootEl);

    modal.open();
    modal.close();

    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    removeSpy.mockRestore();
  });

  it('does not register a second keydown listener when opened twice in a row', () => {
    const addSpy = vi.spyOn(document, 'addEventListener');
    const modal = createModal(rootEl);

    modal.open();
    modal.open();

    const keydownCalls = addSpy.mock.calls.filter(([type]) => type === 'keydown');
    expect(keydownCalls).toHaveLength(1);
    addSpy.mockRestore();
  });

  it('removes the backdrop and close-button click listeners on close, per spec (5.3): all three close mechanisms must have their listeners torn down', () => {
    const backdrop = rootEl.querySelector('[data-modal-backdrop]');
    const closeBtn = rootEl.querySelector('[data-modal-close]');
    const backdropRemoveSpy = vi.spyOn(backdrop, 'removeEventListener');
    const closeBtnRemoveSpy = vi.spyOn(closeBtn, 'removeEventListener');
    const modal = createModal(rootEl);

    modal.open();
    modal.close();

    expect(backdropRemoveSpy).toHaveBeenCalledWith('click', expect.any(Function));
    expect(closeBtnRemoveSpy).toHaveBeenCalledWith('click', expect.any(Function));
  });

  it('calls onClose exactly once per backdrop click across an open/close/reopen cycle (no duplicate listeners stacking up)', () => {
    const onClose = vi.fn();
    const modal = createModal(rootEl, { onClose });

    modal.open();
    modal.close();
    modal.open();
    rootEl.querySelector('[data-modal-backdrop]').click();

    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
