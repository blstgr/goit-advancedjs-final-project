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
      <a href="./" class="nav-toggle__link is-active">Home</a>
      <a href="favorites.html" class="nav-toggle__link">Favorites</a>
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
    markActiveNavLink(nav, '/', 'http://localhost/');

    const [home, favorites] = nav.querySelectorAll('.nav-toggle__link');
    expect(home.classList.contains('is-active')).toBe(true);
    expect(favorites.classList.contains('is-active')).toBe(false);
  });

  it('marks Favorites active on /favorites.html', () => {
    const nav = renderNav();
    markActiveNavLink(nav, '/favorites.html', 'http://localhost/');

    const [home, favorites] = nav.querySelectorAll('.nav-toggle__link');
    expect(home.classList.contains('is-active')).toBe(false);
    expect(favorites.classList.contains('is-active')).toBe(true);
  });

  it('treats /index.html the same as the root path', () => {
    const nav = renderNav();
    markActiveNavLink(nav, '/index.html', 'http://localhost/');

    expect(nav.querySelector('a[href="./"]').classList.contains('is-active')).toBe(true);
  });

  it('sets aria-current="page" on the active link and removes it from the rest', () => {
    const nav = renderNav();
    markActiveNavLink(nav, '/favorites.html', 'http://localhost/');

    const [home, favorites] = nav.querySelectorAll('.nav-toggle__link');
    expect(home.hasAttribute('aria-current')).toBe(false);
    expect(favorites.getAttribute('aria-current')).toBe('page');
  });

  // Regression test: GitHub Pages project sites serve from a subpath
  // (e.g. /goit-advancedjs-final-project/), not the domain root. The old
  // implementation resolved relative hrefs against a fixed fake base
  // instead of the real document location, so neither link ever matched
  // on a subpath deployment — this covers that exact scenario.
  it('marks the correct link active when served from a subpath, not just the domain root', () => {
    const nav = renderNav();
    const base = 'http://localhost/goit-advancedjs-final-project/';

    markActiveNavLink(nav, '/goit-advancedjs-final-project/', base);
    let [home, favorites] = nav.querySelectorAll('.nav-toggle__link');
    expect(home.classList.contains('is-active')).toBe(true);
    expect(favorites.classList.contains('is-active')).toBe(false);

    markActiveNavLink(nav, '/goit-advancedjs-final-project/favorites.html', base);
    [home, favorites] = nav.querySelectorAll('.nav-toggle__link');
    expect(home.classList.contains('is-active')).toBe(false);
    expect(favorites.classList.contains('is-active')).toBe(true);
  });
});
