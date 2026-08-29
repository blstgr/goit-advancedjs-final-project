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

export function fetchQuote() {
  return requestJson(`${API_BASE_URL}/quote`);
}

export function rateExercise(id, { rate, email, comment } = {}) {
  return requestJson(`${API_BASE_URL}/exercises/${id}/rating`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    // The API's field for the comment text is `review`, not `comment` — sending
    // `comment` gets a 400 ("comment is not allowed"). Renamed only at this
    // boundary so the rest of the app can keep calling it `comment`.
    body: JSON.stringify({ rate, email, review: comment }),
  });
}

export function subscribe(email) {
  return requestJson(`${API_BASE_URL}/subscription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}
