import { useEffect } from 'react';
import { api } from '../services/api';

export const useThemeConfig = () => {
  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const { data } = await api.get('/api/settings/theme');
        // Expected data format: { primary: '#color', secondary: '#color', accent: '#color' }
        if (data) {
          document.documentElement.style.setProperty('--color-primary', data.primary);
          document.documentElement.style.setProperty('--color-secondary', data.secondary);
          document.documentElement.style.setProperty('--color-accent', data.accent);
        }
      } catch (err) {
        console.error('Failed to load theme config', err);
      }
    };
    fetchTheme();
  }, []);
};
