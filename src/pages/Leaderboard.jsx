
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Star, TrendingUp, Swords, Info } from 'lucide-react';
import { useGame } from '../context/GameContext';

const PodiumSpot = ({ student, rank, scoreDisplay }) => {
  if (!student) return null;
  const index = rank - 1;

  const rankStyles = {
    1: {
      textColor: 'text-yellow-400',
      marginTop: 'mt-0',
      badgeColor: 'border-yellow-400',
      badgeTextColor: 'text-yellow-400',
    },
    2: {
      textColor: 'text-zinc-400',
      marginTop: 'mt-8 sm:mt-16',
      badgeColor: 'border-zinc-400',
      badgeTextColor: 'text-zinc-400',
    },
    3: {
      textColor: 'text-orange-400',
      marginTop: 'mt-8 sm:mt-16',
      badgeColor: 'border-orange-400',
      badgeTextColor: 'text-orange-400',
    },
  };

  const styles = rankStyles[rank];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: rank * 0.1 }}
      className={`flex flex-col items-center text-center ${styles.marginTop}`}
    >
      <div className="relative mb-6">
        {/* Character Portrait Viewport Frame */}
        <div className="relative w-24 h-32 md:w-28 md:h-36 bg-stone-950/90 border border-slate-600/80 rounded-xl overflow-hidden shadow-2xl flex items-center justify-center mb-3">
          
          {/* Rank-Based Spotlight Beam (Gold for 1st, Silver for 2nd, Bronze for 3rd) */}
          <div className={`absolute inset-0 bg-gradient-to-b ${
            index === 0 ? 'from-yellow-500/25 via-yellow-500/5' :
            index === 1 ? 'from-slate-300/25 via-slate-300/5' :
            'from-amber-700/25 via-amber-700/5'
          } to-transparent pointer-events-none z-0`} />

          {/* Zoomed Character Sprite (Headshot/Bust View) */}
          <img 
            src={student.currentBodySprite || 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/new.base.body2.png'} 
            alt={student.heroName} 
            className="w-full h-auto object-cover scale-[1.85] translate-y-6 drop-shadow-[0_6px_12px_rgba(0,0,0,0.9)] z-10"
          />

          {/* Pedestal Ground Glow */}
          <div className={`absolute bottom-0 w-full h-3 ${
            index === 0 ? 'bg-yellow-500/40' :
            index === 1 ? 'bg-slate-300/40' :
            'bg-amber-700/40'
          } blur-sm rounded-full z-0`} />
        </div>
        <div className={`absolute -bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-black border-2 ${styles.badgeColor} flex items-center justify-center z-10`}>
          <span className={`font-['Press_Start_2P'] text-xs ${styles.badgeTextColor}`}>{rank}</span>
        </div>
      </div>
      <h3 className={`font-['VT323'] text-2xl font-bold ${styles.textColor}`}>{student.heroName}</h3>
      {scoreDisplay}
    </motion.div>
  );
};


