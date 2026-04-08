import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


app.get("/", (req, res) => {
  res.send("AI Chatbot Backend Running 🚀");
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest",
  });

  let attempts = 3;

  while (attempts > 0) {
    try {
      const result = await model.generateContent([
        {
          text: `
You are an AI assistant for Dheeraj Srivastava.

Details:
- Full Stack Developer (React, Node.js, MongoDB)
- Projects:
  1. Medico (Medicine Reminder App)
  2. Profile Management App
- Skills: JavaScript, React, Node.js, MongoDB

Answer professionally and help recruiters understand his profile.

User question: ${message}
`,
        },
      ]);

      const response = result.response.text();

      return res.json({ reply: response });

    } catch (error) {
      console.log("Retry attempt failed:", error.status || error.message);

      attempts--;

      // ⏳ wait 2 sec before retry
      await new Promise((resolve) => setTimeout(resolve, 2000));

      if (attempts === 0) {
        return res.json({
          reply: "⚠️ AI is busy right now. Please try again in a few seconds.",
        });
      }
    }
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));