import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import BackgroundMusic from './components/game/BackgroundMusic';

// Import all pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import QuestBoard from './pages/QuestBoard';
import Leaderboard from './pages/Leaderboard';
import Barracks from './pages/Barracks';
import Archives from './pages/Archives';
import Dungeon from './pages/Dungeon';

function App() {
  return (
    <GameProvider>
      <HashRouter>
        <BackgroundMusic />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
          <Route path="/quests" element={<QuestBoard />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/barracks" element={<Barracks />} />
          <Route path="/archives" element={<Archives />} />
          <Route path="/dungeon" element={<Dungeon />} />
        </Routes>
      </HashRouter>
    </GameProvider>
  );
}

export default App;
