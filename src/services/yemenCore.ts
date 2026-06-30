import { api } from './api';

export interface Entity {
  id: string;
  name: string;
  type: 'person' | 'organization' | 'location' | 'event';
  description: string;
  relationships: Relationship[];
  mentions: number;
  sentiment: number; // -1 to 1
}

export interface Relationship {
  targetId: string;
  targetName: string;
  type: 'ally' | 'opponent' | 'neutral' | 'family' | 'business';
  strength: number; // 0-1
}

export interface GraphData {
  nodes: Entity[];
  edges: { source: string; target: string; value: number }[];
}

class YemenCoreService {
  async getEntity(id: string): Promise<Entity> {
    const response = await api.get(`/api/knowledge/entity/${id}`);
    return response.data;
  }

  async searchEntities(query: string): Promise<Entity[]> {
    const response = await api.post('/api/knowledge/search', { query });
    return response.data;
  }

  async getGraph(entityId: string): Promise<GraphData> {
    const response = await api.get(`/api/knowledge/graph/${entityId}`);
    return response.data;
  }

  async getRelated(entityId: string, depth: number = 2): Promise<Entity[]> {
    const response = await api.get(`/api/knowledge/related/${entityId}?depth=${depth}`);
    return response.data;
  }

  async analyzeSentiment(text: string): Promise<{ sentiment: number; confidence: number }> {
    const response = await api.post('/api/knowledge/sentiment', { text });
    return response.data;
  }

  async detectConflicts(entities: Entity[]): Promise<{ entity1: string; entity2: string; conflict: string }[]> {
    const response = await api.post('/api/knowledge/conflicts', { entities });
    return response.data;
  }
}

export const yemenCoreService = new YemenCoreService();