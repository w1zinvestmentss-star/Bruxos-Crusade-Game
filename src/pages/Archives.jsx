import React from 'react';
import { useGame } from '../context/GameContext';
import { Brain, Sparkle, BookOpen, Star, Award, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Archives = () => {
  const { currentUser, submissions, quests, calculateScholarScore } = useGame();
  const navigate = useNavigate();

  const MAP_BG = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/worldmap4.png";

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-200 font-['VT323'] relative">
        <img src={MAP_BG} alt="Background Map" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="relative z-10 text-center bg-black/70 p-8 rounded-xl border border-white/10">
            <p className="text-2xl">No hero records found. Please log in.</p>
            <button onClick={() => navigate('/login')} className="mt-4 px-4 py-2 bg-yellow-600 text-black rounded hover:bg-yellow-500 font-['Press_Start_2P'] text-sm">Login</button>
        </div>
      </div>
    );
  }

  const { heroName, midtermGPA, finalGPA, xp } = currentUser;
  const scholarScore = calculateScholarScore(currentUser);

  const currentLevel = Math.floor(xp / 1000) + 1;
  const xpInCurrentLevel = xp % 1000;
  const xpNeededForNext = 1000 - xpInCurrentLevel;
  const relativeXpProgress = (xpInCurrentLevel / 1000) * 100;

  const approvedSubmissions = submissions.filter(s => s.studentId === currentUser.id && s.status === 'approved');

  return (
    <div className="min-h-screen text-stone-200 p-4 sm:p-6 md:p-8 relative">
      <img src={MAP_BG} alt="Background Map" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/80"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-stone-300 hover:text-white transition-colors font-['Press_Start_2P'] text-xs">
          <ArrowLeft size={16}/> Back
        </button>

        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl text-yellow-400 font-['Press_Start_2P']">Codex of: {heroName}</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Glass Card 1: Attributes */}
          <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-6">
            <h2 className="font-['Press_Start_2P'] text-yellow-400 text-lg mb-6 flex items-center"><Award className="mr-3 text-yellow-500"/>Attributes</h2>
            <div className="space-y-4">
              {/* INT Stat Card */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-blue-900/20 border-l-4 border-l-blue-500">
                <div className="flex items-center">
                  <Brain className="w-8 h-8 mr-4 text-blue-300"/>
                  <div>
                    <h3 className="text-lg font-bold font-['VT323']">INTELLECT</h3>
                    <p className="text-sm text-stone-400 font-['VT323']">Midterm Score</p>
                  </div>
                </div>
                <span className="font-['VT323'] text-5xl font-bold text-blue-300">{midtermGPA !== null ? midtermGPA : '-'}</span>
              </div>
              {/* WIS Stat Card */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-purple-900/20 border-l-4 border-l-purple-500">
                <div className="flex items-center">
                  <Sparkle className="w-8 h-8 mr-4 text-purple-300"/>
                  <div>
                    <h3 className="text-lg font-bold font-['VT323']">WISDOM</h3>
                    <p className="text-sm text-stone-400 font-['VT323']">Final Score</p>
                  </div>
                </div>
                <span className="font-['VT323'] text-5xl font-bold text-purple-300">{finalGPA !== null ? finalGPA : '-'}</span>
              </div>
            </div>
          </div>

          {/* Glass Card 2: Power Levels */}
          <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-6">
            <h2 className="font-['Press_Start_2P'] text-yellow-400 text-lg mb-6 flex items-center"><Star className="mr-3 text-yellow-500"/>Power Levels</h2>
            <div className="space-y-5">
              <div className="text-center p-4 bg-black/50 rounded-md">
                <h3 className="text-lg font-['VT323'] text-stone-300">Total Mana</h3>
                <p className="font-['VT323'] text-5xl font-bold text-cyan-400 mt-1">{Math.floor(scholarScore)}</p>
              </div>
              <div>
                 <div className="flex justify-between items-center mb-1 font-['VT323'] text-lg">
                   <h3 className="text-stone-300">Level {currentLevel}</h3>
                   <p className="text-stone-400">{xpInCurrentLevel} / 1000 XP</p>
                 </div>
                <div className="w-full bg-black/50 rounded-full h-4 border-2 border-stone-700 overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full transition-all duration-500" style={{ width: `${relativeXpProgress}%` }}></div>
                </div>
                <p className="text-center text-sm font-['VT323'] mt-2 text-yellow-500/80 italic">
                  {xpNeededForNext} XP to next level!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Glass Card 3: Quest Log */}
        <div className="mt-10 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-6">
          <h2 className="font-['Press_Start_2P'] text-yellow-400 text-lg mb-6 flex items-center"><BookOpen className="mr-3 text-yellow-500"/>The History</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2 font-['VT323'] text-lg">
            {approvedSubmissions.length > 0 ? (
              approvedSubmissions.map(sub => {
                const quest = quests.find(q => q.id === sub.questId);
                return (
                  <div key={sub.id} className="bg-black/50 p-3 rounded-md flex justify-between items-center transition-colors hover:bg-white/5">
                    <div>
                      <p className="text-stone-300">{quest?.title || 'Unknown Quest'}</p>
                      <p className="text-xs text-stone-500">Timestamp: {sub.timestamp}</p>
                    </div>
                    <div className="font-bold text-green-400">
                      [+{quest?.xp || 0} XP] [+{quest?.gold || 0} G]
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-stone-400 text-center py-4 text-xl">No quests completed. Awaiting new legends...</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Archives;
