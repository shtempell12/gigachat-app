import { v4 as uuidv4 } from 'uuid';
import type {
  TokenResponse,
  GigaChatResponse,
  GigaChatStreamChunk,
  ChatSettings,
  Message,
  UploadedFile,
} from '@/types';

const OAUTH_URL = '/api/oauth/api/v2/oauth';
const API_BASE = '/api/gigachat/api/v1';

let cachedToken: TokenResponse | null = null;

function getMessageContent(msg: Message): string | unknown[] {
  return msg.content;
}

async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires_at - 60_000) {
    return cachedToken.access_token;
  }

  const clientId = import.meta.env.VITE_GIGACHAT_CLIENT_ID as string;
  const clientSecret = import.meta.env.VITE_GIGACHAT_CLIENT_SECRET as string;
  const scope = (import.meta.env.VITE_GIGACHAT_SCOPE as string) || 'GIGACHAT_API_PERS';

  if (!clientId || !clientSecret) {
    throw new Error('GigaChat credentials not configured. Please set VITE_GIGACHAT_CLIENT_ID and VITE_GIGACHAT_CLIENT_SECRET in .env');
  }

  const credentials = btoa(`${clientId}:${clientSecret}`);

  const response = await fetch(OAUTH_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      RqUID: uuidv4(),
    },
    body: new URLSearchParams({ scope }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OAuth failed: ${response.status} ${text}`);
  }

  cachedToken = await response.json() as TokenResponse;
  return cachedToken.access_token;
}

export async function uploadFile(file: File): Promise<UploadedFile> {
  const token = await getAccessToken();
  const formData = new FormData();
  formData.append('file', file, file.name);
  formData.append('purpose', 'general');

  const response = await fetch(`${API_BASE}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`File upload failed: ${response.status} ${text}`);
  }

  return response.json() as Promise<UploadedFile>;
}

export async function getModels(): Promise<string[]> {
  const token = await getAccessToken();
  const response = await fetch(`${API_BASE}/models`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!response.ok) return ['GigaChat', 'GigaChat-Plus', 'GigaChat-Pro'];

  const data = await response.json() as { data: Array<{ id: string }> };
  return data.data.map((m) => m.id);
}

export async function sendMessage(
  messages: Message[],
  settings: ChatSettings,
  signal?: AbortSignal,
): Promise<string> {
  const token = await getAccessToken();

  const body = {
    model: settings.model,
    messages: [
      { role: 'system', content: 'Ты полезный ассистент.' },
      ...messages.map((m) => ({ role: m.role, content: getMessageContent(m) })),
    ],
    temperature: settings.temperature,
    top_p: settings.top_p,
    max_tokens: settings.max_tokens,
    repetition_penalty: settings.repetition_penalty,
    stream: false,
  };

  const response = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error: ${response.status} ${text}`);
  }

  const data = await response.json() as GigaChatResponse;
  return data.choices[0]?.message?.content ?? '';
}

export async function* sendMessageStream(
  messages: Message[],
  settings: ChatSettings,
  signal?: AbortSignal,
): AsyncGenerator<string, void, unknown> {
  const token = await getAccessToken();

  const body = {
    model: settings.model,
    messages: [
      { role: 'system', content: 'Ты полезный ассистент.' },
      ...messages.map((m) => ({ role: m.role, content: getMessageContent(m) })),
    ],
    temperature: settings.temperature,
    top_p: settings.top_p,
    max_tokens: settings.max_tokens,
    repetition_penalty: settings.repetition_penalty,
    stream: true,
  };

  const response = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify(body),
    signal,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API error: ${response.status} ${text}`);
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
          // malformed chunk, skip
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
