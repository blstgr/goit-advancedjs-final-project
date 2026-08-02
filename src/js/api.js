const API_BASE_URL = 'https://your-energy.b.goit.study/api';

async function requestJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Request to ${url} failed with status ${response.status}`);
  }
  return response.json();
}

export function buildQueryString(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export function fetchFilters({ filter, page, limit } = {}) {
  return requestJson(`${API_BASE_URL}/filters${buildQueryString({ filter, page, limit })}`);
}

export function fetchExercises({ bodypart, muscles, equipment, keyword, page, limit } = {}) {
  return requestJson(
    `${API_BASE_URL}/exercises${buildQueryString({ bodypart, muscles, equipment, keyword, page, limit })}`
  );
}

export function fetchExerciseById(id) {
  return requestJson(`${API_BASE_URL}/exercises/${id}`);
}

export function fetchQuote() {
  return requestJson(`${API_BASE_URL}/quote`);
}

export function rateExercise(id, rate) {
  return requestJson(`${API_BASE_URL}/exercises/${id}/rating`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rate }),
  });
}

export function subscribe(email) {
  return requestJson(`${API_BASE_URL}/subscription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}
