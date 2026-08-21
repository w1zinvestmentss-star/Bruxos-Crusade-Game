import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, ShieldCheck, HeartHandshake, Award, Sparkles, Brain, Flame } from 'lucide-react';

export default function AboutCrusade() {
  const navigate = useNavigate();
  const MAP_BG = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/worldmap4.png";

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 relative overflow-x-hidden font-sans">
      {/* Background & Atmospheric Overlay */}
      <div className="fixed inset-0 z-0 h-full w-full pointer-events-none">
        <img src={MAP_BG} alt="World Map" className="w-full h-full object-cover opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-stone-950/95 to-black"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8 md:py-16 space-y-16">
        
        {/* Navigation & Header */}
        <div>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/60 border border-amber-500/40 text-amber-300 font-['Press_Start_2P'] text-[10px] hover:border-amber-300 hover:text-white transition-all mb-8 shadow-lg"
          >
            <ArrowLeft size={16} /> RETURN TO THE REALM GATE
          </button>

          <div className="text-center space-y-4">
            <span className="px-3 py-1 rounded-full text-xs font-['Press_Start_2P'] text-amber-400 bg-amber-950/60 border border-amber-500/40 uppercase tracking-widest">
              Pedagogical Manifesto • Scarborough, Ontario
            </span>
            <h1 className="text-3xl md:text-5xl font-['Press_Start_2P'] text-yellow-400 leading-tight drop-shadow-[0_4px_16px_rgba(234,179,8,0.4)]">
              BRUXO'S CRUSADE
            </h1>
            <p className="font-['VT323'] text-2xl md:text-3xl text-stone-300 max-w-3xl mx-auto leading-relaxed">
              Transforming academic disengagement into heroic perseverance through gamified pedagogy, self-determination, and community values.
            </p>
          </div>
        </div>

        {/* SECTION 1: THE SANCTUARY FOR STRUGGLING LEARNERS */}
        <section className="p-6 md:p-10 rounded-2xl border border-white/10 bg-gradient-to-br from-[#1b1d28] via-[#12131d] to-[#0a0b10] shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <HeartHandshake className="text-amber-400" size={28} />
            <h2 className="font-['Press_Start_2P'] text-lg md:text-xl text-amber-200">
              A SANCTUARY FOR STRUGGLING LEARNERS
            </h2>
          </div>

          <div className="space-y-4 font-['VT323'] text-xl md:text-2xl text-stone-300 leading-relaxed">
            <p>
              In every classroom, there are brilliant minds who quietly slip through the cracks. Traditional homework models—rigid worksheets, delayed feedback, and punitive red ink—often foster anxiety rather than mastery. For students struggling with executive functioning, attention, or foundational gaps, conventional schooling can feel like a relentless cycle of defeat.
            </p>
            <p className="text-amber-100 bg-amber-950/30 p-4 rounded-xl border border-amber-500/30">
              <strong>Bruxo’s Crusade was forged to be a second home.</strong> It creates a safe, scaffolded realm where effort is visibly rewarded, accountability is gamified, and failure is reframed not as a final judgment, but as an opportunity to respawn, adapt, and conquer.
            </p>
          </div>
        </section>

        {/* SECTION 2: THE ONTARIO REALITY (DATA & BENCHMARKS) */}
        <section className="p-6 md:p-10 rounded-2xl border border-white/10 bg-[#12131c] shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Brain className="text-cyan-400" size={28} />
            <h2 className="font-['Press_Start_2P'] text-lg md:text-xl text-cyan-200">
              THE ONTARIO REALITY: WHY MATH & ACCOUNTABILITY MATTER
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-['Press_Start_2P'] text-center">
            <div className="p-4 rounded-xl bg-black/50 border border-cyan-500/30">
              <div className="text-3xl text-cyan-300 mb-2">51%</div>
              <div className="text-[9px] text-zinc-400 uppercase leading-relaxed">
                Grade 6 Students Meeting Provincial Math Standards (EQAO)
              </div>
            </div>
            <div className="p-4 rounded-xl bg-black/50 border border-amber-500/30">
              <div className="text-3xl text-amber-300 mb-2">49%</div>
              <div className="text-[9px] text-zinc-400 uppercase leading-relaxed">
                Students Entering Middle School with Unresolved Math Gaps
              </div>
            </div>
            <div className="p-4 rounded-xl bg-black/50 border border-purple-500/30">
              <div className="text-3xl text-purple-300 mb-2">36 WKS</div>
              <div className="text-[9px] text-zinc-400 uppercase leading-relaxed">
                Sustained Habit-Building Engine to Bridge the Grade 5 Gap
              </div>
            </div>
          </div>

          <p className="font-['VT323'] text-lg md:text-xl text-stone-400 leading-relaxed">
            Data from Ontario's Education Quality and Accountability Office (EQAO) indicates that while literacy remains stable, elementary mathematics continues to face significant hurdles. Nearly half of Ontario Grade 6 students do not meet the provincial standard. By Grade 5, foundational numeracy must become second nature. Bruxo's Crusade targets this exact critical transition window with rapid 120-second arithmetic gauntlets and structured Hydra multi-step reasoning puzzles.
          </p>
        </section>

        {/* SECTION 3: THE SCIENCE OF GAMIFICATION (SELF-DETERMINATION THEORY) */}
        <section className="p-6 md:p-10 rounded-2xl border border-white/10 bg-gradient-to-br from-[#1c1e2b] via-[#12131d] to-[#0a0b10] shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Sparkles className="text-yellow-400" size={28} />
            <h2 className="font-['Press_Start_2P'] text-lg md:text-xl text-yellow-200">
              THE POWER OF VIDEO GAME PEDAGOGY
            </h2>
          </div>

          <div className="space-y-4 font-['VT323'] text-xl md:text-2xl text-stone-300 leading-relaxed">
            <p>
              Why will a child willingly spend four hours trying to defeat a difficult boss in a video game, but shut down after fifteen minutes of homework?
            </p>
            <p>
              Educational psychology provides the answer through <strong>Self-Determination Theory (Ryan & Deci)</strong>. Effective games satisfy three innate human needs:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-['Press_Start_2P'] text-xs">
            <div className="p-5 rounded-xl bg-black/60 border border-white/10 space-y-2">
              <div className="text-amber-400 text-sm">1. AUTONOMY</div>
              <p className="font-sans text-xs text-zinc-300 leading-relaxed">
                Students choose their daily quests, customize diverse character avatars, and select their learning paths across arithmetic, science, and creative arts.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-black/60 border border-white/10 space-y-2">
              <div className="text-cyan-400 text-sm">2. COMPETENCE</div>
              <p className="font-sans text-xs text-zinc-300 leading-relaxed">
                Immediate, tangible feedback. Leveling up, earning Gold, and tracking XP provides verifiable proof that effort directly creates mastery.
              </p>
            </div>
            <div className="p-5 rounded-xl bg-black/60 border border-white/10 space-y-2">
              <div className="text-purple-400 text-sm">3. RELATEDNESS</div>
              <p className="font-sans text-xs text-zinc-300 leading-relaxed">
                Collective boss strikes, classroom leaderboards that reward growth ("The Comeback"), and shared camaraderie unite students under one guild.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: THE FOUNDERS' STORY & GUYANESE HERITAGE */}
        <section className="p-6 md:p-10 rounded-2xl border-2 border-amber-500/40 bg-[#12131c] shadow-2xl space-y-6">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Flame className="text-amber-400" size={28} />
            <h2 className="font-['Press_Start_2P'] text-lg md:text-xl text-amber-200">
              SCARBOROUGH ROOTS & GUYANESE HERITAGE
            </h2>
          </div>

          <div className="space-y-4 font-['VT323'] text-xl md:text-2xl text-stone-300 leading-relaxed">
            <p>
              Bruxo’s Crusade was born in <strong>Scarborough, Ontario</strong>. As educators deeply rooted in Scarborough and diverse working-class Canadian communities, the creators know firsthand the immense potential locked inside neighborhoods that are too often overlooked.
            </p>
            <p>
              The Game Master was raised by traditional <strong>Guyanese immigrant parents</strong> who instilled a non-negotiable foundational value: <span className="text-yellow-400">academic success is not an innate gift—it is forged through daily discipline, relentless consistency, and honest hard work</span>. In a Guyanese household, showing up every day and finishing what you start is the ultimate virtue.
            </p>
            <p className="text-stone-300">
              The creators infused these exact core values into the game's DNA. The daily login streaks, verified homework dispatches, and non-punitive comeback leaderboards all teach young students that small, consistent daily victories compound into lifelong greatness.
            </p>
          </div>
        </section>

        {/* SECTION 5: REAL-WORLD STAKES & REWARDS */}
        <section className="p-6 md:p-10 rounded-2xl border border-white/10 bg-gradient-to-br from-[#1b1d28] via-[#12131d] to-[#0a0b10] shadow-2xl space-y-6 text-center">
          <Award className="text-yellow-400 mx-auto" size={36} />
          <h2 className="font-['Press_Start_2P'] text-lg md:text-2xl text-yellow-300">
            BRIDGING VIRTUAL EFFORT WITH REAL-WORLD REWARDS
          </h2>
          <p className="font-['VT323'] text-xl md:text-2xl text-stone-300 max-w-3xl mx-auto leading-relaxed">
            To honor the students' dedication, Bruxo's Crusade bridges the digital realm with real-world incentives. Students who complete the 9-month journey and reach Level 50, alongside those who verify 50 and 100 homework dispatches, are awarded <strong>Scarborough Town Centre / Oxford Properties Gift Cards</strong>.
          </p>
          <div className="pt-4">
            <button
              onClick={() => navigate('/')}
              className="px-8 py-4 rounded-xl font-['Press_Start_2P'] text-xs sm:text-sm text-stone-950 bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 border-2 border-yellow-300 shadow-[0_0_30px_rgba(234,179,8,0.6)] active:translate-y-1 transition-all"
            >
              ⚔️ ENTER THE REALM & BEGIN THE CRUSADE
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
