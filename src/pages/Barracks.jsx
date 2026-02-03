import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shirt, ArrowLeft } from 'lucide-react';
import { useGame } from '../context/GameContext';

const Barracks = () => {
  const navigate = useNavigate();
  const { currentUser, buyItem, equipOutfit, unequipOutfit } = useGame();

  const MAP_BG = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/worldmap4.png";

  const shopItems = [
    {
      id: 101,
      name: 'Ninja Outfit',
      cost: 20,
      imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/base.body.ninja2.png',
      type: 'outfit',
      icon: Shirt
    },
    {
      id: 102,
      name: 'Knight Outfit',
      cost: 20,
      imageLink: 'https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/new.base.knight2.png',
      type: 'outfit',
      icon: Shirt
    }
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
    return currentUser.inventory.some(item => item.id === itemId);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-white font-['VT323'] text-2xl">Please log in to access the Barracks.</div>
      </div>
    );
  }

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
              <div className="text-xl text-stone-300 font-['VT323']">Level {currentUser.level}</div>
              <div className="flex items-center justify-center text-2xl text-yellow-400 font-['VT323'] mt-1">
                <span>{currentUser.gold}</span>
                <span className="ml-2 text-yellow-500">G</span>
              </div>
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
                    const isEquipped = currentUser.currentBodySprite === item.imageLink;
                    return (
                      <div key={index} className="flex items-center justify-between gap-3 p-3 bg-white/5 rounded-lg border border-white/10">
                        <div className="flex items-center gap-3">
                          <Shirt size={24} className="text-yellow-400" />
                          <span className="text-white font-['VT323'] text-xl">{item.name}</span>
                        </div>
                        <button
                          onClick={() => isEquipped ? unequipOutfit() : equipOutfit(item.imageLink)}
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
          </div>

          {/* Armory Glass Container */}
          <div className="md:col-span-2 bg-black/75 backdrop-blur-md border border-white/10 shadow-2xl rounded-xl p-6">
            <h2 className="text-2xl text-yellow-400 font-['Press_Start_2P'] mb-4">THE ARMORY</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shopItems.map((item) => {
                const alreadyOwned = ownsItem(item.id);
                return (
                  <div key={item.id} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-yellow-400/50 transition-colors flex flex-col justify-between">
                    <div className="flex flex-col items-center text-center mb-3">
                      <div className="w-full h-32 mb-2 rounded-lg bg-black/80 flex items-center justify-center overflow-hidden">
                         <img src={item.imageLink} alt={item.name} className="h-full w-full object-contain"/>
                      </div>
                      <h3 className="text-xl font-bold text-white font-['VT323'] mb-1">{item.name}</h3>
                      <div className="text-yellow-400 font-['VT323'] text-xl">{item.cost} G</div>
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
        </div>
      </div>
    </div>
  );
};

export default Barracks;
