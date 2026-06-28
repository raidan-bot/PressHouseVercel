import { onCLS, onLCP, onFCP, onTTFB } from 'web-vitals';

interface PerformanceMetric {
  name: string;
  value: number;
  id: string;
}

const metrics: PerformanceMetric[] = [];

export const reportWebVitals = () => {
  onCLS((metric) => metrics.push({ name: 'CLS', value: metric.value, id: metric.id }));
  onLCP((metric) => metrics.push({ name: 'LCP', value: metric.value, id: metric.id }));
  onFCP((metric) => metrics.push({ name: 'FCP', value: metric.value, id: metric.id }));
  onTTFB((metric) => metrics.push({ name: 'TTFB', value: metric.value, id: metric.id }));
};

export const getPerformanceReport = () => metrics;

export const trackApiPerformance = (path: string, startTime: number) => {
  const duration = performance.now() - startTime;
  // In a real scenario, this would be sent to a backend endpoint.
  // For now, we store it in a local structure.
  console.log(`API ${path} took ${duration.toFixed(2)}ms`);
  localStorage.setItem(`api_perf_${path}`, JSON.stringify({ path, duration, timestamp: Date.now() }));
};
