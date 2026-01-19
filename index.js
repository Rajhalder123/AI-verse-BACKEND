import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/* ---------------- CORS ---------------- */
app.use(
  cors({
    origin: "*", // OK for now
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors()); // ✅ preflight fix
app.use(express.json());

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.json({ status: "AI-Verse backend running 🚀" });
});

/* ---------------- AI CODE EXPLANATION ---------------- */
app.post("/analyze", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: "GROQ API key missing" });
  }

  try {
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "You are a senior software engineer." },
          { role: "user", content: `Explain this code:\n${code}` },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result =
      response.data?.choices?.[0]?.message?.content ||
      "No explanation returned";

    res.json({ result });
  } catch (err) {
    console.error("Groq API error:", err.response?.data || err.message);
    res.status(500).json({ error: "AI analysis failed" });
  }
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
