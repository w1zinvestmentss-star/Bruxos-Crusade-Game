import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Star, TrendingUp, Coins, Crown, Medal } from 'lucide-react';
import { useGame } from '../context/GameContext';

const Leaderboard = () => {
  const navigate = useNavigate();
  const { students, calculateScholarScore, calculateComebackScore } = useGame();
  const [activeTab, setActiveTab] = useState('scholar'); // 'scholar', 'grinder', 'comeback', 'wealthy'

  // LOGIC: Sort students based on the active tab (Highest to Lowest)
  const sortedStudents = [...students].sort((a, b) => {
    switch (activeTab) {
      case 'scholar':
        return calculateScholarScore(b) - calculateScholarScore(a);
      case 'grinder':
        return b.xp - a.xp;
      case 'comeback':
        return calculateComebackScore(b) - calculateComebackScore(a);
      case 'wealthy':
        return b.gold - a.gold;
      default:
        return 0;
    }
  });

  const getScoreForStudent = (student) => {
    switch (activeTab) {
      case 'scholar':
        return { value: calculateScholarScore(student).toFixed(1), unit: 'SS' };
      case 'grinder':
        return { value: student.xp, unit: 'XP' };
      case 'comeback':
        const score = calculateComebackScore(student);
        return { value: score > 0 ? `+${score}` : score, unit: 'Pts' };
      case 'wealthy':
        return { value: student.gold, unit: 'G' };
      default:
        return { value: 0, unit: '' };
    }
  };

  // Helper to get rank icon
  const getRankIcon = (index) => {
    if (index === 0) return <Crown className="text-yellow-400" size={24} />;
    if (index === 1) return <Medal className="text-stone-300" size={24} />; // Silver
    if (index === 2) return <Medal className="text-orange-400" size={24} />; // Bronze
    return <span className="font-mono text-stone-500">#{index + 1}</span>;
  };

  const TABS = [
    { id: 'scholar', label: 'The Scholar', icon: BookOpen },
    { id: 'grinder', label: 'The Grinder', icon: Star },
    { id: 'comeback', label: 'The Comeback', icon: TrendingUp },
    { id: 'wealthy', label: 'The Wealthy', icon: Coins },
  ];

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
          {TABS.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-1 font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-colors ${
                activeTab === tab.id ? 'bg-stone-700 text-yellow-400' : 'bg-stone-800 text-stone-500 hover:bg-stone-750'
              }`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        {/* LIST */}
        <div className="p-4">
          {sortedStudents.map((student, index) => {
            const { value, unit } = getScoreForStudent(student);
            return (
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
                <div className="font-mono font-bold text-xl text-blue-400">
                  {value} <span className="text-sm text-stone-500">{unit}</span>
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;
