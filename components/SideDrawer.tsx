
import React from 'react';
import { useApp } from '../store';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose }) => {
  const { categories } = useApp();

  const links = [
      { id: 'balance', name: 'Balans Artır', path: '/balance' },
      { id: 'giveaways', name: 'Çəkilişlər', path: '/giveaways' },
      { id: 'news', name: 'Xəbərlər', path: '/news' },
      { id: 'about', name: 'Haqqımızda', path: '/page/haqqimizda' },
      { id: 'rules', name: 'Qaydalar', path: '/rules' },
  ];

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 left-0 h-full w-[260px] bg-[#0F1115] border-r border-white/10 z-[70] transform transition-transform duration-300 ease-out shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Header Section */}
        <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/20">
            <span className="text-lg font-black text-white tracking-widest uppercase">MENYU</span>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
            </button>
        </div>

        {/* Simple Text Links Section */}
        <div className="flex-1 overflow-y-auto py-2">
            {links.map(link => (
                <Link 
                    key={link.id} 
                    to={link.path} 
                    onClick={onClose}
                    className="block px-6 py-4 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 border-b border-white/5 transition-colors"
                >
                    {link.name}
                </Link>
            ))}
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
