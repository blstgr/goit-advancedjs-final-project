import '../css/main.css';

import { initHeaderBurger, initHeaderActiveNav } from './header.js';
import { initAllSubscribeForms } from './footer.js';
import { initExerciseModal } from './exercise-modal.js';
import { initQuote } from './quote.js';
import { initHomePage } from './home.js';
import { initFavoritesPage } from './favorites.js';
import { subscribe, fetchQuote } from './api.js';

initHeaderBurger();
initHeaderActiveNav();
initAllSubscribeForms(subscribe);

const modalRoot = document.querySelector('[data-exercise-modal]');
const modalController = modalRoot ? initExerciseModal(modalRoot) : null;

const quoteEl = document.querySelector('[data-quote]');
if (quoteEl) {
  initQuote(quoteEl, { fetchQuote });
}

const homeSection = document.querySelector('[data-exercises-section]');
if (homeSection && modalController) {
  initHomePage({ sectionEl: homeSection, modalController });
}

const favoritesSection = document.querySelector('[data-favorites-section]');
if (favoritesSection && modalController) {
  initFavoritesPage({
    gridEl: favoritesSection.querySelector('[data-favorites-grid]'),
    emptyEl: favoritesSection.querySelector('[data-favorites-empty]'),
    modalController,
  });
}
