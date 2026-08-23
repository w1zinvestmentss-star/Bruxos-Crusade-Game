import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Check, X, Search, Image as ImageIcon, BookCopy, Save, 
  Clock, Shield, Star, DollarSign, Swords, Skull, Heart, Gift, 
  Ticket, Download, ExternalLink, Trash2, Award, Sparkles 
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import RealmAnalytics from '../components/RealmAnalytics';

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const {
    submissions = [],
    quests = [],
    students = [],
    approveSubmission,
    rejectSubmission,
    setUserRole,
    updateStudentStats,
    currentRafflePrize = "Mystery Box",
    setCurrentRafflePrize,
    runMonthlyRaffle,
    updateRafflePrize,
    prizeClaims = [],
    fulfillAchievementClaim,
    pendingPrizesList = [],
    fulfillPendingPrize,
    ACHIEVEMENTS = [],
    toggleGalleryFeature,
    purgeUnpinnedImages,
    gallerySubmissions = [],
  } = useGame();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'analytics'
  const [gradeInputs, setGradeInputs] = useState({});
  const [feedback, setFeedback] = useState({});
  const [isPurging, setIsPurging] = useState(false);

  // Aggregate Realm Telemetry (All 11 Quest Types)
  const totalQuests = students.reduce((sum, s) => {
    const uploads = s.uploadQuestsCompleted || s.upload_quests_completed || 0;
    const quizzes = s.quizQuestsCompleted || s.quiz_quests_completed || 0;
    const multiStep = s.multiStepQuestsCompleted || s.multi_step_quests_completed || 0;
    const scenarios = s.scenarioQuestsCompleted || s.scenario_quests_completed || 0;
    const ciphers = s.cipherQuestsCompleted || s.cipher_quests_completed || 0;
    const incantations = s.incantationQuestsCompleted || s.incantation_quests_completed || 0;
    const gauntlet = s.gauntletQuestsCompleted || s.gauntlet_quests_completed || 0;
    const sports = s.sportsQuestsCompleted || s.sports_quests_completed || 0;
    const arts = s.artsQuestsCompleted || s.arts_quests_completed || 0;
    const journals = s.journalQuestsCompleted || s.journal_quests_completed || 0;
    const wellness = s.wellnessQuestsCompleted || s.wellness_quests_completed || 0;

    return sum + (uploads + quizzes + multiStep + scenarios + ciphers + incantations + gauntlet + sports + arts + journals + wellness);
  }, 0);

  const totalBossesDefeated = students.reduce((sum, student) =>
    sum + (student.defeatedBosses?.length || 0), 0);

  const totalGoldEarned = students.reduce((sum, student) =>
    sum + (student.gold || 0), 0);

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

    setGradeInputs(prev => ({
      ...prev,
      [studentId]: { midterm: '', final: '' },
    }));
    alert("Academic attributes updated!");
  };

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const wellnessLogs = submissions.filter(s => s.type === 'wellness');

  const getFeelingBadge = (feeling) => {
    switch (feeling) {
      case 'Strong': return 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300';
      case 'Weary': return 'border-amber-500/50 bg-amber-950/40 text-amber-300';
      case 'Wounded': return 'border-red-500/50 bg-red-950/40 text-red-300';
      default: return 'border-stone-500/50 bg-stone-900 text-stone-300';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b10] text-stone-200 font-sans select-none">
      
      {/* Top Admin Header */}
      <div className="bg-[#151722] border-b border-red-900/50 text-white px-6 py-4 flex justify-between items-center shadow-2xl">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👑</span>
          <div>
            <h1 className="font-pixel text-sm md:text-base text-yellow-400 font-bold tracking-wide">
              GAME MASTER COMMAND DECK
            </h1>
            <p className="text-[10px] font-mono text-zinc-400">Scarborough Realm • Grade 5 Control Portal</p>
          </div>
        </div>
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-950/60 border border-red-500/40 hover:bg-red-900 text-red-300 font-pixel text-xs transition-all cursor-pointer"
        >
          <LogOut size={14} /> LOGOUT
        </button>
      </div>

      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">

        {/* Master Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-3 p-2 rounded-xl bg-[#12131c] border border-white/10 shadow-lg">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2.5 rounded-lg font-pixel text-xs tracking-wider uppercase transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-amber-600 text-amber-50 shadow-[0_2px_0_#78350f]'
                : 'bg-[#181a24] text-zinc-400 hover:text-zinc-200 border border-white/5'
            }`}
          >
            ⚔️ Command Deck
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-5 py-2.5 rounded-lg font-pixel text-xs tracking-wider uppercase transition-all cursor-pointer ${
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
          <div className="space-y-8">
            
            {/* 1. REALM TELEMETRY HERO BANNER */}
            <div className="relative overflow-hidden p-6 rounded-xl border-2 border-[#2b2e42] bg-gradient-to-br from-[#1c1e2b] via-[#12131d] to-[#0a0b10] shadow-2xl">
              <span className="absolute top-2 left-2 text-[9px] text-amber-500/50 select-none">✦</span>
              <span className="absolute top-2 right-2 text-[9px] text-amber-500/50 select-none">✦</span>

              <h2 className="font-pixel text-sm text-amber-400 uppercase tracking-widest mb-6 text-center">
                REALM TELEMETRY & ACTIVITY SUMMARY
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-black/40 border border-amber-500/30 text-center shadow-inner">
                  <div className="flex items-center justify-center gap-2 font-pixel text-xs text-amber-400 mb-1">
                    <Swords size={16} /> QUESTS CONQUERED
                  </div>
                  <div className="font-pixel text-3xl text-amber-200 font-bold">{totalQuests}</div>
                </div>

                <div className="p-4 rounded-lg bg-black/40 border border-red-500/30 text-center shadow-inner">
                  <div className="flex items-center justify-center gap-2 font-pixel text-xs text-red-400 mb-1">
                    <Skull size={16} /> BOSSES VANQUISHED
                  </div>
                  <div className="font-pixel text-3xl text-red-200 font-bold">{totalBossesDefeated}</div>
                </div>

                <div className="p-4 rounded-lg bg-black/40 border border-yellow-500/30 text-center shadow-inner">
                  <div className="flex items-center justify-center gap-2 font-pixel text-xs text-yellow-400 mb-1">
                    <DollarSign size={16} /> GOLD HOARDED
                  </div>
                  <div className="font-pixel text-3xl text-yellow-300 font-bold">{totalGoldEarned.toLocaleString()} G</div>
                </div>
              </div>
            </div>

            {/* 2. ADMIN QUICK ACTIONS: GRAND RAFFLE & SYSTEM MAINTENANCE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Grand Raffle Control */}
              <div className="p-6 rounded-xl border border-indigo-500/40 bg-gradient-to-br from-[#1b1a2e] via-[#12131d] to-[#0a0b10] shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-pixel text-xs text-indigo-300 uppercase tracking-wider mb-2">
                    <Ticket size={16} className="text-indigo-400" /> GRAND RAFFLE CONTROLS
                  </div>
                  <label className="block text-xs font-mono text-zinc-400 mb-2">
                    Current Billboard Prize (Visible to Students):
                  </label>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={currentRafflePrize}
                      onChange={(e) => setCurrentRafflePrize(e.target.value)}
                      className="bg-black/80 text-white text-sm font-mono px-3 py-2 rounded-lg flex-grow border border-indigo-400/50 focus:border-indigo-300 focus:outline-none"
                    />
                    <button 
                      onClick={async () => {
                        const res = await updateRafflePrize(currentRafflePrize);
                        if (res.success) alert("Billboard updated permanently!");
                        else alert("Failed to save billboard.");
                      }}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-pixel text-[10px] px-4 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      SAVE
                    </button>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    const result = await runMonthlyRaffle(currentRafflePrize);
                    if (result.success) {
                      alert('🎉 The winner is: ' + result.winnerName + '! The prize has been added to your Fulfillment Center.');
                    } else {
                      alert(result.message);
                    }
                  }}
                  className="w-full bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 text-amber-50 font-pixel text-xs py-3 rounded-lg shadow-lg active:translate-y-0.5 transition-all cursor-pointer"
                >
                  🎲 DRAW MONTHLY WINNER NOW
                </button>
              </div>

              {/* Cloud Shredder Maintenance */}
              <div className="p-6 rounded-xl border border-red-900/50 bg-gradient-to-br from-[#201518] via-[#12131d] to-[#0a0b10] shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 font-pixel text-xs text-red-400 uppercase tracking-wider mb-2">
                    <Trash2 size={16} className="text-red-400" /> CLOUD STORAGE SHREDDER
                  </div>
                  <p className="text-xs font-mono text-zinc-400 leading-relaxed mb-4">
                    Purge tattered homework & PE photos from cloud storage to free up space. Pinned gallery art and student submission rows are kept 100% intact for analytics.
                  </p>
                </div>

                <button
                  disabled={isPurging}
                  onClick={async () => {
                    if (window.confirm("Permanently shred all unpinned student photos from the cloud bucket? Database rows will be preserved.")) {
                      setIsPurging(true);
                      const res = await purgeUnpinnedImages();
                      setIsPurging(false);
                      if (res.success) {
                        alert(`💥 Shredder Success! Purged ${res.count} tattered files from cloud storage!`);
                      } else {
                        alert(res.message);
                      }
                    }
                  }}
                  className="w-full bg-gradient-to-b from-red-700 to-red-900 hover:from-red-600 text-white font-pixel text-xs py-3 rounded-lg shadow-lg active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isPurging ? 'SHREDDING FILES...' : '🔥 SHRED UNPINNED IMAGES'}
                </button>
              </div>
            </div>

            {/* 3. CORE ACTION ARENA: PENDING APPROVALS (7 COLS) & WELLNESS LOGS (5 COLS) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Approvals Column (7 Columns) */}
              <div className="lg:col-span-7 p-6 rounded-xl border-2 border-[#2b2e42] bg-[#12131c] shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                    <h3 className="font-pixel text-sm text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                      <Search size={16} /> PENDING SUBMISSIONS ({pendingSubmissions.length})
                    </h3>
                  </div>

                  <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2 custom-scrollbar">
                    {pendingSubmissions.length === 0 ? (
                      <div className="p-12 text-center text-zinc-500 font-pixel text-xs">
                        ⚔️ No pending submissions waiting.
                      </div>
                    ) : (
                      pendingSubmissions.map(sub => {
                        const isBossStrike = sub.isBossStrike;
                        const questDetails = quests.find(q => q.id === sub.questId);
                        const title = isBossStrike ? "🔴 BOSS FINISHING BLOW" : questDetails?.title || `Quest #${sub.questId}`;
                        const imageQuestTypes = ['upload', 'scout-arts', 'scout-sports'];
                        const isImageSubmission = imageQuestTypes.includes(sub.type);
                        const proofUrl = sub.proofContent;

                        return (
                          <div 
                            key={sub.id} 
                            className={`p-4 rounded-xl border ${
                              isBossStrike 
                                ? 'border-red-500 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                                : 'border-white/10 bg-[#161824]'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                              <div>
                                <h4 className="font-pixel text-xs text-amber-200 font-bold">{title}</h4>
                                <p className="text-xs font-mono text-zinc-400 mt-0.5">
                                  Hero: <span className="text-cyan-300 font-bold">{sub.studentName}</span>
                                </p>
                              </div>

                              {isImageSubmission && proofUrl && (
                                <div className="flex gap-2">
                                  <a
                                    href={proofUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2.5 py-1 rounded bg-blue-900/60 hover:bg-blue-800 text-blue-200 font-pixel text-[9px] flex items-center gap-1 border border-blue-500/40"
                                  >
                                    <ExternalLink size={12} /> VIEW
                                  </a>
                                  <a
                                    href={proofUrl ? `${proofUrl}?download` : '#'}
                                    download
                                    className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-pixel text-[9px] flex items-center gap-1 border border-white/10"
                                  >
                                    <Download size={12} /> SAVE
                                  </a>
                                </div>
                              )}
                            </div>

                            {/* Proof Display Area */}
                            {isImageSubmission ? (
                              <div className="rounded-lg bg-black/60 p-2 border border-white/5 mb-3">
                                {proofUrl ? (
                                  <img 
                                    src={proofUrl} 
                                    alt="Proof" 
                                    className="w-full h-48 object-cover rounded border border-white/10" 
                                  />
                                ) : (
                                  <div className="h-24 flex items-center justify-center text-zinc-500 text-xs font-mono">No image attached</div>
                                )}
                              </div>
                            ) : (
                              <div className="p-3 rounded-lg bg-black/50 border border-white/5 text-xs font-mono text-zinc-300 italic mb-3">
                                {proofUrl || 'No content text.'}
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-white/5">
                              <button
                                onClick={() => approveSubmission(sub.id)}
                                className="flex-1 py-2 rounded-lg bg-green-700 hover:bg-green-600 text-white font-pixel text-[10px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                              >
                                <Check size={14} /> APPROVE
                              </button>

                              {sub.type === 'scout-arts' && (
                                <button
                                  onClick={async () => {
                                    const res = await toggleGalleryFeature(sub.id, true);
                                    if (res.success) alert("Artwork pinned to the Tavern Grove Gallery!");
                                    else alert("Failed to pin artwork.");
                                  }}
                                  className="py-2 px-3 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-500/40 font-pixel text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                                >
                                  📌 PIN GALLERY
                                </button>
                              )}

                              <button
                                onClick={async () => {
                                  const reason = feedback[sub.id] || 'Work did not meet requirements';
                                  const result = await rejectSubmission(sub.id, reason);
                                  if (result?.success) alert('Quest rejected.');
                                  else alert(result?.message || 'Rejection failed.');
                                }}
                                className="py-2 px-3 rounded-lg bg-red-900/60 hover:bg-red-800 text-red-200 border border-red-500/40 font-pixel text-[10px] flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <X size={14} /> REJECT
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              {/* Tavern Logs Column (5 Columns) */}
              <div className="lg:col-span-5 p-6 rounded-xl border-2 border-[#2b2e42] bg-[#12131c] shadow-xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                    <h3 className="font-pixel text-sm text-red-400 uppercase tracking-wider flex items-center gap-2">
                      <Heart size={16} /> TAVERN WELLNESS LOGS ({wellnessLogs.length})
                    </h3>
                  </div>

                  <div className="space-y-3 max-h-[580px] overflow-y-auto pr-2 custom-scrollbar">
                    {wellnessLogs.length === 0 ? (
                      <div className="p-12 text-center text-zinc-500 font-pixel text-xs">
                        🌿 No tavern check-ins recorded yet.
                      </div>
                    ) : (
                      wellnessLogs.map(log => (
                        <div 
                          key={log.id} 
                          className={`p-3.5 rounded-lg border flex justify-between items-center ${getFeelingBadge(log.feeling)}`}
                        >
                          <div>
                            <p className="font-pixel text-xs text-white font-bold">{log.studentName}</p>
                            <p className="text-[10px] font-mono text-zinc-400 mt-0.5">
                              {new Date(log.created_at || Date.now()).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="font-pixel text-xs font-bold uppercase tracking-wider">
                            {log.feeling}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. ATTRIBUTE MANAGEMENT (STRATEGY & EXECUTION POINTS) */}
            <div className="p-6 rounded-xl border-2 border-[#2b2e42] bg-[#12131c] shadow-xl">
              <h3 className="font-pixel text-sm text-purple-300 uppercase tracking-wider mb-4 flex items-center gap-2">
                <BookCopy size={16} /> ACADEMIC ATTRIBUTE MANAGEMENT
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="border-b border-white/10 text-zinc-400 font-pixel text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Student Name</th>
                      <th className="py-2.5 px-3">Midterm (Strategy)</th>
                      <th className="py-2.5 px-3">Final (Execution)</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-zinc-200">
                    {students.map(student => (
                      <tr key={student.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-bold text-white font-pixel text-xs">{student.name}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">Hero: {student.heroName}</div>
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            placeholder={`Current: ${student.midtermGPA !== null ? student.midtermGPA / 10 : 'N/A'}`}
                            value={gradeInputs[student.id]?.midterm ?? ''}
                            onChange={(e) => handleGradeChange(student.id, 'midterm', e.target.value)}
                            className="w-32 bg-black/80 border border-white/20 p-2 rounded text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <input
                            type="number"
                            placeholder={`Current: ${student.finalGPA !== null ? student.finalGPA / 10 : 'N/A'}`}
                            value={gradeInputs[student.id]?.final ?? ''}
                            onChange={(e) => handleGradeChange(student.id, 'final', e.target.value)}
                            className="w-32 bg-black/80 border border-white/20 p-2 rounded text-white font-mono text-xs focus:border-amber-400 focus:outline-none"
                          />
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleSaveGrades(student.id)}
                            className="px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white font-pixel text-[10px] rounded-lg transition-colors cursor-pointer"
                          >
                            <Save size={12} className="inline mr-1" /> SAVE
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 5. UNIFIED PRIZE FULFILLMENT & CLAIMS HUB */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Achievement Claims */}
              <div className="p-6 rounded-xl border-2 border-[#2b2e42] bg-[#12131c] shadow-xl">
                <h3 className="font-pixel text-xs text-yellow-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Star size={16} /> ACHIEVEMENT PRIZE CLAIMS
                </h3>
                
                {(() => {
                  const pendingClaims = (prizeClaims || []).filter(c => c.status === 'pending');
                  if (pendingClaims.length === 0) {
                    return <div className="p-6 text-center text-zinc-500 font-pixel text-[10px]">No pending achievement claims.</div>;
                  }
                  return (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                      {pendingClaims.map(claim => {
                        const student = students.find(s => s.id === claim.student_id);
                        const achievement = (ACHIEVEMENTS || []).find(a => a.id === claim.achievement_id);
                        return (
                          <div key={claim.id} className="p-3.5 rounded-lg bg-black/40 border border-white/10 flex justify-between items-center">
                            <div>
                              <div className="font-pixel text-xs text-white">{student?.heroName || student?.name}</div>
                              <div className="text-[10px] font-mono text-yellow-300">{achievement?.title || claim.achievement_id}</div>
                              <div className="text-[10px] font-mono text-zinc-400">Prize: {achievement?.realWorldPrize || 'Standard Prize'}</div>
                            </div>
                            <button
                              onClick={() => fulfillAchievementClaim(claim.id)}
                              className="px-3 py-1.5 rounded bg-green-700 hover:bg-green-600 text-white font-pixel text-[9px] cursor-pointer"
                            >
                              FULFILL
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>

              {/* Grand Raffle Deliveries */}
              <div className="p-6 rounded-xl border-2 border-[#2b2e42] bg-[#12131c] shadow-xl">
                <h3 className="font-pixel text-xs text-yellow-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Gift size={16} /> RAFFLE & MILESTONE DELIVERIES
                </h3>

                {(() => {
                  const pendingPrizes = (pendingPrizesList || []).filter(p => p.status === 'pending');
                  if (pendingPrizes.length === 0) {
                    return <div className="p-6 text-center text-zinc-500 font-pixel text-[10px]">All prizes delivered!</div>;
                  }
                  return (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                      {pendingPrizes.map(prize => {
                        const student = students.find(s => s.id === prize.student_id);
                        return (
                          <div key={prize.id} className="p-3.5 rounded-lg bg-black/40 border border-yellow-500/30 flex justify-between items-center">
                            <div>
                              <div className="font-pixel text-xs text-white">{student?.heroName || prize.student_name}</div>
                              <div className="text-xs font-pixel text-amber-300 font-bold">{prize.prize}</div>
                              <div className="text-[10px] font-mono text-zinc-400 italic">"{prize.reason}"</div>
                            </div>
                            <button
                              onClick={() => fulfillPendingPrize(prize.id)}
                              className="px-3 py-1.5 rounded bg-green-700 hover:bg-green-600 text-white font-pixel text-[9px] cursor-pointer"
                            >
                              DELIVERED
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* 6. GALLERY CURATION PANEL */}
            <div className="p-6 rounded-xl border-2 border-[#2b2e42] bg-[#12131c] shadow-xl">
              <h3 className="font-pixel text-sm text-purple-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                🎨 TAVERN GROVE GALLERY EXHIBITION
              </h3>
              
              {gallerySubmissions.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 font-pixel text-xs">
                  The gallery is empty. Pin student art from Pending Submissions to feature it here!
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {gallerySubmissions.map(art => (
                    <div key={art.id} className="p-3 rounded-lg bg-black/50 border border-white/10 flex flex-col justify-between">
                      <div>
                        <div className="font-pixel text-xs text-white mb-2">{art.studentName}</div>
                        <img src={art.proofContent} alt="Student Art" className="w-full h-32 object-cover rounded border border-white/10 mb-3" />
                      </div>
                      <button
                        onClick={async () => {
                          const res = await toggleGalleryFeature(art.id, false);
                          if (res.success) alert("Artwork unpinned from gallery.");
                        }}
                        className="w-full py-1.5 rounded bg-red-950/80 hover:bg-red-900 border border-red-500/40 text-red-200 font-pixel text-[9px] cursor-pointer"
                      >
                        UNPIN
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default TeacherDashboard;
