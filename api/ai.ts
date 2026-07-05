import { VercelRequest, VercelResponse } from "@vercel/node";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || "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",
  baseURL: "https://integrate.api.nvidia.com/v1",
});

const DEFAULT_MODEL = "z-ai/glm-5.2";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { messages, model = DEFAULT_MODEL, temperature = 1, top_p = 1, max_tokens = 16384, stream = false } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const completion = await openai.chat.completions.create({
      model,
      messages,
      temperature,
      top_p,
      max_tokens,
      seed: 42,
      stream,
    });

    if (stream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
 SSE
      for await (const chunk of completion) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
      res.write("data: [DONE]\n\n");
      res.end();
    } else {
      res.status(200).json(completion);
    }
  } catch (error: any) {
    console.error("AI API Error:", error);
    res.status(500).json({ 
      error: "Internal server error", 
      details: error.message 
    });
  }
}
