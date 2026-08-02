export function initSubscribeForm(form, { subscribe }) {
  const messageEl = form.querySelector('[data-subscribe-message]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const email = new FormData(form).get('email')?.toString().trim();

    try {
      await subscribe(email);
      if (messageEl) messageEl.textContent = 'Дякуємо за підписку!';
      form.reset();
    } catch {
      if (messageEl) messageEl.textContent = 'Щось пішло не так. Спробуйте ще раз.';
    }
  });
}

export function initAllSubscribeForms(subscribe) {
  document.querySelectorAll('[data-subscribe-form]').forEach((form) =>
    initSubscribeForm(form, { subscribe })
  );
}
