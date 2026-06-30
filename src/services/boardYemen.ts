import { api } from './api';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  type: 'conflict' | 'humanitarian' | 'development' | 'environmental';
  title: string;
  description: string;
  date: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  sources: string[];
}

export interface MapLayer {
  id: string;
  name: string;
  visible: boolean;
  markers: MapMarker[];
  color: string;
}

export interface PredictionData {
  area: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  timeframe: string;
}

class BoardYemenService {
  async getMarkers(): Promise<MapMarker[]> {
    const response = await api.get('/api/map/markers');
    return response.data;
  }

  async getPredictions(): Promise<PredictionData[]> {
    const response = await api.get('/api/map/predictions');
    return response.data;
  }

  async filterByType(type: string): Promise<MapMarker[]> {
    const response = await api.get(`/api/map/filter?type=${type}`);
    return response.data;
  }

  async getTimeline(): Promise<{ year: number; events: number; severity: number }[]> {
    const response = await api.get('/api/map/timeline');
    return response.data;
  }

  calculateHeatmapData(markers: MapMarker[]): { lat: number; lng: number; intensity: number }[] {
    return markers.map(m => ({
      lat: m.lat,
      lng: m.lng,
      intensity: m.severity === 'critical' ? 10 : m.severity === 'high' ? 7 : m.severity === 'medium' ? 4 : 1,
    }));
  }
}

export const boardYemenService = new BoardYemenService();