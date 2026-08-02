import { describe, it, expect } from 'vitest';
import { createExerciseCardHtml } from './exercise-card.js';

const BASE = {
  id: 'ex-1',
  name: 'Push-up',
  bodyPart: 'Chest',
  target: 'Pectorals',
  burnedCalories: 8,
  rating: 4,
};

describe('createExerciseCardHtml', () => {
  it('renders the exercise data and a Start button wired to the exercise id', () => {
    const html = createExerciseCardHtml(BASE);

    expect(html).toContain('Push-up');
    expect(html).toContain('Chest');
    expect(html).toContain('Pectorals');
    expect(html).toContain('8/3 min');
    expect(html).toContain('data-open-exercise="ex-1"');
    expect(html).toContain('data-rating="4"');
  });

  it('omits the remove-from-favorites button by default', () => {
    const html = createExerciseCardHtml(BASE);

    expect(html).not.toContain('data-remove-favorite');
  });

  it('includes a remove-from-favorites button when showRemoveFromFavorites is true', () => {
    const html = createExerciseCardHtml({ ...BASE, showRemoveFromFavorites: true });

    expect(html).toContain('data-remove-favorite="ex-1"');
  });

  it('escapes HTML-sensitive characters in exercise data', () => {
    const html = createExerciseCardHtml({ ...BASE, name: '<img src=x onerror=alert(1)>' });

    expect(html).not.toContain('<img src=x');
    expect(html).toContain('&lt;img');
  });
});
