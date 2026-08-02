export const DEFAULT_FILTER = 'Muscles';
export const PAGE_SIZE = 10;

const FILTER_TO_QUERY_KEY = {
  Muscles: 'muscles',
  'Body parts': 'bodypart',
  Equipment: 'equipment',
};

export function filterToQueryKey(filter) {
  const key = FILTER_TO_QUERY_KEY[filter];
  if (!key) {
    throw new Error(`Unknown filter: ${filter}`);
  }
  return key;
}

export function createInitialState() {
  return {
    filter: DEFAULT_FILTER,
    category: null,
    keyword: '',
    page: 1,
  };
}

export function setFilter(state, filter) {
  return { ...state, filter, category: null, keyword: '', page: 1 };
}

export function selectCategory(state, category) {
  return { ...state, category, keyword: '', page: 1 };
}

export function clearCategory(state) {
  return { ...state, category: null, keyword: '', page: 1 };
}

export function setKeyword(state, keyword) {
  return { ...state, keyword, page: 1 };
}

export function setPage(state, page) {
  return { ...state, page };
}

export function toExercisesQuery(state) {
  if (!state.category) return null;

  return {
    [filterToQueryKey(state.filter)]: state.category,
    keyword: state.keyword || undefined,
    page: state.page,
    limit: PAGE_SIZE,
  };
}
