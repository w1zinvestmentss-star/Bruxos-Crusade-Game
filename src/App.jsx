import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';

// Import all pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import QuestBoard from './pages/QuestBoard';
import Leaderboard from './pages/Leaderboard'; // <--- NEW IMPORT
import Barracks from './pages/Barracks';
import Archives from './pages/Archives';

function App() {
  return (
    <GameProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/quests" element={<QuestBoard />} />
          
          {/* NEW ROUTE: Connects the URL /leaderboard to the file */}
          <Route path="/leaderboard" element={<Leaderboard />} />
          
          {/* BARRACKS ROUTE: Avatar Shop */}
          <Route path="/barracks" element={<Barracks />} />

          <Route path="/archives" element={<Archives />} />
        </Routes>
      </HashRouter>
    </GameProvider>
  );
}

export default App;