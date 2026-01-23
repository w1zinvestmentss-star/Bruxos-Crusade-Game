import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Check, Search, Image as ImageIcon } from 'lucide-react';
import { useGame } from '../context/GameContext';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const { submissions, quests, createQuest, approveSubmission, setUserRole } = useGame();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newQuest, setNewQuest] = useState({ title: '', description: '', xp: 50, gold: 20 });

  const handleCreate = (e) => {
    e.preventDefault();
    createQuest(newQuest);
    setShowCreateForm(false);
    setNewQuest({ title: '', description: '', xp: 50, gold: 20 });
  };

  const handleLogout = () => {
    setUserRole(null);
    navigate('/');
  };

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans">
      
      {/* Navbar */}
      <div className="bg-red-900 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "'Press Start 2P', cursive" }}>
          <span className="text-yellow-400">👑</span> GAME MASTER
        </h1>
        <button onClick={handleLogout} className="flex items-center gap-2 hover:text-red-200">
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* LEFT COLUMN: INBOX */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-stone-800">
            <Search className="text-blue-600" /> Pending Approvals ({pendingSubmissions.length})
          </h2>
          
          <div className="space-y-4">
            {pendingSubmissions.length === 0 ? (
              <div className="p-8 bg-white rounded-xl shadow border border-stone-200 text-center text-stone-400 italic">
                No submissions waiting.
              </div>
            ) : (
              pendingSubmissions.map(sub => {
                const questDetails = quests.find(q => q.id === sub.questId);
                return (
                  <div key={sub.id} className="bg-white p-4 rounded-xl shadow-md border-l-4 border-blue-500">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-stone-800">{questDetails?.title}</h3>
                        <p className="text-sm text-stone-500">Student: <span className="font-bold text-blue-600">{sub.studentName}</span></p>
                      </div>
                      <button 
                        onClick={() => approveSubmission(sub.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow flex items-center gap-2 font-bold text-sm"
                      >
                        <Check size={16} /> APPROVE
                      </button>
                    </div>

                    <div className="bg-stone-100 rounded-lg p-2 border border-stone-200">
                      <p className="text-xs font-bold text-stone-500 mb-2 flex items-center gap-1">
                        <ImageIcon size={12} /> PROOF OF WORK:
                      </p>
                      {sub.proofImage ? (
                        <img src={sub.proofImage} alt="Proof" className="w-full h-48 object-cover rounded border border-stone-300" />
                      ) : (
                        <div className="h-20 flex items-center justify-center text-stone-400 text-sm">No image attached</div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: CREATE QUEST */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-stone-800">Active Quests</h2>
            <button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-stone-800 text-white px-3 py-1 rounded hover:bg-black flex items-center gap-2 text-sm"
            >
              <Plus size={16} /> Create New
            </button>
          </div>

          {showCreateForm && (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-yellow-400 mb-6">
              <h3 className="font-bold mb-4 text-lg border-b pb-2">Create New Quest</h3>
              <form onSubmit={handleCreate} className="space-y-3">
                <input 
                  type="text" placeholder="Quest Title" 
                  className="w-full p-2 border rounded"
                  value={newQuest.title}
                  onChange={e => setNewQuest({...newQuest, title: e.target.value})}
                />
                <textarea 
                  placeholder="Instructions..." 
                  className="w-full p-2 border rounded"
                  value={newQuest.description}
                  onChange={e => setNewQuest({...newQuest, description: e.target.value})}
                />
                <div className="flex gap-4">
                  <input 
                    type="number" placeholder="XP" className="w-full p-2 border rounded"
                    value={newQuest.xp}
                    onChange={e => setNewQuest({...newQuest, xp: Number(e.target.value)})}
                  />
                  <input 
                    type="number" placeholder="Gold" className="w-full p-2 border rounded"
                    value={newQuest.gold}
                    onChange={e => setNewQuest({...newQuest, gold: Number(e.target.value)})}
                  />
                </div>
                <button type="submit" className="w-full bg-yellow-600 text-white font-bold py-2 rounded hover:bg-yellow-700">
                  PUBLISH
                </button>
              </form>
            </div>
          )}

          <div className="space-y-2">
            {quests.map(q => (
              <div key={q.id} className="bg-white p-3 rounded shadow-sm border border-stone-200 flex justify-between items-center">
                <span className="font-bold text-stone-700">{q.title}</span>
                <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded">
                  {q.xp} XP / {q.gold} G
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;