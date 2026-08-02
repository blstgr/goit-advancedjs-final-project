export function initHeaderBurger() {
  const burger = document.querySelector('.header__burger');
  const nav = document.querySelector('.header__nav');

  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';

    burger.setAttribute('aria-expanded', String(!isOpen));
    nav.classList.toggle('is-open', !isOpen);
  });
}

function normalizePath(path) {
  return path === '/index.html' ? '/' : path;
}

export function markActiveNavLink(navEl, pathname) {
  const links = navEl.querySelectorAll('.nav-toggle__link');

  links.forEach((link) => {
    const linkPath = new URL(link.getAttribute('href'), 'http://localhost').pathname;
    link.classList.toggle('is-active', normalizePath(linkPath) === normalizePath(pathname));
  });
}

export function initHeaderActiveNav(pathname = window.location.pathname) {
  const nav = document.querySelector('.header__nav .nav-toggle');
  if (nav) markActiveNavLink(nav, pathname);
}
