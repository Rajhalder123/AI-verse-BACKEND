import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();

/* ---------------- CORS ---------------- */
app.use(
  cors({
    origin: ["http://localhost:5173"], // frontend dev URL
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
  res.json({ status: "AI-Verse backend running 🚀" });
});

/* ---------------- ANALYZE ENDPOINT ---------------- */
app.post("/analyze", (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "No code provided" });
  }

  // Simple dummy explanation (replace with your own logic if needed)
  const explanation = `Received ${code.split("\n").length} lines of code.`;

  res.json({ result: explanation });
});

/* ---------------- HANDLE PREFLIGHT ---------------- */
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
