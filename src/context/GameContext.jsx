import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { MATH_BLITZ_BANK } from '../data/mathBank';
import { HISTORY_BANK } from '../data/historyBank';
import { SCIENCE_BLITZ_BANK } from '../data/scienceBank';
import { INCANTATION_BANK } from '../data/incantationBank';
import { MULTISTEP_BANK } from '../data/multistepBank';
import { GAUNTLET_BANK } from '../data/gauntletBank';

const GameContext = createContext();

const ACHIEVEMENTS = [
  // --- THE LEVEL PROGRESSION TRACK (Guaranteed Real-World Prizes - $75 Total) ---
  { id: 'lvl_5', metric: 'level', target: 5, title: 'The Apprentice', desc: 'Reach Level 5.', rewardXp: 250, rewardGold: 100, rewardTicket: 1, realWorldPrize: '$10 STC Gift Card', limit: null },
  { id: 'lvl_10', metric: 'level', target: 10, title: 'The Journeyman', desc: 'Reach Level 10.', rewardXp: 500, rewardGold: 150, rewardTicket: 2, realWorldPrize: '$10 STC Gift Card', limit: null },
  { id: 'lvl_20', metric: 'level', target: 25, title: 'The Adept', desc: 'Reach Level 25.', rewardXp: 500, rewardGold: 200, rewardTicket: 3, realWorldPrize: '$15 STC Gift Card', limit: null },
  { id: 'lvl_35', metric: 'level', target: 40, title: 'The Master', desc: 'Reach Level 40.', rewardXp: 1000, rewardGold: 300, rewardTicket: 5, realWorldPrize: '$20 STC Gift Card', limit: null },
  { id: 'lvl_50', metric: 'level', target: 50, title: 'The Grandmaster', desc: 'Reach Level 50. You beat the game!', rewardXp: 2000, rewardGold: 500, rewardTicket: 10, realWorldPrize: '$30 STC Gift Card', limit: null },

  // --- THE SPEED RACES (Limited Quantity Bonuses - $150 Maximum Total Liability) ---
  { id: 'speed_vanguard', metric: 'level', target: 30, title: 'Realm Vanguard', desc: 'First 2 heroes to Level 30!', rewardXp: 1000, rewardGold: 0, rewardTicket: 5, realWorldPrize: '$25 STC Gift Card', limit: 2, fallbackGold: 1000 },
  { id: 'speed_boutique', metric: 'outfits', target: 15, title: 'Boutique Owner', desc: 'First 2 to own 15 outfits!', rewardXp: 1000, rewardGold: 0, rewardTicket: 5, realWorldPrize: '$15 STC Gift Card', limit: 2, fallbackGold: 1000 },
  { id: 'speed_legend', metric: 'total_quests', target: 250, title: 'The Legend', desc: 'First to complete 250 total quests!', rewardXp: 2000, rewardGold: 1000, rewardTicket: 10, realWorldPrize: '$40 STC Gift Card', limit: 1, fallbackGold: 2500 },
  { id: 'speed_slayer', metric: 'bosses', target: 15, title: 'Elite Slayer', desc: 'First 2 heroes to defeat 15 Bosses!', rewardXp: 1000, rewardGold: 0, rewardTicket: 5, realWorldPrize: '$15 STC Gift Card', limit: 2, fallbackGold: 1000 },

  // --- CONSISTENCY (Streaks) ---
  { id: 'streak_7', metric: 'streak', target: 7, title: 'Dedicated', desc: 'Log in for 7 total days.', rewardXp: 100, rewardGold: 50, rewardTicket: 1, realWorldPrize: null, limit: null },
  { id: 'streak_14', metric: 'streak', target: 14, title: 'Unbreakable', desc: 'Log in for 14 total days.', rewardXp: 250, rewardGold: 100, rewardTicket: 2, realWorldPrize: null, limit: null },
  { id: 'streak_30', metric: 'streak', target: 30, title: 'Relentless', desc: 'Log in for 30 total days.', rewardXp: 500, rewardGold: 200, rewardTicket: 3, realWorldPrize: null, limit: null },
  { id: 'streak_50', metric: 'streak', target: 50, title: 'Iron Will', desc: 'Log in for 50 total days.', rewardXp: 1000, rewardGold: 300, rewardTicket: 5, realWorldPrize: null, limit: null },
  { id: 'streak_100', metric: 'streak', target: 100, title: 'Century Mark', desc: 'Log in for 100 total days.', rewardXp: 1500, rewardGold: 500, rewardTicket: 10, realWorldPrize: null, limit: null },
  { id: 'streak_150', metric: 'streak', target: 150, title: 'Timeless Hero', desc: 'Log in for 150 total days.', rewardXp: 2000, rewardGold: 1000, rewardTicket: 15, realWorldPrize: null, limit: null },

  // --- COMBAT (Bosses) ---
  { id: 'first_blood', metric: 'bosses', target: 1, title: 'First Blood', desc: 'Defeat your first boss.', rewardXp: 100, rewardGold: 50, rewardTicket: 0, realWorldPrize: null, limit: null },
  { id: 'monster_hunter', metric: 'bosses', target: 5, title: 'Monster Hunter', desc: 'Defeat 5 bosses.', rewardXp: 250, rewardGold: 100, rewardTicket: 2, realWorldPrize: null, limit: null },
  { id: 'dungeon_crawler', metric: 'bosses', target: 15, title: 'Dungeon Crawler', desc: 'Defeat 15 bosses.', rewardXp: 500, rewardGold: 200, rewardTicket: 4, realWorldPrize: null, limit: null },
  { id: 'the_slayer', metric: 'bosses', target: 25, title: 'The Slayer', desc: 'Defeat 25 bosses.', rewardXp: 1000, rewardGold: 300, rewardTicket: 5, realWorldPrize: null, limit: null },
  { id: 'titan_fall', metric: 'bosses', target: 35, title: 'Titan Fall', desc: 'Defeat 35 bosses.', rewardXp: 1500, rewardGold: 500, rewardTicket: 8, realWorldPrize: null, limit: null },
  { id: 'savior_realm', metric: 'bosses', target: 44, title: 'Savior of the Realm', desc: 'Defeat EVERY boss in the game.', rewardXp: 3000, rewardGold: 1000, rewardTicket: 20, realWorldPrize: null, limit: null },

  // --- OVERALL EFFORT (Total Quests) ---
  { id: 'first_step', metric: 'total_quests', target: 1, title: 'The First Step', desc: 'Complete your very first quest.', rewardXp: 50, rewardGold: 20, rewardTicket: 0, realWorldPrize: null, limit: null },
  { id: 'halfway_there', metric: 'total_quests', target: 60, title: 'Halfway There', desc: 'Complete 60 total quests.', rewardXp: 500, rewardGold: 150, rewardTicket: 5, realWorldPrize: null, limit: null },
  { id: 'dedicated_student', metric: 'total_quests', target: 150, title: 'Dedicated Student', desc: 'Complete 150 total quests.', rewardXp: 1000, rewardGold: 300, rewardTicket: 8, realWorldPrize: null, limit: null },
  { id: 'quest_addict', metric: 'total_quests', target: 250, title: 'Quest Addict', desc: 'Complete 250 total quests.', rewardXp: 2000, rewardGold: 500, rewardTicket: 10, realWorldPrize: null, limit: null },

  // --- ACADEMICS (Specific Quests - $40 Total) ---
  { id: 'hw_hero_1', metric: 'uploads', target: 10, title: 'Homework Hero I', desc: 'Submit 10 Homework assignments.', rewardXp: 250, rewardGold: 100, rewardTicket: 2, realWorldPrize: null, limit: null },
  { id: 'hw_hero_2', metric: 'uploads', target: 50, title: 'Homework Hero II', desc: 'Submit 50 Homework assignments.', rewardXp: 500, rewardGold: 200, rewardTicket: 5, realWorldPrize: '$15 STC Gift Card', limit: null },
  { id: 'hw_hero_3', metric: 'uploads', target: 100, title: 'Homework Hero III', desc: 'Submit 100 Homework assignments.', rewardXp: 1500, rewardGold: 500, rewardTicket: 10, realWorldPrize: '$25 STC Gift Card', limit: null },
  { id: 'quiz_novice', metric: 'quizzes', target: 10, title: 'Quiz Novice', desc: 'Ace 10 Quizzes.', rewardXp: 150, rewardGold: 50, rewardTicket: 1, realWorldPrize: null, limit: null },
  { id: 'quiz_master', metric: 'quizzes', target: 50, title: 'Quiz Master', desc: 'Ace 50 Quizzes.', rewardXp: 500, rewardGold: 150, rewardTicket: 5, realWorldPrize: null, limit: null },
  { id: 'quiz_grandmaster', metric: 'quizzes', target: 100, title: 'Quiz Grandmaster', desc: 'Ace 100 Quizzes.', rewardXp: 1000, rewardGold: 300, rewardTicket: 8, realWorldPrize: null, limit: null },
  { id: 'the_scribe', metric: 'journals', target: 10, title: 'The Scribe', desc: 'Write 10 Journal Reflections.', rewardXp: 250, rewardGold: 100, rewardTicket: 2, realWorldPrize: null, limit: null },
  { id: 'the_novelist', metric: 'journals', target: 25, title: 'The Novelist', desc: 'Write 25 Journal Reflections.', rewardXp: 500, rewardGold: 200, rewardTicket: 5, realWorldPrize: null, limit: null },
  { id: 'the_tactician', metric: 'scenarios', target: 15, title: 'The Tactician', desc: 'Make the right choice in 15 Scenarios.', rewardXp: 250, rewardGold: 100, rewardTicket: 2, realWorldPrize: null, limit: null },
  { id: 'the_codebreaker', metric: 'ciphers', target: 15, title: 'The Codebreaker', desc: 'Solve 15 Riddles or Ciphers.', rewardXp: 250, rewardGold: 100, rewardTicket: 2, realWorldPrize: null, limit: null },
  { id: 'the_wordsmith', metric: 'incantations', target: 15, title: 'The Wordsmith', desc: 'Type 15 Incantations perfectly.', rewardXp: 250, rewardGold: 100, rewardTicket: 2, realWorldPrize: null, limit: null },
  { id: 'active_hero', metric: 'sports', target: 10, title: 'Active Hero', desc: 'Complete 10 Physical Education Scout Reports.', rewardXp: 250, rewardGold: 100, rewardTicket: 3, realWorldPrize: null, limit: null },
  { id: 'creative_soul', metric: 'arts', target: 10, title: 'Creative Soul', desc: 'Complete 10 Fine Arts Scout Reports.', rewardXp: 250, rewardGold: 100, rewardTicket: 3, realWorldPrize: null, limit: null },
  { id: 'sound_mind', metric: 'wellness', target: 10, title: 'Sound Mind', desc: 'Complete 10 Tavern Rests.', rewardXp: 100, rewardGold: 50, rewardTicket: 1, realWorldPrize: null, limit: null },
  { id: 'inner_peace', metric: 'wellness', target: 30, title: 'Inner Peace', desc: 'Complete 30 Tavern Rests.', rewardXp: 300, rewardGold: 150, rewardTicket: 3, realWorldPrize: null, limit: null },

  // --- ECONOMY (Shop & Outfits) ---
  { id: 'fashionista', metric: 'outfits', target: 1, title: 'Fashionista', desc: 'Purchase your first outfit.', rewardXp: 100, rewardGold: 0, rewardTicket: 1, realWorldPrize: null, limit: null },
  { id: 'wardrobe_wealth', metric: 'outfits', target: 5, title: 'Wardrobe Wealth', desc: 'Purchase 5 different outfits.', rewardXp: 250, rewardGold: 0, rewardTicket: 2, realWorldPrize: null, limit: null },
  { id: 'master_disguise', metric: 'outfits', target: 20, title: 'Master of Disguise', desc: 'Purchase 20 different outfits.', rewardXp: 500, rewardGold: 0, rewardTicket: 5, realWorldPrize: null, limit: null },
  { id: 'realm_icon', metric: 'outfits', target: 30, title: 'Realm Icon', desc: 'Purchase 30 different outfits.', rewardXp: 1000, rewardGold: 0, rewardTicket: 10, realWorldPrize: null, limit: null },

  // --- RAFFLE PITY TIMERS (Bad Luck Protection - $35 Total) ---
  { id: 'pity_15', metric: 'tickets', target: 15, title: 'Adept Challenger', desc: 'Earn 15 Raffle Tickets overall.', rewardXp: 0, rewardGold: 0, rewardTicket: 0, realWorldPrize: '$10 STC Gift Card', limit: null },
  { id: 'pity_35', metric: 'tickets', target: 35, title: 'Master Challenger', desc: 'Earn 35 Raffle Tickets overall.', rewardXp: 0, rewardGold: 0, rewardTicket: 0, realWorldPrize: '$10 STC Gift Card', limit: null },
  { id: 'pity_50', metric: 'tickets', target: 50, title: 'Grand Challenger', desc: 'Earn 50 Raffle Tickets overall.', rewardXp: 0, rewardGold: 0, rewardTicket: 0, realWorldPrize: '$15 STC Gift Card', limit: null },

  // --- SEASONAL / SCHEDULED (Time-Gated) ---
  { id: 'spring_awakening', metric: 'total_quests', target: 80, title: 'Spring Awakening', desc: 'Complete 80 quests. Unlocks April 1st!', rewardXp: 500, rewardGold: 200, rewardTicket: 5, realWorldPrize: null, limit: null, unlockDate: '2026-04-01' },
  { id: 'may_madness', metric: 'bosses', target: 20, title: 'May Madness', desc: 'Defeat 20 Bosses. Unlocks May 1st!', rewardXp: 1000, rewardGold: 500, rewardTicket: 5, realWorldPrize: null, limit: null, unlockDate: '2026-05-01' },
  { id: 'year_end', metric: 'level', target: 25, title: 'End of Year Champion', desc: 'Reach Level 25. Unlocks June 1st!', rewardXp: 1500, rewardGold: 1000, rewardTicket: 10, realWorldPrize: null, limit: null, unlockDate: '2026-06-01' }
];

