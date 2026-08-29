// Exercise cards are a non-native `role="button"` (they can't be a real
// <button> — the favorites-page variant nests a remove-favorite button, and
// buttons can't nest), so Enter/Space activation has to be wired manually.
export function bindCardKeyboardActivation(gridEl) {
  gridEl.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    if (event.target.closest('[data-remove-favorite]')) return;
    const trigger = event.target.closest('[data-open-exercise]');
    if (!trigger) return;

    event.preventDefault();
    trigger.click();
  });
}
