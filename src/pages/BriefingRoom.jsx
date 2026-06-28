import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';

const THEMES = {
  journal: {
    bg: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/journal.briefingroom.png',
    npc: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/scribe_npc.png',
    title: 'Journal Briefing',
    dialogue: 'Welcome, Hero. To grow your power, we must chronicle your journey. Record your thoughts in your journal.'
  },
  incantation: { 
    bg: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Haunted.Scriptorium.png', 
    npc: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Spectral.Scribe.png',
    title: "The Scribe's Sanctum",
    dialogue: "Halt, traveler. You seek to master the ancient incantations? Prove your memory is as swift as your mind." 
  },
  upload: {
    bg: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Ravens.Roost.png',
    npc: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Messenger.Raven.png',
    title: 'The Aviary',
    dialogue: 'The flock is ready. Attach your parchment, and it shall be delivered swiftly to the Game Master for review.'
  },
  gauntlet: {
    bg: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Shadow.Dojo.png',
    npc: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Shadow.Master.png',
    title: 'The Shadow Dojo',
    dialogue: 'Speed and precision are the marks of a true master. You have 7 seconds per strike. Do not falter.'
  },
  103: {
    bg: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Hunters.Archives.png',
    npc: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Insight.Hunter.png',
    title: "The Hunter's Archives",
    dialogue: "Insight is gained through speed and logic. Prove your worth before the nightmare claims you. You have 60 seconds."
  },
  104: {
    bg: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Sunken.Palace.png',
    npc: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Time-Weaver.png',
    title: "The Sunken Palace",
    dialogue: "The sands of time hide many truths. Peer into the past and recount the history of the realm."
  },
  blitz: {
    bg: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Alchemists.Lab.png',
    npc: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Mad.Alchemist.png',
    title: "The Alchemist's Lab",
    dialogue: 'Time is of the essence! Answer quickly and accurately to synthesize the ultimate reward. You have 60 seconds.'
  },
  112: {
    bg: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Alchemists.Lab.png',
    npc: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Mad.Alchemist.png',
    title: 'The Grand Observatory',
    dialogue: 'The laws of nature await your discovery. Answer swiftly to uncover the truth of the realm. You have 60 seconds.'
  },
  'scout-arts': {
    bg: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Grand.Studio.png',
    npc: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Master.Artisan.png',
    title: 'The Artisan\'s Studio',
    dialogue: 'True power requires creation, not just destruction. Show me your masterpiece. Ensure your work captures the essence of the realm.'
  },
  'scout-sports': {
    bg: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Proving.Grounds.png',
    npc: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Drillmaster.png',
    title: 'The Proving Grounds',
    dialogue: 'Words will not save you in battle. Only strength and endurance. Show me proof of your physical training, recruit!'
  }
};

