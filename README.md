# YourEnergy

Фітнес-застосунок для курсового командного проєкту **Advanced JavaScript and TypeScript: Tools and Best Practices** (GoIT). Технічне завдання й прогрес — у [`SPECS.md`](./SPECS.md).

> Проєкт заплановано як командний, але виконаний одноосібно — усі коміти й pull request'и належать одному учаснику, який поєднав ролі розробника, Team Lead та Scrum Master.

## Стек

Vite, vanilla HTML/CSS/JS, [`modern-normalize`](https://github.com/sindresorhus/modern-normalize), [`vite-plugin-html-inject`](https://github.com/donnikitos/vite-plugin-html-inject) для HTML-партиалів, [Vitest](https://vitest.dev/) для юніт-тестів. Backend — готовий API: `https://your-energy.b.goit.study/api` ([`api-docs`](https://your-energy.b.goit.study/api-docs)).

## Команди

```bash
npm install       # встановити залежності
npm run dev       # dev-сервер з HMR
npm run build     # продакшн-збірка в dist/
npm run preview   # локальний перегляд збірки
npm run test      # прогнати всі тести один раз
npm run test:watch  # тести у watch-режимі
npm run format    # prettier --write .
```

## Сторінки

| Файл | Опис |
|---|---|
| `index.html` | Home — hero, фільтри (Muscles/Body parts/Equipment) → категорії → вправи, пошук, пагінація, цитата дня |
| `favorites.html` | Улюблені вправи (localStorage) |
| `ui-kit.html` | Довідка по компонентах команди — не є частиною публічної навігації (`noindex`) |

## Структура

Компонентна бібліотека: кожен UI-елемент має власний CSS-файл у `src/css/components/`, за потреби — HTML-партиал у `src/partials/` і JS-модуль у `src/js/`. Дизайн-токени (кольори, шрифти, радіуси, відступи, розміри іконок) — у `src/css/variables.css`; нове значення в CSS має братися з токена, а не хардкодитись. Детальніше — [`SPECS.md` §2.2](./SPECS.md#22-компонентна-архітектура).

Сторінки складаються з партиалів через `<load src="..." />`, а не переписуються з нуля.

## Тести

Vitest + jsdom. Покриваються модулі зі станом чи рішеннями (localStorage, toggle-логіка, побудова query-параметрів, округлення рейтингу) — не чиста розмітка/стилі. Дивись існуючі `*.test.js` поряд з кожним модулем як приклад.
