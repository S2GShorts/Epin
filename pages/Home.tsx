import React, { useState, useEffect } from 'react';
import { useApp } from '../store';
import ProductCard from '../components/ProductCard';
import { Search, ChevronRight, ShieldCheck, Zap, Globe, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { products, categories } = useApp();
  const [activeCat, setActiveCat] = useState('All');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCat === 'All' || p.categoryId === activeCat;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-20 pt-16">
      
      {/* HERO SECTION */}
      <section className="relative w-full py-20 lg:py-32 px-4 overflow-hidden">
         <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/30 text-primary text-xs font-bold uppercase tracking-widest mb-6 animate-fade-in">
                 <Zap className="w-4 h-4 fill-current" /> Rəqəmsal Gələcək
             </div>
             
             <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-tight tracking-tight animate-slide-up">
                 Rəqəmsal <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary">Dünyanızı</span> <br/>
                 Kəşf Edin
             </h1>
             
             <p className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed animate-slide-up animation-delay-500">
                 Premium proqram təminatı, AI alətləri və oyun lisenziyaları üçün tək ünvan. Sürətli, təhlükəsiz və rəsmi.
             </p>

             {/* Search Bar */}
             <div className="w-full max-w-2xl relative group animate-slide-up animation-delay-700">
                 <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                 <div className="relative glass rounded-2xl flex items-center p-2">
                     <Search className="ml-4 text-gray-400 w-5 h-5" />
                     <input 
                         type="text" 
                         placeholder="Nə axtarırsınız? (Məs: ChatGPT, Windows 11...)" 
                         value={search}
                         onChange={(e) => setSearch(e.target.value)}
                         className="w-full bg-transparent border-none text-white px-4 py-3 focus:ring-0 outline-none text-base placeholder-gray-500"
                     />
                     <button className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition-colors shadow-lg">
                         Axtar
                     </button>
                 </div>
             </div>
         </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
          <div className="flex justify-between items-end mb-8">
              <div>
                  <h2 className="text-2xl font-bold text-white">Kateqoriyalar</h2>
                  <p className="text-gray-400 text-sm mt-1">Populyar bölmələrə göz atın</p>
              </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((cat, idx) => (
                  <div 
                      key={cat.id} 
                      onClick={() => navigate(`/category/${cat.id}`)}
                      className="group cursor-pointer relative overflow-hidden rounded-3xl h-40 glass-card"
                  >
                      {/* Background Image */}
                      <div className="absolute inset-0">
                          <img src={cat.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-500 group-hover:scale-105 transform" alt={cat.name} />
                          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/50 to-transparent"></div>
                      </div>
                      
                      <div className="absolute bottom-0 left-0 p-5 w-full">
                          <div className="flex justify-between items-center">
                              <h3 className="text-lg font-bold text-white">{cat.name}</h3>
                              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md group-hover:bg-primary group-hover:text-white transition-colors">
                                  <ChevronRight className="w-4 h-4" />
                              </div>
                          </div>
                      </div>
                  </div>
              ))}
          </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
               <h2 className="text-3xl font-bold text-white">Trend Məhsullar</h2>
               
               {/* Filter Pills */}
               <div className="flex gap-2 p-1 glass rounded-full overflow-x-auto max-w-full no-scrollbar">
                   <button
                       onClick={() => setActiveCat('All')}
                       className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCat === 'All' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                   >
                       Hamısı
                   </button>
                   {categories.map(cat => (
                       <button
                           key={cat.id}
                           onClick={() => setActiveCat(cat.id)}
                           className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCat === cat.id ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                       >
                           {cat.name}
                       </button>
                   ))}
               </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
              ))}
          </div>

          {filteredProducts.length === 0 && (
              <div className="text-center py-20 glass rounded-3xl border border-dashed border-white/10">
                  <p className="text-gray-500 text-lg">Axtarışa uyğun nəticə tapılmadı.</p>
              </div>
          )}
      </section>

      {/* FEATURES / TRUST */}
      <section className="max-w-7xl mx-auto px-4 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                  { icon: Zap, title: "Ani Çatdırılma", desc: "Ödənişdən dərhal sonra sistem avtomatik olaraq məhsulu təhvil verir." },
                  { icon: ShieldCheck, title: "Rəsmi Zəmanət", desc: "Bütün məhsullarımız rəsmi mənbələrdən əldə olunur və zəmanətlidir." },
                  { icon: Globe, title: "Qlobal Dəstək", desc: "İstənilən regiondan ödəniş qəbul edir və xidmət göstəririk." }
              ].map((item, idx) => (
                  <div key={idx} className="glass p-8 rounded-3xl hover:bg-white/5 transition-colors">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary mb-6">
                          <item.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
              ))}
          </div>
      </section>

    </div>
  );
};

export default Home;