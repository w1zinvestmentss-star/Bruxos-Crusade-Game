import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Star, TrendingUp, Coins, Crown, Medal } from 'lucide-react';
import { useGame } from '../context/GameContext';

const Leaderboard = () => {
  const navigate = useNavigate();
  const { students, calculateScholarScore, calculateComebackScore } = useGame();
  const [activeTab, setActiveTab] = useState('scholar'); // 'scholar', 'grinder', 'comeback', 'wealthy'

  // Memoize the sorted list for performance
  const sortedStudents = useMemo(() => {
    const sorted = [...students].sort((a, b) => {
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
    return sorted;
  }, [students, activeTab, calculateScholarScore, calculateComebackScore]);

  const getRankIcon = (index) => {
    if (index === 0) return <Crown className="text-yellow-400" size={24} />;
    if (index === 1) return <Medal className="text-stone-300" size={24} />; // Silver
    if (index === 2) return <Medal className="text-orange-400" size={24} />; // Bronze
    return <span className="w-8 text-center font-mono text-stone-500">#{index + 1}</span>;
  };

  const ScoreDisplay = ({ student }) => {
    switch (activeTab) {
      case 'scholar':
        return (
          <span className="text-purple-300">
            MANA: <span className="font-bold text-cyan-300">{calculateScholarScore(student).toFixed(0)}</span>
          </span>
        );
      case 'grinder':
        return (
          <span className="text-stone-300">
            {student.xp} <span className="text-sm text-stone-500">XP</span>
          </span>
        );
      case 'comeback':
        const score = calculateComebackScore(student);
        return (
          <span className={score > 0 ? 'text-green-400' : 'text-stone-400'}>
            {score > 0 ? `+${score}` : score} <span className="text-sm">pts</span>
          </span>
        );
      case 'wealthy':
        return (
          <span className="text-yellow-400">
            {student.gold} <span className="text-sm text-yellow-600">G</span>
          </span>
        );
      default:
        return null;
    }
  };

  const TABS = [
    { id: 'scholar', label: 'The Scholar', icon: BookOpen },
    { id: 'grinder', label: 'The Grinder', icon: Star },
    { id: 'comeback', label: 'The Comeback', icon: TrendingUp },
    { id: 'wealthy', label: 'The Wealthy', icon: Coins },
  ];

  return (
    <div className="min-h-screen bg-stone-900 text-stone-200 p-4 relative font-sans">
      
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/wood-pattern.png")` }}>
      </div>

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

      <div className="max-w-3xl mx-auto bg-stone-800 border-8 border-stone-700 rounded-xl shadow-2xl relative overflow-hidden">
        
        <div className="flex border-b-4 border-stone-700">
          {TABS.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-1 font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-colors ${
                activeTab === tab.id ? 'bg-stone-700 text-yellow-400' : 'bg-stone-800 text-stone-500 hover:bg-stone-700'
              }`}
            >
              <tab.icon size={18} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4 min-h-[50vh]">
          {sortedStudents.map((student, index) => (
            <motion.div 
              key={`${activeTab}-${student.id}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              className={`flex items-center justify-between p-4 mb-3 rounded-lg border-2 ${
                index === 0 ? 'bg-yellow-900/20 border-yellow-500/50' : 'bg-stone-900/50 border-stone-700'
              }`}
            >
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

              <div className="font-mono font-bold text-xl">
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
