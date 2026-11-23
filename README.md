<p align="center">
  <picture>
    <source media="(max-width: 700px)" srcset="assets/mobile/header-ru-m.png">
    <source srcset="assets/header.webp" type="image/webp">
    <img src="assets/header.png" width="100%"
         alt="Awaynos — разработчик полезных приложений и утилит для Windows, Linux и Telegram. Python · JavaScript · Desktop · Автоматизация.">
  </picture>
</p>

<p align="center">
  <a href="https://awaynos.github.io/Awaynos/"><img src="assets/button-site.png" width="250" align="middle" alt="Сайт-портфолио Awaynos"></a>
  &nbsp;&nbsp;
  <a href="https://github.com/Awaynos/Awaynos/blob/main/README.md"><img src="assets/showcase/lang-ru-on.png" width="125" align="middle" alt="Русская версия"></a>
  &nbsp;&nbsp;
  <a href="https://github.com/Awaynos/Awaynos/blob/main/README.en.md"><img src="assets/showcase/lang-en-off.png" width="125" align="middle" alt="English version"></a>
</p>

<p align="center">
  <img src="https://skillicons.dev/icons?i=py,js,ts,html,css,qt,electron,git,github,vscode,windows" height="40" alt="Python, JavaScript, TypeScript, HTML, CSS, Qt, Electron, Git, GitHub, VS Code, Windows">
  &nbsp;
  <img src="https://raw.githubusercontent.com/Awaynos/Awaynos/main/assets/icons/qml.svg" height="40" alt="QML">
  &nbsp;
  <img src="https://skillicons.dev/icons?i=arch" height="40" alt="Arch Linux">
  &nbsp;
  <img src="https://raw.githubusercontent.com/Awaynos/Awaynos/main/assets/icons/quickshell.svg" height="40" alt="Quickshell">
  &nbsp;
  <img src="https://skillicons.dev/icons?i=cpp" height="40" alt="C++">
</p>

<p align="center"><picture><source media="(max-width: 700px)" srcset="assets/mobile/section-profile-ru-m.png"><img src="assets/plates/section-profile.png" width="100%" alt="Профиль"></picture></p>

| | |
|---|---|
| **Направления** | Приложения и утилиты для Windows и Linux · инструменты для Telegram · сетевые решения · разработка сайтов · интеграция и обучение ИИ |
| **Основной стек** | Python (PySide6, Telethon) · JavaScript / Electron · TypeScript |
| **Платформа** | Windows / Linux |
| **Подход** | Прикладные инструменты под конкретную задачу: портативные, без лишних зависимостей |
| **Лицензии** | Открытый исходный код (MIT, PolyForm Noncommercial) |

<p align="center"><picture><source media="(max-width: 700px)" srcset="assets/mobile/section-projects-ru-m.png"><img src="assets/plates/section-projects.png" width="100%" alt="Опубликованные проекты"></picture></p>

<p align="center">
  <a href="https://github.com/Awaynos/QTranslate-R"><picture><source media="(max-width: 700px)" srcset="assets/mobile/project-qtranslate-ru-m.png"><img src="assets/showcase/project-qtranslate-ru.png" width="100%" alt="QTranslate Remake"></picture></a>
</p>

**Переводчик для Windows и Linux в духе QTranslate 6.10** — переписан на Python с собственным интерфейсом.

`Python 3.11` · `PySide6 / Qt 6` · `1.1.0`

- Глобальные горячие клавиши: `Ctrl+Q` — перевод выделенного, `Ctrl+1` — замена текста переводом на месте, `Ctrl+I` — распознавание текста с экрана (OCR), `Ctrl+E` — озвучка, `Ctrl+D` — словарь. В Linux по умолчанию `Ctrl+Alt+Q/1/I`; на Wayland — бинды DE
- Семь сервисов перевода одновременно: Google, Bing, DeepL, Yandex, Reverso, MyMemory, LibreTranslate
- Перевод документов: TXT, SRT, VTT, DOCX, PDF — с сохранением таймингов и структуры
- Проверка орфографии; собственный CSV-словарь (глоссарий, аббревиатуры) — данные не покидают машину
- Linux: X11 и Wayland, AppImage, `tar.gz` и пакет для Arch; глобальные хоткеи на Wayland задаются биндами DE
- Интерфейс без системной рамки: 4 темы, 13 языков (ru/en/de/fr/es/ko/pt-BR/zh/ja/kk/ka/be/pl), история, трей

