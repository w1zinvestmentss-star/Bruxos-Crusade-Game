import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { Music, Music2 } from 'lucide-react';

const ROUTE_TRACKS = {
  '/': 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Title%20Theme%20song%20(The%20w1z).mp3',
  '/login': 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The-hero-teacher-select-screen.mp3',
  '/student-dashboard': 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Thehub-map-theme.mp3',
  '/teacher-dashboard': 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Thehub-map-theme.mp3',
  '/barracks': 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The-barracks-theme.mp3',
  '/leaderboard': 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The-townsquare-theme.mp3',
  '/archives': 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The-Archive-theme.mp3',
  '/quests': 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The-questboard-theme.mp3',
  '/dungeon': 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Alcards%20Theme.mp3',
  '/trophies': 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Jameels.interlude.mp3',
};

const DEFAULT_TRACK = '';

const BackgroundMusic = () => {
  const location = useLocation();
  const { quests } = useGame();
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState('');

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
    }

    let targetTrack = null;

    if (location.pathname.startsWith('/briefing/')) {
      const questId = parseInt(location.pathname.split('/').pop());
      const quest = quests.find(q => q.id === questId);

      if (quest) {
        if (questId === 103) {
          targetTrack = 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Father%20gascoigne%20freestyle.mp3';
        } else if (questId === 104) {
          targetTrack = 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.LegendofFahad.mp3';
        } else if (questId === 112) {
          targetTrack = 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Requiem.for.a.Dream(Theyaretryingtoendme).mp3';
        } else {
          switch (quest.type) {
            case 'incantation':
              targetTrack = 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Ice.in.my.veins.mp3';
              break;
            case 'scout-sports':
              targetTrack = 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Kunckle.up.mp3';
              break;
            case 'upload':
              targetTrack = 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The-Archive-theme.mp3';
              break;
            case 'gauntlet':
              targetTrack = 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Unbreakable%20Determination.mp3';
              break;
            default:
              targetTrack = 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Thehub-map-theme.mp3';
          }
        }
      }
    } else {
      if (location.pathname === '/archives') {
        targetTrack = 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The-Archive-theme.mp3';
      } else {
        targetTrack = ROUTE_TRACKS[location.pathname] || DEFAULT_TRACK;
      }
    }

    if (targetTrack && targetTrack !== currentTrack) {
      setCurrentTrack(targetTrack);
      audioRef.current.src = targetTrack;
      audioRef.current.play().catch(error => console.error("Audio playback failed:", error));
    } else if (!targetTrack && audioRef.current.src) {
       audioRef.current.pause();
       setCurrentTrack('');
    }

  }, [location, quests, currentTrack]);

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
