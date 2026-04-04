import type { ChatSettings, GigaChatStreamChunk, Message, UploadedFile } from '@/types';

const API_BASE = 'https://api.openai.com/v1';

function getApiKey(): string {
  const key = import.meta.env.VITE_OPENAI_API_KEY as string;
  if (!key) throw new Error('OpenAI API key not configured. Set VITE_OPENAI_API_KEY in .env');
  return key;
}

function buildMessages(messages: Message[]) {
  return [
    { role: 'system', content: 'Ты полезный ассистент.' },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];
}

// Stub — OpenAI multimodal works via base64 in message content, no separate upload needed
export async function uploadFile(file: File): Promise<UploadedFile> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve({
        id: reader.result as string, // base64 data URL used directly
        object: 'file',
        bytes: file.size,
        created_at: Date.now(),
        filename: file.name,
        purpose: 'vision',
      });
    };
    reader.readAsDataURL(file);
  });
}

export async function getModels(): Promise<string[]> {
  return ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'];
}

export async function sendMessage(
  messages: Message[],
  settings: ChatSettings,
  signal?: AbortSignal,
): Promise<string> {
  const response = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: settings.model,
      messages: buildMessages(messages),
      temperature: settings.temperature,
      top_p: settings.top_p,
      max_tokens: settings.max_tokens,
      presence_penalty: settings.repetition_penalty - 1, // map to OpenAI scale
      stream: false,
    }),
    signal,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: { message: response.statusText } }));
    throw new Error(`API error: ${(err as { error: { message: string } }).error?.message ?? response.statusText}`);
  }

  const data = await response.json() as { choices: Array<{ message: { content: string } }> };
  return data.choices[0]?.message?.content ?? '';
}

export async function* sendMessageStream(
  messages: Message[],
  settings: ChatSettings,
  signal?: AbortSignal,
): AsyncGenerator<string, void, unknown> {
  const response = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: settings.model,
      messages: buildMessages(messages),
      temperature: settings.temperature,
      top_p: settings.top_p,
      max_tokens: settings.max_tokens,
      presence_penalty: settings.repetition_penalty - 1,
      stream: true,
    }),
    signal,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: { message: response.statusText } }));
    throw new Error(`API error: ${(err as { error: { message: string } }).error?.message ?? response.statusText}`);
  }

  if (!response.body) throw new Error('No response body');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data:')) continue;
        const data = trimmed.slice(5).trim();
        if (data === '[DONE]') return;

        try {
          const chunk = JSON.parse(data) as GigaChatStreamChunk;
          const content = chunk.choices[0]?.delta?.content;
          if (content) yield content;
        } catch {
          // skip malformed chunk
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
