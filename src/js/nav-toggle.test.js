import { describe, it, expect, beforeEach } from 'vitest';
import { initNavToggle } from './nav-toggle.js';

function renderNav() {
  document.body.innerHTML = `
    <nav data-nav-toggle>
      <a href="#" class="nav-toggle__link is-active">Home</a>
      <a href="#" class="nav-toggle__link">Favorites</a>
    </nav>
  `;
  return document.querySelector('[data-nav-toggle]');
}

describe('initNavToggle', () => {
  let nav;
  let links;

  beforeEach(() => {
    nav = renderNav();
    initNavToggle(nav);
    links = nav.querySelectorAll('.nav-toggle__link');
  });

  it('marks the clicked link active and the others inactive', () => {
    links[1].click();

    expect(links[0].classList.contains('is-active')).toBe(false);
    expect(links[1].classList.contains('is-active')).toBe(true);
  });

  it('prevents navigation for placeholder "#" links', () => {
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    links[1].dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
  });

  it('ignores clicks outside any nav-toggle__link', () => {
    nav.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(links[0].classList.contains('is-active')).toBe(true);
    expect(links[1].classList.contains('is-active')).toBe(false);
  });
});
