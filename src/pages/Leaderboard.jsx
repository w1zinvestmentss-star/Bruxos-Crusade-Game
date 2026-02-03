import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Star, TrendingUp, Coins, Crown, Medal } from 'lucide-react';
import { useGame } from '../context/GameContext';

const Leaderboard = () => {
  const navigate = useNavigate();
  const { students, calculateScholarScore, calculateComebackScore } = useGame();
  const [activeTab, setActiveTab] = useState('scholar');

  const MAP_BG = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/worldmap4.png";

  const sortedStudents = useMemo(() => {
    return [...students].sort((a, b) => {
        switch (activeTab) {
            case 'scholar': return calculateScholarScore(b) - calculateScholarScore(a);
            case 'grinder': return b.xp - a.xp;
            case 'comeback': return calculateComebackScore(b) - calculateComebackScore(a);
            case 'wealthy': return b.gold - a.gold;
            default: return 0;
        }
    });
  }, [students, activeTab, calculateScholarScore, calculateComebackScore]);

  const getRankIcon = (index) => {
    if (index === 0) return <Crown className="text-yellow-400" size={32} />;
    if (index === 1) return <Medal className="text-slate-300" size={28} />;
    if (index === 2) return <Medal className="text-orange-400" size={28} />;
    return <span className="w-8 text-center font-['VT323'] text-2xl text-slate-500">#{index + 1}</span>;
  };

  const ScoreDisplay = ({ student }) => {
    const scoreBaseStyle = "font-['VT323'] text-2xl";
    const labelStyle = "text-base text-slate-400 mr-2";

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
            {student.xp}
            <span className={`${labelStyle} ml-2`}>XP</span>
          </div>
        );
      case 'comeback':
        const score = calculateComebackScore(student);
        const color = score > 0 ? 'text-green-400' : 'text-slate-400';
        return (
          <div className={`${scoreBaseStyle} ${color}`}>
            {score >= 0 ? `+${score}` : score}
            <span className={`${labelStyle} ml-2`}>pts</span>
          </div>
        );
      case 'wealthy':
        return (
          <div className={`${scoreBaseStyle} text-yellow-400`}>
            {student.gold}
            <span className="text-base text-yellow-600 ml-2">G</span>
          </div>
        );
      default:
        return null;
    }
  };

  const TABS = [
    { id: 'scholar', label: 'Scholar', icon: BookOpen },
    { id: 'grinder', label: 'Grinder', icon: Star },
    { id: 'comeback', label: 'Comeback', icon: TrendingUp },
    { id: 'wealthy', label: 'Wealthy', icon: Coins },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 to-black text-stone-200 p-4 font-sans">
      
      {/* Optional: Faint Map background */}
      <img src={MAP_BG} className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" alt="background map"/>

      <div className="max-w-4xl mx-auto relative z-10 mb-6">
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

      <div className="max-w-4xl mx-auto bg-black/70 backdrop-blur-md border-2 border-white/10 rounded-xl shadow-2xl overflow-hidden">
        
        <div className="flex font-['Press_Start_2P'] text-xs sm:text-sm">
          {TABS.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 px-1 flex items-center justify-center gap-2 transition-all duration-300 border-b-4 ${
                activeTab === tab.id 
                ? 'bg-yellow-600/80 text-white border-yellow-400' 
                : 'bg-black/40 text-stone-400 hover:bg-white/10 border-transparent'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="p-2 sm:p-4 min-h-[50vh]">
          {sortedStudents.map((student, index) => (
            <motion.div 
              key={`${activeTab}-${student.id}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08, duration: 0.3 }}
              className={`flex items-center justify-between p-3 my-2 rounded-lg border-2 bg-white/5 transition-colors ${
                index === 0 ? 'border-yellow-500/60' : 'border-white/10'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 flex justify-center items-center">
                  {getRankIcon(index)}
                </div>
                <div>
                  <h3 className={`font-['VT323'] text-2xl ${index === 0 ? 'text-yellow-400' : 'text-white'}`}>
                    {student.heroName}
                  </h3>
                  <p className="text-xs text-stone-500 font-mono -mt-1">Level {student.level} {index === 0 && "• REALM CHAMPION"}</p>
                </div>
              </div>

              <ScoreDisplay student={student} />
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Leaderboard;
