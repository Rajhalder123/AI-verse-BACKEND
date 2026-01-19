import express from "express";
import cors from "cors";

const app = express();

// ✅ Apply CORS to all requests, including preflight
app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-frontend-domain.com"], // add deployed frontend too
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ✅ Optional: handle all OPTIONS requests manually (works on some platforms)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // or restrict to your frontend
  res.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

/* ---------------- ANALYZE ENDPOINT ---------------- */
app.post("/analyze", (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "No code provided" });
  const explanation = `Received ${code.split("\n").length} lines of code.`;
  res.json({ result: explanation });
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
