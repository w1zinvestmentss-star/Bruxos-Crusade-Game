import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Check, X, Search, Image as ImageIcon, BookCopy, Save, Upload, Clock, Shield, Star, DollarSign, Swords, Skull, Heart, Gift, Ticket, Download, FileText, ExternalLink } from 'lucide-react';
import { useGame } from '../context/GameContext';
import RealmAnalytics from '../components/RealmAnalytics';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const {
    submissions,
    quests,
    students,
    createQuest,
    approveSubmission,
    rejectSubmission,
    setUserRole,
    updateStudentStats,
    importQuestions,
    currentRafflePrize,
    setCurrentRafflePrize,
    runMonthlyRaffle,
    updateRafflePrize,
    prizeClaims,
    fulfillAchievementClaim,
    pendingPrizesList,
    fulfillPendingPrize,
    ACHIEVEMENTS,
    toggleGalleryFeature,
    purgeUnpinnedImages,
    gallerySubmissions,
  } = useGame();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'analytics'
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newQuest, setNewQuest] = useState({
    title: '',
    description: '',
    xp: 50,
    gold: 20,
    type: 'upload',
    frequency: 'once',
    unlockDate: '',
    correctAnswer: '',
    timeLimit: 30,
  });
  const [gradeInputs, setGradeInputs] = useState({});
  const [feedback, setFeedback] = useState({});
  const fileInputRef = useRef(null);
  const selectedQuestRef = useRef(null);

  // Aggregate Stats
  const totalQuests = students.reduce((sum, student) =>
    sum + (student.uploadQuestsCompleted || 0) + (student.quizQuestsCompleted || 0) + (student.multiStepQuestsCompleted || 0), 0);

  const totalBossesDefeated = students.reduce((sum, student) =>
    sum + (student.defeatedBosses?.length || 0), 0);

  const totalGoldEarned = students.reduce((sum, student) =>
    sum + (student.gold || 0), 0);

  const handleCreate = (e) => {
    e.preventDefault();

    let questToCreate = { ...newQuest };

    if (questToCreate.type === 'quiz' || questToCreate.type === 'scenario' || questToCreate.type === 'incantation') {
      questToCreate.questionBank = [];
    } else {
      delete questToCreate.correctAnswer;
      delete questToCreate.timeLimit;
    }

    questToCreate.unlockDate = questToCreate.unlockDate || new Date().toISOString().split('T')[0];

    createQuest(questToCreate);
    setShowCreateForm(false);
    setNewQuest({
      title: '', description: '', xp: 50, gold: 20, type: 'upload',
      frequency: 'once', unlockDate: '', correctAnswer: '', timeLimit: 30,
    });
  };

  const handleImportClick = (questId) => {
    selectedQuestRef.current = questId;
    fileInputRef.current.click();
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    const questId = selectedQuestRef.current;
    if (!file || !questId) return;

    const targetQuest = quests.find(q => q.id === questId);
    if (!targetQuest) {
      alert('Target quest not found!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        const lines = text.split('\n').filter(line => line.trim() !== '');

        const parsedData = lines.map(line => {
          const cols = line.split(',').map(c => c.trim());
          if (targetQuest.type === 'quiz') {
            if (cols.length < 2 || !cols[0] || !cols[1]) return null;
            return { q: cols[0], a: cols[1] };
          } else if (targetQuest.type === 'scenario') {
            if (cols.length < 5 || !cols[0] || !cols[4]) return null;
            return { q: cols[0], options: [cols[1], cols[2], cols[3]], a: cols[4] };
          } else if (targetQuest.type === 'incantation') {
            if (cols.length < 1 || !cols[0]) return null;
            return { q: cols[0], a: cols[0] };
          }
          return null;
        }).filter(Boolean);

        if (parsedData.length === 0) {
          throw new Error('No valid data found in CSV.');
        }

        importQuestions(questId, parsedData);
        alert(`Successfully imported ${parsedData.length} questions!`);
      } catch (error) {
        alert(`Import failed: ${error.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const handleLogout = () => {
    setUserRole(null);
    navigate('/');
  };

  const handleGradeChange = (studentId, type, value) => {
    setGradeInputs(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [type]: value,
      },
    }));
  };

  const handleSaveGrades = async (studentId) => {
    const inputs = gradeInputs[studentId];
    if (!inputs) return;

    if (inputs.midterm !== '' && inputs.midterm !== undefined) {
      await updateStudentStats(studentId, 'midterm', Number(inputs.midterm));
    }
    if (inputs.final !== '' && inputs.final !== undefined) {
      await updateStudentStats(studentId, 'final', Number(inputs.final));
    }

    // Clear inputs after save
    setGradeInputs(prev => ({
      ...prev,
      [studentId]: { midterm: '', final: '' },
    }));
    alert("Grades updated!");
  };

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const wellnessLogs = submissions.filter(s => s.type === 'wellness');

  const getFeelingClass = (feeling) => {
    switch (feeling) {
      case 'Strong': return 'border-l-green-500 bg-green-900/30';
      case 'Weary': return 'border-l-yellow-500 bg-yellow-900/30';
      case 'Wounded': return 'border-l-red-500 bg-red-900/30';
      default: return 'border-l-stone-500';
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 font-sans">
      <input type="file" accept=".csv" ref={fileInputRef} className="hidden" onChange={handleFileImport} />

      <div className="bg-red-900 text-white p-4 flex justify-between items-center shadow-lg">
        <h1 className="text-xl font-bold flex items-center gap-2" style={{ fontFamily: "'Press Start 2P', cursive" }}>
          <span className="text-yellow-400">👑</span> GAME MASTER
        </h1>
        <button onClick={handleLogout} className="flex items-center gap-2 hover:text-red-200">
          <LogOut size={18} /> Logout
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">

        {/* Master Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-3 p-2 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-pixel text-xs tracking-wider uppercase transition-all ${
              activeTab === 'overview'
                ? 'bg-amber-600 text-amber-50 shadow-[0_2px_0_#78350f]'
                : 'bg-[#181a24] text-zinc-400 hover:text-zinc-200 border border-white/5'
            }`}
          >
            ⚔️ Command Deck
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg font-pixel text-xs tracking-wider uppercase transition-all ${
              activeTab === 'analytics'
                ? 'bg-amber-600 text-amber-50 shadow-[0_2px_0_#78350f]'
                : 'bg-[#181a24] text-zinc-400 hover:text-zinc-200 border border-white/5'
            }`}
          >
            📊 Realm Analytics
          </button>
        </div>

        {activeTab === 'analytics' && (
          <RealmAnalytics profiles={students} submissions={submissions} />
        )}

        {activeTab === 'overview' && (
          <>
            {/* Realm Overview Section */}
            <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <h2 className="font-['Press_Start_2P'] text-xl text-yellow-400 text-center mb-6">REALM OVERVIEW</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="font-['Press_Start_2P'] text-sm text-yellow-500 mb-2 flex items-center justify-center gap-2"><Swords size={16} />Quests Done</p>
              <p className="font-['VT323'] text-4xl text-yellow-300">{totalQuests}</p>
            </div>
            <div>
              <p className="font-['Press_Start_2P'] text-sm text-yellow-500 mb-2 flex items-center justify-center gap-2"><Skull size={16} />Bosses Slain</p>
              <p className="font-['VT323'] text-4xl text-yellow-300">{totalBossesDefeated}</p>
            </div>
            <div>
              <p className="font-['Press_Start_2P'] text-sm text-yellow-500 mb-2 flex items-center justify-center gap-2"><DollarSign size={16} />Gold Hoarded</p>
              <p className="font-['VT323'] text-4xl text-yellow-300">{totalGoldEarned.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Raffle Control Center */}
        <div className="bg-indigo-900/30 border-2 border-indigo-500 rounded-xl p-6 mb-8">
          <h2 className="text-indigo-400 font-bold font-['Press_Start_2P'] mb-6">🎟️ GRAND RAFFLE CONTROLS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-stone-300 mb-2">Current Billboard Prize (Visible to Students):</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={currentRafflePrize}
                  onChange={(e) => setCurrentRafflePrize(e.target.value)}
                  className="bg-black text-white p-2 rounded flex-grow border border-indigo-400"
                />
                <button 
                  onClick={async () => {
                    const res = await updateRafflePrize(currentRafflePrize);
                    if (res.success) alert("Billboard updated permanently!");
                    else alert("Failed to save billboard.");
                  }}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded text-xs"
                >
                  SAVE
                </button>
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={async () => {
                  const result = await runMonthlyRaffle(currentRafflePrize);
                  if (result.success) {
                    alert('🎉 The winner is: ' + result.winnerName + '! The prize has been added to your Fulfillment Center.');
                  } else {
                    alert(result.message);
                  }
                }}
                className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg w-full shadow-[0_0_15px_rgba(202,138,4,0.6)]"
              >
                DRAW WINNER NOW
              </button>
            </div>
          </div>
        </div>

        {/* System Maintenance */}
        <div className="bg-stone-900/60 border-2 border-red-500/50 rounded-xl p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-red-500 font-bold font-['Press_Start_2P'] text-xs mb-2">🛠️ SYSTEM MAINTENANCE</h2>
            <p className="text-stone-400 text-sm">Purge tattered homework and PE photos from cloud storage to free up space. Pinned gallery art and data tables are kept 100% intact for analytics [10].</p>
          </div>
          <button
            onClick={async () => {
              if (window.confirm("Are you sure you want to permanently delete all unpinned student photos from the cloud storage bucket? Database rows will be preserved [10].")) {
                const res = await purgeUnpinnedImages();
                if (res.success) {
                  alert(`💥 Shredder Success! Purged ${res.count} tattered files from the cloud [13]!`);
                } else {
                  alert(res.message);
                }
              }
            }}
            className="bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg whitespace-nowrap shadow-[0_0_15px_rgba(220,38,38,0.4)]"
          >
            SHRED UNPINNED IMAGES
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Approvals Section */}
          <div className="lg:col-span-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-stone-200">
              <Search className="text-blue-400" /> Pending Approvals ({pendingSubmissions.length})
            </h2>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {pendingSubmissions.length === 0 ? (
                <div className="p-8 bg-black/20 rounded-xl border border-white/10 text-center text-stone-400 italic">
                  No submissions waiting.
                </div>
              ) : (
                pendingSubmissions.map(sub => {
                  const isBossStrike = sub.isBossStrike;
                  const questDetails = quests.find(q => q.id === sub.questId);
                  const title = isBossStrike ? "🔴 BOSS FINISHING BLOW" : questDetails?.title;
                  const imageQuestTypes = ['upload', 'scout-arts', 'scout-sports'];
                  const isImageSubmission = imageQuestTypes.includes(sub.type);
                  const proofUrl = sub.proofContent;
                  const containerClass = isBossStrike 
                    ? "bg-stone-800/80 p-4 rounded-xl shadow-[0_0_15px_red] border-2 border-red-500" 
                    : "bg-stone-800/80 p-4 rounded-xl shadow-lg border-l-4 border-blue-500";
                  
                  return (
                    <div key={sub.id} className={containerClass}>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-bold text-lg text-stone-100">{title}</h3>
                          <p className="text-sm text-stone-400">Student: <span className="font-bold text-blue-400">{sub.studentName}</span></p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {isImageSubmission && proofUrl && (
                            <div className="flex gap-2 w-full mb-2">
                              <a
                                href={proofUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="bg-blue-600 hover:bg-blue-500 text-white px-2 py-2 rounded-lg flex-1 flex items-center justify-center gap-1 font-bold text-xs transition-colors"
                              >
                                <ExternalLink size={16} /> VIEW
                              </a>
                              <a
                                href={proofUrl ? `${proofUrl}?download` : '#'}
                                download
                                className="bg-stone-600 hover:bg-stone-500 text-white px-2 py-2 rounded-lg flex-1 flex items-center justify-center gap-1 font-bold text-xs transition-colors"
                              >
                                <Download size={16} /> SAVE
                              </a>
                            </div>
                          )}
                          <p className="text-[10px] text-red-400 italic max-w-[200px] text-right leading-tight">
                            Note: Clicking Approve will permanently delete this file from the cloud server.
                          </p>
                          <button
                            onClick={() => approveSubmission(sub.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-md flex items-center justify-center gap-2 font-bold text-sm w-full"
                          >
                            <Check size={16} /> APPROVE
                          </button>
                          {sub.type === 'scout-arts' && (
                            <button
                              onClick={async () => {
                                // Since it is pending, we set featured to true upon clicking
                                const res = await toggleGalleryFeature(sub.id, true);
                                if (res.success) {
                                  alert("Artwork pinned to the Tavern Grove Gallery!");
                                } else {
                                  alert("Failed to pin artwork.");
                                }
                              }}
                              className="mt-2 w-full bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-500/50 py-1.5 rounded-lg flex items-center justify-center gap-1.5 text-xs font-bold transition-all shadow-[0_0_10px_rgba(168,85,247,0.2)]"
                            >
                              📌 PIN TO GALLERY
                            </button>
                          )}
                          <input
                            type="text"
                            value={feedback[sub.id] || ''}
                            onChange={(e) => setFeedback(prev => ({ ...prev, [sub.id]: e.target.value }))}
                            placeholder="Reason for rejection..."
                            className="bg-black text-white text-xs p-2 rounded border border-stone-600 focus:outline-none focus:border-red-400"
                          />
                          <button
                            onClick={async () => {
                              const result = await rejectSubmission(sub.id, feedback[sub.id] || 'Work did not meet requirements');
                              if (result?.success) {
                                alert('Quest rejected and proof file shredded.');
                              } else {
                                alert(result?.message || 'Quest rejection failed.');
                              }
                            }}
                            className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg shadow-md flex items-center justify-center gap-2 font-bold text-sm w-full"
                          >
                            <X size={16} /> REJECT
                          </button>
                        </div>
                      </div>
                      {isImageSubmission ? (
                        <div className="bg-stone-900/70 rounded-lg p-2 border border-stone-700">
                          <p className="text-xs font-bold text-stone-400 mb-2 flex items-center gap-1"><ImageIcon size={12} /> PROOF OF WORK:</p>
                          {proofUrl ? (
                            <>
                              <img key={proofUrl} src={proofUrl} referrerPolicy="no-referrer" alt="Proof" className="w-full h-48 object-cover rounded border border-stone-600" />
                              <p className="mt-2 text-xs text-yellow-300 font-bold">If this preview does not load, use the VIEW or SAVE buttons above.</p>
                            </>
                          ) : (
                            <div className="h-20 flex items-center justify-center text-stone-500 text-sm">No file attached</div>
                          )}
                        </div>
                      ) : sub.type === 'journal' ? (
                        <div className="bg-stone-900/70 p-4 rounded border-l-4 border-yellow-500">
                          <p className="text-xs font-bold text-stone-400 mb-2 flex items-center gap-1"><BookCopy size={12} /> JOURNAL ENTRY:</p>
                          <p className="text-stone-300 font-serif italic">{proofUrl}</p>
                        </div>
                      ) : (
                        <div className="bg-stone-900/70 p-4 rounded border-l-4 border-stone-500">
                          <p className="text-xs font-bold text-stone-400 mb-2 flex items-center gap-1"><BookCopy size={12} /> SUBMISSION:</p>
                          <p className="text-stone-300 font-serif italic">{proofUrl || 'No content attached.'}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Wellness Logs Section */}
          <div className="lg:col-span-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-stone-200">
              <Heart className="text-red-400" /> Tavern Logs (Wellness)
            </h2>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {wellnessLogs.length === 0 ? (
                <div className="p-8 bg-black/20 rounded-xl border border-white/10 text-center text-stone-400 italic">
                  No wellness check-ins yet.
                </div>
              ) : (
                wellnessLogs.map(log => (
                  <div key={log.id} className={`p-3 rounded-lg flex justify-between items-center border-l-4 ${getFeelingClass(log.feeling)}`}>
                    <div>
                      <p className="font-bold text-stone-100">{log.studentName}</p>
                      <p className="text-xs text-stone-400">{log.timestamp}</p>
                    </div>
                    <p className="font-bold text-lg">{log.feeling}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quests Section */}
          <div className="lg:col-span-1 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-stone-200">Active Quests</h2>
              <button onClick={() => setShowCreateForm(!showCreateForm)} className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-400 flex items-center gap-2 text-sm font-bold">
                <Plus size={16} /> Create New
              </button>
            </div>
            {showCreateForm && (
              <div className="bg-stone-900/80 p-6 rounded-xl shadow-lg border border-yellow-500/50 mb-6">
                <h3 className="font-bold mb-4 text-lg border-b border-stone-700 pb-2">Create New Quest</h3>
                <form onSubmit={handleCreate} className="space-y-4">
                  <input type="text" placeholder="Quest Title" className="w-full p-2 border rounded bg-stone-800 border-stone-700 text-white placeholder:text-stone-500" value={newQuest.title} onChange={e => setNewQuest({ ...newQuest, title: e.target.value })} required />
                  <textarea placeholder="Instructions..." className="w-full p-2 border rounded bg-stone-800 border-stone-700 text-white placeholder:text-stone-500" value={newQuest.description} onChange={e => setNewQuest({ ...newQuest, description: e.target.value })} />

                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label className="block text-sm font-bold text-stone-400 mb-1">Quest Type</label>
                      <select value={newQuest.type} onChange={e => setNewQuest({ ...newQuest, type: e.target.value })} className="w-full p-2 border rounded bg-stone-800 border-stone-700 text-white">
                        <option value="upload">Upload</option>
                        <option value="quiz">Quiz</option>
                        <option value="scenario">Scenario</option>
                        <option value="incantation">Incantation</option>
                        <option value="journal">Journal</option>
                      </select>
                    </div>
                    <div className="w-1/2">
                      <label className="block text-sm font-bold text-stone-400 mb-1">Frequency</label>
                      <select value={newQuest.frequency} onChange={e => setNewQuest({ ...newQuest, frequency: e.target.value })} className="w-full p-2 border rounded bg-stone-800 border-stone-700 text-white">
                        <option value="once">One-Time</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </select>
                    </div>
                  </div>

                  {newQuest.type === 'quiz' && (
                    <>
                      <div className="border-t border-stone-700 pt-4 mt-4">
                        <label className="block text-sm font-bold text-stone-400 mb-1">Quiz Mode</label>
                        <p className="text-xs text-stone-500 mb-2">Static quizzes use one answer. Dynamic quizzes use a question bank (CSV) and a timer.</p>
                        <input type="text" placeholder="Correct Answer (for Static Quiz)" className="w-full p-2 border rounded bg-stone-800 border-stone-700 text-white placeholder:text-stone-500" value={newQuest.correctAnswer} onChange={e => setNewQuest({ ...newQuest, correctAnswer: e.target.value })} />
                      </div>
                      {!newQuest.correctAnswer && (
                        <div className="mt-2">
                          <label className="block text-sm font-bold text-stone-400 mb-1">Time Limit (seconds)</label>
                          <input type="number" placeholder="e.g., 30" className="w-full p-2 border rounded bg-stone-800 border-stone-700 text-white placeholder:text-stone-500" value={newQuest.timeLimit} onChange={e => setNewQuest({ ...newQuest, timeLimit: Number(e.target.value) })} />
                        </div>
                      )}
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-stone-400 mb-1">Unlock Date (Optional)</label>
                    <input type="date" className="w-full p-2 border rounded bg-stone-800 border-stone-700 text-white" value={newQuest.unlockDate} onChange={e => setNewQuest({ ...newQuest, unlockDate: e.target.value })} />
                  </div>

                  <div className="flex gap-4">
                    <input type="number" placeholder="XP" className="w-full p-2 border rounded bg-stone-800 border-stone-700 text-white placeholder:text-stone-500" value={newQuest.xp} onChange={e => setNewQuest({ ...newQuest, xp: Number(e.target.value) })} required />
                    <input type="number" placeholder="Gold" className="w-full p-2 border rounded bg-stone-800 border-stone-700 text-white placeholder:text-stone-500" value={newQuest.gold} onChange={e => setNewQuest({ ...newQuest, gold: Number(e.target.value) })} required />
                  </div>
                  <button type="submit" className="w-full bg-yellow-600 text-black font-bold py-2 rounded hover:bg-yellow-500">PUBLISH</button>
                </form>
              </div>
            )}
            <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {quests.map(q => (
                <div key={q.id} className="bg-stone-800/80 p-3 rounded shadow-md border border-stone-700 flex justify-between items-center">
                  <div>
                    <span className="font-bold text-stone-300">{q.title}</span>
                    <span className={`text-xs ml-2 px-2 py-1 rounded ${q.type === 'quiz' ? 'bg-purple-900/80 text-purple-300' : q.type === 'scenario' ? 'bg-orange-900/80 text-orange-300' : q.type === 'incantation' ? 'bg-cyan-900/80 text-cyan-300' : 'bg-stone-700/80 text-stone-400'}`}>
                      {q.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-yellow-400/20 text-yellow-300 px-2 py-1 rounded">{q.xp} XP / {q.gold} G</span>
                    {(q.type === 'quiz' || q.type === 'scenario' || q.type === 'incantation') && q.questionBank && (
                      <button
                        onClick={() => handleImportClick(q.id)}
                        className="bg-blue-900/80 text-blue-300 px-2 py-1 rounded hover:bg-blue-800/80 text-xs font-semibold flex items-center gap-1"
                      >
                        <Upload size={12} /> Import CSV
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Attribute Management Section */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-stone-200">
            <BookCopy className="text-purple-400" /> Attribute Management
          </h2>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-bold text-sm text-stone-400 border-b border-stone-700 pb-2">
              <div className="md:col-span-1">Student</div>
              <div className="md:col-span-1">Midterm Grade</div>
              <div className="md:col-span-1">Final Grade</div>
              <div className="md:col-span-1">Actions</div>
            </div>

            {students.map(student => (
              <div key={student.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-2 rounded-lg hover:bg-stone-800/60">
                <div>
                  <div className="font-semibold text-stone-100">{student.name}</div>
                  <div className="flex items-center gap-1 text-yellow-400 font-mono text-sm mt-1">
                    <Ticket size={14} /> Tickets: {student.raffleTickets || 0}
                  </div>
                </div>
                <div>
                  <input
                    type="number"
                    placeholder={`Current: ${student.midtermGPA !== null ? student.midtermGPA / 10 : 'N/A'}`}
                    className="w-full p-2 border rounded-md bg-stone-800 border-stone-700 text-sm text-white placeholder:text-stone-500"
                    value={gradeInputs[student.id]?.midterm ?? ''}
                    onChange={(e) => handleGradeChange(student.id, 'midterm', e.target.value)}
                  />
                </div>
                <div>
                  <input
                    type="number"
                    placeholder={`Current: ${student.finalGPA !== null ? student.finalGPA / 10 : 'N/A'}`}
                    className="w-full p-2 border rounded-md bg-stone-800 border-stone-700 text-sm text-white placeholder:text-stone-500"
                    value={gradeInputs[student.id]?.final ?? ''}
                    onChange={(e) => handleGradeChange(student.id, 'final', e.target.value)}
                  />
                </div>
                <div>
                  <button
                    onClick={() => handleSaveGrades(student.id)}
                    className="w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 flex items-center justify-center gap-2 text-sm font-semibold"
                  >
                    <Save size={14} /> Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Student Performance Table */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6 text-center font-['Press_Start_2P'] text-purple-400">
            HERO ROSTER & PROGRESS
          </h2>
          <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden">
            <table className="w-full font-['VT323'] text-lg text-stone-200">
              <thead className="bg-black/50">
                <tr>
                  <th className="p-4 text-left text-yellow-400 font-['Press_Start_2P'] text-xs">Hero Name</th>
                  <th className="p-4 text-left text-yellow-400 font-['Press_Start_2P'] text-xs">Level</th>
                  <th className="p-4 text-left text-yellow-400 font-['Press_Start_2P'] text-xs">Quests</th>
                  <th className="p-4 text-left text-yellow-400 font-['Press_Start_2P'] text-xs">Bosses</th>
                  <th className="p-4 text-left text-yellow-400 font-['Press_Start_2P'] text-xs">Active Days</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id} className={index % 2 === 0 ? 'bg-stone-800/80' : 'bg-stone-900/80'}>
                    <td className="p-4 font-bold text-white">{student.heroName}</td>
                    <td className="p-4 text-cyan-300">{student.level}</td>
                    <td className="p-4 text-green-300">
                      {(student.uploadQuestsCompleted || 0) + (student.quizQuestsCompleted || 0) + (student.multiStepQuestsCompleted || 0)}
                    </td>
                    <td className="p-4 text-red-400">{student.defeatedBosses?.length || 0}</td>
                    <td className={`p-4 font-bold ${student.loginStreak > 5 ? 'text-green-300' : 'text-gray-400'}`}>
                      {student.loginStreak} days
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Achievement Prize Claims */}
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-6 mt-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-stone-200">
            <Star className="text-yellow-400" /> Achievement Prize Claims
          </h2>
          {(() => {
            const pendingClaims = (prizeClaims || []).filter(c => c.status === 'pending');
            if (pendingClaims.length === 0) {
              return (
                <div className="p-8 bg-black/20 rounded-xl border border-white/10 text-center text-stone-400 italic">
                  No pending achievement prize claims.
                </div>
              );
            }
            return (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-stone-300">
                  <thead>
                    <tr className="text-left text-stone-400 border-b border-stone-700 text-xs font-bold uppercase tracking-wider">
                      <th className="pb-3 pr-4">Student</th>
                      <th className="pb-3 pr-4">Achievement</th>
                      <th className="pb-3 pr-4">Prize</th>
                      <th className="pb-3 pr-4">Requested</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingClaims.map(claim => {
                      const student = students.find(s => s.id === claim.student_id);
                      const achievement = (ACHIEVEMENTS || []).find(a => a.id === claim.achievement_id);
                      return (
                        <tr key={claim.id} className="border-b border-stone-800/60 hover:bg-stone-800/30 transition-colors">
                          <td className="py-3 pr-4 font-semibold text-white">{student?.heroName || student?.name || claim.student_id.slice(0, 8)}</td>
                          <td className="py-3 pr-4 font-mono text-yellow-400 text-xs">{achievement?.title || claim.achievement_id}</td>
                          <td className="py-3 pr-4 text-stone-300">{achievement?.realWorldPrize || '—'}</td>
                          <td className="py-3 pr-4 text-stone-500">{new Date(claim.requested_at).toLocaleDateString()}</td>
                          <td className="py-3">
                            <button
                              onClick={async () => {
                                await fulfillAchievementClaim(claim.id);
                              }}
                              className="flex items-center gap-1 bg-green-700 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold text-xs transition-colors"
                            >
                              <Check size={14} /> Approve &amp; Fulfill
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
</table>
              </div>
            );
          })()}
        </div>

        {/* Prize Fulfillment Center - Separated for clarity */}
        <div className="bg-black/60 backdrop-blur-md border border-yellow-500/50 rounded-xl p-6 mt-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-yellow-400">
            <Gift className="text-yellow-400" /> 🎁 PRIZE FULFILLMENT CENTER
          </h2>
          {(() => {
            const pendingPrizes = (pendingPrizesList || []).filter(p => p.status === 'pending');
            if (pendingPrizes.length === 0) {
              return (
                <div className="p-8 bg-black/20 rounded-xl border border-yellow-500/30 text-center text-stone-400 italic">
                  All prizes are caught up! No pending deliveries.
                </div>
              );
            }
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingPrizes.map(prize => {
                  const student = students.find(s => s.id === prize.student_id);
                  return (
                    <div key={prize.id} className="bg-stone-800/80 p-5 rounded-xl border-2 border-yellow-500 shadow-lg shadow-yellow-900/20 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-lg text-white font-['Press_Start_2P'] text-xs leading-relaxed">{student?.heroName || prize.student_name}</h3>
                          <span className="bg-yellow-500/20 text-yellow-500 text-[10px] font-bold px-2 py-1 rounded border border-yellow-500/50">PENDING</span>
                        </div>
                        <p className="text-2xl text-yellow-400 font-['VT323'] mb-1">{prize.prize}</p>
                        <p className="text-sm text-stone-400 italic mb-4">Reason: "{prize.reason}"</p>
                      </div>
                      <button
                        onClick={async () => {
                          await fulfillPendingPrize(prize.id);
                          alert("Prize marked as delivered!");
                        }}
                        className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 shadow-md flex items-center justify-center gap-2 font-bold transition-colors mt-2"
                      >
                        <Check size={18} /> Mark as Delivered
                      </button>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>

        {/* GALLERY CURATION PANEL */}
        <div className="bg-black/60 backdrop-blur-md border border-purple-500/50 rounded-xl p-6 mt-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-purple-400">
            <Gift className="text-purple-400" /> 🎨 GALLERY CURATION PANEL
          </h2>
          <p className="text-stone-400 text-sm mb-6">Manage the active exhibition. You can unpin any student masterpiece from the Tavern Grove Gallery with a single click [10].</p>
          
          {(() => {
            // Only pull currently active, pinned gallery submissions!
            if (!gallerySubmissions || gallerySubmissions.length === 0) {
              return (
                <div className="p-8 bg-black/20 rounded-xl border border-stone-850 text-center text-stone-400 italic">
                  The Tavern Grove Gallery is currently empty. Pin some student drawings during your pending approvals [10]!
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gallerySubmissions.map(art => (
                  <div key={art.id} className="bg-stone-800/80 p-4 rounded-xl border border-stone-700 flex flex-col justify-between shadow-lg">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-white font-mono text-sm leading-relaxed">{art.studentName}</h3>
                        <span className="text-[10px] font-bold px-2 py-1 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.15)]">
                          ACTIVE EXHIBIT
                        </span>
                      </div>
                      {/* Visual Image Preview */}
                      <img src={art.proofContent} alt="Student Art" className="w-full h-32 object-cover rounded border border-stone-600 mb-4" />
                    </div>
                    <button
                      onClick={async () => {
                        // Unpin from gallery in real-time
                        const res = await toggleGalleryFeature(art.id, false);
                        if (res.success) {
                          alert("Artwork removed from the Tavern Grove Gallery!");
                        } else {
                          alert("Failed to unpin artwork.");
                        }
                      }}
                      className="w-full py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-500/50"
                    >
                      📌 UNPIN FROM GALLERY
                    </button>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
          </>
        )}

      </div>
    </div>
  );
};

export default TeacherDashboard;
