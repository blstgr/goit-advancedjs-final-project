import { describe, it, expect, beforeEach } from 'vitest';
import {
  getFavorites,
  isFavorite,
  addFavorite,
  removeFavorite,
  toggleFavorite,
} from './favorites-store.js';

function createMemoryStorage() {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, value),
  };
}

const EXERCISE = { id: 'ex-1', name: 'Push-up' };

describe('favorites-store', () => {
  let storage;

  beforeEach(() => {
    storage = createMemoryStorage();
  });

  it('starts empty', () => {
    expect(getFavorites(storage)).toEqual([]);
    expect(isFavorite('ex-1', storage)).toBe(false);
  });

  it('adds an exercise to favorites', () => {
    addFavorite(EXERCISE, storage);

    expect(isFavorite('ex-1', storage)).toBe(true);
    expect(getFavorites(storage)).toEqual([EXERCISE]);
  });

  it('does not duplicate an exercise already favorited', () => {
    addFavorite(EXERCISE, storage);
    addFavorite(EXERCISE, storage);

    expect(getFavorites(storage)).toHaveLength(1);
  });

  it('removes an exercise from favorites', () => {
    addFavorite(EXERCISE, storage);
    removeFavorite('ex-1', storage);

    expect(isFavorite('ex-1', storage)).toBe(false);
    expect(getFavorites(storage)).toEqual([]);
  });

  it('toggleFavorite adds when absent and removes when present', () => {
    toggleFavorite(EXERCISE, storage);
    expect(isFavorite('ex-1', storage)).toBe(true);

    toggleFavorite(EXERCISE, storage);
    expect(isFavorite('ex-1', storage)).toBe(false);
  });

  it('recovers gracefully from corrupted storage content', () => {
    storage.setItem('yourEnergyFavorites', '{not valid json');

    expect(getFavorites(storage)).toEqual([]);
  });
});
