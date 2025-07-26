import React, { useState } from "react";
import axios from "axios";
import VideoPlayer from "./VideoPlayer";

const YouTubeSearch = () => {
  const [query, setQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/search", {
        params: { q: query },
      });
      setVideos(response.data.items);
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header with YouTube logo */}
      <header >
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
            className="bg-gray-800 text-white placeholder-gray-400 px-4 py-2 w-full sm:w-2/3 rounded focus:outline-none"
            placeholder="Search videos..."
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Search
          </button>
        </div>

        {/* Video player */}
        {selectedVideo && (
          <div className="mb-8">
            <VideoPlayer videoId={selectedVideo} />
          </div>
        )}

        {/* Thumbnails */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div
              key={video.id.videoId}
              onClick={() => setSelectedVideo(video.id.videoId)}
              className="bg-gray-800 p-2 rounded-lg cursor-pointer hover:shadow-lg transition duration-300"
            >
              <img
                src={video.snippet.thumbnails.medium.url}
                alt={video.snippet.title}
                className="w-full rounded"
              />
              <p className="text-sm font-medium mt-2">{video.snippet.title}</p>
              <p className="text-xs text-gray-400">
                {video.snippet.channelTitle}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default YouTubeSearch;
