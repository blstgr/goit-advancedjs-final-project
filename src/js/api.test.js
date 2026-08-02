import { describe, it, expect } from 'vitest';
import { buildQueryString } from './api.js';

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
