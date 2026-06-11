const formatProfile = (dbProfile) => ({
  ...dbProfile,
  notifications: dbProfile.notifications || [],
  equippedPet: dbProfile.equipped_pet || null,
});
const saveProfileToCloud = async (userId, updates) => {};