const BOSSES = [
  // Track 1: Uploads (The Paper Constructs)
  { id: 101, name: 'Paper Minion', requirement: 'uploads', target: 10, rewardGold: 15, rewardXp: 50, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Paper.Minion.png', tier: 1, finishingBlow: { type: 'manual', prompt: 'Upload an assignment with a C or higher.' } },
  { id: 102, name: 'Scroll Guardian', requirement: 'uploads', target: 25, rewardGold: 25, rewardXp: 100, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Scroll.Guardian2.png', tier: 2, finishingBlow: { type: 'manual', prompt: 'Upload an assignment with a B or higher.' } },
  { id: 103, name: 'Tome Construct', requirement: 'uploads', target: 50, rewardGold: 50, rewardXp: 200, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Tome.Construct.png', tier: 3, finishingBlow: { type: 'manual', prompt: 'Upload a major assignment or test with a B+ or higher.' } },
  { id: 104, name: 'Library Titan', requirement: 'uploads', target: 100, rewardGold: 150, rewardXp: 500, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Library.Titan.png', tier: 5, finishingBlow: { type: 'manual', prompt: 'Upload a major test, essay, or capstone project with an A.' } },

  // Track 2: Quizzes (Order of the Owl)
  { id: 201, name: 'The Novice Owl', requirement: 'quizzes', target: 10, rewardGold: 15, rewardXp: 50, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Novice.Owl.png', tier: 1, finishingBlow: { type: 'auto', prompt: 'Solve: 15 x 4', answer: '60', timeLimit: 60 } },
  { id: 202, name: 'The Tome Warden', requirement: 'quizzes', target: 25, rewardGold: 25, rewardXp: 100, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Tome.Warden.png', tier: 2, finishingBlow: { type: 'auto', prompt: 'Solve: 25 x 6', answer: '150', timeLimit: 50 } },
  { id: 203, name: 'The Arcane Sage', requirement: 'quizzes', target: 50, rewardGold: 50, rewardXp: 200, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Arcane.Sage.png', tier: 3, finishingBlow: { type: 'auto', prompt: 'Solve: (50 * 4) / 2', answer: '100', timeLimit: 40 } },
  { id: 204, name: 'The Celestial Owl', requirement: 'quizzes', target: 100, rewardGold: 150, rewardXp: 500, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Celestial.Owl.png', tier: 5, finishingBlow: { type: 'auto', prompt: 'Solve: (144 / 12) * 5 + 40', answer: '100', timeLimit: 30 } },

  // Track 3: Multi-step Quests (The Ancient Colossi)
  { id: 301, name: 'Shadow Snake', requirement: 'multistep', target: 10, rewardGold: 15, rewardXp: 50, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Shadow.Serpent.png', tier: 1, finishingBlow: { type: 'auto', prompt: 'Solve: 12 + 8', answer: '20', timeLimit: 60 } },
  { id: 302, name: 'Twin-Head Viper', requirement: 'multistep', target: 25, rewardGold: 25, rewardXp: 100, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Twin-Head.Viper.png', tier: 2, finishingBlow: { type: 'auto', prompt: 'Solve: 45 - 17', answer: '28', timeLimit: 50 } },
  { id: 303, name: 'Dark Drake', requirement: 'multistep', target: 50, rewardGold: 50, rewardXp: 200, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Dark.Drake.png', tier: 3, finishingBlow: { type: 'auto', prompt: 'Solve: 16 * 5', answer: '80', timeLimit: 40 } },
  { id: 304, name: 'Void Hydra', requirement: 'multistep', target: 100, rewardGold: 150, rewardXp: 500, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Void.Hydra.png', tier: 5, finishingBlow: { type: 'auto', prompt: 'Solve: (144 / 12) * 5 + 40', answer: '100', timeLimit: 30 } },

  // Track 4: Login Streaks (The Chronos Entities)
  { id: 401, name: 'Clockwork Beetle', requirement: 'streak', target: 10, rewardGold: 15, rewardXp: 50, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Clockwork.Beetle.png', tier: 1, finishingBlow: { type: 'manual', prompt: 'Write a short reflection on your recent habits and consistency.' } }, // Target set to 10
  { id: 402, name: 'Timekeeper Knight', requirement: 'streak', target: 50, rewardGold: 25, rewardXp: 100, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Timekeeper.Knight.png', tier: 2, finishingBlow: { type: 'manual', prompt: 'Write a paragraph reflecting on your mental health and daily routines.' } }, // Target set to 50
  { id: 403, name: 'Hourglass Golem', requirement: 'streak', target: 110, rewardGold: 50, rewardXp: 200, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Hourglass.Golem.png', tier: 3, finishingBlow: { type: 'manual', prompt: 'Write a deep reflection on how your habits have improved your well-being.' } }, // Target set to 110
  { id: 404, name: 'Chronos Titan', requirement: 'streak', target: 175, rewardGold: 150, rewardXp: 500, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Chronos.Titan.png', tier: 5, finishingBlow: { type: 'manual', prompt: 'Write a deep, 1-paragraph reflection on your habits, mental health, or consistency to prove your dedication.' } }, // Target set to 175 (70% Login Milestone)

  // Track 5: The Volcanic Lineage / Scenarios
  { id: 501, name: 'The Ember Whelp', requirement: 'scenarios', target: 10, rewardGold: 15, rewardXp: 50, tier: 1, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Ember.Whelp.png', finishingBlow: { type: 'auto', prompt: 'What has to be broken before you can use it?', answer: 'an egg', timeLimit: 60 } },
  { id: 502, name: 'The Ash Drake', requirement: 'scenarios', target: 25, rewardGold: 25, rewardXp: 100, tier: 2, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Ash.Drake.png', finishingBlow: { type: 'auto', prompt: 'I’m tall when I’m young, and I’m short when I’m old. What am I?', answer: 'a candle', timeLimit: 50 } },
  { id: 503, name: 'The Obsidian Wyvern', requirement: 'scenarios', target: 50, rewardGold: 50, rewardXp: 200, tier: 3, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Obsidian.Wyvern.png?v=2', finishingBlow: { type: 'auto', prompt: 'What month of the year has 28 days?', answer: 'all of them', timeLimit: 40 } },
  { id: 504, name: 'The Molten Sovereign', requirement: 'scenarios', target: 100, rewardGold: 150, rewardXp: 500, tier: 5, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Molten.Sovereign.png', finishingBlow: { type: 'auto', prompt: 'Solve the anagram to find a 6-letter word: SILENT', answer: 'listen', timeLimit: 30 } },

  // Track 6: The Shapeshifters / Ciphers
  { id: 601, name: 'The Phantom Mask', requirement: 'ciphers', target: 10, rewardGold: 15, rewardXp: 50, tier: 1, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Phantom.Mask.png', finishingBlow: { type: 'auto', prompt: 'What has to be broken before you can use it?', answer: 'an egg', timeLimit: 60 } },
  { id: 602, name: 'The Mirror Fiend', requirement: 'ciphers', target: 25, rewardGold: 25, rewardXp: 100, tier: 2, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Mirror.Fiend.png', finishingBlow: { type: 'auto', prompt: 'I’m tall when I’m young, and I’m short when I’m old. What am I?', answer: 'a candle', timeLimit: 50 } },
  { id: 603, name: 'The Faceless One', requirement: 'ciphers', target: 50, rewardGold: 50, rewardXp: 200, tier: 3, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Faceless.One.png', finishingBlow: { type: 'auto', prompt: 'What month of the year has 28 days?', answer: 'all of them', timeLimit: 40 } },
  { id: 604, name: 'The Shattered Sovereign', requirement: 'ciphers', target: 100, rewardGold: 150, rewardXp: 500, tier: 5, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Shattered.Sovereign.png', finishingBlow: { type: 'auto', prompt: 'Solve the anagram to find a 6-letter word: SILENT', answer: 'listen', timeLimit: 30 } },

  // Track 7: Incantations / Spectral Scribes
  { id: 701, name: 'The Haunted Quill', requirement: 'incantations', target: 10, rewardGold: 15, rewardXp: 50, tier: 1, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Haunted.Quill.png', finishingBlow: { type: 'auto', prompt: 'Type: Hello world.', answer: 'Hello world.', timeLimit: 60 } },
  { id: 702, name: 'The Spectral Typist', requirement: 'incantations', target: 25, rewardGold: 25, rewardXp: 100, tier: 2, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Spectral.Typist.png', finishingBlow: { type: 'auto', prompt: 'Type: A wizard is never late, nor is he early.', answer: 'A wizard is never late, nor is he early.', timeLimit: 50 } },
  { id: 703, name: 'The Boundless Tome', requirement: 'incantations', target: 50, rewardGold: 50, rewardXp: 200, tier: 3, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Boundless.Tome.png', finishingBlow: { type: 'auto', prompt: 'Type: The brave men, living and dead, who struggled here, have consecrated it.', answer: 'The brave men, living and dead, who struggled here, have consecrated it.', timeLimit: 40 } },
  { id: 704, name: 'The Spectral Archivist', requirement: 'incantations', target: 100, rewardGold: 150, rewardXp: 500, tier: 5, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Spectral.Archivist.png', finishingBlow: { type: 'auto', prompt: 'Type: It is not the critic who counts; not the man who points out how the strong man stumbles, or where the doer of deeds could have done them better.', answer: 'It is not the critic who counts; not the man who points out how the strong man stumbles, or where the doer of deeds could have done them better.', timeLimit: 30 } },

  // Track 8: Sports (The Earth Titans)
  { id: 801, name: 'The Stone Minotaur', requirement: 'sports', target: 10, rewardGold: 15, rewardXp: 50, tier: 1, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Stone.Minotaur.png', finishingBlow: { type: 'manual', prompt: 'Upload proof of a 1km walk.' } },
  { id: 802, name: 'The Desert Worm', requirement: 'sports', target: 25, rewardGold: 25, rewardXp: 100, tier: 2, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Desert.Worm.png', finishingBlow: { type: 'manual', prompt: 'Upload proof of a 2km walk or run.' } },
  { id: 803, name: 'The Armored Beast', requirement: 'sports', target: 50, rewardGold: 50, rewardXp: 200, tier: 3, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Armored.Beast.png', finishingBlow: { type: 'manual', prompt: 'Upload proof of a 3km run or 15-min workout.' } },
  { id: 804, name: 'The Ivory Leviathan', requirement: 'sports', target: 100, rewardGold: 150, rewardXp: 500, tier: 5, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Ivory.Leviathan.png', finishingBlow: { type: 'manual', prompt: 'Upload proof of a 5km run or intense 30-min workout.' } },

  // Track 9: The Arts (The Prismatic Muses)
  { id: 901, name: 'The Crystal Butterfly', requirement: 'arts', target: 10, rewardGold: 15, rewardXp: 50, tier: 1, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Crystal.Butterfly.png', finishingBlow: { type: 'manual', prompt: 'Upload a detailed sketch.' } },
  { id: 902, name: 'The Painted Siren', requirement: 'arts', target: 25, rewardGold: 25, rewardXp: 100, tier: 2, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Painted.Siren.png', finishingBlow: { type: 'manual', prompt: 'Upload a shaded sketch with some background elements.' } },
  { id: 903, name: 'The Glass Golem', requirement: 'arts', target: 50, rewardGold: 50, rewardXp: 200, tier: 3, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Glass.Golem.png', finishingBlow: { type: 'manual', prompt: 'Upload a partially colored piece or digital draft.' } },
  { id: 904, name: 'The Prism Weaver', requirement: 'arts', target: 100, rewardGold: 150, rewardXp: 500, tier: 5, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Prism.Weaver.png', finishingBlow: { type: 'manual', prompt: 'Upload a fully colored, finished masterpiece.' } },

  // Track 10: Wellness (The Guardian Spirits)
  { id: 1001, name: 'The Warm Wisp', requirement: 'wellness', target: 10, rewardGold: 15, rewardXp: 50, tier: 1, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Warm.Wisp.png', finishingBlow: { type: 'manual', prompt: 'Write a short reflection on your recent habits and consistency.' } },
  { id: 1002, name: 'The Hearth Spirit', requirement: 'wellness', target: 25, rewardGold: 25, rewardXp: 100, tier: 2, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Hearth.Spirit.png', finishingBlow: { type: 'manual', prompt: 'Write a paragraph reflecting on your mental health and daily routines.' } },
  { id: 1003, name: 'The Shielding Angel', requirement: 'wellness', target: 50, rewardGold: 50, rewardXp: 200, tier: 3, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Shielding.Angel.png', finishingBlow: { type: 'manual', prompt: 'Write a deep reflection on how your habits have improved your well-being.' } },
  { id: 1004, name: 'The Seraph of Hope', requirement: 'wellness', target: 100, rewardGold: 150, rewardXp: 500, tier: 5, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Seraph.of.Hope.png', finishingBlow: { type: 'manual', prompt: 'Write a deep, 1-paragraph reflection on your habits, mental health, or consistency to prove your dedication.' } },

  // Track 11: The Dream Eaters / Journals
  { id: 1101, name: 'The Shadow Moth', requirement: 'journal', target: 10, rewardGold: 15, rewardXp: 50, tier: 1, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Shadow.Moth.png', finishingBlow: { type: 'manual', prompt: 'Write a short reflection on your recent habits and consistency.' } },
  { id: 1102, name: 'The Dream Weave', requirement: 'journal', target: 25, rewardGold: 25, rewardXp: 100, tier: 2, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Dream.Weave.png', finishingBlow: { type: 'manual', prompt: 'Write a paragraph reflecting on your mental health and daily routines.' } },
  { id: 1103, name: 'The Night Terror', requirement: 'journal', target: 50, rewardGold: 50, rewardXp: 200, tier: 3, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Night.Terror.png', finishingBlow: { type: 'manual', prompt: 'Write a deep reflection on how your habits have improved your well-being.' } },
  { id: 1104, name: 'The Weaver of Fates', requirement: 'journal', target: 100, rewardGold: 150, rewardXp: 500, tier: 5, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Weaver.of.Fates.png', tier: 5, finishingBlow: { type: 'manual', prompt: 'Write a deep, 1-paragraph reflection on your habits, mental health, or consistency to prove your dedication.' } },

  // Track 12: Gauntlet Bosses (Phantoms of the Blur)
  { id: 1201, name: 'The Brick Brute', requirement: 'gauntlet', target: 5, rewardGold: 15, rewardXp: 50, tier: 1, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Brick.Brute.png', finishingBlow: { type: 'auto', prompt: 'Solve: 12 + 15', answer: '27', timeLimit: 7 } },
  { id: 1202, name: 'The Static Beast', requirement: 'gauntlet', target: 10, rewardGold: 25, rewardXp: 100, tier: 2, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Static.Beast.png', finishingBlow: { type: 'auto', prompt: 'Solve: 8 x 7', answer: '56', timeLimit: 7 } },
  { id: 1203, name: 'The Veil Dancer', requirement: 'gauntlet', target: 20, rewardGold: 50, rewardXp: 200, tier: 3, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Veil.Dancer.png', finishingBlow: { type: 'auto', prompt: 'Solve: 125 / 5', answer: '25', timeLimit: 7 } },
  { id: 1204, name: 'The Storm-Born King', requirement: 'gauntlet', target: 40, rewardGold: 150, rewardXp: 500, tier: 5, image: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Storm-Born.King.png', finishingBlow: { type: 'auto', prompt: 'Solve: (12 x 12) - 44', answer: '100', timeLimit: 7 } }
];

const BOSS_LOOT_OUTFITS = {
  104: { id: 'loot_104', name: 'Library Titan Armor', type: 'outfit', imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Library.Titan.Armor.png' },
  204: { id: 'loot_204', name: 'Celestial Owl Armor', type: 'outfit', imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Celestial.Owl.Armor.png' },
  304: { id: 'loot_304', name: 'Void Hydra Armor', type: 'outfit', imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Void.Hydra.Armor.png' },
  404: { id: 'loot_404', name: 'Chronos Titan Armor', type: 'outfit', imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Chronos.Titan.Armor.png' },
  504: { id: 'loot_504', name: 'Molten Sovereign Armor', type: 'outfit', imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Molten.Sovereign.Armor.png' },
  604: { id: 'loot_604', name: 'Shattered Sovereign Armor', type: 'outfit', imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Shattered.Sovereign.Armor.png' },
  704: { id: 'loot_704', name: 'Spectral Archivist Armor', type: 'outfit', imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Spectral.Archivist.Armor.png' },
  804: { id: 'loot_804', name: 'Ivory Leviathan Armor', type: 'outfit', imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Ivory.Leviathan.Armor.png' },
  904: { id: 'loot_904', name: 'Prism Weaver Armor', type: 'outfit', imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Prism.Weaver.Armor.png' },
  1004: { id: 'loot_1004', name: 'Seraph of Hope Armor', type: 'outfit', imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Seraph.of.Hope.Armor.png' },
  1104: { id: 'loot_1104', name: 'Weaver of Fates Armor', type: 'outfit', imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Weaver.of.Fates.Armor.png' }
};

const VICTORY_QUOTES = [
  'Your mind is as sharp as a sword!',
  'A legendary feat!',
  'The Kingdom grows stronger with your knowledge.',
  'Knowledge is the ultimate weapon!',
  'Another victory for the Archives!',
];

const formatProfile = (dbProfile = {}) => {
  const profile = dbProfile || {};

  return {
    ...profile,
    heroName: profile.hero_name,
    heroClass: profile.hero_class || 'None',
    realName: profile.real_name,
    currentBodySprite: profile.current_body_sprite || 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/new.base.body2.png',
    loginStreak: profile.login_streak || 0,
    raffleTickets: profile.raffle_tickets || 0,
    totalTicketsEarned: profile.total_tickets_earned || 0,
    lootboxPity: profile.lootbox_pity || 0,
    inventory: profile.inventory || [],
    notifications: profile.notifications || [],
    pendingPrizes: profile.pendingPrizes || [],
    defeatedBosses: (profile.defeated_bosses || []).map(Number),
    unlockedAchievements: profile.unlocked_achievements || [],
    unlockedTitles: profile.unlocked_titles || ['The Novice'],
    level: Math.floor((profile.xp || 0) / 1000) + 1,
    midtermGPA: profile.midterm_gpa || 0,
    finalGPA: profile.final_gpa !== undefined ? profile.final_gpa : null,
    uploadQuestsCompleted: profile.upload_quests_completed || 0,
    quizQuestsCompleted: profile.quiz_quests_completed || 0,
    multiStepQuestsCompleted: profile.multi_step_quests_completed || 0,
    scenarioQuestsCompleted: profile.scenario_quests_completed || 0,
    cipherQuestsCompleted: profile.cipher_quests_completed || 0,
    incantationQuestsCompleted: profile.incantation_quests_completed || 0,
    sportsQuestsCompleted: profile.sports_quests_completed || 0,
    artsQuestsCompleted: profile.arts_quests_completed || 0,
    wellnessQuestsCompleted: profile.wellness_quests_completed || 0,
    journalQuestsCompleted: profile.journal_quests_completed || 0,
    gauntletQuestsCompleted: profile.gauntlet_quests_completed || 0,
    equippedPet: profile.equipped_pet || null,
    voidGraspCount: profile.void_grasp_count || 0,
    spellOathCount: profile.spell_oath_count || 0,
    spellEmberCount: profile.spell_ember_count || 0,
    lastLoginDate: profile.last_login_date || null,
  };
};

const saveProfileToCloud = async (userId, updates) => {
  // Map JS camelCase back to Database snake_case
  const dbUpdates = {};
  if (updates.gold !== undefined) dbUpdates.gold = updates.gold;
  if (updates.xp !== undefined) dbUpdates.xp = updates.xp;
  if (updates.heroName !== undefined) dbUpdates.hero_name = updates.heroName;
  if (updates.heroClass !== undefined) dbUpdates.hero_class = updates.heroClass;
  if (updates.currentBodySprite !== undefined) dbUpdates.current_body_sprite = updates.currentBodySprite;
  if (updates.loginStreak !== undefined) dbUpdates.login_streak = updates.loginStreak;
  if (updates.raffleTickets !== undefined) dbUpdates.raffle_tickets = updates.raffleTickets;
  if (updates.totalTicketsEarned !== undefined) dbUpdates.total_tickets_earned = updates.totalTicketsEarned;
  if (updates.lootboxPity !== undefined) dbUpdates.lootbox_pity = updates.lootboxPity;
  if (updates.unlockedAchievements !== undefined) dbUpdates.unlocked_achievements = updates.unlockedAchievements;
  if (updates.defeatedBosses !== undefined) dbUpdates.defeated_bosses = updates.defeatedBosses.map(String);
  if (updates.notifications !== undefined) dbUpdates.notifications = updates.notifications;
  if (updates.activeBuffs !== undefined) dbUpdates.active_buffs = updates.activeBuffs;
  if (updates.equippedPet !== undefined) dbUpdates.equipped_pet = updates.equippedPet;
  if (updates.lastLoginDate !== undefined) dbUpdates.last_login_date = updates.lastLoginDate;
  if (updates.voidGraspCount !== undefined) dbUpdates.void_grasp_count = updates.voidGraspCount;
  if (updates.spellOathCount !== undefined) dbUpdates.spell_oath_count = updates.spellOathCount;
  if (updates.spellEmberCount !== undefined) dbUpdates.spell_ember_count = updates.spellEmberCount;

  // Map all quest counters:
  if (updates.uploadQuestsCompleted !== undefined) dbUpdates.upload_quests_completed = updates.uploadQuestsCompleted;
  if (updates.quizQuestsCompleted !== undefined) dbUpdates.quiz_quests_completed = updates.quizQuestsCompleted;
  if (updates.multiStepQuestsCompleted !== undefined) dbUpdates.multi_step_quests_completed = updates.multiStepQuestsCompleted;
  if (updates.scenarioQuestsCompleted !== undefined) dbUpdates.scenario_quests_completed = updates.scenarioQuestsCompleted;
  if (updates.cipherQuestsCompleted !== undefined) dbUpdates.cipher_quests_completed = updates.cipherQuestsCompleted;
  if (updates.incantationQuestsCompleted !== undefined) dbUpdates.incantation_quests_completed = updates.incantationQuestsCompleted;
  if (updates.sportsQuestsCompleted !== undefined) dbUpdates.sports_quests_completed = updates.sportsQuestsCompleted;
  if (updates.artsQuestsCompleted !== undefined) dbUpdates.arts_quests_completed = updates.artsQuestsCompleted;
  if (updates.wellnessQuestsCompleted !== undefined) dbUpdates.wellness_quests_completed = updates.wellnessQuestsCompleted;
  if (updates.journalQuestsCompleted !== undefined) dbUpdates.journal_quests_completed = updates.journalQuestsCompleted;
  if (updates.gauntletQuestsCompleted !== undefined) dbUpdates.gauntlet_quests_completed = updates.gauntletQuestsCompleted;
  if (updates.midtermGPA !== undefined) dbUpdates.midterm_gpa = updates.midtermGPA;
  if (updates.finalGPA !== undefined) dbUpdates.final_gpa = updates.finalGPA;

  const { error } = await supabase.from('profiles').update(dbUpdates).eq('id', userId);
  if (error) console.error("Error saving to cloud:", error);
};

const saveSubmissionToCloud = async (submission) => {
  const dbSub = {
    quest_id: submission.questId,
    student_id: submission.studentId,
    student_name: submission.studentName,
    status: submission.status,
    type: submission.type || 'upload',
    is_boss_strike: submission.isBossStrike || false,
    proof_content: submission.proofContent || null // STRICT MAPPING
  };
  const { error } = await supabase.from('submissions').insert([dbSub]);
  if (error) console.error("Error saving submission:", error);
};

const updateSubmissionStatusInCloud = async (submission, status) => {
  // We match by quest_id + student_id since the local Date.now() id
  // doesn't match the UUID primary key that Supabase auto-generates.
  const { error } = await supabase
    .from('submissions')
    .update({ status })
    .eq('quest_id', submission.questId)
    .eq('student_id', submission.studentId);
  if (error) console.error("Error updating submission status:", error);
  return { success: !error, error };
};


export function GameProvider({ children }) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = yesterday.toISOString().split('T')[0];

  const nextYear = new Date();
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  const nextYearString = nextYear.toISOString().split('T')[0];

  const INITIAL_QUESTS = [
    { id: 101, title: "The Herald's Post I", description: "Deliver proof of your completed homework here (e.g., Math, Science, English, Geography, and other types of work). Take a picture of your homework as proof.", xp: 20, gold: 10, type: 'upload', frequency: 'daily', unlockDate: null },
    { id: 102, title: "The Herald's Post II", description: "Deliver proof of additional completed homework here (e.g., Math, Science, English, Geography, etc.). Take a picture of your homework as proof.", xp: 20, gold: 10, type: 'upload', frequency: 'daily', unlockDate: null },
    {
      id: 103,
      title: "Math Speed Run",
      description: "Answer as many questions as you can in 120 seconds! Skip if you get stuck. Max rewards at 30 correct answers.",
      xp: 15,
      gold: 5,
      type: 'blitz',
      frequency: 'daily',
      unlockDate: null,
      timeLimit: 120,
      questionBank: MATH_BLITZ_BANK
    },
    {
      id: 104,
      title: "History Check",
      description: "Test your knowledge of history and geography. Answer as many questions as you can in 120 seconds!",
      xp: 15,
      gold: 5,
      type: 'blitz',
      frequency: 'daily',
      unlockDate: null,
      timeLimit: 120,
      questionBank: HISTORY_BANK
    },
    { id: 112, title: "Science Speed Run", description: "Answer as many science questions as you can in 120 seconds!", type: 'blitz', xp: 15, gold: 5, frequency: 'daily', timeLimit: 120, questionBank: SCIENCE_BLITZ_BANK },
    {
      id: 107,
      title: "The Memory Spell",
      description: "Memorize the phrase, then type it perfectly before time runs out!",
      type: 'incantation',
      xp: 15,
      gold: 5,
      frequency: 'daily',
      timeLimit: 120,
      questionBank: INCANTATION_BANK
    },
    { id: 106, title: "Weekly Reflection", description: "Write a short paragraph about what you learned this week.", xp: 30, gold: 10, type: 'journal', frequency: 'weekly', unlockDate: '2025-01-01' },
    {
      id: 111,
      title: "Trial of the Hydra",
      description: "Solve as many sequential math problems as you can in 120 seconds! Complete at least 1 full Hydra to succeed. Extra victories award bonus Gold & XP.",
      type: 'multi-step',
      xp: 20,
      gold: 10,
      frequency: 'daily',
      unlockDate: '2025-01-01',
      stepBank: MULTISTEP_BANK,
      timeLimit: 120
    },
    { id: 108, title: "Scout Report: Athletics", description: "Provide proof of any physical activity you completed today, such as running, playing a sport, dancing, biking, or working out. Upload a photo or screenshot of your activity as proof.", type: 'scout-sports', xp: 15, gold: 5, frequency: 'daily' },
    { id: 109, title: "Scout Report: The Arts", description: "Provide proof of any artwork you completed, such as a drawing, painting, sculpture, school art project, craft, or digital art. Upload a photo of your masterpiece as proof.", type: 'scout-arts', xp: 15, gold: 10, frequency: 'weekly' },
    { id: 110, title: "Tavern Rest", description: "How rests your spirit today, hero?", type: 'wellness', xp: 5, gold: 2, frequency: 'daily' },
    { id: 999, title: "The Gauntlet", description: "5 Questions. 7 Seconds each. No mistakes allowed. One attempt per day.", type: 'gauntlet', xp: 20, gold: 10, frequency: 'daily', totalSteps: 5, timePerStep: 7, questionBank: GAUNTLET_BANK }
  ];

  const [students, setStudents] = useState([]);
  const [quests, setQuests] = useState(INITIAL_QUESTS);
  const [submissions, setSubmissions] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  
  const currentUserRef = useRef(null);
  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const [isProfileLoaded, setIsProfileLoaded] = useState(false);
  const [currentRafflePrize, setCurrentRafflePrize] = useState('Mystery Prize');
  const [session, setSession] = useState(null);
  const [globalEffects, setGlobalEffects] = useState([]);
  const [highScores, setHighScores] = useState({});
  const [blitzHighScores, setBlitzHighScores] = useState({});
  const [prizeClaims, setPrizeClaims] = useState([]);
  const [pendingPrizesList, setPendingPrizesList] = useState([]);

  useEffect(() => {
    const handleAuthChange = async (session) => {
      setSession(session);
      if (session) {
        // Reset loading states for a fresh login
        setIsProfileLoaded(false);
        
        // 1. Fetch Profile First (required to get ID for subsequent filters)
        let { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        let profileToSet = data;

        if (error || !data) {
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert([{ id: session.user.id, hero_name: 'New Hero', real_name: session.user.email }])
            .select()
            .single();

          if (!insertError) {
            profileToSet = newProfile;
          }
        }

        if (profileToSet) {
          const formattedProfile = formatProfile(profileToSet);

          // 2. Prepare parallel queries
          const isTeacher = session.user.email === 'admin@bruxos.com';
          
          let subsQuery = supabase.from('submissions').select('*');
          if (!isTeacher) subsQuery = subsQuery.eq('student_id', session.user.id);

          let claimsQuery = supabase.from('prize_claims').select('*').order('requested_at', { ascending: false });
          if (!isTeacher) claimsQuery = claimsQuery.eq('student_id', session.user.id);

          let prizesQuery = supabase.from('pending_prizes').select('*').order('created_at', { ascending: false });
          if (!isTeacher) prizesQuery = prizesQuery.eq('student_id', session.user.id);

          // 2.5. 24-Hour Expiration Cleanup (Silently delete old grasps before loading)
          const twentyFourHoursAgo = new Date(Date.now() - 86400000).toISOString();
          await supabase
            .from('global_effects')
            .delete()
            .eq('type', 'void_grasp')
            .lt('created_at', twentyFourHoursAgo);

          // 3. Execute all secondary fetches IN PARALLEL (Speed boost & prevents race conditions)
          const [
            invResult,
            profilesResult,
            subsResult,
            effectsResult,
            settingsResult,
            hsResult,
            claimsResult,
            prizesResult
          ] = await Promise.all([
            supabase.from('inventory').select('*').eq('student_id', session.user.id),
            supabase.from('profiles').select('*'),
            subsQuery,
            supabase.from('global_effects').select('*'),
            supabase.from('game_settings').select('value').eq('key', 'current_raffle_prize').single(),
            supabase.from('high_scores').select('*'),
            claimsQuery,
            prizesQuery
          ]);

          // 4. Map results safely to state
          formattedProfile.inventory = invResult.data || [];

          if (profilesResult.data) {
            setStudents(profilesResult.data.map(p => formatProfile(p)));
          }

          if (subsResult.data) {
            const mappedSubs = subsResult.data.map(s => ({
              ...s,
              questId: s.quest_id,
              studentId: s.student_id,
              studentName: s.student_name,
              isBossStrike: s.is_boss_strike,
              type: s.type,
              status: s.status,
              proofContent: s.proof_content,
              timestamp: s.created_at ? new Date(s.created_at).toISOString().split('T')[0] : s.timestamp
            }));
            setSubmissions(mappedSubs);
          }

          if (effectsResult.data) setGlobalEffects(effectsResult.data);
          if (settingsResult.data) setCurrentRafflePrize(settingsResult.data.value);
          
          if (hsResult.data) {
            const hsMap = {};
            hsResult.data.forEach(hs => {
              hsMap[hs.quest_id] = { score: hs.score, player: hs.player_name };
            });
            setHighScores(hsMap);
          } else {
            setHighScores({});
          }

          if (claimsResult.data) setPrizeClaims(claimsResult.data);
          if (prizesResult.data) setPendingPrizesList(prizesResult.data);

          // --- TOTAL UNIQUE LOGIN DAYS LOGIC ---
          const todayStr = new Date().toISOString().split('T')[0];
          let streakUpdated = false;

          if (formattedProfile.lastLoginDate !== todayStr) {
            // Increment total login days by 1 on any new calendar day, never reset!
            formattedProfile.loginStreak = (formattedProfile.loginStreak || 0) + 1;
            formattedProfile.lastLoginDate = todayStr;
            streakUpdated = true;
          }

          setCurrentUser(formattedProfile);

          if (streakUpdated) {
            saveProfileToCloud(session.user.id, {
              loginStreak: formattedProfile.loginStreak,
              lastLoginDate: formattedProfile.lastLoginDate
            });
            setTimeout(() => checkAchievements(formattedProfile), 500);
          }
          
          setIsProfileLoaded(true);
        }
      } else {
        setCurrentUser(null);
        setIsProfileLoaded(false);
        setSubmissions([]);
        setGlobalEffects([]);
        setPrizeClaims([]);
        setPendingPrizesList([]);
      }
    };

    // SINGLE SOURCE OF TRUTH: Let onAuthStateChange handle the initial session fetch
    // as well as all subsequent auth state changes. Delete the redundant getSession()!
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleAuthChange(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setUserRole(null);
    setPrizeClaims([]);
  };

  // ── PRIZE CLAIMS ──────────────────────────────────────────────────────────
  const claimAchievementPrize = async (studentId, achievementId) => {
    // Optimistically add a pending claim to local state
    const optimisticClaim = {
      id: `optimistic-${achievementId}`,
      student_id: studentId,
      achievement_id: achievementId,
      status: 'pending',
      requested_at: new Date().toISOString(),
      fulfilled_at: null,
    };
    setPrizeClaims(prev => [...prev.filter(c => c.achievement_id !== achievementId), optimisticClaim]);

    const { data, error } = await supabase
      .from('prize_claims')
      .insert([{ student_id: studentId, achievement_id: achievementId, status: 'pending' }])
      .select()
      .single();

    if (error) {
      // If duplicate (already claimed), just refresh from DB
      if (error.code === '23505') {
        const { data: existing } = await supabase
          .from('prize_claims')
          .select('*')
          .eq('student_id', studentId)
          .eq('achievement_id', achievementId)
          .single();
        if (existing) {
          setPrizeClaims(prev => [...prev.filter(c => c.achievement_id !== achievementId), existing]);
        }
        return { success: false, message: 'You have already claimed this prize.' };
      }
      // Roll back optimistic update on other errors
      setPrizeClaims(prev => prev.filter(c => c.id !== optimisticClaim.id));
      console.error('Error claiming prize:', error);
      return { success: false, message: error.message };
    }

    // Replace optimistic row with real DB row
    setPrizeClaims(prev => [...prev.filter(c => c.id !== optimisticClaim.id), data]);
    return { success: true };
  };

  const fulfillAchievementClaim = async (claimId) => {
    const now = new Date().toISOString();
    // Optimistic update
    setPrizeClaims(prev => prev.map(c =>
      c.id === claimId ? { ...c, status: 'fulfilled', fulfilled_at: now } : c
    ));

    const { error } = await supabase
      .from('prize_claims')
      .update({ status: 'fulfilled', fulfilled_at: now })
      .eq('id', claimId);

    if (error) {
      console.error('Error fulfilling claim:', error);
      // Roll back
      setPrizeClaims(prev => prev.map(c =>
        c.id === claimId ? { ...c, status: 'pending', fulfilled_at: null } : c
      ));
      return { success: false };
    }
    return { success: true };
  };

  const fulfillPendingPrize = async (prizeId) => {
    const { error } = await supabase
      .from('pending_prizes')
      .update({ status: 'delivered' })
      .eq('id', prizeId);

    if (!error) {
      setPendingPrizesList(prev => prev.map(p =>
        p.id === prizeId ? { ...p, status: 'delivered' } : p
      ));
      return { success: true };
    }
    return { success: false, error };
  };
  // ─────────────────────────────────────────────────────────────────────────

  const uploadFileToStorage = async (file) => {
    if (!file) return null;
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${currentUser.id}/${fileName}`;
    const { error } = await supabase.storage.from('homework').upload(filePath, file);
    if (error) {
      console.error("Upload error:", error);
      return null;
    }
    const { data: { publicUrl } } = supabase.storage.from('homework').getPublicUrl(filePath);
    return publicUrl;
  };

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

        saveProfileToCloud(studentId, { xp: newXp, gold: newGold });

        return updatedStudent;
      }
      return student;
    }));
  };

  // =============================================================
  // checkAchievements — accepts a STUDENT OBJECT (not stale state)
  // Evaluates ALL logic against that object, then persists if new.
  // =============================================================
  const checkAchievements = (student) => {
    if (!student) return;
    const studentId = student.id;

    let updatedStudent = { ...student };
    let newlyUnlocked = false;
    let totalXp = 0;
    let totalGoldEarned = 0;
    let additionalGoldFromFallback = 0;
    let newNotifications = [...(updatedStudent.notifications || [])];
    let newPendingPrizes = [...(updatedStudent.pendingPrizes || [])];
    let newRaffleTickets = updatedStudent.raffleTickets || 0;
    let newTotalTickets = updatedStudent.totalTicketsEarned || 0;

    const totalQuests = (updatedStudent.uploadQuestsCompleted || 0) +
      (updatedStudent.quizQuestsCompleted || 0) +
      (updatedStudent.multiStepQuestsCompleted || 0) +
      (updatedStudent.sportsQuestsCompleted || 0) +
      (updatedStudent.artsQuestsCompleted || 0) +
      (updatedStudent.journalQuestsCompleted || 0) +
      (updatedStudent.scenarioQuestsCompleted || 0) +
      (updatedStudent.cipherQuestsCompleted || 0) +
      (updatedStudent.incantationQuestsCompleted || 0) +
      (updatedStudent.wellnessQuestsCompleted || 0);

    const currentLevel = Math.max(
      updatedStudent.level || 1,
      Math.floor((updatedStudent.xp || 0) / 1000) + 1
    );

    ACHIEVEMENTS.forEach(achievement => {
      // Skip if already unlocked
      if ((updatedStudent.unlockedAchievements || []).includes(achievement.id)) return;

      // Time Gate Check
      if (achievement.unlockDate && new Date() < new Date(achievement.unlockDate)) return;

      let reqMet = false;

      // Evaluate against the PASSED student object — never stale currentUser
      switch (achievement.metric) {
        case 'level':
          reqMet = currentLevel >= achievement.target;
          break;
        case 'streak':
          reqMet = (updatedStudent.loginStreak || 0) >= achievement.target;
          break;
        case 'quizzes':
          reqMet = (updatedStudent.quizQuestsCompleted || 0) >= achievement.target;
          break;
        case 'journals':
          reqMet = (updatedStudent.journalQuestsCompleted || 0) >= achievement.target;
          break;
        case 'sports':
          reqMet = (updatedStudent.sportsQuestsCompleted || 0) >= achievement.target;
          break;
        case 'arts':
          reqMet = (updatedStudent.artsQuestsCompleted || 0) >= achievement.target;
          break;
        case 'total_quests':
          reqMet = totalQuests >= achievement.target;
          break;
        case 'bosses':
          reqMet = (updatedStudent.defeatedBosses?.length || 0) >= achievement.target;
          break;
        case 'outfits':
          reqMet = (updatedStudent.inventory?.filter(i => i.type === 'outfit').length || 0) >= achievement.target;
          break;
        case 'scenarios':
          reqMet = (updatedStudent.scenarioQuestsCompleted || 0) >= achievement.target;
          break;
        case 'ciphers':
          reqMet = (updatedStudent.cipherQuestsCompleted || 0) >= achievement.target;
          break;
        case 'incantations':
          reqMet = (updatedStudent.incantationQuestsCompleted || 0) >= achievement.target;
          break;
        case 'wellness':
          reqMet = (updatedStudent.wellnessQuestsCompleted || 0) >= achievement.target;
          break;
        case 'tickets':
          reqMet = (updatedStudent.totalTicketsEarned || 0) >= achievement.target;
          break;
        case 'uploads':
          reqMet = (updatedStudent.uploadQuestsCompleted || 0) >= achievement.target;
          break;
        default:
          reqMet = false;
      }

      if (reqMet) {
        newlyUnlocked = true;
        updatedStudent.unlockedAchievements = [...(updatedStudent.unlockedAchievements || []), achievement.id];
        totalXp += achievement.rewardXp;
        totalGoldEarned += (achievement.rewardGold || 0);
        newRaffleTickets += achievement.rewardTicket;
        newTotalTickets += achievement.rewardTicket;

        if (achievement.realWorldPrize) {
          if (achievement.limit) {
            // Use students from closure (fresh enough for speed-race checks)
            const claimCount = students.filter(s => (s.unlockedAchievements || []).includes(achievement.id)).length;
            if (claimCount < achievement.limit) {
              newPendingPrizes.push({ name: achievement.realWorldPrize, achievement: achievement.title, status: 'pending' });
              newNotifications.push({ id: Date.now() + Math.random(), title: `Achievement Unlocked: ${achievement.title}` });
            } else {
              additionalGoldFromFallback += (achievement.fallbackGold || 0);
              newNotifications.push({ id: Date.now() + Math.random(), title: `Achievement Unlocked: ${achievement.title}! The physical prizes were claimed, but you received ${achievement.fallbackGold || 0} Gold!` });
            }
          } else {
            newPendingPrizes.push({ name: achievement.realWorldPrize, achievement: achievement.title, status: 'pending' });
            newNotifications.push({ id: Date.now() + Math.random(), title: `Achievement Unlocked: ${achievement.title}` });
          }
        } else {
          newNotifications.push({ id: Date.now() + Math.random(), title: `Achievement Unlocked: ${achievement.title}` });
        }
      }
    });

    if (newlyUnlocked) {
      updatedStudent.pendingPrizes = newPendingPrizes;
      updatedStudent.notifications = newNotifications;
      updatedStudent.raffleTickets = newRaffleTickets;
      updatedStudent.totalTicketsEarned = newTotalTickets;
      updatedStudent.gold = (updatedStudent.gold || 0) + additionalGoldFromFallback + totalGoldEarned;

      const oldXpLevel = Math.floor((updatedStudent.xp || 0) / 1000) + 1;
      updatedStudent.xp = (updatedStudent.xp || 0) + totalXp;
      const newXpLevel = Math.floor(updatedStudent.xp / 1000) + 1;

      if (newXpLevel > oldXpLevel) {
        updatedStudent.gold += 500;
        updatedStudent.level = newXpLevel;
        updatedStudent.notifications.push({
          id: Date.now() + Math.random(),
          title: `LEVEL UP! You reached Level ${newXpLevel}`,
          xp: 0,
          gold: 500,
          quote: 'The King rewards your legendary growth!'
        });
      }

      // Update students array and — only if this IS the current user — currentUser
      setStudents(prev => prev.map(s => s.id === studentId ? updatedStudent : s));
      
      // Safely update the current user using the fresh ref
      if (currentUserRef.current && currentUserRef.current.id === studentId) {
        setCurrentUser(updatedStudent);
      }

      // Persist achievement data + corrected xp/gold to cloud
      saveProfileToCloud(studentId, {
        unlockedAchievements: updatedStudent.unlockedAchievements,
        xp: updatedStudent.xp,
        gold: updatedStudent.gold,
        raffleTickets: newRaffleTickets,
        totalTicketsEarned: newTotalTickets,
      });
    }
  };

  // =============================================================
  // syncUserUpdate — SINGLE SOURCE OF TRUTH for all player progress
  // 1. Snapshot true new state  2. Update UI immediately
  // 3. Persist to cloud         4. Fire achievements with fresh state
  // =============================================================
  const syncUserUpdate = async (updates) => {
    if (!currentUser) return;

    // 1. Merge updates with the current snapshot to get the TRUE new state
    const updatedUser = { ...currentUser, ...updates };

    // Detect and handle level-up whenever XP changes
    if (updates.xp !== undefined) {
      const oldLevel = Math.floor((currentUser.xp || 0) / 1000) + 1;
      const newLevel = Math.floor(updatedUser.xp / 1000) + 1;
      if (newLevel > oldLevel) {
        updatedUser.gold = (updatedUser.gold || 0) + 500;
        updatedUser.level = newLevel;
        updatedUser.notifications = [
          ...(updatedUser.notifications || []),
          {
            id: Date.now() + Math.random(),
            title: `LEVEL UP! You reached Level ${newLevel}`,
            xp: 0,
            gold: 500,
            quote: 'The King rewards your legendary growth!',
          },
        ];
      }
    }

    // 2. Update React state immediately for snappy UI
    setCurrentUser(updatedUser);
    setStudents(prev => prev.map(s => s.id === currentUser.id ? updatedUser : s));

    // 3. Persist to Supabase — include gold in case a level-up bonus was added
    const cloudUpdates = { ...updates };
    if (updates.xp !== undefined && updatedUser.gold !== (currentUser.gold || 0) + (updates.gold || 0)) {
      cloudUpdates.gold = updatedUser.gold; // captures level-up 500g bonus
    }
    await saveProfileToCloud(currentUser.id, cloudUpdates);

    // 4. Run achievement check against the TRUE new state, not stale currentUser
    checkAchievements(updatedUser);
  };

  const updateHeroIdentity = (newName, newClass) => {
    syncUserUpdate({ heroName: newName, heroClass: newClass });
  };

  const buyTomeOfRebirth = async () => {
    if (!currentUser) return { success: false };
    if (currentUser.gold < 1000) return { success: false, message: "Not enough gold!" };

    // Deduct 1000 gold and reset class to 'None'
    syncUserUpdate({
      gold: currentUser.gold - 1000,
      heroClass: 'None'
    });
    return { success: true };
  };

  const applyClassBonus = (questType, rewardAmount, heroClass) => {
    if (!heroClass || heroClass === 'None') return rewardAmount;
    let multiplier = 1;
    if (heroClass === 'Warrior' && ['upload', 'scout-sports'].includes(questType)) multiplier = 1.1;
    if (heroClass === 'Mage' && ['quiz', 'multi-step', 'cipher', 'incantation', 'blitz'].includes(questType)) multiplier = 1.1;
    if (heroClass === 'Rogue' && ['scenario', 'scout-arts', 'journal', 'wellness'].includes(questType)) multiplier = 1.15;
    return Math.floor(rewardAmount * multiplier);
  };

  const equipPet = (petName) => {
    syncUserUpdate({ equippedPet: petName });
  };

  const unequipPet = () => {
    syncUserUpdate({ equippedPet: null });
  };

  const applyPetBonus = (questType, baseAmount, isGold, petName) => {
    if (!petName) return Math.floor(baseAmount);
    if (petName === 'Mystic Owlet' && !isGold && ['quiz', 'multi-step', 'cipher', 'incantation', 'blitz'].includes(questType)) return Math.floor(baseAmount * 1.15);
    if (petName === 'Fire Whelp' && isGold && ['upload', 'scout-sports', 'scout-arts', 'journal'].includes(questType)) return Math.floor(baseAmount * 1.15);
    if (petName === 'Astral Fox') return Math.floor(baseAmount * 1.05);
    return Math.floor(baseAmount);
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

  const submitQuest = async (questId, content, type) => {
    const isImageQuest = ['upload', 'scout-arts', 'scout-sports'].includes(type);
    let localPreview = null;

    // 1. Create a local preview instantly if it's a file
    if (isImageQuest && content instanceof File) {
      localPreview = URL.createObjectURL(content);
    }

    // 2. Create the Optimistic Submission Object
    const newSubmission = {
      id: Date.now(), // Temporary local ID
      questId,
      studentId: currentUser.id,
      studentName: currentUser.heroName,
      status: 'pending',
      timestamp: new Date().toLocaleDateString('en-CA'),
      type,
      proofContent: localPreview || (type === 'journal' ? content : null)
    };

    // 3. Update UI IMMEDIATELY
    setSubmissions(prev => [...prev, newSubmission]);

    // 4. Perform the heavy Cloud Upload in the background
    let finalContent = type === 'journal' ? content : null;
    
    if (isImageQuest && content instanceof File) {
      const cloudUrl = await uploadFileToStorage(content);
      if (!cloudUrl) {
        // Revert the optimistic update on failure
        setSubmissions(prev => prev.filter(s => s.id !== newSubmission.id));
        alert("Cloud upload failed! Please check Supabase Storage policies.");
        return;
      }
      finalContent = cloudUrl;
    }

    // 5. Save the real cloud URL to the database
    const dbSub = {
      quest_id: questId,
      student_id: currentUser.id,
      student_name: currentUser.heroName,
      status: 'pending',
      type: type,
      proof_content: finalContent
    };
    
    const { data: savedData, error } = await supabase.from('submissions').insert([dbSub]).select();
    
    if (!error && savedData) {
       // Swap the temporary local submission with the authoritative database record
       setSubmissions(prev => prev.map(s => s.id === newSubmission.id ? {
           ...savedData[0],
           questId: savedData[0].quest_id,
           studentId: savedData[0].student_id,
           studentName: savedData[0].student_name,
           proofContent: savedData[0].proof_content,
           timestamp: new Date(savedData[0].created_at).toLocaleDateString('en-CA')
       } : s));
    } else if (error) {
       console.error("Error saving submission:", error);
    }
  };

  const submitBossStrike = async (bossId, content) => {
    let localPreview = null;
    let submissionType = 'journal';

    if (content instanceof File) {
      submissionType = 'upload';
      localPreview = URL.createObjectURL(content);
    } else if (typeof content === 'string') {
      submissionType = 'journal';
    }

    const newSubmission = {
      id: Date.now(),
      questId: bossId,
      studentId: currentUser.id,
      studentName: currentUser.heroName,
      status: 'pending',
      isBossStrike: true,
      timestamp: new Date().toLocaleDateString('en-CA'),
      type: submissionType,
      proofContent: localPreview || (submissionType === 'journal' ? content : null)
    };

    setSubmissions(prev => [...prev, newSubmission]);

    let finalContent = submissionType === 'journal' ? content : null;

    if (submissionType === 'upload') {
      const cloudUrl = await uploadFileToStorage(content);
      if (!cloudUrl) {
        setSubmissions(prev => prev.filter(s => s.id !== newSubmission.id));
        alert("Cloud upload failed! Please check Supabase Storage policies.");
        return;
      }
      finalContent = cloudUrl;
    }

    const dbSub = {
      quest_id: bossId,
      student_id: currentUser.id,
      student_name: currentUser.heroName,
      status: 'pending',
      type: submissionType,
      is_boss_strike: true,
      proof_content: finalContent
    };

    const { data: savedData, error } = await supabase.from('submissions').insert([dbSub]).select();

    if (!error && savedData) {
       setSubmissions(prev => prev.map(s => s.id === newSubmission.id ? {
           ...savedData[0],
           questId: savedData[0].quest_id,
           studentId: savedData[0].student_id,
           studentName: savedData[0].student_name,
           isBossStrike: savedData[0].is_boss_strike,
           proofContent: savedData[0].proof_content,
           timestamp: new Date(savedData[0].created_at).toLocaleDateString('en-CA')
       } : s));
    } else if (error) {
       console.error("Error saving boss strike submission:", error);
    }
  };

  const submitWellnessCheck = (questId, feeling) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return { success: false, message: 'Quest not found' };

    let xpEarned = applyClassBonus(quest.type, quest.xp, currentUser.heroClass);
    xpEarned = applyPetBonus(quest.type, xpEarned, false, currentUser.equippedPet);

    let goldEarned = applyClassBonus(quest.type, quest.gold, currentUser.heroClass);
    goldEarned = applyPetBonus(quest.type, goldEarned, true, currentUser.equippedPet);

    // Route through syncUserUpdate: single call covers state + cloud + achievements
    syncUserUpdate({
      xp: (currentUser.xp || 0) + xpEarned,
      gold: (currentUser.gold || 0) + goldEarned,
      wellnessQuestsCompleted: (currentUser.wellnessQuestsCompleted || 0) + 1,
    });

    const newSubmission = {
      id: Date.now(),
      questId,
      studentId: currentUser.id,
      studentName: currentUser.heroName,
      feeling: feeling,
      type: 'wellness',
      status: 'read_only',
      timestamp: new Date().toISOString().split('T')[0],
    };
    setSubmissions(prev => [...prev, newSubmission]);
    saveSubmissionToCloud(newSubmission);

    return { success: true };
  };

  const approveSubmission = async (submissionId) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) return;

    if (submission.isBossStrike) {
      fightBoss(submission.questId, submission.studentId);
      setSubmissions(prev => prev.map(s =>
        s.id === submissionId ? { ...s, status: 'approved' } : s
      ));
      await updateSubmissionStatusInCloud(submission, 'approved');
      return;
    }

    const quest = quests.find(q => q.id === submission.questId);
    if (!quest) return;

    const targetStudent = students.find(s => s.id === submission.studentId);
    if (!targetStudent) return;

    // Build the TRUE updated state for the target student in one pass
    const updatedStudent = { ...targetStudent };
    if (quest.type === 'upload') updatedStudent.uploadQuestsCompleted = (targetStudent.uploadQuestsCompleted || 0) + 1;
    else if (quest.type === 'scout-sports') updatedStudent.sportsQuestsCompleted = (targetStudent.sportsQuestsCompleted || 0) + 1;
    else if (quest.type === 'scout-arts') updatedStudent.artsQuestsCompleted = (targetStudent.artsQuestsCompleted || 0) + 1;
    else if (quest.type === 'journal') updatedStudent.journalQuestsCompleted = (targetStudent.journalQuestsCompleted || 0) + 1;

    let xpEarned = applyClassBonus(quest.type, quest.xp, targetStudent.heroClass);
    xpEarned = applyPetBonus(quest.type, xpEarned, false, targetStudent.equippedPet);

    let goldEarned = applyClassBonus(quest.type, quest.gold, targetStudent.heroClass);
    goldEarned = applyPetBonus(quest.type, goldEarned, true, targetStudent.equippedPet);

    // Generate approval notification
    const randomQuote = VICTORY_QUOTES[Math.floor(Math.random() * VICTORY_QUOTES.length)];
    const newNotification = {
      id: Date.now() + Math.random(),
      title: `${quest.title} Approved!`,
      xp: xpEarned,
      gold: goldEarned,
      quote: randomQuote
    };
    updatedStudent.notifications = [
      ...(targetStudent.notifications || []),
      newNotification
    ];

    // Award XP + gold and handle level-up within the same object
    const oldLevel = Math.floor((targetStudent.xp || 0) / 1000) + 1;
    updatedStudent.xp = (targetStudent.xp || 0) + xpEarned;
    updatedStudent.gold = (targetStudent.gold || 0) + goldEarned;
    const newLevel = Math.floor(updatedStudent.xp / 1000) + 1;
    if (newLevel > oldLevel) {
      updatedStudent.gold += 500;
      updatedStudent.level = newLevel;
      updatedStudent.notifications = [
        ...(updatedStudent.notifications || []),
        { id: Date.now() + Math.random(), title: `LEVEL UP! You reached Level ${newLevel}`, xp: 0, gold: 500, quote: 'The King rewards your legendary growth!' }
      ];
    }

    // Commit to both lists; update currentUser only when target IS the logged-in user
    setStudents(prev => prev.map(s => s.id === submission.studentId ? updatedStudent : s));
    if (currentUser && currentUser.id === submission.studentId) {
      setCurrentUser(updatedStudent);
    }

    // Persist all changed fields to Supabase
    const cloudUpdates = {
      xp: updatedStudent.xp,
      gold: updatedStudent.gold,
      notifications: updatedStudent.notifications
    };
    if (quest.type === 'upload') cloudUpdates.uploadQuestsCompleted = updatedStudent.uploadQuestsCompleted;
    if (quest.type === 'scout-sports') cloudUpdates.sportsQuestsCompleted = updatedStudent.sportsQuestsCompleted;
    if (quest.type === 'scout-arts') cloudUpdates.artsQuestsCompleted = updatedStudent.artsQuestsCompleted;
    if (quest.type === 'journal') cloudUpdates.journalQuestsCompleted = updatedStudent.journalQuestsCompleted;
    saveProfileToCloud(submission.studentId, cloudUpdates);

    // Check achievements against the TRUE updated state — no stale reads
    checkAchievements(updatedStudent);

    setSubmissions(prev => prev.map(s =>
      s.id === submissionId ? { ...s, status: 'approved' } : s
    ));
    await updateSubmissionStatusInCloud(submission, 'approved');
  };

  const rejectSubmission = async (submissionId, reason) => {
    const submission = submissions.find(s => s.id === submissionId);
    if (!submission) return { success: false, message: 'Submission not found' };

    const targetStudent = students.find(s => s.id === submission.studentId);
    if (!targetStudent) return { success: false, message: 'Student not found' };

    const { error: statusError } = await updateSubmissionStatusInCloud(submission, 'rejected');
    if (statusError) return { success: false, error: statusError };

    const rejectionReason = reason ? String(reason).trim() : 'Work did not meet requirements';
    const updatedStudent = {
      ...targetStudent,
      notifications: [
        ...(targetStudent.notifications || []),
        {
          id: Date.now(),
          title: 'Quest Rejected',
          xp: 0,
          gold: 0,
          quote: 'Reason: ' + rejectionReason
        }
      ]
    };

    setSubmissions(prev => prev.map(s =>
      s.id === submissionId ? { ...s, status: 'rejected' } : s
    ));
    setStudents(prev => prev.map(s => s.id === targetStudent.id ? updatedStudent : s));
    if (currentUser && currentUser.id === targetStudent.id) {
      setCurrentUser(updatedStudent);
    }
    saveProfileToCloud(targetStudent.id, { notifications: updatedStudent.notifications });

    return { success: true };
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

    let currentBuffs = { ...(currentUser.activeBuffs || {}) };

    if (isCorrect) {
      if (!isFinalStep) {
        return { success: true, message: "Step Complete!" };
      }

      let finalXp = quest.xp;
      let finalGold = quest.gold;

      if (currentBuffs.oath) {
        finalXp *= 4;
        finalGold *= 4;
        delete currentBuffs.oath;
      }
      if (currentBuffs.ember && Date.now() < currentBuffs.ember) {
        finalXp *= 2;
      }

      let xpEarned = applyClassBonus(quest.type, finalXp, currentUser.heroClass);
      xpEarned = applyPetBonus(quest.type, xpEarned, false, currentUser.equippedPet);

      let goldEarned = applyClassBonus(quest.type, finalGold, currentUser.heroClass);
      goldEarned = applyPetBonus(quest.type, goldEarned, true, currentUser.equippedPet);

      const updates = {
        xp: (currentUser.xp || 0) + xpEarned,
        gold: (currentUser.gold || 0) + goldEarned,
        activeBuffs: currentBuffs,
      };
      if (quest.type === 'quiz') updates.quizQuestsCompleted = (currentUser.quizQuestsCompleted || 0) + 1;
      if (quest.type === 'multi-step') updates.multiStepQuestsCompleted = (currentUser.multiStepQuestsCompleted || 0) + 1;
      if (quest.type === 'incantation') updates.incantationQuestsCompleted = (currentUser.incantationQuestsCompleted || 0) + 1;
      if (quest.type === 'cipher') updates.cipherQuestsCompleted = (currentUser.cipherQuestsCompleted || 0) + 1;
      if (quest.type === 'gauntlet') updates.gauntletQuestsCompleted = (currentUser.gauntletQuestsCompleted || 0) + 1;

      // One call handles: state update + cloud save + achievement check
      syncUserUpdate(updates);

      const newSubmission = {
        id: Date.now(),
        questId,
        studentId: currentUser.id,
        studentName: currentUser.heroName,
        status: 'approved',
        timestamp: new Date().toISOString().split('T')[0],
        type: quest.type || 'quiz',
      };
      setSubmissions(prev => [...prev, newSubmission]);
      saveSubmissionToCloud(newSubmission);

      return { success: true, message: `+${xpEarned} XP, +${goldEarned} Gold` };
    } else {
      if (currentBuffs.oath) {
        const updatedBuffs = { ...currentBuffs };
        delete updatedBuffs.oath;
        syncUserUpdate({ activeBuffs: updatedBuffs });
        return { success: false, message: "The Abyss claims you! Your Oath is broken and the answer is incorrect." };
      }
      return { success: false, message: "Incorrect answer. Try again!" };
    }
  };

  const attemptIncantation = async (questId, score) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return { success: false, message: 'Quest not found' };
    if (score === 0) return { success: false, message: 'No runes transcribed. Try again!' };

    const cappedScore = Math.min(score, 5);

    // Base: 15 XP / 5 Gold. Each correct typing adds +3 XP / +1 Gold. Max: 27 XP, 9 Gold
    let baseXp = quest.xp + (cappedScore - 1) * 3;
    let baseGold = quest.gold + (cappedScore - 1) * 1;

    let xpEarned = applyClassBonus(quest.type, baseXp, currentUser.heroClass);
    xpEarned = applyPetBonus(quest.type, xpEarned, false, currentUser.equippedPet);

    let goldEarned = applyClassBonus(quest.type, baseGold, currentUser.heroClass);
    goldEarned = applyPetBonus(quest.type, goldEarned, true, currentUser.equippedPet);

    const updates = {
      xp: (currentUser.xp || 0) + xpEarned,
      gold: (currentUser.gold || 0) + goldEarned,
      incantationQuestsCompleted: (currentUser.incantationQuestsCompleted || 0) + 1,
    };

    syncUserUpdate(updates);

    const newSubmission = {
      id: Date.now(), questId, studentId: currentUser.id, studentName: currentUser.heroName,
      status: 'approved', timestamp: new Date().toISOString().split('T')[0], type: 'incantation'
    };
    setSubmissions(prev => [...prev, newSubmission]);
    saveSubmissionToCloud(newSubmission);

    return { success: true, message: `Superb scribe! You transcribed ${score} spells! +${xpEarned} XP, +${goldEarned} Gold` };
  };

  const recordGauntletFailure = (questId) => {
    if (!currentUser) return;
    const newSubmission = {
      id: Date.now(),
      questId,
      studentId: currentUser.id,
      studentName: currentUser.heroName,
      status: 'failed',
      timestamp: new Date().toISOString().split('T')[0],
      type: 'gauntlet',
    };
    setSubmissions(prev => [...prev, newSubmission]);
    saveSubmissionToCloud(newSubmission);
  };

  const attemptScenario = (questId, isCorrect) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return { success: false, message: "Quest not found!" };

    if (isCorrect) {
      let xpEarned = applyClassBonus(quest.type, quest.xp, currentUser.heroClass);
      xpEarned = applyPetBonus(quest.type, xpEarned, false, currentUser.equippedPet);

      let goldEarned = applyClassBonus(quest.type, quest.gold, currentUser.heroClass);
      goldEarned = applyPetBonus(quest.type, goldEarned, true, currentUser.equippedPet);

      syncUserUpdate({
        xp: (currentUser.xp || 0) + xpEarned,
        gold: (currentUser.gold || 0) + goldEarned,
        scenarioQuestsCompleted: (currentUser.scenarioQuestsCompleted || 0) + 1,
      });

      const newSubmission = {
        id: Date.now(),
        questId,
        studentId: currentUser.id,
        studentName: currentUser.heroName,
        status: 'approved',
        timestamp: new Date().toISOString().split('T')[0],
        type: 'scenario',
      };
      setSubmissions(prev => [...prev, newSubmission]);
      saveSubmissionToCloud(newSubmission);

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

    const userSubmissions = (submissions || [])
      .filter(s => s.questId === questId && s.studentId === currentUser?.id)
      .sort((a, b) => {
        const dateA = new Date(a.created_at || a.timestamp).getTime();
        const dateB = new Date(b.created_at || b.timestamp).getTime();
        return dateB - dateA;
      });

    if (userSubmissions.length === 0) {
      return 'available';
    }

    const mostRecentSubmission = userSubmissions[0];

    if (quest.frequency === 'daily' || quest.frequency === 'weekly') {
      // Get today's date strictly as YYYY-MM-DD
      const todayString = new Date().toISOString().split('T')[0];

      // Extract the submission date strictly as YYYY-MM-DD
      let submissionDateString = '';
      if (mostRecentSubmission.created_at) {
        submissionDateString = new Date(mostRecentSubmission.created_at).toISOString().split('T')[0];
      } else {
        submissionDateString = mostRecentSubmission.timestamp;
      }

      // Compare the strings directly
      if (submissionDateString === todayString) {
        return mostRecentSubmission.status;
      } else {
        return 'available';
      }
    }

    return mostRecentSubmission.status;
  };

  const buyItem = async (item) => {
    if (!currentUser) return { success: false, message: "Not logged in!" };

    if (currentUser.gold >= item.cost) {
      const newGold = currentUser.gold - item.cost;
      const itemToSave = { ...item };

      if (item.type === 'consumable') {
        const isOath = item.buffType === 'oath';
        const limitKey = isOath ? 'spellOathCount' : 'spellEmberCount';
        const currentCasts = currentUser[limitKey] || 0;
        
        if (currentCasts >= 10) {
          return { success: false, message: `Spell failed! You have reached your limit of 10 ${item.name}s!` };
        }

        const newBuffs = { ...(currentUser.activeBuffs || {}) };
        const newCasts = currentCasts + 1;

        if (item.buffType === 'ember') {
          newBuffs.ember = Date.now() + 86400000;
        } else if (item.buffType === 'oath') {
          newBuffs.oath = true;
        }

        syncUserUpdate({ 
          gold: newGold, 
          activeBuffs: newBuffs, 
          [limitKey]: newCasts 
        });
        
        return { success: true, message: `${item.name} acquired! (${10 - newCasts} charges remaining).` };
      }

      const updatedStudents = students.map(student => {
        if (student.id === currentUser.id) {
          return {
            ...student,
            gold: newGold,
            inventory: [...(student.inventory || []), itemToSave]
          };
        }
        return student;
      });
      setStudents(updatedStudents);

      const updatedCurrentUser = {
        ...currentUser,
        gold: newGold,
        inventory: [...(currentUser.inventory || []), itemToSave]
      };
      setCurrentUser(updatedCurrentUser);

      saveProfileToCloud(currentUser.id, { gold: newGold });

      await supabase.from('inventory').insert([{
        student_id: currentUser.id,
        item_id: item.id,
        name: item.name,
        type: item.type,
        image_link: item.imageLink
      }]);

      checkAchievements(updatedCurrentUser);

      return { success: true };
    } else {
      return { success: false, message: "Not enough gold!" };
    }
  };

  const equipOutfit = (outfitLink) => {
    if (!currentUser) return;
    syncUserUpdate({ currentBodySprite: outfitLink });
  };

  const unequipOutfit = () => {
    if (!currentUser) return;
    syncUserUpdate({ currentBodySprite: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/new.base.body2.png' });
  };

  const fightBoss = (bossId, overrideStudentId = null) => {
    const targetId = overrideStudentId || currentUser?.id;
    if (!targetId) return { success: false, message: "Not logged in!" };

    const boss = BOSSES.find(b => b.id === bossId);
    if (!boss) return { success: false, message: "Boss not found!" };

    const targetStudent = students.find(s => s.id === targetId);
    if (!targetStudent) return { success: false, message: "Student not found!" };

    if (targetStudent.defeatedBosses.includes(bossId)) {
      return { success: false, message: "You have already defeated this boss." };
    }

    let requirementMet = false;
    switch (boss.requirement) {
      case 'uploads': requirementMet = (targetStudent.uploadQuestsCompleted || 0) >= boss.target; break;
      case 'quizzes': requirementMet = (targetStudent.quizQuestsCompleted || 0) >= boss.target; break;
      case 'multistep': requirementMet = (targetStudent.multiStepQuestsCompleted || 0) >= boss.target; break;
      case 'scenarios': requirementMet = (targetStudent.scenarioQuestsCompleted || 0) >= boss.target; break;
      case 'incantations': requirementMet = (targetStudent.incantationQuestsCompleted || 0) >= boss.target; break;
      case 'sports': requirementMet = (targetStudent.sportsQuestsCompleted || 0) >= boss.target; break;
      case 'arts': requirementMet = (targetStudent.artsQuestsCompleted || 0) >= boss.target; break;
      case 'wellness': requirementMet = (targetStudent.wellnessQuestsCompleted || 0) >= boss.target; break;
      case 'streak': requirementMet = (targetStudent.loginStreak || 0) >= boss.target; break;
      case 'journal': requirementMet = (targetStudent.journalQuestsCompleted || 0) >= boss.target; break;
      case 'ciphers': requirementMet = (targetStudent.cipherQuestsCompleted || 0) >= boss.target; break;
      case 'gauntlet': requirementMet = (targetStudent.gauntletQuestsCompleted || 0) >= boss.target; break;
      default: requirementMet = false;
    }

    if (overrideStudentId) requirementMet = true;

    if (requirementMet) {
      const bossLoot = BOSS_LOOT_OUTFITS[bossId];

      if (!overrideStudentId && currentUser) {
        // ── Player-initiated path: route through syncUserUpdate ──────────────
        const newDefeatedBosses = [...(currentUser.defeatedBosses || []), bossId];
        const updates = {
          xp: (currentUser.xp || 0) + boss.rewardXp,
          gold: (currentUser.gold || 0) + boss.rewardGold,
          defeatedBosses: newDefeatedBosses,
        };
        if (bossLoot && !(currentUser.inventory || []).some(item => item.id === bossLoot.id)) {
          updates.inventory = [...(currentUser.inventory || []), bossLoot];
          updates.notifications = [
            ...(currentUser.notifications || []),
            { id: Date.now() + Math.random(), title: "EPIC LOOT ACQUIRED: " + bossLoot.name, quote: 'A powerful artifact from a vanquished foe!', gold: 0, xp: 0 }
          ];
        }
        syncUserUpdate(updates);

      } else {
        // ── Teacher/admin approval path: update target student directly ──────
        const updatedTarget = {
          ...targetStudent,
          xp: (targetStudent.xp || 0) + boss.rewardXp,
          gold: (targetStudent.gold || 0) + boss.rewardGold,
          defeatedBosses: [...(targetStudent.defeatedBosses || []), bossId],
        };

        // Handle level-up for the target student
        const oldLevel = Math.floor((targetStudent.xp || 0) / 1000) + 1;
        const newLevel = Math.floor(updatedTarget.xp / 1000) + 1;
        if (newLevel > oldLevel) {
          updatedTarget.gold += 500;
          updatedTarget.level = newLevel;
          updatedTarget.notifications = [
            ...(updatedTarget.notifications || []),
            { id: Date.now() + Math.random(), title: `LEVEL UP! You reached Level ${newLevel}`, xp: 0, gold: 500, quote: 'The King rewards your legendary growth!' }
          ];
        }

        if (bossLoot && !(updatedTarget.inventory || []).some(item => item.id === bossLoot.id)) {
          updatedTarget.inventory = [...(updatedTarget.inventory || []), bossLoot];
          updatedTarget.notifications = [...(updatedTarget.notifications || []), {
            id: Date.now() + Math.random(),
            title: "EPIC LOOT ACQUIRED: " + bossLoot.name,
            quote: 'A powerful artifact from a vanquished foe!', gold: 0, xp: 0
          }];
        }

        setStudents(prev => prev.map(s => s.id === targetId ? updatedTarget : s));
        if (currentUser && currentUser.id === targetId) setCurrentUser(updatedTarget);

        saveProfileToCloud(targetId, {
          xp: updatedTarget.xp,
          gold: updatedTarget.gold,
          defeatedBosses: updatedTarget.defeatedBosses,
        });

        // Check achievements with the TRUE updated state
        checkAchievements(updatedTarget);
      }

      return { success: true, rewardGold: boss.rewardGold, rewardXp: boss.rewardXp };
    } else {
      return { success: false, message: "You are not strong enough yet!" };
    }
  };

  const calculateScholarScore = (student) => {
    const currentAttribute = student.finalGPA !== null ? student.finalGPA : student.midtermGPA;
    const level = Math.floor((student.xp || 0) / 1000) + 1;
    // Awards a flat +5 points per level as a strategic bonus
    return currentAttribute + (level * 5);
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

  const updateStudentStats = async (studentId, type, rawValue) => {
    const scaledValue = rawValue * 10;
    const fieldToUpdate = type === 'midterm' ? 'midtermGPA' : 'finalGPA';
    
    // 1. Update the local students array
    setStudents(prev => prev.map(student => {
      if (student.id === studentId) {
        return { ...student, [fieldToUpdate]: scaledValue };
      }
      return student;
    }));

    // 2. Persist to cloud
    await saveProfileToCloud(studentId, { [fieldToUpdate]: scaledValue });
  };

  const fulfillPrize = (studentId, prizeIndex) => {
    setStudents(prevStudents => prevStudents.map(student => {
      if (student.id === studentId) {
        const updatedPending = (student.pendingPrizes || []).filter((_, idx) => idx !== prizeIndex);

        const updatedStudent = { ...student, pendingPrizes: updatedPending };
        if (currentUser && currentUser.id === studentId) {
          setCurrentUser(prevUser => ({ ...prevUser, pendingPrizes: updatedPending }));
        }
        return updatedStudent;
      }
      return student;
    }));
  };

  const runMonthlyRaffle = async (prizeName) => {
    let pool = [];
    students.forEach(student => {
      const tickets = student.raffleTickets || 0;
      for (let i = 0; i < tickets; i++) {
        pool.push(student.id);
      }
    });

    if (pool.length === 0) return { success: false, message: 'No tickets in the pool.' };

    const winnerId = pool[Math.floor(Math.random() * pool.length)];
    const winner = students.find(s => s.id === winnerId);

    // 1. Add to pending_prizes in Supabase
    const { error: prizeError } = await supabase.from('pending_prizes').insert([{
      student_id: winnerId,
      student_name: winner.heroName || winner.name,
      prize: prizeName,
      reason: 'Grand Monthly Raffle',
      status: 'pending'
    }]);

    // 2. Save winner notification to cloud (mentions the specific prize)
    const newNotification = {
      id: Date.now(),
      title: "🎉 GRAND RAFFLE WINNER! 🎉",
      quote: `Your tickets were drawn! You won: ${prizeName}. Check your Trophy Room to track your prize!`,
      xp: 0,
      gold: 0
    };
    await saveProfileToCloud(winnerId, {
      notifications: [...(winner.notifications || []), newNotification]
    });

    // 3. Reset all raffle tickets in the database
    const { error: resetError } = await supabase
      .from('profiles')
      .update({ raffle_tickets: 0 })
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (!prizeError && !resetError) {
      // 4. Reflect ticket reset and winner notification in local state
      setStudents(prev => prev.map(student => {
        let updated = { ...student, raffleTickets: 0 };
        if (student.id === winnerId) {
          updated.notifications = [...(student.notifications || []), newNotification];
        }
        return updated;
      }));
      if (currentUser) {
        setCurrentUser(prev => ({ ...prev, raffleTickets: 0 }));
      }
      // 5. Refresh pending prizes list so new winner entry displays instantly
      const { data: newPrizes } = await supabase.from('pending_prizes').select('*');
      if (newPrizes) setPendingPrizesList(newPrizes);
      return { success: true, winnerName: winner.heroName || winner.name };
    }

    return { success: false, message: 'Raffle failed. Check Supabase errors.' };
  };

  const updateRafflePrize = async (newPrize) => {
    const { error } = await supabase
      .from('game_settings')
      .upsert([{ key: 'current_raffle_prize', value: newPrize }]);
    if (!error) {
      setCurrentRafflePrize(newPrize);
      return { success: true };
    }
    console.error("Error saving raffle prize:", error);
    return { success: false };
  };

  const clearNotifications = () => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, notifications: [] };
    setCurrentUser(updatedUser);
    setStudents(prev => prev.map(s => s.id === currentUser.id ? updatedUser : s));
    saveProfileToCloud(currentUser.id, { notifications: [] });
  };

  const applyVoidGrasp = async (targetStudentId) => {
    if (!currentUser) return { success: false, message: "Not logged in!" };
    
    // Enforce 10-cast limit
    const currentCasts = currentUser.voidGraspCount || 0;
    if (currentCasts >= 10) {
      return { success: false, message: "Spell failed! You have reached your lifetime limit of 10 Voidwalker's Grasps!" };
    }

    if (currentUser.gold < 500) {
      return { success: false, message: "Not enough gold!" };
    }

    const newGold = currentUser.gold - 500;
    const newCasts = currentCasts + 1;

    // Deduct gold and increment cast tracker
    syncUserUpdate({ gold: newGold, voidGraspCount: newCasts });

    const newEffect = { type: 'void_grasp', target_id: targetStudentId, creator_id: currentUser.id };
    const { data, error } = await supabase.from('global_effects').insert([newEffect]).select();
    
    if (!error && data) {
      setGlobalEffects(prev => [...prev, ...data]);
    }

    return { success: true, message: `Voidwalker's Grasp applied! (${10 - newCasts} charges remaining for the year).` };
  };

  const resolveVoidGrasp = async (isSuccess) => {
    if (!currentUser) return;
    if (isSuccess) {
      const { error } = await supabase.from('global_effects').delete().eq('target_id', currentUser.id).eq('type', 'void_grasp');
      if (!error) {
        setGlobalEffects(prev => prev.filter(e => !(e.target_id === currentUser.id && e.type === 'void_grasp')));
      }
    }
  };

  const attemptBlitz = async (questId, score) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return { success: false, message: 'Quest not found' };
    if (score === 0) return { success: false, message: 'No points scored. Try again!' };

    const cappedScore = Math.min(score, 30);

    // Base: 15 XP / 5 Gold. Each correct answer adds +1 XP / +1 Gold. Max: 44 XP, 34 Gold
    let baseXp = quest.xp + (cappedScore - 1) * 1;
    let baseGold = quest.gold + (cappedScore - 1) * 1;

    let xpEarned = applyClassBonus(quest.type, baseXp, currentUser.heroClass);
    xpEarned = applyPetBonus(quest.type, xpEarned, false, currentUser.equippedPet);

    let goldEarned = applyClassBonus(quest.type, baseGold, currentUser.heroClass);
    goldEarned = applyPetBonus(quest.type, goldEarned, true, currentUser.equippedPet);

    const updates = {
      xp: (currentUser.xp || 0) + xpEarned,
      gold: (currentUser.gold || 0) + goldEarned,
    };

    // Single Source of Truth: Route Blitz quests to unique boss tracks
    if (questId === 103) {
      updates.quizQuestsCompleted = (currentUser.quizQuestsCompleted || 0) + 1; // Feeds Owls (Track 2)
    } else if (questId === 112) {
      updates.scenarioQuestsCompleted = (currentUser.scenarioQuestsCompleted || 0) + 1; // Feeds Volcanic Dragons (Track 5)
    } else if (questId === 104) {
      updates.cipherQuestsCompleted = (currentUser.cipherQuestsCompleted || 0) + 1; // Feeds Shapeshifters (Track 6)
    }

    syncUserUpdate(updates);

    // Update blitz high score if this is a new record
    setBlitzHighScores(prev => {
      const current = prev[questId];
      if (!current || score > current.score) {
        return {
          ...prev,
          [questId]: { score: score, player: currentUser.heroName }
        };
      }
      return prev;
    });

    const newSubmission = {
      id: Date.now(), questId, studentId: currentUser.id, studentName: currentUser.heroName,
      status: 'approved', timestamp: new Date().toISOString().split('T')[0], type: 'blitz'
    };
    setSubmissions(prev => [...prev, newSubmission]);
    saveSubmissionToCloud(newSubmission);

    const currentRecord = highScores[questId]?.score || 0;
    if (score > currentRecord) {
      // Save new record to the cloud
      await supabase.from('high_scores').upsert([{ quest_id: questId, player_name: currentUser.heroName, score: score }]);
      // Update everyone's local state instantly
      setHighScores(prev => ({ ...prev, [questId]: { score: score, player: currentUser.heroName } }));
    }

    return { success: true, message: `Time's up! You scored ${score}! +${xpEarned} XP, +${goldEarned} Gold` };
  };

  const attemptMultiStep = async (questId, score) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest) return { success: false, message: 'Quest not found' };
    if (score === 0) return { success: false, message: 'No hydra heads vanquished. Try again!' };

    const cappedScore = Math.min(score, 7);

    let baseXp = quest.xp + (cappedScore - 1) * 3;
    let baseGold = quest.gold + (cappedScore - 1) * 1;

    let xpEarned = applyClassBonus(quest.type, baseXp, currentUser.heroClass);
    xpEarned = applyPetBonus(quest.type, xpEarned, false, currentUser.equippedPet);

    let goldEarned = applyClassBonus(quest.type, baseGold, currentUser.heroClass);
    goldEarned = applyPetBonus(quest.type, goldEarned, true, currentUser.equippedPet);

    const updates = {
      xp: (currentUser.xp || 0) + xpEarned,
      gold: (currentUser.gold || 0) + goldEarned,
      multiStepQuestsCompleted: (currentUser.multiStepQuestsCompleted || 0) + 1,
    };

    syncUserUpdate(updates);

    const newSubmission = {
      id: Date.now(), questId, studentId: currentUser.id, studentName: currentUser.heroName,
      status: 'approved', timestamp: new Date().toISOString().split('T')[0], type: 'multi-step'
    };
    setSubmissions(prev => [...prev, newSubmission]);
    saveSubmissionToCloud(newSubmission);

    return { success: true, message: `Hydra Defeated! You banished ${score} beasts! +${xpEarned} XP, +${goldEarned} Gold` };
  };

  const getHighScore = (questId) => {
    return highScores[questId] || null;
  };

  // Live Realtime listener for global pvp effects (Snares & Grasps)
  // Also listens to prize_claims and pending_prizes for instant UI sync
  useEffect(() => {
    if (!session) return;

    const channel = supabase
      .channel('realtime_global_effects')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'global_effects' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setGlobalEffects(prev => {
              if (prev.some(e => e.id === payload.new.id)) return prev;
              return [...prev, payload.new];
            });
          } else if (payload.eventType === 'DELETE') {
            setGlobalEffects(prev => prev.filter(e => e.id !== payload.old.id));
          } else if (payload.eventType === 'UPDATE') {
            setGlobalEffects(prev => prev.map(e => e.id === payload.new.id ? payload.new : e));
          }
        }
      )
      .subscribe();

    const prizeClaimsChannel = supabase
      .channel('realtime_prize_claims')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'prize_claims' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setPrizeClaims(prev => {
            if (prev.some(c => c.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        } else if (payload.eventType === 'UPDATE') {
          setPrizeClaims(prev => prev.map(c => c.id === payload.new.id ? payload.new : c));
        } else if (payload.eventType === 'DELETE') {
          setPrizeClaims(prev => prev.filter(c => c.id !== payload.old.id));
        }
      })
      .subscribe();

    const pendingPrizesChannel = supabase
      .channel('realtime_pending_prizes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'pending_prizes' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setPendingPrizesList(prev => {
            if (prev.some(p => p.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        } else if (payload.eventType === 'UPDATE') {
          setPendingPrizesList(prev => prev.map(p => p.id === payload.new.id ? payload.new : p));
        } else if (payload.eventType === 'DELETE') {
          setPendingPrizesList(prev => prev.filter(p => p.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      supabase.removeChannel(prizeClaimsChannel);
      supabase.removeChannel(pendingPrizesChannel);
    };
  }, [session]);

  const value = {
    isProfileLoaded,
    students, quests, submissions, BOSSES, ACHIEVEMENTS,
    createQuest, importQuestions, submitQuest, approveSubmission, rejectSubmission, getQuestStatus, submitWellnessCheck, submitBossStrike,
    userRole, setUserRole, currentUser, setCurrentUser,
    buyItem,
    equipOutfit,
    unequipOutfit,
    calculateScholarScore,
    calculateComebackScore,
    updateStudentStats,
    attemptQuiz,
    attemptIncantation,
    recordGauntletFailure,
    attemptScenario,
    clearNotifications,
    fightBoss,
    getSlayerPoints,
    calculateSlayerScore,
    awardRewards,
    fulfillPrize,
    currentRafflePrize,
    setCurrentRafflePrize,
    runMonthlyRaffle,
    updateRafflePrize,
    session,
    login,
    logout,
    updateHeroIdentity,
    buyTomeOfRebirth,
    applyClassBonus,
    equipPet,
    unequipPet,
    applyPetBonus,
    globalEffects,
    applyVoidGrasp,
    resolveVoidGrasp,
    attemptBlitz,
    getHighScore,
    attemptMultiStep,
    prizeClaims,
    claimAchievementPrize,
    fulfillAchievementClaim,
    pendingPrizesList,
    fulfillPendingPrize,
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