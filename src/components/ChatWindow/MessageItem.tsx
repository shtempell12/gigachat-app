import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { Message } from '@/types';

interface Props {
  message: Message;
}

function getTextContent(content: Message['content']): string {
  if (typeof content === 'string') return content;
  return content
    .filter((c) => c.type === 'text')
    .map((c) => (c as { type: 'text'; text: string }).text)
    .join('');
}

function getImageUrl(content: Message['content']): string | null {
  if (typeof content === 'string') return null;
  const img = content.find((c) => c.type === 'image_url');
  return img ? (img as { type: 'image_url'; image_url: { url: string } }).image_url.url : null;
}

export function MessageItem({ message }: Props) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';
  const text = getTextContent(message.content);
  const imageUrl = getImageUrl(message.content);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className={`flex gap-3 px-4 py-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-accent text-xs font-bold">G</span>
        </div>
      )}

      <div className={`max-w-[80%] group relative ${isUser ? 'order-first' : ''}`}>
        {/* User message bubble */}
        {isUser ? (
          <div className="rounded-2xl rounded-tr-sm px-4 py-3" style={{ background: 'var(--color-user-bubble)' }}>
            {imageUrl && (
              <div className="mb-2">
                <img
                  src={imageUrl}
                  alt="Прикреплённое изображение"
                  className="max-w-xs rounded-lg"
                />
              </div>
            )}
            <p className="text-sm text-gray-100 whitespace-pre-wrap break-words">{text}</p>
          </div>
        ) : (
          /* Assistant message — markdown */
          <div className="prose prose-invert prose-sm max-w-none">
            {message.isStreaming && !text ? (
              <div className="flex gap-1 items-center py-2">
                <span className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:300ms]" />
              </div>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight]}
                components={{
                  code({ className, children, ...props }) {
                    const isBlock = className?.includes('language-');
                    return isBlock ? (
                      <code className={`${className ?? ''} text-xs`} {...props}>
                        {children}
                      </code>
                    ) : (
                      <code
                        className="bg-white/10 text-pink-300 rounded px-1 py-0.5 text-xs"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  pre({ children }) {
                    return (
                      <pre className="bg-black/40 rounded-xl p-4 overflow-x-auto text-xs my-3 border border-white/10">
                        {children}
                      </pre>
                    );
                  },
                  a({ href, children }) {
                    return (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline">
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {text}
              </ReactMarkdown>
            )}

            {message.isStreaming && (
              <span className="inline-block w-0.5 h-4 bg-accent ml-0.5 animate-pulse align-text-bottom" />
            )}
          </div>
        )}

        {/* Copy button for assistant */}
        {!isUser && !message.isStreaming && text && (
          <button
            onClick={handleCopy}
            className="absolute -bottom-6 right-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs text-gray-400 hover:text-white"
            title="Копировать"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Скопировано
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Копировать
              </>
            )}
          </button>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-0.5">
          <span className="text-white text-xs font-bold">Я</span>
        </div>
      )}
    </div>
  );
}
