import { api } from './api';

export interface ContentRequest {
  type: 'article' | 'summary' | 'headline' | 'social' | 'report';
  topic?: string;
  tone?: 'formal' | 'casual' | 'urgent' | 'analytical';
  length?: 'short' | 'medium' | 'long';
  language?: 'ar' | 'en';
  context?: string;
  content?: string;
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

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatCompletionOptions {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface ChatCompletionChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason: string | null;
    logprobs: null;
  }>;
}

export interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ChatMessage;
    finish_reason: string;
    logprobs: null;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

class PressAgentService {
  // Language Preference
  private language: string = 'ar';
  // Generation Mode
  getMode(): 'expert' | 'fast' | 'balanced' {
    return 'balanced';
  }
  // Get the session: used for searching/updating the local DB
  getSession() {
    return { id: crypto.randomUUID(), mode: this.getMode() };
  }
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

  async chatCompletion(options: ChatCompletionOptions): Promise<ChatCompletionResponse> {
    // Use the local API route that proxies to PressHouse Agent
    const response = await api.post('/api/press-agent/chat', options);
    return response.data;
  }

  async streamChatCompletion(options: ChatCompletionOptions, onData: (chunk: ChatCompletionChunk) => void): Promise<void> {
    const response = await fetch('/api/press-agent/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({ ...options, stream: true }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') return;
          
          try {
            const parsed = JSON.parse(data);
            onData(parsed);
          } catch {
            // Ignore malformed chunks
          }
        }
      }
    }
  }
}

export const pressAgentService = new PressAgentService();

// Get PressHouse Agent API base URL
function getAgentBaseURL(): string {
  // In browser, use relative path (proxied through Vite dev server)
  if (typeof window !== 'undefined') {
    return '/api';
  }
  // In Node.js (server.ts), use the deployed agent URL
  return process.env.PRESS_AGENT_URL || 'https://agent.ph-ye.org';
}

// Get PressHouse Agent API key
function getAgentAPIKey(): string {
  return process.env.PRESS_AGENT_API_KEY || 'ph_agent_7a9f3b2e1d4c5f6a8b9e0d1c2f3a4b5c';
}

// Create an OpenAI-compatible client for server-side usage
export function getPressAgent() {
  const baseURL = getAgentBaseURL();
  const apiKey = getAgentAPIKey();

  return {
    chat: {
      completions: {
        async create(options: ChatCompletionOptions): Promise<ChatCompletionResponse> {
          // In browser, use axios through the local API proxy
          if (typeof window !== 'undefined') {
            const response = await api.post('/api/press-agent/chat', options);
            return response.data;
          }
          
          // On server, make direct HTTP request to PressHouse Agent
          const response = await fetch(`${baseURL}/v1/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify(options),
          });

          if (!response.ok) {
            const error = await response.text();
            throw new Error(`PressHouse Agent API error: ${error}`);
          }

          return response.json();
        }
      }
    }
  } as any; // Cast to any to bypass strict type checking for OpenAI compatibility
}