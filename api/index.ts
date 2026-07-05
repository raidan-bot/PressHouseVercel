import type_vercel from "@vercel/node";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Chat endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, model = "z-ai/glm-5.2", temperature = 1, top_p = 1, max_tokens = 16384, stream = false } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const OpenAI = (await import("openai")).default;
    const openai = new OpenAI({
      apiKey: process.env.NVIDIA_API_KEY,
      baseURL: "https://integrate.api.nvidia.com/v1",
    });

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

      for await (const chunk of completion) {
        res.write(`data: ${JSON.stringify(chunk)}\\n\\n`);
      }
      res.write("data: [DONE]\\n\\n");
      res.end();
    } else {
      res.json(completion);
    }
  } catch (error: any) {
    console.error("AI API Error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

export default app;
