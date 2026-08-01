import React from 'react';
import { useGame } from '../context/GameContext';
import { BookOpen, Star, Award, ArrowLeft } from 'lucide-react';
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
    getSlayerPoints,
    globalEffects
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

  const hasEmber = currentUser.activeBuffs?.ember && currentUser.activeBuffs.ember > Date.now();
  const hasOath = currentUser.activeBuffs?.oath;
  const hasVoidGrasp = globalEffects?.some(e => e.type === 'void_grasp' && e.target_id === currentUser.id);
  const hasActiveSpells = hasEmber || hasOath || hasVoidGrasp;

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
          <div className="md:col-span-1">
            <div className="text-center mb-4">
              <h2 className="text-2xl text-yellow-400 font-['Press_Start_2P'] mb-2">{currentUser.heroName}</h2>
              <p className="text-purple-400 font-['VT323'] text-3xl uppercase tracking-widest mb-1">{currentUser.heroClass}</p>
              <p className="text-stone-400 font-['VT323'] text-xl">Level {Math.floor(currentUser.xp / 1000) + 1}</p>
            </div>
            <div className="relative w-full h-80 lg:h-96 bg-black rounded-xl overflow-hidden border-2 border-stone-700 shadow-inner">
              <img src={currentUser.currentBodySprite} alt="Hero Avatar" className="absolute inset-0 w-full h-full object-contain" />
            </div>

            {/* ACTIVE SPELLS SECTION */}
            <div className="mt-6">
              <h3 className="text-yellow-400 font-['Press_Start_2P'] text-xs mb-3 text-center">ACTIVE SPELLS</h3>
              {!hasActiveSpells ? (
                <div className="text-stone-500 font-['VT323'] text-xl italic text-center">No active enchantments.</div>
              ) : (
                <div className="space-y-2">
                  {hasEmber && (
                    <div className="bg-orange-900/40 border border-orange-500 text-orange-400 p-2 rounded text-center font-['VT323'] text-lg shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                      EMBER ACTIVE (2x XP)
                    </div>
                  )}
                  {hasOath && (
                    <div className="bg-purple-900/40 border border-purple-500 text-purple-400 p-2 rounded text-center font-['VT323'] text-lg shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                      OATH ACTIVE (4x REWARDS)
                    </div>
                  )}
                  {hasVoidGrasp && (
                    <div className="bg-red-900/60 border border-red-500 text-red-200 animate-pulse p-2 rounded text-center font-['VT323'] text-lg shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                      VOID GRASPED (BOARD LOCKED)
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>

          <div className="md:col-span-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-6 flex flex-col justify-center">
            <h2 className="font-['Press_Start_2P'] text-yellow-400 text-lg mb-6 flex items-center"><Award className="mr-3 text-yellow-500"/>Attributes</h2>
            <div className="space-y-4">
              {/* INTELLECT CARD */}
              <div className="bg-blue-950/10 border border-blue-500/20 rounded-xl p-5 flex items-center justify-between shadow-[0_0_15px_rgba(59,130,246,0.05)] transition-all duration-300">
                <div className="flex flex-col">
                  <span className="text-blue-400 font-['Press_Start_2P'] text-[10px] tracking-widest mb-1">[ INTELLECT ]</span>
                  <span className="text-xs text-stone-500 font-mono uppercase tracking-wider">Strategy Points</span>
                </div>
                <span className="text-4xl font-bold text-blue-300 font-['VT323'] tracking-wide">
                  {currentUser.midtermGPA || 0}
                </span>
              </div>

              {/* WISDOM CARD */}
              <div className="bg-purple-950/10 border border-purple-500/20 rounded-xl p-5 flex items-center justify-between shadow-[0_0_15px_rgba(168,85,247,0.05)] transition-all duration-300">
                <div className="flex flex-col">
                  <span className="text-purple-400 font-['Press_Start_2P'] text-[10px] tracking-widest mb-1">[ WISDOM ]</span>
                  <span className="text-xs text-stone-500 font-mono uppercase tracking-wider">Execution Points</span>
                </div>
                <span className="text-4xl font-bold text-purple-300 font-['VT323'] tracking-wide">
                  {currentUser.finalGPA !== null ? currentUser.finalGPA : '---'}
                </span>
              </div>

              {/* TOTAL MANA CARD */}
              <div className="bg-cyan-950/10 border border-cyan-500/20 rounded-xl p-5 flex items-center justify-between shadow-[0_0_15px_rgba(6,182,212,0.05)] transition-all duration-300">
                <div className="flex flex-col">
                  <span className="text-cyan-400 font-['Press_Start_2P'] text-[10px] tracking-widest mb-1">[ TOTAL MANA ]</span>
                  <span className="text-xs text-stone-500 font-mono uppercase tracking-wider">Overall Power Level</span>
                </div>
                <span className="text-4xl font-bold text-cyan-300 font-['VT323'] tracking-wide animate-pulse">
                  {calculateScholarScore(currentUser)}
                </span>
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

        {/* Active Companion Box */}
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl p-6 mt-6">
          <h3 className="text-yellow-400 font-['Press_Start_2P'] text-sm mb-4">ACTIVE COMPANION</h3>
          {currentUser.equippedPet ? (
            <div className="flex items-center gap-4 bg-stone-900/80 p-4 rounded-lg border border-purple-500/30">
              <div className="text-white font-['VT323'] text-3xl">{currentUser.equippedPet}</div>
              <div className="text-green-400 font-mono text-sm ml-auto text-right">
                {currentUser.equippedPet === 'Mystic Owlet' && '+15% XP (Quizzes & Puzzles)'}
                {currentUser.equippedPet === 'Fire Whelp' && '+15% Gold (Homework & Reports)'}
                {currentUser.equippedPet === 'Astral Fox' && '+5% Gold & XP (All Quests)'}
              </div>
            </div>
          ) : (
            <div className="text-stone-500 font-['VT323'] text-xl italic">No companion equipped. Visit the Barracks.</div>
          )}
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
