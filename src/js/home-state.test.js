import { describe, it, expect } from 'vitest';
import {
  createInitialState,
  setFilter,
  selectCategory,
  clearCategory,
  setKeyword,
  setPage,
  toExercisesQuery,
  filterToQueryKey,
} from './home-state.js';

describe('createInitialState', () => {
  it('defaults to the Muscles filter with no category selected', () => {
    expect(createInitialState()).toEqual({
      filter: 'Muscles',
      category: null,
      keyword: '',
      page: 1,
    });
  });
});

describe('filterToQueryKey', () => {
  it('maps each known filter name to its API query param', () => {
    expect(filterToQueryKey('Muscles')).toBe('muscles');
    expect(filterToQueryKey('Body parts')).toBe('bodypart');
    expect(filterToQueryKey('Equipment')).toBe('equipment');
  });

  it('throws for an unknown filter rather than silently querying the wrong param', () => {
    expect(() => filterToQueryKey('Nope')).toThrow();
  });
});

describe('state transitions', () => {
  it('setFilter resets category, keyword and page', () => {
    const state = { filter: 'Muscles', category: 'abs', keyword: 'pull', page: 3 };
    expect(setFilter(state, 'Equipment')).toEqual({
      filter: 'Equipment',
      category: null,
      keyword: '',
      page: 1,
    });
  });

  it('selectCategory sets the category and resets keyword/page', () => {
    const state = { filter: 'Muscles', category: null, keyword: 'old', page: 2 };
    expect(selectCategory(state, 'abs')).toEqual({
      filter: 'Muscles',
      category: 'abs',
      keyword: '',
      page: 1,
    });
  });

  it('clearCategory returns to the category grid', () => {
    const state = { filter: 'Muscles', category: 'abs', keyword: 'pull', page: 2 };
    expect(clearCategory(state).category).toBeNull();
  });

  it('setKeyword resets the page back to 1', () => {
    const state = { filter: 'Muscles', category: 'abs', keyword: '', page: 4 };
    expect(setKeyword(state, 'push')).toEqual({
      filter: 'Muscles',
      category: 'abs',
      keyword: 'push',
      page: 1,
    });
  });

  it('setPage only changes the page', () => {
    const state = { filter: 'Muscles', category: 'abs', keyword: 'push', page: 1 };
    expect(setPage(state, 3).page).toBe(3);
  });
});

describe('toExercisesQuery', () => {
  it('returns null when no category is selected yet', () => {
    expect(toExercisesQuery(createInitialState())).toBeNull();
  });

  it('builds a query using the correct param name for the active filter', () => {
    const state = { filter: 'Body parts', category: 'back', keyword: '', page: 2 };
    expect(toExercisesQuery(state)).toEqual({
      bodypart: 'back',
      keyword: undefined,
      page: 2,
      limit: 10,
    });
  });

  it('includes the keyword when one is set', () => {
    const state = { filter: 'Muscles', category: 'abs', keyword: 'pull', page: 1 };
    expect(toExercisesQuery(state)).toEqual({
      muscles: 'abs',
      keyword: 'pull',
      page: 1,
      limit: 10,
    });
  });
});
