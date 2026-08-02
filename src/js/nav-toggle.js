export function initNavToggle(nav) {
  const links = nav.querySelectorAll('.nav-toggle__link');

  nav.addEventListener('click', (event) => {
    const link = event.target.closest('.nav-toggle__link');
    if (!link || !nav.contains(link)) return;

    if (link.getAttribute('href') === '#') {
      event.preventDefault();
    }

    links.forEach((el) => el.classList.toggle('is-active', el === link));
  });
}

export function initAllNavToggles() {
  document.querySelectorAll('[data-nav-toggle]').forEach(initNavToggle);
}
