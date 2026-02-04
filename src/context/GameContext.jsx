import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

const INITIAL_STUDENTS = [
  { id: 1, name: "John Doe", heroName: "Sir Lancelot", level: 5, xp: 1250, gold: 400, inventory: [], midtermGPA: 750, finalGPA: 850, currentBodySprite: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/new.base.knight2.png', notifications: [], loginStreak: 3, defeatedBosses: [], questsCompleted: 5 },
  { id: 2, name: "Jane Smith", heroName: "Lady Arwen", level: 6, xp: 1450, gold: 120, inventory: [], midtermGPA: 880, finalGPA: 900, currentBodySprite: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/base.body.ninja2.png', notifications: [], loginStreak: 3, defeatedBosses: [], questsCompleted: 5 },
  { id: 3, name: "Mike Ross", heroName: "Ranger Rick", level: 3, xp: 800, gold: 550, inventory: [], midtermGPA: 600, finalGPA: 700, currentBodySprite: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/new.base.body2.png', notifications: [], loginStreak: 3, defeatedBosses: [], questsCompleted: 5 },
  { id: 4, name: "Sarah Connor", heroName: "The Terminator", level: 4, xp: 1100, gold: 50, inventory: [], midtermGPA: 920, finalGPA: null, currentBodySprite: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/new.base.knight2.png', notifications: [], loginStreak: 3, defeatedBosses: [], questsCompleted: 5 },
  { id: 5, name: "Bruce Wayne", heroName: "Dark Knight", level: 7, xp: 2000, gold: 900, inventory: [], midtermGPA: 850, finalGPA: 950, currentBodySprite: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/base.body.ninja2.png', notifications: [], loginStreak: 3, defeatedBosses: [], questsCompleted: 5 },
];

const BOSSES = [
    { id: 1, name: 'Slime of Sloth', image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/slime.png', requirement: 'streak', target: 3, rewardGold: 50, description: 'Login 3 days in a row' },
    { id: 2, name: 'Goblin of Grades', image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/goblin.png', requirement: 'quests', target: 10, rewardGold: 100, description: 'Complete 10 Quests' },
];

const VICTORY_QUOTES = [
  'Your mind is as sharp as a sword!',
  'A legendary feat!',
  'The Kingdom grows stronger with your knowledge.',
  'Knowledge is the ultimate weapon!',
  'Another victory for the Archives!',
];

export function GameProvider({ children }) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];

  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const nextYearString = nextYear.toISOString().split('T')[0];

  const INITIAL_QUESTS = [
    { id: 101, title: "Math Worksheet", description: "Upload a photo of your completed algebra sheet.", xp: 50, gold: 20, type: 'upload', frequency: 'once', unlockDate: null },
    { id: 102, title: "Science Project", description: "Submit a picture of your science fair poster.", xp: 100, gold: 50, type: 'upload', frequency: 'once', unlockDate: null },
    { id: 103, title: "Math Speed Run", description: "What is 12 x 12?", correctAnswer: "144", xp: 50, gold: 20, type: 'quiz', frequency: 'daily', unlockDate: null },
    { id: 104, title: "History Check", description: "What year did WWII end?", correctAnswer: "1945", xp: 50, gold: 20, type: 'quiz', frequency: 'once', unlockDate: yesterdayString },
    { id: 105, title: "Future Test", description: "This quest is from the future!", correctAnswer: "flux capacitor", xp: 500, gold: 200, type: 'quiz', frequency: 'once', unlockDate: nextYearString },
  ];

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
        const newNotification = {
          id: Date.now(),
          title: quest.title,
          xp: quest.xp,
          gold: quest.gold,
          quote: VICTORY_QUOTES[Math.floor(Math.random() * VICTORY_QUOTES.length)]
        };
        return {
          ...student,
          xp: student.xp + quest.xp,
          gold: student.gold + quest.gold,
          notifications: [...student.notifications, newNotification]
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

  const attemptQuiz = (questId, userAnswer) => {
    const quest = quests.find(q => q.id === questId);

    if (!quest) return { success: false, message: "Quest not found!" };

    if (userAnswer.trim().toLowerCase() === quest.correctAnswer.trim().toLowerCase()) {
      const updatedStudents = students.map(student => {
        if (student.id === currentUser.id) {
          return {
            ...student,
            xp: student.xp + quest.xp,
            gold: student.gold + quest.gold
          };
        }
        return student;
      });
      setStudents(updatedStudents);

      const updatedCurrentUser = {
        ...currentUser,
        xp: currentUser.xp + quest.xp,
        gold: currentUser.gold + quest.gold
      };
      setCurrentUser(updatedCurrentUser);

      const newSubmission = {
        id: Date.now(),
        questId,
        studentId: currentUser.id,
        studentName: currentUser.heroName,
        status: 'approved',
        timestamp: new Date().toLocaleDateString()
      };
      setSubmissions(prev => [...prev, newSubmission]);

      return { success: true, message: `+${quest.xp} XP, +${quest.gold} Gold` };
    } else {
      return { success: false, message: "Incorrect answer. Try again!" };
    }
  };

  const getQuestStatus = (questId) => {
    if (!currentUser) return 'available';

    const quest = quests.find(q => q.id === questId);
    if (!quest) return 'unavailable'; 

    if (quest.unlockDate && Date.now() < new Date(quest.unlockDate).getTime()) {
      return 'locked';
    }

    const userSubmissions = submissions
      .filter(s => s.questId === questId && s.studentId === currentUser.id)
      .sort((a, b) => b.id - a.id); 

    if (userSubmissions.length === 0) {
      return 'available';
    }

    const mostRecentSubmission = userSubmissions[0];
    
    if (quest.frequency === 'daily') {
      const todayString = new Date().toLocaleDateString();
      if (mostRecentSubmission.timestamp === todayString) {
        return mostRecentSubmission.status;
      } else {
        return 'available';
      }
    }

    return mostRecentSubmission.status;
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

    const fightBoss = (bossId) => {
    if (!currentUser) return { success: false, message: "Not logged in!" };

    const boss = BOSSES.find(b => b.id === bossId);
    if (!boss) return { success: false, message: "Boss not found!" };

    if (currentUser.defeatedBosses.includes(bossId)) {
      return { success: false, message: "You have already defeated this boss." };
    }

    let requirementMet = false;
    if (boss.requirement === 'streak') {
      if (currentUser.loginStreak >= boss.target) {
        requirementMet = true;
      }
    } else if (boss.requirement === 'quests') {
        const completedQuests = submissions.filter(s => s.studentId === currentUser.id && s.status === 'approved').length;
      if (completedQuests >= boss.target) {
        requirementMet = true;
      }
    }

    if (requirementMet) {
      const updatedUser = {
        ...currentUser,
        gold: currentUser.gold + boss.rewardGold,
        defeatedBosses: [...currentUser.defeatedBosses, bossId]
      };
      setCurrentUser(updatedUser);
      
      setStudents(prev => prev.map(s => s.id === currentUser.id ? updatedUser : s));

      return { success: true, reward: boss.rewardGold };
    } else {
      return { success: false, message: "You are not strong enough yet!" };
    }
  };
  
  const calculateScholarScore = (student) => {
    const currentAttribute = student.finalGPA !== null ? student.finalGPA : student.midtermGPA;
    return currentAttribute + Math.floor(student.xp * 0.1);
  };

  const calculateComebackScore = (student) => {
    if (student.finalGPA === null) {
      return 0;
    }
    return student.finalGPA - student.midtermGPA;
  };

  const updateStudentStats = (studentId, type, rawValue) => {
    const scaledValue = rawValue * 10;
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        return {
          ...student,
          [type === 'midterm' ? 'midtermGPA' : 'finalGPA']: scaledValue
        };
      }
      return student;
    }));
  };

  const clearNotifications = () => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, notifications: [] };
    setCurrentUser(updatedUser);
    setStudents(prev => prev.map(s => s.id === currentUser.id ? updatedUser : s));
  };

  const value = {
    students, quests, submissions, BOSSES,
    createQuest, submitQuest, approveSubmission, getQuestStatus,
    userRole, setUserRole, currentUser, setCurrentUser,
    buyItem,
    equipOutfit,
    unequipOutfit,
    calculateScholarScore,
    calculateComebackScore,
    updateStudentStats,
    attemptQuiz,
    clearNotifications,
    fightBoss
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
