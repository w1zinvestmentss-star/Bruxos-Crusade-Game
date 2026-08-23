import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { useGame } from '../context/GameContext';

const MAP_BG = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/worldmap4.png";

// Optimized: Declared outside component to prevent remounting on every state update
const GuideCard = ({ title, description }) => (
  <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-6 h-full shadow-lg">
    <h3 className="font-['Press_Start_2P'] text-yellow-400 text-lg mb-3">{title}</h3>
    <p className="font-['VT323'] text-stone-300 text-xl leading-relaxed">{description}</p>
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  // Optimized: Destructure only used methods
  const { setUserRole, login } = useGame();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    // Security & Sanitization: Normalize input
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    try {
      const result = await login(normalizedEmail, password);
      
      if (result.success) {
        if (normalizedEmail === 'admin@bruxos.com') {
          setUserRole('teacher');
          navigate('/teacher-dashboard');
        } else {
          setUserRole('student');
          navigate('/student-dashboard');
        }
      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative text-white bg-stone-900 select-none">
      {/* Fixed Background and Overlay */}
      <div className="fixed inset-0 z-0 h-full w-full pointer-events-none">
        <img 
          src={MAP_BG} 
          alt="World Map" 
          className="w-full h-full object-cover" 
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      {/* Scrolling Content Container */}
      <div className="relative z-10 overflow-y-auto">
        {/* Section 1: The Gate (Login) */}
        <section className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-['Press_Start_2P'] text-4xl md:text-5xl mb-12 drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            ENTER THE REALM
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/60 backdrop-blur-md p-8 border border-white/10 rounded-xl max-w-md w-full shadow-2xl"
          >
            <form onSubmit={handleLogin} className="flex flex-col gap-6">
              {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 p-3 rounded-lg text-sm text-left font-mono">
                  {error}
                </div>
              )}
              
              <div className="flex flex-col text-left">
                <label className="font-['VT323'] text-stone-300 text-xl mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  className="bg-stone-900 border border-stone-600 text-white px-4 py-3 rounded-lg font-sans focus:outline-none focus:border-yellow-500 transition-colors disabled:opacity-50"
                  placeholder="hero@academy.edu"
                  required
                />
              </div>

              <div className="flex flex-col text-left">
                <label className="font-['VT323'] text-stone-300 text-xl mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  disabled={loading}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="bg-stone-900 border border-stone-600 text-white px-4 py-3 rounded-lg font-sans focus:outline-none focus:border-yellow-500 transition-colors disabled:opacity-50"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 bg-yellow-600 hover:bg-yellow-500 text-white font-['Press_Start_2P'] py-4 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50 shadow-lg cursor-pointer"
              >
                {loading ? 'CASTING...' : 'ENTER THE REALM'}
              </button>
            </form>
          </motion.div>

          {/* Scroll Down Indicator */}
          <motion.div
            onClick={() => document.getElementById('guide-section')?.scrollIntoView({ behavior: 'smooth' })}
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 text-center cursor-pointer select-none hover:text-yellow-400 transition-colors"
          >
            <p className="font-['VT323'] text-lg">Scroll Down for Info</p>
            <ArrowDown className="mx-auto mt-2" />
          </motion.div>
        </section>

        {/* Section 2: Guide to the Realm */}
        <section id="guide-section" className="py-24 px-4 sm:px-6 md:px-8 bg-black/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-['Press_Start_2P'] text-3xl md:text-4xl text-center mb-16 text-yellow-400">
              GUIDE TO THE REALM
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <GuideCard
                title="The Quest Board"
                description="Accept daily tasks and challenges to earn Gold and Glory. Consistency is key, young hero."
              />
              <GuideCard
                title="The Barracks"
                description="Visit the Armory to spend your gold on legendary outfits and magical companions. Customize your appearance and equip pets for powerful quest boosts!"
              />
              <GuideCard
                title="Town Square"
                description="The Hall of Legends. Compare your Mana (Grades + XP) against other heroes. Will you be the Scholar or the Grinder?"
              />
              <GuideCard
                title="The Archives"
                description="Your permanent record. Track your Intellect (Midterm) and Wisdom (Finals). Watch your power grow."
              />
              <GuideCard
                title="The Dungeon"
                description="A dangerous place for the brave. Battle Bosses by logging in regularly and hitting milestones."
              />
              <GuideCard
                title="Hall of Triumphs"
                description="View your glorious Achievements and claim REAL-WORLD REWARDS! Enter the monthly Grand Raffle or race your peers for limited gift cards."
              />
            </div>
          </div>
        </section>

        {/* Section 3: The Architects */}
        <footer className="py-20 px-4 text-center bg-black/50 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <h3 className="font-['Press_Start_2P'] text-2xl md:text-3xl mb-10 text-yellow-400 drop-shadow-[0_2px_10px_rgba(234,179,8,0.4)]">
              THE ARCHITECTS
            </h3>

            {/* Dual Architect Character Showcase */}
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 mb-10">
              
              {/* Architect 1: Jeffrey "Bruxo" P. A. Munroe */}
              <div className="flex flex-col items-center">
                <div className="relative w-28 h-36 md:w-36 md:h-48 bg-stone-950/90 border-2 border-yellow-500/80 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(234,179,8,0.35)] flex items-center justify-center mb-3">
                  <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/25 via-yellow-500/5 to-transparent pointer-events-none z-0" />
                  <img 
                    src="https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Jeffrey.Bruxo.M.png" 
                    alt="Jeffrey Bruxo P. A. Munroe" 
                    className="w-full h-auto object-cover scale-[1.85] translate-y-6 md:translate-y-8 drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] z-10"
                  />
                  <div className="absolute bottom-0 w-full h-4 bg-yellow-500/40 blur-md rounded-full z-0" />
                </div>
                <h4 className="font-['Press_Start_2P'] text-xs sm:text-sm text-yellow-400 font-bold max-w-[200px] leading-relaxed mt-1">
                  Jeffrey "Bruxo" P. A. Munroe
                </h4>
                <p className="font-['VT323'] text-lg text-amber-200/80 mt-0.5">Game Master & Educator</p>
              </div>

              {/* Architect 2: Devonna Munroe */}
              <div className="flex flex-col items-center">
                <div className="relative w-28 h-36 md:w-36 md:h-48 bg-stone-950/90 border-2 border-purple-500/80 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(168,85,247,0.35)] flex items-center justify-center mb-3">
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-500/25 via-purple-500/5 to-transparent pointer-events-none z-0" />
                  <img 
                    src="https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Curator.png" 
                    alt="Devonna Munroe" 
                    className="w-full h-auto object-cover scale-[1.85] translate-y-6 md:translate-y-8 drop-shadow-[0_8px_16px_rgba(0,0,0,0.9)] z-10"
                  />
                  <div className="absolute bottom-0 w-full h-4 bg-purple-500/40 blur-md rounded-full z-0" />
                </div>
                <h4 className="font-['Press_Start_2P'] text-xs sm:text-sm text-purple-300 font-bold max-w-[200px] leading-relaxed mt-1">
                  Devonna Munroe
                </h4>
                <p className="font-['VT323'] text-lg text-purple-200/80 mt-0.5">Curator & Educator</p>
              </div>

            </div>

            {/* Scarborough Mission Statement */}
            <div className="max-w-2xl mx-auto p-6 rounded-xl border border-white/10 bg-black/60 backdrop-blur-md shadow-xl">
              <p className="font-['VT323'] text-stone-200 text-xl sm:text-2xl leading-relaxed">
                "We are both Teachers from Scarborough looking to create a better, more inspiring learning environment for our community. Forged with passion, game-based learning, and dedication to our students."
              </p>
            </div>

            {/* CTA Button to Public Mission Page */}
            <div className="mt-10 mb-6">
              <button
                onClick={() => navigate('/about')}
                className="px-6 py-4 rounded-xl font-['Press_Start_2P'] text-xs sm:text-sm text-stone-950 bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 border-2 border-yellow-300 shadow-[0_0_25px_rgba(234,179,8,0.5)] active:translate-y-1 transition-all cursor-pointer"
              >
                📜 DISCOVER THE CRUSADE: OUR MISSION & STORY
              </button>
            </div>

            <div className="text-stone-500 font-['VT323'] text-lg">
              Bruxo's Crusade © 2026 • Forged for Ontario Grade 5 Crusaders
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Login;