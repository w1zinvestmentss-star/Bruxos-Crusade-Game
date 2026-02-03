import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sword, Crown, ArrowDown } from 'lucide-react';
import { useGame } from '../context/GameContext';

const Login = () => {
  const navigate = useNavigate();
  const { setUserRole, setCurrentUser, students } = useGame();

  const handleLogin = (role) => {
    setUserRole(role);
    if (role === 'student') {
      setCurrentUser(students[0]);
      navigate('/student-dashboard');
    } else {
      navigate('/teacher-dashboard');
    }
  };

  const MAP_BG = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/worldmap4.png";

  const GuideCard = ({ title, description }) => (
    <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-lg p-6 h-full">
      <h3 className="font-['Press_Start_2P'] text-yellow-400 text-lg mb-3">{title}</h3>
      <p className="font-['VT323'] text-stone-300 text-xl leading-relaxed">{description}</p>
    </div>
  );

  return (
    <div className="relative text-white bg-stone-900">
      {/* Fixed Background and Overlay */}
      <div className="fixed inset-0 z-0 h-full w-full">
        <img src={MAP_BG} alt="World Map" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      {/* Scrolling Content Container */}
      <div className="relative z-10 overflow-y-auto">
        {/* Section 1: The Gate (Login) */}
        <section className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-['Press_Start_2P'] text-4xl md:text-5xl mb-12">
            CHOOSE YOUR PATH
          </motion.h1>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Hero Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => handleLogin('student')}
              className="w-80 cursor-pointer bg-black/60 backdrop-blur-md border-2 border-white/10 hover:border-yellow-500 rounded-xl p-8 text-center transition-all duration-300 flex flex-col items-center"
            >
              <div className="p-4 rounded-full inline-block mb-4">
                <Sword size={48} className="text-blue-400" />
              </div>
              <h2 className="font-['Press_Start_2P'] text-2xl mb-2">HERO</h2>
              <p className="font-['VT323'] text-stone-300 text-lg">
                Complete quests, earn gold, and upgrade your avatar.
              </p>
            </motion.div>

            {/* Game Master Card */}
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              onClick={() => handleLogin('teacher')}
              className="w-80 cursor-pointer bg-black/60 backdrop-blur-md border-2 border-white/10 hover:border-yellow-500 rounded-xl p-8 text-center transition-all duration-300 flex flex-col items-center"
            >
              <div className="p-4 rounded-full inline-block mb-4">
                <Crown size={48} className="text-red-400" />
              </div>
              <h2 className="font-['Press_Start_2P'] text-2xl mb-2">GAME MASTER</h2>
              <p className="font-['VT323'] text-stone-300 text-lg">
                Assign grades, approve quests, and manage the realm.
              </p>
            </motion.div>
          </div>

          {/* Scroll Down Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-10 text-center"
          >
            <p className="font-['VT323'] text-lg">Scroll Down for Info</p>
            <ArrowDown className="mx-auto mt-2" />
          </motion.div>
        </section>

        {/* Section 2: Guide to the Realm */}
        <section className="py-24 px-4 sm:px-6 md:px-8 bg-black/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-['Press_Start_2P'] text-3xl md:text-4xl text-center mb-16 text-yellow-400">
              GUIDE TO THE REALM
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GuideCard
                title="The Quest Board"
                description="Accept daily tasks and challenges to earn Gold and Glory. Consistency is key, young hero."
              />
              <GuideCard
                title="The Barracks"
                description="Visit the Armory to spend your gold on legendary outfits. Customize your appearance to strike fear into your exams."
              />
              <GuideCard
                title="Town Square"
                description="The Hall of Legends. Compare your Mana (Grades + XP) against other heroes. Will you be the Scholar or the Grinder?"
              />
              <GuideCard
                title="The Archives"
                description="Your permanent record. Track your Intellect (Midterm) and Wisdom (Finals). Watch your power grow."
              />
              <div className="md:col-span-2">
                 <GuideCard
                    title="The Dungeon"
                    description="A dangerous place for the brave. Battle Bosses by maintaining streaks and hitting milestones."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: The Architect */}
        <footer className="py-20 px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="font-['Press_Start_2P'] text-2xl mb-4 text-yellow-400">THE ARCHITECT</h3>
            <p className="font-['VT323'] text-stone-300 text-xl max-w-2xl mx-auto leading-relaxed">
              This realm was forged by The Game Master to test the limits of what education can be. Built with React, magic, and a lot of coffee.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Login;