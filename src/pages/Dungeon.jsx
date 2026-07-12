import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ArrowLeft, Sword, Shield, Coins, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dungeon = () => {
  const navigate = useNavigate();
  const { currentUser, BOSSES, fightBoss, submitBossStrike } = useGame();

  const [activeBossBattle, setActiveBossBattle] = useState(null);
  const [battleInput, setBattleInput] = useState('');
  const [battleTimeLeft, setBattleTimeLeft] = useState(0);
  const [cinematic, setCinematic] = useState(null);

  const MAP_BG = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/worldmap4.png";

  useEffect(() => {
    let timer;
    if (activeBossBattle && activeBossBattle.finishingBlow?.type === 'auto' && battleTimeLeft > 0 && !cinematic) {
      timer = setInterval(() => {
        setBattleTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (battleTimeLeft === 0 && activeBossBattle?.finishingBlow?.type === 'auto' && !cinematic) {
      alert('The boss evaded your strike!');
      setActiveBossBattle(null);
    }
    return () => clearInterval(timer);
  }, [activeBossBattle, battleTimeLeft, cinematic]);

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
      case 'gauntlet':
        return currentUser.gauntletQuestsCompleted || 0;
      default:
        return 0;
    }
  };

  const getRequirementLabel = (requirement) => {
    switch (requirement) {
      case 'uploads': return "Homework Uploads";
      case 'quizzes': return "Math Quizzes";
      case 'multistep': return "Complex Problems";
      case 'scenarios': return "Science Speed Runs";
      case 'incantations': return "Incantations Recited";
      case 'sports': return "Athletics Missions";
      case 'arts': return "Creative Missions";
      case 'wellness': return "Tavern Rests";
      case 'streak': return "Total Logins";
      case 'journal': return "Reflections Written";
      case 'ciphers': return "History Speed Runs";
      case 'gauntlet': return "Gauntlet Victories";
      default: return "Requirement";
    }
  };

const CATEGORIES = {
    uploads: { title: 'The Paper Constructs', desc: 'Submit physical homework (Upload Quests) to summon these golems.' },
    quizzes: { title: 'Order of the Owl', desc: 'Ace Math Speed Runs and Quizzes to attract these wise entities.' },
    scenarios: { title: 'The Volcanic Lineage', desc: 'Conduct rapid experiments (Science Speed Runs) to face these lava dragons.' },
    ciphers: { title: 'The Shapeshifters', desc: 'Seek historical insight (History Speed Runs) to unmask these deceptive illusions.' },
    incantations: { title: 'The Spectral Scribes', desc: 'Type Incantations perfectly and quickly to summon these ghosts.' },
    sports: { title: 'The Earth Titans', desc: 'Complete physical education Scout Reports to challenge the earth.' },
    arts: { title: 'The Prismatic Muses', desc: 'Submit creative art Scout Reports to face the glass entities.' },
    wellness: { title: 'The Guardian Spirits', desc: 'Complete daily Tavern Check-ins to meet the guardians.' },
    journal: { title: 'The Dream Eaters', desc: 'Write weekly Journal reflections to face your nightmares.' },
    gauntlet: { title: 'Phantoms of the Blur', desc: 'Survive the 7-second Gauntlet Trials to banish these high-speed spirits.' },
    streak: { title: 'The Chronos Entities', desc: 'Log in regularly to accumulate active days and challenge the masters of time.' }
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
                             onClick={() => {
                               setActiveBossBattle(boss);
                               if (boss.finishingBlow?.type === 'auto') {
                                 setBattleTimeLeft(boss.finishingBlow.timeLimit);
                               }
                               setBattleInput('');
                             }}
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

      {/* Boss Arena Modal */}
      {activeBossBattle && (
        <div className="z-50 fixed inset-0 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md">
          <h1 className="text-5xl md:text-6xl text-red-600 font-['Press_Start_2P'] mb-8 text-center drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">{activeBossBattle.name}</h1>
          <img src={activeBossBattle.image} alt={activeBossBattle.name} className="h-64 w-64 object-contain mb-8 animate-pulse" />
          
          <div className="max-w-2xl text-center mb-8">
             <p className="text-2xl text-yellow-400 font-['VT323'] drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] leading-relaxed">
               {activeBossBattle.finishingBlow.prompt}
             </p>
          </div>

          {activeBossBattle.finishingBlow.type === 'auto' ? (
            <div className="flex flex-col items-center w-full max-w-md">
               <div className="text-6xl text-red-500 font-['VT323'] mb-6 drop-shadow-[0_0_10px_red]">
                 {battleTimeLeft}s
               </div>
               <input
                 type="text"
                 value={battleInput}
                 onChange={(e) => setBattleInput(e.target.value)}
                 className="w-full bg-stone-900 border-2 border-red-800 text-white p-4 rounded-lg font-mono text-xl text-center focus:outline-none focus:border-red-500 mb-6"
                 placeholder="Type answer here..."
               />
               <button
                 onClick={() => {
                   if (battleInput.trim().toLowerCase() === activeBossBattle.finishingBlow.answer.toLowerCase()) {
                     const result = fightBoss(activeBossBattle.id);
                     if (result.success) {
                        setCinematic({ name: activeBossBattle.name, xp: activeBossBattle.rewardXp, gold: activeBossBattle.rewardGold });
                        setTimeout(() => {
                           setCinematic(null);
                           setActiveBossBattle(null);
                        }, 4500);
                     }
                   } else {
                     alert('Miss! Try again!');
                     setBattleTimeLeft(prev => Math.max(0, prev - 5));
                     setBattleInput('');
                   }
                 }}
                 className="w-full bg-red-700 hover:bg-red-600 text-white font-['Press_Start_2P'] py-4 rounded-lg transition-colors"
               >
                 EXECUTE STRIKE
               </button>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full max-w-xl">
               {activeBossBattle.requirement === 'journal' || activeBossBattle.requirement === 'streak' || activeBossBattle.requirement === 'wellness' ? (
                 <textarea
                   value={battleInput}
                   onChange={(e) => setBattleInput(e.target.value)}
                   className="w-full h-32 bg-stone-900 border-2 border-red-800 text-white p-4 rounded-lg font-mono text-lg mb-6 focus:outline-none focus:border-red-500 resize-none"
                   placeholder="Write your reflection here..."
                 />
               ) : (
                 <input
                   type="file"
                   onChange={(e) => {
                     if(e.target.files && e.target.files[0]){
                         setBattleInput(e.target.files[0]);
                     }
                   }}
                   className="w-full mb-6 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-900 file:text-red-100 hover:file:bg-red-800"
                 />
               )}
               <button
                 onClick={() => {
                   if (!battleInput) {
                     alert('Please provide proof for your strike!');
                     return;
                   }
                   submitBossStrike(activeBossBattle.id, battleInput);
                   alert('Strike submitted for Game Master review!');
                   setActiveBossBattle(null);
                 }}
                 className="w-full bg-red-700 hover:bg-red-600 text-white font-['Press_Start_2P'] py-4 rounded-lg transition-colors"
               >
                 SUBMIT STRIKE FOR REVIEW
               </button>
            </div>
          )}

          <button 
            onClick={() => setActiveBossBattle(null)} 
            className="mt-8 text-stone-400 hover:text-white font-['Press_Start_2P'] text-sm"
          >
            FLEE (Close)
          </button>
        </div>
      )}

      <AnimatePresence>
        {cinematic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
          >
            <h2 className="text-red-600 font-['Press_Start_2P'] text-3xl md:text-6xl tracking-[0.5em] text-center drop-shadow-[0_0_20px_rgba(220,38,38,0.8)] mb-8">
              NIGHTMARE SLAIN
            </h2>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="text-center"
            >
              <p className="text-stone-400 font-['VT323'] text-2xl mb-4">
                Defeated: {cinematic.name}
              </p>
              <p className="text-yellow-400 font-['VT323'] text-3xl drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]">
                +{cinematic.xp} XP | +{cinematic.gold} Gold
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dungeon;
