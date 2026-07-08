import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import { trackApiPerformance } from '../utils/performance';

// Get base URL considering local dev or production
const API_URL = import.meta.env?.VITE_API_URL || process.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to start performance timer
api.interceptors.request.use((config) => {
  // @ts-ignore
  config.metadata = { startTime: performance.now() };
  return config;
});

// Response interceptor to handle unauthenticated sessions and errors, and stop timer
api.interceptors.response.use(
  (response) => {
    // @ts-ignore
    trackApiPerformance(response.config.url!, response.config.metadata.startTime);
    return response;
  },
  (error: AxiosError<{ message?: string }>) => {
    // @ts-ignore
    if (error.config?.metadata?.startTime) {
      // @ts-ignore
      trackApiPerformance(error.config.url!, error.config.metadata.startTime);
    }
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;

    if (status === 401 || status === 403) {
      toast.error('جلسة العمل انتهت، يرجى تسجيل الدخول مجدداً');
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
    } else if (status === 404) {
      toast.error('الرابط المطلوب غير موجود');
    } else if (status && status >= 500) {
      toast.error('خطأ في الخادم، يرجى المحاولة لاحقاً');
    } else {
      // User-friendly error messages
      toast.error(message || 'حدث خطأ غير متوقع');
    }
    return Promise.reject(error);
  }
);
