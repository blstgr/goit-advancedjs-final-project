import { describe, it, expect, beforeEach } from 'vitest';
import { initHeaderBurger, markActiveNavLink } from './header.js';

function renderHeader() {
  document.body.innerHTML = `
    <button class="header__burger" aria-expanded="false"></button>
    <div class="header__nav"></div>
  `;
}

function renderNav() {
  document.body.innerHTML = `
    <nav class="nav-toggle">
      <a href="/" class="nav-toggle__link is-active">Home</a>
      <a href="/favorites.html" class="nav-toggle__link">Favorites</a>
    </nav>
  `;
  return document.querySelector('.nav-toggle');
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

describe('markActiveNavLink', () => {
  it('marks Home active on the root path', () => {
    const nav = renderNav();
    markActiveNavLink(nav, '/');

    const [home, favorites] = nav.querySelectorAll('.nav-toggle__link');
    expect(home.classList.contains('is-active')).toBe(true);
    expect(favorites.classList.contains('is-active')).toBe(false);
  });

  it('marks Favorites active on /favorites.html', () => {
    const nav = renderNav();
    markActiveNavLink(nav, '/favorites.html');

    const [home, favorites] = nav.querySelectorAll('.nav-toggle__link');
    expect(home.classList.contains('is-active')).toBe(false);
    expect(favorites.classList.contains('is-active')).toBe(true);
  });

  it('treats /index.html the same as the root path', () => {
    const nav = renderNav();
    markActiveNavLink(nav, '/index.html');

    expect(nav.querySelector('a[href="/"]').classList.contains('is-active')).toBe(true);
  });
});
