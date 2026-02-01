import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Music, Music2 } from 'lucide-react';

const playlist = {
  '/': 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Title%20Theme%20song%20(The%20w1z).mp3',
  '/login': 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The-hero-teacher-select-screen.mp3',
  '/student-dashboard': 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Thehub-map-theme.mp3',
  '/teacher-dashboard': 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Thehub-map-theme.mp3',
  '/barracks': 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The-barracks-theme.mp3',
  '/leaderboard': 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The-townsquare-theme.mp3',
  '/archives': 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The-Archive-theme.mp3',
  '/quests': 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The-questboard-theme.mp3',
};

const BackgroundMusic = () => {
  const location = useLocation();
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState('');

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }

    const path = location.pathname;
    const newTrack = playlist[path];

    // Only change source if the track is different
    if (newTrack && newTrack !== currentTrack) {
      setCurrentTrack(newTrack);
      audioRef.current.src = newTrack;
      audioRef.current.play().catch(error => console.error("Audio playback failed:", error));
    } else if (!newTrack && audioRef.current.src) {
       audioRef.current.pause();
       setCurrentTrack(''); // Reset current track
    }

  }, [location, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={toggleMute}
        className="bg-black/50 text-white p-3 rounded-full border border-stone-500"
      >
        {isMuted ? <Music2 size={24} /> : <Music size={24} />}
      </button>
    </div>
  );
};

export default BackgroundMusic;
