import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ArrowLeft, Sword, Shield, Coins } from 'lucide-react';
import { Star } from 'lucide-react';

const Dungeon = () => {
  const navigate = useNavigate();
  const { currentUser, submissions, BOSSES, fightBoss } = useGame();

  const MAP_BG = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/worldmap4.png";

  const handleFightBoss = (bossId) => {
    const result = fightBoss(bossId);
    if (result.success) {
      alert(`Victory! You defeated the boss and earned ${result.rewardGold} Gold and ${result.rewardXp} XP!`);
    } else {
      alert(`Defeat: ${result.message}`);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-200 font-['VT323'] relative">
        <img src={MAP_BG} alt="Background Map" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="relative z-10 text-center bg-black/70 p-8 rounded-xl border border-white/10">
          <p className="text-2xl">The Dungeon awaits, but you must be logged in.</p>
          <button onClick={() => navigate('/login')} className="mt-4 px-4 py-2 bg-yellow-600 text-black rounded hover:bg-yellow-500 font-['Press_Start_2P'] text-sm">Login</button>
        </div>
      </div>
    );
  }

  const completedQuests = submissions.filter(s => s.studentId === currentUser.id && s.status === 'approved').length;

  return (
    <div className="min-h-screen text-stone-200 p-4 sm:p-6 md:p-8 relative">
      <img src={MAP_BG} alt="Background Map" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/80"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-stone-300 hover:text-white transition-colors font-['Press_Start_2P'] text-xs">
          <ArrowLeft size={16} /> Back
        </button>

        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl text-red-600 font-['Press_Start_2P']">THE DUNGEON</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BOSSES.map((boss) => {
            const isDefeated = currentUser.defeatedBosses.includes(boss.id);
            let isLocked = true;
            let currentProgress = 0;

            if (boss.requirement === 'streak') {
              currentProgress = currentUser.loginStreak;
              if (currentProgress >= boss.target) {
                isLocked = false;
              }
            } else if (boss.requirement === 'quests') {
              currentProgress = completedQuests;
              if (currentProgress >= boss.target) {
                isLocked = false;
              }
            }
            
            return (
              <div key={boss.id} className="bg-stone-900 border-2 border-red-900/50 rounded-xl p-4 flex flex-col justify-between shadow-2xl shadow-red-900/20">
                <div>
                  <div className="h-48 w-full bg-black rounded mb-4 relative overflow-hidden">
                     <img src={boss.image} alt={boss.name} className="absolute inset-0 w-full h-full object-contain"/>
                  </div>
                  <h2 className="text-2xl font-['Press_Start_2P'] text-red-500 text-center mb-2">{boss.name}</h2>
                  <p className="font-['VT323'] text-stone-400 text-lg text-center mb-4">{boss.description}</p>

                   <div className="flex justify-center gap-2 my-4">
                        <div className="flex items-center gap-2 text-sm font-mono px-3 py-1 rounded-full bg-yellow-900/50 text-yellow-300 border border-yellow-700">
                            <Coins size={14} />
                            <span>{boss.rewardGold} G</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-mono px-3 py-1 rounded-full bg-blue-900/50 text-blue-300 border border-blue-700">
                            <Star size={14} />
                            <span>{boss.rewardXp} XP</span>
                        </div>
                    </div>

                  {/*- Progress Bar -*/}
                  <div className='mb-4'>
                    <div className="flex justify-between font-mono text-sm mb-1">
                      <span>{boss.requirement === 'streak' ? 'Streak' : 'Quests'}</span>
                      <span>{currentProgress} / {boss.target}</span>
                    </div>
                    <div className="w-full bg-black/50 rounded-full h-3 border border-stone-700">
                      <div className="bg-red-600 h-full rounded-full" style={{ width: `${Math.min((currentProgress / boss.target) * 100, 100)}%` }}></div>
                    </div>
                  </div>
                </div>

                {isDefeated ? (
                   <button disabled className="w-full mt-2 py-3 px-4 rounded-lg font-bold font-['Press_Start_2P'] text-lg bg-stone-700 text-stone-500 cursor-not-allowed flex items-center justify-center gap-2">
                     <Shield size={20}/> DEFEATED
                   </button>
                ) : isLocked ? (
                   <button disabled className="w-full mt-2 py-3 px-4 rounded-lg font-bold font-['Press_Start_2P'] text-lg bg-gray-800 text-gray-500 cursor-not-allowed">
                     LOCKED
                   </button>
                ) : (
                   <button 
                     onClick={() => handleFightBoss(boss.id)}
                     className="w-full mt-2 py-3 px-4 rounded-lg font-bold font-['Press_Start_2P'] text-lg bg-red-700 hover:bg-red-600 text-white animate-pulse shadow-lg shadow-red-500/30 hover:animate-none flex items-center justify-center gap-2"
                   >
                     <Sword size={20}/> BATTLE!
                   </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dungeon;
