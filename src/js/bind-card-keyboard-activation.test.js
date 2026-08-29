import { describe, it, expect, vi } from 'vitest';
import { bindCardKeyboardActivation } from './bind-card-keyboard-activation.js';

function renderGrid() {
  document.body.innerHTML = `
    <div data-grid>
      <article data-open-exercise="ex-1" tabindex="0" role="button">
        <button data-remove-favorite="ex-1"></button>
      </article>
    </div>
  `;
  return document.querySelector('[data-grid]');
}

describe('bindCardKeyboardActivation', () => {
  it('activates the card on Enter', () => {
    const gridEl = renderGrid();
    const card = gridEl.querySelector('[data-open-exercise]');
    const onClick = vi.fn();
    card.addEventListener('click', onClick);
    bindCardKeyboardActivation(gridEl);

    card.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('activates the card on Space', () => {
    const gridEl = renderGrid();
    const card = gridEl.querySelector('[data-open-exercise]');
    const onClick = vi.fn();
    card.addEventListener('click', onClick);
    bindCardKeyboardActivation(gridEl);

    card.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('ignores other keys', () => {
    const gridEl = renderGrid();
    const card = gridEl.querySelector('[data-open-exercise]');
    const onClick = vi.fn();
    card.addEventListener('click', onClick);
    bindCardKeyboardActivation(gridEl);

    card.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not activate the card when Enter/Space originates from the nested remove-favorite button', () => {
    const gridEl = renderGrid();
    const card = gridEl.querySelector('[data-open-exercise]');
    const removeBtn = gridEl.querySelector('[data-remove-favorite]');
    const onClick = vi.fn();
    card.addEventListener('click', onClick);
    bindCardKeyboardActivation(gridEl);

    removeBtn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));

    expect(onClick).not.toHaveBeenCalled();
  });
});
