import React, { useState, useRef, useEffect } from "react";
import { 
  FaPhoneSlash, 
  FaVolumeUp, 
  FaVolumeMute, 
  FaDesktop, 
  FaVideo, 
  FaVideoSlash 
} from "react-icons/fa";

const Room = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const videoRef = useRef(null);
  const localStream = useRef(null);

  // Get Camera + Mic stream
  useEffect(() => {
    async function getStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStream.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera/mic", err);
      }
    }
    getStream();
  }, []);

  // Mute/Unmute
  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (localStream.current) {
      localStream.current.getAudioTracks().forEach(track => {
        track.enabled = isMuted; // toggle audio
      });
    }
  };

  // Video On/Off
  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    if (localStream.current) {
      localStream.current.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff; // toggle video
      });
    }
  };

  // Screen Share
  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = screenStream;
      }
    } catch (err) {
      console.error("Error sharing screen", err);
    }
  };

  // End Call
  const endCall = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
    }
    alert("Call Ended");
  };

  return (
    <div className="h-screen w-full bg-gray-900 flex flex-col">
      
      {/* Video Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="rounded-lg border border-gray-700 max-h-full max-w-full bg-black"
        ></video>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 flex justify-center items-center space-x-6">
        
        {/* Screen Share */}
        <button
          onClick={shareScreen}
          className="p-4 bg-blue-600 hover:bg-blue-700 rounded-full text-white text-xl"
        >
          <FaDesktop />
        </button>

        {/* Mute/Unmute */}
        <button
          onClick={toggleMute}
          className="p-4 bg-yellow-500 hover:bg-yellow-600 rounded-full text-white text-xl"
        >
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>

        {/* Video On/Off */}
        <button
          onClick={toggleVideo}
          className="p-4 bg-purple-500 hover:bg-purple-600 rounded-full text-white text-xl"
        >
          {isVideoOff ? <FaVideoSlash /> : <FaVideo />}
        </button>

        {/* End Call */}
        <button
          onClick={endCall}
          className="p-4 bg-red-600 hover:bg-red-700 rounded-full text-white text-xl"
        >
          <FaPhoneSlash />
        </button>
      </div>
    </div>
  );
}

export default Room;