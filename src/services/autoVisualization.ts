import { api } from './api';

export interface DataPoint {
  label: string;
  value: number;
  category?: string;
  color?: string;
}

export interface Visualization {
  id: string;
  type: 'bar' | 'line' | 'pie' | 'map' | 'timeline' | 'network';
  title: string;
  description: string;
  data: DataPoint[];
  config: {
    xAxis?: string;
    yAxis?: string;
    colors?: string[];
    stacked?: boolean;
    animated?: boolean;
  };
  svg?: string;
  html?: string;
}

class AutoVisualizationService {
  async generateFromText(text: string): Promise<Visualization[]> {
    const response = await api.post('/api/ai/visualize/text', { text });
    return response.data.visualizations;
  }

  async generateFromData(data: DataPoint[], type?: string): Promise<Visualization> {
    const response = await api.post('/api/ai/visualize/data', { data, type });
    return response.data;
  }

  async generateFromURL(url: string): Promise<Visualization[]> {
    const response = await api.post('/api/ai/visualize/url', { url });
    return response.data.visualizations;
  }

  async suggestVisualizations(query: string): Promise<Visualization[]> {
    const response = await api.post('/api/ai/visualize/suggest', { query });
    return response.data.suggestions;
  }

  async exportVisualization(id: string, format: 'svg' | 'png' | 'pdf'): Promise<string> {
    const response = await api.get(`/api/ai/visualize/export/${id}?format=${format}`);
    return response.data.url;
  }

  async enhanceVisualization(visualization: Visualization, style: string): Promise<Visualization> {
    const response = await api.post('/api/ai/visualize/enhance', { visualization, style });
    return response.data;
  }

  generateDefaultColors(count: number): string[] {
    const colors = [
      '#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#7c3aed',
      '#db2777', '#0891b2', '#ea580c', '#4f46e5', '#059669',
    ];
    return colors.slice(0, count);
  }
}

export const autoVisualizationService = new AutoVisualizationService();