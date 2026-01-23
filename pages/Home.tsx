
import React, { useState } from 'react';
import { useApp } from '../store';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Gamepad2 } from 'lucide-react';

const Home = () => {
  const { categories } = useApp();
  const navigate = useNavigate();
  const [filterText, setFilterText] = useState('');

  // Hero Slider Mock Data
  const sliderImage = "https://images.hdqwalls.com/wallpapers/valorant-4k-gaming-new-2020-ix.jpg"; // Placeholder
  const rightBanners = [
     "https://wallpapers.com/images/hd/pubg-mobile-poster-j688p340057041a7.jpg",
     "https://images.hdqwalls.com/wallpapers/pubg-4k-game-2020-3s.jpg"
  ];

  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(filterText.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#1a1a1a] pb-20">
      
      {/* HERO SECTION */}
      <div className="max-w-[1400px] mx-auto px-4 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-auto lg:h-[350px]">
              {/* Main Slider */}
              <div className="lg:col-span-2 relative rounded-lg overflow-hidden group cursor-pointer border border-[#333]">
                  <img src="https://static.vecteezy.com/system/resources/previews/024/669/493/original/pubg-mobile-uc-1500-currency-png.png" className="w-full h-full object-cover bg-gradient-to-r from-purple-900 to-black" alt="Hero" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent flex flex-col justify-center px-10">
                      <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase mb-2">OCAK AYI <br/><span className="text-white">YILDIZ</span></h2>
                      <p className="text-white text-lg tracking-widest uppercase mb-4">ÜYELİK YENİLENDİ!</p>
                  </div>
              </div>

              {/* Right Banners */}
              <div className="hidden lg:flex flex-col gap-4 h-full">
                  <div className="flex-1 relative rounded-lg overflow-hidden border border-[#333] cursor-pointer group">
                      <img src="https://wallpapers.com/images/hd/valorant-jett-4k-game-2s.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Banner 1" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <h3 className="text-white font-black text-xl uppercase text-center border-2 border-white px-4 py-1 -rotate-3">VP SATIN AL</h3>
                      </div>
                  </div>
                  <div className="flex-1 relative rounded-lg overflow-hidden border border-[#333] cursor-pointer group">
                      <img src="https://w0.peakpx.com/wallpaper/419/50/HD-wallpaper-pubg-suit-guy-playerunknowns-battlegrounds-pubg.jpg" className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Banner 2" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                           <h3 className="text-white font-black text-xl uppercase text-center border-2 border-white px-4 py-1 -rotate-3">UC SATIN AL</h3>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* FILTER BAR */}
      <div className="max-w-[1400px] mx-auto px-4 mt-8 mb-6">
          <div className="bg-[#262626] border border-[#333] p-4 rounded-lg flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 w-full relative">
                  <input 
                    type="text" 
                    placeholder="kategori adı yazın" 
                    className="w-full bg-[#1a1a1a] border border-[#404040] text-gray-300 text-sm rounded-md py-3 pl-4 focus:outline-none focus:border-primary"
                    value={filterText}
                    onChange={e => setFilterText(e.target.value)}
                  />
              </div>
              <button className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-md flex items-center justify-center gap-2 transition-colors">
                  <Filter className="w-4 h-4" /> Filtrele
              </button>
          </div>
      </div>

      {/* GAME GRID (KATEGORİLER) */}
      <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredCategories.map(category => (
                  <div 
                    key={category.id}
                    onClick={() => navigate(`/category/${category.id}`)}
                    className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer bg-[#262626] border border-[#333] hover:border-primary transition-all duration-300"
                  >
                      {/* Background Image */}
                      <img 
                        src={category.image} 
                        alt={category.name} 
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" 
                      />
                      
                      {/* Overlay & Text */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-4">
                          <h3 className="text-white font-bold text-lg md:text-xl leading-tight text-center uppercase drop-shadow-md">
                              {category.name}
                          </h3>
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <span className="text-5xl font-black text-white/10 -rotate-12 select-none uppercase">EPIN</span>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* FOOTER STRIP (Language/Country) */}
      <div className="max-w-[1400px] mx-auto px-4 mt-12 text-right">
          <span className="text-gray-500 text-xs flex items-center justify-end gap-1">
             <span className="w-2 h-2 rounded-full bg-red-500"></span> Türkiye / AZN
          </span>
      </div>

    </div>
  );
};

export default Home;
