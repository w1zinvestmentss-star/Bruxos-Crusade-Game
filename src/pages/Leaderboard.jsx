
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Star, TrendingUp, Coins } from 'lucide-react';
import { useGame } from '../context/GameContext';

const PodiumSpot = ({ student, rank, scoreDisplay }) => {
  if (!student) return null;

  const rankStyles = {
    1: {
      size: 'h-28 w-28',
      avatarBorder: 'border-yellow-400',
      textColor: 'text-yellow-400',
      marginTop: 'mt-0',
      badgeColor: 'border-yellow-400',
      badgeTextColor: 'text-yellow-400',
    },
    2: {
      size: 'h-24 w-24',
      avatarBorder: 'border-zinc-400',
      textColor: 'text-zinc-400',
      marginTop: 'mt-8',
      badgeColor: 'border-zinc-400',
      badgeTextColor: 'text-zinc-400',
    },
    3: {
      size: 'h-24 w-24',
      avatarBorder: 'border-orange-400',
      textColor: 'text-orange-400',
      marginTop: 'mt-8',
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
      className={`flex flex-col items-center text-center ${styles.marginTop} w-40`}
    >
      <div className="relative mb-2">
        <div className={`${styles.size} rounded-full bg-stone-800 border-4 ${styles.avatarBorder} overflow-hidden flex items-center justify-center shadow-lg`}>
          <img
            src={student.currentBodySprite}
            alt={`${student.heroName}'s avatar`}
            className="w-full h-full object-contain object-top pt-2"
          />
        </div>
        <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-black border-2 ${styles.badgeColor} flex items-center justify-center`}>
            <span className={`font-['Press_Start_2P'] text-xs ${styles.badgeTextColor}`}>{rank}</span>
        </div>
      </div>
      <h3 className={`font-['VT323'] text-xl font-bold ${styles.textColor}`}>{student.heroName}</h3>
      {scoreDisplay}
    </motion.div>
  );
};


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

  const topThree = sortedStudents.slice(0, 3);
  const restOfStudents = sortedStudents.slice(3);

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
          <div className={`${scoreBaseStyle} ${color}`}>{score >= 0 ? `+${score}`:score}<span className="text-sm text-slate-400 ml-2">pts</span></div>
        );
      case 'wealthy':
        return (
          <div className={`${scoreBaseStyle} text-yellow-400`}>{student.gold}<span className="text-sm text-yellow-600 ml-2">G</span></div>
        );
      default: return null;
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
      
      <img src={MAP_BG} className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none" alt="background map"/>

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
          
          {topThree.length > 0 && (
            <div className="flex justify-center items-end gap-4 md:gap-8 mb-8 pt-8 px-4 border-b border-white/10 pb-8">
              {topThree[1] && <PodiumSpot rank={2} student={topThree[1]} scoreDisplay={<ScoreDisplay student={topThree[1]} />} />}
              {topThree[0] && <PodiumSpot rank={1} student={topThree[0]} scoreDisplay={<ScoreDisplay student={topThree[0]} />} />}
              {topThree[2] && <PodiumSpot rank={3} student={topThree[2]} scoreDisplay={<ScoreDisplay student={topThree[2]} />} />}
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

                <div className="w-12 h-12 rounded-full bg-stone-800 border border-stone-600 overflow-hidden flex items-center justify-center mr-4">
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
