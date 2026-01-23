import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sword, Crown } from 'lucide-react';
import { useGame } from '../context/GameContext';

const Login = () => {
  const navigate = useNavigate();
  // We grab the "set functions" from our Game Brain
  const { setUserRole, setCurrentUser, students } = useGame();

  const handleLogin = (role) => {
    // 1. Save the role to the game state
    setUserRole(role);

    if (role === 'student') {
      // For now, we auto-login as the first student "Sir Lancelot" for testing
      setCurrentUser(students[0]);
      navigate('/student-dashboard');
    } else {
      navigate('/teacher-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Texture (Subtle Grid) */}
      <div className="absolute inset-0 opacity-5" 
           style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      {/* Title */}
      <motion.h2 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-5xl text-yellow-400 mb-16 text-center drop-shadow-md relative z-10"
        style={{ fontFamily: "'Press Start 2P', cursive", lineHeight: "1.5" }}
      >
        CHOOSE YOUR PATH
      </motion.h2>

      <div className="flex flex-col md:flex-row gap-8 z-10">
        
        {/* OPTION 1: THE HERO (Student) */}
        <motion.div 
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer bg-stone-800 border-4 border-stone-600 hover:border-blue-400 p-8 rounded-xl w-72 text-center group transition-colors shadow-2xl"
          onClick={() => handleLogin('student')}
        >
          <div className="bg-stone-900 p-6 rounded-full inline-block mb-6 group-hover:bg-blue-900/50 transition-colors border-2 border-stone-700">
            <Sword size={48} className="text-blue-400 group-hover:text-white" />
          </div>
          <h3 className="text-2xl text-white font-bold mb-2 font-mono">HERO</h3>
          <p className="text-stone-400 text-sm leading-relaxed">
            Complete quests, earn gold, and upgrade your avatar.
          </p>
        </motion.div>

        {/* OPTION 2: GAME MASTER (Teacher) */}
        <motion.div 
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer bg-stone-800 border-4 border-stone-600 hover:border-red-400 p-8 rounded-xl w-72 text-center group transition-colors shadow-2xl"
          onClick={() => handleLogin('teacher')}
        >
          <div className="bg-stone-900 p-6 rounded-full inline-block mb-6 group-hover:bg-red-900/50 transition-colors border-2 border-stone-700">
            <Crown size={48} className="text-red-400 group-hover:text-white" />
          </div>
          <h3 className="text-2xl text-white font-bold mb-2 font-mono">GAME MASTER</h3>
          <p className="text-stone-400 text-sm leading-relaxed">
            Assign grades, approve quests, and manage the realm.
          </p>
        </motion.div>

      </div>
    </div>
  );
};

export default Login;