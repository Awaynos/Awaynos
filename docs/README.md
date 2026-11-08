# Портфолио Awaynos

Одностраничный сайт-портфолио разработчика утилит для Windows: тёмная тема, акцентный мятный цвет, адаптив, интерактивный терминал, подробный разбор стека и плавные анимации.

**Сайт:** [awaynos.github.io/Awaynos](https://awaynos.github.io/Awaynos/) · **Telegram:** [канал](https://t.me/awadeveloper) · [чат](https://t.me/+c646yqHZzftmYTky)

## Структура

```
docs/
├─ index.html      # весь сайт: HTML + CSS + JavaScript
├─ README.md
└─ assets/         # логотип, иконки, OG-картинка и скриншоты (WebP/PNG)
```

Внешних зависимостей нет — только Google Fonts. Без интернета сайт откроется с системными шрифтами.

## Проекты на сайте

| Проект | Категория | Статус |
|---|---|---|
| QTranslate Remake | Desktop | релиз, 11 ★ |
| EFT Map Overlay | Desktop | релиз, 3 ★ |
| QMessages | Desktop | релиз, 1 ★ |
| Winnie Telegram Proxy | Telegram | релиз, MIT |
| Winnie Control Panel | Desktop | v1.4.2 |
| TelegramUsernames | Telegram | рабочий инструмент |
| Hive CRM | Web | MVP |

Всего 7 проектов. Проекты в разработке (QConsole, WinnieGram, Qcmd, tg-autopilot, SluConsole) намеренно не добавлены. Когда будут готовы — их легко добавить по инструкции ниже.

## Интерактив на странице

- **Командная палитра** (`Ctrl+K` / `Cmd+K`) — поиск по разделам, проектам и действиям: открыть GitHub, скопировать ссылку, перейти к терминалу, открыть случайный проект. Работает с клавиатуры (↑/↓/Enter/Esc).
- **Терминал в hero** — реальный ввод команд: `help`, `whoami`, `stack`, `projects`, `open qtranslate`, `contact`, `ls`, `pwd`, `clear`, `sudo`, `winnie`. Есть история команд (↑/↓), Ctrl+L и кнопки-подсказки.
- **Фильтры проектов** — с FLIP-анимацией перестроения и появлением новых карточек.
- **Разбор стека** — 5 вкладок с подробным описанием технологий и опыта; переключение мышью и стрелками клавиатуры.
- **Карточки проектов** — 3D-наклон, подсветка под курсором и параллакс изображения.
- **Магнитные кнопки** — CTA и кнопки в шапке слегка тянутся к курсору.
- **Плавности** — reveal-анимации с blur, плавающее свечение, параллакс hero, анимированный индикатор в навигации, счётчики.
- **Копирование ссылки** — кнопка в контактах с тостом.
- Всё уважает `prefers-reduced-motion` и отключает тяжёлые эффекты на тач-устройствах.

## Локальный запуск

Самый простой способ — открыть `docs/index.html` двойным кликом.

Если нужен локальный сервер:

```powershell
cd docs
python -m http.server 8000
```

Затем открыть `http://localhost:8000`.

## Как добавить или изменить проект

1. **Карточка** — найди в `index.html` блок `<div class="projects-grid" id="projects-grid">` и скопируй любую `<article class="project" ...>`.
2. Укажи:
   - `data-project="уникальный-id"` — ключ проекта;
   - `data-cat="desktop"` — категория (`desktop`, `web`, `telegram`);
   - картинку в `assets/` или CSS-визуал;
   - заголовок, описание и теги.
3. **Данные для модального окна** — добавь объект с тем же ключом в `const projects = { ... }` в конце файла:
   - `title`, `kicker`, `desc`, `points`, `tags`;
   - `links` — массив `{ label, url }`;
   - `note` — если ссылок нет;
   - `image` — путь к изображению (опционально).
4. Если появилась новая категория — добавь кнопку `.filter` с `data-filter` и обнови счётчики.

## Настройка

- **Цвета, радиусы, шрифты** — CSS-переменные в `:root` в начале `<style>`.
- **Тексты** — hero, «Подход», «Навыки», «Обо мне», «Контакты» — прямо в разметке.
- **Ссылки** — GitHub в шапке, hero и контактах; Telegram-канал и чат — в контактах.

## Контакты

- Сайт: [awaynos.github.io/Awaynos](https://awaynos.github.io/Awaynos/)
- GitHub: [github.com/Awaynos](https://github.com/Awaynos)
- Telegram-канал: [@awadeveloper](https://t.me/awadeveloper)
- Чат для обсуждений: [t.me/+c646yqHZzftmYTky](https://t.me/+c646yqHZzftmYTky)
- **SEO** — `<title>`, `meta description`, Open Graph в `<head>`.

## Деплой на GitHub Pages

Сайт лежит в папке `docs/` репозитория `Awaynos/Awaynos`.

Обновление:

```powershell
git add docs
git commit -m "Update portfolio"
git push
```

В настройках репозитория: **Settings → Pages → Build and deployment → Deploy from a branch → main / docs**.

Сайт будет доступен по адресу `https://awaynos.github.io/Awaynos/`.

После деплоя стоит заменить относительный путь в `og:image` на абсолютный URL — иначе превью в соцсетях может не подтянуться.

## Идеи для развития

- добавить QConsole, WinnieGram, Qcmd и tg-autopilot после релиза;
- сделать галерею скриншотов в модальных окнах;
- добавить английскую версию;
- подключить форму обратной связи или Telegram-контакт;
- добавить страницу с кейсами и процессом разработки.
