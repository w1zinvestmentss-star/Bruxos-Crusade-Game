import React, { useEffect, useState, useRef } from 'react';
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
  },
  upload: {
    bg: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Ravens.Roost.png',
    npc: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Messenger.Raven.png',
    title: 'The Aviary',
    dialogue: 'The flock is ready. Attach your parchment, and it shall be delivered swiftly to the Game Master for review.'
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
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [typedText, setTypedText] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTrialActive, setIsTrialActive] = useState(false);
  const [currentQ, setCurrentQ] = useState(null);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalQuote, setModalQuote] = useState('');

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
    setIsAccepted(true);
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
