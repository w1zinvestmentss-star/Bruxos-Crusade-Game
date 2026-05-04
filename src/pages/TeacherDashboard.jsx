import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Check, Search, Image as ImageIcon, BookCopy, Save, Upload, Clock, Shield, Star, DollarSign, Swords, Skull, Heart, Gift, Ticket } from 'lucide-react';
import { useGame } from '../context/GameContext';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const {
    submissions,
    quests,
    students,
    createQuest,
    approveSubmission,
    setUserRole,
    updateStudentStats,
    importQuestions,
    fulfillPrize,
    currentRafflePrize,
    setCurrentRafflePrize,
    runMonthlyRaffle
  } = useGame();

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
  const fileInputRef = useRef(null);
  const selectedQuestRef = useRef(null);

  // Aggregate Stats
  const totalQuests = students.reduce((sum, student) =>
    sum + (student.uploadQuestsCompleted || 0) + (student.quizQuestsCompleted || 0) + (student.multiStepQuestsCompleted || 0), 0);

  const totalBossesDefeated = students.reduce((sum, student) =>
    sum + (student.defeatedBosses?.length || 0), 0);

  const totalGoldEarned = students.reduce((sum, student) =>
    sum + (student.gold || 0), 0);

  const studentsWithPrizes = students.filter(s => s.pendingPrizes && s.pendingPrizes.length > 0);

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

  const handleSaveGrades = (studentId) => {
    const inputs = gradeInputs[studentId];
    if (!inputs) return;

    if (inputs.midterm && inputs.midterm !== '') {
      updateStudentStats(studentId, 'midterm', Number(inputs.midterm));
    }
    if (inputs.final && inputs.final !== '') {
      updateStudentStats(studentId, 'final', Number(inputs.final));
    }

    setGradeInputs(prev => ({
      ...prev,
      [studentId]: { midterm: '', final: '' },
    }));
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
              <input
                type="text"
                value={currentRafflePrize}
                onChange={(e) => setCurrentRafflePrize(e.target.value)}
                className="bg-black text-white p-2 rounded w-full border border-indigo-400"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  const result = runMonthlyRaffle(currentRafflePrize);
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
                        <button
                          onClick={() => approveSubmission(sub.id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow-md flex items-center gap-2 font-bold text-sm"
                        >
                          <Check size={16} /> APPROVE
                        </button>
                      </div>
                      {sub.type === 'journal' ? (
                        <div className="bg-stone-900/70 p-4 rounded border-l-4 border-yellow-500">
                          <p className="text-xs font-bold text-stone-400 mb-2 flex items-center gap-1"><BookCopy size={12} /> JOURNAL ENTRY:</p>
                          <p className="text-stone-300 font-serif italic">{sub.journalText}</p>
                        </div>
                      ) : (
                        <div className="bg-stone-900/70 rounded-lg p-2 border border-stone-700">
                          <p className="text-xs font-bold text-stone-400 mb-2 flex items-center gap-1"><ImageIcon size={12} /> PROOF OF WORK:</p>
                          {sub.proofImage ? (
                            <img src={sub.proofImage} alt="Proof" className="w-full h-48 object-cover rounded border border-stone-600" />
                          ) : (
                            <div className="h-20 flex items-center justify-center text-stone-500 text-sm">No image attached</div>
                          )}
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
                  <th className="p-4 text-left text-yellow-400 font-['Press_Start_2P'] text-xs">Streak</th>
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

        {/* Prize Fulfillment Center */}
        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-6 mt-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-stone-200">
            <Gift className="text-yellow-400" /> Prize Fulfillment Center
          </h2>
          {studentsWithPrizes.length === 0 ? (
            <div className="p-8 bg-black/20 rounded-xl border border-white/10 text-center text-stone-400 italic">
              No pending prizes to hand out.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentsWithPrizes.map(student => (
                student.pendingPrizes.map((prize, index) => (
                  <div key={`${student.id}-${index}`} className="bg-stone-800/80 p-5 rounded-xl border-2 border-yellow-500 shadow-lg shadow-yellow-900/20 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-white font-['Press_Start_2P'] text-xs leading-relaxed">{student.heroName}</h3>
                        <span className="bg-yellow-500/20 text-yellow-500 text-[10px] font-bold px-2 py-1 rounded border border-yellow-500/50">PENDING</span>
                      </div>
                      <p className="text-2xl text-yellow-400 font-['VT323'] mb-1">{prize.name}</p>
                      <p className="text-sm text-stone-400 italic mb-4">Reason: "{prize.achievement}"</p>
                    </div>
                    <button
                      onClick={() => fulfillPrize(student.id, index)}
                      className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 shadow-md flex items-center justify-center gap-2 font-bold transition-colors mt-2"
                    >
                      <Check size={18} /> Mark as Delivered
                    </button>
                  </div>
                ))
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;
