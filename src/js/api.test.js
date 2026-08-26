import { describe, it, expect, vi, afterEach } from 'vitest';
import { buildQueryString, rateExercise } from './api.js';

describe('buildQueryString', () => {
  it('returns an empty string when there are no params', () => {
    expect(buildQueryString({})).toBe('');
    expect(buildQueryString()).toBe('');
  });

  it('omits undefined, null and empty-string values', () => {
    expect(buildQueryString({ page: 1, keyword: undefined, bodypart: null, equipment: '' })).toBe(
      '?page=1'
    );
  });

  it('keeps falsy-but-meaningful values like 0', () => {
    expect(buildQueryString({ page: 0 })).toBe('?page=0');
  });

  it('URL-encodes values with spaces', () => {
    expect(buildQueryString({ filter: 'Body parts' })).toBe('?filter=Body+parts');
  });

  it('combines multiple params with &', () => {
    const query = buildQueryString({ bodypart: 'back', page: 1, limit: 10 });
    expect(query).toBe('?bodypart=back&page=1&limit=10');
  });
});

describe('rateExercise', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sends the comment under the API\'s "review" field, not "comment"', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({}) });
    vi.stubGlobal('fetch', fetchMock);

    await rateExercise('ex-1', { rate: 5, email: 'a@b.com', comment: 'great' });

    const [, options] = fetchMock.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body).toEqual({ rate: 5, email: 'a@b.com', review: 'great' });
    expect(body.comment).toBeUndefined();
  });
});
