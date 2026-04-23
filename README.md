# GigaChat App

Веб-приложение в стиле ChatGPT на базе Groq API (совместим с OpenAI).

## Стек технологий

| Технология | Версия | Назначение |
|---|---|---|
| React | 18 | UI-фреймворк |
| TypeScript | 5 | Типизация |
| Vite | 5 | Сборщик |
| Zustand | 4 | State management |
| Tailwind CSS | 3 | Стили |
| react-markdown | 9 | Markdown-рендеринг |
| rehype-highlight | 7 | Подсветка синтаксиса кода |
| highlight.js | 11 | Движок подсветки |

## Функциональность

- Главный экран с областью сообщений и полем ввода
- Визуальное разделение сообщений пользователя и ассистента
- Markdown-форматирование ответов (заголовки, списки, таблицы, код)
- Индикатор загрузки с анимацией, автоскролл к последнему сообщению
- Копирование ответа ассистента, кнопка «Остановить генерацию»
- Боковая панель: создание, переименование, удаление чатов, поиск
- Сохранение истории в `localStorage`
- SSE streaming с fallback на REST
- Мультимодальный ввод (изображения)

## Запуск локально

### Требования
- Node.js 18+
- Groq API ключ: [console.groq.com/keys](https://console.groq.com/keys) (бесплатно)

### Установка

```bash
git clone https://github.com/shtempell12/gigachat-app.git
cd gigachat-app
npm install
npm run dev
```

Откройте `http://localhost:5173`, введите Groq API ключ в форму входа.

> Groq API может быть недоступен без VPN в России.

## Переменные окружения

| Переменная | Описание |
|---|---|
| `VITE_OPENAI_API_KEY` | Groq API ключ (`gsk_...`) |

## Тесты

```bash
npm test
```

Покрыто: reducer (CREATE_CHAT, ADD_MESSAGE, DELETE_CHAT, RENAME_CHAT), localStorage, InputArea, Message, Sidebar — 35 тестов.
