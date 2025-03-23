import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import axios from "axios";
import morgan from "morgan";

dotenv.config({ path: "../.env" });

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" })); // Allow all origins (update for security)
app.use(morgan("dev")); // Log all requests

const API_KEY = process.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("❌ API Key is missing. Set VITE_GEMINI_API_KEY in .env!");
  process.exit(1);
}

const MODEL_NAME = "gemini-1.5-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

app.post("/chat", async (req, res) => {
  console.log("🔹 Received request:", req.body);

  if (!req.body.prompt) {
    return res.status(400).json({ error: "Prompt is required!" });
  }

  try {
    const response = await axios.post(GEMINI_API_URL, {
      contents: [{ parts: [{ text: req.body.prompt }] }],
    });

    console.log("✅ AI Response:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error:", error?.response?.data || error.message);

    res.status(error.response?.status || 500).json({
      error: error.response?.data || "Failed to fetch AI response",
    });
  }
});

const PORT = process.env.PORT || 1000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