const Leaderboard = () => {
  const navigate = useNavigate();
  const { students, calculateScholarScore, calculateComebackScore, getSlayerPoints, calculateSlayerScore } = useGame();
  const [activeTab, setActiveTab] = useState('scholar');

  const MAP_BG = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/worldmap4.png";

  const TAB_INFO = {
    scholar: { title: "Path of the Scholar", desc: "Measures true mastery. Heavily weighs your Academic Attributes (Intellect & Wisdom) with your overall in-game performance. Grow your power to secure your spot!" },
    slayer: { title: "Path of the Slayer", desc: "Honors the greatest monster hunters. Earn points by defeating Bosses in the Dungeon. Higher tier bosses grant more points. XP breaks ties!" },
    grinder: { title: "Path of the Grinder", desc: "Rewards pure, unrelenting effort. Ranks heroes strictly by Total XP. Complete daily quests, reports, and bounties to climb to the top!" },
    comeback: { title: "Path of the Comeback", desc: "Celebrates resilience and growth. Ranks heroes by the greatest improvement from Strategy to Execution Points. Never give up!" }
  };

  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
      switch (activeTab) {
        case 'scholar': return calculateScholarScore(b) - calculateScholarScore(a);
        case 'grinder': return b.xp - a.xp;
        case 'comeback': return calculateComebackScore(b) - calculateComebackScore(a);
        case 'slayer': return calculateSlayerScore(b) - calculateSlayerScore(a);
        default: return 0;
      }
    });
  }, [students, activeTab, calculateScholarScore, calculateComebackScore, calculateSlayerScore]);

  const topThree = sortedStudents.slice(0, 3);
  const restOfStudents = sortedStudents.slice(3);

  const getScore = (student) => {
    if (!student) return '';
    switch (activeTab) {
      case 'scholar': return calculateScholarScore(student).toFixed(0);
      case 'grinder': return `${student.xp} XP`;
      case 'comeback':
        const score = calculateComebackScore(student);
        return score >= 0 ? `+${score} PTS` : `${score} PTS`;
      case 'slayer': return `${getSlayerPoints(student)} PTS`;
      default: return calculateScholarScore(student).toFixed(0);
    }
  };

  const ScoreDisplay = ({ student }) => {
    const scoreBaseStyle = "font-['VT323'] text-lg"; // Adjusted size for podium
    const labelStyle = "text-sm text-slate-400 mr-1";

    switch (activeTab) {
      case 'scholar':
        return (
          <div className={`${scoreBaseStyle} text-cyan-400`}>
            <span className={labelStyle}>MANA:</span>
            {calculateScholarScore(student).toFixed(0)}
          </div>
        );
      case 'grinder':
        return (
          <div className={`${scoreBaseStyle} text-cyan-400`}>
            {student.xp}<span className="text-sm text-slate-400 ml-2">XP</span>
          </div>
        );
      case 'comeback':
        const score = calculateComebackScore(student);
        const color = score > 0 ? 'text-green-400' : 'text-slate-400';
        return (
          <div className={`${scoreBaseStyle} ${color}`}>{score >= 0 ? `+${score}` : score}<span className="text-sm text-slate-400 ml-2">pts</span></div>
        );
      case 'slayer':
        return (
          <div>
            <div className="font-['VT323'] text-lg font-bold text-red-500">{getSlayerPoints(student)} Slayer Pts</div>
            <div className="text-xs text-stone-500">{student.xp} XP</div>
          </div>
        );
      default: return null;
    }
  };

  const TABS = [
    { id: 'scholar', label: 'Scholar', icon: BookOpen },
    { id: 'grinder', label: 'Grinder', icon: Star },
    { id: 'comeback', label: 'Comeback', icon: TrendingUp },
    { id: 'slayer', label: 'The Slayer', icon: Swords },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 to-black text-stone-200 p-4 font-sans">

      <img src={MAP_BG} className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" alt="background map" />

      <div className="max-w-5xl mx-auto relative z-10 mb-6">
        <button
          onClick={() => navigate('/student-dashboard')}
          className="flex items-center gap-2 text-stone-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Map
        </button>

        <div className="text-center">
          <h1 className="text-4xl md:text-5xl text-yellow-500 mb-2 drop-shadow-lg" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            HALL OF LEGENDS
          </h1>
          <p className="text-stone-400 italic">"Behold the heroes of the realm!"</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-black/70 backdrop-blur-md border-2 border-white/10 rounded-xl shadow-2xl overflow-hidden">

        {/* Tab Navigation - Single Line Unwrapped Mobile Bar */}
        <div className="flex overflow-x-auto border-b border-amber-500/30 mb-6 md:mb-8 pb-1 md:pb-0 custom-scrollbar scrollbar-none whitespace-nowrap">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[80px] sm:min-w-0 py-3 px-1.5 sm:px-4 flex items-center justify-center gap-1 sm:gap-1.5 font-['Press_Start_2P'] text-[8px] xs:text-[9px] sm:text-xs md:text-sm whitespace-nowrap transition-all flex-shrink-0 ${
                  isActive 
                    ? 'bg-amber-500 text-stone-900 font-bold border-t-2 border-x-2 border-amber-400' 
                    : 'text-stone-400 hover:text-white hover:bg-stone-800/50'
                }`}
              >
                <Icon size={14} className="flex-shrink-0 hidden xs:inline sm:inline" />
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4 mb-6 mx-4 mt-4 flex items-start gap-4">
          <Info className="text-blue-400 mt-1 shrink-0" />
          <div>
            <h2 className="font-['Press_Start_2P'] text-blue-300 text-sm mb-2 leading-relaxed">{TAB_INFO[activeTab].title}</h2>
            <p className="font-['VT323'] text-stone-300 text-xl">{TAB_INFO[activeTab].desc}</p>
          </div>
        </div>

        <div className="p-2 sm:p-4 min-h-[50vh]">

          {topThree.length > 0 && (
            <div className="my-4 md:my-14 border-b border-white/10 pb-8">

              {/* ========================================================= */}
              {/* 📱 MOBILE VIEW: LARGE-IMAGE CELEBRATION STAGE (flex md:hidden) */}
              {/* ========================================================= */}
              <div className="flex md:hidden flex-col gap-4 px-1">
                
                {/* --- #1 GRAND CHAMPION (Apex Full-Width Showcase) --- */}
                {topThree[0] && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative overflow-hidden p-5 rounded-2xl border-2 border-yellow-500/80 bg-gradient-to-b from-yellow-950/40 via-[#181a24] to-[#0a0b10] shadow-[0_0_30px_rgba(234,179,8,0.3)] text-center flex flex-col items-center"
                  >
                    {/* Champion Header Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400 text-stone-950 font-pixel text-[9px] font-bold uppercase tracking-wider mb-4 shadow-md">
                      <span>👑</span> REALM CHAMPION • RANK 1
                    </div>

                    {/* LARGE CHARACTER PORTRAIT STAGE */}
                    <div className="relative mb-3">
                      <div className="relative w-36 h-48 sm:w-40 sm:h-52 bg-stone-950 border-2 border-yellow-400 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(234,179,8,0.4)] flex items-center justify-center">
                        {/* Golden Spotlight Ray */}
                        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/35 via-yellow-500/10 to-transparent pointer-events-none z-0" />
                        
                        {/* Zoomed Character Sprite */}
                        <img 
                          src={topThree[0].currentBodySprite || 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/new.base.body2.png'} 
                          alt={topThree[0].heroName} 
                          className="w-full h-auto object-cover scale-[1.9] translate-y-8 drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] z-10"
                        />

                        {/* Pedestal Ground Aura */}
                        <div className="absolute bottom-0 w-full h-4 bg-yellow-500/50 blur-md rounded-full z-0" />
                      </div>

                      {/* Floating Rank 1 Crest */}
                      <div className="w-10 h-10 bg-yellow-400 text-stone-950 rounded-full font-pixel text-sm font-bold flex items-center justify-center absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 shadow-xl border-2 border-yellow-200">
                        1
                      </div>
                    </div>

                    {/* Hero Name & Stats */}
                    <div className="mt-3">
                      <h3 className="font-pixel text-base sm:text-lg text-yellow-300 font-bold tracking-wide">
                        {topThree[0].heroName}
                      </h3>
                      <div className="font-mono text-xs text-stone-400 mt-0.5">
                        Level {topThree[0].level || Math.floor((topThree[0].xp || 0) / 1000) + 1}
                      </div>
                      <div className="font-pixel text-base text-cyan-300 font-bold mt-1">
                        {activeTab === 'scholar' ? 'MANA ' : ''}{getScore(topThree[0])}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* --- #2 & #3 VANGUARDS (Dual Large-Portrait Grid) --- */}
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* --- #2 SILVER VANGUARD --- */}
                  {topThree[1] && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="relative overflow-hidden p-3 rounded-xl border-2 border-slate-400/70 bg-gradient-to-b from-slate-900/40 via-[#14151f] to-[#0a0b10] shadow-lg text-center flex flex-col items-center justify-between"
                    >
                      <div className="w-full">
                        <span className="px-2 py-0.5 rounded bg-slate-300 text-stone-950 font-pixel text-[8px] font-bold uppercase tracking-wider inline-block mb-3">
                          #2 VANGUARD
                        </span>

                        {/* Centered Vertical Portrait Frame (Prevents Head Cutoff) */}
                        <div className="relative mb-3 mx-auto">
                          <div className="relative w-28 h-38 sm:w-32 sm:h-44 mx-auto bg-stone-950 border border-slate-400 rounded-xl overflow-hidden shadow flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-b from-slate-300/25 via-slate-300/5 to-transparent pointer-events-none z-0" />
                            <img 
                              src={topThree[1].currentBodySprite || 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/new.base.body2.png'} 
                              alt={topThree[1].heroName} 
                              className="w-full h-auto object-cover scale-[1.8] translate-y-7 drop-shadow z-10"
                            />
                            <div className="absolute bottom-0 w-full h-3 bg-slate-300/30 blur-sm rounded-full z-0" />
                          </div>

                          <div className="w-7 h-7 bg-slate-300 text-stone-950 rounded-full font-pixel text-xs font-bold flex items-center justify-center absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 shadow-md border border-slate-100">
                            2
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 w-full">
                        <h3 className="font-pixel text-xs text-slate-200 font-bold truncate max-w-[120px] mx-auto">
                          {topThree[1].heroName}
                        </h3>
                        <div className="font-mono text-[10px] text-stone-400 mt-0.5">
                          Level {topThree[1].level || Math.floor((topThree[1].xp || 0) / 1000) + 1}
                        </div>
                        <div className="font-pixel text-xs text-cyan-300 font-bold mt-1">
                          {activeTab === 'scholar' ? 'MANA ' : ''}{getScore(topThree[1])}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* --- #3 BRONZE CONTENDER --- */}
                  {topThree[2] && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="relative overflow-hidden p-3 rounded-xl border-2 border-amber-700/70 bg-gradient-to-b from-amber-950/30 via-[#14151f] to-[#0a0b10] shadow-lg text-center flex flex-col items-center justify-between"
                    >
                      <div className="w-full">
                        <span className="px-2 py-0.5 rounded bg-amber-700 text-stone-100 font-pixel text-[8px] font-bold uppercase tracking-wider inline-block mb-3">
                          #3 CONTENDER
                        </span>

                        {/* Centered Vertical Portrait Frame (Prevents Head Cutoff) */}
                        <div className="relative mb-3 mx-auto">
                          <div className="relative w-28 h-38 sm:w-32 sm:h-44 mx-auto bg-stone-950 border border-amber-600 rounded-xl overflow-hidden shadow flex items-center justify-center">
                            <div className="absolute inset-0 bg-gradient-to-b from-amber-700/25 via-amber-700/5 to-transparent pointer-events-none z-0" />
                            <img 
                              src={topThree[2].currentBodySprite || 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/new.base.body2.png'} 
                              alt={topThree[2].heroName} 
                              className="w-full h-auto object-cover scale-[1.8] translate-y-7 drop-shadow z-10"
                            />
                            <div className="absolute bottom-0 w-full h-3 bg-amber-700/30 blur-sm rounded-full z-0" />
                          </div>

                          <div className="w-7 h-7 bg-amber-700 text-stone-100 rounded-full font-pixel text-xs font-bold flex items-center justify-center absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 shadow-md border border-amber-500">
                            3
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 w-full">
                        <h3 className="font-pixel text-xs text-amber-300 font-bold truncate max-w-[120px] mx-auto">
                          {topThree[2].heroName}
                        </h3>
                        <div className="font-mono text-[10px] text-stone-400 mt-0.5">
                          Level {topThree[2].level || Math.floor((topThree[2].xp || 0) / 1000) + 1}
                        </div>
                        <div className="font-pixel text-xs text-cyan-300 font-bold mt-1">
                          {activeTab === 'scholar' ? 'MANA ' : ''}{getScore(topThree[2])}
                        </div>
                      </div>
                    </motion.div>
                  )}

                </div>
              </div>


              {/* ========================================================= */}
              {/* 🖥️ DESKTOP & TABLET VIEW: HORIZONTAL 3-STEP PODIUM (hidden md:flex) */}
              {/* ========================================================= */}
              <div className="hidden md:flex justify-center items-end gap-6 md:gap-10 py-4 min-h-[280px] md:min-h-[360px]">
                
                {/* 2ND PLACE (LEFT) */}
                {topThree[1] && (
                  <div className="flex flex-col items-center group flex-shrink-0">
                    <div className="relative w-32 h-44 md:w-40 md:h-52 bg-stone-950/90 border-2 border-slate-400/80 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(148,163,184,0.25)] flex items-center justify-center mb-3">
                      <div className="absolute inset-0 bg-gradient-to-b from-slate-300/25 via-slate-300/5 to-transparent pointer-events-none z-0" />
                      <img 
                        src={topThree[1].currentBodySprite || 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/new.base.body2.png'} 
                        alt={topThree[1].heroName} 
                        className="w-full h-auto object-cover scale-[1.85] translate-y-8 drop-shadow-[0_6px_12px_rgba(0,0,0,0.9)] z-10"
                      />
                      <div className="absolute bottom-0 w-full h-3 bg-slate-300/30 blur-sm rounded-full z-0" />
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-300 text-stone-950 rounded-full font-bold font-pixel text-xs md:text-sm flex items-center justify-center -mt-7 z-20 shadow-lg border-2 border-slate-100">
                      2
                    </div>
                    <h3 className="font-pixel text-sm md:text-base text-white font-bold mt-2 text-center truncate max-w-[140px]">
                      {topThree[1].heroName}
                    </h3>
                    <p className="font-pixel text-xs md:text-sm text-cyan-300 font-bold mt-0.5">
                      {activeTab === 'scholar' ? 'MANA: ' : ''}{getScore(topThree[1])}
                    </p>
                  </div>
                )}

                {/* 1ST PLACE (CENTER - TALLEST CHAMPION) */}
                {topThree[0] && (
                  <div className="flex flex-col items-center group -mt-6 flex-shrink-0">
                    <div className="relative w-40 h-52 md:w-48 md:h-64 bg-stone-950/90 border-2 border-yellow-500/80 rounded-2xl overflow-hidden shadow-[0_0_35px_rgba(234,179,8,0.35)] flex items-center justify-center mb-3">
                      <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/30 via-yellow-500/10 to-transparent pointer-events-none z-0" />
                      <img 
                        src={topThree[0].currentBodySprite || 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/new.base.body2.png'} 
                        alt={topThree[0].heroName} 
                        className="w-full h-auto object-cover scale-[1.85] translate-y-10 drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] z-10"
                      />
                      <div className="absolute bottom-0 w-full h-5 bg-yellow-500/40 blur-md rounded-full z-0" />
                    </div>
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-yellow-400 text-stone-950 rounded-full font-bold font-pixel text-sm md:text-base flex items-center justify-center -mt-8 z-20 shadow-xl border-2 border-yellow-200">
                      1
                    </div>
                    <h3 className="font-pixel text-base md:text-xl text-yellow-400 font-bold mt-2 text-center truncate max-w-[180px] drop-shadow">
                      {topThree[0].heroName}
                    </h3>
                    <p className="font-pixel text-sm md:text-base text-cyan-300 font-bold mt-0.5">
                      {activeTab === 'scholar' ? 'MANA: ' : ''}{getScore(topThree[0])}
                    </p>
                  </div>
                )}

                {/* 3RD PLACE (RIGHT) */}
                {topThree[2] && (
                  <div className="flex flex-col items-center group flex-shrink-0">
                    <div className="relative w-28 h-40 md:w-36 md:h-48 bg-stone-950/90 border-2 border-amber-700/80 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(180,83,9,0.25)] flex items-center justify-center mb-3">
                      <div className="absolute inset-0 bg-gradient-to-b from-amber-700/25 via-amber-700/5 to-transparent pointer-events-none z-0" />
                      <img 
                        src={topThree[2].currentBodySprite || 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/new.base.body2.png'} 
                        alt={topThree[2].heroName} 
                        className="w-full h-auto object-cover scale-[1.85] translate-y-7 drop-shadow-[0_6px_12px_rgba(0,0,0,0.9)] z-10"
                      />
                      <div className="absolute bottom-0 w-full h-3 bg-amber-700/30 blur-sm rounded-full z-0" />
                    </div>
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-700 text-stone-100 rounded-full font-bold font-pixel text-xs md:text-sm flex items-center justify-center -mt-7 z-20 shadow-lg border-2 border-amber-500">
                      3
                    </div>
                    <h3 className="font-pixel text-sm md:text-base text-amber-500 font-bold mt-2 text-center truncate max-w-[130px]">
                      {topThree[2].heroName}
                    </h3>
                    <p className="font-pixel text-xs md:text-sm text-cyan-300 font-bold mt-0.5">
                      {activeTab === 'scholar' ? 'MANA: ' : ''}{getScore(topThree[2])}
                    </p>
                  </div>
                )}

              </div>
            </div>
          )}

          {restOfStudents.map((student, index) => (
            <motion.div
              key={`${activeTab}-${student.id}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              className="flex items-center justify-between p-3 my-1 mx-auto max-w-3xl rounded-lg border-2 bg-white/5 transition-colors border-transparent hover:border-white/20"
            >
              <div className="flex items-center">
                <div className="w-12 flex justify-center items-center mr-4">
                  <span className="font-['VT323'] text-2xl text-slate-500">#{index + 4}</span>
                </div>

                <div className="w-12 h-12 rounded-full bg-black border border-stone-600 overflow-hidden flex items-center justify-center mr-4">
                  <img
                    src={student.currentBodySprite}
                    alt={`${student.heroName}'s avatar`}
                    className="w-full h-full object-contain object-top pt-1"
                  />
                </div>

                <div>
                  <h3 className="font-['VT323'] text-2xl text-white">{student.heroName}</h3>
                  <p className="text-xs text-stone-500 font-mono -mt-1">Level {student.level}</p>
                </div>
              </div>

              {/* Need to use the larger text size for the list */}
              <div className="font-['VT323'] text-2xl">
                <ScoreDisplay student={student} />
              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;
