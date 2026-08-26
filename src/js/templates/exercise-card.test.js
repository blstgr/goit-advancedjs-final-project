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
  it('renders the exercise data', () => {
    const html = createExerciseCardHtml(BASE);

    expect(html).toContain('Push-up');
    expect(html).toContain('Chest');
    expect(html).toContain('Pectorals');
    expect(html).toContain('8 / 3 min');
    expect(html).toContain('data-rating="4"');
  });

  it('makes the whole card clickable and keyboard-focusable, wired to the exercise id — not just the Start text', () => {
    const html = createExerciseCardHtml(BASE);
    const container = document.createElement('div');
    container.innerHTML = html;
    const card = container.querySelector('.exercise-card');

    expect(card.dataset.openExercise).toBe('ex-1');
    expect(card.getAttribute('role')).toBe('button');
    expect(card.getAttribute('tabindex')).toBe('0');
    expect(card.querySelector('.exercise-card__start[data-open-exercise]')).toBeNull();
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
