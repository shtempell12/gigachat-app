import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex items-center justify-center h-full text-red-400 p-4">
            <div className="text-center">
              <p className="text-lg font-semibold mb-2">Что-то пошло не так</p>
              <p className="text-sm text-gray-400">{this.state.error?.message}</p>
              <button
                className="mt-4 px-4 py-2 bg-accent text-black rounded-lg text-sm"
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                Попробовать снова
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
