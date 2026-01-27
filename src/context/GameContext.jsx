import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

const INITIAL_STUDENTS = [
  { id: 1, name: "John Doe", heroName: "Sir Lancelot", level: 5, xp: 1250, gold: 400, inventory: [], midtermGPA: 75, finalGPA: 85, currentBodySprite: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/new.base.body2.png' },
  { id: 2, name: "Jane Smith", heroName: "Lady Arwen", level: 6, xp: 1450, gold: 120, inventory: [], midtermGPA: 88, finalGPA: 90, currentBodySprite: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/new.base.body2.png' },
  { id: 3, name: "Mike Ross", heroName: "Ranger Rick", level: 3, xp: 800, gold: 550, inventory: [], midtermGPA: 60, finalGPA: 70, currentBodySprite: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/new.base.body2.png' },
  { id: 4, name: "Sarah Connor", heroName: "The Terminator", level: 4, xp: 1100, gold: 50, inventory: [], midtermGPA: 92, finalGPA: null, currentBodySprite: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/new.base.body2.png' },
  { id: 5, name: "Bruce Wayne", heroName: "Dark Knight", level: 7, xp: 2000, gold: 900, inventory: [], midtermGPA: 85, finalGPA: 95, currentBodySprite: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/new.base.body2.png' },
];

const INITIAL_QUESTS = [
  { id: 101, title: "Math Worksheet", description: "Upload a photo of your completed algebra sheet.", xp: 50, gold: 20 },
  { id: 102, title: "Science Project", description: "Submit a picture of your science fair poster.", xp: 100, gold: 50 },
];

export function GameProvider({ children }) {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [quests, setQuests] = useState(INITIAL_QUESTS);
  const [submissions, setSubmissions] = useState([]);
  const [userRole, setUserRole] = useState(null); 
  const [currentUser, setCurrentUser] = useState(null); 

  const createQuest = (newQuest) => {
    setQuests(prev => [...prev, { ...newQuest, id: Date.now() }]);
  };

  const submitQuest = (questId, proofFile) => {
    const proofUrl = proofFile ? URL.createObjectURL(proofFile) : null;
    
    const newSubmission = {
      id: Date.now(),
      questId,
      studentId: currentUser.id,
      studentName: currentUser.heroName,
      proofImage: proofUrl,
      status: 'pending',
      timestamp: new Date().toLocaleDateString()
    };
    
    setSubmissions(prev => [...prev, newSubmission]);
  };

  const approveSubmission = (submissionId) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) return;

    const quest = quests.find(q => q.id === submission.questId);

    setStudents(prev => prev.map(student => {
      if (student.id === submission.studentId) {
        return {
          ...student,
          xp: student.xp + quest.xp,
          gold: student.gold + quest.gold
        };
      }
      return student;
    }));

    setSubmissions(prev => prev.map(s => 
      s.id === submissionId ? { ...s, status: 'approved' } : s
    ));
    
    if (currentUser && currentUser.id === submission.studentId) {
       setCurrentUser(prev => ({
          ...prev,
          xp: prev.xp + quest.xp,
          gold: prev.gold + quest.gold
       }));
    }
  };

  const getQuestStatus = (questId) => {
    if (!currentUser) return 'available';
    const sub = submissions.find(s => s.questId === questId && s.studentId === currentUser.id);
    if (!sub) return 'available';
    return sub.status;
  };

  const buyItem = (item) => {
    if (!currentUser) return { success: false, message: "Not logged in!" };
    
    if (currentUser.gold >= item.cost) {
      const itemToSave = { ...item };
      
      const updatedStudents = students.map(student => {
        if (student.id === currentUser.id) {
          return {
            ...student,
            gold: student.gold - item.cost,
            inventory: [...(student.inventory || []), itemToSave]
          };
        }
        return student;
      });
      setStudents(updatedStudents);

      const updatedCurrentUser = {
        ...currentUser,
        gold: currentUser.gold - item.cost,
        inventory: [...(currentUser.inventory || []), itemToSave]
      };
      setCurrentUser(updatedCurrentUser);

      return { success: true };
    } else {
      return { success: false, message: "Not enough gold!" };
    }
  };

  const equipOutfit = (outfitLink) => {
    if (!currentUser) return;

    setCurrentUser(prev => ({
      ...prev,
      currentBodySprite: outfitLink
    }));

    setStudents(prev => prev.map(student => {
      if (student.id === currentUser.id) {
        return {
          ...student,
          currentBodySprite: outfitLink
        };
      }
      return student;
    }));
  };

  const unequipOutfit = () => {
    if (!currentUser) return;

    setCurrentUser(prev => ({
      ...prev,
      currentBodySprite: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/new.base.body2.png'
    }));

    setStudents(prev => prev.map(student => {
      if (student.id === currentUser.id) {
        return {
          ...student,
          currentBodySprite: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/new.base.body2.png'
        };
      }
      return student;
    }));
  };
  
  const calculateScholarScore = (student) => {
    const currentGPA = student.finalGPA !== null ? student.finalGPA : student.midtermGPA;
    return (currentGPA * 10) + (student.xp * 0.1);
  };

  const calculateComebackScore = (student) => {
    if (student.finalGPA === null) {
      return 0;
    }
    return student.finalGPA - student.midtermGPA;
  };

  const value = {
    students, quests, submissions,
    createQuest, submitQuest, approveSubmission, getQuestStatus,
    userRole, setUserRole, currentUser, setCurrentUser,
    buyItem,
    equipOutfit,
    unequipOutfit,
    calculateScholarScore,
    calculateComebackScore
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  return useContext(GameContext);
}