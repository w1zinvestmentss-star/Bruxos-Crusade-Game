import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
  }
};

const BriefingRoom = () => {
  const navigate = useNavigate();
  const { questId } = useParams();
  const { quests, submitQuest, attemptQuiz } = useGame();
  const quest = quests.find(q => String(q.id) === String(questId));
  const theme = quest ? (THEMES[quest.type] || THEMES.journal) : THEMES.journal;
  const isIncantation = quest?.type === 'incantation';
  const [isAccepted, setIsAccepted] = useState(false);
  const [journalText, setJournalText] = useState('');
  const [typedText, setTypedText] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(quest?.timeLimit || 45);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const startTrial = () => {
    if (!quest?.questionBank || quest.questionBank.length === 0) return;
    const randomIndex = Math.floor(Math.random() * quest.questionBank.length);
    setActiveStep(randomIndex);
    setTypedText('');
    setTimeLeft(quest.timeLimit || 45);
    setIsTrialActive(true);
  };

  const handleAccept = () => {
    setIsAccepted(true);
    if (isIncantation) {
      startTrial();
    }
  };

  const handleIncantationSubmit = () => {
    const targetAnswer = quest.questionBank[activeStep]?.a;
    if (!targetAnswer) return;

    const result = attemptQuiz(quest.id, typedText, targetAnswer, true);

    if (result.success) {
      alert(result.message);
      setIsTrialActive(false);
      setIsAccepted(false);
      setTypedText('');
    } else {
      alert(result.message);
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
    setIsSubmitted(true);
  };

  useEffect(() => {
    if (!isTrialActive) return;
    const timerId = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerId);
  }, [isTrialActive]);

  useEffect(() => {
    if (!isTrialActive || timeLeft > 0) return;
    setIsTrialActive(false);
    setTypedText('');
    alert('Time Expired!');
  }, [isTrialActive, timeLeft]);

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
          {!isSubmitted ? (
            !isAccepted ? (
              <div className="grid md:grid-cols-[0.85fr_1.15fr] gap-6 items-center">
                <div className="flex items-center justify-center">
                  <img src={theme.npc} alt="Scribe NPC" className="h-64 object-contain drop-shadow-[0_0_25px_rgba(234,179,8,0.35)]" />
                </div>
                <div>
                  <div className="text-yellow-400 font-['VT323'] text-lg mb-2">
                    {theme.title}
                  </div>
                  <h1 className="text-yellow-400 font-['Press_Start_2P'] text-2xl md:text-3xl mb-4">
                    {quest.title}
                  </h1>
                  <p className="font-['VT323'] text-2xl text-stone-200 leading-relaxed mb-8">
                    {theme.dialogue}
                  </p>
                  <button onClick={handleAccept} className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-yellow-600 to-yellow-400 text-stone-950 rounded-lg shadow-lg font-['Press_Start_2P'] text-sm md:text-base hover:from-yellow-500 hover:to-yellow-300 transition-colors">
                    ACCEPT MISSION
                  </button>
                </div>
              </div>
            ) : isIncantation ? (
              <div>
                <h1 className="text-yellow-400 font-['Press_Start_2P'] text-2xl md:text-3xl mb-4">
                  The Memory Spell
                </h1>
                {isTrialActive ? (
                  <div className="space-y-5">
                    <div className="text-center">
                      <div className="text-stone-400 font-['VT323'] text-lg mb-2">TIME REMAINING</div>
                      <div className={`text-5xl font-mono font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-cyan-400'}`}>
                        {timeLeft}s
                      </div>
                    </div>
                    <div className={`transition-opacity duration-300 ${typedText.length > 0 ? 'opacity-0' : 'opacity-100'}`}>
                      <p className="text-lg text-white font-mono text-center bg-black/50 p-3 rounded">
                        {quest.questionBank[activeStep]?.q}
                      </p>
                    </div>
                    <textarea
                      value={typedText}
                      onChange={(event) => setTypedText(event.target.value)}
                      onPaste={handlePasteBlock}
                      placeholder="Type the phrase from memory..."
                      className="w-full h-56 bg-stone-950/90 border-2 border-cyan-500/50 rounded-lg p-4 text-stone-100 font-['VT323'] text-xl focus:outline-none focus:border-cyan-300 resize-none"
                    />
                    <button onClick={handleIncantationSubmit} className="w-full px-8 py-4 bg-gradient-to-r from-red-800 to-yellow-600 text-white rounded-lg shadow-lg font-['Press_Start_2P'] text-sm md:text-base hover:from-red-700 hover:to-yellow-500 transition-colors">
                      SUBMIT STRIKE
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="font-['VT323'] text-xl text-stone-300 mb-6">The memory trial has ended. Start a new attempt or return to the Quest Board.</p>
                    <button onClick={startTrial} className="w-full px-8 py-4 bg-gradient-to-r from-cyan-800 to-yellow-600 text-white rounded-lg shadow-lg font-['Press_Start_2P'] text-sm md:text-base hover:from-cyan-700 hover:to-yellow-500 transition-colors">
                      RETRY MEMORY SPELL
                    </button>
                  </div>
                )}
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
            )
          ) : (
            <div className="text-center">
              <h1 className="text-green-400 font-['Press_Start_2P'] text-3xl md:text-4xl mb-6">
                MISSION COMPLETE
              </h1>
              <p className="font-['VT323'] text-2xl text-stone-200 mb-8">
                {isIncantation ? 'Your incantation has been submitted for review.' : 'Your journal entry has been submitted for review.'}
              </p>
              <button onClick={() => navigate('/quests')} className="w-full px-8 py-4 bg-gradient-to-r from-green-700 to-green-500 text-white rounded-lg shadow-lg font-['Press_Start_2P'] text-sm md:text-base hover:from-green-600 hover:to-green-400 transition-colors">
                RETURN TO KINGDOM
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BriefingRoom;
