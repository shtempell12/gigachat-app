# GigaChat App

Веб-приложение в стиле ChatGPT на базе Groq API 

## Функциональность

- Главный экран с областью сообщений и полем ввода
- Визуальное разделение сообщений пользователя и ассистента
- Markdown-форматирование ответов 
- Индикатор загрузки с анимацией, автоскролл к последнему сообщению
- Копирование ответа ассистента, кнопка «Остановить генерацию»
- Сохранение истории в `localStorage`
- SSE streaming с fallback на REST
- Мультимодальный ввод (изображения)


### Требования
- Node.js 
- Groq API ключ: [console.groq.com/keys](https://console.groq.com/keys) 

### Установка (запуск локально)

```bash
git clone https://github.com/shtempell12/gigachat-app.git
cd gigachat-app
npm install
npm run dev
```

Потом откройте  `http://localhost:5173`, и введите API Groq для входа 

> Примечание, Groq API не работает без впн

## Тесты

```bash
npm test
```

Покрыто: reducer (CREATE_CHAT, ADD_MESSAGE, DELETE_CHAT, RENAME_CHAT), localStorage, InputArea, Message, Sidebar — 35 тестов.
