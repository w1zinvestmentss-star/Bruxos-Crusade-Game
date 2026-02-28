import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

const INITIAL_STUDENTS = [
  { id: 1, name: "John Doe", heroName: "Sir Lancelot", level: 5, xp: 1250, gold: 400, inventory: [], midtermGPA: 750, finalGPA: 850, currentBodySprite: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/new.base.knight2.png', notifications: [], loginStreak: 4, defeatedBosses: [], uploadQuestsCompleted: 5, quizQuestsCompleted: 3, multiStepQuestsCompleted: 1, scenarioQuestsCompleted: 0, incantationQuestsCompleted: 0, sportsQuestsCompleted: 0, artsQuestsCompleted: 0, wellnessQuestsCompleted: 0 },
  { id: 2, name: "Jane Smith", heroName: "Lady Arwen", level: 6, xp: 1450, gold: 120, inventory: [], midtermGPA: 880, finalGPA: 900, currentBodySprite: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Vamphunter1.png', notifications: [], loginStreak: 4, defeatedBosses: [], uploadQuestsCompleted: 5, quizQuestsCompleted: 3, multiStepQuestsCompleted: 1, scenarioQuestsCompleted: 0, incantationQuestsCompleted: 0, sportsQuestsCompleted: 0, artsQuestsCompleted: 0, wellnessQuestsCompleted: 0 },
  { id: 3, name: "Mike Ross", heroName: "Ranger Rick", level: 3, xp: 800, gold: 550, inventory: [], midtermGPA: 600, finalGPA: 700, currentBodySprite: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Baller.outfit2.png', notifications: [], loginStreak: 4, defeatedBosses: [], uploadQuestsCompleted: 5, quizQuestsCompleted: 3, multiStepQuestsCompleted: 1, scenarioQuestsCompleted: 0, incantationQuestsCompleted: 0, sportsQuestsCompleted: 0, artsQuestsCompleted: 0, wellnessQuestsCompleted: 0 },
  { id: 4, name: "Sarah Connor", heroName: "The Terminator", level: 4, xp: 1100, gold: 50, inventory: [], midtermGPA: 920, finalGPA: null, currentBodySprite: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Powerful.golden.armour.png', notifications: [], loginStreak: 4, defeatedBosses: [], uploadQuestsCompleted: 5, quizQuestsCompleted: 3, multiStepQuestsCompleted: 1, scenarioQuestsCompleted: 0, incantationQuestsCompleted: 0, sportsQuestsCompleted: 0, artsQuestsCompleted: 0, wellnessQuestsCompleted: 0 },
  { id: 5, name: "Bruce Wayne", heroName: "Dark Knight", level: 7, xp: 2000, gold: 900, inventory: [], midtermGPA: 850, finalGPA: 950, currentBodySprite: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Dark.souls1.png', notifications: [], loginStreak: 4, defeatedBosses: [], uploadQuestsCompleted: 5, quizQuestsCompleted: 3, multiStepQuestsCompleted: 1, scenarioQuestsCompleted: 0, incantationQuestsCompleted: 0, sportsQuestsCompleted: 0, artsQuestsCompleted: 0, wellnessQuestsCompleted: 0 },
];

const BOSSES = [
  // Track 1: Uploads
  { id: 101, name: 'Paper Minion', requirement: 'uploads', target: 10, rewardGold: 50, rewardXp: 100, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Paper.Minion.png', tier: 1 },
  { id: 102, name: 'Scroll Guardian', requirement: 'uploads', target: 25, rewardGold: 100, rewardXp: 250, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Scroll.Guardian2.png', tier: 2 },
  { id: 103, name: 'Tome Construct', requirement: 'uploads', target: 50, rewardGold: 250, rewardXp: 500, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Tome.Construct.png', tier: 3 },
  { id: 104, name: 'Library Titan', requirement: 'uploads', target: 100, rewardGold: 500, rewardXp: 1000, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Library.Titan.png', tier: 5 },

  // Track 2: Quizzes
  { id: 201, name: 'The Novice Owl', requirement: 'quizzes', target: 10, rewardGold: 50, rewardXp: 100, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Novice.Owl.png', tier: 1 },
  { id: 202, name: 'The Tome Warden', requirement: 'quizzes', target: 25, rewardGold: 100, rewardXp: 250, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Tome.Warden.png', tier: 2 },
  { id: 203, name: 'The Arcane Sage', requirement: 'quizzes', target: 50, rewardGold: 250, rewardXp: 500, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Arcane.Sage.png', tier: 3 },
  { id: 204, name: 'The Celestial Owl', requirement: 'quizzes', target: 100, rewardGold: 500, rewardXp: 1000, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Celestial.Owl.png', tier: 5 },

  // Track 3: Multi-step Quests
  { id: 301, name: 'Shadow Snake', requirement: 'multistep', target: 10, rewardGold: 75, rewardXp: 150, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Shadow.Serpent.png', tier: 1 },
  { id: 302, name: 'Twin-Head Viper', requirement: 'multistep', target: 25, rewardGold: 150, rewardXp: 300, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Twin-Head.Viper.png', tier: 2 },
  { id: 303, name: 'Dark Drake', requirement: 'multistep', target: 50, rewardGold: 300, rewardXp: 600, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Dark.Drake.png', tier: 3 },
  { id: 304, name: 'Void Hydra', requirement: 'multistep', target: 100, rewardGold: 600, rewardXp: 1200, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Void.Hydra.png', tier: 5 },

  // Track 4: Login Streaks
  { id: 401, name: 'Clockwork Beetle', requirement: 'streak', target: 5, rewardGold: 50, rewardXp: 50, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Clockwork.Beetle.png', tier: 1 },
  { id: 402, name: 'Timekeeper Knight', requirement: 'streak', target: 10, rewardGold: 100, rewardXp: 100, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Timekeeper.Knight.png', tier: 2 },
  { id: 403, name: 'Hourglass Golem', requirement: 'streak', target: 15, rewardGold: 200, rewardXp: 200, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Hourglass.Golem.png', tier: 3 },
  { id: 404, name: 'Chronos Titan', requirement: 'streak', target: 20, rewardGold: 400, rewardXp: 400, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Chronos.Titan.png', tier: 5 },

  // Track 5: Spectral Scribes (Incantations)
  { id: 903, name: 'Haunted Quill', requirement: 'incantations', target: 10, rewardXp: 150, rewardGold: 75, tier: 1, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/slime.png' },
  { id: 904, name: 'Spectral Typist', requirement: 'incantations', target: 25, rewardXp: 400, rewardGold: 200, tier: 2, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Goblin.png' },

  // Track 7: Colossi (Sports)
  { id: 701, name: 'Earth Elemental', requirement: 'sports', target: 10, rewardXp: 150, rewardGold: 75, tier: 1, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Goblin.png' },
  { id: 702, name: 'Mountain Titan', requirement: 'sports', target: 50, rewardXp: 1200, rewardGold: 600, tier: 3, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/slime.png' },

  // Track 8: Muses (Arts)
  { id: 801, name: 'Crystal Butterfly', requirement: 'arts', target: 10, rewardXp: 150, rewardGold: 75, tier: 1, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/slime.png' },
  { id: 802, name: 'Prism Weaver', requirement: 'arts', target: 50, rewardXp: 1200, rewardGold: 600, tier: 3, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Goblin.png' },

  // Track 9: Guardian Spirits (Wellness)
  { id: 901, name: 'Warm Wisp', requirement: 'wellness', target: 5, rewardXp: 100, rewardGold: 50, tier: 1, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/slime.png' },
  { id: 902, name: 'Hearth Spirit', requirement: 'wellness', target: 15, rewardXp: 300, rewardGold: 150, tier: 2, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Goblin.png' },
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
    {
      id: 112, // New ID
      title: "The Crossroads",
      description: "A series of critical choices await.",
      type: 'scenario',
      xp: 50,
      gold: 25,
      frequency: 'once',
      questionBank: [
          { q: "You encounter a troll. What do you do?", options: ["Pay toll", "Attack", "Flee"], a: "Pay toll" },
          { q: "A merchant offers a glowing potion. Do you:", options: ["Drink it", "Inspect it", "Ignore it"], a: "Inspect it" },
          { q: "You find a locked chest. Do you:", options: ["Smash it", "Pick lock", "Leave it"], a: "Pick lock" }
      ]
    },
    { 
        id: 107,
        title: "The Memory Spell",
        description: "Memorize the phrase, then type it perfectly before time runs out!",
        type: 'incantation',
        xp: 60,
        gold: 20,
        frequency: 'daily',
        timeLimit: 45,
        questionBank: [
            { q: "To be, or not to be, that is the question.", a: "To be, or not to be, that is the question." },
            { q: "The quick brown fox jumps over the lazy dog.", a: "The quick brown fox jumps over the lazy dog." }
        ]
    },
    { id: 106, title: "Weekly Reflection", description: "Write a short paragraph about what you learned this week.", xp: 100, gold: 50, type: 'journal', frequency: 'weekly', unlockDate: '2025-01-01' },
    { 
      id: 111, 
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
    },
    { id: 108, title: "Scout Report: Athletics", description: "Complete a 1-mile walk and upload a photo of your route/shoes.", type: 'scout-sports', xp: 100, gold: 40, frequency: 'daily' },
    { id: 109, title: "Scout Report: The Arts", description: "Draw a sketch of a castle and upload a picture of it.", type: 'scout-arts', xp: 100, gold: 40, frequency: 'weekly' },
    { id: 110, title: "Tavern Rest", description: "How rests your spirit today, hero?", type: 'wellness', xp: 10, gold: 10, frequency: 'daily' },
  ];

  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [quests, setQuests] = useState(INITIAL_QUESTS);
  const [submissions, setSubmissions] = useState([]);
  const [userRole, setUserRole] = useState(null); 
  const [currentUser, setCurrentUser] = useState(null); 

  const awardRewards = (studentId, xpToAdd, goldToAdd) => {
    setStudents(prevStudents => prevStudents.map(student => {
        if (student.id === studentId) {
            const oldLevel = Math.floor(student.xp / 1000) + 1;
            const newXp = student.xp + xpToAdd;
            let newGold = student.gold + goldToAdd;
            const newLevel = Math.floor(newXp / 1000) + 1;

            const updatedStudent = { ...student, xp: newXp, gold: newGold };

            if (newLevel > oldLevel) {
                newGold += 500; // Level Up Bonus
                updatedStudent.gold = newGold;
                updatedStudent.notifications = [
                    ...(student.notifications || []),
                    {
                        id: Date.now() + Math.random(),
                        title: `LEVEL UP! You reached Level ${newLevel}`,
                        xp: 0,
                        gold: 500,
                        quote: 'The King rewards your legendary growth!',
                    },
                ];
            }
            
            if (currentUser && currentUser.id === studentId) {
                setCurrentUser(prevUser => ({
                    ...prevUser,
                    xp: newXp,
                    gold: newGold,
                    notifications: updatedStudent.notifications
                }));
            }

            return updatedStudent;
        }
        return student;
    }));
  };

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

    const submitWellnessCheck = (questId, feeling) => {
        const quest = quests.find(q => q.id === questId);
        if (!quest) return { success: false, message: 'Quest not found' };

        setStudents(prevStudents => prevStudents.map(student => {
            if (student.id === currentUser.id) {
                const updatedStudent = { ...student, wellnessQuestsCompleted: (student.wellnessQuestsCompleted || 0) + 1 };
                 if (currentUser && currentUser.id === student.id) {
                    setCurrentUser(prev => ({...prev, wellnessQuestsCompleted: (prev.wellnessQuestsCompleted || 0) + 1}));
                }
                return updatedStudent
            }
            return student;
        }));

        awardRewards(currentUser.id, quest.xp, quest.gold);

        const newSubmission = {
            id: Date.now(),
            questId,
            studentId: currentUser.id,
            studentName: currentUser.heroName,
            feeling: feeling,
            type: 'wellness',
            status: 'read_only',
            timestamp: new Date().toLocaleDateString(),
        };

        setSubmissions(prev => [...prev, newSubmission]);

        return { success: true };
    };

  const approveSubmission = (submissionId) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) return;

    const quest = quests.find(q => q.id === submission.questId);
    if (!quest) return;

    setStudents(prev => prev.map(student => {
      if (student.id === submission.studentId) {
        const updatedStudent = { ...student };
        if (quest.type === 'upload') {
            updatedStudent.uploadQuestsCompleted = (student.uploadQuestsCompleted || 0) + 1;
        } else if (quest.type === 'scout-sports') {
            updatedStudent.sportsQuestsCompleted = (student.sportsQuestsCompleted || 0) + 1;
        } else if (quest.type === 'scout-arts') {
            updatedStudent.artsQuestsCompleted = (student.artsQuestsCompleted || 0) + 1;
        }

        if(currentUser && currentUser.id === submission.studentId){
             setCurrentUser(prev => {
                const updatedUser = { ...prev };
                if (quest.type === 'upload') {
                        updatedUser.uploadQuestsCompleted = (prev.uploadQuestsCompleted || 0) + 1;
                    } else if (quest.type === 'scout-sports') {
                        updatedUser.sportsQuestsCompleted = (prev.sportsQuestsCompleted || 0) + 1;
                    } else if (quest.type === 'scout-arts') {
                        updatedUser.artsQuestsCompleted = (prev.artsQuestsCompleted || 0) + 1;
                    }
                return updatedUser;
            });
        }

        return updatedStudent;
      }
      return student;
    }));

    awardRewards(submission.studentId, quest.xp, quest.gold);

    setSubmissions(prev => prev.map(s => 
      s.id === submissionId ? { ...s, status: 'approved' } : s
    ));
  };

  const attemptQuiz = (questId, userAnswer, dynamicCorrectAnswer = null, isFinalStep = true) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return { success: false, message: "Quest not found!" };

    const correctAnswer = dynamicCorrectAnswer !== null ? dynamicCorrectAnswer : quest.correctAnswer;
    let isCorrect = false;

    if (quest.type === 'incantation') {
        isCorrect = userAnswer.trim() === correctAnswer.trim();
    } else {
        if (typeof correctAnswer !== 'string') {
            return { success: false, message: "Incorrect answer. Try again!" };
        }
        isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    }

    if (isCorrect) {
      if (!isFinalStep) {
        return { success: true, message: "Correct! Keep going..." };
      }

      setStudents(students.map(student => {
        if (student.id === currentUser.id) {
          const updatedStudent = { ...student };
           if(quest.type === 'quiz') updatedStudent.quizQuestsCompleted = (student.quizQuestsCompleted || 0) + 1;
           if(quest.type === 'multi-step') updatedStudent.multiStepQuestsCompleted = (student.multiStepQuestsCompleted || 0) + 1;
           if(quest.type === 'incantation') updatedStudent.incantationQuestsCompleted = (student.incantationQuestsCompleted || 0) + 1;
           return updatedStudent;
        }
        return student;
      }));

      setCurrentUser(prev => {
        const updatedUser = {...prev };
        if(quest.type === 'quiz') updatedUser.quizQuestsCompleted = (prev.quizQuestsCompleted || 0) + 1;
        if(quest.type === 'multi-step') updatedUser.multiStepQuestsCompleted = (prev.multiStepQuestsCompleted || 0) + 1;
        if(quest.type === 'incantation') updatedUser.incantationQuestsCompleted = (prev.incantationQuestsCompleted || 0) + 1;
        return updatedUser
      });

      awardRewards(currentUser.id, quest.xp, quest.gold);

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

  const attemptScenario = (questId, isCorrect) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return { success: false, message: "Quest not found!" };

    if (isCorrect) {
        setStudents(students.map(student => {
            if (student.id === currentUser.id) {
                return { ...student, scenarioQuestsCompleted: (student.scenarioQuestsCompleted || 0) + 1 };
            }
            return student;
        }));

        setCurrentUser(prev => ({ ...prev, scenarioQuestsCompleted: (prev.scenarioQuestsCompleted || 0) + 1 }));
        
        awardRewards(currentUser.id, quest.xp, quest.gold);

        const newSubmission = {
            id: Date.now(),
            questId,
            studentId: currentUser.id,
            studentName: currentUser.heroName,
            status: 'approved',
            timestamp: new Date().toLocaleDateString(),
            type: 'scenario',
        };
        setSubmissions(prev => [...prev, newSubmission]);

        return { success: true };
    } else {
      return { success: false, message: "Incorrect choice made." };
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
      case 'incantations':
        requirementMet = (currentUser.incantationQuestsCompleted || 0) >= boss.target;
        break;
      case 'sports':
        requirementMet = (currentUser.sportsQuestsCompleted || 0) >= boss.target;
        break;
      case 'arts':
        requirementMet = (currentUser.artsQuestsCompleted || 0) >= boss.target;
        break;
      case 'wellness':
        requirementMet = (currentUser.wellnessQuestsCompleted || 0) >= boss.target;
        break;
      case 'streak':
        requirementMet = (currentUser.loginStreak || 0) >= boss.target;
        break;
      default:
        requirementMet = false;
    }

    if (requirementMet) {
      awardRewards(currentUser.id, boss.rewardXp, boss.rewardGold)
      
      setStudents(prev => prev.map(s => s.id === currentUser.id ? { ...s, defeatedBosses: [...s.defeatedBosses, bossId] } : s));
      setCurrentUser(prev => ({ ...prev, defeatedBosses: [...prev.defeatedBosses, bossId] }));

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

  const getSlayerPoints = (student) => {
    if (!student || !student.defeatedBosses || student.defeatedBosses.length === 0) {
      return 0;
    }
    return student.defeatedBosses.reduce((totalPoints, bossId) => {
      const boss = BOSSES.find(b => b.id === bossId);
      return totalPoints + (boss && boss.tier ? boss.tier : 0);
    }, 0);
  };

  const calculateSlayerScore = (student) => {
    if (!student) return 0;
    const slayerPoints = getSlayerPoints(student);
    return (slayerPoints * 1000000) + student.xp;
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
    createQuest, importQuestions, submitQuest, approveSubmission, getQuestStatus, submitWellnessCheck,
    userRole, setUserRole, currentUser, setCurrentUser,
    buyItem,
    equipOutfit,
    unequipOutfit,
    calculateScholarScore,
    calculateComebackScore,
    updateStudentStats,
    attemptQuiz,
    attemptScenario,
    clearNotifications,
    fightBoss,
    getSlayerPoints,
    calculateSlayerScore,
    awardRewards
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
