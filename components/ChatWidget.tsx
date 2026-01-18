import React, { useState } from 'react';
import { MessageCircle, X, HelpCircle, Bot, ArrowRight, ChevronRight } from 'lucide-react';
import { useApp } from '../store';

const ChatWidget = () => {
  const { siteSettings } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'home' | 'faq'>('home');
  
  const whatsappLink = siteSettings.socials?.whatsapp || `https://wa.me/${siteSettings.whatsappNumber.replace(/[^0-9]/g, '')}`;

  const faqList = [
      { q: "Məhsullar necə çatdırılır?", a: "Ödəniş təsdiqləndikdən dərhal sonra hesab və ya lisenziya açarı profilinizdə və ekranda görünür." },
      { q: "Zəmanət verirsiniz?", a: "Bəli, bütün məhsullarımıza rəsmi zəmanət verilir. Hər hansı problem olarsa, dərhal dəyişdirilir." },
      { q: "Ödəniş üsulları hansılardır?", a: "Bank kartı (Birbank) və ya M10/MilliÖn vasitəsilə ödəniş edə bilərsiniz." },
      { q: "Qaytarılma mümkündür?", a: "Rəqəmsal məhsullar (Key/Hesab) təbiəti etibarilə geri qaytarılmır, lakin işləmirsə dəyişdirilir." }
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      
      {isOpen && (
        <div className="mb-4 w-80 md:w-96 glass rounded-3xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[600px] border border-white/10">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent p-5 flex justify-between items-center text-white">
                <div>
                    <h3 className="font-bold text-lg">Müştəri Dəstəyi</h3>
                    <p className="text-white/80 text-xs">Sizə necə kömək edə bilərik?</p>
                </div>
                <div className="flex gap-2">
                    {view !== 'home' && (
                        <button onClick={() => setView('home')} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                           <ArrowRight className="w-4 h-4 rotate-180" />
                        </button>
                    )}
                    <button onClick={() => setIsOpen(false)} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-colors">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="bg-surface/95 backdrop-blur-xl flex-1 overflow-y-auto">
                {view === 'home' && (
                    <div className="p-6 space-y-4">
                        <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Bot className="w-8 h-8 text-primary" />
                            </div>
                            <p className="text-gray-300 text-sm">Salam! Hər hansı sualınız varsa, aşağıdakı seçimlərdən istifadə edin.</p>
                        </div>

                        <button 
                            onClick={() => window.open(whatsappLink, '_blank')}
                            className="w-full bg-[#25D366] text-white p-4 rounded-2xl flex items-center gap-4 hover:shadow-lg hover:shadow-green-500/20 transition-all group"
                        >
                            <div className="bg-white/20 p-2 rounded-full"><MessageCircle className="w-6 h-6" /></div>
                            <div className="text-left flex-1">
                                <p className="font-bold">WhatsApp</p>
                                <p className="text-xs opacity-90">Canlı Operatorla əlaqə</p>
                            </div>
                            <ArrowRight className="w-5 h-5 opacity-50 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button 
                            onClick={() => setView('faq')}
                            className="w-full bg-surfaceHighlight border border-white/5 text-white p-4 rounded-2xl flex items-center gap-4 hover:bg-white/5 transition-all group"
                        >
                            <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-full"><HelpCircle className="w-6 h-6 text-white" /></div>
                            <div className="text-left flex-1">
                                <p className="font-bold">Tez-tez Verilən Suallar</p>
                                <p className="text-xs text-gray-400">Ümumi məlumatlar</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-500 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}

                {view === 'faq' && (
                    <div className="p-4 space-y-3">
                        {faqList.map((item, idx) => (
                            <div key={idx} className="bg-white/5 border border-white/5 rounded-xl p-4">
                                <h4 className="font-bold text-white text-sm mb-2 flex items-start gap-2">
                                    <HelpCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                                    {item.q}
                                </h4>
                                <p className="text-gray-400 text-xs pl-6 leading-relaxed">
                                    {item.a}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div className="p-4 border-t border-white/5 bg-black/20 text-center">
                <p className="text-[10px] text-gray-500">DigiStore Support Team &copy; 2024</p>
            </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-primary to-accent text-white p-4 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all hover:scale-110"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
};

export default ChatWidget;