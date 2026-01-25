
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
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-[#0F1115]/95 backdrop-blur-xl border-t border-white/10 z-[60] pb-safe pt-2 h-[70px]">
        <div className="grid grid-cols-5 h-full relative">
            
            {/* 1. Home */}
            <button onClick={() => navigate('/')} className="flex flex-col items-center justify-center gap-1">
                <Home className={`w-6 h-6 transition-colors ${isActive('/') ? 'text-white' : 'text-gray-500'}`} strokeWidth={isActive('/') ? 2.5 : 2} />
                <span className={`text-[10px] ${isActive('/') ? 'text-white font-bold' : 'text-gray-500'}`}>Ana Səhifə</span>
            </button>

            {/* 2. Categories */}
            <button onClick={() => navigate('/categories')} className="flex flex-col items-center justify-center gap-1">
                <LayoutGrid className={`w-6 h-6 transition-colors ${isActive('/categories') ? 'text-white' : 'text-gray-500'}`} strokeWidth={isActive('/categories') ? 2.5 : 2} />
                <span className={`text-[10px] ${isActive('/categories') ? 'text-white font-bold' : 'text-gray-500'}`}>Kataloq</span>
            </button>

            {/* 3. CART (Floating Effect) */}
            <div className="relative flex justify-center">
                <button 
                    onClick={openCart} 
                    className="absolute -top-6 bg-gradient-to-tr from-primary to-secondary p-4 rounded-full border-[6px] border-[#0F1115] shadow-lg shadow-primary/40 transform transition-transform active:scale-95 flex items-center justify-center"
                >
                    <ShoppingCart className="w-6 h-6 text-white" strokeWidth={2.5} />
                    {cart.length > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0F1115]">
                            {cart.length}
                        </span>
                    )}
                </button>
                <span className="absolute bottom-2 text-[10px] font-bold text-gray-400">Səbət</span>
            </div>

            {/* 4. Support */}
            <button onClick={() => navigate('/contact')} className="flex flex-col items-center justify-center gap-1">
                <MessageCircle className={`w-6 h-6 transition-colors ${isActive('/contact') ? 'text-white' : 'text-gray-500'}`} strokeWidth={isActive('/contact') ? 2.5 : 2} />
                <span className={`text-[10px] ${isActive('/contact') ? 'text-white font-bold' : 'text-gray-500'}`}>Dəstək</span>
            </button>

            {/* 5. Profile */}
            <button onClick={handleProfileClick} className="flex flex-col items-center justify-center gap-1">
                <User className={`w-6 h-6 transition-colors ${isActive('/profile') ? 'text-white' : 'text-gray-500'}`} strokeWidth={isActive('/profile') ? 2.5 : 2} />
                <span className={`text-[10px] ${isActive('/profile') ? 'text-white font-bold' : 'text-gray-500'}`}>Profil</span>
            </button>
        </div>
    </div>
  );
};

export default BottomNav;
