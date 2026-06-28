import { OpenAI } from 'openai';

let agentClient: OpenAI | null = null;

export function getPressAgent() {
  if (!agentClient) {
    const apiKey = process.env.AI_API_KEY;
    const baseURL = process.env.AI_BASE_URL;
    if (!apiKey || !baseURL) {
      throw new Error('AI_API_KEY or AI_BASE_URL is missing in environment variables');
    }
    agentClient = new OpenAI({ apiKey, baseURL });
  }
  return agentClient;
}
