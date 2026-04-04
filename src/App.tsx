import { useUIStore } from '@/store/uiStore';
import { AuthForm } from '@/components/Auth/AuthForm';
import { Sidebar } from '@/components/Sidebar/Sidebar';
import { ChatWindow } from '@/components/ChatWindow/ChatWindow';
import { InputArea } from '@/components/InputArea/InputArea';
import { SettingsPanel } from '@/components/Settings/SettingsPanel';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';

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

      <ErrorBoundary>
        <SettingsPanel />
      </ErrorBoundary>
    </div>
  );
}
