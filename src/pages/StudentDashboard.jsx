import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut } from 'lucide-react';
import { useGame } from '../context/GameContext';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, setUserRole, clearNotifications } = useGame();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    if (currentUser?.notifications?.length > 0) {
      setShowWelcomeModal(true);
    }
  }, [currentUser]);

  // Fantasy Map Background
  const MAP_BG = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/worldmap4.png";

  const handleLogout = () => {
    setUserRole(null);
    navigate('/');
  };

  const handleClaimRewards = () => {
    clearNotifications();
    setShowWelcomeModal(false);
  };

  // Reusable Map Pin Component
  const MapLocation = ({ label, onClick, x, y, delay }) => (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="absolute z-10 bg-black/80 border-2 border-yellow-500/50 text-white font-bold font-mono uppercase tracking-widest px-4 py-2 hover:border-yellow-400 hover:bg-black/90 transition-colors"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {label}
    </motion.button>
  );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-stone-900">

      {/* Welcome Back Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="bg-stone-900 border-2 border-yellow-500 rounded-lg shadow-xl p-8 max-w-lg w-full m-4">
            <h2 className="text-2xl font-bold font-mono uppercase text-yellow-400 mb-4">
              REPORT FROM THE KINGDOM
            </h2>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-4">
              {currentUser.notifications.map((notif, index) => (
                <div key={index} className="border-b border-stone-700 pb-2">
                  <h3 className="font-bold text-lg text-white">{notif.title}</h3>
                  <p className="text-sm text-green-400">
                    + {notif.xp} XP & {notif.gold} Gold
                  </p>
                  <p className="text-sm text-stone-400 italic mt-1">"{notif.quote}"</p>
                </div>
              ))}
            </div>
            <button
              onClick={handleClaimRewards}
              className="mt-6 w-full bg-yellow-500 text-stone-900 font-bold py-2 px-4 rounded hover:bg-yellow-400 transition-colors"
            >
              CLAIM REWARDS
            </button>
          </div>
        </div>
      )}

      {/* 1. Background Map Layer */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/30 z-0" />
        <img 
          src={MAP_BG} 
          alt="Kingdom Map" 
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* 2. Top HUD (Heads Up Display) */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-20">
        <div className="flex items-center gap-4 bg-black/60 p-3 rounded-xl border-2 border-stone-600 backdrop-blur-md">
          <div className="w-12 h-12 bg-indigo-600 rounded-full border-2 border-yellow-400 flex items-center justify-center">
            <User className="text-white" />
          </div>
          <div>
            <h2 className="text-yellow-400 font-bold font-mono text-sm uppercase">
              {currentUser ? currentUser.heroName : "Unknown Hero"}
            </h2>
            <div className="text-xs text-stone-300 font-mono">
              Lvl {currentUser?.level || 1} • {currentUser?.xp || 0} XP
            </div>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="p-2 bg-red-900/80 rounded-lg border border-red-500 text-white hover:bg-red-700 transition-colors cursor-pointer"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* 3. Interactive Map Locations */}
      
      {/* QUEST BOARD */}
      <MapLocation 
        label="Quest Board" 
        x="20%" 
        y="37%" 
        delay={0.2}
        onClick={() => navigate('/quests')} 
      />

      {/* TOWN SQUARE / LEADERBOARD */}
      <MapLocation 
        label="Town Square" 
        x="43%" 
        y="24%" 
        delay={0.4}
        onClick={() => navigate('/leaderboard')} 
      />

      {/* THE ARCHIVES */}
      <MapLocation 
        label="The Archives" 
        x="75%" 
        y="15%" 
        delay={0.6}
        onClick={() => navigate('/archives')} 
      />

      {/* THE BAZAAR */}
      <MapLocation 
        label="The Bazaar" 
        x="70%" 
        y="35%" 
        delay={0.8}
        onClick={() => navigate('/barracks')} 
      />

      <div className="absolute bottom-4 right-4 text-white/50 font-mono text-xs z-10">
        Map v1.2
      </div>
    </div>
  );
};

export default StudentDashboard;
