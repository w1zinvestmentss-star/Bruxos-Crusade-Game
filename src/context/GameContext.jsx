import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

// 1. MOCK STUDENTS (Expanded list for Leaderboard demo)
const INITIAL_STUDENTS = [
  { id: 1, name: "John Doe", heroName: "Sir Lancelot", level: 5, xp: 1250, gold: 400, inventory: [], midtermGPA: 75, finalGPA: 85, equippedItems: { armor: null, weapon: null } },
  { id: 2, name: "Jane Smith", heroName: "Lady Arwen", level: 6, xp: 1450, gold: 120, inventory: [], midtermGPA: 88, finalGPA: 90, equippedItems: { armor: null, weapon: null } },
  { id: 3, name: "Mike Ross", heroName: "Ranger Rick", level: 3, xp: 800, gold: 550, inventory: [], midtermGPA: 60, finalGPA: 70, equippedItems: { armor: null, weapon: null } },
  { id: 4, name: "Sarah Connor", heroName: "The Terminator", level: 4, xp: 1100, gold: 50, inventory: [], midtermGPA: 92, finalGPA: null, equippedItems: { armor: null, weapon: null } },
  { id: 5, name: "Bruce Wayne", heroName: "Dark Knight", level: 7, xp: 2000, gold: 900, inventory: [], midtermGPA: 85, finalGPA: 95, equippedItems: { armor: null, weapon: null } },
];

// 2. MOCK QUESTS
const INITIAL_QUESTS = [
  { id: 101, title: "Math Worksheet", description: "Upload a photo of your completed algebra sheet.", xp: 50, gold: 20 },
  { id: 102, title: "Science Project", description: "Submit a picture of your science fair poster.", xp: 100, gold: 50 },
];

export function GameProvider({ children }) {
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [quests, setQuests] = useState(INITIAL_QUESTS);
  
  // 3. THE SUBMISSION INBOX (Where uploads go)
  const [submissions, setSubmissions] = useState([]);
  
  const [userRole, setUserRole] = useState(null); 
  const [currentUser, setCurrentUser] = useState(null); 

  // TEACHER: Create Quest
  const createQuest = (newQuest) => {
    setQuests(prev => [...prev, { ...newQuest, id: Date.now() }]);
  };

  // STUDENT: Submit Proof (Fake Upload)
  const submitQuest = (questId, proofFile) => {
    // We create a temporary URL so the browser can display the image immediately
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

  // TEACHER: Approve & Reward
  const approveSubmission = (submissionId) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) return;

    const quest = quests.find(q => q.id === submission.questId);

    // Give XP/Gold to Student
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

    // Mark as Approved
    setSubmissions(prev => prev.map(s => 
      s.id === submissionId ? { ...s, status: 'approved' } : s
    ));
    
    // Update local user state if logged in
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

  // STUDENT: Buy Item from Barracks
  const buyItem = (item) => {
    if (!currentUser) return { success: false, message: "Not logged in!" };
    
    if (currentUser.gold >= item.cost) {
      // The item object, which now must include imageLink, is added to the inventory.
      const itemToSave = { ...item };
      
      // Update students array
      setStudents(prev => prev.map(student => {
        if (student.id === currentUser.id) {
          return {
            ...student,
            gold: student.gold - item.cost,
            inventory: [...(student.inventory || []), itemToSave]
          };
        }
        return student;
      }));

      // Update currentUser state
      setCurrentUser(prev => ({
        ...prev,
        gold: prev.gold - item.cost,
        inventory: [...(prev.inventory || []), itemToSave]
      }));

      return { success: true };
    } else {
      return { success: false, message: "Not enough gold!" };
    }
  };

  // STUDENT: Equip Item
  const equipItem = (itemType, itemLink) => {
    if (!currentUser) return;

    // Logic to toggle equip/unequip
    const isEquipped = currentUser.equippedItems[itemType] === itemLink;
    const newLink = isEquipped ? null : itemLink;

    // Update currentUser state
    setCurrentUser(prev => ({
      ...prev,
      equippedItems: {
        ...prev.equippedItems,
        [itemType]: newLink
      }
    }));

    // Update students array
    setStudents(prev => prev.map(student => {
      if (student.id === currentUser.id) {
        return {
          ...student,
          equippedItems: {
            ...student.equippedItems,
            [itemType]: newLink
          }
        };
      }
      return student;
    }));
  };

  // New calculation functions
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
    equipItem,
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
