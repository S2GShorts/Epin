import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

const GetCode = () => {
    const [searchParams] = useSearchParams();
    const initialEmail = searchParams.get('email') || '';
    const [email, setEmail] = useState(initialEmail);
    const [code, setCode] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleGetCode = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;
        
        setLoading(true);
        // Simulate fetching a code from an email inbox
        setTimeout(() => {
            // Generate a random 6-digit code for demonstration
            const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
            setCode(randomCode);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gaming-dark py-10 px-4 flex items-center justify-center font-sans">
            <div className="max-w-md w-full">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="w-5 h-5" /> Geri qayıt
                </button>

                <div className="bg-gaming-card border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gaming-neon to-gaming-accent"></div>
                    
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-700 shadow-[0_0_15px_rgba(0,255,0,0.1)]">
                            <Mail className="w-8 h-8 text-gaming-neon" />
                        </div>
                        <h1 className="text-2xl font-bold text-white">Giriş Kodunu Əldə Et</h1>
                        <p className="text-gray-400 text-sm mt-2">Sizə təqdim edilən hesaba göndərilən təsdiq kodunu görmək üçün mail ünvanını daxil edin.</p>
                    </div>

                    {!code ? (
                        <form onSubmit={handleGetCode} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Mail Ünvanı</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-gaming-neon focus:border-transparent transition-all"
                                        placeholder="netflix@example.com"
                                    />
                                </div>
                            </div>
                            
                            <button 
                                type="submit" 
                                disabled={loading || !email}
                                className="w-full bg-gaming-neon hover:bg-[#00cc00] text-black font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <KeyRound className="w-5 h-5" /> Kodu Göstər
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center animate-fade-in">
                            <div className="bg-slate-900 border border-gray-700 rounded-2xl p-6 mb-6">
                                <p className="text-sm text-gray-400 mb-2">Sonuncu gələn kod:</p>
                                <div className="text-4xl font-mono font-bold text-gaming-neon tracking-widest">
                                    {code}
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-center gap-2 text-green-400 mb-6">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="text-sm font-medium">Kod uğurla əldə edildi</span>
                            </div>
                            
                            <button 
                                onClick={() => setCode(null)}
                                className="text-gray-400 hover:text-white text-sm underline transition-colors"
                            >
                                Başqa kod yoxla
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GetCode;
