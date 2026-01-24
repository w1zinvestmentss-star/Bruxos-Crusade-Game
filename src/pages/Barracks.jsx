import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sword, Shield, FlaskRound, Shirt, ArrowLeft } from 'lucide-react';
import { useGame } from '../context/GameContext';

const BASE_BODY_URL = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/base.body.png";
const SWORD_URL = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/sword.png";
const ARMOR_URL = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/Basic.chest.amour.image.png";

const Barracks = () => {
  const navigate = useNavigate();
  const { currentUser, buyItem } = useGame();

  // Mock Items Array
  const shopItems = [
    { id: 1, name: "Wooden Sword", cost: 50, icon: Sword, imageLink: SWORD_URL },
    { id: 4, name: "Leather Armor", cost: 150, icon: Shirt, imageLink: ARMOR_URL },
    { id: 2, name: "Iron Shield", cost: 100, icon: Shield, imageLink: null },
    { id: 3, name: "Health Potion", cost: 20, icon: FlaskRound, imageLink: null },
  ];

  const handleBuyItem = (item) => {
    const result = buyItem(item);
    if (result.success) {
      alert("Purchase successful! Item added to your inventory.");
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
      <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 flex items-center justify-center">
        <div className="text-white text-xl">Please log in to access the Barracks.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 p-4 md:p-8">
      {/* Header with Back Button */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() => navigate('/student-dashboard')}
          className="p-2 bg-stone-700 hover:bg-stone-600 rounded-lg border border-stone-500 text-white transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-4xl font-bold text-yellow-400 font-mono uppercase tracking-wider">
          The Barracks
        </h1>
      </div>

      {/* 2-Column Layout (Responsive Stack on Mobile) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        
        {/* Left Column: Hero Preview */}
        <div className="md:col-span-1 bg-stone-800/80 border-2 border-stone-600 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-yellow-400 font-mono mb-4 uppercase text-center">
            Hero Preview
          </h2>
          
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-white mb-1">{currentUser.heroName}</div>
            <div className="text-lg text-stone-300 font-mono">Level {currentUser.level}</div>
            <div className="text-sm text-yellow-400 font-mono mt-1">{currentUser.gold} 🪙</div>
          </div>

          {/* Paper Doll Visualization - Even Larger Size */}
          <div className="flex justify-center items-center mb-6 w-full h-[420px] bg-stone-900/50 rounded-lg overflow-hidden border-2 border-stone-700">
            <div className="relative w-96 h-96"> {/* Increased from w-64 h-64 */}
              {/* Base Body */}
              <img
                src={BASE_BODY_URL}
                alt="Hero Body"
                className="absolute inset-0 w-full h-full object-contain"
              />

              {/* Equipped Items */}
              {currentUser.inventory?.map((item, index) =>
                item.imageLink ? (
                  <img
                    key={index}
                    src={item.imageLink}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                ) : null
              )}
            </div>
          </div>

          {/* Owned Items List */}
          <div>
            <h3 className="text-lg font-bold text-white font-mono mb-3 uppercase">
              Inventory
            </h3>
            {currentUser.inventory && currentUser.inventory.length > 0 ? (
              <div className="space-y-2">
                {currentUser.inventory.map((item, index) => {
                  const IconComponent = item.icon || Sword; // Fallback icon
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-stone-700/50 rounded-lg border border-stone-600"
                    >
                      <IconComponent size={24} className="text-yellow-400" />
                      <span className="text-white font-mono">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-stone-400 italic font-mono text-sm">
                Your inventory is empty.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: The Armory */}
        <div className="md:col-span-2 bg-stone-800/80 border-2 border-stone-600 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-yellow-400 font-mono mb-4 uppercase">
            The Armory
          </h2>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shopItems.map((item) => {
              const IconComponent = item.icon;
              const alreadyOwned = ownsItem(item.id);
              
              return (
                <div
                  key={item.id}
                  className="bg-stone-700/50 border-2 border-stone-600 rounded-lg p-4 hover:border-yellow-400 transition-colors flex flex-col justify-between"
                >
                  <div className="flex flex-col items-center text-center mb-3">
                    {item.imageLink ? (
                        <img src={item.imageLink} alt={item.name} className="w-24 h-24 object-contain mb-2"/>
                    ) : (
                        <div className="w-24 h-24 flex items-center justify-center">
                           <IconComponent size={48} className="text-yellow-400 mb-2" />
                        </div>
                    )}
                    <h3 className="text-lg font-bold text-white font-mono mb-1">
                      {item.name}
                    </h3>
                    <div className="text-yellow-400 font-mono text-sm">
                      {item.cost} 🪙
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleBuyItem(item)}
                    disabled={alreadyOwned || currentUser.gold < item.cost}
                    className={`w-full py-2 px-4 rounded-lg font-bold font-mono uppercase transition-colors ${
                      alreadyOwned
                        ? 'bg-stone-600 text-stone-400 cursor-not-allowed'
                        : currentUser.gold < item.cost
                        ? 'bg-red-900/50 text-red-300 cursor-not-allowed'
                        : 'bg-yellow-600 hover:bg-yellow-500 text-white'
                    }`}
                  >
                    {alreadyOwned ? 'Owned' : 'Buy'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Barracks;
