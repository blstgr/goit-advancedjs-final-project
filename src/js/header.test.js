import { describe, it, expect, beforeEach } from 'vitest';
import { initHeaderBurger } from './header.js';

function renderHeader() {
  document.body.innerHTML = `
    <button class="header__burger" aria-expanded="false"></button>
    <div class="header__nav"></div>
  `;
}

describe('initHeaderBurger', () => {
  beforeEach(() => {
    renderHeader();
  });

  it('opens the nav panel and flips aria-expanded on first click', () => {
    initHeaderBurger();
    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');

    burger.click();

    expect(burger.getAttribute('aria-expanded')).toBe('true');
    expect(nav.classList.contains('is-open')).toBe(true);
  });

  it('closes the nav panel again on a second click', () => {
    initHeaderBurger();
    const burger = document.querySelector('.header__burger');
    const nav = document.querySelector('.header__nav');

    burger.click();
    burger.click();

    expect(burger.getAttribute('aria-expanded')).toBe('false');
    expect(nav.classList.contains('is-open')).toBe(false);
  });

  it('does nothing when the burger or nav is missing from the DOM', () => {
    document.body.innerHTML = '';
    expect(() => initHeaderBurger()).not.toThrow();
  });
});
