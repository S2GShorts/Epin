
import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, ChevronDown, User as UserIcon, Heart, Search, LogOut, Plus, Menu, ShoppingCart, Flame, Sparkles, Gift } from 'lucide-react';
import { useApp } from '../store';
import SideDrawer from './SideDrawer';

const Navbar = () => {
  const { user, isAuthenticated, notifications, markNotificationRead, clearNotifications, logout, cart, isCartOpen, openCart } = useApp();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  
  // Scroll Logic for Sticky Background
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
        setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
      e.preventDefault();
      if(searchQuery.trim()) {
          navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
  };

  const myNotifications = notifications.filter(n => n.userId === user?.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const unreadCount = myNotifications.filter(n => !n.isRead).length;
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
      logout();
      navigate('/');
      setProfileOpen(false);
  };
  
  const handleNotificationClick = (id: string) => {
      markNotificationRead(id);
  };

  // Reusable Notification Dropdown
  const renderNotifications = () => (
      <div className="absolute right-0 mt-3 w-80 glass border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-slide-up origin-top-right bg-[#1a1d24]">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/5">
            <h4 className="text-sm font-bold text-white">Bildirişlər</h4>
            <button onClick={(e) => { e.stopPropagation(); clearNotifications(); }} className="text-xs text-primary hover:text-primary-dark font-bold">Təmizlə</button>
        </div>
        <div className="max-h-64 overflow-y-auto">
            {myNotifications.length === 0 ? <div className="p-8 text-center text-gray-500 text-sm">Bildiriş yoxdur.</div> : myNotifications.map(notif => (
                <div key={notif.id} onClick={() => handleNotificationClick(notif.id)} className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${!notif.isRead ? 'bg-primary/10 border-l-2 border-primary' : 'opacity-70'}`}>
                    <p className={`text-sm ${!notif.isRead ? 'font-bold text-white' : 'text-gray-400'}`}>{notif.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{notif.message}</p>
                </div>
            ))}
        </div>
    </div>
  );

  const navLinkClass = "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 text-gray-300 hover:text-white hover:bg-white/10";
  const activeNavLinkClass = "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold bg-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]";

  return (
    <>
    <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    
    <header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 
        ${scrolled 
            ? 'bg-[#0F1115]/95 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] pb-2 pt-2' 
            : 'bg-gradient-to-b from-[#0F1115] via-[#0F1115]/80 to-transparent pb-2 pt-4'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TOP ROW: Logo, Search, Actions */}
        <div className="flex items-center justify-between gap-4 md:gap-8">
            
            {/* Left: Logo */}
            <div className="flex items-center shrink-0">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">D</div>
                    <span className="text-2xl font-black text-white tracking-tight hidden sm:block">GAME<span className="text-primary font-light">PAY</span></span>
                </Link>
            </div>

            {/* Middle: Prominent Search Bar */}
            <div className="flex-1 max-w-2xl hidden md:block">
                <form onSubmit={handleSearch} className="relative w-full group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Oyun, kod, e-pin və ya məhsul axtar..." 
                        className="w-full bg-[#1a1d24]/80 backdrop-blur-md border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm text-white focus:bg-[#1a1d24] focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none placeholder-gray-500 shadow-inner"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                        <button type="submit" className="bg-primary hover:bg-primary-dark text-white px-4 py-1.5 rounded-full text-xs font-bold transition-colors shadow-lg shadow-primary/20">
                            Axtar
                        </button>
                    </div>
                </form>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 md:gap-4 shrink-0">
                
                {/* Cart Button (Always visible) */}
                <button onClick={openCart} className="relative p-2.5 bg-[#1a1d24]/80 hover:bg-white/10 rounded-full text-gray-300 hover:text-white transition-colors border border-white/5 backdrop-blur-md">
                    <ShoppingCart className="w-5 h-5" />
                    {cartItemsCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-lg border border-[#0F1115]">
                            {cartItemsCount}
                        </span>
                    )}
                </button>

                {isAuthenticated ? (
                    <>
                        {/* Balance Display */}
                        <div className="hidden sm:flex items-center gap-3 bg-[#1a1d24]/80 backdrop-blur-md border border-white/10 pl-4 pr-1 py-1 rounded-full">
                            <span className="text-sm font-mono font-bold text-white">{user?.balance.toFixed(2)} <span className="text-primary">₼</span></span>
                            <button onClick={() => navigate('/balance')} className="bg-primary hover:bg-primary-dark text-white p-1.5 rounded-full transition-colors shadow-lg shadow-primary/20">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Notifications */}
                        <div className="relative" ref={notifRef}>
                            <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2.5 bg-[#1a1d24]/80 hover:bg-white/10 rounded-full text-gray-300 hover:text-white transition-colors border border-white/5 backdrop-blur-md">
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]"></span>}
                            </button>
                            {notifOpen && renderNotifications()}
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative" ref={profileRef}>
                            <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-[#1a1d24]/80 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all">
                                <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg overflow-hidden">
                                    {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover"/> : user?.name.charAt(0).toUpperCase()}
                                </div>
                                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform hidden sm:block ${profileOpen ? 'rotate-180' : ''}`} />
                            </button>
                            {profileOpen && (
                                <div className="absolute right-0 mt-4 w-56 glass border border-white/10 rounded-2xl shadow-2xl p-2 z-50 animate-slide-up origin-top-right bg-[#1a1d24]">
                                    <div className="px-3 py-2 border-b border-white/5 mb-2 sm:hidden">
                                        <p className="text-xs text-gray-400">Balans</p>
                                        <p className="text-sm font-mono font-bold text-white">{user?.balance.toFixed(2)} ₼</p>
                                    </div>
                                    <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                        <UserIcon className="w-4 h-4" /> Profil
                                    </Link>
                                    <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                                        <Heart className="w-4 h-4" /> İstək siyahısı
                                    </Link>
                                    {user?.role === 'admin' && (
                                        <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                                            <Sparkles className="w-4 h-4" /> Admin Panel
                                        </Link>
                                    )}
                                    <div className="h-px bg-white/5 my-2"></div>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors">
                                        <LogOut className="w-4 h-4" /> Çıxış
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-2 md:gap-3">
                        <Link to="/auth" className="text-white font-bold hover:text-primary transition-colors text-sm px-2 md:px-4 py-2 hidden sm:block">Daxil Ol</Link>
                        <Link to="/auth" className="bg-white text-black px-4 md:px-6 py-2 md:py-2.5 rounded-full font-bold hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 text-xs md:text-sm">Qeydiyyat</Link>
                    </div>
                )}

                {/* Mobile Menu Toggle */}
                <button 
                    onClick={() => setDrawerOpen(true)} 
                    className="md:hidden text-gray-300 hover:text-white p-2 bg-[#1a1d24]/80 rounded-full border border-white/10"
                >
                    <Menu className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* Mobile Search Bar (Visible only on small screens) */}
        <div className="mt-3 md:hidden">
            <form onSubmit={handleSearch} className="relative w-full">
                <input 
                    type="text" 
                    placeholder="Məhsul axtar..." 
                    className="w-full bg-[#1a1d24]/90 backdrop-blur-xl border border-white/10 rounded-xl py-3 pl-11 pr-4 text-sm text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/30 outline-none shadow-inner transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-gray-400" />
            </form>
        </div>

        {/* BOTTOM ROW: Rounded Floating Navbar (Desktop) */}
        <div className={`hidden md:flex justify-center transition-all duration-300 ${scrolled ? 'mt-3' : 'mt-5'}`}>
            <div className="bg-[#1a1d24]/60 backdrop-blur-lg border border-white/10 rounded-full p-1.5 flex items-center gap-1 shadow-2xl">
                <Link to="/" className={location.pathname === '/' ? activeNavLinkClass : navLinkClass}>
                    Ana Səhifə
                </Link>
                <Link to="/categories" className={location.pathname === '/categories' ? activeNavLinkClass : navLinkClass}>
                    Kateqoriyalar
                </Link>
                <Link to="/giveaways" className={location.pathname === '/giveaways' ? activeNavLinkClass : navLinkClass}>
                    <Flame className="w-4 h-4 text-orange-500" /> Çəkilişlər
                </Link>
                <Link to="/news" className={location.pathname === '/news' ? activeNavLinkClass : navLinkClass}>
                    Xəbərlər
                </Link>
                <Link to="/page/haqqimizda" className={location.pathname === '/page/haqqimizda' ? activeNavLinkClass : navLinkClass}>
                    Haqqımızda
                </Link>
                <Link to="/contact" className={location.pathname === '/contact' ? activeNavLinkClass : navLinkClass}>
                    Əlaqə
                </Link>
            </div>
        </div>

      </div>
    </header>
    </>
  );
};

export default Navbar;
