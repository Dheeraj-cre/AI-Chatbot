import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
const model = genAI.getGenerativeModel({
  model: "gemini-flash-latest"
});
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
`
      }
    ]);

    const response = result.response.text();

    res.json({ reply: response });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));