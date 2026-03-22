import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ArrowLeft, Sword, Shield, Coins, Star } from 'lucide-react';

const Dungeon = () => {
  const navigate = useNavigate();
  const { currentUser, BOSSES, fightBoss } = useGame();

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

  const getBossProgress = (boss) => {
    switch (boss.requirement) {
      case 'uploads':
        return currentUser.uploadQuestsCompleted || 0;
      case 'quizzes':
        return currentUser.quizQuestsCompleted || 0;
      case 'multistep':
        return currentUser.multiStepQuestsCompleted || 0;
      case 'scenarios':
        return currentUser.scenarioQuestsCompleted || 0;
      case 'incantations':
        return currentUser.incantationQuestsCompleted || 0;
      case 'sports':
        return currentUser.sportsQuestsCompleted || 0;
      case 'arts':
        return currentUser.artsQuestsCompleted || 0;
      case 'wellness':
        return currentUser.wellnessQuestsCompleted || 0;
      case 'streak':
        return currentUser.loginStreak || 0;
      case 'journal':
        return currentUser.journalQuestsCompleted || 0;
      case 'ciphers':
        return currentUser.cipherQuestsCompleted || 0;
      default:
        return 0;
    }
  };

  const getRequirementLabel = (requirement) => {
    switch (requirement) {
      case 'uploads': return "Homework Uploads";
      case 'quizzes': return "Quizzes Aced";
      case 'multistep': return "Complex Problems";
      case 'scenarios': return "Scenarios Cleared";
      case 'incantations': return "Incantations Recited";
      case 'sports': return "Athletics Missions";
      case 'arts': return "Creative Missions";
      case 'wellness': return "Tavern Rests";
      case 'streak': return "Days in a Row";
      case 'journal': return "Reflections Written";
      case 'ciphers': return "Riddles Solved";
      default: return "Requirement";
    }
  };

  const CATEGORIES = {
    uploads: { title: 'The Paper Constructs', desc: 'Submit physical homework (Upload Quests) to summon these golems.' },
    quizzes: { title: 'Order of the Owl', desc: 'Ace Math and History Quizzes to attract these wise entities.' },
    multistep: { title: 'The Ancient Colossi', desc: 'Conquer complex, Multi-Step math problems to awaken the titans.' },
    streak: { title: 'The Chronos Entities', desc: 'Maintain your Daily Login Streak to challenge the masters of time.' },
    scenarios: { title: 'The Volcanic Lineage', desc: 'Make the right choices in Scenario Quests to face these dragons.' },
    ciphers: { title: 'The Shapeshifters', desc: 'Solve Riddles and Ciphers to unmask these illusions.' },
    incantations: { title: 'The Spectral Scribes', desc: 'Type Incantations perfectly and quickly to summon these ghosts.' },
    sports: { title: 'The Earth Titans', desc: 'Complete physical education Scout Reports to challenge the earth.' },
    arts: { title: 'The Prismatic Muses', desc: 'Submit creative art Scout Reports to face the glass entities.' },
    wellness: { title: 'The Guardian Spirits', desc: 'Complete daily Tavern Check-ins to meet the guardians.' },
    journal: { title: 'The Dream Eaters', desc: 'Write weekly Journal reflections to face your nightmares.' }
  };

  const sortBosses = (bossList) => {
    return [...bossList].sort((a, b) => {
      const aProgress = getBossProgress(a);
      const bProgress = getBossProgress(b);
      const aDefeated = currentUser.defeatedBosses.includes(a.id);
      const bDefeated = currentUser.defeatedBosses.includes(b.id);
      const aUnlocked = aProgress >= a.target;
      const bUnlocked = bProgress >= b.target;

      if (aDefeated && !bDefeated) return 1;
      if (!aDefeated && bDefeated) return -1;
      if (aUnlocked && !bUnlocked) return -1;
      if (!aUnlocked && bUnlocked) return 1;
      return 0;
    });
  };

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
          <p className="text-stone-400 text-center max-w-2xl mx-auto mt-6 mb-10 italic">
            Defeat monsters to earn massive XP and Gold. Bosses are summoned by completing specific types of quests in the realm. Find a monster's weakness, complete the required tasks, and claim your victory!
          </p>
        </header>

        <div>
          {Object.entries(CATEGORIES).map(([requirementKey, categoryInfo]) => {
            const categoryBosses = BOSSES.filter(b => b.requirement === requirementKey);
            if (categoryBosses.length === 0) return null;

            const sortedCategoryBosses = sortBosses(categoryBosses);

            return (
              <div key={requirementKey} className="mb-16">
                <h2 className="text-2xl text-yellow-500 font-['Press_Start_2P'] border-b border-stone-700 pb-2 mb-2 mt-12">{categoryInfo.title}</h2>
                <p className="text-stone-400 mb-6 font-['VT323'] text-xl">{categoryInfo.desc}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {sortedCategoryBosses.map((boss) => {
                    const isDefeated = currentUser.defeatedBosses.includes(boss.id);
                    const currentProgress = getBossProgress(boss);
                    const isUnlocked = currentProgress >= boss.target;

                    return (
                      <div key={boss.id} className="bg-stone-900 border-2 border-red-900/50 rounded-xl p-4 flex flex-col justify-between shadow-2xl shadow-red-900/20">
                        <div>
                          <div className="h-48 w-full bg-black rounded mb-4 relative overflow-hidden">
                             <img src={boss.image} alt={boss.name} className="absolute inset-0 w-full h-full object-contain"/>
                          </div>
                          <h2 className="text-2xl font-['Press_Start_2P'] text-red-500 text-center mb-2 text-balance leading-tight">{boss.name}</h2>

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

                          <div className='mb-4'>
                            <div className="flex justify-between font-mono text-sm mb-1">
                              <span>{getRequirementLabel(boss.requirement)}</span>
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
                        ) : !isUnlocked ? (
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dungeon;
