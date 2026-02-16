import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

const INITIAL_STUDENTS = [
  { id: 1, name: "John Doe", heroName: "Sir Lancelot", level: 5, xp: 1250, gold: 400, inventory: [], midtermGPA: 750, finalGPA: 850, currentBodySprite: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/new.base.knight2.png', notifications: [], loginStreak: 4, defeatedBosses: [], uploadQuestsCompleted: 5, quizQuestsCompleted: 3, multiStepQuestsCompleted: 1 },
  { id: 2, name: "Jane Smith", heroName: "Lady Arwen", level: 6, xp: 1450, gold: 120, inventory: [], midtermGPA: 880, finalGPA: 900, currentBodySprite: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Vamphunter1.png', notifications: [], loginStreak: 4, defeatedBosses: [], uploadQuestsCompleted: 5, quizQuestsCompleted: 3, multiStepQuestsCompleted: 1 },
  { id: 3, name: "Mike Ross", heroName: "Ranger Rick", level: 3, xp: 800, gold: 550, inventory: [], midtermGPA: 600, finalGPA: 700, currentBodySprite: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Baller.outfit2.png', notifications: [], loginStreak: 4, defeatedBosses: [], uploadQuestsCompleted: 5, quizQuestsCompleted: 3, multiStepQuestsCompleted: 1 },
  { id: 4, name: "Sarah Connor", heroName: "The Terminator", level: 4, xp: 1100, gold: 50, inventory: [], midtermGPA: 920, finalGPA: null, currentBodySprite: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Powerful.golden.armour.png', notifications: [], loginStreak: 4, defeatedBosses: [], uploadQuestsCompleted: 5, quizQuestsCompleted: 3, multiStepQuestsCompleted: 1 },
  { id: 5, name: "Bruce Wayne", heroName: "Dark Knight", level: 7, xp: 2000, gold: 900, inventory: [], midtermGPA: 850, finalGPA: 950, currentBodySprite: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Dark.souls1.png', notifications: [], loginStreak: 4, defeatedBosses: [], uploadQuestsCompleted: 5, quizQuestsCompleted: 3, multiStepQuestsCompleted: 1 },
];

const BOSSES = [
  // Track 1: Uploads
  { id: 101, name: 'Paper Minion', requirement: 'uploads', target: 10, rewardGold: 50, rewardXp: 100, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Paper.Minion.png' },
  { id: 102, name: 'Scroll Guardian', requirement: 'uploads', target: 25, rewardGold: 100, rewardXp: 250, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Scroll.Guardian.png' },
  { id: 103, name: 'Tome Construct', requirement: 'uploads', target: 50, rewardGold: 250, rewardXp: 500, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Tome.Construct.png' },
  { id: 104, name: 'Library Titan', requirement: 'uploads', target: 100, rewardGold: 500, rewardXp: 1000, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Library.Titan.png' },

  // Track 2: Quizzes
  { id: 301, name: 'Floating Eye', requirement: 'quizzes', target: 10, rewardGold: 50, rewardXp: 100, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/floating.eye.png' },
  { id: 302, name: 'Mind Flayer', requirement: 'quizzes', target: 25, rewardGold: 100, rewardXp: 250, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/mind.flayer.png' },
  { id: 303, name: 'Psychic Lich', requirement: 'quizzes', target: 50, rewardGold: 250, rewardXp: 500, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/psychic.lich.png' },
  { id: 304, name: 'Cosmic Brain', requirement: 'quizzes', target: 100, rewardGold: 500, rewardXp: 1000, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/cosmic.brain.png' },

  // Track 3: Multi-step Quests
  { id: 401, name: 'Shadow Snake', requirement: 'multistep', target: 10, rewardGold: 75, rewardXp: 150, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/shadow.snake.png' },
  { id: 402, name: 'Twin-Head Viper', requirement: 'multistep', target: 25, rewardGold: 150, rewardXp: 300, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/twin.viper.png' },
  { id: 403, name: 'Dark Drake', requirement: 'multistep', target: 50, rewardGold: 300, rewardXp: 600, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/dark.drake.png' },
  { id: 404, name: 'Void Hydra', requirement: 'multistep', target: 100, rewardGold: 600, rewardXp: 1200, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/void.hydra.png' },

  // Track 4: Login Streaks
  { id: 501, name: 'Clockwork Beetle', requirement: 'streak', target: 5, rewardGold: 50, rewardXp: 50, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/clockwork.beetle.png' },
  { id: 502, name: 'Timekeeper Knight', requirement: 'streak', target: 10, rewardGold: 100, rewardXp: 100, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/time.knight.png' },
  { id: 503, name: 'Hourglass Golem', requirement: 'streak', target: 15, rewardGold: 200, rewardXp: 200, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/hourglass.golem.png' },
  { id: 504, name: 'Chronos Titan', requirement: 'streak', target: 20, rewardGold: 400, rewardXp: 400, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/chronos.titan.png' },
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
    { 
      id: 103, 
      title: "Math Speed Run", 
      description: "Answer the question before the timer runs out!", 
      xp: 50, 
      gold: 20, 
      type: 'quiz', 
      frequency: 'daily', 
      unlockDate: null,
      timeLimit: 30,
      questionBank: [
        { q: "What is 5 x 5?", a: "25" },
        { q: "What is 120 / 10?", a: "12" },
        { q: "What is 9 + 10?", a: "19" },
        { q: "Solve: 3 x 3 - 2", a: "7" }
      ]
    },
    { id: 104, title: "History Check", description: "What year did WWII end?", correctAnswer: "1945", xp: 50, gold: 20, type: 'quiz', frequency: 'once', unlockDate: yesterdayString },
    { id: 105, title: "Future Test", description: "This quest is from the future!", correctAnswer: "flux capacitor", xp: 500, gold: 200, type: 'quiz', frequency: 'once', unlockDate: nextYearString },
    { id: 106, title: "Weekly Reflection", description: "Write a short paragraph about what you learned this week.", xp: 100, gold: 50, type: 'journal', frequency: 'weekly', unlockDate: '2025-01-01' },
    { 
      id: 107, 
      title: "Long Division Helper",
      description: "Let's solve 144 / 12 step-by-step.",
      type: 'multi-step',
      xp: 150, 
      gold: 75, 
      frequency: 'daily', 
      unlockDate: '2025-01-01',
      steps: [
        { q: "Step 1: How many times does 12 go into 14?", a: "1" },
        { q: "Step 2: What is 1 * 12?", a: "12" },
        { q: "Step 3: Subtract 14 - 12. What is the remainder?", a: "2" },
        { q: "Step 4: Bring down the 4. What is 24 / 12?", a: "2" }
      ]
    }
  ];

  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [quests, setQuests] = useState(INITIAL_QUESTS);
  const [submissions, setSubmissions] = useState([]);
  const [userRole, setUserRole] = useState(null); 
  const [currentUser, setCurrentUser] = useState(null); 

  const createQuest = (newQuest) => {
    setQuests(prev => [...prev, { ...newQuest, id: Date.now() }]);
  };

  const importQuestions = (questId, newQuestions) => {
    setQuests(prevQuests =>
      prevQuests.map(quest => {
        if (quest.id === questId && quest.hasOwnProperty('questionBank')) {
          return {
            ...quest,
            questionBank: [...quest.questionBank, ...newQuestions],
          };
        }
        return quest;
      })
    );
  };

  const submitQuest = (questId, content, type) => {
    const newSubmission = {
      id: Date.now(),
      questId,
      studentId: currentUser.id,
      studentName: currentUser.heroName,
      status: 'pending',
      timestamp: new Date().toLocaleDateString(),
      type,
    };

    if (type === 'upload') {
      newSubmission.proofImage = content ? URL.createObjectURL(content) : null;
    } else if (type === 'journal') {
      newSubmission.journalText = content;
    }

    setSubmissions(prev => [...prev, newSubmission]);
  };

  const approveSubmission = (submissionId) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) return;

    const quest = quests.find(q => q.id === submission.questId);
    if (!quest) return;

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
          notifications: [...student.notifications, newNotification],
          uploadQuestsCompleted: submission.type === 'upload' ? (student.uploadQuestsCompleted || 0) + 1 : student.uploadQuestsCompleted,
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
          gold: prev.gold + quest.gold,
          uploadQuestsCompleted: submission.type === 'upload' ? (prev.uploadQuestsCompleted || 0) + 1 : prev.uploadQuestsCompleted,
       }));
    }
  };

  const attemptQuiz = (questId, userAnswer, dynamicCorrectAnswer = null, isFinalStep = true) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return { success: false, message: "Quest not found!" };

    const correctAnswer = dynamicCorrectAnswer !== null ? dynamicCorrectAnswer : quest.correctAnswer;

    if (typeof correctAnswer !== 'string') {
      return { success: false, message: "Incorrect answer. Try again!" };
    }

    if (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
      if (!isFinalStep) {
        return { success: true, message: "Correct! Keep going..." };
      }

      const updatedStudents = students.map(student => {
        if (student.id === currentUser.id) {
          return {
            ...student,
            xp: student.xp + quest.xp,
            gold: student.gold + quest.gold,
            quizQuestsCompleted: quest.type === 'quiz' ? (student.quizQuestsCompleted || 0) + 1 : student.quizQuestsCompleted,
            multiStepQuestsCompleted: quest.type === 'multi-step' ? (student.multiStepQuestsCompleted || 0) + 1 : student.multiStepQuestsCompleted,
          };
        }
        return student;
      });
      setStudents(updatedStudents);

      const updatedCurrentUser = {
        ...currentUser,
        xp: currentUser.xp + quest.xp,
        gold: currentUser.gold + quest.gold,
        quizQuestsCompleted: quest.type === 'quiz' ? (currentUser.quizQuestsCompleted || 0) + 1 : currentUser.quizQuestsCompleted,
        multiStepQuestsCompleted: quest.type === 'multi-step' ? (currentUser.multiStepQuestsCompleted || 0) + 1 : currentUser.multiStepQuestsCompleted,
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
    
    if (quest.frequency === 'daily' || quest.frequency === 'weekly') {
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
    switch (boss.requirement) {
      case 'uploads':
        requirementMet = (currentUser.uploadQuestsCompleted || 0) >= boss.target;
        break;
      case 'quizzes':
        requirementMet = (currentUser.quizQuestsCompleted || 0) >= boss.target;
        break;
      case 'multistep':
        requirementMet = (currentUser.multiStepQuestsCompleted || 0) >= boss.target;
        break;
      case 'streak':
        requirementMet = (currentUser.loginStreak || 0) >= boss.target;
        break;
      default:
        requirementMet = false;
    }

    if (requirementMet) {
      const updatedUser = {
        ...currentUser,
        gold: currentUser.gold + boss.rewardGold,
        xp: currentUser.xp + boss.rewardXp,
        defeatedBosses: [...currentUser.defeatedBosses, bossId]
      };
      setCurrentUser(updatedUser);
      
      setStudents(prev => prev.map(s => s.id === currentUser.id ? updatedUser : s));

      return { success: true, rewardGold: boss.rewardGold, rewardXp: boss.rewardXp };
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
    createQuest, importQuestions, submitQuest, approveSubmission, getQuestStatus,
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
