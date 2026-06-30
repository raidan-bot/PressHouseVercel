import { api } from './api';

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  source: string;
  timestamp: string;
  credibility: number; // 0-100
  urgency: 'low' | 'medium' | 'high' | 'critical';
  sentiment: 'positive' | 'neutral' | 'negative';
  relatedEvents: string[];
  keywords: string[];
  location?: {
    lat: number;
    lng: number;
    name: string;
  };
}

export interface AnalysisResult {
  credibility: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  sentiment: 'positive' | 'neutral' | 'negative';
  summary: string;
  relatedTopics: string[];
  timeline: { date: string; event: string }[];
}

class TAQIService {
  async analyzeNews(newsId: string): Promise<AnalysisResult> {
    const response = await api.post('/api/ai/analyze-news', { newsId });
    return response.data;
  }

  async getNewsStream(): Promise<NewsItem[]> {
    const response = await api.get('/api/news/stream');
    return response.data;
  }

  async checkCredibility(text: string): Promise<number> {
    const response = await api.post('/api/ai/credibility', { text });
    return response.data.credibility;
  }

  async generateSummary(text: string): Promise<string> {
    const response = await api.post('/api/ai/summarize', { text });
    return response.data.summary;
  }

  calculateUgency(item: NewsItem): 'low' | 'medium' | 'high' | 'critical' {
    const { credibility, keywords } = item;
    const urgentKeywords = ['breaking', 'urgent', 'critical', 'emergency'];
    const hasUrgent = keywords.some(k => urgentKeywords.includes(k.toLowerCase()));
    
    if (credibility > 90 && hasUrgent) return 'critical';
    if (credibility > 80 || hasUrgent) return 'high';
    if (credibility > 60) return 'medium';
    return 'low';
  }
}

export const taqiService = new TAQIService();