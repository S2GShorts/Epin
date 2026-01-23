
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, ShoppingCart, User as UserIcon, LogOut, Menu, X, ChevronDown, Wallet } from 'lucide-react';
import { useApp } from '../store';
import { INITIAL_CATEGORIES } from '../constants';

const Navbar = () => {
  const { user, isAuthenticated, cart, logout } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const featuredCategories = [
      { name: 'Tüm Ürünlər', id: 'all', color: 'bg-primary' },
      { name: 'Pubg Mobile', id: 'cat_pubg', color: 'bg-secondary' },
      { name: 'Valorant', id: 'cat_valorant', color: 'bg-secondary' },
      { name: 'Çeşidlər', id: 'cat_platform', color: 'bg-secondary' },
      { name: 'Hədiyyə Kartları', id: 'cat_gift', color: 'bg-secondary' },
      { name: 'S2G Merch', id: 'cat_merch', color: 'bg-secondary' }
  ];

  const handleLogout = () => {
      logout();
      navigate('/');
  };

  return (
    <div className="flex flex-col w-full z-50 relative">
      
      {/* 1. TOP NAVBAR (Black/Dark Grey) */}
      <div className="bg-[#1a1a1a] border-b border-[#333] h-20">
        <div className="max-w-[1400px] mx-auto px-4 h-full flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
             <span className="text-2xl font-black text-white tracking-tighter italic">
                S2G<span className="text-white">EPIN</span>
             </span>
          </Link>

          {/* Search Bar (Centered & Wide) */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-4">
             <div className="relative w-full">
                <input 
                   type="text" 
                   placeholder="Ürün, kategori veya marka ara..." 
                   className="w-full bg-[#262626] border border-[#404040] text-gray-300 text-sm rounded-md py-2.5 pl-4 pr-10 focus:outline-none focus:border-primary transition-colors"
                />
                <button className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white">
                   <Search className="w-4 h-4" />
                </button>
             </div>
          </div>

          {/* User Actions (Right Side) */}
          <div className="flex items-center gap-4 shrink-0">
              
              {/* Auth / Profile */}
              {isAuthenticated ? (
                  <div className="relative">
                      <button 
                        onClick={() => setProfileOpen(!profileOpen)}
                        className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                      >
                          <div className="flex flex-col text-right hidden sm:block">
                              <span className="text-xs text-gray-400">Giriş Yap</span>
                              <span className="text-sm font-bold text-white leading-none">{user?.name}</span>
                          </div>
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                              {user?.name.charAt(0)}
                          </div>
                          <ChevronDown className="w-3 h-3" />
                      </button>

                      {/* Dropdown */}
                      {profileOpen && (
                          <div className="absolute right-0 mt-3 w-56 bg-[#262626] border border-[#404040] rounded-lg shadow-xl py-2 z-50">
                              <div className="px-4 py-2 border-b border-[#404040] mb-2">
                                  <p className="text-xs text-gray-400">Balans</p>
                                  <div className="flex justify-between items-center">
                                      <span className="text-lg font-bold text-white">{user?.balance.toFixed(2)} ₼</span>
                                      <Link to="/balance" className="text-xs text-primary hover:underline">Artır</Link>
                                  </div>
                              </div>
                              <Link to="/profile" className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#333] hover:text-white">Profil</Link>
                              <Link to="/profile" onClick={() => setProfileOpen(false)} className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#333] hover:text-white">Sifarişlərim</Link>
                              {user?.role === 'admin' && (
                                  <Link to="/admin" className="block px-4 py-2 text-sm text-red-400 hover:bg-[#333]">Admin Panel</Link>
                              )}
                              <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#333] hover:text-white">Çıxış</button>
                          </div>
                      )}
                  </div>
              ) : (
                  <Link to="/auth" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                      <UserIcon className="w-5 h-5" />
                      <div className="flex flex-col text-left hidden sm:block">
                          <span className="text-xs text-gray-400">Giriş Yap</span>
                          <span className="text-sm font-bold text-white leading-none">və ya Üye Ol</span>
                      </div>
                  </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative group flex items-center gap-2">
                  <div className="relative">
                      <ShoppingCart className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors" />
                      {cart.length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                              {cart.length}
                          </span>
                      )}
                  </div>
              </Link>

              {/* Mobile Menu Toggle */}
              <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                  {isOpen ? <X /> : <Menu />}
              </button>
          </div>
        </div>
      </div>

      {/* 2. CATEGORY STRIP (Colored Buttons) */}
      <div className="bg-[#262626] border-b border-[#333]">
          <div className="max-w-[1400px] mx-auto px-4">
              <div className="flex gap-1 overflow-x-auto no-scrollbar py-2">
                  {featuredCategories.map((cat, idx) => (
                      <button
                        key={idx}
                        onClick={() => navigate(cat.id === 'all' ? '/' : `/category/${cat.id}`)}
                        className={`
                            px-6 py-2 text-xs font-bold text-white uppercase whitespace-nowrap first:rounded-l-md last:rounded-r-md md:rounded-none flex-1 md:flex-none text-center transition-opacity hover:opacity-90
                            ${cat.color}
                        `}
                        style={{ minWidth: '120px' }}
                      >
                          {cat.name}
                      </button>
                  ))}
              </div>
          </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
          <div className="md:hidden bg-[#1a1a1a] border-t border-[#333] absolute top-[130px] left-0 w-full z-40 p-4">
              <input 
                  type="text" 
                  placeholder="Axtar..." 
                  className="w-full bg-[#262626] border border-[#404040] text-white rounded p-3 mb-4"
              />
              <div className="grid grid-cols-2 gap-2">
                  {featuredCategories.map(cat => (
                      <button 
                        key={cat.id} 
                        onClick={() => { navigate(cat.id === 'all' ? '/' : `/category/${cat.id}`); setIsOpen(false); }}
                        className="bg-[#333] text-white p-3 rounded text-sm font-bold text-left"
                      >
                          {cat.name}
                      </button>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default Navbar;
