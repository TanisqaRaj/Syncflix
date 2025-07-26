import React, { useEffect, useRef } from "react";
import YouTube from "react-youtube";

const VideoPlayer = ({ videoId }) => {
  const playerRef = useRef(null);

  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1, // 👈 AutoPlay ON
      controls: 1, // 👈 Show default controls
    },
  };

  const onReady = (event) => {
    playerRef.current = event.target;
    event.target.playVideo(); // 👈 Play immediately when ready
  };

  // Optional: auto-play again if `videoId` changes
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.playVideo();
    }
  }, [videoId]);

 return (
  <div className="relative w-full pt-[56.25%] mb-8 rounded-lg overflow-hidden shadow-lg">
    <div className="absolute top-0 left-0 w-full h-full">
      <YouTube
        videoId={videoId}
        onReady={onReady}
        opts={{
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 1,
            controls: 1,
          },
        }}
        className="w-full h-full"
      />
    </div>
  </div>
);
};

export default VideoPlayer;
