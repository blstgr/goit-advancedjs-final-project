/**
 * Adapts the backend's raw exercise shape (_id, gifUrl, ...) to the flat
 * shape our card/modal templates expect. Isolated so a backend field-name
 * drift breaks one small tested function instead of silently breaking cards.
 */
export function mapExercise(raw) {
  return {
    id: raw._id,
    name: raw.name,
    bodyPart: raw.bodyPart,
    target: raw.target,
    equipment: raw.equipment,
    burnedCalories: raw.burnedCalories,
    rating: raw.rating,
    popularity: raw.popularity,
    description: raw.description,
    gifUrl: raw.gifUrl,
  };
}
