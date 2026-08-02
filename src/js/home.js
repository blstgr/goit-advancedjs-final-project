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
  const titleEl = sectionEl.querySelector('[data-exercises-title]');
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

  paginationEl.addEventListener('click', (event) => {
    const pageBtn = event.target.closest('[data-page]');
    if (!pageBtn || pageBtn.disabled) return;

    state = setPage(state, Number(pageBtn.dataset.page));
    render();
  });

  async function render() {
    backBtn.hidden = !state.category;
    searchForm.hidden = !state.category;
    titleEl.textContent = state.category ?? 'Exercises';

    if (state.category) {
      await renderExercises();
    } else {
      await renderCategories();
    }
  }

  async function renderCategories() {
    paginationEl.hidden = true;
    paginationEl.innerHTML = '';

    const data = await fetchFilters({ filter: state.filter, page: 1, limit: CATEGORIES_PAGE_SIZE });
    const categories = data.results ?? [];

    emptyEl.hidden = categories.length > 0;
    gridEl.innerHTML = categories
      .map((category) =>
        createCategoryCardHtml({
          name: category.name,
          filter: category.filter,
          imageUrl: category.imgURL,
        })
      )
      .join('');
  }

  async function renderExercises() {
    const query = toExercisesQuery(state);
    const data = await fetchExercises(query);

    currentExercises = (data.results ?? []).map(mapExercise);

    emptyEl.hidden = currentExercises.length > 0;
    gridEl.innerHTML = currentExercises.map((exercise) => createExerciseCardHtml(exercise)).join('');
    gridEl.querySelectorAll('[data-rating]').forEach(renderRating);

    const paginationHtml = createPaginationHtml(data.page ?? state.page, data.totalPages ?? 1);
    paginationEl.hidden = !paginationHtml;
    paginationEl.innerHTML = paginationHtml;
  }

  render();
}
