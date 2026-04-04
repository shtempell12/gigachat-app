# GigaChat App

Веб-приложение в стиле ChatGPT, работающее на базе GigaChat API от Сбера.

## Скриншоты

> После запуска добавьте скриншоты интерфейса в эту секцию.

## Стек технологий

| Технология | Версия | Назначение |
|---|---|---|
| React | 18 | UI-фреймворк |
| TypeScript | 5 | Типизация |
| Vite | 5 | Сборщик |
| Zustand | 4 | State management |
| Tailwind CSS | 3 | Стили |
| react-markdown | 9 | Markdown-рендеринг |
| remark-gfm | 4 | GFM (таблицы, зачёркивание) |
| rehype-highlight | 7 | Подсветка синтаксиса кода |
| highlight.js | 11 | Движок подсветки |

## Функциональность

### Интерфейс чата
- Главный экран с областью сообщений и полем ввода
- Визуальное разделение сообщений пользователя и ассистента
- Markdown-форматирование ответов (заголовки, списки, таблицы, код, ссылки)
- Индикатор загрузки (typing indicator) с анимацией
- Автоматическая прокрутка к последнему сообщению
- Копирование ответа ассистента в буфер обмена
- Кнопка «Остановить генерацию»

### Управление чатами
- Боковая панель со списком всех чатов
- Создание нового чата с автоматическим названием на основе первого сообщения
- Переключение между чатами без потери данных
- Переименование чата (inline-редактирование)
- Удаление чата с подтверждением
- Поиск по названию и содержимому чатов
- Сохранение истории в `localStorage`

### Работа с GigaChat API
- SSE streaming — постепенное отображение ответа токен за токеном
- Fallback на обычный REST при недоступности streaming
- Контекст диалога (массив messages с ролями system/user/assistant)
- Настройка параметров: temperature, top_p, max_tokens, repetition_penalty
- Мультимодальный ввод — отправка изображений через GigaChat API

## Архитектура

```
src/
├── api/
│   └── gigachat.ts       # API-адаптер (OAuth + chat completions + file upload)
├── store/
│   └── chatStore.ts      # Zustand store — весь стейт приложения
├── hooks/
│   ├── useChat.ts        # Хук отправки сообщений (streaming + fallback)
│   └── useAutoScroll.ts  # Хук автоскролла
├── components/
│   ├── ErrorBoundary/    # Изоляция ошибок компонентов
│   ├── Sidebar/          # Боковая панель с управлением чатами
│   ├── ChatWindow/       # Окно сообщений
│   └── InputArea/        # Поле ввода + настройки модели
├── types/
│   └── index.ts          # TypeScript-типы
└── utils/
    └── storage.ts        # localStorage утилиты
```

## Установка и запуск

### Требования
- Node.js 18+
- npm или yarn
- Аккаунт на [Sber GigaChat Developer Portal](https://developers.sber.ru/studio/workspaces)

### 1. Клонируйте репозиторий

```bash
git clone <repo-url>
cd gigachat-app
```

### 2. Установите зависимости

```bash
npm install
```

### 3. Настройте переменные окружения

```bash
cp .env.example .env
```

Откройте `.env` и заполните свои данные:

```env
VITE_GIGACHAT_CLIENT_ID=ваш_client_id
VITE_GIGACHAT_CLIENT_SECRET=ваш_client_secret
VITE_GIGACHAT_SCOPE=GIGACHAT_API_PERS
```

> **Где получить credentials**: [Sber Studio](https://developers.sber.ru/studio/workspaces) → создать проект → GigaChat API → скопировать Client ID и Client Secret.

### 4. Запустите приложение

```bash
npm run dev
```

Откройте `http://localhost:5173` в браузере.

### 5. Сборка для продакшна

```bash
npm run build
npm run preview
```

## Техническое замечание о прокси

Vite Dev Server настроен как прокси для GigaChat API, чтобы обойти CORS:

- `/api/gigachat/*` → `https://gigachat.devices.sberbank.ru/*`  
- `/api/oauth/*` → `https://ngw.devices.sberbank.ru:9443/*`

Для деплоя в продакшн необходимо настроить аналогичный прокси на уровне веб-сервера (nginx, Caddy) или использовать backend-прокси.

## Примеры работы

**Запрос с markdown**:
```
Напиши пример функции на Python с объяснением
```

**Мультимодальный запрос**:
Нажмите на скрепку, прикрепите изображение, задайте вопрос — «Что изображено на фото?»

**Поиск в истории**:
Введите ключевое слово в поле поиска в сайдбаре — отфильтруются чаты по названию и содержимому.
