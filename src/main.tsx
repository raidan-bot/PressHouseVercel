import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import * as ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import './i18n';
import { ErrorBoundary } from './components/ErrorBoundary';

// Global postMessage safety interceptor for Axios Errors and Console Output
// Prevents DOMException clone errors caused by console-interceptor / postMessage-bridge tracking in environment
(function installPostMessageSafety() {
  if (typeof window === 'undefined') return;

  const sanitizeArg = (arg: any): any => {
    if (!arg) return arg;
    if (typeof arg !== 'object') return arg;

    // Detect Axios Error or general non-clonable Exception
    if (arg.isAxiosError || (arg.config && (arg.config.transformRequest || arg.config.transformResponse)) || arg instanceof Error) {
      return {
        message: arg.message || 'Unknown Error',
        name: arg.name || 'Error',
        stack: arg.stack,
        status: arg.response?.status,
        statusText: arg.response?.statusText,
        url: arg.config?.url,
        method: arg.config?.method,
        data: arg.response?.data,
      };
    }

    try {
      const seen = new WeakSet();
      const clean = (item: any): any => {
        if (item === null || item === undefined) return item;
        if (typeof item === 'function') return `[Function: ${item.name || 'anonymous'}]`;
        if (typeof item !== 'object') return item;
        if (seen.has(item)) return '[Circular Reference]';
        seen.add(item);
        
        if (Array.isArray(item)) {
          return item.map(clean);
        }
        
        const res: any = {};
        for (const key of Object.keys(item)) {
          res[key] = clean(item[key]);
        }
        return res;
      };
      return clean(arg);
    } catch (e) {
      return String(arg);
    }
  };

  // Intercept and sanitize Console Error and Warning payloads
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  console.error = function (...args: any[]) {
    try {
      originalConsoleError.apply(console, args.map(sanitizeArg));
    } catch (e) {
      originalConsoleError.apply(console, args);
    }
  };

  console.warn = function (...args: any[]) {
    try {
      originalConsoleWarn.apply(console, args.map(sanitizeArg));
    } catch (e) {
      originalConsoleWarn.apply(console, args);
    }
  };

  // Intercept Uncaught Promise Rejection events (usually thrown by Axios requests and unhandled)
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason) {
      const error = event.reason;
      if (error.isAxiosError || (error.config && (error.config.transformRequest || error.config.transformResponse))) {
        event.preventDefault();
        console.warn('Unhandled Promise Rejection (Sanitized AxiosError):', sanitizeArg(error));
      }
    }
  });
})();

// React 19 findDOMNode Polyfill for older libraries (like react-helmet-async, react-quill)
const rDom: any = ReactDOM;
if (rDom) {
  const polyfill = (node: any) => {
    if (!node) return null;
    if (node.nodeType) return node;
    return null;
  };
  
  if (!rDom.findDOMNode) {
    try {
      rDom.findDOMNode = polyfill;
    } catch (e) {
      console.warn('Failed to assign findDOMNode to ReactDOM namespace directly:', e);
    }
  }
  
  // Also check default export
  const rDomDefault = rDom.default || rDom;
  if (rDomDefault && !rDomDefault.findDOMNode) {
    try {
      rDomDefault.findDOMNode = polyfill;
    } catch (e) {
      console.warn('Failed to assign findDOMNode to ReactDOM default export:', e);
    }
  }
}

createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
);
