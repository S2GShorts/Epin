
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProductView from './pages/ProductView';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import Cart from './pages/Cart';
import News from './pages/News';
import BlogView from './pages/BlogView'; 
import Rules from './pages/Rules';
import Balance from './pages/Balance';
import Contact from './pages/Contact'; 
import CategoryPage from './pages/CategoryPage';
import { AppProvider, useApp } from './store';
import { MessageCircle, Instagram, Send, Smartphone } from 'lucide-react';
import ChatWidget from './components/ChatWidget';

const Footer = () => {
   const { siteSettings } = useApp();
   return (
     <footer className="bg-[#111] border-t border-[#333] py-12 mt-auto">
        <div className="max-w-[1400px] mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
                <div>
                    <h3 className="font-bold text-white mb-4">Populyar Kateqoriyalar</h3>
                    <ul className="space-y-2 text-gray-500">
                        <li>Pubg Mobile UC</li>
                        <li>Valorant VP</li>
                        <li>Mobile Legends Elmas</li>
                        <li>Free Fire Elmas</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-white mb-4">Kurumsal</h3>
                    <ul className="space-y-2 text-gray-500">
                        <li>Hakkımızda</li>
                        <li>Çözüm Merkezi</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-white mb-4">Sözleşmeler</h3>
                    <ul className="space-y-2 text-gray-500">
                        <li>Gizlilik Politikası</li>
                        <li>Kullanıcı Sözleşmesi</li>
                        <li>Satış Sözleşmesi</li>
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-white mb-4">Üyelik</h3>
                    <ul className="space-y-2 text-gray-500">
                        <li>Şifremi Unuttum</li>
                        <li>Yeni Üyelik</li>
                        <li>Bayi Başvurusu</li>
                    </ul>
                </div>
            </div>
            
            <div className="border-t border-[#333] mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-gray-600 text-xs">{siteSettings.footerText}</p>
                <div className="flex gap-4">
                    {/* Payment Icons Mock */}
                    <div className="flex gap-2 opacity-50">
                        <div className="w-10 h-6 bg-gray-700 rounded"></div>
                        <div className="w-10 h-6 bg-gray-700 rounded"></div>
                        <div className="w-10 h-6 bg-gray-700 rounded"></div>
                    </div>
                </div>
            </div>
        </div>
     </footer>
   )
}

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isAuthPage = location.pathname === '/auth';

  return (
    <div className="flex flex-col min-h-screen bg-[#1a1a1a]">
      {!isAdminPage && !isAuthPage && <Navbar />}
      <main className="flex-grow relative">
        {children}
      </main>
      {!isAdminPage && !isAuthPage && <Footer />}
      {!isAdminPage && !isAuthPage && <ChatWidget />}
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:id" element={<BlogView />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/balance" element={<Balance />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/product/:id" element={<ProductView />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
