# ПОТОК — лендинг магазина одежды

Одностраничный сайт на **Astro 5 + Tailwind CSS v4**. JS на клиенте ≈ 2 KB, CSS ≈ 13 KB (gzip).

## Запуск

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # сборка в dist/
npm run preview   # просмотр сборки
npm run check     # проверка типов
```

## Формы

Заявки отправляются на внешний сервис (Formspree, Web3Forms и т.п.).
Скопируйте `.env.example` в `.env` и укажите адрес:

```
PUBLIC_FORM_ENDPOINT=https://formspree.io/f/xxxxxxx
```

Без адреса формы работают в демо-режиме: данные выводятся в консоль браузера.

## Где что менять

- Тексты, товары, отзывы, FAQ, контакты — `src/data/`
- Цвета и шрифты — `src/styles/global.css` (блок `@theme`)
- Секции страницы — `src/components/sections/`
- Иллюстрации — `src/components/illustrations/`

Правила разработки — в [CLAUDE.md](CLAUDE.md).
