# GigaChat App

Веб-приложение в стиле ChatGPT на базе Groq API.

## Функциональность

- Главный экран с областью сообщений и полем ввода
- Визуальное разделение сообщений пользователя и ассистента
- Markdown-форматирование ответов
- Индикатор загрузки с анимацией, автоскролл к последнему сообщению
- Копирование ответа ассистента, кнопка «Остановить генерацию»
- Сохранение истории в `localStorage`
- SSE streaming с fallback на REST
- Мультимодальный ввод (изображения)

## Требования

- Node.js 18+
- Groq API ключ: [console.groq.com/keys](https://console.groq.com/keys)

## Установка

```bash
git clone https://github.com/shtempell12/gigachat-app.git
cd gigachat-app
npm install
npm run dev
```

Откройте `http://localhost:5173` и введите Groq API ключ для входа.

> Groq API не работает без VPN в России.

## Скриншоты

[Смотреть на Google Drive](https://drive.google.com/drive/folders/1ImVfyKGdJvZtVjXGVIfbfmbqzFodQzLP?usp=drive_link)

## Тесты

```bash
npm test
```

Покрыто: reducer (CREATE_CHAT, ADD_MESSAGE, DELETE_CHAT, RENAME_CHAT), localStorage, InputArea, Message, Sidebar — 35 тестов.
