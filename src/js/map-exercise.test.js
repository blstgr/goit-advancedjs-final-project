import { describe, it, expect } from 'vitest';
import { mapExercise } from './map-exercise.js';

describe('mapExercise', () => {
  it('maps the backend _id field to id', () => {
    const raw = {
      _id: '64f389465ae26083f39b18a1',
      name: 'dumbbell decline shrug',
      bodyPart: 'back',
      equipment: 'dumbbell',
      target: 'traps',
      gifUrl: 'https://ftp.goit.study/img/power-pulse/gifs/0305.gif',
      description: 'Located on the upper back and neck.',
      rating: 4.09,
      burnedCalories: 114,
      popularity: 3087,
    };

    const mapped = mapExercise(raw);

    expect(mapped.id).toBe('64f389465ae26083f39b18a1');
    expect(mapped).not.toHaveProperty('_id');
    expect(mapped.bodyPart).toBe('back');
    expect(mapped.rating).toBe(4.09);
    expect(mapped.gifUrl).toBe(raw.gifUrl);
  });
});
