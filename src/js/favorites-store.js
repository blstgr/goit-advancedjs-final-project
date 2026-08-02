const STORAGE_KEY = 'yourEnergyFavorites';

function readAll(storage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(list, storage) {
  storage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getFavorites(storage = window.localStorage) {
  return readAll(storage);
}

export function isFavorite(id, storage = window.localStorage) {
  return readAll(storage).some((exercise) => exercise.id === id);
}

export function addFavorite(exercise, storage = window.localStorage) {
  const list = readAll(storage);
  if (list.some((item) => item.id === exercise.id)) return list;

  const next = [...list, exercise];
  writeAll(next, storage);
  return next;
}

export function removeFavorite(id, storage = window.localStorage) {
  const next = readAll(storage).filter((item) => item.id !== id);
  writeAll(next, storage);
  return next;
}

export function toggleFavorite(exercise, storage = window.localStorage) {
  return isFavorite(exercise.id, storage)
    ? removeFavorite(exercise.id, storage)
    : addFavorite(exercise, storage);
}
