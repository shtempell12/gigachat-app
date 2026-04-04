export type MessageRole = 'user' | 'assistant' | 'system';

export interface ImageContent {
  type: 'image_url';
  image_url: { url: string };
}

export interface TextContent {
  type: 'text';
  text: string;
}

export type MessageContent = string | (TextContent | ImageContent)[];

export interface Message {
  id: string;
  role: MessageRole;
  content: MessageContent;
  timestamp: number;
  isStreaming?: boolean;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface ChatSettings {
  model: string;
  temperature: number;
  top_p: number;
  max_tokens: number;
  repetition_penalty: number;
}

export interface GigaChatStreamChunk {
  choices: Array<{
    delta: {
      content?: string;
      role?: string;
    };
    finish_reason: string | null;
    index: number;
  }>;
  object: string;
}

export interface GigaChatResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
}

export interface TokenResponse {
  access_token: string;
  expires_at: number;
}

export interface UploadedFile {
  id: string;
  object: string;
  bytes: number;
  created_at: number;
  filename: string;
  purpose: string;
}
