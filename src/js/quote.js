const STORAGE_KEY = 'yourEnergyQuoteOfTheDay';
const QUOTE_API_URL = 'https://your-energy.b.goit.study/api/quote';

export function getTodayDateKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function readCachedQuote(storage = window.localStorage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeCachedQuote(quote, storage = window.localStorage, date = new Date()) {
  storage.setItem(STORAGE_KEY, JSON.stringify({ ...quote, date: getTodayDateKey(date) }));
}

export function isCacheFresh(cached, date = new Date()) {
  return Boolean(cached && cached.date === getTodayDateKey(date));
}

async function fetchQuoteFromApi() {
  const response = await fetch(QUOTE_API_URL);
  if (!response.ok) {
    throw new Error(`Quote request failed with status ${response.status}`);
  }
  return response.json();
}

function renderQuote(el, quote) {
  const textEl = el.querySelector('[data-quote-text]');
  const authorEl = el.querySelector('[data-quote-author]');

  if (textEl) textEl.textContent = quote?.quote ?? '';
  if (authorEl) authorEl.textContent = quote?.author ?? '';
}

export async function initQuote(
  el,
  { fetchQuote = fetchQuoteFromApi, storage = window.localStorage, date = new Date() } = {}
) {
  const cached = readCachedQuote(storage);

  if (isCacheFresh(cached, date)) {
    renderQuote(el, cached);
    return cached;
  }

  const quote = await fetchQuote();
  writeCachedQuote(quote, storage, date);
  renderQuote(el, quote);
  return quote;
}
