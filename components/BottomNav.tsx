
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, LayoutGrid, Wallet, User, MessageCircle } from 'lucide-react';
import { useApp } from '../store';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useApp();

  // Hide on Admin and Auth pages
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

  const navItems = [
      { icon: Home, label: 'Ana Səhifə', path: '/' },
      { icon: LayoutGrid, label: 'Kateqoriya', path: '/categories' },
      { icon: Wallet, label: 'Balans', path: '/balance', isAction: true },
      { icon: MessageCircle, label: 'Dəstək', path: '/contact' },
      { icon: User, label: 'Hesabım', action: handleProfileClick, path: '/profile' }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-surface/95 backdrop-blur-xl border-t border-white/10 z-[60] pb-safe pt-2">
        <div className="flex justify-around items-center px-2">
            {navItems.map((item, idx) => {
                const active = isActive(item.path);
                
                if (item.label === 'Balans') {
                    // Special Central Button for Balance
                    return (
                        <div key={idx} className="-mt-8">
                            <button 
                                onClick={() => navigate('/balance')}
                                className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.5)] border-4 border-background transform active:scale-95 transition-transform"
                            >
                                <Wallet className="w-6 h-6 text-white" />
                            </button>
                        </div>
                    );
                }

                return (
                    <button 
                        key={idx}
                        onClick={item.action || (() => navigate(item.path))}
                        className={`flex flex-col items-center gap-1 p-2 min-w-[60px] transition-colors ${active ? 'text-primary' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        <item.icon className={`w-6 h-6 ${active ? 'fill-current' : ''}`} />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </button>
                );
            })}
        </div>
    </div>
  );
};

export default BottomNav;
