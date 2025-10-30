import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import VideoPlayer from "./VideoPlayer";

const YouTubeSearch = () => {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const playerSectionRef = useRef(null);

  // ✅ Fetch videos
  const handleSearch = async () => {
    try {
      const response = await axios.get("https://syncflix-79x2.onrender.com/api/search", {
        params: { q: query },
      });
      setVideos(response.data.items);
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
    }
  };

  // ✅ Select video + scroll
  const handleVideoSelect = (videoId) => {
    setSelectedVideo(videoId);
    setTimeout(() => {
      playerSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 250);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-md py-3 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-center items-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg"
            alt="YouTube"
            className="h-8 sm:h-10"
          />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Search bar */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="bg-gray-800 text-white placeholder-gray-400 px-4 py-2 w-full sm:w-2/3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search videos..."
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded transition-all"
          >
            Search
          </button>
        </div>

        {/* Animated Video Player */}
        <AnimatePresence mode="wait">
          {selectedVideo && (
            <motion.div
              key={selectedVideo}
              ref={playerSectionRef}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mb-9"
            >
              <VideoPlayer videoId={selectedVideo} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Thumbnails */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {videos.map((video) => (
            <motion.div
              key={video.id.videoId}
              layout
              onClick={() => handleVideoSelect(video.id.videoId)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="bg-gray-800 p-2 rounded-lg cursor-pointer hover:shadow-xl hover:bg-gray-700/80 transition-all duration-300"
            >
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="w-full rounded-lg object-cover"
              />
              <p className="text-sm font-medium mt-2 line-clamp-2">
                {video.snippet.title}
              </p>
              <p className="text-xs text-gray-400">
                {video.snippet.channelTitle}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default YouTubeSearch;
