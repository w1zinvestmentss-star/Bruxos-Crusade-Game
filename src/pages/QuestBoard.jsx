import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Coins, Star, Brain, Zap, AlertTriangle, Upload, Clock, BookText, MessageSquare, Swords, Palette, Heart, Wand, Flame } from 'lucide-react';
import { useGame } from '../context/GameContext';

const VICTORY_QUOTES = [
  'Your mind is as sharp as a sword!',
  'A legendary feat!',
  'The Kingdom grows stronger with your knowledge.',
  'Knowledge is the ultimate weapon!',
  'Another victory for the Archives!',
];

const QuestBoard = () => {
  const navigate = useNavigate();
  const { quests, submitQuest, getQuestStatus, currentUser, attemptQuiz, attemptScenario, submitWellnessCheck, globalEffects, resolveVoidGrasp, recordGauntletFailure, submissions, getHighScore } = useGame();
  
  const fileInputRef = useRef(null);
  const selectedQuestRef = useRef(null);
  const [staticQuizAnswers, setStaticQuizAnswers] = useState({});
  const [activeQuizzes, setActiveQuizzes] = useState({});
  const [journalTexts, setJournalTexts] = useState({});
  const [stepTracker, setStepTracker] = useState({});

  const [activeMultiSteps, setActiveMultiSteps] = useState({});
  const [activeSector, setActiveSector] = useState('all');

  const dailyQuests = quests.filter(q => q.frequency === 'daily');
  const completedDailyCount = dailyQuests.filter(q => {
    const status = getQuestStatus(q.id);
    return status === 'approved' || status === 'pending';
  }).length;
  const dailyProgressPercent = Math.min(100, Math.round((completedDailyCount / Math.max(1, dailyQuests.length)) * 100));

  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalQuote, setModalQuote] = useState('');
  const [voidAnswer, setVoidAnswer] = useState('');
  const graspLock = globalEffects?.find(e => e.type === 'void_grasp' && e.target_id === currentUser?.id);
  const isLocked = !!graspLock;

  const getVoidGraspTimeLeft = () => {
    if (!graspLock || !graspLock.created_at) return "24 hours remaining";
    const createdTime = new Date(graspLock.created_at).getTime();
    const expirationTime = createdTime + 86400000; // 24 hours
    const msLeft = expirationTime - Date.now();

    if (msLeft <= 0) return "Dissolving...";

    const hours = Math.floor(msLeft / 3600000);
    const minutes = Math.floor((msLeft % 3600000) / 60000);
    return `${hours}h ${minutes}m remaining until dissolution`;
  };

  const [activeSessions, setActiveSessions] = useState({});
  const [sessionAnswers, setSessionAnswers] = useState({});
  const [activeScenarios, setActiveScenarios] = useState({});

  const QUESTBOARD_BG = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/questboard.background3.jpg";

  const triggerVictory = (message) => {
    const randomQuote = VICTORY_QUOTES[Math.floor(Math.random() * VICTORY_QUOTES.length)];
    setModalMessage(message);
    setModalQuote(randomQuote);
    setShowVictoryModal(true);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    const questId = selectedQuestRef.current
    if (file && questId) {
      const quest = quests.find(q => q.id === questId);
      submitQuest(questId, file, quest.type);
      alert('Proof Submitted! Awaiting Teacher Review.');
    }
  };

  const triggerUpload = (questId) => {
    selectedQuestRef.current = questId;
    fileInputRef.current.click();
  };

  const handleStaticQuizAnswerChange = (questId, answer) => {
    setStaticQuizAnswers(prev => ({ ...prev, [questId]: answer }));
  };

  const handleJournalTextChange = (questId, text) => {
    setJournalTexts(prev => ({ ...prev, [questId]: text }));
  };

  const handleJournalSubmit = (questId) => {
    const text = journalTexts[questId] || '';
    if (text.trim() === '') {
      alert('Please write something in your journal.');
      return;
    }
    submitQuest(questId, text, 'journal');
    alert('Journal entry submitted! Awaiting Teacher Review.');
  };

  const startActiveQuiz = (quest) => {
    if (!quest.questionBank || quest.questionBank.length === 0) return;
    const randomQuestion = quest.questionBank[Math.floor(Math.random() * quest.questionBank.length)];
    setActiveQuizzes(prev => ({ ...prev, [quest.id]: randomQuestion }));
    setStaticQuizAnswers(prev => ({ ...prev, [quest.id]: '' }));
  };

  const handleActiveQuizSubmit = async (questId) => {
    const activeQuestion = activeQuizzes[questId];
    const answer = staticQuizAnswers[questId] || '';
    if (!activeQuestion) return;

    const result = await attemptQuiz(questId, answer, activeQuestion.a);
    if (result.success) {
      triggerVictory(result.message);
      setActiveQuizzes(prev => {
        const next = { ...prev };
        delete next[questId];
        return next;
      });
      setStaticQuizAnswers(prev => ({ ...prev, [questId]: '' }));
    } else {
      alert(result.message);
    }
  };

  const handleWellnessSubmit = async (questId, feeling) => {
    const result = await submitWellnessCheck(questId, feeling);
    if (result.success) {
      const quest = quests.find(q => q.id === questId);
      triggerVictory(`+${quest.xp} XP, +${quest.gold} Gold`);
      alert('The tavern keeper slides you a warm drink. Rest well!');
    }
  };

  const rollScenario = (quest) => {
    if (!quest.questionBank || quest.questionBank.length === 0) return;
    const randomScenario = quest.questionBank[Math.floor(Math.random() * quest.questionBank.length)];
    setActiveScenarios(prev => ({ ...prev, [quest.id]: randomScenario }));
  };

  const handleScenarioSubmit = async (questId, chosenOption) => {
    const scenario = activeScenarios[questId];
    const isCorrect = chosenOption === scenario.a;
    if (isCorrect) {
      const result = await attemptScenario(questId, true);
      if (result.success) {
        triggerVictory(`+${quests.find(q => q.id === questId).xp} XP, +${quests.find(q => q.id === questId).gold} Gold`);
        setActiveScenarios(prev => ({ ...prev, [questId]: null }));
      }
    } else {
      alert("Wrong choice! The scenario shifts...");
      const quest = quests.find(q => q.id === questId);
      rollScenario(quest);
    }
  };

  const startDynamicQuiz = (quest) => {
    if (quest.questionBank && quest.questionBank.length > 0) {
      const randIdx = Math.floor(Math.random() * quest.questionBank.length);
      setActiveSessions(prev => ({...prev, [quest.id]: {
          isActive: true,
          currentQuestion: quest.questionBank[randIdx],
          timeLeft: currentUser?.activeBuffs?.oath ? Math.floor((quest.timeLimit || 30) / 2) : (quest.timeLimit || 30),
        }
      }));
      setSessionAnswers(prev => ({...prev, [quest.id]: ''}));
    }
  };

  const handleDynamicQuizSubmit = async (questId) => {
    const session = activeSessions[questId];
    const answer = sessionAnswers[questId] || '';
    if (!session || !session.isActive) return;
    const result = await attemptQuiz(questId, answer, session.currentQuestion.a);
    if (result.success) {
      triggerVictory(result.message);
      setActiveSessions(prev => ({...prev, [questId]: { isActive: false } }));
    } else {
      alert('The spell fizzled! Check punctuation. -5 seconds.');
      setActiveSessions(prev => ({...prev, [questId]: {...prev[questId], timeLeft: Math.max(0, prev[questId].timeLeft - 5)}}));
    }
  };

  const startMultiStep = (quest) => {
    if (!quest.stepBank || quest.stepBank.length === 0) return;
    const randomIndex = Math.floor(Math.random() * quest.stepBank.length);
    setActiveMultiSteps(prev => ({
      ...prev,
      [quest.id]: { bankIndex: randomIndex, stepIndex: 0 }
    }));
  };

  const handleMultiStepQuizSubmit = async (questId) => {
    const quest = quests.find(q => q.id === questId);
    const activeData = activeMultiSteps[questId];
    const currentProblem = quest.stepBank ? quest.stepBank[activeData.bankIndex] : null;
    const steps = currentProblem ? currentProblem.steps : (quest.steps || []);
    const currentStepIndex = activeData ? activeData.stepIndex : (stepTracker[questId] || 0);
    const currentStep = steps[currentStepIndex];
    const answer = staticQuizAnswers[questId] || '';
    const isLast = currentStepIndex === steps.length - 1;
    const result = await attemptQuiz(questId, answer, currentStep.a, isLast);
    if (result.success) {
      if (!isLast) {
        setActiveMultiSteps(prev => ({
          ...prev,
          [questId]: { ...prev[questId], stepIndex: currentStepIndex + 1 }
        }));
        alert(result.message);
        setStaticQuizAnswers(prev => ({ ...prev, [questId]: '' }));
      } else {
        setActiveMultiSteps(prev => {
          const next = { ...prev };
          delete next[questId];
          return next;
        });
        triggerVictory(result.message);
      }
    } else {
      alert(result.message);
    }
  };

  const getQuestIcon = (quest) => {
    switch(quest.type) {
      case 'incantation': return <MessageSquare size={20} />;
      case 'blitz': return <Zap size={20} className="text-blue-400" />;
      case 'quiz': return quest.questionBank?.length > 0 ? <Zap size={20} /> : <Brain size={20} />;
      case 'multi-step': return <BookText size={20} />;
      case 'scout-sports': return <Swords size={20} />;
      case 'scout-arts': return <Palette size={20} />;
      case 'wellness': return <Heart size={20} />;
      case 'gauntlet': return <AlertTriangle size={20} />;
      default: return <Brain size={20} />;
    }
  };

  const QUEST_CATEGORIES = {
    'upload': { title: 'The Paper Trail', desc: 'Submit physical homework and standard assignments for the Game Master to review.' },
    'blitz': { title: '⚡ The 2-Minute Frenzy', desc: 'Answer as many questions as you can before time runs out! Every correct answer earns extra Gold & XP.' },
    'quiz': { title: "The Scholar's Trial", desc: 'Auto-graded tests of knowledge. Answer correctly for instant rewards.' },
    'multi-step': { title: "The Hydra's Enigma", desc: 'Complex, multi-part problems. Solve them step-by-step.' },
    'scenario': { title: 'The Crossroads', desc: 'Read the situation and make the right choice to proceed.' },
    'cipher': { title: "The Sphinx's Riddles", desc: 'Decrypt anagrams and solve riddles to prove your wit.' },
    'incantation': { title: "The Scribe's Challenge", desc: 'Memorize the text and type it flawlessly before time runs out.' },
    'scout-sports': { title: 'Athletics & Training', desc: 'Real-world physical challenges. Upload proof of your feats of strength.' },
    'scout-arts': { title: "The Artisan's Canvas", desc: 'Creative missions. Upload your artwork, music, or creative projects.' },
    'wellness': { title: 'The Tavern Rest', desc: 'Take a moment to check in with the realm. How fares your spirit today?' },
    'journal': { title: "The Dream Eaters", desc: 'Reflect on your journey and write down your thoughts.' },
    'gauntlet': { title: 'The Gauntlet', desc: 'A high-intensity trial. One attempt per day. No mistakes allowed.' }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center z-[200]">
        <div className="text-yellow-500 font-['Press_Start_2P'] text-xl md:text-2xl animate-pulse drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]">
          LOADING QUESTS...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-stone-200 p-6 relative">
      {/* Fixed Viewport Background (Prevents stretching/wrapping on long pages) */}
      <div className="fixed inset-0 z-0 h-full w-full overflow-hidden pointer-events-none">
        <img 
          src={QUESTBOARD_BG} 
          alt="Quest Board Background" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect}/>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
          <button onClick={() => navigate('/student-dashboard')} className="flex items-center gap-2 text-stone-300 hover:text-white font-['Press_Start_2P'] text-xs"><ArrowLeft size={16} /> BACK</button>
          <div className="flex gap-4 bg-black/60 backdrop-blur-sm p-2 rounded-lg border border-white/10"><div className="flex items-center gap-2 text-yellow-400 font-['VT323'] text-xl"><Coins size={16} /> {currentUser?.gold} G</div><div className="flex items-center gap-2 text-blue-400 font-['VT323'] text-xl"><Star size={16} /> {currentUser?.xp} XP</div></div>
        </div>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl text-yellow-400 mb-10 text-center font-['Press_Start_2P']">QUEST BOARD</h1>
          <p className="text-stone-400 text-center max-w-2xl mx-auto mb-10 font-['VT323'] text-xl italic">
            Welcome to the Bounty Board, Hero. Choose your path, complete tasks to earn Gold and Experience, and awaken the bosses lurking in the Dungeon.
          </p>

          {/* DAILY BOUNTY PROGRESS RIBBON */}
          <div className="bg-black/75 backdrop-blur-md border border-yellow-500/40 p-4 rounded-xl max-w-3xl mx-auto mb-8 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="font-['Press_Start_2P'] text-[10px] text-yellow-400 uppercase tracking-wider">
                🎯 TODAY'S PROGRESS
              </span>
              <span className="font-mono text-xs text-stone-300 font-bold">
                {completedDailyCount} / {dailyQuests.length} COMPLETED ({dailyProgressPercent}%)
              </span>
            </div>
            <div className="w-full bg-stone-900 h-2 rounded-full overflow-hidden border border-stone-700">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-amber-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${dailyProgressPercent}%` }}
              />
            </div>
          </div>

          {/* SECTOR FILTER TABS (2-Row Grid on Mobile, Single Row on Desktop) */}
          <div className="grid grid-cols-2 sm:flex sm:flex-row sm:justify-center gap-2 sm:gap-3 mb-8 md:mb-10 max-w-3xl mx-auto px-1 sm:px-0">
            {[
              { id: 'all', label: 'ALL QUESTS' },
              { id: 'speed', label: '⚡ SPEED RUNS' },
              { id: 'uploads', label: '📋 UPLOADS & REPORTS' },
              { id: 'sanctuary', label: '🌿 SANCTUARY' }
            ].map(sector => (
              <button
                key={sector.id}
                onClick={() => setActiveSector(sector.id)}
                className={`w-full sm:w-auto px-2 sm:px-4 py-2.5 rounded-lg font-['Press_Start_2P'] text-[8px] xs:text-[9px] sm:text-[10px] text-center justify-center transition-all flex items-center gap-1.5 ${
                  activeSector === sector.id 
                    ? 'bg-yellow-500 text-stone-950 font-bold border-2 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]' 
                    : 'bg-black/70 text-stone-400 border border-stone-700 hover:text-white hover:bg-stone-800'
                }`}
              >
                <span className="truncate">{sector.label}</span>
              </button>
            ))}
          </div>

          {isLocked ? (
            <div className="bg-purple-900/80 border-4 border-purple-500 p-8 rounded-xl max-w-2xl mx-auto text-center shadow-[0_0_50px_rgba(168,85,247,0.5)]">
              <h1 className="text-4xl text-white font-['Press_Start_2P'] mb-6 animate-pulse">VOID BREACH DETECTED</h1>
              <p className="text-xl font-['VT323'] text-purple-200 mb-2">
                A dark magic has sealed your board! Solve the ancient equation to break the seal.
              </p>
              <p className="text-sm font-['Press_Start_2P'] text-purple-400 mb-6 uppercase tracking-wider animate-pulse">
                ⏳ {getVoidGraspTimeLeft()}
              </p>
              <div className="text-4xl font-mono text-yellow-400 mb-8 bg-black/50 p-4 rounded-lg inline-block">144 * 12 + 8 / 2 - 50</div>
              <input 
                type="text" 
                value={voidAnswer} 
                onChange={e => setVoidAnswer(e.target.value)} 
                className="w-full bg-black/80 text-white border-2 border-purple-500 rounded p-4 text-2xl font-mono mb-4 text-center focus:outline-none focus:border-yellow-400" 
                placeholder="Enter answer..."
              />
              <button 
                onClick={() => {
                  if(voidAnswer.trim() === "1682") {
                    resolveVoidGrasp(true);
                  } else {
                    alert("Incorrect. The void tightens...");
                  }
                }} 
                className="w-full bg-yellow-500 text-black py-4 rounded font-bold font-['VT323'] text-3xl hover:bg-yellow-400 transition-colors"
              >
                BREAK SEAL
              </button>
            </div>
          ) : (
            <div>
              {Object.keys(QUEST_CATEGORIES).map(categoryKey => {
                // Sector Filtering Guard (Consolidated 4-Tab System)
                if (activeSector === 'speed' && !['blitz', 'gauntlet', 'incantation', 'multi-step'].includes(categoryKey)) return null;
                if (activeSector === 'uploads' && !['upload', 'quiz', 'scout-sports', 'scout-arts'].includes(categoryKey)) return null; // Combined Uploads & Scout Reports
                if (activeSector === 'sanctuary' && !['wellness', 'journal'].includes(categoryKey)) return null;

                const categoryQuests = quests.filter(q => q.type === categoryKey);
                if (categoryQuests.length === 0) return null;

                const categoryInfo = QUEST_CATEGORIES[categoryKey];
                return (
                  <div key={categoryKey} className="mb-12">
                    <h2 className="text-2xl text-yellow-500 font-['Press_Start_2P'] border-b border-stone-700 pb-2 mb-2 mt-12">{categoryInfo.title}</h2>
                    <p className="text-stone-400 mb-6 font-['VT323'] text-xl">{categoryInfo.desc}</p>
                    <div className="grid gap-4">
                      {categoryQuests.map((quest) => {
                        const status = getQuestStatus(quest.id);
                        const isMultiStep = quest.type === 'multi-step';
                        const isScenario = quest.type === 'scenario';
                        const isJournal = quest.type === 'journal';
                        const isWellness = quest.type === 'wellness';
                        const isGauntlet = quest.type === 'gauntlet';
                        const currentScenario = activeScenarios[quest.id];
                        const activeSession = activeMultiSteps[quest.id];

                        const getBorderColor = () => {
                          if (status === 'approved' || status === 'read_only') return 'border-l-green-500 bg-green-900/40';
                          if (status === 'failed') return 'border-l-red-800 bg-red-950/40';
                          if (isGauntlet) return 'border-l-red-600 bg-red-950/40';
                          if (isMultiStep) return 'border-l-purple-500';
                          if (isScenario) return 'border-l-orange-500';
                          if (quest.type === 'incantation') return 'border-l-cyan-500';
                          if (quest.type === 'scout-sports') return 'border-l-orange-400';
                          if (quest.type === 'scout-arts') return 'border-l-pink-500';
                          if (isWellness) return 'border-l-red-500';
                          return 'border-l-blue-500';
                        };

                        return (
                          <motion.div 
                            key={quest.id} 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            className={`p-6 rounded-xl relative overflow-hidden transition-all bg-stone-950/85 backdrop-blur-md border-t border-t-white/25 border-r border-b border-white/10 border-l-4 ${getBorderColor()} shadow-[0_10px_30px_rgba(0,0,0,0.9)]`}
                          >
                            
                            {/* PEEKING ARTWORK LAYER - Boosted Opacity */}
                            {(() => {
                              let bgArt = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/worldmap4.png";
                              if (quest.type === 'upload') bgArt = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/herald.post.banner.png";
                              else if (quest.id === 103) bgArt = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Hunters.Archives.banner.png";
                              else if (quest.id === 104) bgArt = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Sunken.Palace.png";
                              else if (quest.id === 112) bgArt = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Science.quiz.banner.png";
                              else if (quest.id === 113) bgArt = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/scribeglossary.banner.png";
                              else if (quest.id === 114) bgArt = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Decipherers.Study.jpg";
                              else if (quest.type === 'multi-step') bgArt = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Sunken.Lagoon.png";
                              else if (quest.type === 'incantation') bgArt = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Haunted.Scriptorium.png";
                              else if (quest.type === 'scout-sports') bgArt = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Proving.Grounds.png";
                              else if (quest.type === 'scout-arts') bgArt = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Grand.Studio.png";
                              else if (quest.type === 'gauntlet') bgArt = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Gaunlet.dojo.banner.png";

                              return (
                                <>
                                  <img src={bgArt} alt={quest.title} className="absolute right-0 top-0 bottom-0 w-1/2 h-full object-cover object-right opacity-55 pointer-events-none z-0" />
                                  <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/90 to-transparent pointer-events-none z-0" />
                                </>
                              );
                            })()}

                            {/* FOREGROUND CARD CONTENT */}
                            <div className="flex justify-between items-start relative z-10">
                              <div className="font-['VT323'] text-xl flex-grow max-w-[65%]">
                                <h3 className="text-2xl mb-2 flex items-center gap-2 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                  {getQuestIcon(quest)}
                                  {quest.title}
                                </h3>
                                <p className="text-stone-200 mb-4 text-lg leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">{quest.description}</p>
                                <div className="flex gap-3 text-base">
                                  <span className="px-2 py-1 bg-blue-900/60 text-blue-300 rounded border border-blue-700/80 shadow-sm">+{quest.xp} XP</span>
                                  <span className="px-2 py-1 bg-yellow-900/60 text-yellow-300 rounded border border-yellow-700/80 shadow-sm">+{quest.gold} Gold</span>
                                </div>
                              </div>

                              {/* LAUNCHPAD / ACTIONS CONTAINER */}
                              <div className="flex-shrink-0 w-1/2 md:w-1/3 ml-4 relative z-10">
                      {status === 'available' ? (
                        quest.type === 'incantation' && quest.questionBank?.length > 0 ? (
                          <button onClick={() => navigate('/briefing/' + quest.id)} className="w-full px-4 py-3 bg-gradient-to-r from-cyan-900 to-blue-900 text-cyan-200 border-2 border-cyan-700 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.4)] font-['Press_Start_2P'] text-xs hover:bg-cyan-900 transition-colors flex items-center justify-center gap-2">
                            ENTER SCRIPTORIUM
                          </button>
                        ) : isGauntlet ? (
                          <button onClick={() => navigate('/briefing/' + quest.id)} className="w-full px-4 py-4 bg-red-900 text-red-200 border-2 border-red-600 rounded-lg shadow-lg font-['Press_Start_2P'] text-sm hover:bg-red-800 flex items-center justify-center gap-2">
                            <AlertTriangle size={18} /> ENTER THE DOJO
                          </button>
                        ) : isMultiStep ? (
                          <button onClick={() => navigate('/briefing/' + quest.id)} className="w-full px-4 py-3 bg-gradient-to-r from-purple-950 to-indigo-900 text-purple-200 border-2 border-purple-700 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.4)] font-['Press_Start_2P'] text-[10px] hover:bg-purple-900 transition-colors flex items-center justify-center gap-2">
                            <BookText size={18} /> ENTER THE LAGOON
                          </button>
                        ) : quest.type === 'scenario' ? (
                            !currentScenario ? (
                                <button onClick={() => rollScenario(quest)} className="w-full px-4 py-3 bg-gradient-to-r from-orange-700 to-yellow-600 text-white rounded-lg shadow-lg font-['Press_Start_2P'] text-sm hover:from-orange-600 hover:to-yellow-500 flex items-center justify-center gap-2">Face a Scenario</button>
                              ) : (
                                <div>
                                    <p className="text-lg text-white mb-3">{currentScenario?.q}</p>
                                    {(currentScenario?.options || []).map(option => (
                                        <button 
                                            key={option} 
                                            onClick={() => handleScenarioSubmit(quest.id, option)}
                                            className="w-full text-left p-3 mb-2 bg-stone-800 border border-stone-600 rounded hover:bg-stone-700 hover:border-yellow-500 transition-colors text-stone-200"
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                              )
) : quest.type === 'blitz' ? (
                          <div className="w-full flex flex-col gap-2">
                            {(() => {
                              const hs = getHighScore(quest.id);
                              return hs ? (
                                <div className="text-center text-yellow-400 font-['VT323'] text-lg bg-yellow-900/30 rounded py-1 border border-yellow-500/30">
                                  👑 HIGH SCORE: {hs.score} by {hs.player}
                                </div>
                              ) : (
                                <div className="text-center text-stone-500 font-['VT323'] text-lg bg-stone-900/50 rounded py-1 border border-stone-700">
                                  No high score yet. Be the first!
                                </div>
                              );
                            })()}
                            <button 
                              onClick={() => navigate('/briefing/' + quest.id)} 
                              className={`w-full px-4 py-3 rounded-lg shadow-lg font-['Press_Start_2P'] text-[10px] text-white flex items-center justify-center gap-2 transition-colors ${
                                quest.id === 104 ? 'bg-gradient-to-r from-yellow-700 to-amber-600 hover:from-yellow-600 hover:to-amber-500' :
                                quest.id === 103 ? 'bg-gradient-to-r from-stone-800 to-stone-600 border border-stone-500 hover:from-stone-700 hover:to-stone-500' :
                                quest.id === 113 ? 'bg-gradient-to-r from-purple-800 to-indigo-700 hover:from-purple-700 hover:to-indigo-600' :
                                quest.id === 114 ? 'bg-gradient-to-r from-red-800 to-red-600 hover:from-red-700 hover:to-red-500 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)]' :
                                'bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-600 hover:to-cyan-500'
                              }`}
                            >
                              {quest.id === 104 ? <Star size={18} /> : quest.id === 113 ? <Wand size={18} /> : quest.id === 114 ? <Flame size={18} /> : <Zap size={18} />} 
                              {quest.id === 104 ? 'ENTER THE PALACE' : quest.id === 113 ? 'ENTER THE VAULT' : quest.id === 114 ? 'ENTER THE FORGE' : quest.id === 103 ? 'SEEK INSIGHT' : 'ENTER THE LABORATORY'}
                            </button>
                          </div>
                        ) : quest.type === 'quiz' ? (
                          !activeQuizzes[quest.id] ? (
                            quest.questionBank?.length > 0 ? (
<button
                                 onClick={() => startActiveQuiz(quest)}
                                 className={`w-full px-4 py-3 rounded-lg shadow-lg font-['Press_Start_2P'] text-sm text-white flex items-center justify-center gap-2 ${quest.id === 104 ? 'bg-gradient-to-r from-yellow-700 to-amber-600 hover:from-yellow-600 hover:to-amber-500' : 'bg-gradient-to-r from-purple-700 to-yellow-600 hover:from-purple-600 hover:to-yellow-500'}`}
                               >
                                 <Brain size={18} /> {quest.id === 104 ? 'ENTER THE PALACE' : 'START QUIZ'}
                               </button>
                            ) : (
                              <div className="px-4 py-3 bg-stone-900/80 text-stone-400 rounded-lg border border-stone-700 font-['VT323'] text-center">
                                No questions loaded yet.
                              </div>
                            )
                          ) : (
                            <div className="space-y-3">
                              <p className="text-lg text-white font-mono text-center bg-black/50 p-3 rounded">
                                {activeQuizzes[quest.id].q}
                              </p>
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  placeholder="> enter solution..."
                                  value={staticQuizAnswers[quest.id] || ''}
                                  onChange={(e) => handleStaticQuizAnswerChange(quest.id, e.target.value)}
                                  onKeyPress={(e) => e.key === 'Enter' && handleActiveQuizSubmit(quest.id)}
                                  className="bg-black/80 border border-stone-600 rounded-md p-2 w-full text-green-400 font-mono focus:ring-1 focus:ring-green-500"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleActiveQuizSubmit(quest.id)}
                                  className="px-3 py-2 bg-yellow-600 text-black rounded-lg hover:bg-yellow-500 font-['VT323'] text-lg"
                                >
                                  EXECUTE
                                </button>
                              </div>
                            </div>
                          )
                        ) : isWellness ? (
                            <div className="flex items-center justify-around gap-2">
                                <button onClick={() => handleWellnessSubmit(quest.id, 'Strong')} className="px-3 py-2 rounded-lg bg-green-900/50 text-green-400 hover:bg-green-800 font-bold">🟢 Strong</button>
                                <button onClick={() => handleWellnessSubmit(quest.id, 'Weary')} className="px-3 py-2 rounded-lg bg-yellow-900/50 text-yellow-400 hover:bg-yellow-800 font-bold">🟡 Weary</button>
                                <button onClick={() => handleWellnessSubmit(quest.id, 'Wounded')} className="px-3 py-2 rounded-lg bg-red-900/50 text-red-400 hover:bg-red-800 font-bold">🔴 Wounded</button>
                            </div>
                        ) : isJournal ? (
                          quest.id === 106 ? (
                            <button onClick={() => navigate('/briefing/106')} className="w-full px-4 py-3 bg-gradient-to-r from-purple-700 to-yellow-600 text-white rounded-lg shadow-lg font-['Press_Start_2P'] text-sm hover:from-purple-600 hover:to-yellow-500 flex items-center justify-center gap-2">
                              <BookText size={18} /> SPEAK TO SCRIBE
                            </button>
                          ) : (
                            <div className="flex flex-col items-end gap-2"><textarea placeholder="Write your reflection..." value={journalTexts[quest.id] || ''} onChange={(e) => handleJournalTextChange(quest.id, e.target.value)} className="bg-black/80 border border-stone-600 rounded-md p-2 w-full h-24 text-stone-200 font-mono focus:ring-1 focus:ring-blue-500" /><button onClick={() => handleJournalSubmit(quest.id)} className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 font-['VT323'] text-xl"><Upload size={18} /> SUBMIT</button></div>
                          )
                        ) : quest.type === 'upload' ? (
                          <button onClick={() => navigate('/briefing/' + quest.id)} className="w-full px-4 py-3 bg-gradient-to-r from-stone-700 to-stone-600 text-white rounded-lg shadow-lg font-['Press_Start_2P'] text-[10px] hover:from-stone-600 hover:to-stone-500 flex items-center justify-center gap-2">
                            <Upload size={18} /> DISPATCH RAVEN
                          </button>
                        ) : quest.type === 'scout-arts' ? (
                          <button onClick={() => navigate('/briefing/' + quest.id)} className="w-full px-4 py-3 bg-gradient-to-r from-pink-900 to-purple-800 text-pink-200 border-2 border-pink-700 rounded-lg shadow-[0_0_15px_rgba(236,72,153,0.4)] font-['Press_Start_2P'] text-[10px] hover:bg-pink-900 transition-colors flex items-center justify-center gap-2">
                            <Palette size={18} /> ENTER THE STUDIO
                          </button>
                        ) : quest.type === 'scout-sports' ? (
                          <button onClick={() => navigate('/briefing/' + quest.id)} className="w-full px-4 py-3 bg-gradient-to-r from-orange-900 to-red-800 text-orange-200 border-2 border-orange-700 rounded-lg shadow-[0_0_15px_rgba(249,115,22,0.4)] font-['Press_Start_2P'] text-[10px] hover:bg-orange-900 transition-colors flex items-center justify-center gap-2">
                            <Swords size={18} /> ENTER THE PROVING GROUNDS
                          </button>
                        ) : null
                      ) : status === 'pending' ? (
                        <div className="px-4 py-2 bg-yellow-900/30 text-yellow-500 rounded-lg border border-yellow-700 flex items-center justify-center gap-2 font-['VT323'] text-lg w-full h-full"><Clock size={18} /> PENDING</div>
                      ) : isGauntlet ? (
                        <div className="px-4 py-6 bg-stone-900 border-2 border-stone-700 rounded-lg text-stone-500 font-['Press_Start_2P'] text-center text-xs leading-loose h-full flex items-center justify-center">
                          The Gauntlet is sealed until tomorrow.
                        </div>
                      ) : status === 'failed' ? (
                        <div className="px-4 py-2 bg-red-900/30 text-red-500 rounded-lg border border-red-700 flex items-center justify-center gap-2 font-['VT323'] text-lg w-full h-full"><AlertTriangle size={18} /> FAILED</div>
                      ) : (
                        <div className="px-4 py-2 bg-green-900/30 text-green-500 rounded-lg border border-green-700 flex items-center justify-center gap-2 font-['VT323'] text-lg w-full h-full"><CheckCircle size={18} /> COMPLETED</div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
                  </div>
                </div>
              );
            })}
            </div>
          )}
        </div>
      </div>

      {showVictoryModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 font-['VT323']">
          <div className="bg-stone-900 border-2 border-yellow-500 rounded-lg p-8 text-center max-w-sm mx-auto">
            <h2 className="text-3xl text-yellow-500 mb-4 font-['Press_Start_2P']">QUEST COMPLETE</h2>
            <p className="text-xl text-white mb-4">{modalMessage}</p>
            <p className="text-lg text-stone-300 italic mb-6">"{modalQuote}"</p>
            <button onClick={() => setShowVictoryModal(false)} className="px-6 py-2 bg-yellow-600 text-black rounded-lg hover:bg-yellow-500 shadow-lg border-2 border-yellow-400 text-xl font-bold">Huzzah!</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestBoard;
