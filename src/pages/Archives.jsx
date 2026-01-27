import React from 'react';
import { useGame } from '../context/GameContext';
import { Brain, Sparkle, BookOpen, Star, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Archives = () => {
  const { currentUser, submissions, quests, calculateScholarScore } = useGame();
  const navigate = useNavigate();

  if (!currentUser) {
    return (
      <div className="bg-stone-900 min-h-screen flex items-center justify-center text-stone-200">
        <p>No hero records found. Please log in.</p>
        <button onClick={() => navigate('/login')} className="ml-4 px-4 py-2 bg-stone-700 rounded hover:bg-stone-600">Login</button>
      </div>
    );
  }

  const { heroName, midtermGPA, finalGPA, xp, level } = currentUser;
  const scholarScore = calculateScholarScore(currentUser);
  const xpForNextLevel = (level + 1) * 1000;
  const xpProgress = (xp / xpForNextLevel) * 100;

  const approvedSubmissions = submissions.filter(s => s.studentId === currentUser.id && s.status === 'approved');

  return (
    <div className="bg-stone-900 min-h-screen text-stone-200 font-serif p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 text-sm text-stone-400 hover:text-white transition-colors">
          &larr; Back to Dashboard
        </button>

        <header className="text-center mb-10 border-b-2 border-stone-700 pb-4">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-wider">Hero Records: <span className="text-yellow-400">{heroName}</span></h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Section 1: Attributes */}
          <div className="bg-stone-800/50 p-6 rounded-lg border border-stone-700">
            <h2 className="text-2xl font-bold mb-6 flex items-center"><Award className="mr-3 text-yellow-500"/>Attributes</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-stone-900 rounded-md">
                <div className="flex items-center">
                  <Brain className="w-8 h-8 mr-4 text-blue-400"/>
                  <div>
                    <h3 className="text-lg font-semibold">Intellect</h3>
                    <p className="text-sm text-stone-400">Midterm Assessment</p>
                  </div>
                </div>
                <span className="text-3xl font-mono font-bold text-blue-300">{midtermGPA !== null ? midtermGPA : '---'}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-stone-900 rounded-md">
                <div className="flex items-center">
                  <Sparkle className="w-8 h-8 mr-4 text-purple-400"/>
                  <div>
                    <h3 className="text-lg font-semibold">Wisdom</h3>
                    <p className="text-sm text-stone-400">Final Assessment</p>
                  </div>
                </div>
                <span className="text-3xl font-mono font-bold text-purple-300">{finalGPA !== null ? finalGPA : '---'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Power Levels */}
          <div className="bg-stone-800/50 p-6 rounded-lg border border-stone-700">
            <h2 className="text-2xl font-bold mb-6 flex items-center"><Star className="mr-3 text-yellow-500"/>Power Levels</h2>
            <div className="space-y-5">
              <div className="text-center p-4 bg-stone-900 rounded-md">
                <h3 className="text-lg font-semibold text-stone-300">Total Mana (Scholar Score)</h3>
                <p className="text-5xl font-mono font-bold text-cyan-400 mt-2">{Math.floor(scholarScore)}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2 text-stone-300">XP Progress</h3>
                <div className="w-full bg-stone-700 rounded-full h-4 border-2 border-stone-600">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: `${xpProgress}%` }}></div>
                </div>
                <p className="text-right text-sm font-mono mt-1 text-stone-400">{xp} / {xpForNextLevel} XP</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Quest Log */}
        <div className="mt-10 bg-stone-800/50 p-6 rounded-lg border border-stone-700">
          <h2 className="text-2xl font-bold mb-6 flex items-center"><BookOpen className="mr-3 text-yellow-500"/>Completed Quest Log</h2>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {approvedSubmissions.length > 0 ? (
              approvedSubmissions.map(sub => {
                const quest = quests.find(q => q.id === sub.questId);
                return (
                  <div key={sub.id} className="bg-stone-900 p-3 rounded-md flex justify-between items-center transition-all hover:bg-stone-800">
                    <div>
                      <p className="font-semibold text-stone-300">{quest?.title || 'Unknown Quest'}</p>
                      <p className="text-xs text-stone-500">Completed: {sub.timestamp}</p>
                    </div>
                    <div className="text-sm font-mono text-green-400">
                      +{quest?.xp || 0} XP / +{quest?.gold || 0} G
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-stone-400 text-center py-4">No quests completed yet.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Archives;
