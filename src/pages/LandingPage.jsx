import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  // VIDEO: Your custom Intro
  const VIDEO_URL = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/intro.mp4";
  
  useEffect(() => {
    // Video Setup
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
      videoRef.current.play().catch(err => console.log("Video autoplay blocked:", err));
    }
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      
      {/* 1. Background Video Layer */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          muted={true}
          playsInline
          onEnded={(e) => e.currentTarget.pause()}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
          style={{ pointerEvents: 'none' }} 
        >
          {/* Mobile Portrait Video (< 768px) */}
          <source 
            src="https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Final.mobile.scene2.mp4" 
            type="video/mp4" 
            media="(max-width: 767px)" 
          />
          {/* Desktop Widescreen Video Fallback (>= 768px) */}
          <source 
            src={VIDEO_URL} 
            type="video/mp4" 
          />
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

      <div className="absolute bottom-4 left-4 z-30 text-gray-500 text-xs font-mono">
        v1.0.6
      </div>
    </div>
  );
};

export default LandingPage;
