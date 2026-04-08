import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Health route
app.get("/", (req, res) => {
  res.send("AI Chatbot Backend Running 🚀");
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  // 🔁 Gemini first
  const models = ["gemini-flash-latest", "gemini-pro"];

  for (let i = 0; i < models.length; i++) {
    try {
      const model = genAI.getGenerativeModel({
        model: models[i],
      });

      const result = await model.generateContent([
        {
          text: `
You are an AI assistant for Dheeraj Srivastava.

Details:
- Full Stack Developer (React, Node.js, MongoDB)

User question: ${message}
`,
        },
      ]);

      const response = result.response.text();

      return res.json({ reply: response });

    } catch (error) {
      console.log(`❌ Gemini ${models[i]} failed`);
    }
  }

  //  FINAL FALLBACK → OpenRouter
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an AI assistant for Dheeraj Srivastava (Full Stack Developer).",
          },
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    return res.json({ reply });

  } catch (error) {
    console.log(" OpenRouter also failed");

    return res.json({
      reply:
        "⚠️ AI services are temporarily unavailable. Please try again later.",
    });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));