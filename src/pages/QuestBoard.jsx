import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Scroll, Upload, Clock, CheckCircle, Coins, Star, Brain } from 'lucide-react';
import { useGame } from '../context/GameContext';

const QuestBoard = () => {
  const navigate = useNavigate();
  const { quests, submitQuest, getQuestStatus, currentUser, attemptQuiz } = useGame();
  
  const fileInputRef = useRef(null);
  const selectedQuestRef = useRef(null);
  const [quizAnswers, setQuizAnswers] = useState({});

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && selectedQuestRef.current) {
      submitQuest(selectedQuestRef.current, file);
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
    alert(result.message);
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-200 p-6 relative">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileSelect}
      />

      <div className="flex justify-between items-center mb-8 max-w-4xl mx-auto z-10 relative">
        <button onClick={() => navigate('/student-dashboard')} className="flex items-center gap-2 text-stone-400 hover:text-white">
          <ArrowLeft size={20} /> Back to Map
        </button>
        <div className="flex gap-4 bg-black/50 p-2 rounded-lg border border-stone-700">
          <div className="flex items-center gap-2 text-yellow-400"><Coins size={16} /> {currentUser?.gold} G</div>
          <div className="flex items-center gap-2 text-blue-400"><Star size={16} /> {currentUser?.xp} XP</div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl text-yellow-500 mb-10 text-center" style={{ fontFamily: "'Press Start 2P', cursive" }}>
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
                className={`p-6 rounded-xl border-2 relative transition-all ${
                  status === 'approved' ? 'bg-stone-800/50 border-green-900 opacity-60' : 'bg-stone-800 border-stone-600'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-white">
                      {quest.type === 'quiz' ? <Brain size={20} /> : <Scroll size={20} />}
                      {quest.title}
                    </h3>
                    <p className="text-stone-400 mb-4">{quest.description}</p>
                    <div className="flex gap-3 text-sm font-mono">
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
                            placeholder="Type answer..."
                            value={quizAnswers[quest.id] || ''}
                            onChange={(e) => handleQuizAnswerChange(quest.id, e.target.value)}
                            className="bg-stone-900 border border-stone-600 rounded-md px-3 py-2 text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                          />
                          <button
                            onClick={() => handleQuizSubmit(quest.id)}
                            className="px-4 py-2 bg-yellow-600 text-black rounded-lg hover:bg-yellow-500 shadow-lg border-2 border-yellow-400 flex items-center gap-2"
                          >
                            Check Answer
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => triggerUpload(quest.id)}
                          className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-600 shadow-lg border-2 border-blue-400 flex items-center gap-2"
                        >
                          <Upload size={18} /> Submit Proof
                        </button>
                      )}
                    </>
                  )}
                  {status === 'pending' && (
                    <div className="px-4 py-2 bg-yellow-900/30 text-yellow-500 rounded-lg border border-yellow-700 flex items-center gap-2 font-mono">
                      <Clock size={18} /> Pending Review
                    </div>
                  )}
                  {status === 'approved' && (
                    <div className="px-4 py-2 bg-green-900/30 text-green-500 rounded-lg border border-green-700 flex items-center gap-2 font-mono">
                      <CheckCircle size={18} /> Completed
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuestBoard;