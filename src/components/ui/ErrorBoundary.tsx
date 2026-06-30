import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  className?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Log to analytics or error reporting service
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'exception', {
        description: error.message,
        fatal: true,
      });
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    this.props.onReset?.();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className={cn('min-h-screen flex items-center justify-center bg-slate-50 p-4', this.props.className)}>
          <div className="max-w-lg w-full text-center space-y-8">
            {/* Icon */}
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={48} className="text-red-600" />
            </div>

            {/* Content */}
            <div className="space-y-4">
              <h1 className="text-3xl font-black text-slate-900">
                Something went wrong
              </h1>
              <p className="text-slate-600 font-medium max-w-md mx-auto">
                We're sorry, but something unexpected happened. Our team has been notified and is working on a fix.
              </p>
            </div>

            {/* Error details (collapsed) */}
            {this.state.error && (
              <details className="text-left bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <summary className="p-4 font-bold text-slate-700 cursor-pointer hover:bg-slate-50 transition-colors">
                  View error details
                </summary>
                <div className="p-4 bg-slate-100 text-xs font-mono text-slate-700 overflow-auto max-h-48">
                  <p className="text-red-600 font-bold">{this.state.error.message}</p>
                  <pre className="mt-2 whitespace-pre-wrap">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </div>
              </details>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                variant="primary"
                onClick={this.handleReset}
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

    return this.props.children;
  }
}

// Hook for functional components
export function useErrorBoundary() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = () => setError(null);

  const throwError = (err: Error) => {
    setError(err);
    throw err;
  };

  return { error, resetError, throwError };
}

// Async error boundary wrapper
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