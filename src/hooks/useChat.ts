import { useChatStore } from '@/store/chatStore';
import { sendMessageStream, sendMessage, uploadFile } from '@/api/gigachat';
import type { MessageContent } from '@/types';

export function useChat() {
  const store = useChatStore();

  async function send(text: string, imageFile?: File) {
    let chatId = store.currentChatId;
    if (!chatId) {
      chatId = store.createChat();
    }

    // Build content (multimodal if image attached)
    let content: MessageContent = text;
    if (imageFile) {
      try {
        const uploaded = await uploadFile(imageFile);
        content = [
          { type: 'text', text },
          { type: 'image_url', image_url: { url: uploaded.id } },
        ];
      } catch (err) {
        console.error('Image upload failed, sending text only:', err);
      }
    }

    // Add user message
    const chat = useChatStore.getState().chats.find((c) => c.id === chatId)!;
    store.addMessage(chatId, { role: 'user', content });

    // Auto-title on first user message
    if (chat.messages.length === 0) {
      const title = text.trim().slice(0, 50) || 'Новый чат';
      store.updateChatTitle(chatId, title);
    }

    // Add placeholder assistant message
    store.addMessage(chatId, { role: 'assistant', content: '', isStreaming: true });

    const ctrl = new AbortController();
    store.setAbortController(ctrl);
    store.setLoading(true);

    // Get current messages (without the empty assistant placeholder)
    const allMessages = useChatStore.getState().chats.find((c) => c.id === chatId)!.messages;
    const messagesForApi = allMessages.slice(0, -1); // exclude empty assistant

    try {
      const stream = sendMessageStream(messagesForApi, store.settings, ctrl.signal);
      let accumulated = '';

      for await (const chunk of stream) {
        accumulated += chunk;
        store.updateLastAssistantMessage(chatId, accumulated);
      }

      store.updateLastAssistantMessage(chatId, accumulated, true);
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Stopped by user — keep partial response
        return;
      }

      // Streaming failed — try non-streaming fallback
      try {
        const currentMessages = useChatStore
          .getState()
          .chats.find((c) => c.id === chatId)!
          .messages.slice(0, -1);
        const reply = await sendMessage(currentMessages, store.settings, ctrl.signal);
        store.updateLastAssistantMessage(chatId, reply, true);
      } catch (fallbackErr) {
        const msg = fallbackErr instanceof Error ? fallbackErr.message : 'Неизвестная ошибка';
        store.updateLastAssistantMessage(chatId, `Ошибка: ${msg}`, true);
      }
    } finally {
      store.setLoading(false);
      store.setAbortController(null);
    }
  }

  return { send };
}
