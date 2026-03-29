import React from 'react';
import { useGame } from '../context/GameContext';
import { Brain, Sparkle, BookOpen, Star, Award, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Archives = () => {
  const { 
    currentUser, 
    submissions, 
    quests, 
    students,
    calculateScholarScore,
    calculateComebackScore,
    calculateSlayerScore,
    getSlayerPoints
  } = useGame();
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

  // Rankings Logic
  const sortedByScholar = [...students].sort((a, b) => calculateScholarScore(b) - calculateScholarScore(a));
  const scholarRank = sortedByScholar.findIndex(s => s.id === currentUser.id) + 1;

  const sortedBySlayer = [...students].sort((a, b) => calculateSlayerScore(b) - calculateSlayerScore(a));
  const slayerRank = sortedBySlayer.findIndex(s => s.id === currentUser.id) + 1;

  const sortedByGrinder = [...students].sort((a, b) => b.xp - a.xp);
  const grinderRank = sortedByGrinder.findIndex(s => s.id === currentUser.id) + 1;

  const sortedByComeback = [...students].sort((a, b) => calculateComebackScore(b) - calculateComebackScore(a));
  const comebackRank = sortedByComeback.findIndex(s => s.id === currentUser.id) + 1;

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

        {/* Section 1: Avatar & Attributes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          <div className="md:col-span-1 bg-black border border-stone-600 rounded-xl flex items-center justify-center p-2 shadow-2xl">
            <img src={currentUser.currentBodySprite} alt="Hero Avatar" className="w-full h-auto object-contain max-h-48" />
          </div>

          <div className="md:col-span-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-6">
            <h2 className="font-['Press_Start_2P'] text-yellow-400 text-lg mb-6 flex items-center"><Award className="mr-3 text-yellow-500"/>Attributes</h2>
            <div className="space-y-4">
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
              <div className="flex items-center justify-between p-4 rounded-lg bg-cyan-900/20 border-l-4 border-l-cyan-500">
                <div className="flex items-center">
                  <Star className="w-8 h-8 mr-4 text-cyan-300"/>
                  <div>
                    <h3 className="text-lg font-bold font-['VT323']">TOTAL MANA</h3>
                    <p className="text-sm text-stone-400 font-['VT323']">Overall Power Level</p>
                  </div>
                </div>
                <span className="font-['VT323'] text-5xl font-bold text-cyan-400">{Math.floor(scholarScore)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1.5: Realm Standings */}
        <div className="bg-black/60 backdrop-blur-md rounded-xl p-6 border border-white/10 my-6 shadow-2xl">
          <h2 className="font-['Press_Start_2P'] text-yellow-400 text-lg mb-6 text-center">REALM STANDINGS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-white/5 rounded-lg border border-white/5">
              <h3 className="text-stone-400 font-['VT323'] text-2xl mb-2">Scholar</h3>
              <p className="font-bold font-['VT323'] text-4xl text-white">#{scholarRank}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-white/5">
              <h3 className="text-stone-400 font-['VT323'] text-2xl mb-2">Slayer</h3>
              <p className="font-bold font-['VT323'] text-4xl text-white">#{slayerRank}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-white/5">
              <h3 className="text-stone-400 font-['VT323'] text-2xl mb-2">Grinder</h3>
              <p className="font-bold font-['VT323'] text-4xl text-white">#{grinderRank}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-lg border border-white/5">
              <h3 className="text-stone-400 font-['VT323'] text-2xl mb-2">Comeback</h3>
              <p className="font-bold font-['VT323'] text-4xl text-white">#{comebackRank}</p>
            </div>
          </div>
        </div>

        {/* Existing Section: Level Progress */}
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-6 mb-10">
          <h2 className="font-['Press_Start_2P'] text-yellow-400 text-lg mb-6 flex items-center"><Star className="mr-3 text-yellow-500"/>Level Progress</h2>
          <div>
            <div className="flex justify-between items-center mb-1 font-['VT323'] text-xl">
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
