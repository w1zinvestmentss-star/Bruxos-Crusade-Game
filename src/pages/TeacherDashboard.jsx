import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Check, Search, Image as ImageIcon, BookCopy, Save } from 'lucide-react';
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
    updateStudentStats 
  } = useGame();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newQuest, setNewQuest] = useState({
    title: '',
    description: '',
    xp: 50,
    gold: 20,
    type: 'upload', // 'upload' or 'quiz'
    frequency: 'once', // 'once' or 'daily'
    unlockDate: '',
    correctAnswer: ''
  });
  const [gradeInputs, setGradeInputs] = useState({});

  const handleCreate = (e) => {
    e.preventDefault();
    
    // Default unlockDate to today if empty
    const questToCreate = {
      ...newQuest,
      unlockDate: newQuest.unlockDate || new Date().toISOString().split('T')[0],
    };

    createQuest(questToCreate);
    setShowCreateForm(false);
    // Reset state to include new fields
    setNewQuest({
      title: '',
      description: '',
      xp: 50,
      gold: 20,
      type: 'upload',
      frequency: 'once',
      unlockDate: '',
      correctAnswer: ''
    });
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
        [type]: value, // Keep it as a string for the input field
      },
    }));
  };

  const handleSaveGrades = (studentId) => {
    const inputs = gradeInputs[studentId];
    if (!inputs) return;

    // Convert to number and update if the value is a non-empty string
    if (inputs.midterm && inputs.midterm !== '') {
      updateStudentStats(studentId, 'midterm', Number(inputs.midterm));
    }
    if (inputs.final && inputs.final !== '') {
      updateStudentStats(studentId, 'final', Number(inputs.final));
    }

    // Clear inputs for this student after saving
    setGradeInputs(prev => ({
        ...prev,
        [studentId]: { midterm: '', final: '' },
    }));
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

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT COLUMN: INBOX */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-stone-800">
              <Search className="text-blue-600" /> Pending Approvals ({pendingSubmissions.length})
            </h2>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
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
                        <p className="text-xs font-bold text-stone-500 mb-2 flex items-center gap-1"><ImageIcon size={12} /> PROOF OF WORK:</p>
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
              <button onClick={() => setShowCreateForm(!showCreateForm)} className="bg-stone-800 text-white px-3 py-1 rounded hover:bg-black flex items-center gap-2 text-sm">
                <Plus size={16} /> Create New
              </button>
            </div>
            {showCreateForm && (
              <div className="bg-white p-6 rounded-xl shadow-lg border border-yellow-400 mb-6">
                <h3 className="font-bold mb-4 text-lg border-b pb-2">Create New Quest</h3>
                <form onSubmit={handleCreate} className="space-y-4">
                  <input type="text" placeholder="Quest Title" className="w-full p-2 border rounded bg-stone-100 border-stone-300" value={newQuest.title} onChange={e => setNewQuest({...newQuest, title: e.target.value})} required />
                  <textarea placeholder="Instructions..." className="w-full p-2 border rounded bg-stone-100 border-stone-300" value={newQuest.description} onChange={e => setNewQuest({...newQuest, description: e.target.value})} />
                  
                  <div className="flex gap-4">
                    <div className="w-1/2">
                      <label className="block text-sm font-bold text-stone-600 mb-1">Quest Type</label>
                      <select value={newQuest.type} onChange={e => setNewQuest({ ...newQuest, type: e.target.value })} className="w-full p-2 border rounded bg-stone-100 border-stone-300">
                        <option value="upload">Upload</option>
                        <option value="quiz">Quiz</option>
                      </select>
                    </div>
                    <div className="w-1/2">
                      <label className="block text-sm font-bold text-stone-600 mb-1">Frequency</label>
                      <select value={newQuest.frequency} onChange={e => setNewQuest({ ...newQuest, frequency: e.target.value })} className="w-full p-2 border rounded bg-stone-100 border-stone-300">
                        <option value="once">One-Time</option>
                        <option value="daily">Daily</option>
                      </select>
                    </div>
                  </div>

                  {newQuest.type === 'quiz' && (
                    <div>
                      <label className="block text-sm font-bold text-stone-600 mb-1">Correct Answer</label>
                      <input type="text" placeholder="Required for Quiz type" className="w-full p-2 border rounded bg-stone-100 border-stone-300" value={newQuest.correctAnswer} onChange={e => setNewQuest({ ...newQuest, correctAnswer: e.target.value })} required />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-stone-600 mb-1">Unlock Date (Optional)</label>
                    <input type="date" className="w-full p-2 border rounded bg-stone-100 border-stone-300" value={newQuest.unlockDate} onChange={e => setNewQuest({ ...newQuest, unlockDate: e.target.value })} />
                  </div>

                  <div className="flex gap-4">
                    <input type="number" placeholder="XP" className="w-full p-2 border rounded bg-stone-100 border-stone-300" value={newQuest.xp} onChange={e => setNewQuest({...newQuest, xp: Number(e.target.value)})} required />
                    <input type="number" placeholder="Gold" className="w-full p-2 border rounded bg-stone-100 border-stone-300" value={newQuest.gold} onChange={e => setNewQuest({...newQuest, gold: Number(e.target.value)})} required />
                  </div>
                  <button type="submit" className="w-full bg-yellow-600 text-white font-bold py-2 rounded hover:bg-yellow-700">PUBLISH</button>
                </form>
              </div>
            )}
            <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
              {quests.map(q => (
                <div key={q.id} className="bg-white p-3 rounded shadow-sm border border-stone-200 flex justify-between items-center">
                  <span className="font-bold text-stone-700">{q.title}</span>
                  <span className="text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded">{q.xp} XP / {q.gold} G</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* NEW SECTION: ATTRIBUTE MANAGEMENT */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-stone-800">
            <BookCopy className="text-purple-600" /> Attribute Management
          </h2>
          <div className="bg-white p-4 rounded-xl shadow-md border border-stone-200">
            <div className="space-y-3">
              {/* Header */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-bold text-sm text-stone-500 border-b pb-2">
                <div className="md:col-span-1">Student</div>
                <div className="md:col-span-1">Midterm Grade</div>
                <div className="md:col-span-1">Final Grade</div>
                <div className="md:col-span-1">Actions</div>
              </div>

              {/* Student Rows */}
              {students.map(student => (
                <div key={student.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-2 rounded-lg hover:bg-stone-50">
                  <div className="font-semibold text-stone-800">{student.name}</div>
                  <div>
                    <input 
                      type="number"
                      placeholder={`Current: ${student.midtermGPA !== null ? student.midtermGPA / 10 : 'N/A'}`}
                      className="w-full p-2 border rounded-md text-sm"
                      value={gradeInputs[student.id]?.midterm ?? ''}
                      onChange={(e) => handleGradeChange(student.id, 'midterm', e.target.value)}
                    />
                  </div>
                  <div>
                    <input 
                      type="number"
                      placeholder={`Current: ${student.finalGPA !== null ? student.finalGPA / 10 : 'N/A'}`}
                      className="w-full p-2 border rounded-md text-sm"
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
        </div>

      </div>
    </div>
  );
};

export default TeacherDashboard;
