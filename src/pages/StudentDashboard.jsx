import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scroll, Users, User, BookOpen, LogOut } from 'lucide-react';
import { useGame } from '../context/GameContext';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, setUserRole } = useGame();

  // Fantasy Map Background
  const MAP_BG = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=2070&auto=format&fit=crop";

  const handleLogout = () => {
    setUserRole(null);
    navigate('/');
  };

  // Reusable Map Pin Component
  const MapLocation = ({ label, icon: Icon, onClick, color, x, y, delay }) => (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: delay, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1, y: -10 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className={`absolute flex flex-col items-center group z-10`}
      style={{ left: x, top: y }}
    >
      {/* The Pin Icon */}
      <div className={`p-4 rounded-2xl border-4 border-white shadow-xl bg-${color}-600 relative overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-black/20" />
        <Icon size={32} className="text-white relative z-10" />
      </div>
      
      {/* The Label */}
      <div className="mt-2 px-3 py-1 bg-black/80 border-2 border-white/50 rounded text-white font-bold text-xs font-mono uppercase tracking-wider backdrop-blur-sm group-hover:bg-black group-hover:border-yellow-400 transition-colors">
        {label}
      </div>
    </motion.button>
  );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-stone-900">
      
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
      
      {/* QUEST BOARD (Blue) */}
      <MapLocation 
        label="Quest Board" 
        icon={Scroll} 
        color="blue" 
        x="20%" 
        y="30%" 
        delay={0.2}
        onClick={() => navigate('/quests')} 
      />

      {/* TOWN SQUARE / LEADERBOARD (Purple) */}
      <MapLocation 
        label="Town Square" 
        icon={Users} 
        color="purple" 
        x="50%" 
        y="45%" 
        delay={0.4}
        // FIX: This now navigates to the Leaderboard page!
        onClick={() => navigate('/leaderboard')} 
      />

      {/* ARCHIVES (Emerald) - Placeholder */}
      <MapLocation 
        label="The Archives" 
        icon={BookOpen} 
        color="emerald" 
        x="75%" 
        y="35%" 
        delay={0.6}
        onClick={() => navigate('/archives')} 
      />

      {/* BARRACKS (Red) - Placeholder */}
      <MapLocation 
        label="Barracks" 
        icon={User} 
        color="red" 
        x="30%" 
        y="65%" 
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