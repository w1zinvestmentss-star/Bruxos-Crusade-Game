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
  const { quests, submitQuest, getQuestStatus, currentUser, attemptQuiz, attemptScenario, submitWellnessCheck, globalEffects, resolveVoidGrasp } = useGame();
  
  const fileInputRef = useRef(null);
  const selectedQuestRef = useRef(null);
  const [staticQuizAnswers, setStaticQuizAnswers] = useState({});
  const [journalTexts, setJournalTexts] = useState({});
  const [stepTracker, setStepTracker] = useState({});

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

  useEffect(() => {
    const timerId = setInterval(() => {
      setActiveSessions(prev => {
        const updatedSessions = { ...prev };
        let changed = false;
        for (const questId in updatedSessions) {
          if (updatedSessions[questId].isActive && updatedSessions[questId].timeLeft > 0) {
            updatedSessions[questId].timeLeft -= 1;
            changed = true;
          }
        }
        return changed ? updatedSessions : prev;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

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

  const handleStaticQuizSubmit = async (questId) => {
    const answer = staticQuizAnswers[questId] || '';
    const result = await attemptQuiz(questId, answer);
    if (result.success) {
      triggerVictory(result.message);
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

  const handleMultiStepQuizSubmit = async (questId) => {
    const currentStepIndex = stepTracker[questId] || 0;
    const quest = quests.find(q => q.id === questId);
    const currentStep = quest.steps[currentStepIndex];
    const answer = staticQuizAnswers[questId] || '';
    const isLast = currentStepIndex === quest.steps.length - 1;

    const result = await attemptQuiz(questId, answer, currentStep.a, isLast);

    if (result.success) {
      if (!isLast) {
        setStepTracker(prev => ({ ...prev, [questId]: currentStepIndex + 1 }));
        alert('Good job! Keep going...');
        setStaticQuizAnswers(prev => ({ ...prev, [questId]: '' }));
      } else {
        triggerVictory(result.message);
      }
    } else {
      alert(result.message);
    }
  };

  const getQuestIcon = (quest) => {
    switch(quest.type) {
        case 'incantation': return <MessageSquare size={20} />;
        case 'quiz': return quest.questionBank?.length > 0 ? <Zap size={20} /> : <Brain size={20} />;
        case 'multi-step': return <BookText size={20} />;
        case 'scout-sports': return <Swords size={20} />;
        case 'scout-arts': return <Palette size={20} />;
        case 'wellness': return <Heart size={20} />;
        default: return <Brain size={20} />;
    }
  }

  const QUEST_CATEGORIES = {
    'upload': { title: 'The Paper Trail', desc: 'Submit physical homework and standard assignments for the Game Master to review.' },
    'quiz': { title: "The Scholar's Trial", desc: 'Auto-graded tests of knowledge. Answer correctly for instant rewards.' },
    'multi-step': { title: "The Hydra's Enigma", desc: 'Complex, multi-part problems. Solve them step-by-step.' },
    'scenario': { title: 'The Crossroads', desc: 'Read the situation and make the right choice to proceed.' },
    'cipher': { title: "The Sphinx's Riddles", desc: 'Decrypt anagrams and solve riddles to prove your wit.' },
    'incantation': { title: "The Scribe's Challenge", desc: 'Memorize the text and type it flawlessly before time runs out.' },
    'scout-sports': { title: 'Athletics & Training', desc: 'Real-world physical challenges. Upload proof of your feats of strength.' },
    'scout-arts': { title: "The Artisan's Canvas", desc: 'Creative missions. Upload your artwork, music, or creative projects.' },
    'wellness': { title: 'The Tavern Rest', desc: 'Take a moment to check in with the realm. How fares your spirit today?' },
    'journal': { title: "The Dreamer's Log", desc: 'Reflect on your journey and write down your thoughts.' }
  };

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
              const isTimedChallenge = (quest.type === 'quiz' || quest.type === 'incantation') && quest.questionBank?.length > 0;
              const isMultiStep = quest.type === 'multi-step';
              const isScenario = quest.type === 'scenario';
              const isUpload = ['upload', 'scout-sports', 'scout-arts'].includes(quest.type);
              const isWellness = quest.type === 'wellness';
              const session = activeSessions[quest.id];
              const currentAnswer = sessionAnswers[quest.id] || '';
              const currentScenario = activeScenarios[quest.id];
              const currentStepIndex = stepTracker[quest.id] || 0;
              const currentStep = isMultiStep ? quest.steps[currentStepIndex] : null;

              const getBorderColor = () => {
                if (status === 'approved' || status === 'read_only') return 'border-l-green-500 bg-green-900/40';
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
                        isTimedChallenge ? (
                           session?.isActive && session.timeLeft > 0 ? (
                             <div className="space-y-3">
                                {currentUser?.activeBuffs?.oath && (
                                  <div className="text-purple-400 font-['Press_Start_2P'] text-xs mb-2 animate-pulse text-center">OATH ACTIVE: 4x REWARDS / HALF TIME</div>
                                )}
                                <div className="text-center font-bold text-4xl text-red-500 font-mono">{session.timeLeft}s</div>
                               <p className={`text-lg text-center text-white transition-opacity duration-500 ${(quest.type === 'incantation' && currentAnswer.length > 0) ? 'opacity-0' : 'opacity-100'}`}>
                                   {session.currentQuestion.q}
                               </p>
                               <div className="flex items-center gap-2">
                                   <input 
                                       type="text" 
                                       value={currentAnswer}
                                       onChange={(e) => setSessionAnswers(p => ({...p, [quest.id]: e.target.value}))} 
                                       onKeyPress={(e) => e.key === 'Enter' && handleDynamicQuizSubmit(quest.id)} 
                                       onPaste={(e) => quest.type === 'incantation' && e.preventDefault()} 
                                       placeholder="> type here..."
                                       className="bg-black/80 border border-stone-600 rounded-md p-2 w-full text-green-400 font-mono focus:ring-1 focus:ring-green-500" 
                                       autoFocus 
                                   />
                                   <button onClick={() => handleDynamicQuizSubmit(quest.id)} className="px-3 py-2 bg-yellow-600 text-black rounded-lg hover:bg-yellow-500 font-['VT323'] text-lg">
                                       {quest.type === 'incantation' ? 'CAST' : 'CHECK'}
                                   </button>
                               </div>
                           </div>
                          ) : session?.isActive && session.timeLeft === 0 ? (
                            <div className="text-center"><div className="p-2 bg-red-900/50 text-red-400 rounded-lg flex items-center justify-center gap-2 font-bold"><AlertTriangle size={18}/>Time's Up!</div><button onClick={() => startDynamicQuiz(quest)} className="mt-2 w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 font-['Press_Start_2P'] text-xs">TRY AGAIN</button></div>
                          ) : (
                            <button onClick={() => startDynamicQuiz(quest)} className="w-full px-4 py-3 bg-gradient-to-r from-red-700 to-yellow-600 text-white rounded-lg shadow-lg font-['Press_Start_2P'] text-sm hover:from-red-600 hover:to-yellow-500 flex items-center justify-center gap-2">
                                <Zap size={18} /> {quest.type === 'incantation' ? 'START INCANTATION' : `START SPEED RUN (${quest.timeLimit}s)`}
                            </button>
                          )
                        ) : isMultiStep ? (
                          <div className="space-y-3">
                            <div className="text-sm text-stone-400">Step {currentStepIndex + 1} of {quest.steps.length}</div>
                            <div className="w-full bg-stone-700 rounded-full h-2.5"><div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${((currentStepIndex + 1) / quest.steps.length) * 100}%` }}></div></div>
                            <p className="text-lg text-white">{currentStep.q}</p>
                            <div className="flex items-center gap-2"><input type="text" placeholder="> answer" value={staticQuizAnswers[quest.id] || ''} onChange={(e) => handleStaticQuizAnswerChange(quest.id, e.target.value)} className="bg-black/80 border border-stone-600 rounded-md p-2 w-full text-green-400 font-mono focus:ring-1 focus:ring-green-500" /><button onClick={() => handleMultiStepQuizSubmit(quest.id)} className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 font-['VT323'] text-lg">CHECK STEP</button></div>
                          </div>
                        ) : quest.type === 'scenario' ? (
                            !currentScenario ? (
                                <button onClick={() => rollScenario(quest)} className="w-full px-4 py-3 bg-gradient-to-r from-orange-700 to-yellow-600 text-white rounded-lg shadow-lg font-['Press_Start_2P'] text-sm hover:from-orange-600 hover:to-yellow-500 flex items-center justify-center gap-2">Face a Scenario</button>
                            ) : (
                                <div>
                                    <p className="text-lg text-white mb-3">{currentScenario.q}</p>
                                    {currentScenario.options.map(option => (
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
                        ) : quest.type === 'quiz' ? (
                          <div className="flex items-center gap-2"><input type="text" placeholder="> enter solution..." value={staticQuizAnswers[quest.id] || ''} onChange={(e) => handleStaticQuizAnswerChange(quest.id, e.target.value)} className="bg-black/80 border border-stone-600 rounded-md p-2 w-full text-green-400 font-mono focus:ring-1 focus:ring-green-500" /><button onClick={() => handleStaticQuizSubmit(quest.id)} className="px-3 py-2 bg-yellow-600 text-black rounded-lg hover:bg-yellow-500 font-['VT323'] text-lg">EXECUTE</button></div>
                        ) : isWellness ? (
                            <div className="flex items-center justify-around gap-2">
                                <button onClick={() => handleWellnessSubmit(quest.id, 'Strong')} className="px-3 py-2 rounded-lg bg-green-900/50 text-green-400 hover:bg-green-800 font-bold">🟢 Strong</button>
                                <button onClick={() => handleWellnessSubmit(quest.id, 'Weary')} className="px-3 py-2 rounded-lg bg-yellow-900/50 text-yellow-400 hover:bg-yellow-800 font-bold">🟡 Weary</button>
                                <button onClick={() => handleWellnessSubmit(quest.id, 'Wounded')} className="px-3 py-2 rounded-lg bg-red-900/50 text-red-400 hover:bg-red-800 font-bold">🔴 Wounded</button>
                            </div>
                        ) : quest.type === 'journal' ? (
                          <div className="flex flex-col items-end gap-2"><textarea placeholder="Write your reflection..." value={journalTexts[quest.id] || ''} onChange={(e) => handleJournalTextChange(quest.id, e.target.value)} className="bg-black/80 border border-stone-600 rounded-md p-2 w-full h-24 text-stone-200 font-mono focus:ring-1 focus:ring-blue-500" /><button onClick={() => handleJournalSubmit(quest.id)} className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 font-['VT323'] text-xl"><Upload size={18} /> SUBMIT</button></div>
                        ) : isUpload ? (
                          <button onClick={() => triggerUpload(quest.id)} className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2 font-['VT323'] text-xl"><Upload size={18} /> SUBMIT PROOF</button>
                        ) : null
                      ) : status === 'pending' ? (
                        <div className="px-4 py-2 bg-yellow-900/30 text-yellow-500 rounded-lg border border-yellow-700 flex items-center justify-center gap-2 font-['VT323'] text-lg w-full h-full"><Clock size={18} /> PENDING</div>
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
