import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut, Trophy } from 'lucide-react';
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

  const MAP_BG = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/worldmap4.png";

  const handleLogout = () => {
    setUserRole(null);
    navigate('/');
  };

  const handleClaimRewards = () => {
    clearNotifications();
    setShowWelcomeModal(false);
  };

  const MapLocation = ({ label, description, icon: Icon, onClick, x, y, delay, variant = 'default' }) => {
    const baseClasses = "group absolute z-10 bg-black/80 border-2 text-white flex items-center gap-2 font-bold font-mono uppercase tracking-widest px-4 py-2 hover:bg-black/90 transition-colors";
    
    const variants = {
      default: 'border-yellow-500/50 hover:border-yellow-400',
      danger: 'border-red-900/80 hover:border-red-600',
      gold: 'border-yellow-400 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] bg-black hover:bg-yellow-900/30'
    };

    return (
        <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay, type: "spring", stiffness: 260, damping: 20 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className={`${baseClasses} ${variants[variant]}`}
            style={{
                left: x,
                top: y,
                transform: 'translate(-50%, -50%)',
            }}
        >
            {Icon && <Icon size={18} />}
            <span>{label}</span>
            {description && (
              <div className="absolute top-full mt-3 w-56 p-3 bg-black/95 border border-yellow-500/50 rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 text-stone-300 text-xs font-mono text-left leading-relaxed">
                {description}
              </div>
            )}
        </motion.button>
    );
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black flex items-center justify-center">

       {/* Welcome Back Modal */}
       {showWelcomeModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
           <div className="bg-stone-900 border-2 border-yellow-500 rounded-xl p-6 max-w-lg w-full text-center relative shadow-2xl">
             <h2 className="font-['Press_Start_2P'] text-yellow-400 text-lg mb-6">
               WHILE YOU WERE AWAY...
             </h2>
             <div className="space-y-4 max-h-60 overflow-y-auto pr-4 text-left">
               {currentUser.notifications.map((notif, index) => (
                 <div key={index} className="border-b border-stone-700 pb-4 last:pb-0">
                   <h3 className="font-['VT323'] text-stone-200 text-xl">{notif.title}</h3>
                   {notif.xp !== undefined || notif.gold !== undefined ? (
                     <p className="font-['VT323'] text-stone-200 text-xl">
                       {notif.xp !== undefined ? `+${notif.xp} XP` : ''}
                       {notif.xp !== undefined && notif.gold !== undefined ? ' / ' : ''}
                       {notif.gold !== undefined ? `+${notif.gold} Gold` : ''}
                     </p>
                   ) : null}
                   {notif.quote ? (
                     <p className="font-['VT323'] text-stone-200 text-xl italic mt-2">
                       "{notif.quote}"
                     </p>
                   ) : null}
                 </div>
               ))}
             </div>
             <button
               onClick={handleClaimRewards}
               className="mt-6 w-full bg-yellow-500 text-stone-900 font-bold py-3 px-6 rounded hover:bg-yellow-400 transition-colors font-['Press_Start_2P'] text-lg"
             >
               CLAIM REWARDS
             </button>
           </div>
         </div>
       )}

      {/* Ambient Beautiful Glow Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-stone-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-stone-900/80 to-black z-0" />
        <img 
          src={MAP_BG} 
          alt="ambient background" 
          className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-60 scale-125 mix-blend-screen" 
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* 2. Top HUD (Heads Up Display) */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start z-50">
        <div className="flex items-center gap-4 bg-black/60 p-3 rounded-xl border-2 border-stone-600 backdrop-blur-md">
          <div className="w-12 h-12 bg-indigo-600 rounded-full border-2 border-yellow-400 flex items-center justify-center">
            <User className="text-white" />
          </div>
          <div>
            <h2 className="text-yellow-400 font-bold font-mono text-sm uppercase">
              {currentUser ? currentUser.heroName : "Unknown Hero"}
            </h2>
           <div className="text-xs text-stone-300 font-mono">
             Lvl {Math.floor((currentUser?.xp || 0) / 1000) + 1} • {currentUser?.xp || 0} XP
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

      {/* Map Canvas Wrapper */}
      <div className="relative z-10 h-[96vh] w-auto max-w-[98vw] aspect-video mx-auto overflow-hidden rounded-2xl border-4 border-stone-700/80 shadow-[0_0_80px_rgba(0,0,0,1)]">
        {/* 1. Background Map Layer */}
        <div className="absolute inset-0 bg-black/20 z-0" />
        <img 
          src={MAP_BG} 
          alt="Kingdom Map" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />

        {/* 3. Interactive Map Locations */}
        
        {/* QUEST BOARD */}
        <MapLocation 
          label="Quest Board" 
          description="Accept daily tasks, quizzes, and missions to earn Gold and XP."
          x="18%" 
          y="45%" 
          delay={0.2}
          onClick={() => navigate('/quests')} 
        />

        {/* TOWN SQUARE / LEADERBOARD */}
        <MapLocation 
          label="Town Square" 
          description="The Hall of Legends. See how your rank and Boss Kills stack up against the realm."
          x="43%" 
          y="24%" 
          delay={0.4}
          onClick={() => navigate('/leaderboard')} 
        />

        {/* THE ARCHIVES */}
        <MapLocation 
          label="The Archives" 
          description="Your permanent record. Track your Intellect, Wisdom, and overall power level."
          x="17%" 
          y="15%" 
          delay={0.6}
          onClick={() => navigate('/archives')} 
        />

        {/* THE BARRACKS */}
        <MapLocation 
          label="The Barracks" 
          description="Spend your hard-earned gold on legendary outfits and gear."
          x="68%" 
          y="41%" 
          delay={0.8}
          onClick={() => navigate('/barracks')} 
        />

         {/* THE DUNGEON */}
        <MapLocation 
          label="The Dungeon"
          description="Face terrifying bosses. Unlocked by maintaining streaks and completing specific quests!"
          x="50%" 
          y="65%" 
          delay={1.0}
          onClick={() => navigate('/dungeon')}
          variant="danger"
        />

        {/* HALL OF TRIUMPHS */}
        <MapLocation 
          label="Hall of Triumphs"
          description="View your unlocked Achievements and claim real-world rewards!"
          icon={Trophy}
          x="70%" 
          y="13%" 
          delay={1.2}
          onClick={() => navigate('/trophies')}
          variant="gold"
        />

        <div className="absolute bottom-4 right-4 text-white/50 font-mono text-xs z-10">
          Map v1.3
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
