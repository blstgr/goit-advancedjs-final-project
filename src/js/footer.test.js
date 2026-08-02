import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initSubscribeForm } from './footer.js';

function renderForm() {
  document.body.innerHTML = `
    <form data-subscribe-form>
      <input
        name="email"
        type="email"
        required
        pattern="^\\w+(\\.\\w+)?@[a-zA-Z_]+?\\.[a-zA-Z]{2,3}$"
      />
      <button type="submit">Send</button>
      <p data-subscribe-message></p>
    </form>
  `;
  return document.querySelector('[data-subscribe-form]');
}

function submitForm(form) {
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
}

describe('initSubscribeForm', () => {
  let form;
  let input;

  beforeEach(() => {
    form = renderForm();
    input = form.querySelector('input[name="email"]');
  });

  it('calls subscribe and shows a success message for a valid email', async () => {
    const subscribe = vi.fn().mockResolvedValue({});
    initSubscribeForm(form, { subscribe });

    input.value = 'student@goit.com';
    submitForm(form);
    await Promise.resolve();
    await Promise.resolve();

    expect(subscribe).toHaveBeenCalledWith('student@goit.com');
    expect(form.querySelector('[data-subscribe-message]').textContent).toContain('Дякуємо');
  });

  it('does not call subscribe for an email that fails the required pattern', async () => {
    const subscribe = vi.fn().mockResolvedValue({});
    initSubscribeForm(form, { subscribe });

    input.value = 'not-an-email';
    submitForm(form);
    await Promise.resolve();

    expect(subscribe).not.toHaveBeenCalled();
  });

  it('rejects a real .study address — the SPECS pattern only allows 2-3 letter TLDs', async () => {
    const subscribe = vi.fn().mockResolvedValue({});
    initSubscribeForm(form, { subscribe });

    input.value = 'student@goit.study';
    submitForm(form);
    await Promise.resolve();

    expect(subscribe).not.toHaveBeenCalled();
  });

  it('shows an error message when the request fails', async () => {
    const subscribe = vi.fn().mockRejectedValue(new Error('network error'));
    initSubscribeForm(form, { subscribe });

    input.value = 'student@goit.com';
    submitForm(form);
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();

    expect(form.querySelector('[data-subscribe-message]').textContent).toContain('не так');
  });
});
