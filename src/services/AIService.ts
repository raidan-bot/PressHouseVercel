import { api } from './api';

export const generateGroundedContent = async (prompt: string) => {
  try {
    const response = await api.post('/api/ai/chat', { prompt });
    return response.data; 
  } catch (error) {
    console.error("Error generating grounded content:", error);
    return { text: "عذراً، لم أتمكن من الحصول على إجابة حالياً.", sources: [] };
  }
};

export const translateText = async (text: string, targetLanguage: 'ar' | 'en') => {
  try {
    const response = await api.post('/api/ai/translate', { text, targetLanguage });
    return response.data.text || text;
  } catch (error) {
    console.error("Error translating text:", error);
    return text;
  }
};

export const formatFacebookPost = async (postText: string) => {
  try {
    const response = await api.post('/api/ai/format-post', { postText });
    return response.data;
  } catch (error) {
    console.error("Error formatting Facebook post:", error);
    throw error;
  }
};

export const generateSeoMetadata = async (title: any, content: any) => {
  try {
    const response = await api.post('/api/ai/generate-seo', { title, content });
    return response.data;
  } catch (error) {
    console.error("Error generating SEO tags:", error);
    return null;
  }
};

export const generateSliderSummary = async (title: any, content: any) => {
  try {
    const response = await api.post('/api/ai/generate-summary', { title, content });
    return response.data;
  } catch (error) {
    console.error("Error generating slider summary:", error);
    return null;
  }
};
