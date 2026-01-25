
import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../store';
import { Order, OrderStatus, ProductType, Product, PromoCode, PaymentMethod, Blog, Agreement, HeroSlide, Page } from '../types';
import { 
  BarChart3, ShoppingBag, Package, Users, Settings, LogOut, 
  Plus, Trash2, Search, Edit3, X, Check, Eye, Wallet, 
  Database, Infinity, Menu, FileText, MessageSquare, CreditCard, Globe, Shield, Image as ImageIcon, Save, Star, Layout, Link as LinkIcon, Info, Tag, Upload, Monitor, File
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- REUSABLE IMAGE INPUT COMPONENT ---
const ImageInput = ({ label, value, onChange, placeholder = "Şəkil" }: { label: string, value: string, onChange: (val: string) => void, placeholder?: string }) => {
    const [mode, setMode] = useState<'url' | 'upload'>('url');
    const fileRef = useRef<HTMLInputElement>(null);

    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            onChange(url);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-xs uppercase font-bold text-gray-400">{label}</label>
            
            <div className="flex bg-surfaceHighlight rounded-t-xl overflow-hidden border border-white/10 border-b-0">
                <button 
                    onClick={() => setMode('url')} 
                    className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${mode === 'url' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    <LinkIcon className="w-3 h-3" /> Link (URL)
                </button>
                <button 
                    onClick={() => setMode('upload')} 
                    className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-2 transition-colors ${mode === 'upload' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                    <Monitor className="w-3 h-3" /> PC-dən Yüklə
                </button>
            </div>

            <div className="relative">
                {mode === 'url' ? (
                    <div className="relative">
                        <input 
                            className="w-full bg-surfaceHighlight border border-white/10 rounded-b-xl p-3 text-white focus:border-primary outline-none text-sm" 
                            placeholder="https://example.com/image.jpg" 
                            value={value.startsWith('blob:') ? '' : value} 
                            onChange={e => onChange(e.target.value)} 
                        />
                        {value && !value.startsWith('blob:') && (
                            <div className="absolute right-3 top-3 w-6 h-6 rounded overflow-hidden border border-white/20">
                                <img src={value} className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                ) : (
                    <div 
                        onClick={() => fileRef.current?.click()}
                        className="w-full bg-surfaceHighlight border-2 border-dashed border-white/10 rounded-b-xl h-24 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors group relative overflow-hidden"
                    >
                        {value ? (
                            <img src={value} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-30 transition-opacity" />
                        ) : null}
                        <div className="relative z-10 flex flex-col items-center">
                            <Upload className="w-5 h-5 text-gray-400 group-hover:text-white mb-1" />
                            <span className="text-xs text-gray-500 group-hover:text-white font-bold">Şəkil Seçmək üçün Toxun</span>
                        </div>
                        <input type="file" ref={fileRef} hidden accept="image/*" onChange={handleUpload} />
                    </div>
                )}
            </div>
            
            {value && (
                <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Şəkil seçildi
                </div>
            )}
        </div>
    );
};

const Admin = () => {
  const navigate = useNavigate();
  const { 
    user, orders, completeOrder, cancelOrder, products, 
    siteSettings, updateSiteSettings,
    categories, addCategory, deleteCategory, togglePopularCategory,
    addProduct, deleteProduct, togglePopularProduct,
    addAgreement, deleteAgreement,
    blogs, addBlog, deleteBlog,
    paymentMethods, addPaymentMethod, deletePaymentMethod, updatePaymentMethod,
    comments, deleteComment, logout,
    usersList, toggleUserBan, updateUserBalance,
    promoCodes, addPromoCode, deletePromoCode,
    stocks, addStock, deleteStock, activityLogs,
    heroSlides, addHeroSlide, deleteHeroSlide,
    pages, addPage, updatePage, deletePage
  } = useApp();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'stock' | 'users' | 'content' | 'pages' | 'finance' | 'settings' | 'design'>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // --- STATE MANAGEMENT ---
  
  // Orders
  const [deliveryModal, setDeliveryModal] = useState<{orderId: string, productTitle: string} | null>(null);
  const [deliveryContent, setDeliveryContent] = useState('');
  const [orderFilter, setOrderFilter] = useState<'ALL' | OrderStatus>('ALL');

  // Products
  const [productView, setProductView] = useState<'list' | 'add'>('list');
  const [productSearch, setProductSearch] = useState('');
  const [isEditingProd, setIsEditingProd] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    title: '', categoryId: '', subCategory: '', price: 0, costPrice: 0, discountPercent: 0, type: ProductType.LICENSE_KEY, image: '', description: '', requiresInput: false, durationDays: 0, isLifetime: false, isPopular: false
  });

  // Stock
  const [stockProduct, setStockProduct] = useState('');
  const [stockInput, setStockInput] = useState('');

  // Users
  const [userSearch, setUserSearch] = useState('');

  // Content (News/Rules)
  const [contentSubTab, setContentSubTab] = useState<'news' | 'comments'>('news');
  const [blogForm, setBlogForm] = useState<{title: string, content: string, image: string}>({ title: '', content: '', image: '' });

  // Pages
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [pageForm, setPageForm] = useState<Partial<Page>>({ title: '', slug: '', content: '', category: 'corporate', isActive: true });

  // Finance (Payments/Promo)
  const [financeSubTab, setFinanceSubTab] = useState<'payments' | 'promos'>('payments');
  const [payForm, setPayForm] = useState<Partial<PaymentMethod>>({ name: '', details: '', instructions: '', isActive: true, icon: 'credit-card' });
  const [promoForm, setPromoForm] = useState<{code: string, percent: number}>({ code: '', percent: 0 });

  // Settings (General/Categories)
  const [settingsSubTab, setSettingsSubTab] = useState<'general' | 'categories'>('general');
  const [generalForm, setGeneralForm] = useState(siteSettings);
  const [catForm, setCatForm] = useState<{name: string, image: string}>({ name: '', image: '' });

  // Design (Banner)
  const [slideForm, setSlideForm] = useState<Partial<HeroSlide>>({ image: '', title: '', subtitle: '', desc: '', btnText: 'İndi Al', link: '/' });

  if (!user || user.role !== 'admin') {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-red-500 font-bold text-2xl">
            Access Denied
        </div>
    );
  }

  // --- HELPERS ---
  
  const handleLogout = () => { logout(); navigate('/'); };

  const handleDelete = (type: string, id: string) => {
      if(window.confirm(`Silmək istədiyinizə əminsiniz?`)) {
          switch(type) {
              case 'product': deleteProduct(id); break;
              case 'category': deleteCategory(id); break;
              case 'promo': deletePromoCode(id); break;
              case 'comment': deleteComment(id); break;
              case 'stock': deleteStock(id); break;
              case 'blog': deleteBlog(id); break;
              case 'rule': deleteAgreement(id); break;
              case 'payment': deletePaymentMethod(id); break;
              case 'slide': deleteHeroSlide(id); break;
              case 'page': deletePage(id); break;
          }
      }
  };

  // Product Logic
  const handleEditProduct = (p: Product) => {
      setProductForm(p);
      setIsEditingProd(true);
      setProductView('add');
  };

  const handleSaveProduct = () => {
      if(!productForm.title || !productForm.price || !productForm.categoryId) {
          alert("Zəhmət olmasa vacib xanaları doldurun.");
          return;
      }
      const newProduct = { ...productForm, id: isEditingProd ? productForm.id! : `p-${Date.now()}` } as Product;
      if(isEditingProd) deleteProduct(productForm.id!);
      addProduct(newProduct);
      setProductView('list');
      setProductForm({ title: '', categoryId: '', subCategory: '', price: 0, costPrice: 0, discountPercent: 0, type: ProductType.LICENSE_KEY, image: '', description: '', requiresInput: false, durationDays: 0, isLifetime: false, isPopular: false });
      setIsEditingProd(false);
  };

  // Page Logic
  const handleSavePage = () => {
      if(!pageForm.title || !pageForm.content) return;
      const slug = pageForm.slug || pageForm.title!.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      
      const newPage: Page = {
          id: pageForm.id || `pg-${Date.now()}`,
          title: pageForm.title!,
          slug: slug,
          content: pageForm.content!,
          category: pageForm.category || 'corporate',
          isActive: pageForm.isActive ?? true
      };

      if (isEditingPage && pageForm.id) {
          updatePage(pageForm.id, newPage);
      } else {
          addPage(newPage);
      }
      setPageForm({ title: '', slug: '', content: '', category: 'corporate', isActive: true });
      setIsEditingPage(false);
  };

  const handleEditPage = (page: Page) => {
      setPageForm(page);
      setIsEditingPage(true);
  };

  // Stock Logic
  const handleAddStock = () => {
      if(!stockProduct || !stockInput) return;
      const codes = stockInput.split('\n').filter(c => c.trim().length > 0);
      addStock(stockProduct, codes);
      setStockInput('');
      alert(`${codes.length} ədəd kod əlavə olundu.`);
  };

  // Order Logic
  const confirmDelivery = () => {
      if(deliveryModal) {
          completeOrder(deliveryModal.orderId, deliveryContent);
          setDeliveryModal(null);
      }
  };

  // Settings Logic
  const saveGeneralSettings = () => {
      updateSiteSettings(generalForm);
      alert("Ayarlar yadda saxlanıldı!");
  };

  // Menu Items
  const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
      { id: 'orders', label: 'Sifarişlər', icon: ShoppingBag, badge: orders.filter(o => o.status === 'PENDING').length },
      { id: 'products', label: 'Məhsullar', icon: Package },
      { id: 'stock', label: 'Stok', icon: Database },
      { id: 'design', label: 'Dizayn & Banner', icon: Layout },
      { id: 'pages', label: 'Səhifələr (CMS)', icon: File },
      { id: 'users', label: 'İstifadəçilər', icon: Users },
      { id: 'content', label: 'Məzmun & Rəy', icon: FileText },
      { id: 'finance', label: 'Maliyyə', icon: CreditCard },
      { id: 'settings', label: 'Ümumi Ayarlar', icon: Settings },
  ];

  const filteredOrders = orders.filter(o => orderFilter === 'ALL' || o.status === orderFilter);

  return (
    <div className="min-h-screen bg-background text-white flex flex-col md:flex-row font-sans">
      
      {/* SIDEBAR */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 glass border-r border-white/10 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out flex flex-col`}>
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <span className="text-xl font-black text-white tracking-widest uppercase">Admin</span>
              <button onClick={() => setMobileMenuOpen(false)} className="md:hidden"><X /></button>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              {menuItems.map(item => (
                  <button
                      key={item.id}
                      onClick={() => { setActiveTab(item.id as any); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                  >
                      <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                      </div>
                      {item.badge ? <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{item.badge}</span> : null}
                  </button>
              ))}
          </nav>

          <div className="p-4 border-t border-white/10">
              <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-bold">
                  <LogOut className="w-5 h-5" /> Çıxış
              </button>
          </div>
      </div>

      {/* MOBILE HEADER */}
      <div className="md:hidden glass border-b border-white/10 p-4 flex justify-between items-center sticky top-0 z-40">
          <span className="font-bold text-lg">Admin Panel</span>
          <button onClick={() => setMobileMenuOpen(true)}><Menu /></button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto bg-background">
          
          {/* DASHBOARD & ORDERS SECTIONS (Unchanged content not shown for brevity, keeping only needed) */}
          {/* ... */}
          {activeTab === 'dashboard' && (
              <div className="space-y-6 animate-fade-in">
                  <h2 className="text-3xl font-bold mb-6">İdarə Paneli</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div className="glass-card p-6 rounded-2xl">
                          <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">Ümumi Gəlir</p>
                          <p className="text-3xl font-mono font-bold text-white mt-2">
                              {orders.filter(o => o.status === 'COMPLETED' && !o.items.some(i => i.type === ProductType.BALANCE)).reduce((acc, o) => acc + o.totalPrice, 0).toFixed(2)} ₼
                          </p>
                      </div>
                      {/* ... other stats */}
                  </div>
              </div>
          )}

          {/* ... other tabs ... */}

          {/* PAGES (CMS) */}
          {activeTab === 'pages' && (
              <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-2xl font-bold">Səhifə İdarəçiliyi (CMS)</h3>
                      <button onClick={() => { setIsEditingPage(false); setPageForm({ title: '', slug: '', content: '', category: 'corporate', isActive: true }); }} className="bg-white text-black px-6 py-2 rounded-xl font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                          <Plus className="w-4 h-4"/> Yeni Səhifə
                      </button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Form */}
                      <div className="lg:col-span-1 glass-card p-6 rounded-2xl border border-white/10 h-fit sticky top-4">
                          <h4 className="font-bold mb-4 text-primary">{isEditingPage ? 'Redaktə Et' : 'Yeni Səhifə Yarat'}</h4>
                          <div className="space-y-4">
                              <div>
                                  <label className="text-xs text-gray-500 uppercase font-bold block mb-1">Başlıq</label>
                                  <input className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white" value={pageForm.title} onChange={e => setPageForm({...pageForm, title: e.target.value})} />
                              </div>
                              <div>
                                  <label className="text-xs text-gray-500 uppercase font-bold block mb-1">Slug (URL)</label>
                                  <input className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white text-sm font-mono" placeholder="Auto-generated" value={pageForm.slug} onChange={e => setPageForm({...pageForm, slug: e.target.value})} />
                              </div>
                              <div>
                                  <label className="text-xs text-gray-500 uppercase font-bold block mb-1">Kateqoriya</label>
                                  <select className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white" value={pageForm.category} onChange={e => setPageForm({...pageForm, category: e.target.value as any})}>
                                      <option value="corporate">Haqqımızda / Korporativ</option>
                                      <option value="agreement">Sözləşmə / Qayda</option>
                                      <option value="help">Kömək / Üzvlük</option>
                                  </select>
                              </div>
                              <div>
                                  <label className="text-xs text-gray-500 uppercase font-bold block mb-1">Məzmun (HTML/Text)</label>
                                  <textarea className="w-full bg-surfaceHighlight border border-white/10 rounded-xl p-3 text-white h-64 font-mono text-sm" value={pageForm.content} onChange={e => setPageForm({...pageForm, content: e.target.value})}></textarea>
                              </div>
                              <button onClick={handleSavePage} className="w-full bg-primary hover:bg-primary-dark font-bold py-3 rounded-xl text-white transition-colors">Yadda Saxla</button>
                          </div>
                      </div>

                      {/* List */}
                      <div className="lg:col-span-2 space-y-4">
                          {pages.length === 0 ? <p className="text-gray-500 text-center py-10">Səhifə yoxdur.</p> : pages.map(page => (
                              <div key={page.id} className="glass-card p-5 rounded-xl border border-white/10 flex justify-between items-center group hover:border-primary/30 transition-all">
                                  <div>
                                      <h5 className="font-bold text-white text-lg">{page.title}</h5>
                                      <div className="flex gap-3 text-xs mt-1">
                                          <span className="bg-white/10 px-2 py-0.5 rounded text-gray-300 font-mono">/{page.slug}</span>
                                          <span className="text-gray-500 uppercase font-bold">{page.category}</span>
                                      </div>
                                  </div>
                                  <div className="flex gap-2">
                                      <button onClick={() => handleEditPage(page)} className="p-2 bg-white/10 hover:bg-white hover:text-black rounded-lg transition-colors"><Edit3 className="w-4 h-4"/></button>
                                      <button onClick={() => handleDelete('page', page.id)} className="p-2 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white rounded-lg transition-colors"><Trash2 className="w-4 h-4"/></button>
                                  </div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

      </div>
    </div>
  );
};

export default Admin;
