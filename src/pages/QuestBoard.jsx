import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Scroll, Upload, Clock, CheckCircle, Coins, Star, Brain } from 'lucide-react';
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
  const { quests, submitQuest, getQuestStatus, currentUser, attemptQuiz } = useGame();
  
  const fileInputRef = useRef(null);
  const selectedQuestRef = useRef(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalQuote, setModalQuote] = useState('');

  const MAP_BG = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/worldmap4.png";

  const triggerVictory = (message) => {
    const randomQuote = VICTORY_QUOTES[Math.floor(Math.random() * VICTORY_QUOTES.length)];
    setModalMessage(message);
    setModalQuote(randomQuote);
    setShowModal(true);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && selectedQuestRef.current) {
      submitQuest(selectedQuestRef.current, file);
      alert('Proof Submitted! Awaiting Teacher Review.');
    }
  };

  const triggerUpload = (questId) => {
    selectedQuestRef.current = questId;
    fileInputRef.current.click();
  };

  const handleQuizAnswerChange = (questId, answer) => {
    setQuizAnswers(prev => ({ ...prev, [questId]: answer }));
  };

  const handleQuizSubmit = async (questId) => {
    const answer = quizAnswers[questId] || '';
    const result = await attemptQuiz(questId, answer);
    if (result.success) {
      triggerVictory(result.message);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="min-h-screen text-stone-200 p-6 relative">
      <img src={MAP_BG} alt="Background Map" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/80"></div>

      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileSelect}
      />

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-8 max-w-4xl mx-auto">
          <button onClick={() => navigate('/student-dashboard')} className="flex items-center gap-2 text-stone-300 hover:text-white font-['Press_Start_2P'] text-xs">
            <ArrowLeft size={16} /> BACK
          </button>
          <div className="flex gap-4 bg-black/60 backdrop-blur-sm p-2 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 text-yellow-400 font-['VT323'] text-xl"><Coins size={16} /> {currentUser?.gold} G</div>
            <div className="flex items-center gap-2 text-blue-400 font-['VT323'] text-xl"><Star size={16} /> {currentUser?.xp} XP</div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl text-yellow-400 mb-10 text-center font-['Press_Start_2P']">
            QUEST BOARD
          </h1>

          <div className="grid gap-4">
            {quests.map((quest) => {
              const status = getQuestStatus(quest.id);

              return (
                <motion.div 
                  key={quest.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-6 rounded-xl relative transition-all bg-black/70 backdrop-blur-sm border-y border-r border-white/10 ${
                    status === 'approved' ? 'border-l-4 border-l-green-500 bg-green-900/40' : 'border-l-4 border-l-blue-500'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="font-['VT323'] text-xl">
                      <h3 className="text-2xl mb-2 flex items-center gap-2 text-white">
                        {quest.type === 'quiz' ? <Brain size={20} /> : <Scroll size={20} />}
                        {quest.title}
                      </h3>
                      <p className="text-stone-300 mb-4 text-lg">{quest.description}</p>
                      <div className="flex gap-3 text-base">
                        <span className="px-2 py-1 bg-blue-900/50 text-blue-300 rounded border border-blue-800">+{quest.xp} XP</span>
                        <span className="px-2 py-1 bg-yellow-900/50 text-yellow-300 rounded border border-yellow-800">+{quest.gold} Gold</span>
                      </div>
                    </div>

                    {status === 'available' && (
                      <>
                        {quest.type === 'quiz' ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder="> enter solution..."
                              value={quizAnswers[quest.id] || ''}
                              onChange={(e) => handleQuizAnswerChange(quest.id, e.target.value)}
                              className="bg-black/80 border border-stone-600 rounded-md p-2 w-48 text-green-400 font-mono placeholder-green-800 focus:outline-none focus:ring-1 focus:ring-green-500"
                            />
                            <button
                              onClick={() => handleQuizSubmit(quest.id)}
                              className="px-3 py-2 bg-yellow-600 text-black rounded-lg hover:bg-yellow-500 shadow-lg font-['VT323'] text-lg"
                            >
                              EXECUTE
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => triggerUpload(quest.id)}
                            className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 shadow-lg flex items-center gap-2 font-['VT323'] text-xl"
                          >
                            <Upload size={18} /> SUBMIT
                          </button>
                        )}
                      </>
                    )}
                    {status === 'pending' && (
                      <div className="px-4 py-2 bg-yellow-900/30 text-yellow-500 rounded-lg border border-yellow-700 flex items-center gap-2 font-['VT323'] text-lg">
                        <Clock size={18} /> PENDING
                      </div>
                    )}
                    {status === 'approved' && (
                      <div className="px-4 py-2 bg-green-900/30 text-green-500 rounded-lg border border-green-700 flex items-center gap-2 font-['VT323'] text-lg">
                        <CheckCircle size={18} /> COMPLETED
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 font-['VT323']">
          <div className="bg-stone-900 border-2 border-yellow-500 rounded-lg p-8 text-center max-w-sm mx-auto">
            <h2 className="text-3xl text-yellow-500 mb-4 font-['Press_Start_2P']">QUEST COMPLETE</h2>
            <p className="text-xl text-white mb-4">{modalMessage}</p>
            <p className="text-lg text-stone-300 italic mb-6">"{modalQuote}"</p>
            <button
              onClick={() => setShowModal(false)}
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

export default QuestBoard;
