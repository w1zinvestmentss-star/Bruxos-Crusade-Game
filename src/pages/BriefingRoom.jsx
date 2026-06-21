import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useGame } from '../context/GameContext';

const THEMES = {
  journal: {
    bg: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/journal.briefingroom.png',
    npc: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/scribe_npc.png',
    dialogue: 'Welcome, Hero. To grow your power, we must chronicle your journey. Record your thoughts in your journal.'
  }
};

const BriefingRoom = () => {
  const navigate = useNavigate();
  const { questId } = useParams();
  const { quests, submitQuest } = useGame();
  const [isAccepted, setIsAccepted] = useState(false);
  const [journalText, setJournalText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const quest = quests.find(q => String(q.id) === String(questId));
  const theme = THEMES.journal;

  const handleAccept = () => {
    setIsAccepted(true);
  };

  const handleSubmit = async () => {
    if (!quest) return;
    if (journalText.trim() === '') {
      alert('Please write your reflection before submitting.');
      return;
    }

    await submitQuest(quest.id, journalText, 'journal');
    setIsSubmitted(true);
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
      <img src={theme.bg} alt="Journal briefing background" className="absolute inset-0 w-full h-full object-cover" />
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
                Your journal entry has been submitted for review.
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
