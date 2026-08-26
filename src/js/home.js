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

  // The exercise card is a non-native `role="button"` (it can't be a real
  // <button> — it contains the nested favorite/remove-favorite button, and
  // buttons can't nest), so Enter/Space activation has to be wired manually.
  gridEl.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (event.target.closest('[data-remove-favorite]')) return;
    const trigger = event.target.closest('[data-open-exercise]');
    if (!trigger) return;

    event.preventDefault();
    trigger.click();
  });

  paginationEl.addEventListener('click', (event) => {
    const pageBtn = event.target.closest('[data-page]');
    if (!pageBtn) return;

    state = setPage(state, Number(pageBtn.dataset.page));
    render();
  });

  async function render() {
    if (state.category) {
      await renderExercises();
    } else {
      await renderCategories();
    }
  }

  async function renderCategories() {
    const data = await fetchFilters({ filter: state.filter, page: state.page, limit: CATEGORIES_PAGE_SIZE });
    const categories = data.results ?? [];

    searchForm.hidden = true;
    slashEl.hidden = true;
    categoryEl.hidden = true;
    categoryEl.textContent = '';

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

  async function renderExercises() {
    const query = toExercisesQuery(state);
    const data = await fetchExercises(query);

    currentExercises = (data.results ?? []).map(mapExercise);

    searchForm.hidden = false;
    slashEl.hidden = false;
    categoryEl.hidden = false;
    categoryEl.textContent = state.category;

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
