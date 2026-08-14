import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, LogOut, Trophy, Palette, Swords, Skull, BookText } from 'lucide-react';
import { useGame } from '../context/GameContext';

const Awakening = () => {
  const { updateHeroIdentity } = useGame();
  const [inputName, setInputName] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);

  const handleBeginJourney = () => {
    if (inputName && selectedClass) {
      updateHeroIdentity(inputName, selectedClass);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
      <img 
        src="https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/awakening.bg.png" 
        alt="Awakening Background" 
        className="absolute inset-0 w-full h-full object-cover z-0" 
      />
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10" />
      
      <div className="relative z-20 w-full max-w-5xl flex flex-col items-center">
        <h1 className="font-['Press_Start_2P'] text-yellow-400 text-3xl mb-8">THE AWAKENING</h1>
        
        <input
          type="text"
          placeholder="Enter your Hero Name..."
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          className="bg-black border border-stone-600 p-3 text-white font-['VT323'] text-2xl mb-8 w-80 text-center"
        />
        
        <div className="flex gap-6 mb-8">
          {['Warrior', 'Mage', 'Rogue'].map((cls) => (
            <button
              key={cls}
              onClick={() => setSelectedClass(cls)}
              className={`p-6 bg-black/60 backdrop-blur-md border ${selectedClass === cls ? 'border-yellow-500' : 'border-white/10 hover:border-yellow-500'} flex flex-col items-center w-48 transition-colors`}
            >
              <span className="font-['Press_Start_2P'] text-yellow-400 text-lg mb-2">{cls.toUpperCase()}</span>
              <span className="font-['VT323'] text-stone-300 text-xl">
                {cls === 'Warrior' && '+10% Rewards on Homework & Athletics'}
                {cls === 'Mage' && '+10% Rewards on Quizzes, Math & Typing'}
                {cls === 'Rogue' && '+15% Rewards on Journals, Scenarios & Arts'}
              </span>
            </button>
          ))}
        </div>
        
        <button
          onClick={handleBeginJourney}
          disabled={!inputName || !selectedClass}
          className="px-12 py-4 bg-yellow-500 text-stone-900 font-bold font-['Press_Start_2P'] text-xl hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          BEGIN JOURNEY
        </button>
      </div>
    </div>
  );
};

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { currentUser, setUserRole, clearNotifications, quests, isProfileLoaded, session } = useGame();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.notifications && currentUser.notifications.length > 0) {
        setShowWelcomeModal(true);
      }
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
      gold: 'border-yellow-400 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] bg-black hover:bg-yellow-900/30',
      emerald: 'border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)] bg-black hover:bg-emerald-950/30 hover:border-emerald-400' // Added emerald theme
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
              <div className={`absolute top-full mt-3 w-56 p-3 bg-black/95 border ${variant === 'emerald' ? 'border-emerald-500/50' : 'border-yellow-500/50'} rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 text-stone-300 text-xs font-mono text-left leading-relaxed`}>
                {description}
              </div>
            )}
        </motion.button>
    );
  };

  // If logged in but the database is still loading, stay on the loading screen
  if (session && !isProfileLoaded) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center z-[200]">
        <div className="text-yellow-500 font-['Press_Start_2P'] text-lg md:text-xl animate-pulse drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]">
          LOADING REALM...
        </div>
      </div>
    );
  }

  if (currentUser && (currentUser.heroName === 'New Hero' || currentUser.heroClass === 'None' || !currentUser.heroClass)) {
    return <Awakening />;
  }

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
      <div className="absolute top-0 left-0 w-full p-4 flex justify-end items-start z-50 pointer-events-none">
        <button 
          onClick={handleLogout}
          className="p-2 bg-red-900/80 rounded-lg border border-red-500 text-white hover:bg-red-700 transition-colors cursor-pointer pointer-events-auto"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* DESKTOP & TABLET MAP VIEW (Edge-to-Edge Fullscreen on Tablet & Desktop) */}
      <div className="hidden md:block fixed inset-0 w-full h-full overflow-hidden bg-black z-10">
        
        {/* 1. Full-Screen Background Map Layer */}
        <img 
          src={MAP_BG} 
          alt="Kingdom Map" 
          className="absolute inset-0 w-full h-full object-cover opacity-85 pointer-events-none"
        />
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        {/* 2. Interactive Map Locations (Anchored directly to full screen) */}
        
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
          description="Face terrifying bosses. Unlocked by logging in regularly and completing specific quests!"
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

        {/* TAVERN GROVE GALLERY */}
        <MapLocation 
          label="Tavern Grove" 
          description="View approved student art projects and creative masterpieces pinned to the wall!"
          icon={Palette}
          x="35%" 
          y="78%" 
          delay={1.4}
          onClick={() => navigate('/tavern-gallery')}
          variant="emerald"
        />

        {/* DESKTOP/TABLET HERO SHOWCASE CARD (Water-Anchored, Bottom-Left) */}
        <div className="absolute bottom-4 left-4 z-20 bg-black/55 backdrop-blur-md border border-stone-600/60 p-2.5 rounded-xl flex items-center gap-2.5 shadow-[0_0_25px_rgba(0,0,0,0.8)] max-w-[215px] pointer-events-auto">
          <div className="relative w-16 h-22 bg-stone-950/80 border border-slate-700/80 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden shadow-inner">
            <img 
              src={currentUser?.currentBodySprite || 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/new.base.body2.png'} 
              alt="Hero Portrait" 
              className="w-full h-auto object-cover scale-[1.9] translate-y-4 drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]"
            />
            <div className="absolute bottom-0 w-full h-2 bg-purple-500/20 blur-sm rounded-full z-0" />
          </div>
          <div className="flex flex-col justify-center flex-grow overflow-hidden">
            <span className="text-[8px] text-amber-500 font-['Press_Start_2P'] uppercase tracking-wider mb-0.5 truncate">
              [{currentUser?.heroClass || 'HERO'}]
            </span>
            <h2 className="text-xl font-bold text-white font-['VT323'] tracking-wide leading-none mb-1 truncate">
              {currentUser?.heroName || 'Unknown Hero'}
            </h2>
            <p className="text-[10px] text-stone-300 font-mono mb-1">
              LVL {Math.floor((currentUser?.xp || 0) / 1000) + 1}
            </p>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-mono text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-600/40 w-fit">
                🪙 {currentUser?.gold || 0} G
              </span>
              <span className="text-[9px] font-mono text-cyan-300 bg-cyan-950/80 px-1.5 py-0.5 rounded border border-cyan-500/40 w-fit">
                ⭐ {currentUser?.xp || 0} XP
              </span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-3 right-4 text-white/30 font-mono text-[10px] z-10">
          Map v1.3
        </div>
      </div>
      {/* MOBILE MAP VIEW (Visible on Mobile, Hidden on Desktop) */}
      <div className="flex md:hidden flex-col w-full h-screen relative z-10 overflow-hidden">
        
        {/* Fixed Background and Overlay (Uses Menu Background.jpg) */}
        <div className="fixed inset-0 z-0 h-full w-full overflow-hidden pointer-events-none">
          <img 
            src="https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Menu%20Background.jpg" 
            alt="Menu Background" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-black/75"></div>
        </div>

        {/* Scrollable Mobile RPG Hub Ledger (Starts below HUD using pt-24) */}
        <div className="relative z-10 flex flex-col w-full h-full overflow-y-auto px-4 pt-24 pb-28 custom-scrollbar space-y-4">
          
          {/* 1. HERO SHOWCASE STAGE - Translucent Glass & Zoomed Portrait */}
          <div className="flex-shrink-0 bg-black/70 backdrop-blur-md border border-slate-500/50 p-4 rounded-xl flex items-center gap-4 shadow-2xl min-h-[150px] relative overflow-hidden">
            
            {/* Spacious Character Frame */}
            <div className="relative w-28 h-36 bg-stone-950/80 border border-slate-600/80 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden shadow-inner">
              <img 
                src={currentUser?.currentBodySprite || 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/new.base.body2.png'} 
                alt="Hero Portrait" 
                className="w-full h-auto object-cover scale-[2.4] translate-y-10 drop-shadow-[0_6px_12px_rgba(0,0,0,0.9)]"
              />
              <div className="absolute bottom-0 w-full h-3 bg-purple-500/20 blur-sm rounded-full z-0" />
            </div>

            {/* Stats Panel */}
            <div className="flex flex-col justify-center flex-grow z-10">
              <span className="text-[10px] text-amber-500 font-['Press_Start_2P'] uppercase tracking-wider mb-1">
                [{currentUser?.heroClass || 'HERO'}]
              </span>
              <h2 className="text-3xl font-bold text-white font-['VT323'] tracking-wide leading-none mb-1">
                {currentUser?.heroName || 'Unknown Hero'}
              </h2>
              <p className="text-xs text-stone-300 font-mono mb-2">
                LEVEL {Math.floor((currentUser?.xp || 0) / 1000) + 1}
              </p>
              
              <div className="flex flex-wrap gap-2">
                <span className="text-[11px] font-mono text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-600/50 shadow-sm flex items-center gap-1">
                  🪙 {currentUser?.gold || 0} G
                </span>
                <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/40 flex items-center gap-1">
                  ⭐ {currentUser?.xp || 0} XP
                </span>
                {currentUser?.equippedPet && (
                  <span className="text-[11px] font-mono text-purple-300 bg-purple-950/80 px-2.5 py-0.5 rounded border border-purple-500/40 shadow-sm flex items-center gap-1">
                    🐾 {currentUser.equippedPet}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* SECTION HEADER */}
          <div className="text-center my-1 flex-shrink-0">
            <span className="font-['Press_Start_2P'] text-[10px] text-amber-500/90 tracking-[0.2em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              SELECT A DESTINATION
            </span>
          </div>

          {/* 2. LOCATION CARDS (65% Transparency + Zoomed Object-Cover Artwork) */}

          {/* 1. QUEST BOARD */}
          <div 
            onClick={() => navigate('/quests')}
            className="cursor-pointer relative overflow-hidden bg-black/65 backdrop-blur-md border border-slate-500/50 rounded-xl py-4 px-5 flex flex-col justify-center min-h-[110px] flex-shrink-0 transition-all shadow-lg hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] group"
          >
            <img src="https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Cover.Quest.Board.jpg" alt="Quest Board" className="absolute right-0 top-0 bottom-0 w-1/2 h-full object-cover object-right scale-125 opacity-75 pointer-events-none z-0 group-hover:scale-135 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent pointer-events-none z-0" />
            <div className="relative z-10 flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2">
                <BookText size={18} className="text-amber-400" />
                <h3 className="text-xs font-['Press_Start_2P'] text-amber-400 tracking-wide">[ QUEST BOARD ]</h3>
              </div>
              <span className="text-[9px] font-mono text-amber-300 bg-amber-950/90 px-2 py-0.5 rounded border border-amber-500/40">
                ⚡ 120S BLITZES
              </span>
            </div>
            <p className="relative z-10 text-[11px] text-stone-200 font-mono uppercase leading-relaxed max-w-[68%]">
              ACCEPT DAILY TASKS, QUIZZES, AND 2-MINUTE SPEED RUNS.
            </p>
          </div>

          {/* 2. TAVERN GROVE GALLERY */}
          <div 
            onClick={() => navigate('/tavern-gallery')}
            className="cursor-pointer relative overflow-hidden bg-black/65 backdrop-blur-md border border-slate-500/50 rounded-xl py-4 px-5 flex flex-col justify-center min-h-[110px] flex-shrink-0 transition-all shadow-lg hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] group"
          >
            <img src="https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Cover.Tavern.Grove.jpg" alt="Tavern Grove" className="absolute right-0 top-0 bottom-0 w-1/2 h-full object-cover object-right scale-125 opacity-75 pointer-events-none z-0 group-hover:scale-135 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent pointer-events-none z-0" />
            <div className="relative z-10 flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2">
                <Palette size={18} className="text-emerald-400" />
                <h3 className="text-xs font-['Press_Start_2P'] text-emerald-400 tracking-wide">[ TAVERN GROVE ]</h3>
              </div>
              <span className="text-[9px] font-mono text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-500/40">
                🎨 ART EXHIBIT
              </span>
            </div>
            <p className="relative z-10 text-[11px] text-stone-200 font-mono uppercase leading-relaxed max-w-[68%]">
              VIEW APPROVED STUDENT ARTWORK IN THE CAVE GALLERY.
            </p>
          </div>

          {/* 3. THE BARRACKS */}
          <div 
            onClick={() => navigate('/barracks')}
            className="cursor-pointer relative overflow-hidden bg-black/65 backdrop-blur-md border border-slate-500/50 rounded-xl py-4 px-5 flex flex-col justify-center min-h-[110px] flex-shrink-0 transition-all shadow-lg hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] group"
          >
            <img src="https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Cover.The.Barracks.jpg" alt="Barracks" className="absolute right-0 top-0 bottom-0 w-1/2 h-full object-cover object-right scale-125 opacity-75 pointer-events-none z-0 group-hover:scale-135 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent pointer-events-none z-0" />
            <div className="relative z-10 flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2">
                <User size={18} className="text-purple-300" />
                <h3 className="text-xs font-['Press_Start_2P'] text-purple-300 tracking-wide">[ THE BARRACKS ]</h3>
              </div>
              <span className="text-[9px] font-mono text-purple-200 bg-purple-950/90 px-2 py-0.5 rounded border border-purple-500/40">
                🛡️ ARMORY
              </span>
            </div>
            <p className="relative z-10 text-[11px] text-stone-200 font-mono uppercase leading-relaxed max-w-[68%]">
              SPEND GOLD ON RARE OUTFITS, PETS, AND MAGIC SPELLS.
            </p>
          </div>

          {/* 4. THE DUNGEON */}
          <div 
            onClick={() => navigate('/dungeon')}
            className="cursor-pointer relative overflow-hidden bg-black/65 backdrop-blur-md border border-slate-500/50 rounded-xl py-4 px-5 flex flex-col justify-center min-h-[110px] flex-shrink-0 transition-all shadow-lg hover:border-red-500 hover:shadow-[0_0_20px_rgba(220,38,38,0.3)] group"
          >
            <img src="https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Cover.The.Dungeon.jpg" alt="Dungeon" className="absolute right-0 top-0 bottom-0 w-1/2 h-full object-cover object-right scale-125 opacity-80 pointer-events-none z-0 group-hover:scale-135 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent pointer-events-none z-0" />
            <div className="relative z-10 flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2">
                <Swords size={18} className="text-red-500" />
                <h3 className="text-xs font-['Press_Start_2P'] text-red-500 tracking-wide">[ THE DUNGEON ]</h3>
              </div>
              <span className="text-[9px] font-mono text-red-300 bg-red-950/90 px-2 py-0.5 rounded border border-red-500/40">
                ⚔️ 44 BOSSES
              </span>
            </div>
            <p className="relative z-10 text-[11px] text-stone-200 font-mono uppercase leading-relaxed max-w-[68%]">
              SUMMON AND BATTLE LEGENDARY MONSTERS FOR SPOILS.
            </p>
          </div>

          {/* 5. HALL OF TRIUMPHS */}
          <div 
            onClick={() => navigate('/trophies')}
            className="cursor-pointer relative overflow-hidden bg-black/65 backdrop-blur-md border border-slate-500/50 rounded-xl py-4 px-5 flex flex-col justify-center min-h-[110px] flex-shrink-0 transition-all shadow-lg hover:border-purple-400 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] group"
          >
            <img src="https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Cover.Hall.of.Triumphs.jpg" alt="Hall of Triumphs" className="absolute right-0 top-0 bottom-0 w-1/2 h-full object-cover object-right scale-125 opacity-75 pointer-events-none z-0 group-hover:scale-135 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent pointer-events-none z-0" />
            <div className="relative z-10 flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-purple-400" />
                <h3 className="text-xs font-['Press_Start_2P'] text-purple-400 tracking-wide">[ HALL OF TRIUMPHS ]</h3>
              </div>
              <span className="text-[9px] font-mono text-purple-300 bg-purple-950/90 px-2 py-0.5 rounded border border-purple-500/40">
                🎁 REAL WORLD PRIZES
              </span>
            </div>
            <p className="relative z-10 text-[11px] text-stone-200 font-mono uppercase leading-snug max-w-[68%]">
              CLAIM REAL-WORLD STC GIFT CARDS AND ENTER THE RAFFLE.
            </p>
          </div>

          {/* 6. TOWN SQUARE / TOWN HALL */}
          <div 
            onClick={() => navigate('/leaderboard')}
            className="cursor-pointer relative overflow-hidden bg-black/65 backdrop-blur-md border border-slate-500/50 rounded-xl py-4 px-5 flex flex-col justify-center min-h-[110px] flex-shrink-0 transition-all shadow-lg hover:border-yellow-300 hover:shadow-[0_0_20px_rgba(250,204,21,0.3)] group"
          >
            <img src="https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Cover.Town.Square.jpg" alt="Town Square" className="absolute right-0 top-0 bottom-0 w-1/2 h-full object-cover object-right scale-125 opacity-75 pointer-events-none z-0 group-hover:scale-135 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent pointer-events-none z-0" />
            <div className="relative z-10 flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2">
                <Trophy size={18} className="text-yellow-300" />
                <h3 className="text-xs font-['Press_Start_2P'] text-yellow-300 tracking-wide">[ TOWN SQUARE ]</h3>
              </div>
              <span className="text-[9px] font-mono text-yellow-200 bg-yellow-950/90 px-2 py-0.5 rounded border border-yellow-400/40">
                🏆 LEADERBOARD
              </span>
            </div>
            <p className="relative z-10 text-[11px] text-stone-200 font-mono uppercase leading-snug max-w-[68%]">
              THE HALL OF LEGENDS. COMPARE YOUR MANA AND RANK.
            </p>
          </div>

          {/* 7. THE ARCHIVES */}
          <div 
            onClick={() => navigate('/archives')}
            className="cursor-pointer relative overflow-hidden bg-black/65 backdrop-blur-md border border-slate-500/50 rounded-xl py-4 px-5 flex flex-col justify-center min-h-[110px] flex-shrink-0 transition-all shadow-lg hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] group"
          >
            <img src="https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Cover.The.Archives.jpg" alt="The Archives" className="absolute right-0 top-0 bottom-0 w-1/2 h-full object-cover object-right scale-125 opacity-75 pointer-events-none z-0 group-hover:scale-135 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent pointer-events-none z-0" />
            <div className="relative z-10 flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2">
                <BookText size={18} className="text-cyan-300" />
                <h3 className="text-xs font-['Press_Start_2P'] text-cyan-300 tracking-wide">[ THE ARCHIVES ]</h3>
              </div>
            </div>
            <p className="relative z-10 text-[11px] text-stone-200 font-mono uppercase leading-snug max-w-[68%]">
              YOUR PERMANENT ACADEMIC RECORD, INTELLECT, AND WISDOM STATS.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
