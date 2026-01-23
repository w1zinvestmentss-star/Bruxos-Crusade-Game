import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Volume2, VolumeX } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMuted, setIsMuted] = useState(true);
  
  const videoRef = useRef(null);
  const musicRef = useRef(null);

  // VIDEO: Your custom Intro
  const VIDEO_URL = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/intro.mp4";
  
  // MUSIC: Your Custom Title Theme
  const MUSIC_URL = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Title%20Theme%20song%20(The%20w1z).mp3";
  
  useEffect(() => {
    // Video Setup
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
      videoRef.current.play().catch(err => console.log("Video autoplay blocked:", err));
    }

    // Music Setup
    if (musicRef.current) {
      musicRef.current.volume = 0.5; 
    }
  }, []);

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);

    if (videoRef.current) {
      videoRef.current.muted = newMuteState;
    }

    if (musicRef.current) {
      if (newMuteState) {
        musicRef.current.pause();
      } else {
        musicRef.current.play().catch(e => console.log("Music play failed:", e));
      }
    }
  };

  return (
    // CHANGED: bg-black ensures a seamless start if video takes a moment to load
    <div className="relative w-full h-screen overflow-hidden bg-black">
      
      {/* HIDDEN MUSIC PLAYER */}
      <audio ref={musicRef} loop>
        <source src={MUSIC_URL} type="audio/mp3" />
      </audio>

      {/* 1. Background Video Layer */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          // loop removed: Stops on last frame
          muted={true}
          playsInline
          // REMOVED: poster={POSTER_IMG} -> No more "flash" of the old image
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
          style={{ pointerEvents: 'none' }} 
        >
          <source src={VIDEO_URL} type="video/mp4" key={VIDEO_URL} />
        </video>
      </div>

      {/* 2. UI Layer */}
      <div className="relative z-20 flex flex-col items-center justify-end h-full text-center pb-32">
        
        {/* START BUTTON */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 1 }} 
          
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/login')}
          className="flex items-center gap-3 px-8 py-4 bg-red-700 border-4 border-yellow-400 text-white font-bold text-xl uppercase hover:bg-red-600 transition-all shadow-xl cursor-pointer"
          style={{ fontFamily: "'Press Start 2P', cursive", fontSize: "16px" }}
        >
          <Play size={20} fill="white" /> Start Game
        </motion.button>
      </div>

      {/* Audio Toggle */}
      <button 
        onClick={toggleMute}
        className="absolute bottom-8 right-8 z-30 p-3 bg-black/50 rounded-full text-white border-2 border-gray-500 hover:bg-white/20 transition-colors cursor-pointer"
      >
        {isMuted ? <VolumeX /> : <Volume2 />}
      </button>

      <div className="absolute bottom-4 left-4 z-30 text-gray-500 text-xs font-mono">
        v1.0.6
      </div>
    </div>
  );
};

export default LandingPage;