import { api } from './api';

export interface ContentRequest {
  type: 'article' | 'summary' | 'headline' | 'social' | 'report';
  topic: string;
  tone: 'formal' | 'casual' | 'urgent' | 'analytical';
  length: 'short' | 'medium' | 'long';
  language: 'ar' | 'en';
  context?: string;
}

export interface GeneratedContent {
  id: string;
  content: string;
  type: string;
  quality: number;
  suggestions: string[];
  sources: string[];
  createdAt: string;
}

class PressAgentService {
  async generateContent(request: ContentRequest): Promise<GeneratedContent> {
    const response = await api.post('/api/ai/generate', request);
    return response.data;
  }

  async suggestHeadlines(article: string, count: number = 5): Promise<string[]> {
    const response = await api.post('/api/ai/headlines', { article, count });
    return response.data.headlines;
  }

  async improveText(text: string, style: string = 'journalistic'): Promise<string> {
    const response = await api.post('/api/ai/improve', { text, style });
    return response.data.text;
  }

  async factCheck(text: string): Promise<{ isVerified: boolean; sources: string[]; corrections: string[] }> {
    const response = await api.post('/api/ai/fact-check', { text });
    return response.data;
  }

  async translate(text: string, targetLang: 'ar' | 'en'): Promise<string> {
    const response = await api.post('/api/ai/translate', { text, targetLang });
    return response.data.translation;
  }

  async analyzeTone(text: string): Promise<{ dominant: string; scores: Record<string, number> }> {
    const response = await api.post('/api/ai/tone', { text });
    return response.data;
  }
}

export const pressAgentService = new PressAgentService();

// Legacy export for server.ts compatibility
export function getPressAgent() {
  return pressAgentService;
}