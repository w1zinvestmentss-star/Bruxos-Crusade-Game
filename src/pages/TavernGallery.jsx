import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, ZoomIn } from 'lucide-react';
import { useGame } from '../context/GameContext';

const TavernGallery = () => {
  const navigate = useNavigate();
  const { gallerySubmissions } = useGame();
  const [selectedArt, setSelectedArt] = useState(null);

  const GALLERY_BG = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Tavern.Grove.Gallery.png";
  const CURATOR_NPC = "https://cdn.jsdelivr.net/gh/w1zinvestmentss-star/game-assets@main/The.Curator.png";

  return (
    <div className="min-h-screen text-stone-200 p-4 sm:p-6 md:p-8 relative overflow-x-hidden font-sans">
      {/* Background Image & Overlay */}
      <img src={GALLERY_BG} alt="Tavern Grove Gallery Background" className="absolute inset-0 w-full h-full object-cover z-0" />
      <div className="absolute inset-0 bg-black/80 z-10" />

      <div className="max-w-6xl mx-auto relative z-20">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/student-dashboard')} 
            className="flex items-center gap-2 text-stone-300 hover:text-white transition-colors font-['Press_Start_2P'] text-xs bg-black/60 px-4 py-2.5 border border-white/10 rounded-lg backdrop-blur-sm"
          >
            <ArrowLeft size={16}/> BACK
          </button>
          <h1 className="hidden md:block text-2xl text-yellow-500 font-['Press_Start_2P'] [text-shadow:_0_0_15px_rgba(234,179,8,0.4)]">
            Tavern Grove Gallery
          </h1>
        </div>

        {/* Curator Dialog Section */}
        <div className="bg-stone-900/90 border-2 border-yellow-600/70 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-[0_0_25px_rgba(0,0,0,0.8)] mb-10 backdrop-blur-md">
          <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0 bg-black/40 border-2 border-yellow-500/50 rounded-full overflow-hidden shadow-inner flex items-center justify-center">
            <img src={CURATOR_NPC} alt="The Curator" className="w-full h-full object-cover object-top scale-110" />
          </div>
          <div className="flex-grow space-y-2 text-center md:text-left">
            <h2 className="font-['Press_Start_2P'] text-yellow-400 text-sm">THE CURATOR</h2>
            <p className="font-['VT323'] text-stone-300 text-2xl leading-relaxed">
              "Welcome to the Tavern Grove Gallery, traveler! These boards exhibit the finest masterpieces crafted by our realm's apprentices. Admire their creativity, and let inspiration guide your own hand."
            </p>
          </div>
        </div>

        {/* Art Gallery Grid */}
        {gallerySubmissions.length === 0 ? (
          <div className="text-center p-12 bg-black/50 border border-white/10 rounded-xl backdrop-blur-sm">
            <p className="font-['VT323'] text-3xl text-stone-400">No masterpieces are currently pinned to the wall. Keep submitting Fine Arts reports!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {gallerySubmissions.map((sub) => (
              <div 
                key={sub.id} 
                className="group bg-black/60 backdrop-blur-md border-2 border-yellow-500/40 rounded-xl overflow-hidden shadow-[0_0_15px_rgba(250,204,21,0.1)] hover:border-yellow-400 hover:shadow-[0_0_25px_rgba(250,204,21,0.3)] transition-all flex flex-col"
              >
                {/* Artwork Card Image */}
                <div 
                  onClick={() => setSelectedArt(sub)}
                  className="relative aspect-[4/3] bg-stone-950 overflow-hidden cursor-pointer border-b-2 border-yellow-500/30"
                >
                  <img 
                    src={sub.proofContent} 
                    alt={`Artwork by ${sub.studentName}`} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="bg-black/80 px-4 py-2 rounded-lg border border-yellow-500/50 flex items-center gap-2 font-['Press_Start_2P'] text-[10px] text-yellow-400">
                      <ZoomIn size={14} /> VIEW DETAILS
                    </div>
                  </div>
                </div>

                {/* Artwork Metadata */}
                <div className="p-4 flex-grow flex flex-col justify-between space-y-2">
                  <div className="font-['Press_Start_2P'] text-yellow-400 text-xs tracking-wider line-clamp-1">
                    {sub.studentName}
                  </div>
                  <div className="flex justify-between items-center text-stone-400 text-xs font-mono">
                    <span>Pinned on:</span>
                    <span className="text-stone-300 font-semibold">{sub.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedArt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 backdrop-blur-2xl bg-black/90 animate-fadeIn">
          {/* Close Area */}
          <div className="absolute inset-0 cursor-zoom-out" onClick={() => setSelectedArt(null)} />
          
          <div className="relative z-10 w-full max-w-4xl flex flex-col items-center max-h-screen">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedArt(null)} 
              className="absolute -top-12 right-0 md:-right-12 text-stone-400 hover:text-white transition-colors bg-stone-900 border border-white/10 rounded-full p-2.5 shadow-lg"
            >
              <X size={24} />
            </button>

            {/* High Res Artwork */}
            <div className="bg-black border-4 border-yellow-500 shadow-[0_0_50px_rgba(234,179,8,0.3)] rounded-lg overflow-hidden max-h-[70vh] w-full flex items-center justify-center">
              <img 
                src={selectedArt.proofContent} 
                alt={`Artwork by ${selectedArt.studentName}`} 
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>

            {/* Artist Info */}
            <div className="mt-6 text-center space-y-1">
              <p className="font-['VT323'] text-yellow-400 text-5xl tracking-wide drop-shadow-md">
                {selectedArt.studentName}
              </p>
              <p className="text-stone-500 text-sm font-mono uppercase tracking-wider">
                Pinned: {selectedArt.timestamp}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TavernGallery;
