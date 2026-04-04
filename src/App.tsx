import { Sidebar } from '@/components/Sidebar/Sidebar';
import { ChatWindow } from '@/components/ChatWindow/ChatWindow';
import { InputArea } from '@/components/InputArea/InputArea';
import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';

export default function App() {
  return (
    <div className="flex h-screen bg-main text-white overflow-hidden">
      <ErrorBoundary>
        <Sidebar />
      </ErrorBoundary>

      <main className="flex flex-col flex-1 min-w-0">
        <ErrorBoundary>
          <ChatWindow />
        </ErrorBoundary>
        <ErrorBoundary>
          <InputArea />
        </ErrorBoundary>
      </main>
    </div>
  );
}
