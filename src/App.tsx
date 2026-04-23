import { lazy, Suspense } from 'react';
import { useUIStore } from '@/store/uiStore';
import { AuthForm } from '@/components/Auth/AuthForm';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { ChatWindow } from '@/components/ChatWindow/ChatWindow';
import { InputArea } from '@/components/chat/InputArea';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';

const SettingsPanel = lazy(() =>
  import('@/components/Settings/SettingsPanel').then((m) => ({ default: m.SettingsPanel })),
);

export default function App() {
  const apiKey = useUIStore((s) => s.apiKey);

  if (!apiKey) {
    return <AuthForm />;
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-bg)' }}>
      <ErrorBoundary>
        <Sidebar />
      </ErrorBoundary>

      <main className="flex flex-col flex-1 min-w-0 min-h-0">
        <ErrorBoundary>
          <ChatWindow />
        </ErrorBoundary>
        <ErrorBoundary>
          <InputArea />
        </ErrorBoundary>
      </main>

      <Suspense fallback={null}>
        <ErrorBoundary>
          <SettingsPanel />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}