const BriefingRoom = () => {
  const navigate = useNavigate();
  const { questId } = useParams();
  const { quests, submitQuest, attemptQuiz, recordGauntletFailure, attemptBlitz, getHighScore } = useGame();
  const quest = quests.find(q => String(q.id) === String(questId));
  const currentTheme = quest ? (THEMES[quest.id] || THEMES[quest.type] || THEMES.journal) : THEMES.journal;
  const theme = currentTheme;
  const isIncantation = quest?.type === 'incantation';
  const isGauntlet = quest?.type === 'gauntlet';
  const [isAccepted, setIsAccepted] = useState(false);
  const [journalText, setJournalText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [typedText, setTypedText] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [currentQ, setCurrentQ] = useState(null);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalQuote, setModalQuote] = useState('');

  const [gauntletStep, setGauntletStep] = useState(0);
  const [gauntletTimer, setGauntletTimer] = useState(70);
  const [gauntletQuestion, setGauntletQuestion] = useState(null);
  const [gauntletAnswer, setGauntletAnswer] = useState('');
  const [activeBlitz, setActiveBlitz] = useState(null);
  const [blitzInput, setBlitzInput] = useState('');

  const VICTORY_QUOTES = [
    'Your mind is as sharp as a sword!',
    'A legendary feat!',
    'The Kingdom grows stronger with your knowledge.',
    'Knowledge is the ultimate weapon!',
    'Another victory for the Archives!',
  ];

  const triggerVictory = (message) => {
    const randomQuote = VICTORY_QUOTES[Math.floor(Math.random() * VICTORY_QUOTES.length)];
    setModalMessage(message);
    setModalQuote(randomQuote);
    setShowVictoryModal(true);
  };

  const startTrial = () => {
    if (!quest?.questionBank || quest.questionBank.length === 0) return;
    const randomIndex = Math.floor(Math.random() * quest.questionBank.length);
    setCurrentQ(quest.questionBank[randomIndex]);
    setTypedText('');
    setTimeLeft(quest.timeLimit || 45);
    setIsTrialActive(true);
  };

  const handleAccept = () => {
    if (quest?.type === 'gauntlet') {
      setGauntletStep(0);
      setGauntletTimer(70);
      setGauntletQuestion(generateGauntletMath());
      setGauntletAnswer('');
    }
    if (quest?.type === 'blitz') {
      const randomQ = quest.questionBank[Math.floor(Math.random() * quest.questionBank.length)];
      setActiveBlitz({ isActive: true, timeLeft: 60, score: 0, currentQ: randomQ });
    }
    setIsAccepted(true);
  };

  const generateGauntletMath = () => {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b;
    if (op === '+') { a = Math.floor(Math.random() * 20); b = Math.floor(Math.random() * 20); }
    else if (op === '-') { a = Math.floor(Math.random() * 20) + 10; b = Math.floor(Math.random() * a); }
    else { a = Math.floor(Math.random() * 10); b = Math.floor(Math.random() * 10); }
    return { q: `Solve: ${a} ${op} ${b}`, a: eval(`${a} ${op} ${b}`).toString() };
  };

  const handleGauntletSubmit = async () => {
    if (gauntletAnswer.trim() === gauntletQuestion.a.trim()) {
      if (gauntletStep < 4) {
        setGauntletStep(prev => prev + 1);
        setGauntletTimer(70);
        setGauntletQuestion(generateGauntletMath());
        setGauntletAnswer('');
      } else {
        const result = await attemptQuiz(quest.id, 'correct', 'correct', true);
        if (result.success) triggerVictory(result.message);
      }
    } else {
      recordGauntletFailure(quest.id);
      alert('TRIAL FAILED: INCORRECT ANSWER');
      navigate('/quests');
    }
  };

  const handleIncantationSubmit = async () => {
    if (!currentQ) return;
    const result = await attemptQuiz(quest.id, typedText, currentQ.a, true);
    if (result.success) {
      triggerVictory(result.message);
    } else {
      alert('Incorrect! Keep trying!');
      setTypedText('');
    }
  };

  const handlePasteBlock = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async () => {
    if (!quest) return;
    if (journalText.trim() === '') {
      alert('Please complete this task before submitting.');
      return;
    }
    await submitQuest(quest.id, journalText, quest.type);
    triggerVictory('Journal entry submitted! +XP and Gold awarded.');
  };

  useEffect(() => {
    let interval;
    if (isTrialActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (isTrialActive && timeLeft <= 0) {
      setIsTrialActive(false);
      alert('Time expired! The spell fizzled.');
    }
    return () => clearInterval(interval);
  }, [isTrialActive, timeLeft]);

  useEffect(() => {
    let timerId;
    if (isAccepted && quest?.type === 'gauntlet' && gauntletTimer > 0) {
      timerId = setInterval(() => {
        setGauntletTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerId);
            recordGauntletFailure(quest.id);
            alert('TRIAL FAILED: TIME EXPIRED');
            navigate('/quests');
            return 0;
          }
          return prev - 1;
        });
      }, 100);
    }
    return () => clearInterval(timerId);
  }, [isAccepted, quest, gauntletTimer]);

  useEffect(() => {
    let timerId;
    if (isAccepted && quest?.type === 'blitz' && activeBlitz?.timeLeft > 0) {
      timerId = setInterval(() => {
        setActiveBlitz(prev => {
          if (prev.timeLeft <= 1) {
            clearInterval(timerId);
            attemptBlitz(quest.id, prev.score).then(res => {
              if(res.success) {
                triggerVictory(res.message);
              } else {
                alert(res.message);
                setIsAccepted(false);
                setActiveBlitz(null);
              }
            });
            return { ...prev, timeLeft: 0 };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isAccepted, quest, activeBlitz?.timeLeft]);

  const handleBlitzSubmit = (selectedOption = null) => {
    if (!activeBlitz) return;

    const answerToCheck = selectedOption !== null ? selectedOption : blitzInput;
    const isCorrect = answerToCheck.toString().trim().toLowerCase() === activeBlitz.currentQ.a.toString().trim().toLowerCase();

    const randomQ = quest.questionBank[Math.floor(Math.random() * quest.questionBank.length)];

    if (isCorrect) {
      setActiveBlitz(prev => ({ ...prev, score: prev.score + 1, currentQ: randomQ }));
    } else {
      setActiveBlitz(prev => ({ ...prev, currentQ: randomQ }));
    }

    setBlitzInput('');
  };

  const handleBlitzPass = () => {
    if (!activeBlitz) return;
    const randomQ = quest.questionBank[Math.floor(Math.random() * quest.questionBank.length)];
    setActiveBlitz(prev => ({ ...prev, currentQ: randomQ }));
    setBlitzInput('');
  };

  if (!quest) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-black text-stone-100">
        <img src={theme.bg} alt="Briefing background" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/80" />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <div className="bg-black/75 backdrop-blur-md p-8 rounded-2xl border-2 border-yellow-500/30 max-w-2xl w-full text-center">
            <h1 className="text-yellow-400 font-['Press_Start_2P'] text-2xl mb-4">MISSION NOT FOUND</h1>
            <p className="text-stone-300 font-['VT323'] text-xl mb-6">This journal quest could not be found.</p>
            <button onClick={() => navigate('/quests')} className="w-full bg-yellow-500 text-stone-950 font-['Press_Start_2P'] py-3 rounded hover:bg-yellow-400">
              RETURN TO KINGDOM
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-stone-100">
      <img src={theme.bg} alt={`${theme.title} background`} className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 min-h-screen p-4 md:p-8">
        <button onClick={() => navigate('/quests')} className="mb-6 flex items-center gap-2 text-yellow-400 hover:text-yellow-200 font-['Press_Start_2P'] text-xs">
          <ArrowLeft size={18} /> RETURN TO KINGDOM
        </button>

        <div className="bg-black/75 backdrop-blur-md p-8 rounded-2xl border-2 border-yellow-500/30 max-w-2xl mx-auto mt-20">
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*,.pdf,.doc,.docx,.txt" capture="environment" onChange={(e) => setSelectedFile(e.target.files[0])} />
          {!isAccepted ? (
            <div className="flex flex-col md:flex-row items-center gap-8 w-full">
              <div className="flex items-center justify-center">
                <img src={theme.npc} alt="Scribe NPC" className="h-64 object-contain drop-shadow-[0_0_25px_rgba(234,179,8,0.35)]" />
              </div>
              <div className="flex flex-col justify-center gap-6 flex-1 w-full">
                <div>
                  <h3 className="text-yellow-500 font-['Press_Start_2P'] text-[10px] uppercase mb-2 opacity-80">{currentTheme.title}</h3>
                  <h2 className="text-3xl md:text-4xl text-yellow-400 font-['Press_Start_2P'] mb-4 leading-tight">{quest.title}</h2>
                  <p className="font-['VT323'] text-2xl text-stone-200 leading-relaxed tracking-wide">
                    "{currentTheme.dialogue}"
                  </p>
                </div>

                {quest.type === 'blitz' && (
                  <div className="bg-black/60 border border-yellow-500/30 rounded-xl p-4 text-center shadow-inner">
                    <div className="text-yellow-500/80 font-['Press_Start_2P'] text-[10px] uppercase tracking-widest mb-3">👑 Current Record</div>
                    {getHighScore(quest.id) ? (
                      <div className="text-2xl text-white font-['VT323']">
                        <span className="text-3xl text-yellow-400 mr-2">{getHighScore(quest.id).score}</span> 
                        points by <span className="text-cyan-300 ml-1">{getHighScore(quest.id).player}</span>
                      </div>
                    ) : (
                      <div className="text-xl text-stone-500 font-['VT323'] italic">The record is unclaimed.</div>
                    )}
                  </div>
                )}

                <button 
                  onClick={handleAccept} 
                  className="w-full py-4 bg-gradient-to-r from-yellow-700 to-yellow-600 hover:from-yellow-500 hover:to-yellow-400 text-black font-bold font-['Press_Start_2P'] text-sm rounded-lg border-2 border-yellow-400 shadow-[0_0_20px_rgba(202,138,4,0.4)] transition-all duration-300"
                >
                  ACCEPT MISSION
                </button>
              </div>
            </div>
          ) : isIncantation ? (
            !isTrialActive ? (
              <div className="text-center">
                <h1 className="text-yellow-400 font-['Press_Start_2P'] text-2xl md:text-3xl mb-4">
                  The Memory Spell
                </h1>
                <p className="font-['VT323'] text-xl text-stone-300 mb-6">
                  Memorize the ancient text and cast it flawlessly before time runs out.
                </p>
                <button onClick={startTrial} className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-cyan-800 to-blue-700 text-cyan-200 rounded-lg shadow-lg font-['Press_Start_2P'] text-sm md:text-base hover:from-cyan-700 hover:to-blue-600 transition-colors">
                  START TRIAL
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center w-full">
                <div className="text-4xl text-red-500 font-mono text-center mb-4">{timeLeft}s</div>
                <div className={`text-xl text-cyan-300 font-mono mb-4 text-center transition-opacity duration-300 ${typedText.length > 0 ? 'opacity-0' : 'opacity-100'}`}>
                  {currentQ?.q}
                </div>
                <textarea 
                  value={typedText} 
                  onChange={e => setTypedText(e.target.value)} 
                  onPaste={e => e.preventDefault()} 
                  className="w-full bg-black/80 border-2 border-cyan-500 rounded-lg p-4 text-white font-mono h-32 focus:outline-none focus:ring-2 focus:ring-cyan-300 resize-none mb-4" 
                  placeholder="Type the incantation perfectly..." 
                />
                <button 
                  onClick={handleIncantationSubmit} 
                  className="px-6 py-3 bg-cyan-700 text-white rounded-lg hover:bg-cyan-600 font-['Press_Start_2P'] text-sm"
                >
                  CAST SPELL
                </button>
              </div>
            )
          ) : isGauntlet ? (
            <div className="relative p-6 w-full bg-black/90 rounded-lg border-2 border-red-600 shadow-[0_0_30px_rgba(220,38,38,0.8)] animate-pulse">
              <h4 className="text-red-500 font-['Press_Start_2P'] text-center mb-4 text-sm">CHALLENGE {gauntletStep + 1} OF 5</h4>
              <div className="text-7xl text-red-600 font-mono text-center font-bold mb-6 drop-shadow-[0_0_15px_rgba(220,38,38,0.9)]">{(gauntletTimer / 10).toFixed(1)}s</div>
              <p className="text-3xl text-white text-center font-mono mb-6">{gauntletQuestion?.q}</p>
              <div className="flex gap-4">
                <input type="text" value={gauntletAnswer} onChange={(e) => setGauntletAnswer(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleGauntletSubmit()} autoFocus className="w-full bg-black border-2 border-red-500 text-red-400 font-mono text-3xl p-4 rounded text-center focus:outline-none focus:ring-4 focus:ring-red-600" />
                <button onClick={handleGauntletSubmit} className="px-8 py-4 bg-red-700 text-white font-bold font-['Press_Start_2P'] text-lg rounded hover:bg-red-600 transition-colors">STRIKE</button>
              </div>
            </div>
          ) : quest.type === 'blitz' && activeBlitz ? (
            <div className="relative p-6 w-full bg-black/90 rounded-lg border-2 border-cyan-600 shadow-[0_0_30px_rgba(6,182,212,0.6)]">
              <div className="flex justify-between items-center mb-4">
                <div className={`text-5xl font-mono font-bold ${activeBlitz.timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>{activeBlitz.timeLeft}s</div>
                <div className="text-yellow-400 font-['Press_Start_2P'] text-xl">Score: {activeBlitz.score}</div>
              </div>
              <p className="text-3xl text-white text-center font-mono mb-6 bg-stone-900 p-4 rounded-lg border border-stone-700">{activeBlitz.currentQ?.q}</p>
              {activeBlitz.currentQ?.options ? (
                <div className="flex flex-col gap-3 mb-4 w-full">
                  {activeBlitz.currentQ.options.map((opt, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => handleBlitzSubmit(opt)}
                      className="w-full text-left p-4 bg-black/80 border-2 border-cyan-700 rounded hover:bg-stone-700 hover:border-cyan-400 transition-colors text-white font-mono text-xl md:text-2xl"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <input type="text" value={blitzInput} onChange={(e) => setBlitzInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleBlitzSubmit(); }} autoFocus className="w-full bg-black border-2 border-cyan-500 text-cyan-400 font-mono text-3xl p-4 rounded text-center focus:outline-none focus:ring-4 focus:ring-cyan-600 mb-4" placeholder="> Enter answer..." />
                  <div className="flex gap-4">
                    <button onClick={() => handleBlitzSubmit()} className="flex-1 px-4 py-4 bg-cyan-700 text-white font-bold font-['Press_Start_2P'] text-sm rounded hover:bg-cyan-600 transition-colors">SUBMIT</button>
                    <button onClick={handleBlitzPass} className="flex-1 px-4 py-4 bg-stone-700 text-white font-bold font-['Press_Start_2P'] text-sm rounded hover:bg-stone-600 transition-colors">PASS</button>
                  </div>
                </>
              )}
            </div>
          ) : quest.type === 'upload' ? (
            <div className="flex flex-col items-center w-full gap-4">
              <button onClick={() => fileInputRef.current.click()} className="px-6 py-4 bg-stone-800 border-2 border-dashed border-stone-500 text-stone-300 rounded-lg hover:bg-stone-700 hover:text-white font-['VT323'] text-2xl w-full transition-colors truncate">
                {selectedFile ? selectedFile.name : '+ ATTACH PARCHMENT'}
              </button>
              <button 
                onClick={() => {
                  if (!selectedFile) return alert('Please attach a parchment first!');
                  submitQuest(quest.id, selectedFile, 'upload');
                  triggerVictory('The Raven takes flight! Your work has been dispatched for review.');
                }} 
                className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-600 font-['Press_Start_2P'] text-sm w-full mt-4"
              >
                SEND MESSENGER
              </button>
            </div>
          ) : quest.type === 'scout-arts' ? (
            <div className="flex flex-col items-center w-full gap-4">
              <button onClick={() => fileInputRef.current.click()} className="px-6 py-4 bg-stone-800 border-2 border-dashed border-pink-500 text-pink-300 rounded-lg hover:bg-stone-700 hover:text-white font-['VT323'] text-2xl w-full transition-colors truncate">
                {selectedFile ? selectedFile.name : '+ UPLOAD MASTERPIECE'}
              </button>
              <button 
                onClick={() => {
                  if (!selectedFile) return alert('Please attach your masterpiece first!');
                  submitQuest(quest.id, selectedFile, 'scout-arts');
                  triggerVictory('Masterpiece submitted! Awaiting the Game Master\'s critique.');
                }} 
                className="px-6 py-3 bg-pink-700 text-white rounded-lg hover:bg-pink-600 font-['Press_Start_2P'] text-sm w-full mt-4 shadow-[0_0_15px_rgba(236,72,153,0.6)]"
              >
                PRESENT ARTWORK
              </button>
            </div>
          ) : quest.type === 'scout-sports' ? (
            <div className="flex flex-col items-center w-full gap-4">
              <button onClick={() => fileInputRef.current.click()} className="px-6 py-4 bg-stone-800 border-2 border-dashed border-orange-500 text-orange-300 rounded-lg hover:bg-stone-700 hover:text-white font-['VT323'] text-2xl w-full transition-colors truncate">
                {selectedFile ? selectedFile.name : '+ UPLOAD TRAINING PROOF'}
              </button>
              <button 
                onClick={() => {
                  if (!selectedFile) return alert('Please attach proof of your training first!');
                  submitQuest(quest.id, selectedFile, 'scout-sports');
                  triggerVictory('Training report submitted! The Drillmaster will evaluate your effort.');
                }} 
                className="px-6 py-3 bg-orange-700 text-white rounded-lg hover:bg-orange-600 font-['Press_Start_2P'] text-sm w-full mt-4 shadow-[0_0_15px_rgba(249,115,22,0.6)]"
              >
                PRESENT REPORT
              </button>
            </div>
          ) : (
            <div>
              <h1 className="text-yellow-400 font-['Press_Start_2P'] text-2xl md:text-3xl mb-4">
                Record Your Journey
              </h1>
              <p className="font-['VT323'] text-xl text-stone-300 mb-6">
                Write your reflection, then submit it for Game Master review.
              </p>
              <textarea
                value={journalText}
                onChange={(event) => setJournalText(event.target.value)}
                placeholder="Write your journal entry here..."
                className="w-full h-56 bg-stone-950/90 border-2 border-yellow-500/40 rounded-lg p-4 text-stone-100 font-['VT323'] text-xl focus:outline-none focus:border-yellow-300 resize-none"
              />
              <button onClick={handleSubmit} className="mt-6 w-full px-8 py-4 bg-gradient-to-r from-red-800 to-yellow-600 text-white rounded-lg shadow-lg font-['Press_Start_2P'] text-sm md:text-base hover:from-red-700 hover:to-yellow-500 transition-colors">
                SUBMIT ENTRY
              </button>
            </div>
          )}
        </div>
      </div>
      {showVictoryModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[200] font-['VT323']">
          <div className="bg-stone-900 border-2 border-yellow-500 rounded-lg p-8 text-center max-w-sm mx-auto shadow-[0_0_30px_rgba(234,179,8,0.3)]">
            <h2 className="text-3xl text-yellow-500 mb-4 font-['Press_Start_2P']">QUEST COMPLETE</h2>
            <p className="text-xl text-white mb-4">{modalMessage}</p>
            <p className="text-lg text-stone-300 italic mb-6">"{modalQuote}"</p>
            <button 
              onClick={() => {
                setShowVictoryModal(false);
                navigate('/quests');
              }} 
              className="px-6 py-2 bg-yellow-600 text-black rounded-lg hover:bg-yellow-500 shadow-lg border-2 border-yellow-400 text-xl font-bold"
            >
              Huzzah!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BriefingRoom;