import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initHomePage } from './home.js';
import { fetchFilters, fetchExercises } from './api.js';

vi.mock('./api.js', () => ({
  fetchFilters: vi.fn(),
  fetchExercises: vi.fn(),
}));

function renderSection() {
  document.body.innerHTML = `
    <section data-exercises-section>
      <button data-exercises-back>Exercises</button>
      <span data-exercises-slash hidden>/</span>
      <span data-exercises-category hidden></span>

      <form data-search-form hidden>
        <input name="keyword" data-search-input />
      </form>

      <div data-filters>
        <button class="is-active" data-filter="Muscles">Muscles</button>
        <button data-filter="Body parts">Body parts</button>
      </div>

      <p data-exercises-empty hidden>Nothing found.</p>
      <div data-exercises-grid></div>
      <nav data-exercises-pagination hidden></nav>
    </section>
  `;
  return document.querySelector('[data-exercises-section]');
}

function deferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function flush() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

const CATEGORY = { name: 'Abs', filter: 'Muscles', imgURL: 'abs.jpg' };

function exercise(id) {
  return { _id: id, name: id, bodyPart: 'core', target: 'abs', burnedCalories: 10 };
}

describe('initHomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders categories on initial load', async () => {
    fetchFilters.mockResolvedValue({ results: [CATEGORY], page: 1, totalPages: 1 });
    const sectionEl = renderSection();

    initHomePage({ sectionEl, modalController: { open: vi.fn() } });
    await flush();

    expect(sectionEl.querySelector('[data-category-name="Abs"]')).toBeTruthy();
  });

  it('discards a slower, superseded exercises response instead of letting it overwrite the newer one', async () => {
    fetchFilters.mockResolvedValue({ results: [CATEGORY], page: 1, totalPages: 1 });
    const staleFetch = deferred();
    const freshFetch = deferred();
    fetchExercises.mockImplementationOnce(() => staleFetch.promise).mockImplementationOnce(() => freshFetch.promise);

    const sectionEl = renderSection();
    initHomePage({ sectionEl, modalController: { open: vi.fn() } });
    await flush();

    // Selecting a category kicks off the first (soon-to-be-stale) exercises fetch.
    sectionEl.querySelector('[data-category-name="Abs"]').click();
    await flush();

    // Submitting a search kicks off a second, superseding exercises fetch
    // before the first one has resolved.
    sectionEl.querySelector('[data-search-form]').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await flush();

    // The newer request resolves first...
    freshFetch.resolve({ results: [exercise('fresh')], page: 1, totalPages: 1 });
    await flush();

    // ...then the older, now-stale request finally resolves too.
    staleFetch.resolve({ results: [exercise('stale')], page: 1, totalPages: 1 });
    await flush();

    const gridEl = sectionEl.querySelector('[data-exercises-grid]');
    expect(gridEl.querySelector('[data-open-exercise="fresh"]')).toBeTruthy();
    expect(gridEl.querySelector('[data-open-exercise="stale"]')).toBeNull();
  });

  it('shows an error message and clears the grid when a fetch fails', async () => {
    fetchFilters.mockRejectedValueOnce(new Error('network down'));
    const sectionEl = renderSection();

    initHomePage({ sectionEl, modalController: { open: vi.fn() } });
    await flush();

    const emptyEl = sectionEl.querySelector('[data-exercises-empty]');
    expect(emptyEl.hidden).toBe(false);
    expect(emptyEl.textContent).toMatch(/went wrong/i);
    expect(sectionEl.querySelector('[data-exercises-grid]').innerHTML).toBe('');
  });

  it('restores the normal empty-state message on a later successful render after an error', async () => {
    fetchFilters.mockRejectedValueOnce(new Error('network down'));
    fetchFilters.mockResolvedValueOnce({ results: [], page: 1, totalPages: 1 });
    const sectionEl = renderSection();

    initHomePage({ sectionEl, modalController: { open: vi.fn() } });
    await flush();

    sectionEl.querySelector('[data-filter="Body parts"]').dispatchEvent(
      new CustomEvent('filterchange', { detail: { filter: 'Body parts' }, bubbles: true })
    );
    await flush();

    const emptyEl = sectionEl.querySelector('[data-exercises-empty]');
    expect(emptyEl.hidden).toBe(false);
    expect(emptyEl.textContent).toBe('Nothing found.');
  });
});
