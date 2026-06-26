import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Coins, Star, Brain, Zap, AlertTriangle, Upload, Clock, BookText, MessageSquare, Swords, Palette, Heart, Wand } from 'lucide-react';
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
  const { quests, submitQuest, getQuestStatus, currentUser, attemptQuiz, attemptScenario, submitWellnessCheck, globalEffects, resolveVoidGrasp, recordGauntletFailure, submissions } = useGame();
  
  const fileInputRef = useRef(null);
  const selectedQuestRef = useRef(null);
  const [staticQuizAnswers, setStaticQuizAnswers] = useState({});
  const [activeQuizzes, setActiveQuizzes] = useState({});
  const [journalTexts, setJournalTexts] = useState({});
  const [stepTracker, setStepTracker] = useState({});

  const [activeMultiSteps, setActiveMultiSteps] = useState({});

  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalQuote, setModalQuote] = useState('');
  const [voidAnswer, setVoidAnswer] = useState('');
  const graspLock = globalEffects?.find(e => e.type === 'void_grasp' && e.target_id === currentUser?.id);
  const isLocked = !!graspLock;

  const [activeSessions, setActiveSessions] = useState({});
  const [sessionAnswers, setSessionAnswers] = useState({});
  const [activeScenarios, setActiveScenarios] = useState({});

  const MAP_BG = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/worldmap4.png";

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
    'blitz': { title: '⚡ The 60-Second Frenzy', desc: 'Answer as many questions as you can before time runs out! Every correct answer earns extra Gold & XP.' },
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
      <img src={MAP_BG} alt="Background Map" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/80"></div>

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

          {isLocked ? (
            <div className="bg-purple-900/80 border-4 border-purple-500 p-8 rounded-xl max-w-2xl mx-auto text-center shadow-[0_0_50px_rgba(168,85,247,0.5)]">
              <h1 className="text-4xl text-white font-['Press_Start_2P'] mb-6 animate-pulse">VOID BREACH DETECTED</h1>
              <p className="text-xl font-['VT323'] text-purple-200 mb-6">A dark magic has sealed your board! Solve the ancient equation to break the seal.</p>
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
                <motion.div key={quest.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`p-6 rounded-xl relative transition-all bg-black/70 backdrop-blur-sm border-y border-r border-white/10 border-l-4 ${getBorderColor()}`}>
                  <div className="flex justify-between items-start">
                    <div className="font-['VT323'] text-xl flex-grow">
                      <h3 className="text-2xl mb-2 flex items-center gap-2 text-white">
                        {getQuestIcon(quest)}
                        {quest.title}
                      </h3>
                      <p className="text-stone-300 mb-4 text-lg">{quest.description}</p>
                      <div className="flex gap-3 text-base"><span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded border border-blue-800">+{quest.xp} XP</span><span className="px-2 py-1 bg-yellow-900/50 text-yellow-300 rounded border border-yellow-800">+{quest.gold} Gold</span></div>
                    </div>
                    <div className="flex-shrink-0 w-1/2 ml-4">
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
                          !activeSession ? (
                            <div className="text-center py-4">
                              <p className="text-stone-400 mb-4">{quest.description}</p>
                              <button 
                                onClick={() => startMultiStep(quest)}
                                className="bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg border-2 border-yellow-500 animate-pulse"
                              >
                                AWAKEN THE HYDRA
                              </button>
                            </div>
                          ) : (
                            <div className="bg-red-900/20 p-4 rounded-lg border border-red-500/50">
                              <div className="text-xs font-mono text-red-300 mb-2 uppercase tracking-wider">
                                {quest.stepBank?.[activeSession.bankIndex]?.title}
                              </div>
                              <div className="flex justify-between text-xs font-mono text-red-400 mb-2">
                                <span>BATTLE IN PROGRESS</span>
                                <span>STEP {activeSession.stepIndex + 1} OF {quest.stepBank?.[activeSession.bankIndex]?.steps?.length}</span>
                              </div>
                              <p className="text-xl mb-4 text-white">
                                {quest.stepBank?.[activeSession.bankIndex]?.steps?.[activeSession.stepIndex]?.q}
                              </p>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="text" 
                                  placeholder="> answer" 
                                  value={staticQuizAnswers[quest.id] || ''} 
                                  onChange={(e) => handleStaticQuizAnswerChange(quest.id, e.target.value)} 
                                  className="bg-black/80 border border-stone-600 rounded-md p-2 w-full text-green-400 font-mono focus:ring-1 focus:ring-green-500" 
                                />
                                <button 
                                  onClick={() => handleMultiStepQuizSubmit(quest.id)} 
                                  className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 font-['VT323'] text-lg"
                                >
                                  Strike
                                </button>
                              </div>
                            </div>
                          )
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
                          <button 
                            onClick={() => navigate('/briefing/' + quest.id)} 
                            className={`w-full px-4 py-3 rounded-lg shadow-lg font-['Press_Start_2P'] text-[10px] text-white flex items-center justify-center gap-2 transition-colors ${
                              quest.id === 104 ? 'bg-gradient-to-r from-yellow-700 to-amber-600 hover:from-yellow-600 hover:to-amber-500' :
                              quest.id === 103 ? 'bg-gradient-to-r from-stone-800 to-stone-600 border border-stone-500 hover:from-stone-700 hover:to-stone-500' :
                              'bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-600 hover:to-cyan-500'
                            }`}
                          >
                            {quest.id === 104 ? <Star size={18} /> : <Zap size={18} />} 
                            {quest.id === 104 ? 'ENTER THE PALACE' : quest.id === 103 ? 'SEEK INSIGHT' : 'ENTER THE LABORATORY'}
                          </button>
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
