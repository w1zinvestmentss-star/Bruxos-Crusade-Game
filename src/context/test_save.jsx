import React from "react";
  equippedPet: dbProfile.equipped_pet || null,
});

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

  const { error } = await supabase.from('profiles').update(dbUpdates).eq('id', userId);
  if (error) console.error("Error saving to cloud:", error);
};
