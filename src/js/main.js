import { initHeaderBurger, initHeaderActiveNav } from './header.js';
import { initAllSubscribeForms } from './footer.js';
import { initExerciseModal } from './exercise-modal.js';
import { initRatingPopup } from './rating-popup.js';
import { initQuote } from './quote.js';
import { initHomePage } from './home.js';
import { initFavoritesPage } from './favorites.js';
import { initAllRatings } from './rating.js';
import { initAllFilters } from './filters.js';
import { initAllSearchForms } from './search.js';
import { initAllNavToggles } from './nav-toggle.js';
import { createPaginationHtml } from './templates/pagination.js';
import { subscribe, fetchQuote, rateExercise } from './api.js';

initHeaderBurger();
initHeaderActiveNav();
initAllSubscribeForms(subscribe);
initAllRatings();
initAllFilters();
initAllSearchForms();
initAllNavToggles();

// The rating popup opens on top of the exercise modal, which hides itself
// while the popup is up — showExerciseModal is filled in once modalController
// exists below, but ratingPopup must be created first since exercise-modal
// needs a reference to it. Same deal for refreshFavoritesGrid: the favorites
// page (if present) is created after the modal, but the modal needs to be
// able to tell it to re-render when a favorite is toggled from inside it.
let showExerciseModal = () => {};
let refreshFavoritesGrid = () => {};

const ratingPopupRoot = document.querySelector('[data-rating-popup]');
const ratingPopupController = ratingPopupRoot
  ? initRatingPopup(ratingPopupRoot, { rate: rateExercise, onClose: () => showExerciseModal() })
  : null;

const modalRoot = document.querySelector('[data-exercise-modal]');
const modalController = modalRoot
  ? initExerciseModal(modalRoot, {
      ratingPopup: ratingPopupController,
      onFavoriteChange: () => refreshFavoritesGrid(),
    })
  : null;

if (modalController) {
  showExerciseModal = modalController.show;
}

const quoteEl = document.querySelector('[data-quote]');
if (quoteEl) {
  initQuote(quoteEl, { fetchQuote });
}

const homeSection = document.querySelector('[data-exercises-section]');
if (homeSection && modalController) {
  initHomePage({ sectionEl: homeSection, modalController });
}

const paginationDemoEl = document.querySelector('[data-pagination]');
if (paginationDemoEl) {
  paginationDemoEl.innerHTML = createPaginationHtml(1, 3);
}

const favoritesSection = document.querySelector('[data-favorites-section]');
if (favoritesSection && modalController) {
  const favoritesController = initFavoritesPage({
    gridEl: favoritesSection.querySelector('[data-favorites-grid]'),
    emptyEl: favoritesSection.querySelector('[data-favorites-empty]'),
    modalController,
  });
  refreshFavoritesGrid = favoritesController.render;
}
