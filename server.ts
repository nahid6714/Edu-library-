import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Modality } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Initialize Google GenAI client lazily or with fallback
function getGenAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Routes

// 1. Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "Edu Library Backend" });
});

// 2. Gemini Multi-turn Chat
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { messages, systemInstruction, model } = req.body;
    const ai = getGenAIClient();
    
    // Choose model based on request or default to gemini-3.5-flash
    const targetModel = model || "gemini-3.5-flash";

    // Format history into structure expected by chat or generateContent
    const formattedContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: targetModel,
      contents: formattedContents,
      config: {
        systemInstruction: systemInstruction || "You are an expert AI Study Assistant for Bangladeshi students (SSC, HSC, Honours, Masters, BCS, Job Exam). Answer clearly in English or Bengali as appropriate.",
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    res.status(500).json({ error: error.message || "Failed to process chat response" });
  }
});

// 3. Gemini Image / Document Analysis
app.post("/api/gemini/analyze-image", async (req, res) => {
  try {
    const { imageBase64, mimeType, prompt } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "Missing imageBase64 data" });
    }

    const ai = getGenAIClient();
    // Use gemini-3.1-pro-preview for image analysis as required by user prompt
    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType || "image/jpeg",
              data: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
            },
          },
          {
            text: prompt || "Analyze this document/note screenshot. Summarize key points, explain any equations, key formulas, or questions shown, and provide a clear study guide in Bengali and English.",
          },
        ],
      },
      config: {
        systemInstruction: "You are an expert educational document analyzer for Bangladeshi curricula. Provide structured, accurate, and easy-to-read analysis.",
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini Image Analysis Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze document image" });
  }
});

// 4. Gemini Text to Speech (TTS)
app.post("/api/gemini/tts", async (req, res) => {
  try {
    const { text, voiceName } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Missing text to convert to speech" });
    }

    const ai = getGenAIClient();
    // Use gemini-3.1-flash-tts-preview as specified in prompt
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: text.substring(0, 1000) }] }], // Cap to reasonable length for speech
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName || "Kore" },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      throw new Error("No audio payload returned from Gemini TTS");
    }

    res.json({ audioBase64: base64Audio });
  } catch (error: any) {
    console.error("Gemini TTS Error:", error);
    res.status(500).json({ error: error.message || "Failed to convert text to speech" });
  }
});

// Setup Vite or Static File Serving
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Edu Library App Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
