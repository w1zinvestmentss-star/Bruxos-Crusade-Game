import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shirt, ArrowLeft, Bird, Flame, Sparkles, Wand } from 'lucide-react';
import { useGame } from '../context/GameContext';

const Barracks = () => {
  const navigate = useNavigate();
const { currentUser, buyItem, equipOutfit, unequipOutfit, buyTomeOfRebirth, equipPet, unequipPet, applyVoidGrasp, quests, students, globalEffects } = useGame();
   const [selectedGraspTarget, setSelectedGraspTarget] = React.useState('');
   const [activeCategory, setActiveCategory] = React.useState('all');

  const BARRACKS_BG = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Barracks.background1.jpg";

  const shopItems =[
    // LEVEL 1: The Survivor Collection (Cost: 50, Level Req: 1)
    { id: 1001, name: 'Deprived Wanderer', cost: 50, reqLevel: 1, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Deprived.Wanderer.png' },
    { id: 1002, name: 'Exiled Monk', cost: 50, reqLevel: 1, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Exiled.Monk.png' },
    { id: 1003, name: 'Grave Robber', cost: 50, reqLevel: 1, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Grave.Robber.png' },
    { id: 1004, name: 'Holy Villager', cost: 50, reqLevel: 1, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Holy.Villager.png' },
    { id: 1005, name: 'Shinobi Apprentice', cost: 50, reqLevel: 1, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Shinobi.Apprentice.png' },
    { id: 1006, name: 'Survivalist', cost: 50, reqLevel: 1, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Survivalist.png' },
    { id: 1007, name: 'Yharnam Traveler', cost: 50, reqLevel: 1, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Yharnam.Traveler.png' },

    // LEVEL 2: The Hunter Collection (Cost: 300, Level Req: 5)
    { id: 1008, name: 'Beast Hunter', cost: 300, reqLevel: 5, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Beast.Hunter.png' },
    { id: 1009, name: 'Cursed Swordsman', cost: 300, reqLevel: 5, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Cursed.Swordsman.png' },
    { id: 1010, name: 'Elite Knight', cost: 300, reqLevel: 5, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Elite.Knight.png' },
    { id: 1011, name: 'Inquisitor', cost: 300, reqLevel: 5, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Inquisitor.png' },
    { id: 1012, name: 'Shadow Ninja', cost: 300, reqLevel: 5, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Shadow.Ninja.png' },
    { id: 1013, name: 'Tactical Mercenary', cost: 300, reqLevel: 5, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Tactical.Mercenary.png' },
    { id: 1014, name: 'Vampire Killer', cost: 300, reqLevel: 5, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Vampire.Killer.png' },
    { id: 1031, name: 'Kat Felis', cost: 300, reqLevel: 5, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Kat.Felis.png?v=1' },

    // LEVEL 3: The Slayer Collection (Cost: 1500, Level Req: 10)
    { id: 1015, name: 'Bio-Weapon', cost: 1500, reqLevel: 10, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Bio-Weapon.png' },
    { id: 1016, name: 'Blood Knight', cost: 1500, reqLevel: 10, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Blood.Knight.png' },
    { id: 1017, name: 'Crow Assassin', cost: 1500, reqLevel: 10, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Crow.Assassin.png' },
    { id: 1018, name: 'Cyber-Demon Ninja', cost: 1500, reqLevel: 10, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Cyber-Demon.Ninja.png' },
    { id: 1019, name: 'Sun Warrior', cost: 1500, reqLevel: 10, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Sun.Warrior.png' },
    { id: 1020, name: 'Void Walker', cost: 1500, reqLevel: 10, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Void.Walker.png' },

    // LEVEL 4: The Lord Collection (Cost: 5000, Level Req: 15)
    { id: 1021, name: 'Abyssal Warden', cost: 5000, reqLevel: 15, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Abyssal.Warden.png' },
    { id: 1022, name: 'Astral Sovereign', cost: 5000, reqLevel: 15, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Astral.Sovereign.png' },
    { id: 1023, name: 'Cosmic Great One', cost: 5000, reqLevel: 15, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Cosmic.Great.%20One.png' },
    { id: 1024, name: 'Crimson King', cost: 5000, reqLevel: 15, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Crimson.King.png' },
    { id: 1025, name: 'Dark Lord', cost: 5000, reqLevel: 15, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Dark.Lord.png' },
    { id: 1026, name: 'Divine Beast', cost: 5000, reqLevel: 15, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Divine.Beast.png' },
    { id: 1027, name: 'Dragon Ninja Master', cost: 5000, reqLevel: 15, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Dragon.Ninja%20Master.png' },
    { id: 1028, name: 'Lord of Cinder', cost: 5000, reqLevel: 15, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Lord.of.Cinder.png' },
    { id: 1029, name: 'Mecha Shogun', cost: 5000, reqLevel: 15, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Mecha.Shogun.png' },
    { id: 1030, name: 'Rot Champion', cost: 5000, reqLevel: 15, type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Rot.Champion.png' },

    // BOSS LOOT (Tier 4 Bosses)
    { id: 'loot_104', name: 'Library Titan Armor', cost: 0, reqBoss: 'The Library Titan', type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Library.Titan.Armor.png' },
    { id: 'loot_204', name: 'Celestial Owl Armor', cost: 0, reqBoss: 'The Celestial Owl', type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Celestial.Owl.Armor.png' },
    { id: 'loot_304', name: 'Void Hydra Armor', cost: 0, reqBoss: 'The Void Hydra', type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Void.Hydra.Armor.png' },
    { id: 'loot_404', name: 'Chronos Titan Armor', cost: 0, reqBoss: 'The Chronos Titan', type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Chronos.Titan.Armor.png' },
    { id: 'loot_504', name: 'Molten Sovereign Armor', cost: 0, reqBoss: 'The Molten Sovereign', type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Molten.Sovereign.Armor.png' },
    { id: 'loot_604', name: 'Shattered Sovereign Armor', cost: 0, reqBoss: 'The Shattered Sovereign', type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Shattered.Sovereign.Armor.png' },
    { id: 'loot_704', name: 'Spectral Archivist Armor', cost: 0, reqBoss: 'The Spectral Archivist', type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Spectral.Archivist.Armor.png' },
    { id: 'loot_804', name: 'Ivory Leviathan Armor', cost: 0, reqBoss: 'The Ivory Leviathan', type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Ivory.Leviathan.Armor.png' },
    { id: 'loot_904', name: 'Prism Weaver Armor', cost: 0, reqBoss: 'The Prism Weaver', type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Prism.Weaver.Armor.png' },
    { id: 'loot_1004', name: 'Seraph of Hope Armor', cost: 0, reqBoss: 'The Seraph of Hope', type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Seraph.of.Hope.Armor.png' },
    { id: 'loot_1104', name: 'Weaver of Fates Armor', cost: 0, reqBoss: 'The Weaver of Fates', type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Weaver.of.Fates.Armor.png' },
    { id: 'loot_1204', name: 'Storm-Born King Armor', cost: 0, reqBoss: 'The Storm-Born King', type: 'outfit', icon: Shirt, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Storm-Born%20King.outfit.png' },

// COMPANIONS (PETS)
      { id: 2001, name: 'Mystic Owlet', cost: 300, reqLevel: 1, type: 'pet', icon: Bird, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Mystic.Owlet.png', buff: '+15% XP (Quizzes & Puzzles)' },
      { id: 2002, name: 'Fire Whelp', cost: 300, reqLevel: 1, type: 'pet', icon: Flame, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Fire.Whelp.png', buff: '+15% Gold (Homework & Reports)' },
      { id: 2003, name: 'Astral Fox', cost: 800, reqLevel: 5, type: 'pet', icon: Sparkles, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Astral.Fox.png', buff: '+5% Gold & XP (All Quests)' },

      // MAGIC SPELLS (CONSUMABLES)
      { id: 'spell_1', name: 'Oath of the Abyss', cost: 150, type: 'consumable', buffType: 'oath', icon: Wand, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Oath.of.the.Abyss.png?v=1' },
      { id: 'spell_2', name: 'Ember of the Ashen', cost: 250, type: 'consumable', buffType: 'ember', icon: Flame, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Ember.of.the.Ashen.png?v=1' },
      // PvP ITEMS
      { id: 2005, name: "Voidwalker's Grasp", cost: 500, type: 'pvp', imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Voidwalker\'s.Grasp.png' }
  ];

  const handleBuyItem = async (item) => {
    const result = await buyItem(item);
    if (result && result.success) {
      alert("Purchase successful!");
    } else {
      alert(result?.message || "Purchase failed!");
    }
  };

  const ownsItem = (itemId) => {
    if (!currentUser || !currentUser.inventory) return false;
    return currentUser.inventory.some(item => item.id === itemId || item.item_id === itemId);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-white font-['VT323'] text-2xl">Please log in to access the Barracks.</div>
      </div>
    );
  }

  const currentLevel = Math.floor(currentUser.xp / 1000) + 1;

  const hasEmber = currentUser.activeBuffs?.ember && currentUser.activeBuffs.ember > Date.now();
  const hasOath = currentUser.activeBuffs?.oath;
  const hasVoidGrasp = globalEffects?.some(e => e.type === 'void_grasp' && e.target_id === currentUser.id);
  const hasActiveSpells = hasEmber || hasOath || hasVoidGrasp;

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      {/* Fixed Viewport Background (Prevents stretching/warping on long pages) */}
      <div className="fixed inset-0 z-0 h-full w-full overflow-hidden pointer-events-none">
        <img 
          src={BARRACKS_BG} 
          alt="Barracks Background" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      <div className="relative z-10">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => navigate('/student-dashboard')}
            className="p-2 bg-black/70 hover:bg-white/10 rounded-lg border border-white/10 text-white transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-4xl text-yellow-400 font-['Press_Start_2P']">THE BARRACKS</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {/* Hero Preview Glass Container */}
          <div className="md:col-span-1 bg-black/75 backdrop-blur-md border border-white/10 shadow-2xl rounded-xl p-6">
            <h2 className="text-2xl text-yellow-400 font-['Press_Start_2P'] mb-4 text-center">PREVIEW</h2>
            
            <div className="text-center mb-6">
              <div className="text-3xl text-white mb-1 font-['VT323']">{currentUser.heroName}</div>
              <div className="text-xl text-stone-300 font-['VT323']">Level {currentLevel}</div>
              <div className="flex items-center justify-center text-2xl text-yellow-400 font-['VT323'] mt-1">
                <span>{currentUser.gold}</span>
                <span className="ml-2 text-yellow-500">G</span>
              </div>
              <div className="text-sm text-purple-400 font-['VT323'] mt-2">Companion: {currentUser.equippedPet || 'None'}</div>
            </div>

            {/* IMPORTANT: Solid background for sprite visibility */}
            <div className="relative mb-6 w-full h-96 bg-black/90 rounded-lg overflow-hidden border border-stone-700">
              <img
                src={currentUser.currentBodySprite} 
                alt="Hero Preview"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>

            {/* Equipped Companion Box */}
            {currentUser.equippedPet && currentUser.inventory?.some(i => i.name === currentUser.equippedPet) && (
              <div className="mb-6 bg-stone-800/80 border-2 border-purple-500/50 rounded-xl p-4 flex items-center gap-4 shadow-lg">
                <div className="w-20 h-20 bg-black rounded-lg border border-purple-400 overflow-hidden flex-shrink-0 flex items-center justify-center p-1">
                  <img 
                    src={currentUser.inventory.find(i => i.name === currentUser.equippedPet)?.imageLink || currentUser.inventory.find(i => i.name === currentUser.equippedPet)?.image_link} 
                    alt="Pet" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <div className="text-purple-400 font-['Press_Start_2P'] text-[10px] mb-1 tracking-wider">COMPANION</div>
                  <div className="text-white font-['VT323'] text-2xl">{currentUser.equippedPet}</div>
                  {shopItems.find(item => item.name === currentUser.equippedPet)?.buff && (
                    <div className="text-green-400 font-mono text-[10px] sm:text-xs mt-1 leading-tight">
                      {shopItems.find(item => item.name === currentUser.equippedPet).buff}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ACTIVE SPELLS SECTION */}
            <div className="mb-6">
              <h3 className="text-[10px] sm:text-xs text-yellow-400 font-['Press_Start_2P'] mb-3">ACTIVE SPELLS</h3>
              {!hasActiveSpells ? (
                <div className="text-stone-500 italic font-['VT323'] text-lg">No active enchantments.</div>
              ) : (
                <div className="space-y-2">
                  {hasEmber && (
                    <div className="bg-orange-900/40 border border-orange-500 text-orange-400 p-2 rounded text-center font-['VT323'] text-lg shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                      EMBER ACTIVE (2x XP)
                    </div>
                  )}
                  {hasOath && (
                    <div className="bg-purple-900/40 border border-purple-500 text-purple-400 p-2 rounded text-center font-['VT323'] text-lg shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                      OATH ACTIVE (4x REWARDS)
                    </div>
                  )}
                  {hasVoidGrasp && (
                    <div className="bg-red-900/60 border border-red-500 text-red-200 animate-pulse p-2 rounded text-center font-['VT323'] text-lg shadow-[0_0_15px_rgba(239,68,68,0.4)]">
                      VOID GRASPED (BOARD LOCKED)
                    </div>
                  )}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xl text-white font-['VT323'] mb-3">EQUIPPED</h3>
              {currentUser.inventory && currentUser.inventory.filter(i => i.type === 'outfit').length > 0 ? (
                <div className="space-y-2">
                  {currentUser.inventory.map((item, index) => {
                    if (item.type !== 'outfit') return null;
                    const actualImageLink = item.image_link || item.imageLink;
                    const isEquipped = currentUser.currentBodySprite === actualImageLink;
                    return (
                      <div key={index} className="flex items-center justify-between gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center gap-3">
                          <Shirt size={24} className="text-yellow-400" />
                          <span className="text-white font-['VT323'] text-xl">{item.name}</span>
                        </div>
                        <button
                          onClick={() => isEquipped ? unequipOutfit() : equipOutfit(actualImageLink)}
                          className={`py-1 px-3 rounded-md font-['VT323'] text-lg transition-colors ${
                            isEquipped
                              ? 'bg-red-600 hover:bg-red-500 text-white'
                              : 'bg-green-600 hover:bg-green-500 text-white'
                          }`}
                        >
                          {isEquipped ? 'UNEQUIP' : 'EQUIP'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-stone-400 italic font-['VT323'] text-lg">No outfits owned.</div>
              )}
            </div>

            <div className="mt-6">
              <h3 className="text-[10px] sm:text-xs text-yellow-400 font-['Press_Start_2P'] mb-3">COMPANIONS (PETS)</h3>
              {currentUser.inventory && currentUser.inventory.filter(i => i.type === 'pet').length > 0 ? (
                <div className="space-y-2">
                  {currentUser.inventory.map((item, index) => {
                    if (item.type !== 'pet') return null;
                    const isEquipped = currentUser.equippedPet === item.name;
                    let IconComponent = Bird;
                    if (item.name === 'Fire Whelp') IconComponent = Flame;
                    else if (item.name === 'Astral Fox') IconComponent = Sparkles;

                    return (
                      <div key={index} className="flex items-center justify-between gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center gap-3">
                          <IconComponent size={24} className="text-yellow-400" />
                          <span className="text-white font-['VT323'] text-xl">{item.name}</span>
                        </div>
                        <button
                          onClick={() => isEquipped ? unequipPet() : equipPet(item.name)}
                          className={`py-1 px-3 rounded-md font-['VT323'] text-lg transition-colors ${
                            isEquipped
                              ? 'bg-red-600 hover:bg-red-500 text-white'
                              : 'bg-green-600 hover:bg-green-500 text-white'
                          }`}
                        >
                          {isEquipped ? 'UNEQUIP' : 'EQUIP'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-stone-400 italic font-['VT323'] text-lg">No pets owned.</div>
              )}
            </div>

            <div className="mt-8 bg-indigo-900/30 border-2 border-indigo-500/50 rounded-xl p-4 text-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
              <h3 className="text-lg text-indigo-300 font-['Press_Start_2P'] mb-2">MYSTIC ITEMS</h3>
              <div className="text-2xl text-white font-['VT323'] mb-1">Tome of Rebirth</div>
              <div className="text-stone-400 text-sm font-['VT323'] mb-4 leading-tight">Forget your past. Reset your Class. Costs 1000 Gold.</div>
              <button
                disabled={currentUser.gold < 1000}
                onClick={async () => {
                  const result = await buyTomeOfRebirth();
                  if (result.success) {
                    alert("Your memory fades... you must choose a new path!");
                    navigate('/student-dashboard');
                  }
                }}
                className={`w-full py-2 rounded-lg font-bold font-['VT323'] text-xl transition-colors ${
                  currentUser.gold < 1000 ? 'bg-stone-600 text-stone-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                BUY TOME (1000 G)
              </button>
            </div>
          </div>

          {/* Armory Glass Container */}
          <div className="md:col-span-2 bg-black/75 backdrop-blur-md border border-white/10 shadow-2xl rounded-xl p-6">
            <h2 className="text-2xl text-yellow-400 font-['Press_Start_2P'] mb-4">THE ARMORY</h2>
            
            {/* ARMORY CATEGORY FILTER TABS */}
            <div className="flex overflow-x-auto gap-2 mb-6 pb-2 custom-scrollbar no-scrollbar">
              {[
                { id: 'all', label: 'ALL ITEMS' },
                { id: 'outfits', label: '🛡️ OUTFITS' },
                { id: 'pets', label: '🐾 COMPANIONS' },
                { id: 'spells', label: '🔮 MAGIC SPELLS' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-2 rounded-lg font-['Press_Start_2P'] text-[9px] sm:text-[10px] whitespace-nowrap transition-all flex items-center gap-2 ${
                    activeCategory === tab.id 
                      ? 'bg-yellow-500 text-stone-950 font-bold border-2 border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.4)]' 
                      : 'bg-black/60 text-stone-400 border border-stone-700 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Outfits Section Guard */}
            {(activeCategory === 'all' || activeCategory === 'outfits') && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {shopItems.filter(item => item.type === 'outfit').map((item) => {
                  const alreadyOwned = ownsItem(item.id);
                  const isLevelLocked = currentLevel < item.reqLevel;
                  const isBossLoot = !!item.reqBoss;
                  const isEquipped = currentUser?.currentBodySprite === item.imageLink;
                  
                  return (
                    <div key={item.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-yellow-400/50 transition-colors flex flex-col justify-between">
                      <div className="flex flex-col items-center text-center mb-3">
                        <div className="w-full h-32 mb-2 rounded-lg bg-black/80 flex items-center justify-center overflow-hidden">
                           <img src={item.imageLink} alt={item.name} className="h-full w-full object-contain"/>
                        </div>
                        <h3 className="text-xl font-bold text-white font-['VT323'] mb-1">{item.name}</h3>
                        {item.type === 'pet' && item.buff && (<div className="text-green-400 font-mono text-xs mb-1 min-h-[1rem] leading-tight px-1">{item.buff}</div>)}
                        {isBossLoot ? (
                          <div className="text-purple-400 font-mono text-sm font-bold">BOSS LOOT</div>
                        ) : (
                          <div className="text-yellow-400 font-['VT323'] text-xl">{item.cost} G</div>
                        )}
                      </div>
                      {isBossLoot ? (
                        <button
                          disabled={true}
                          className={`w-full py-2 px-4 rounded-lg font-bold font-mono transition-colors ${
                            isEquipped
                              ? 'bg-green-600/30 text-green-400 border border-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.3)] cursor-default text-xs'
                              : alreadyOwned 
                              ? 'bg-stone-600 text-stone-400 cursor-not-allowed text-sm' 
                              : 'bg-purple-900/50 text-purple-300 border border-purple-700 cursor-not-allowed text-xs'
                          }`}
                        >
                          {isEquipped ? '✅ EQUIPPED' : alreadyOwned ? 'OWNED' : `Defeat ${item.reqBoss}`}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBuyItem(item)}
                          disabled={alreadyOwned || currentUser.gold < item.cost || isLevelLocked}
                          className={`w-full py-2 px-4 rounded-lg font-bold font-['VT323'] text-xl transition-colors ${
                            isLevelLocked 
                              ? 'bg-stone-800 text-stone-500 cursor-not-allowed' 
                              : isEquipped 
                              ? 'bg-green-600/30 text-green-400 border border-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.3)] cursor-default' 
                              : alreadyOwned 
                              ? 'bg-stone-600 text-stone-400 cursor-not-allowed' 
                              : currentUser.gold < item.cost 
                              ? 'bg-red-900/50 text-red-300 cursor-not-allowed' 
                              : 'bg-yellow-600 hover:bg-yellow-500 text-white'
                          }`}
                        >
                          {isLevelLocked ? `Lvl ${item.reqLevel} Req` : isEquipped ? '✅ EQUIPPED' : alreadyOwned ? 'OWNED' : 'BUY'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Companions Section */}
            {(activeCategory === 'all' || activeCategory === 'pets') && (
              <div className="mt-12">
                <h2 className="text-2xl text-yellow-400 font-['Press_Start_2P'] mb-2 uppercase">COMPANIONS</h2>
                <p className="text-stone-400 font-['VT323'] text-xl mb-6">Loyal familiars that grant passive bonuses to your quests.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {shopItems.filter(item => item.type === 'pet').map((item) => {
                    const alreadyOwned = ownsItem(item.id);
                    return (
                      <div key={item.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-yellow-400/50 transition-colors flex flex-col justify-between">
                        <div className="flex flex-col items-center text-center mb-3">
                          <div className="w-full h-32 mb-2 rounded-lg bg-black/80 flex items-center justify-center overflow-hidden">
                             <img src={item.imageLink} alt={item.name} className="h-full w-full object-contain mix-blend-normal"/>
                          </div>
                          <h3 className="text-xl font-bold text-white font-['VT323'] mb-1">{item.name}</h3>
                          {item.buff && <div className="text-green-400 font-mono text-xs mb-1 leading-tight">{item.buff}</div>}
                          <div className="text-yellow-400 font-['VT323'] text-xl mt-1">{item.cost} G</div>
                        </div>
                        <button
                          onClick={() => handleBuyItem(item)}
                          disabled={alreadyOwned || currentUser.gold < item.cost}
                          className={`w-full py-2 px-4 rounded-lg font-bold font-['VT323'] text-xl transition-colors ${
                            alreadyOwned ? 'bg-stone-600 text-stone-400 cursor-not-allowed' : currentUser.gold < item.cost ? 'bg-red-900/50 text-red-300 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-500 text-white'
                          }`}
                        >
                          {alreadyOwned ? 'OWNED' : 'BUY'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Magic Spells & Dark Magic Section Guard */}
            {(activeCategory === 'all' || activeCategory === 'spells') && (
              <>
                {/* Magic Spells Section */}
                <div className="mt-12 bg-black/75 backdrop-blur-md border border-white/10 shadow-2xl rounded-xl p-6">
                  <h2 className="text-2xl text-purple-400 font-['Press_Start_2P'] mb-4">MAGIC SPELLS</h2>
                  <p className="text-stone-400 font-['VT323'] text-lg mb-4">Consumable enchantments that grant powerful, one-time effects during your quests.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {shopItems.filter(item => item.type === 'consumable').map((item) => {
                      const alreadyOwned = false;
                      return (
                        <div key={item.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-purple-400/50 transition-colors flex flex-col justify-between">
                          <div className="flex flex-col items-center text-center mb-3">
                            <div className="w-full h-32 mb-2 rounded-lg bg-black/80 flex items-center justify-center overflow-hidden">
                              <img src={item.imageLink} alt={item.name} className="h-full w-full object-contain"/>
                            </div>
                            <h3 className="text-xl font-bold text-white font-['VT323'] mb-1">{item.name}</h3>
                            <div className="text-purple-400 font-['VT323'] text-sm mb-1">
                              {item.buffType === 'ember' ? '2x XP for 24 Hours' : '4x XP/Gold on next success'}
                            </div>
                            {item.buffType === 'ember' && (
                              <div className="text-red-400 font-['VT323'] text-xs italic">"Only use if you have fallen behind!"</div>
                            )}
                            <div className="text-yellow-400 font-['VT323'] text-xl">{item.cost} G</div>
                          </div>
                          {(() => {
                            const limitKey = item.buffType === 'oath' ? 'spellOathCount' : 'spellEmberCount';
                            const remainingCasts = 10 - (currentUser[limitKey] || 0);
                            const isLimitReached = remainingCasts <= 0;
                            const isButtonDisabled = currentUser.gold < item.cost || isLimitReached;

                            return (
                              <button
                                onClick={() => {
                                  if (isLimitReached) return alert(`You have exhausted all 10 ${item.name} charges!`);
                                  handleBuyItem(item);
                                }}
                                disabled={isButtonDisabled}
                                className={`w-full py-2 px-4 rounded-lg font-bold font-['VT323'] text-xl transition-colors ${
                                  isButtonDisabled 
                                    ? 'bg-stone-800 text-stone-500 cursor-not-allowed' 
                                    : 'bg-purple-600 hover:bg-purple-500 text-white'
                                }`}
                              >
                                {isLimitReached 
                                  ? 'DEPLETED (0/10 Left)' 
                                  : `CAST SPELL (${item.cost} G) [${remainingCasts}/10 Left]`
                                }
                              </button>
                            );
                          })()}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                {/* Dark Magic (PvP) Section */}
                <div className="mt-12 bg-black/75 backdrop-blur-md border border-red-900/50 shadow-2xl rounded-xl p-6">
                   <h2 className="text-2xl text-red-500 font-['Press_Start_2P'] mb-4">DARK MAGIC</h2>
                   <p className="text-stone-400 font-['VT323'] text-lg mb-4">Dangerous spells that affect other students.</p>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
                     {shopItems.filter(item => item.type === 'pvp').map((item) => {
                       return (
                         <div key={item.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-red-500/50 transition-colors flex flex-col justify-between">
                           <div className="flex flex-col items-center text-center mb-3">
                             <div className="w-full h-32 mb-2 rounded-lg bg-black/80 flex items-center justify-center overflow-hidden">
                               <img src={item.imageLink} alt={item.name} className="h-full w-full object-contain"/>
                             </div>
                             <h3 className="text-xl font-bold text-red-500 font-['VT323'] mb-1">{item.name}</h3>
                             <div className="text-red-400 font-['VT323'] text-sm mb-1">
                               Lock the Leaderboard Top 3 out of Quests!
                             </div>
                             <div className="text-yellow-400 font-['VT323'] text-xl mb-4">{item.cost} G</div>
                           </div>

                            <div className="flex flex-col gap-2">
                              <select
                                value={selectedGraspTarget}
                                onChange={(e) => setSelectedGraspTarget(e.target.value)}
                                className="bg-black/80 text-stone-300 border border-stone-600 rounded p-2 font-['VT323'] text-lg w-full"
                              >
                                <option value="">Select a Target...</option>
                                {[...students]
                                  .sort((a, b) => b.xp - a.xp)
                                  .slice(0, 3)
                                  .filter(s => s.id !== currentUser.id)
                                  .map(s => (
                                    <option key={s.id} value={s.id}>{s.heroName || s.name}</option>
                                  ))}
                              </select>
                              {(() => {
                                const remainingCasts = 10 - (currentUser.voidGraspCount || 0);
                                const isLimitReached = remainingCasts <= 0;
                                const isButtonDisabled = currentUser.gold < item.cost || !selectedGraspTarget || isLimitReached;

                                return (
                                  <button
                                    onClick={async () => {
                                      if (isLimitReached) return alert("You have exhausted all 10 Voidwalker's Grasp charges!");
                                      if (!selectedGraspTarget) return alert('Select a target first!');
                                      const res = await applyVoidGrasp(selectedGraspTarget);
                                      alert(res.message);
                                    }}
                                    disabled={isButtonDisabled}
                                    className={`w-full py-2 px-4 rounded-lg font-bold font-['VT323'] text-xl transition-colors ${
                                      isButtonDisabled
                                        ? 'bg-stone-800 text-stone-500 cursor-not-allowed'
                                        : 'bg-red-700 hover:bg-red-600 text-white'
                                    }`}
                                  >
                                    {isLimitReached
                                      ? 'DEPLETED (0/10 Left)'
                                      : `CAST (${item.cost} G) [${remainingCasts}/10 Left]`
                                    }
                                  </button>
                                );
                              })()}
                            </div>
                         </div>
                       );
                     })}
                   </div>
                 </div>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Barracks;
