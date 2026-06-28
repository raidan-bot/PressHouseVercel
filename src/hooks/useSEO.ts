import { useEffect } from 'react';
import { api } from '../services/api';

export const useSEO = (pageId: string) => {
  useEffect(() => {
    const fetchSEO = async () => {
      try {
        const { data } = await api.get(`/api/pages/seo/${pageId}`);
        if (data) {
          document.title = data.title;
          
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', data.description);
          }
          
          const ogImage = document.querySelector('meta[property="og:image"]');
          if (ogImage && data.image) {
            ogImage.setAttribute('content', data.image);
          }
        }
      } catch (error) {
        console.error('Failed to fetch SEO data:', error);
      }
    };

    if (pageId) {
      fetchSEO();
    }
  }, [pageId]);
};
