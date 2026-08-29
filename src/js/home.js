import { fetchFilters, fetchExercises } from './api.js';
import {
  createInitialState,
  setFilter,
  selectCategory,
  clearCategory,
  setKeyword,
  setPage,
  toExercisesQuery,
} from './home-state.js';
import { createCategoryCardHtml } from './templates/category-card.js';
import { createExerciseCardHtml } from './templates/exercise-card.js';
import { createPaginationHtml } from './templates/pagination.js';
import { mapExercise } from './map-exercise.js';
import { renderRating } from './rating.js';
import { bindCardKeyboardActivation } from './bind-card-keyboard-activation.js';

const CATEGORIES_PAGE_SIZE = 12;

export function initHomePage({ sectionEl, modalController }) {
  let state = createInitialState();
  let currentExercises = [];

  const filtersEl = sectionEl.querySelector('[data-filters]');
  const backBtn = sectionEl.querySelector('[data-exercises-back]');
  const slashEl = sectionEl.querySelector('[data-exercises-slash]');
  const categoryEl = sectionEl.querySelector('[data-exercises-category]');
  const searchForm = sectionEl.querySelector('[data-search-form]');
  const gridEl = sectionEl.querySelector('[data-exercises-grid]');
  const emptyEl = sectionEl.querySelector('[data-exercises-empty]');
  const paginationEl = sectionEl.querySelector('[data-exercises-pagination]');
  const emptyMessage = emptyEl.textContent;

  // Bumped on every render() call so a slower, superseded fetch can tell
  // (once it resolves) that a newer render has already taken over, and
  // skip applying its now-stale response instead of clobbering the UI.
  let renderToken = 0;

  // initFilters/initSearch are wired globally in main.js (initAllFilters/
  // initAllSearchForms) — this module only adds the fetch-on-change behavior.

  filtersEl.addEventListener('filterchange', (event) => {
    state = setFilter(state, event.detail.filter);
    render();
  });

  backBtn.addEventListener('click', () => {
    state = clearCategory(state);
    render();
  });

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const keyword = new FormData(searchForm).get('keyword')?.toString().trim() ?? '';
    state = setKeyword(state, keyword);
    render();
  });

  gridEl.addEventListener('click', (event) => {
    const categoryBtn = event.target.closest('[data-category-name]');
    if (categoryBtn) {
      state = selectCategory(state, categoryBtn.dataset.categoryName);
      render();
      return;
    }

    const openBtn = event.target.closest('[data-open-exercise]');
    if (openBtn) {
      const exercise = currentExercises.find((ex) => ex.id === openBtn.dataset.openExercise);
      if (exercise) modalController.open(exercise);
    }
  });

  bindCardKeyboardActivation(gridEl);

  paginationEl.addEventListener('click', (event) => {
    const pageBtn = event.target.closest('[data-page]');
    if (!pageBtn) return;

    state = setPage(state, Number(pageBtn.dataset.page));
    render();
  });

  function showError() {
    emptyEl.textContent = 'Something went wrong. Please try again.';
    emptyEl.hidden = false;
    gridEl.innerHTML = '';
    paginationEl.hidden = true;
    paginationEl.innerHTML = '';
  }

  async function render() {
    const token = ++renderToken;

    try {
      if (state.category) {
        await renderExercises(token);
      } else {
        await renderCategories(token);
      }
    } catch {
      if (token !== renderToken) return;
      showError();
    }
  }

  async function renderCategories(token) {
    const data = await fetchFilters({ filter: state.filter, page: state.page, limit: CATEGORIES_PAGE_SIZE });
    if (token !== renderToken) return;

    const categories = data.results ?? [];

    searchForm.hidden = true;
    slashEl.hidden = true;
    categoryEl.hidden = true;
    categoryEl.textContent = '';

    emptyEl.textContent = emptyMessage;
    emptyEl.hidden = categories.length > 0;
    gridEl.classList.remove('exercises__grid--list');
    gridEl.innerHTML = categories
      .map((category) =>
        createCategoryCardHtml({
          name: category.name,
          filter: category.filter,
          imageUrl: category.imgURL,
        })
      )
      .join('');

    const paginationHtml = createPaginationHtml(data.page ?? state.page, data.totalPages ?? 1);
    paginationEl.hidden = !paginationHtml;
    paginationEl.innerHTML = paginationHtml;
  }

  async function renderExercises(token) {
    const query = toExercisesQuery(state);
    const data = await fetchExercises(query);
    if (token !== renderToken) return;

    currentExercises = (data.results ?? []).map(mapExercise);

    searchForm.hidden = false;
    slashEl.hidden = false;
    categoryEl.hidden = false;
    categoryEl.textContent = state.category;

    emptyEl.textContent = emptyMessage;
    emptyEl.hidden = currentExercises.length > 0;
    gridEl.classList.add('exercises__grid--list');
    gridEl.innerHTML = currentExercises.map((exercise) => createExerciseCardHtml(exercise)).join('');
    gridEl.querySelectorAll('[data-rating]').forEach(renderRating);

    const paginationHtml = createPaginationHtml(data.page ?? state.page, data.totalPages ?? 1);
    paginationEl.hidden = !paginationHtml;
    paginationEl.innerHTML = paginationHtml;
  }

  render();
}
