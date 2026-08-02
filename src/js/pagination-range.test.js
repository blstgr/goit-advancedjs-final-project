import { describe, it, expect } from 'vitest';
import { getPaginationRange } from './pagination-range.js';

describe('getPaginationRange', () => {
  it('returns an empty list when there are no pages', () => {
    expect(getPaginationRange(1, 0)).toEqual([]);
  });

  it('shows every page when total fits within maxVisible', () => {
    expect(getPaginationRange(1, 3)).toEqual([1, 2, 3]);
  });

  it('has no leading ellipsis when near the start', () => {
    expect(getPaginationRange(1, 20)).toEqual([1, 2, 3, 4, 5, '...', 20]);
  });

  it('has no trailing ellipsis when near the end', () => {
    expect(getPaginationRange(20, 20)).toEqual([1, '...', 16, 17, 18, 19, 20]);
  });

  it('has both ellipses when the current page is in the middle', () => {
    expect(getPaginationRange(10, 20)).toEqual([1, '...', 8, 9, 10, 11, 12, '...', 20]);
  });

  it('never produces a range wider than the total page count', () => {
    const range = getPaginationRange(3, 4);
    expect(range.filter((item) => item !== '...')).toEqual([1, 2, 3, 4]);
  });
});
