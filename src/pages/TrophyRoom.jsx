import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { ArrowLeft, Trophy, Lock, Coins, Star, Gift, Ticket } from 'lucide-react';

const TrophyRoom = () => {
  const navigate = useNavigate();
  const { currentUser, ACHIEVEMENTS, students, currentRafflePrize = "Mystery Box" } = useGame();
  const [activeFilter, setActiveFilter] = useState('all');

  const MAP_BG = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/worldmap4.png";

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center text-stone-200 font-['VT323'] relative">
        <img src={MAP_BG} alt="Background Map" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="relative z-10 text-center bg-black/70 p-8 rounded-xl border border-white/10">
          <p className="text-2xl">The Hall of Triumphs awaits, but you must be logged in.</p>
          <button onClick={() => navigate('/login')} className="mt-4 px-4 py-2 bg-yellow-600 text-black rounded font-['Press_Start_2P'] text-sm hover:bg-yellow-500">Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-stone-200 p-4 sm:p-6 md:p-8 relative">
      <img src={MAP_BG} alt="Background Map" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/80"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-stone-300 hover:text-white transition-colors font-['Press_Start_2P'] text-xs">
          <ArrowLeft size={16} /> Back to Map
        </button>

        <header className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl text-yellow-500 font-['Press_Start_2P'] drop-shadow-lg shadow-yellow-500/50">HALL OF TRIUMPHS</h1>
          <p className="text-stone-400 text-center max-w-2xl mx-auto mt-6 italic">
            Behold the greatest feats of the realm. Unlock real-world prizes and eternal glory.
          </p>
        </header>

        <div className="bg-indigo-900/80 backdrop-blur-md border border-indigo-400 px-6 py-6 rounded-xl shadow-[0_0_20px_rgba(99,102,241,0.3)] mb-6 mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col">
            <div className="text-indigo-300 font-bold tracking-widest text-sm uppercase mb-1">📅 MONTHLY GRAND RAFFLE</div>
            <div className="text-3xl md:text-4xl text-yellow-400 font-['Press_Start_2P'] drop-shadow-md mb-2">{currentRafflePrize}</div>
            <div className="text-stone-300 font-['VT323'] text-xl">Earn Raffle Tickets from Bounties and Achievements to increase your odds! Draw is at the end of the month.</div>
          </div>
          <div className="flex flex-col items-center justify-center bg-yellow-600/20 border-2 border-dashed border-yellow-500 rounded-lg p-4 min-w-[160px]">
            <Ticket size={32} className="text-yellow-400 mb-2" />
            <span className="text-white font-['VT323'] text-2xl">YOUR TICKETS</span>
            <span className="text-4xl font-bold text-yellow-400 font-mono">{currentUser?.raffleTickets || 0}</span>
          </div>
        </div>

        <section className="max-w-5xl mx-auto mb-10">
          <h2 className="text-2xl text-yellow-500 font-['Press_Start_2P'] mb-4">HOW TO WIN</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-900/30 border border-indigo-500/50 p-4 rounded-lg">
              🎟️ RAFFLE TICKETS: Earn these to enter the Grand Monthly Draw. More tickets = better odds!
            </div>
            <div className="bg-green-900/30 border border-green-500/50 p-4 rounded-lg">
              🎁 GUARANTEED: Complete the goal, get the prize. No luck required. Includes the Pity Timer safety net!
            </div>
            <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-lg">
              ⚡ SPEED RACE: Limited quantities! Be the first to claim. Latecomers get a massive Gold fallback reward.
            </div>
          </div>
        </section>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {[
            { id: 'all', label: 'All Trophies' },
            { id: 'earned', label: 'Earned' },
            { id: 'locked', label: 'Locked' },
            { id: 'prizes', label: 'Real-World Prizes' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={
                activeFilter === filter.id
                  ? "bg-yellow-600 text-white border-2 border-yellow-400 px-4 py-2 rounded-lg font-bold font-mono shadow-[0_0_10px_rgba(202,138,4,0.5)]"
                  : "bg-stone-800 text-stone-400 border border-stone-600 px-4 py-2 rounded-lg font-mono hover:bg-stone-700 transition-colors"
              }
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(ACHIEVEMENTS || []).filter(ach => {
            if (activeFilter === 'earned') return currentUser.unlockedAchievements?.includes(ach.id);
            if (activeFilter === 'locked') return !currentUser.unlockedAchievements?.includes(ach.id);
            if (activeFilter === 'prizes') return ach.realWorldPrize !== null && ach.realWorldPrize !== undefined;
            return true;
          }).map((achievement) => {
            const isFutureGated = achievement.unlockDate && new Date() < new Date(achievement.unlockDate);
            const isUnlocked = currentUser.unlockedAchievements?.includes(achievement.id);
            const claimedCount = students.filter(s => s.unlockedAchievements?.includes(achievement.id)).length;

            let displayTitle = achievement.title;
            let displayDesc = achievement.desc || achievement.description;

            return (
              <div 
                key={achievement.id} 
                className={`bg-stone-900 border-2 rounded-xl p-6 flex flex-col justify-between relative ${
                  isUnlocked 
                    ? 'border-yellow-500 shadow-2xl shadow-yellow-900/30 transition-all' 
                    : isFutureGated 
                      ? 'border-stone-700 opacity-50 grayscale pointer-events-none transition-all'
                      : 'border-stone-700 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300'
                }`}
              >
                {isFutureGated && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold font-mono whitespace-nowrap shadow-lg z-10">
                        ⏳ EVENT STARTS: {new Date(achievement.unlockDate).toLocaleDateString()}
                    </div>
                )}
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className={`text-xl font-['Press_Start_2P'] leading-tight pr-4 ${isUnlocked ? 'text-yellow-400' : 'text-stone-400'}`}>
                      {displayTitle}
                    </h2>
                    {isUnlocked ? (
                      <div className="flex flex-col items-center flex-shrink-0">
                        <Trophy className="text-yellow-400 mb-1 drop-shadow" size={28} />
                        <span className="text-[10px] font-mono text-green-400 bg-green-900/40 px-2 py-1 rounded border border-green-700">UNLOCKED</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center flex-shrink-0">
                        <Lock className="text-stone-500 mb-1" size={28} />
                        <span className="text-[10px] font-mono text-stone-400 bg-stone-800 px-2 py-1 rounded border border-stone-600">LOCKED</span>
                      </div>
                    )}
                  </div>

                  <p className="text-stone-300 font-['VT323'] text-2xl mb-6">{displayDesc}</p>
                </div>

                  <div className="space-y-4 relative">
                   <div className="flex flex-wrap gap-2">
                     {achievement.rewardXp > 0 && (
                        <div className="flex items-center gap-1 text-sm font-mono px-3 py-1 rounded bg-blue-900/30 text-blue-300 border border-blue-800">
                            <Star size={14} />
                            <span>{achievement.rewardXp} XP</span>
                        </div>
                     )}
                     {achievement.rewardTicket > 0 && (
                        <div className="flex items-center gap-1 text-sm font-mono px-3 py-1 rounded bg-purple-900/30 text-purple-300 border border-purple-800">
                            <Ticket size={14} />
                            <span>{achievement.rewardTicket} Ticket(s)</span>
                        </div>
                     )}
                  </div>

                  {achievement.limit && (
                      <div className="bg-orange-600/20 text-orange-400 font-bold border border-orange-500/50 p-2 rounded text-sm mb-2 flex flex-col">
                        <span>⚡ SPEED RACE: {claimedCount} / {achievement.limit} Claimed.</span>
                        {claimedCount >= achievement.limit && (
                            <span className="text-red-500 mt-1 uppercase text-xs">
                                ❌ PHYSICAL PRIZES EXHAUSTED. Backup Reward: {achievement.fallbackGold} Gold.
                            </span>
                        )}
                      </div>
                  )}

                  {achievement.realWorldPrize && (
                    <div className={`mt-4 p-4 rounded border ${isUnlocked ? 'bg-stone-800 border-yellow-700/50' : 'bg-stone-800/50 border-stone-700'}`}>
                      <div className={`flex items-center gap-2 mb-2 ${isUnlocked ? 'text-yellow-500' : 'text-stone-500'}`}>
                        <Gift size={18} />
                        <span className="font-bold font-mono text-sm uppercase tracking-wider">Real-World Prize</span>
                      </div>
                      <p className="text-stone-200 text-lg font-['VT323']">{achievement.realWorldPrize}</p>
                      
                      {isUnlocked && (
                        <div className="mt-3 text-green-400 text-sm font-bold bg-green-900/30 p-2 rounded border border-green-800/50 animate-pulse">
                          Prize Status: Check with Game Master!
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TrophyRoom;
