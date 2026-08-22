import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AboutCrusade() {
  const navigate = useNavigate();
  const MAP_BG = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/worldmap4.png";

  return (
    <div className="min-h-screen bg-[#0a0b10] text-stone-200 relative overflow-x-hidden font-sans select-none">
      {/* Background and Atmospheric Overlay */}
      <div className="fixed inset-0 z-0 h-full w-full pointer-events-none">
        <img src={MAP_BG} alt="World Map" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-[#0d0e15]/95 to-black"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-16 space-y-12">
        
        {/* Navigation & Main Title */}
        <div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#12131c] border border-amber-500/40 text-amber-300 font-pixel text-[10px] hover:border-amber-300 hover:text-white transition-all mb-8 shadow-lg active:translate-y-0.5"
          >
            <ArrowLeft size={16} /> RETURN TO THE REALM GATE
          </button>

          <div className="text-center space-y-4">
            <span className="px-3 py-1 rounded-full text-[10px] font-pixel text-amber-400 bg-amber-950/60 border border-amber-500/40 uppercase tracking-widest">
              Community Mission • Scarborough, Ontario
            </span>
            <h1 className="text-3xl md:text-5xl font-pixel text-yellow-400 leading-tight drop-shadow-[0_4px_16px_rgba(234,179,8,0.4)]">
              BRUXO'S CRUSADE
            </h1>
            <p className="font-mono text-xl md:text-2xl text-stone-300 max-w-3xl mx-auto leading-relaxed">
              Transforming academic disengagement into heroic perseverance through game-based learning, self-determination, and community values.
            </p>
          </div>
        </div>

        {/* SECTION 1: A SANCTUARY FOR STRUGGLING LEARNERS */}
        <section className="relative overflow-hidden p-6 md:p-10 rounded-xl border-2 border-[#2b2e42] bg-gradient-to-br from-[#1c1e2b] via-[#12131d] to-[#0a0b10] shadow-[0_16px_48px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.12)] space-y-6">
          <span className="absolute top-2 left-2 text-[9px] text-amber-500/50 select-none">✦</span>
          <span className="absolute top-2 right-2 text-[9px] text-amber-500/50 select-none">✦</span>

          <div>
            <span className="px-2.5 py-0.5 text-[9px] font-pixel text-amber-400 uppercase tracking-wider bg-amber-950/60 border border-amber-500/30 rounded">
              MISSION
            </span>
            <h2 className="font-pixel text-lg md:text-xl text-amber-100 tracking-wide mt-2">
              A SANCTUARY FOR STRUGGLING LEARNERS
            </h2>
            <div className="h-[1px] w-full mt-3 bg-gradient-to-r from-amber-500/40 via-amber-500/10 to-transparent" />
          </div>

          <div className="space-y-4 font-mono text-lg md:text-xl text-stone-300 leading-relaxed">
            <p>
              In every classroom, there are capable students who quietly fall behind. Traditional homework routines with standard worksheets, delayed feedback, and punitive grading can create anxiety instead of mastery. For students who need extra practice or struggle with daily accountability, conventional schooling can feel like a continuous uphill climb.
            </p>
            <p className="text-amber-200 bg-amber-950/30 p-4 rounded-xl border border-amber-500/30 font-mono">
              Bruxo's Crusade was created to serve as a supportive home for every learner. It provides a structured environment where effort is visibly recognized, accountability is gamified, and mistakes are treated as natural steps toward growth. In this realm, an incorrect answer is never a final defeat; it is simply a chance to try again and improve.
            </p>
          </div>
        </section>

        {/* SECTION 2: VOLUNTEER TEACHER DEVELOPMENT & REAL-TIME EVOLUTION */}
        <section className="relative overflow-hidden p-6 md:p-10 rounded-xl border-2 border-[#2b2e42] bg-gradient-to-br from-[#1c1e2b] via-[#12131d] to-[#0a0b10] shadow-[0_16px_48px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.12)] space-y-6">
          <span className="absolute top-2 left-2 text-[9px] text-cyan-500/50 select-none">✦</span>
          <span className="absolute top-2 right-2 text-[9px] text-cyan-500/50 select-none">✦</span>

          <div>
            <span className="px-2.5 py-0.5 text-[9px] font-pixel text-cyan-400 uppercase tracking-wider bg-cyan-950/60 border border-cyan-500/30 rounded">
              COMMUNITY DEVELOPMENT
            </span>
            <h2 className="font-pixel text-lg md:text-xl text-cyan-100 tracking-wide mt-2">
              VOLUNTEER FORGED IN ONTARIO & STUDENT COLLABORATION
            </h2>
            <div className="h-[1px] w-full mt-3 bg-gradient-to-r from-cyan-500/40 via-cyan-500/10 to-transparent" />
          </div>

          <div className="space-y-4 font-mono text-lg md:text-xl text-stone-300 leading-relaxed">
            <p>
              This entire platform was designed, programmed, and brought to life entirely on a volunteer basis by two Ontario educators. Recognizing the rapid evolution of technology and the growing disconnect between modern students and static assignments, the creators dedicated their personal time to build a dynamic learning platform tailored specifically for Ontario classrooms.
            </p>
            <p>
              Because Bruxo's Crusade was developed in-house without outside commercial constraints, it is an iterative, living project. The creators deploy improvements in real time and actively collaborate with their students to test new ideas, balance quest rewards, and introduce new characters. The students are not merely users; they are co-designers helping shape the future of their learning environment.
            </p>
          </div>
        </section>

        {/* SECTION 3: THE ONTARIO BENCHMARKS (DATA & EVIDENCE) */}
        <section className="relative overflow-hidden p-6 md:p-10 rounded-xl border-2 border-[#2b2e42] bg-gradient-to-br from-[#1c1e2b] via-[#12131d] to-[#0a0b10] shadow-[0_16px_48px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.12)] space-y-6">
          <span className="absolute top-2 left-2 text-[9px] text-amber-500/50 select-none">✦</span>
          <span className="absolute top-2 right-2 text-[9px] text-amber-500/50 select-none">✦</span>

          <div>
            <span className="px-2.5 py-0.5 text-[9px] font-pixel text-amber-400 uppercase tracking-wider bg-amber-950/60 border border-amber-500/30 rounded">
              DATA & CONTEXT
            </span>
            <h2 className="font-pixel text-lg md:text-xl text-amber-100 tracking-wide mt-2">
              THE ONTARIO REALITY: BRIDGING THE GRADE 5 TO 6 GAP
            </h2>
            <div className="h-[1px] w-full mt-3 bg-gradient-to-r from-amber-500/40 via-amber-500/10 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-pixel text-center">
            <div className="p-5 rounded-lg bg-black/60 border border-cyan-500/30 shadow-inner">
              <div className="text-3xl text-cyan-300 font-bold mb-2">51%</div>
              <div className="text-[9px] text-zinc-400 uppercase leading-relaxed">
                Ontario Grade 6 Students Meeting Math Standards (EQAO)
              </div>
            </div>
            <div className="p-5 rounded-lg bg-black/60 border border-amber-500/30 shadow-inner">
              <div className="text-3xl text-amber-300 font-bold mb-2">49%</div>
              <div className="text-[9px] text-zinc-400 uppercase leading-relaxed">
                Students Transitioning to Middle School with Numeracy Gaps
              </div>
            </div>
            <div className="p-5 rounded-lg bg-black/60 border border-purple-500/30 shadow-inner">
              <div className="text-3xl text-purple-300 font-bold mb-2">36 WKS</div>
              <div className="text-[9px] text-zinc-400 uppercase leading-relaxed">
                Structured Daily Practice to Cement Core Fluency
              </div>
            </div>
          </div>

          <p className="font-mono text-lg md:text-xl text-stone-400 leading-relaxed">
            Provincial assessment results from the Education Quality and Accountability Office (EQAO) show that elementary mathematics remains a significant hurdle. In recent provincial assessments, only about half of Ontario Grade 6 students achieved the provincial standard. Grade 5 represents a critical window where mental arithmetic and problem-solving confidence must be solidified. Bruxo's Crusade directly targets this need through daily 120-second arithmetic gauntlets and structured multi-step logic puzzles.
          </p>
        </section>

        {/* SECTION 4: THE POWER OF VIDEO GAMES & MOTIVATION */}
        <section className="relative overflow-hidden p-6 md:p-10 rounded-xl border-2 border-[#2b2e42] bg-gradient-to-br from-[#1c1e2b] via-[#12131d] to-[#0a0b10] shadow-[0_16px_48px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.12)] space-y-6">
          <span className="absolute top-2 left-2 text-[9px] text-yellow-500/50 select-none">✦</span>
          <span className="absolute top-2 right-2 text-[9px] text-yellow-500/50 select-none">✦</span>

          <div>
            <span className="px-2.5 py-0.5 text-[9px] font-pixel text-yellow-400 uppercase tracking-wider bg-yellow-950/60 border border-yellow-500/30 rounded">
              EDUCATIONAL SCIENCE
            </span>
            <h2 className="font-pixel text-lg md:text-xl text-yellow-100 tracking-wide mt-2">
              HARNESSING THE POWER OF VIDEO GAMES
            </h2>
            <div className="h-[1px] w-full mt-3 bg-gradient-to-r from-yellow-500/40 via-yellow-500/10 to-transparent" />
          </div>

          <div className="space-y-4 font-mono text-lg md:text-xl text-stone-300 leading-relaxed">
            <p>
              The creators have a deep, lifelong passion for video games and have witnessed firsthand their unmatched ability to engage, teach, and inspire perseverance. A player will gladly spend hours solving a difficult game level, yet may feel defeated by a traditional worksheet within minutes.
            </p>
            <p>
              Educational psychology explains this through Self-Determination Theory (established by researchers Edward Deci and Richard Ryan). Meaningful games succeed because they fulfill three essential human needs:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-pixel text-xs">
            <div className="p-5 rounded-lg bg-black/60 border border-white/10 space-y-2">
              <div className="text-amber-400 text-sm">1. AUTONOMY</div>
              <p className="font-sans text-xs text-zinc-300 leading-relaxed font-normal">
                Students choose their daily quests, customize their character outfits, and select their personal learning paths across math, science, and the arts.
              </p>
            </div>
            <div className="p-5 rounded-lg bg-black/60 border border-white/10 space-y-2">
              <div className="text-cyan-400 text-sm">2. COMPETENCE</div>
              <p className="font-sans text-xs text-zinc-300 leading-relaxed font-normal">
                Instant, verifiable feedback. Leveling up, earning Gold, and gaining Experience Points provides clear evidence that daily effort creates genuine mastery.
              </p>
            </div>
            <div className="p-5 rounded-lg bg-black/60 border border-white/10 space-y-2">
              <div className="text-purple-400 text-sm">3. RELATEDNESS</div>
              <p className="font-sans text-xs text-zinc-300 leading-relaxed font-normal">
                Shared classroom goals, collective boss encounters, and growth-oriented leaderboards unite students as a supportive team.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 5: SCARBOROUGH ROOTS & GUYANESE HERITAGE */}
        <section className="relative overflow-hidden p-6 md:p-10 rounded-xl border-2 border-amber-500/40 bg-gradient-to-br from-[#1c1e2b] via-[#12131d] to-[#0a0b10] shadow-[0_16px_48px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.12)] space-y-6">
          <span className="absolute top-2 left-2 text-[9px] text-amber-500/50 select-none">✦</span>
          <span className="absolute top-2 right-2 text-[9px] text-amber-500/50 select-none">✦</span>

          <div>
            <span className="px-2.5 py-0.5 text-[9px] font-pixel text-amber-400 uppercase tracking-wider bg-amber-950/60 border border-amber-500/30 rounded">
              OUR FOUNDATION
            </span>
            <h2 className="font-pixel text-lg md:text-xl text-amber-100 tracking-wide mt-2">
              SCARBOROUGH ROOTS & GUYANESE HERITAGE
            </h2>
            <div className="h-[1px] w-full mt-3 bg-gradient-to-r from-amber-500/40 via-amber-500/10 to-transparent" />
          </div>

          <div className="space-y-4 font-mono text-lg md:text-xl text-stone-300 leading-relaxed">
            <p>
              Bruxo's Crusade was born in Scarborough, Ontario. As educators rooted in Scarborough and other diverse Canadian communities, the creators understand the immense talent present in neighborhood schools.
            </p>
            <p>
              The Game Master was raised by traditional Guyanese immigrant parents who passed down a clear and lasting principle: true learning is not an innate gift, but the result of steady practice, self-discipline, and honest daily effort. In a traditional Guyanese household, showing up consistently and seeing things through to completion is the highest standard of character.
            </p>
            <p>
              These core values are woven into every part of the game. Non-resetting login streaks, verified homework dispatches, and comeback leaderboards all reinforce the truth that small daily actions build lifelong confidence and capability.
            </p>
          </div>
        </section>

        {/* SECTION 6: REAL-WORLD STAKES & REWARDS */}
        <section className="relative overflow-hidden p-6 md:p-10 rounded-xl border-2 border-[#2b2e42] bg-gradient-to-br from-[#1c1e2b] via-[#12131d] to-[#0a0b10] shadow-[0_16px_48px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.12)] space-y-6 text-center">
          <span className="absolute top-2 left-2 text-[9px] text-yellow-500/50 select-none">✦</span>
          <span className="absolute top-2 right-2 text-[9px] text-yellow-500/50 select-none">✦</span>

          <div>
            <span className="px-2.5 py-0.5 text-[9px] font-pixel text-yellow-400 uppercase tracking-wider bg-yellow-950/60 border border-yellow-500/30 rounded">
              TANGIBLE RECOGNITION
            </span>
            <h2 className="font-pixel text-lg md:text-2xl text-yellow-300 tracking-wide mt-2">
              BRIDGING VIRTUAL EFFORT WITH REAL-WORLD REWARDS
            </h2>
            <div className="h-[1px] w-full mt-3 bg-gradient-to-r from-yellow-500/40 via-yellow-500/10 to-transparent" />
          </div>

          <p className="font-mono text-lg md:text-xl text-stone-300 max-w-3xl mx-auto leading-relaxed">
            To celebrate sustained dedication throughout the school year, Bruxo's Crusade connects virtual achievements with real-world prizes. Students who complete the nine-month crusade and reach Level 50, alongside those who verify 50 and 100 homework dispatches, earn Scarborough Town Centre and Oxford Properties Gift Cards.
          </p>

          <div className="pt-4">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 rounded-xl font-pixel text-xs sm:text-sm text-stone-950 bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 border-2 border-yellow-300 shadow-[0_3px_0_#78350f,0_6px_20px_rgba(234,179,8,0.5)] active:translate-y-1 transition-all"
            >
              ENTER THE REALM & BEGIN THE CRUSADE
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
