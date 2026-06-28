import { api } from './api';

const hermesChat = async (messages: { role: string; content: string }[]) => {
  const response = await api.post('/v1/chat/completions', { messages });
  return response.data.choices?.[0]?.message?.content || '';
};

export const generateGroundedContent = async (prompt: string) => {
  try {
    const content = await hermesChat([{ role: 'user', content: prompt }]);
    return { text: content, sources: [] };
  } catch (error) {
    console.error("Error generating grounded content:", error);
    return { text: "عذراً، لم أتمكن من الحصول على إجابة حالياً.", sources: [] };
  }
};

export const translateText = async (text: string, targetLanguage: 'ar' | 'en') => {
  try {
    const langName = targetLanguage === 'ar' ? 'Arabic' : 'English';
    const content = await hermesChat([
      { role: 'system', content: `You are a translator. Translate the following text to ${langName}. Return only the translation.` },
      { role: 'user', content: text }
    ]);
    return content || text;
  } catch (error) {
    console.error("Error translating text:", error);
    return text;
  }
};

export const formatFacebookPost = async (postText: string) => {
  try {
    const content = await hermesChat([
      { role: 'system', content: 'Format the following as an engaging social media post. Return only the formatted text.' },
      { role: 'user', content: postText }
    ]);
    return { text: content };
  } catch (error) {
    console.error("Error formatting Facebook post:", error);
    throw error;
  }
};

export const generateSeoMetadata = async (title: any, content: any) => {
  try {
    const raw = await hermesChat([
      { role: 'system', content: 'Generate SEO metadata (title, description, keywords) for the given content. Return as JSON.' },
      { role: 'user', content: JSON.stringify({ title, content }) }
    ]);
    try { return JSON.parse(raw); } catch { return null; }
  } catch (error) {
    console.error("Error generating SEO tags:", error);
    return null;
  }
};
