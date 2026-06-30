import { api } from './api';

export interface EditSuggestion {
  id: string;
  type: 'grammar' | 'style' | 'clarity' | 'sensitivity' | 'accuracy';
  original: string;
  suggested: string;
  explanation: string;
  confidence: number;
}

export interface StyleAnalysis {
  readability: number;
  formality: number;
  sentiment: number;
  complexity: 'simple' | 'moderate' | 'complex';
  suggestions: string[];
}

class NeuralEditingService {
  async analyzeText(text: string): Promise<EditSuggestion[]> {
    const response = await api.post('/api/ai/edit/analyze', { text });
    return response.data.suggestions;
  }

  async checkGrammar(text: string): Promise<EditSuggestion[]> {
    const response = await api.post('/api/ai/edit/grammar', { text });
    return response.data.suggestions;
  }

  async improveClarity(text: string): Promise<string> {
    const response = await api.post('/api/ai/edit/clarity', { text });
    return response.data.text;
  }

  async checkSensitivity(text: string): Promise<{ issues: string[]; severity: 'low' | 'medium' | 'high' }> {
    const response = await api.post('/api/ai/edit/sensitivity', { text });
    return response.data;
  }

  async getStyleAnalysis(text: string): Promise<StyleAnalysis> {
    const response = await api.post('/api/ai/edit/style', { text });
    return response.data;
  }

  async applyEdits(text: string, edits: EditSuggestion[]): Promise<string> {
    const response = await api.post('/api/ai/edit/apply', { text, edits });
    return response.data.text;
  }
}

export const neuralEditingService = new NeuralEditingService();