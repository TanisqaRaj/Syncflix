import express from "express";
import axios from "axios";

const youtubeRoutes = express.Router();

youtubeRoutes.get("/search", async (req, res) => {
  const { q } = req.query;

  // ✅ Safety check
  if (!q) {
    return res.status(400).json({ error: "Missing search query 'q'" });
  }

  // ✅ Check if API key is available
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) {

    return res.status(500).json({ error: "YouTube API key is missing" });
  }

  try {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
      params: {
        part: "snippet",
        q,
        maxResults: 15,
        type: "video",
        key: apiKey,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("YouTube API Error:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      error: error.response?.data || error.message,
    });
  }
});

export default youtubeRoutes;
