import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Coins, Star, Crown, Medal } from 'lucide-react';
import { useGame } from '../context/GameContext';

const Leaderboard = () => {
  const navigate = useNavigate();
  const { students } = useGame();
  const [activeTab, setActiveTab] = useState('xp'); // 'xp' or 'gold'

  // LOGIC: Sort students based on the active tab (Highest to Lowest)
  const sortedStudents = [...students].sort((a, b) => {
    if (activeTab === 'xp') return b.xp - a.xp;
    return b.gold - a.gold;
  });

  // Helper to get rank icon
  const getRankIcon = (index) => {
    if (index === 0) return <Crown className="text-yellow-400" size={24} />;
    if (index === 1) return <Medal className="text-stone-300" size={24} />; // Silver
    if (index === 2) return <Medal className="text-orange-400" size={24} />; // Bronze
    return <span className="font-mono text-stone-500">#{index + 1}</span>;
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-200 p-4 relative">
      
      {/* Wood Texture Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/wood-pattern.png")` }}>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto relative z-10 mb-8">
        <button 
          onClick={() => navigate('/student-dashboard')}
          className="flex items-center gap-2 text-stone-400 hover:text-white mb-6"
        >
          <ArrowLeft size={20} /> Back to Map
        </button>

        <div className="text-center">
          <h1 className="text-3xl md:text-5xl text-yellow-500 mb-2 drop-shadow-md" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            TOWN SQUARE
          </h1>
          <p className="text-stone-400 italic">"Behold the legends of the realm!"</p>
        </div>
      </div>

      {/* Main Board Container */}
      <div className="max-w-3xl mx-auto bg-stone-800 border-8 border-stone-700 rounded-xl shadow-2xl relative overflow-hidden">
        
        {/* TABS */}
        <div className="flex border-b-4 border-stone-700">
          <button 
            onClick={() => setActiveTab('xp')}
            className={`flex-1 py-4 font-bold text-lg flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'xp' ? 'bg-stone-700 text-yellow-400' : 'bg-stone-800 text-stone-500 hover:bg-stone-750'
            }`}
          >
            <Star size={20} /> TOP HEROES (XP)
          </button>
          <button 
            onClick={() => setActiveTab('gold')}
            className={`flex-1 py-4 font-bold text-lg flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'gold' ? 'bg-stone-700 text-yellow-400' : 'bg-stone-800 text-stone-500 hover:bg-stone-750'
            }`}
          >
            <Coins size={20} /> WEALTHIEST (Gold)
          </button>
        </div>

        {/* LIST */}
        <div className="p-4">
          {sortedStudents.map((student, index) => (
            <motion.div 
              key={student.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between p-4 mb-3 rounded-lg border-2 ${
                index === 0 ? 'bg-yellow-900/20 border-yellow-500/50' : 'bg-stone-900/50 border-stone-700'
              }`}
            >
              {/* Left: Rank & Name */}
              <div className="flex items-center gap-4">
                <div className="w-10 flex justify-center">
                  {getRankIcon(index)}
                </div>
                <div>
                  <h3 className={`font-bold text-lg ${index === 0 ? 'text-yellow-400' : 'text-white'}`}>
                    {student.heroName}
                  </h3>
                  <p className="text-xs text-stone-500 font-mono">Level {student.level} {index === 0 && "• LEGEND"}</p>
                </div>
              </div>

              {/* Right: Score */}
              <div className="font-mono font-bold text-xl">
                {activeTab === 'xp' ? (
                  <span className="text-blue-400">{student.xp} XP</span>
                ) : (
                  <span className="text-yellow-500">{student.gold} G</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;