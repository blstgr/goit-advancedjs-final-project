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
  return path.endsWith('/index.html') ? path.slice(0, -'index.html'.length) : path;
}

export function markActiveNavLink(navEl, pathname, base = document.baseURI) {
  const links = navEl.querySelectorAll('.nav-toggle__link');

  links.forEach((link) => {
    const linkPath = new URL(link.getAttribute('href'), base).pathname;
    const isActive = normalizePath(linkPath) === normalizePath(pathname);
    link.classList.toggle('is-active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

export function initHeaderActiveNav(pathname = window.location.pathname) {
  const nav = document.querySelector('.header__nav .nav-toggle');
  if (nav) markActiveNavLink(nav, pathname);
}
