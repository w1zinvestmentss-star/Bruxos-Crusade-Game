import React, { useState, useMemo } from 'react';

export default function RealmAnalytics({ profiles = [], submissions = [] }) {
  const [subTab, setSubTab] = useState('donor'); // 'donor' | 'parent' | 'student'
  const [daysRange, setDaysRange] = useState(14);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  // 1. Calculate Aggregate Global Telemetry
  const globalMetrics = useMemo(() => {
    const totalStudents = profiles.length;
    if (totalStudents === 0) {
      return {
        totalStudents: 0,
        totalQuestions: 0,
        totalHomework: 0,
        totalSports: 0,
        totalArts: 0,
        totalJournals: 0,
        totalWellness: 0,
        totalBosses: 0,
        totalXP: 0,
        totalGold: 0,
        avgActiveDays: 0,
        avgStrategy: 0,
        avgExecution: 0,
      };
    }

    let questions = 0;
    let homework = 0;
    let sports = 0;
    let arts = 0;
    let journals = 0;
    let wellness = 0;
    let bosses = 0;
    let xp = 0;
    let gold = 0;
    let totalDays = 0;
    let strategySum = 0;
    let executionSum = 0;

    profiles.forEach((p) => {
      // Academic Questions Solved
      const quizzes = p.quiz_quests_completed ?? p.quizQuestsCompleted ?? 0;
      const multiStep = p.multi_step_quests_completed ?? p.multiStepQuestsCompleted ?? 0;
      const ciphers = p.cipher_quests_completed ?? p.cipherQuestsCompleted ?? 0;
      const gauntlet = p.gauntlet_quests_completed ?? p.gauntletQuestsCompleted ?? 0;
      const incantations = p.incantation_quests_completed ?? p.incantationQuestsCompleted ?? 0;
      const scenarios = p.scenario_quests_completed ?? p.scenarioQuestsCompleted ?? 0;
      questions += (quizzes + multiStep + ciphers + gauntlet + incantations + scenarios);

      // Submissions Counters
      homework += (p.upload_quests_completed ?? p.uploadQuestsCompleted ?? 0);
      sports += (p.sports_quests_completed ?? p.sportsQuestsCompleted ?? 0);
      arts += (p.arts_quests_completed ?? p.artsQuestsCompleted ?? 0);
      journals += (p.journal_quests_completed ?? p.journalQuestsCompleted ?? 0);
      wellness += (p.wellness_quests_completed ?? p.wellnessQuestsCompleted ?? 0);

      // Bosses & Economy
      const defeatedList = p.defeated_bosses ?? p.defeatedBosses ?? [];
      bosses += Array.isArray(defeatedList) ? defeatedList.length : 0;
      xp += (p.xp || 0);
      gold += (p.gold || 0);
      totalDays += (p.login_streak ?? p.loginStreak ?? 0);

      // Academic Scaling
      strategySum += (p.midterm_gpa ?? p.midtermGPA ?? 0);
      executionSum += (p.final_gpa ?? p.finalGPA ?? 0);
    });

    return {
      totalStudents,
      totalQuestions: questions,
      totalHomework: homework,
      totalSports: sports,
      totalArts: arts,
      totalJournals: journals,
      totalWellness: wellness,
      totalBosses: bosses,
      totalXP: xp,
      totalGold: gold,
      avgActiveDays: Math.round(totalDays / totalStudents),
      avgStrategy: Math.round(strategySum / totalStudents),
      avgExecution: Math.round(executionSum / totalStudents),
    };
  }, [profiles]);

  // Calculate Fortnightly Submissions per Student
  const parentReports = useMemo(() => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - Number(daysRange));

    const recentSubs = submissions.filter((s) => {
      if (s.status !== 'approved') return false;
      const rawDate = s.created_at || s.timestamp;
      if (!rawDate) return false;
      const subDate = new Date(rawDate);
      return subDate >= cutoffDate;
    });

    return profiles.map((p) => {
      const pId = p.id;
      const studentSubs = recentSubs.filter((s) => (s.student_id || s.studentId) === pId);

      const hwCount = studentSubs.filter((s) => s.type === 'upload').length;
      const quizCount = studentSubs.filter((s) => ['quiz', 'blitz', 'gauntlet', 'multi-step', 'incantation', 'scenario', 'cipher'].includes(s.type)).length;
      const sportsCount = studentSubs.filter((s) => s.type === 'scout-sports' || s.type === 'sports').length;
      const artsCount = studentSubs.filter((s) => s.type === 'scout-arts' || s.type === 'arts').length;
      const journalCount = studentSubs.filter((s) => s.type === 'journal').length;
      const wellnessCount = studentSubs.filter((s) => s.type === 'wellness').length;

      const totalCycleQuests = studentSubs.length;
      const maxExpectedQuests = daysRange * 2; // Assuming ~2 quests/day target
      const completionRate = Math.min(100, Math.round((totalCycleQuests / (maxExpectedQuests || 1)) * 100));

      // Dynamic Discussion Hook for Parents
      let discussionPrompt = `Ask your hero about their recent adventures and what realm quest they enjoyed the most!`;
      if (hwCount >= 2) {
        discussionPrompt = `Celebrate your hero for staying 100% consistent with physical homework dispatches this cycle!`;
      } else if (quizCount >= 5) {
        discussionPrompt = `Ask your hero about their rapid mental math and speed run victories in the archives!`;
      } else if (sportsCount >= 1 || artsCount >= 1) {
        discussionPrompt = `Ask your hero to show you the creative or physical activity they logged for the guild!`;
      }

      const currentLvl = Math.floor((p.xp || 0) / 1000) + 1;
      const xpToNextLvl = 1000 - ((p.xp || 0) % 1000);

      return {
        profile: p,
        hwCount,
        quizCount,
        sportsCount,
        artsCount,
        journalCount,
        wellnessCount,
        totalCycleQuests,
        completionRate,
        discussionPrompt,
        currentLvl,
        xpToNextLvl,
      };
    });
  }, [profiles, submissions, daysRange]);

  // Active Selected Student Report for Live Preview
  const activeReport = parentReports.find((r) => r.profile.id === selectedStudentId) || parentReports[0];

  // Copy Email Summary to Clipboard
  const handleCopyEmail = (report) => {
    if (!report) return;
    const heroName = report.profile.hero_name || report.profile.heroName || 'Hero';
    const realName = report.profile.real_name || report.profile.realName || heroName;
    const text = `Greetings! Here is a ${daysRange}-day progress update for ${realName} in Bruxo's Crusade:
• Level: ${report.currentLvl} (${report.xpToNextLvl} XP to next level)
• Quests Completed in Past ${daysRange} Days: ${report.totalCycleQuests}
• Homework Dispatches Verified: ${report.hwCount}
• Academic Blitzes Conquered: ${report.quizCount}
• Parent Discussion Idea: ${report.discussionPrompt}

Thank you for supporting our hero's learning journey!`;

    navigator.clipboard.writeText(text);
    alert(`Parent email summary for ${heroName} copied to clipboard!`);
  };

  // Handle Print Action for PDF Export
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Sub-Tab Navigation Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-white/10 bg-[#12131c] shadow-lg print:hidden">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSubTab('donor')}
            className={`px-4 py-2 rounded-lg font-pixel text-xs tracking-wider uppercase transition-all ${
              subTab === 'donor'
                ? 'bg-amber-600 text-amber-50 shadow-[0_2px_0_#78350f]'
                : 'bg-[#1a1c28] text-zinc-400 hover:text-zinc-200 border border-white/5'
            }`}
          >
            🏛 Global / Donor Deck
          </button>
          <button
            onClick={() => setSubTab('parent')}
            className={`px-4 py-2 rounded-lg font-pixel text-xs tracking-wider uppercase transition-all ${
              subTab === 'parent'
                ? 'bg-amber-600 text-amber-50 shadow-[0_2px_0_#78350f]'
                : 'bg-[#1a1c28] text-zinc-400 hover:text-zinc-200 border border-white/5'
            }`}
          >
            👨👩👧 Bi-Weekly Parent Snapshots
          </button>
          <button
            onClick={() => setSubTab('student')}
            className={`px-4 py-2 rounded-lg font-pixel text-xs tracking-wider uppercase transition-all ${
              subTab === 'student'
                ? 'bg-amber-600 text-amber-50 shadow-[0_2px_0_#78350f]'
                : 'bg-[#1a1c28] text-zinc-400 hover:text-zinc-200 border border-white/5'
            }`}
          >
            🎓 Student Hero Dossiers
          </button>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-lg font-pixel text-xs tracking-wider uppercase bg-gradient-to-b from-cyan-600 to-cyan-800 hover:from-cyan-500 hover:to-cyan-700 text-cyan-50 border-t border-cyan-400/40 shadow-[0_3px_0_#0e4554] active:translate-y-0.5"
        >
          📄 Export / Print Report
        </button>
      </div>

      {/* SUB-VIEW 1: GLOBAL DONOR & IMPACT DECK */}
      {subTab === 'donor' && (
        <div className="space-y-6">
          {/* Executive Overview Banner */}
          <div className="relative overflow-hidden p-6 md:p-8 rounded-xl border-2 border-[#2f3245] bg-gradient-to-br from-[#1c1e2b] via-[#12131d] to-[#0a0b10] shadow-2xl">
            <span className="absolute top-2 left-2 text-[9px] text-amber-500/60 select-none">✦</span>
            <span className="absolute top-2 right-2 text-[9px] text-amber-500/60 select-none">✦</span>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6 mb-6">
              <div>
                <span className="px-2.5 py-0.5 text-[10px] font-pixel text-amber-400 uppercase tracking-widest bg-amber-950/50 border border-amber-500/30 rounded">
                  Cohort Impact & Telemetry
                </span>
                <h2 className="font-pixel text-xl md:text-2xl text-amber-100 tracking-wide mt-2">
                  REALM PROGRESS & ENGAGEMENT REPORT
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Grade 5 Cohort • Cumulative Academic and Holistic Growth Data
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-zinc-400 font-pixel">TOTAL ACTIVE HEROES</div>
                  <div className="text-2xl font-pixel text-amber-300 font-bold">{globalMetrics.totalStudents} Students</div>
                </div>
              </div>
            </div>

            {/* 6 Key Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {/* Card 1: Academic Questions */}
              <div className="p-4 rounded-lg border border-cyan-500/30 bg-cyan-950/20 shadow-inner">
                <div className="text-cyan-400 text-xs font-pixel uppercase tracking-wider mb-1">📚 Questions Solved</div>
                <div className="text-2xl md:text-3xl font-pixel text-cyan-200 font-bold">
                  {globalMetrics.totalQuestions.toLocaleString()}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">Ontario Math, Science & History</div>
              </div>

              {/* Card 2: Homework Dispatched */}
              <div className="p-4 rounded-lg border border-amber-500/30 bg-amber-950/20 shadow-inner">
                <div className="text-amber-400 text-xs font-pixel uppercase tracking-wider mb-1">📜 Homework Dispatches</div>
                <div className="text-2xl md:text-3xl font-pixel text-amber-200 font-bold">
                  {globalMetrics.totalHomework.toLocaleString()}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">Verified physical assignments</div>
              </div>

              {/* Card 3: Athletics & PE */}
              <div className="p-4 rounded-lg border border-red-500/30 bg-red-950/20 shadow-inner">
                <div className="text-red-400 text-xs font-pixel uppercase tracking-wider mb-1">🏃 PE & Athletics Feats</div>
                <div className="text-2xl md:text-3xl font-pixel text-red-200 font-bold">
                  {globalMetrics.totalSports.toLocaleString()}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">Real-world fitness sessions</div>
              </div>

              {/* Card 4: Creative Arts */}
              <div className="p-4 rounded-lg border border-purple-500/30 bg-purple-950/20 shadow-inner">
                <div className="text-purple-400 text-xs font-pixel uppercase tracking-wider mb-1">🎨 Creative Works</div>
                <div className="text-2xl md:text-3xl font-pixel text-purple-200 font-bold">
                  {globalMetrics.totalArts.toLocaleString()}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">Artwork & music submissions</div>
              </div>

              {/* Card 5: Reflections & Mindfulness */}
              <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-950/20 shadow-inner">
                <div className="text-emerald-400 text-xs font-pixel uppercase tracking-wider mb-1">🌿 Reflections & Wellness</div>
                <div className="text-2xl md:text-3xl font-pixel text-emerald-200 font-bold">
                  {(globalMetrics.totalJournals + globalMetrics.totalWellness).toLocaleString()}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">Mindful entries & check-ins</div>
              </div>

              {/* Card 6: Dungeon Bosses Slain */}
              <div className="p-4 rounded-lg border border-yellow-500/30 bg-yellow-950/20 shadow-inner">
                <div className="text-yellow-400 text-xs font-pixel uppercase tracking-wider mb-1">👑 Bosses Vanquished</div>
                <div className="text-2xl md:text-3xl font-pixel text-yellow-200 font-bold">
                  {globalMetrics.totalBosses.toLocaleString()}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">Major academic milestones unlocked</div>
              </div>
            </div>
          </div>

          {/* Effort Breakdown & Consistency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Subject Distribution */}
            <div className="p-6 rounded-xl border border-white/10 bg-[#12131c] shadow-lg">
              <h3 className="font-pixel text-sm text-amber-200 uppercase tracking-wider mb-4">
                📊 Effort Distribution Across Pillars
              </h3>
              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between text-xs font-pixel text-zinc-300 mb-1">
                    <span>Curriculum Blitzes & Speed Runs</span>
                    <span className="text-cyan-300">{globalMetrics.totalQuestions}</span>
                  </div>
                  <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-pixel text-zinc-300 mb-1">
                    <span>Homework Dispatches (Uploads)</span>
                    <span className="text-amber-300">{globalMetrics.totalHomework}</span>
                  </div>
                  <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, (globalMetrics.totalHomework / (globalMetrics.totalQuestions || 1)) * 100)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-pixel text-zinc-300 mb-1">
                    <span>Physical Activity & Fitness (PE)</span>
                    <span className="text-red-300">{globalMetrics.totalSports}</span>
                  </div>
                  <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${Math.min(100, (globalMetrics.totalSports / (globalMetrics.totalQuestions || 1)) * 100)}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-pixel text-zinc-300 mb-1">
                    <span>Creative Arts & Music</span>
                    <span className="text-purple-300">{globalMetrics.totalArts}</span>
                  </div>
                  <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min(100, (globalMetrics.totalArts / (globalMetrics.totalQuestions || 1)) * 100)}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Habit & Retention Metrics */}
            <div className="p-6 rounded-xl border border-white/10 bg-[#12131c] shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="font-pixel text-sm text-amber-200 uppercase tracking-wider mb-4">
                  ⏳ Engagement & Habit Consistency
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-xs text-zinc-400 font-pixel">AVG. ACTIVE REALM DAYS</span>
                    <span className="text-lg font-pixel text-amber-300 font-bold">{globalMetrics.avgActiveDays} Days / Student</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-xs text-zinc-400 font-pixel">TOTAL EXPERIENCE (XP) GENERATED</span>
                    <span className="text-lg font-pixel text-cyan-300 font-bold">{globalMetrics.totalXP.toLocaleString()} XP</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-white/5">
                    <span className="text-xs text-zinc-400 font-pixel">TOTAL GOLD EARNED IN ECONOMY</span>
                    <span className="text-lg font-pixel text-yellow-400 font-bold">{globalMetrics.totalGold.toLocaleString()} G</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 text-[11px] text-zinc-500 italic">
                * Cumulative telemetry tracked from authentic in-game submissions, verification proofs, and timed academic gauntlets.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: BI-WEEKLY PARENT SNAPSHOT ENGINE */}
      {subTab === 'parent' && (
        <div className="space-y-6">
          {/* Controls Bar (Hidden during Print) */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-white/10 bg-[#12131c] print:hidden">
            <div className="flex items-center gap-3">
              <label className="text-xs font-pixel text-zinc-300 uppercase">Cycle Window:</label>
              <select
                value={daysRange}
                onChange={(e) => setDaysRange(Number(e.target.value))}
                className="px-3 py-1.5 rounded-lg bg-black border border-white/20 text-xs font-pixel text-amber-300 focus:outline-none"
              >
                <option value={7}>Last 7 Days (1 Week)</option>
                <option value={14}>Last 14 Days (Bi-Weekly)</option>
                <option value={30}>Last 30 Days (Monthly)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-lg font-pixel text-xs tracking-wider uppercase bg-gradient-to-b from-amber-600 to-amber-800 hover:from-amber-500 text-amber-50 border-t border-amber-400/40 shadow-[0_2px_0_#78350f]"
              >
                🖨 Batch Print All ({parentReports.length} Cards)
              </button>
            </div>
          </div>

          {/* Split Screen on Desktop: Classroom Table (Left) + Card Preview (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 print:hidden">
            {/* Student Roster Table (Left 7 Cols) */}
            <div className="lg:col-span-7 p-5 rounded-xl border border-white/10 bg-[#12131c] shadow-xl overflow-hidden">
              <h3 className="font-pixel text-sm text-amber-200 uppercase tracking-wider mb-3">
                📋 Student Fortnightly Progress ({parentReports.length} Heroes)
              </h3>
              <div className="overflow-x-auto max-h-[520px] overflow-y-auto">
                <table className="w-full text-left text-xs font-pixel">
                  <thead className="sticky top-0 bg-[#181a26] text-zinc-400 border-b border-white/10">
                    <tr>
                      <th className="py-2.5 px-3">Hero</th>
                      <th className="py-2.5 px-2">HW</th>
                      <th className="py-2.5 px-2">Academic</th>
                      <th className="py-2.5 px-2">Total</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-zinc-300">
                    {parentReports.map((r) => {
                      const heroName = r.profile.hero_name || r.profile.heroName || 'Unknown Hero';
                      const realName = r.profile.real_name || r.profile.realName || 'No Name';
                      const isSelected = (activeReport?.profile.id === r.profile.id);

                      return (
                        <tr
                          key={r.profile.id}
                          onClick={() => setSelectedStudentId(r.profile.id)}
                          className={`cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-amber-950/40 text-amber-200'
                              : 'hover:bg-white/5'
                          }`}
                        >
                          <td className="py-3 px-3">
                            <div className="font-bold">{heroName}</div>
                            <div className="text-[10px] text-zinc-500 font-sans">{realName}</div>
                          </td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] ${r.hwCount > 0 ? 'bg-amber-950 text-amber-300 border border-amber-500/30' : 'text-zinc-500'}`}>
                              {r.hwCount} HW
                            </span>
                          </td>
                          <td className="py-3 px-2 text-cyan-300">{r.quizCount}</td>
                          <td className="py-3 px-2 font-bold text-amber-300">{r.totalCycleQuests}</td>
                          <td className="py-3 px-3 text-right space-x-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyEmail(r);
                              }}
                              className="px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[10px] text-zinc-300"
                            >
                              📋 Copy
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Live Card Preview (Right 5 Cols) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-xs text-zinc-400 uppercase tracking-wider">Preview Card</span>
                <button
                  onClick={() => handleCopyEmail(activeReport)}
                  className="px-3 py-1 rounded bg-amber-950 border border-amber-500/40 text-amber-300 font-pixel text-[10px]"
                >
                  📋 Copy Email Text
                </button>
              </div>

              {activeReport && (
                <div className="p-6 rounded-xl border-2 border-amber-500/40 bg-gradient-to-br from-[#1c1e2b] via-[#12131d] to-[#0a0b10] shadow-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <span className="px-2 py-0.5 text-[9px] font-pixel text-amber-400 uppercase bg-amber-950/60 border border-amber-500/30 rounded">
                        Fortnightly Progress Dispatch
                      </span>
                      <h4 className="font-pixel text-base text-amber-100 mt-1">
                        {activeReport.profile.hero_name || activeReport.profile.heroName}
                      </h4>
                      <div className="text-xs text-zinc-400 font-sans">
                        {activeReport.profile.real_name || activeReport.profile.realName} • Grade 5
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-pixel text-xs text-cyan-300 font-bold">LVL {activeReport.currentLvl}</div>
                      <div className="text-[10px] text-zinc-400 font-pixel">{activeReport.xpToNextLvl} XP to next</div>
                    </div>
                  </div>

                  {/* Quick Stat Badges */}
                  <div className="grid grid-cols-2 gap-2 text-center font-pixel">
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/10">
                      <div className="text-lg text-amber-300">{activeReport.totalCycleQuests}</div>
                      <div className="text-[9px] text-zinc-400 uppercase">Quests Completed</div>
                    </div>
                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/10">
                      <div className="text-lg text-cyan-300">{activeReport.hwCount}</div>
                      <div className="text-[9px] text-zinc-400 uppercase">HW Verified</div>
                    </div>
                  </div>

                  {/* Academic & Holistic Breakdown */}
                  <div className="space-y-1.5 text-xs text-zinc-300 font-pixel">
                    <div className="flex justify-between">
                      <span>📚 Academic Speed Runs:</span>
                      <span className="text-cyan-300 font-bold">{activeReport.quizCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🏃 Physical Activity Sessions:</span>
                      <span className="text-red-300 font-bold">{activeReport.sportsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🎨 Creative Arts Projects:</span>
                      <span className="text-purple-300 font-bold">{activeReport.artsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>🌿 Reflections & Mindfulness:</span>
                      <span className="text-emerald-300 font-bold">{activeReport.journalCount + activeReport.wellnessCount}</span>
                    </div>
                  </div>

                  {/* Discussion Prompt */}
                  <div className="p-3 rounded-lg bg-amber-950/30 border border-amber-500/30">
                    <div className="text-[10px] font-pixel text-amber-400 uppercase mb-1">💡 Dinner Table Discussion Idea:</div>
                    <p className="text-xs text-amber-200/90 font-sans leading-relaxed">
                      "{activeReport.discussionPrompt}"
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PRINT-ONLY BATCH CONTAINER (Renders clean white/parchment slips when printing) */}
          <div className="hidden print:grid print:grid-cols-2 print:gap-6 print:p-4 text-black bg-white">
            {parentReports.map((r) => {
              const heroName = r.profile.hero_name || r.profile.heroName || 'Hero';
              const realName = r.profile.real_name || r.profile.realName || heroName;

              return (
                <div key={r.profile.id} className="p-6 border-2 border-black rounded-lg space-y-3 break-inside-avoid">
                  <div className="flex justify-between border-b-2 border-black pb-2">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-widest text-zinc-600">Bruxo's Crusade • {daysRange}-Day Progress</div>
                      <div className="text-lg font-bold">{realName} ({heroName})</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">Level {r.currentLvl}</div>
                      <div className="text-xs text-zinc-600">{r.xpToNextLvl} XP to next lvl</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="p-2 border border-black rounded">
                      <div className="text-base font-bold">{r.totalCycleQuests}</div>
                      <div>Quests Completed</div>
                    </div>
                    <div className="p-2 border border-black rounded">
                      <div className="text-base font-bold">{r.hwCount}</div>
                      <div>Homework Dispatches</div>
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span>Academic Blitzes:</span>
                      <span className="font-bold">{r.quizCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>PE & Athletics:</span>
                      <span className="font-bold">{r.sportsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Creative Arts:</span>
                      <span className="font-bold">{r.artsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Daily Reflections:</span>
                      <span className="font-bold">{r.journalCount + r.wellnessCount}</span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-zinc-100 border border-zinc-300 rounded text-xs">
                    <strong>Parent Discussion Idea:</strong> "{r.discussionPrompt}"
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: PLACEHOLDER FOR STAGE 3 */}
      {subTab === 'student' && (
        <div className="p-12 text-center rounded-xl border border-white/10 bg-[#12131c]">
          <div className="text-3xl mb-3">🎓</div>
          <h3 className="font-pixel text-lg text-amber-200 mb-2">Stage 3: Student Hero Legacy Dossiers</h3>
          <p className="text-sm text-zinc-400 max-w-md mx-auto">
            Ready to be activated in Stage 3. Will feature individual student selectors and printable parchment certificates of achievement.
          </p>
        </div>
      )}
    </div>
  );
}
