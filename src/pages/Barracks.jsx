import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shirt, ArrowLeft, Bird, Flame, Sparkles } from 'lucide-react';
import { useGame } from '../context/GameContext';

const Barracks = () => {
  const navigate = useNavigate();
  const { currentUser, buyItem, equipOutfit, unequipOutfit, buyTomeOfRebirth, equipPet, unequipPet } = useGame();

  const MAP_BG = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/worldmap4.png";

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

    // COMPANIONS (PETS)
    { id: 'pet_1', name: 'Mystic Owlet', cost: 300, reqLevel: 1, type: 'pet', icon: Bird, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Mystic.Owlet.png' },
    { id: 'pet_2', name: 'Fire Whelp', cost: 300, reqLevel: 1, type: 'pet', icon: Flame, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Fire.Whelp.png' },
    { id: 'pet_3', name: 'Astral Fox', cost: 800, reqLevel: 5, type: 'pet', icon: Sparkles, imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Astral.Fox.png' }
  ];

  const handleBuyItem = (item) => {
    const result = buyItem(item);
    if (result.success) {
      alert("Purchase successful!");
    } else {
      alert(result.message || "Purchase failed!");
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

  return (
    <div className="min-h-screen p-4 md:p-8 relative">
      <img src={MAP_BG} alt="Background Map" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/50"></div>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shopItems.map((item) => {
                const alreadyOwned = ownsItem(item.id);
                const isLevelLocked = currentLevel < item.reqLevel;
                const isBossLoot = !!item.reqBoss;
                
                return (
                  <div key={item.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-yellow-400/50 transition-colors flex flex-col justify-between">
                    <div className="flex flex-col items-center text-center mb-3">
                      <div className="w-full h-32 mb-2 rounded-lg bg-black/80 flex items-center justify-center overflow-hidden">
                         <img src={item.imageLink} alt={item.name} className="h-full w-full object-contain"/>
                      </div>
                      <h3 className="text-xl font-bold text-white font-['VT323'] mb-1">{item.name}</h3>
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
                          alreadyOwned ? 'bg-stone-600 text-stone-400 cursor-not-allowed text-sm' : 'bg-purple-900/50 text-purple-300 border border-purple-700 cursor-not-allowed text-xs'
                        }`}
                      >
                        {alreadyOwned ? 'OWNED' : `Defeat ${item.reqBoss}`}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuyItem(item)}
                        disabled={alreadyOwned || currentUser.gold < item.cost || isLevelLocked}
                        className={`w-full py-2 px-4 rounded-lg font-bold font-['VT323'] text-xl transition-colors ${
                          isLevelLocked ? 'bg-stone-800 text-stone-500 cursor-not-allowed' : alreadyOwned ? 'bg-stone-600 text-stone-400 cursor-not-allowed' : currentUser.gold < item.cost ? 'bg-red-900/50 text-red-300 cursor-not-allowed' : 'bg-yellow-600 hover:bg-yellow-500 text-white'
                        }`}
                      >
                        {isLevelLocked ? `Lvl ${item.reqLevel} Req` : alreadyOwned ? 'OWNED' : 'BUY'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Barracks;
