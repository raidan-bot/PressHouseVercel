import React, { useState, useCallback } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onReset?: () => void;
  className?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

function ErrorBoundaryInner({ children, fallback, onReset, className }: Props) {
  const [state, setState] = useState<ErrorBoundaryState>({
    hasError: false,
    error: null,
    errorInfo: null,
  });

  const handleReset = useCallback(() => {
    setState({ hasError: false, error: null, errorInfo: null });
    onReset?.();
  }, [onReset]);

  // Error catching via window event
  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('ErrorBoundary caught an error:', event.error);
      setState({
        hasError: true,
        error: event.error,
        errorInfo: null,
      });
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (state.hasError) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className={cn('min-h-screen flex items-center justify-center bg-slate-50 p-4', className)}>
        <div className="max-w-lg w-full text-center space-y-8">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle size={48} className="text-red-600" />
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-black text-slate-900">
              Something went wrong
            </h1>
            <p className="text-slate-600 font-medium max-w-md mx-auto">
              We're sorry, but something unexpected happened. Our team has been notified and is working on a fix.
            </p>
          </div>
          {state.error && (
            <details className="text-left bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <summary className="p-4 font-bold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors">
                View error details
              </summary>
              <div className="p-4 bg-slate-100 text-xs font-mono text-slate-700 overflow-auto max-h-48">
                <p className="text-red-600 font-bold">{state.error.message}</p>
              </div>
            </details>
          )}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              variant="primary"
              onClick={handleReset}
            >
              <RefreshCw size={16} className="mr-2" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
            >
              <Home size={16} className="mr-2" />
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export function ErrorBoundary(props: Props) {
  return <ErrorBoundaryInner {...props} />;
}

export function useErrorBoundary() {
  const [error, setError] = useState<Error | null>(null);

  const resetError = () => setError(null);

  const throwError = (err: Error) => {
    setError(err);
    throw err;
  };

  return { error, resetError, throwError };
}

export function withErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  errorBoundaryProps?: Props
) {
  return function WithErrorBoundary(props: T) {
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

export default ErrorBoundary;
