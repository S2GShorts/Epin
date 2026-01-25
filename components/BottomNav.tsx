
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, ShoppingCart, User, MessageCircle } from 'lucide-react';
import { useApp } from '../store';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, cart, openCart } = useApp();

  if (location.pathname.startsWith('/admin') || location.pathname === '/auth') {
      return null;
  }

  const isActive = (path: string) => location.pathname === path;

  const handleProfileClick = () => {
      if (user) {
          navigate('/profile');
      } else {
          navigate('/auth');
      }
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0F1115]/95 backdrop-blur-xl border-t border-white/10 z-[60] pb-safe pt-2 h-[80px] shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-5 h-full relative items-start pt-2">
            
            {/* 1. Home */}
            <button onClick={() => navigate('/')} className="flex flex-col items-center justify-center gap-1 group">
                <Home className={`w-6 h-6 transition-all duration-300 group-active:scale-90 ${isActive('/') ? 'text-primary fill-primary/20' : 'text-gray-500'}`} strokeWidth={isActive('/') ? 2.5 : 2} />
                <span className={`text-[10px] transition-colors ${isActive('/') ? 'text-white font-bold' : 'text-gray-500'}`}>Ana Səhifə</span>
            </button>

            {/* 2. Categories */}
            <button onClick={() => navigate('/categories')} className="flex flex-col items-center justify-center gap-1 group">
                <LayoutGrid className={`w-6 h-6 transition-all duration-300 group-active:scale-90 ${isActive('/categories') ? 'text-primary fill-primary/20' : 'text-gray-500'}`} strokeWidth={isActive('/categories') ? 2.5 : 2} />
                <span className={`text-[10px] transition-colors ${isActive('/categories') ? 'text-white font-bold' : 'text-gray-500'}`}>Kataloq</span>
            </button>

            {/* 3. CART (Enhanced Floating Effect) */}
            <div className="relative flex justify-center -top-8">
                <button 
                    onClick={openCart} 
                    className="absolute bg-gradient-to-tr from-primary to-secondary w-16 h-16 rounded-full border-[6px] border-[#0F1115] shadow-[0_0_20px_rgba(139,92,246,0.6)] transform transition-transform active:scale-90 hover:scale-110 flex items-center justify-center z-10 group"
                >
                    <ShoppingCart className="w-7 h-7 text-white drop-shadow-md" strokeWidth={2.5} />
                    {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0F1115] animate-bounce">
                            {cart.length}
                        </span>
                    )}
                    {/* Inner Pulse Ring */}
                    <div className="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-20"></div>
                </button>
                <span className="absolute -bottom-8 text-[11px] font-bold text-white drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]">Səbət</span>
            </div>

            {/* 4. Support */}
            <button onClick={() => navigate('/contact')} className="flex flex-col items-center justify-center gap-1 group">
                <MessageCircle className={`w-6 h-6 transition-all duration-300 group-active:scale-90 ${isActive('/contact') ? 'text-primary fill-primary/20' : 'text-gray-500'}`} strokeWidth={isActive('/contact') ? 2.5 : 2} />
                <span className={`text-[10px] transition-colors ${isActive('/contact') ? 'text-white font-bold' : 'text-gray-500'}`}>Dəstək</span>
            </button>

            {/* 5. Profile */}
            <button onClick={handleProfileClick} className="flex flex-col items-center justify-center gap-1 group">
                <User className={`w-6 h-6 transition-all duration-300 group-active:scale-90 ${isActive('/profile') ? 'text-primary fill-primary/20' : 'text-gray-500'}`} strokeWidth={isActive('/profile') ? 2.5 : 2} />
                <span className={`text-[10px] transition-colors ${isActive('/profile') ? 'text-white font-bold' : 'text-gray-500'}`}>Profil</span>
            </button>
        </div>
    </div>
  );
};

export default BottomNav;
