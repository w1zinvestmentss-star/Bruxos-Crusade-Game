import React, { useState, useRef } from 'react';
import { FastForward, Volume2, VolumeX } from 'lucide-react';

const ACT1_VIDEO_URL = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Cut%20Scene%201%20-%20The%20Fall.mp4";

export default function IntroCinematic({ onComplete }) {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const handleVideoEnd = () => {
    onComplete();
  };

  const handleSkip = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
    onComplete();
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black flex items-center justify-center select-none overflow-hidden">
      
      {/* 16:9 Aspect-Locked Responsive Video Container */}
      <div className="relative w-full h-full max-w-[177.78dvh] max-h-[56.25dvw] aspect-video flex items-center justify-center bg-black">
        <video
          ref={videoRef}
          src={ACT1_VIDEO_URL}
          autoPlay
          playsInline
          muted={isMuted}
          onEnded={handleVideoEnd}
          onPlay={() => setHasStarted(true)}
          className="w-full h-full object-contain"
        />

        {/* Top Controls Overlay */}
        <div className="absolute top-4 right-4 z-50 flex items-center gap-3">
          
          {/* Mute / Unmute Toggle */}
          <button
            onClick={toggleMute}
            className="p-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/20 hover:border-white/40 text-white transition-all cursor-pointer shadow-lg active:scale-95"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} className="text-yellow-400" />}
          </button>

          {/* SKIP BUTTON */}
          <button
            onClick={handleSkip}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/80 backdrop-blur-md border-2 border-yellow-500/50 hover:border-yellow-400 hover:bg-yellow-500 hover:text-black text-yellow-400 font-pixel text-[10px] tracking-wider uppercase transition-all shadow-[0_0_15px_rgba(0,0,0,0.8)] cursor-pointer active:translate-y-0.5"
          >
            <span>SKIP INTRO</span>
            <FastForward size={14} />
          </button>
        </div>

        {/* Fallback Click-to-Play Overlay (If browser blocks unmuted autoplay) */}
        {!hasStarted && (
          <div 
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.play();
                setHasStarted(true);
              }
            }}
            className="absolute inset-0 z-40 bg-black/80 flex flex-col items-center justify-center cursor-pointer"
          >
            <div className="p-6 rounded-2xl border-2 border-yellow-500/80 bg-[#12131c] text-center shadow-2xl space-y-3">
              <span className="text-3xl animate-bounce inline-block">⚔️</span>
              <h2 className="font-pixel text-sm text-yellow-400 uppercase tracking-widest">
                ACT I: THE FALL OF MEADOWVANIA
              </h2>
              <p className="font-mono text-xs text-zinc-300">
                Click anywhere to begin the prologue cinematic
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