[**Сайт**](https://awaynos.github.io/QTranslate-R/) · [**Репозиторий**](https://github.com/Awaynos/QTranslate-R) · [**Релизы**](https://github.com/Awaynos/QTranslate-R/releases)

<p align="center">
  <a href="https://github.com/Awaynos/QMessages"><picture><source media="(max-width: 700px)" srcset="assets/mobile/project-qmessages-ru-m.png"><img src="assets/showcase/project-qmessages-ru.png" width="100%" alt="QMessages"></picture></a>
</p>

**Быстрые заготовки для переписки — колесо сообщений под курсором.**

`Python 3.11` · `PySide6 / Qt 6` · `1.0`

- Колесо заготовок: зажал бинд → выбрал сообщение → отпустил — текст уже в чате
- До 16 сообщений: короткая подпись на колесе и полный текст для вставки
- Вставка через буфер (Ctrl+V) или посимвольно; опциональная отправка по Enter
- Возврат содержимого буфера обмена, заготовки и настройки в `%APPDATA%\QMessages\config.json`
- Портативная сборка, тёмная тема Metal, трей; без телеметрии, аккаунтов и облака

[**Репозиторий**](https://github.com/Awaynos/QMessages) · [**Релизы**](https://github.com/Awaynos/QMessages/releases)

<p align="center">
  <a href="https://github.com/Awaynos/crm-case-study"><picture><source media="(max-width: 700px)" srcset="assets/mobile/project-crm-ru-m.png"><img src="assets/showcase/project-crm-ru.png" width="100%" alt="Agency CRM"></picture></a>
</p>

**Production CRM для модельного агентства** — команда, смены, финансы, доступы, файлы и аудит в одной системе.

`Next.js 16` · `NestJS` · `Prisma` · `PostgreSQL`

- Семь ролей, иерархия и объектные ограничения доступа
- Смены, начисления, выплаты и отчёты по активной схеме распределения
- Обязательная 2FA, подтверждение email, EULA и аудит критичных действий
- Зашифрованные файлы и внешние ссылки с выдачей по ролям
- Production-кейс: исходный код приватный, витрина и скриншоты открыты

[**Кейс**](https://github.com/Awaynos/crm-case-study)

<p align="center">
  <a href="https://github.com/Awaynos/eft-map-overlay"><picture><source media="(max-width: 700px)" srcset="assets/mobile/project-eft-ru-m.png"><img src="assets/showcase/project-eft-ru.png" width="100%" alt="eft-map-overlay"></picture></a>
</p>

**Прозрачный интерактивный оверлей карты eft.su поверх Escape from Tarkov** — карта всегда под рукой, ориентирование быстрее.

`JavaScript` · `Electron` · `1.2.5` · `Windows`

- Не читает память игры и ничего не инжектит — легальный внешний оверлей, безопасный для BattlEye
- Горячие клавиши: переключение кликов игра ⇄ карта, показать/скрыть, прозрачность, быстрая смена карты
- Сквозные клики: карта видна, но прицел и стрельба не блокируются
- Автообновление с GitHub, запоминание настроек (карта, прозрачность, положение окна)
- 12 карт: Завод, Таможня, Лес, Маяк, Берег, Резерв, Развязка, Улицы Таркова, Лаборатория, Эпицентр, Лабиринт, Ледокол

[**Репозиторий**](https://github.com/Awaynos/eft-map-overlay) · [**Релизы**](https://github.com/Awaynos/eft-map-overlay/releases)

<p align="center"><picture><source media="(max-width: 700px)" srcset="assets/mobile/section-stats-ru-m.png"><img src="assets/plates/section-stats.png" width="100%" alt="Статистика"></picture></p>

<div align="center">

<img height="165" src="https://raw.githubusercontent.com/Awaynos/Awaynos/main/profile-cards/stats.svg" alt="Статистика GitHub" />
<img height="165" src="https://raw.githubusercontent.com/Awaynos/Awaynos/main/profile-cards/top-languages.svg" alt="Языки" />

<br>

<img src="https://raw.githubusercontent.com/Awaynos/Awaynos/main/profile-cards/streak.svg" alt="Серия коммитов" />

</div>

<p align="center"><picture><source media="(max-width: 700px)" srcset="assets/mobile/section-support-ru-m.png"><img src="assets/plates/section-support.png" width="100%" alt="Поддержать разработку"></picture></p>

Разработка и поддержка проектов занимает время — буду благодарен за поддержку. Поддержка полностью необязательна: можно помочь и без денег — сообщить о баге, предложить идею или просто поставить звезду проекту.

> **Важно:** отправляйте перевод **только в указанной сети** — перевод в другой сети может быть потерян безвозвратно.

| Монета | Сеть | Адрес |
|:---|:---|:---|
| <img src="assets/mobile/coin-btc-pill-m.png" width="180" alt="Bitcoin (BTC)"> | <img src="assets/mobile/net-segwit-pill-m.png" width="170" alt="Bitcoin (SegWit)"> | `bc1qfaylkgnwct052snamqmnxl3uk26xpt5jg344fs` |
| <img src="assets/mobile/coin-eth-pill-m.png" width="180" alt="Ethereum (ETH)"> | <img src="assets/mobile/net-erc20-pill-m.png" width="120" alt="ERC-20"> | `0x44628629c1C6f8E8591d4f93735Ff6CD70DC8AfC` |
| <img src="assets/mobile/coin-usdt-pill-m.png" width="180" alt="Tether (USDT)"> | <img src="assets/mobile/net-bep20-pill-m.png" width="150" alt="BEP-20 (BNB)"> | `0x44628629c1C6f8E8591d4f93735Ff6CD70DC8AfC` |
| <img src="assets/mobile/coin-usdt-pill-m.png" width="180" alt="Tether (USDT)"> | <img src="assets/mobile/net-trc20-pill-m.png" width="155" alt="TRC-20 (Tron)"> | `TREypoEUmW7KDkbpSxDGsnCnA6SQ1e8SVk` |
| <img src="assets/mobile/coin-sol-pill-m.png" width="180" alt="Solana (SOL / SPL)"> | <img src="assets/mobile/net-solana-pill-m.png" width="120" alt="Solana"> | `3sTNRxJqATsJsKWyM5dxi4HHMLEKbp8f8dGU4wJ1xmE9` |

> **USDT:** BEP-20 (BNB) и TRC-20 (Tron) — разные сети. Адреса не взаимозаменяемы.

<p align="center"><picture><source media="(max-width: 700px)" srcset="assets/mobile/section-contacts-ru-m.png"><img src="assets/plates/section-contacts.png" width="100%" alt="Контакты"></picture></p>

- GitHub — [@Awaynos](https://github.com/Awaynos)
- Telegram-канал — [@awadeveloper](https://t.me/awadeveloper)
- Чат для обсуждений — [t.me/awadeveloperchat](https://t.me/awadeveloperchat)
- Портфолио — [awaynos.github.io/Awaynos](https://awaynos.github.io/Awaynos/)
- Баги, идеи и pull request'ы — через Issues в соответствующих репозиториях
