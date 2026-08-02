import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTodayDateKey, isCacheFresh, initQuote } from './quote.js';

function createMemoryStorage() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, value),
  };
}

function renderQuoteWidget() {
  document.body.innerHTML = `
    <div class="quote">
      <p data-quote-text></p>
      <span data-quote-author></span>
    </div>
  `;
  return document.querySelector('.quote');
}

describe('isCacheFresh', () => {
  it('is false when there is no cached quote', () => {
    expect(isCacheFresh(null, new Date('2026-08-03'))).toBe(false);
  });

  it('is true when the cached date matches today', () => {
    const today = new Date('2026-08-03T10:00:00Z');
    expect(isCacheFresh({ date: getTodayDateKey(today) }, today)).toBe(true);
  });

  it('is false when the cached date is a previous day', () => {
    const cached = { date: '2026-08-02' };
    expect(isCacheFresh(cached, new Date('2026-08-03T10:00:00Z'))).toBe(false);
  });
});

describe('initQuote', () => {
  let el;
  let storage;

  beforeEach(() => {
    el = renderQuoteWidget();
    storage = createMemoryStorage();
  });

  it('fetches and caches a quote when nothing is cached yet', async () => {
    const fetchQuote = vi.fn().mockResolvedValue({ quote: 'Just move.', author: 'YourEnergy' });
    const date = new Date('2026-08-03T09:00:00Z');

    await initQuote(el, { fetchQuote, storage, date });

    expect(fetchQuote).toHaveBeenCalledTimes(1);
    expect(el.querySelector('[data-quote-text]').textContent).toBe('Just move.');
    expect(JSON.parse(storage.getItem('yourEnergyQuoteOfTheDay')).date).toBe('2026-08-03');
  });

  it('does not call the backend again on the same day', async () => {
    const fetchQuote = vi.fn().mockResolvedValue({ quote: 'Just move.', author: 'YourEnergy' });
    const date = new Date('2026-08-03T09:00:00Z');

    await initQuote(el, { fetchQuote, storage, date });
    await initQuote(el, { fetchQuote, storage, date });

    expect(fetchQuote).toHaveBeenCalledTimes(1);
  });

  it('fetches again once the date has changed', async () => {
    const fetchQuote = vi
      .fn()
      .mockResolvedValueOnce({ quote: 'Day one.', author: 'A' })
      .mockResolvedValueOnce({ quote: 'Day two.', author: 'B' });

    await initQuote(el, { fetchQuote, storage, date: new Date('2026-08-03T09:00:00Z') });
    await initQuote(el, { fetchQuote, storage, date: new Date('2026-08-04T09:00:00Z') });

    expect(fetchQuote).toHaveBeenCalledTimes(2);
    expect(el.querySelector('[data-quote-text]').textContent).toBe('Day two.');
  });
});
