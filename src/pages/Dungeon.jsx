import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ArrowLeft, Sword, Shield, Coins, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DUNGEON_BG = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Dungeon.background.png";

const CATEGORIES = {
  uploads: { title: 'The Paper Constructs', desc: 'Submit physical homework (Upload Quests) to summon these golems.' },
  quizzes: { title: 'Order of the Owl', desc: 'Ace Math Speed Runs and Quizzes to attract these wise entities.' },
  multistep: { title: 'The Ancient Colossi', desc: 'Conquer complex, Multi-Step math problems to awaken the titans.' },
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

const getBossProgress = (boss, currentUser) => {
  if (!currentUser) return 0;
  switch (boss.requirement) {
    case 'uploads': return currentUser.uploadQuestsCompleted || 0;
    case 'quizzes': return currentUser.quizQuestsCompleted || 0;
    case 'multistep': return currentUser.multiStepQuestsCompleted || 0;
    case 'scenarios': return currentUser.scenarioQuestsCompleted || 0;
    case 'incantations': return currentUser.incantationQuestsCompleted || 0;
    case 'sports': return currentUser.sportsQuestsCompleted || 0;
    case 'arts': return currentUser.artsQuestsCompleted || 0;
    case 'wellness': return currentUser.wellnessQuestsCompleted || 0;
    case 'streak': return currentUser.loginStreak || 0;
    case 'journal': return currentUser.journalQuestsCompleted || 0;
    case 'ciphers': return currentUser.cipherQuestsCompleted || 0;
    case 'gauntlet': return currentUser.gauntletQuestsCompleted || 0;
    default: return 0;
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

const Dungeon = () => {
  const navigate = useNavigate();
  const { currentUser, BOSSES = [], fightBoss, submitBossStrike } = useGame();

  const [activeBossBattle, setActiveBossBattle] = useState(null);
  const [battleInput, setBattleInput] = useState('');
  const [battleTimeLeft, setBattleTimeLeft] = useState(0);
  const [cinematic, setCinematic] = useState(null);
  const cinematicTimeoutRef = useRef(null);

  // Stable Battle Timer
  useEffect(() => {
    if (!activeBossBattle || activeBossBattle.finishingBlow?.type !== 'auto' || cinematic) {
      return;
    }

    if (battleTimeLeft <= 0) {
      alert('The boss evaded your strike!');
      setActiveBossBattle(null);
      return;
    }

    const timer = setInterval(() => {
      setBattleTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeBossBattle, battleTimeLeft, cinematic]);

  // Unmount Safety for Victory Cinematic
  useEffect(() => {
    return () => {
      if (cinematicTimeoutRef.current) {
        clearTimeout(cinematicTimeoutRef.current);
      }
    };
  }, []);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-200 font-['VT323'] relative">
        <img src={DUNGEON_BG} alt="Dungeon Background" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="relative z-10 text-center bg-black/70 p-8 rounded-xl border border-white/10 shadow-2xl">
          <p className="text-2xl">The Dungeon awaits, but you must be logged in.</p>
          <button onClick={() => navigate('/')} className="mt-4 px-4 py-2 bg-yellow-600 text-black rounded hover:bg-yellow-500 font-['Press_Start_2P'] text-sm">Login</button>
        </div>
      </div>
    );
  }

  const sortBosses = (bossList) => {
    const defeatedSet = new Set(currentUser.defeatedBosses || []);
    return [...bossList].sort((a, b) => {
      const aProgress = getBossProgress(a, currentUser);
      const bProgress = getBossProgress(b, currentUser);
      const aDefeated = defeatedSet.has(a.id);
      const bDefeated = defeatedSet.has(b.id);
      const aUnlocked = aProgress >= a.target;
      const bUnlocked = bProgress >= b.target;

      if (aDefeated && !bDefeated) return 1;
      if (!aDefeated && bDefeated) return -1;
      if (aUnlocked && !bUnlocked) return -1;
      if (!aUnlocked && bUnlocked) return 1;
      return 0;
    });
  };

  const handleExecuteStrike = () => {
    if (!activeBossBattle) return;
    const expected = (activeBossBattle.finishingBlow?.answer || '').trim().toLowerCase();
    const actual = (battleInput || '').trim().toLowerCase();

    if (actual === expected) {
      const result = fightBoss(activeBossBattle.id);
      if (result && result.success) {
        setCinematic({ 
          name: activeBossBattle.name, 
          xp: activeBossBattle.rewardXp, 
          gold: activeBossBattle.rewardGold 
        });
        
        cinematicTimeoutRef.current = setTimeout(() => {
          setCinematic(null);
          setActiveBossBattle(null);
        }, 4500);
      }
    } else {
      alert('Miss! Try again!');
      setBattleTimeLeft(prev => Math.max(1, prev - 5));
      setBattleInput('');
    }
  };

  return (
    <div className="min-h-screen text-stone-200 p-4 sm:p-6 md:p-8 relative select-none">
      {/* Fixed Viewport Background */}
      <div className="fixed inset-0 z-0 h-full w-full overflow-hidden pointer-events-none">
        <img 
          src={DUNGEON_BG} 
          alt="Dungeon Background" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      {/* Fixed Floating Return to Map Button */}
      <button 
        onClick={() => navigate('/student-dashboard')} 
        className="fixed top-4 left-4 z-50 bg-black/80 backdrop-blur-md border-2 border-yellow-500/50 hover:border-yellow-400 text-yellow-400 font-['Press_Start_2P'] text-[10px] py-2.5 px-4 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.8)] flex items-center gap-2 transition-all cursor-pointer"
      >
        <ArrowLeft size={16} /> RETURN TO MAP
      </button>

      <div className="max-w-6xl mx-auto relative z-10 pt-12 sm:pt-14 md:pt-6">

        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl text-red-600 font-['Press_Start_2P'] drop-shadow-[0_4px_12px_rgba(220,38,38,0.4)]">
            THE DUNGEON
          </h1>
          <p className="text-stone-400 text-center max-w-2xl mx-auto mt-6 mb-10 font-['VT323'] text-xl italic leading-relaxed">
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
                <h2 className="text-2xl text-yellow-500 font-['Press_Start_2P'] border-b border-stone-700 pb-2 mb-2 mt-12">
                  {categoryInfo.title}
                </h2>
                <p className="text-stone-400 mb-6 font-['VT323'] text-xl">{categoryInfo.desc}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {sortedCategoryBosses.map((boss) => {
                    const isDefeated = (currentUser.defeatedBosses || []).includes(boss.id);
                    const currentProgress = getBossProgress(boss, currentUser);
                    const isUnlocked = currentProgress >= boss.target;

                    return (
                      <div key={boss.id} className="bg-stone-900/90 border-2 border-red-900/50 rounded-xl p-4 flex flex-col justify-between shadow-2xl shadow-red-900/20 backdrop-blur-sm">
                        <div>
                          <div className="h-48 w-full bg-black rounded mb-4 relative overflow-hidden flex items-center justify-center">
                            <img src={boss.image} alt={boss.name} className="h-full w-full object-contain" />
                          </div>
                          <h3 className="text-base font-['Press_Start_2P'] text-red-500 text-center mb-2 leading-tight">
                            {boss.name}
                          </h3>

                          <div className="flex justify-center gap-2 my-4">
                            <div className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full bg-yellow-950/60 text-yellow-300 border border-yellow-700/60 shadow-inner">
                              <Coins size={13} />
                              <span>{boss.rewardGold} G</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded-full bg-blue-950/60 text-blue-300 border border-blue-700/60 shadow-inner">
                              <Star size={13} />
                              <span>{boss.rewardXp} XP</span>
                            </div>
                          </div>

                          <div className="mb-4 font-mono text-xs">
                            <div className="flex justify-between mb-1 text-stone-300">
                              <span>{getRequirementLabel(boss.requirement)}</span>
                              <span className="font-bold">{currentProgress} / {boss.target}</span>
                            </div>
                            <div className="w-full bg-black/60 rounded-full h-2.5 border border-stone-700 overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-red-700 to-red-500 h-full rounded-full transition-all duration-300" 
                                style={{ width: `${Math.min((currentProgress / boss.target) * 100, 100)}%` }} 
                              />
                            </div>
                          </div>
                        </div>

                        {isDefeated ? (
                          <button disabled className="w-full mt-2 py-3 px-4 rounded-lg font-bold font-['Press_Start_2P'] text-xs bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed flex items-center justify-center gap-2">
                            <Shield size={16}/> DEFEATED
                          </button>
                        ) : !isUnlocked ? (
                          <button disabled className="w-full mt-2 py-3 px-4 rounded-lg font-bold font-['Press_Start_2P'] text-xs bg-gray-900/80 text-gray-600 border border-gray-800 cursor-not-allowed">
                            LOCKED
                          </button>
                        ) : (
                          <button 
                            onClick={() => {
                              setActiveBossBattle(boss);
                              if (boss.finishingBlow?.type === 'auto') {
                                setBattleTimeLeft(boss.finishingBlow.timeLimit || 15);
                              }
                              setBattleInput('');
                            }}
                            className="w-full mt-2 py-3 px-4 rounded-lg font-bold font-['Press_Start_2P'] text-xs bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white shadow-lg shadow-red-900/50 active:translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer transition-all"
                          >
                            <Sword size={16}/> BATTLE!
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
          <h1 className="text-3xl sm:text-4xl md:text-5xl text-red-600 font-['Press_Start_2P'] mb-6 text-center drop-shadow-[0_0_15px_rgba(220,38,38,0.8)]">
            {activeBossBattle.name}
          </h1>
          <img src={activeBossBattle.image} alt={activeBossBattle.name} className="h-48 w-48 sm:h-56 sm:w-56 object-contain mb-6 animate-pulse" />
          
          <div className="max-w-2xl text-center mb-6">
            <p className="text-xl sm:text-2xl text-yellow-400 font-['VT323'] drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] leading-relaxed">
              {activeBossBattle.finishingBlow?.prompt}
            </p>
          </div>

          {activeBossBattle.finishingBlow?.type === 'auto' ? (
            <div className="flex flex-col items-center w-full max-w-md">
              <div className="text-5xl text-red-500 font-['VT323'] mb-4 drop-shadow-[0_0_10px_red]">
                ⏳ {battleTimeLeft}s
              </div>
              <input
                type="text"
                value={battleInput}
                autoFocus
                onChange={(e) => setBattleInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleExecuteStrike()}
                className="w-full bg-stone-900 border-2 border-red-800 text-white p-3.5 rounded-lg font-mono text-lg text-center focus:outline-none focus:border-red-500 mb-4 shadow-inner"
                placeholder="Type answer here..."
              />
              <button
                onClick={handleExecuteStrike}
                className="w-full bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-['Press_Start_2P'] text-xs py-4 rounded-lg transition-all shadow-lg active:translate-y-0.5 cursor-pointer"
              >
                EXECUTE STRIKE
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full max-w-xl">
              {activeBossBattle.requirement === 'journal' || activeBossBattle.requirement === 'streak' || activeBossBattle.requirement === 'wellness' ? (
                <textarea
                  value={typeof battleInput === 'string' ? battleInput : ''}
                  onChange={(e) => setBattleInput(e.target.value)}
                  className="w-full h-32 bg-stone-900 border-2 border-red-800 text-white p-4 rounded-lg font-mono text-base mb-6 focus:outline-none focus:border-red-500 resize-none shadow-inner"
                  placeholder="Write your reflection here..."
                />
              ) : (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      if (file.size > 15 * 1024 * 1024) {
                        alert("File is too large. Please select an image under 15MB.");
                        e.target.value = '';
                        return;
                      }
                      setBattleInput(file);
                    }
                  }}
                  className="w-full mb-6 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-red-900 file:text-red-100 hover:file:bg-red-800 cursor-pointer"
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
                className="w-full bg-gradient-to-b from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-['Press_Start_2P'] text-xs py-4 rounded-lg transition-all shadow-lg active:translate-y-0.5 cursor-pointer"
              >
                SUBMIT STRIKE FOR REVIEW
              </button>
            </div>
          )}

          <button 
            onClick={() => setActiveBossBattle(null)} 
            className="mt-6 text-stone-400 hover:text-white font-['Press_Start_2P'] text-xs transition-colors cursor-pointer"
          >
            FLEE (Close)
          </button>
        </div>
      )}

      {/* Victory Cinematic Overlay */}
      <AnimatePresence>
        {cinematic && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-4 text-center select-none"
          >
            <h2 className="text-red-600 font-['Press_Start_2P'] text-2xl sm:text-4xl md:text-5xl tracking-[0.3em] drop-shadow-[0_0_20px_rgba(220,38,38,0.9)] mb-8">
              NIGHTMARE SLAIN
            </h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-center space-y-3"
            >
              <p className="text-stone-300 font-['VT323'] text-2xl md:text-3xl">
                Defeated: <span className="text-white font-bold">{cinematic.name}</span>
              </p>
              <p className="text-yellow-400 font-['VT323'] text-3xl md:text-4xl drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]">
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
