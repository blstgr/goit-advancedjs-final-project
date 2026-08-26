import { describe, it, expect, beforeEach } from 'vitest';
import { initSearch } from './search.js';

function renderSearchForm() {
  document.body.innerHTML = `
    <form data-search-form>
      <input data-search-input value="" />
      <button type="button" data-search-clear></button>
    </form>
  `;
  return document.querySelector('[data-search-form]');
}

describe('initSearch', () => {
  let form;
  let input;
  let clearBtn;

  beforeEach(() => {
    form = renderSearchForm();
    input = form.querySelector('[data-search-input]');
    clearBtn = form.querySelector('[data-search-clear]');
    initSearch(form);
  });

  it('starts without the has-value modifier when input is empty', () => {
    expect(form.classList.contains('search--has-value')).toBe(false);
  });

  it('adds the has-value modifier once the user types', () => {
    input.value = 'squat';
    input.dispatchEvent(new Event('input'));

    expect(form.classList.contains('search--has-value')).toBe(true);
  });

  it('clears the input and removes the modifier when the clear button is clicked', () => {
    input.value = 'squat';
    input.dispatchEvent(new Event('input'));

    clearBtn.click();

    expect(input.value).toBe('');
    expect(form.classList.contains('search--has-value')).toBe(false);
  });

  it('submits the (now-empty) form when the clear button is clicked, so callers can reset filtered results', () => {
    input.value = 'squat';
    let submittedValue = 'not called';
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      submittedValue = input.value;
    });

    clearBtn.click();

    expect(submittedValue).toBe('');
  });
});
